# 서버 Java 개요 <Badge type="info" text="원본 분석" />

JPO 는 화면과 트리거가 부르는 코드입니다. 화면이 부르지 않는 일, 곧 **위젯이 부르는 REST 주소, 정해진 시각에 도는 배치, 외부 DB 조회, 메일 발송** 은 JPO 밖의 일반 Java class 로 만들어 웹앱에 넣습니다. 이 섹션은 그 class 들을 만드는 방법을 정리합니다.

::: info 근거
프로젝트의 `src/` 폴더 (rest, scheduler, mybatis, mail, util 패키지) 와 `resources/custom/` 폴더 (properties, MyBatis 설정, mapper, 메일 템플릿). OOTB 가 아닌 프로젝트 코드이므로 이름과 값은 모두 일반적인 이름으로 바꿔 적었습니다
:::

## JPO 와 무엇이 다른가

| | JPO | 서버 Java |
| --- | --- | --- |
| 소스 위치 | `jpo/이름_mxJPO.java` | `src/com/example/...` |
| 저장 | DB 의 program 객체 | 웹앱의 `WEB-INF/classes` |
| 반영 | 넣고 컴파일 | class 교체 후 재시작 ([서버 반영 절차](/deploy/#커스텀-java-src)) |
| 부르는 곳 | UI 정의, 트리거, `JPO.invoke` | REST 요청, 스케줄러, JPO 의 `import` |
| `Context` | 호출하는 쪽이 넘겨줌 | REST 는 요청에서 얻고, 배치는 [직접 만듦](#서버에서-context-만들기) |

두 쪽은 서로 부릅니다. 서버 Java 는 `JPO.invoke` 로 JPO 를 부르고, JPO 는 서버 Java 의 유틸 class 를 `import` 해서 씁니다. 프로젝트 코드는 **업무 로직을 JPO 에 두고** REST 서비스와 스케줄러 Job 은 Context 를 준비해 JPO 를 부르는 얇은 껍데기로 만듭니다. 업무 로직을 고칠 때 재시작 없이 JPO 컴파일만으로 반영하려는 구조입니다.

## 폴더 구성

```text
src/com/example/
├─ rest/                 REST 서비스 (Modeler, Service)
├─ scheduler/job/        스케줄러 서블릿, Job
├─ mybatis/              mapper (query_*.xml)
├─ mybatis/util/         SqlSession 관리, 암호화 DataSource
├─ apps/mail/            메일 보내기 (결재 메일, 시스템 오류 메일)
├─ apps/util/            Context 만들기, 요청 보관 필터, 암호화, 로그 등 유틸
├─ legacy/framework/     설정 로더, SMTP 발송 class
└─ migration/            독립 실행 이관 프로그램

resources/custom/
├─ MyConfig.properties   접속 정보, 계정, 환경 이름
├─ Mail.properties       메일 문구
├─ db/mybatis-config.xml MyBatis 설정
├─ mail/*.vm             메일 템플릿
└─ migration/            이관 입력 파일, 실행 스크립트
```

## 설정 로더

접속 정보와 계정은 코드에 적지 않고 properties 한 파일에 모읍니다. class 하나가 `static` 블록에서 읽어 `Map` 에 담아 두고, 다른 class 는 그 `Map` 에서 꺼내 씁니다.

```java
public class MyConfig {

    public static final Map<String, String> values = new HashMap<>();

    static {
        ResourceBundle bundle = ResourceBundle.getBundle("custom.MyConfig");
        for (String key : bundle.keySet()) {
            try {
                String value = bundle.getString(key);
                values.put(key, key.startsWith("ENCRYPTED_") ? MyEncryptUtil.decrypt(value) : value);
            } catch (Exception e) {
                logger.error("config load failed - key: {}", key, e);
            }
        }
    }
}
```

| 규칙 | 내용 |
| --- | --- |
| `ENCRYPTED_` 접두어 | 값이 암호문인 키. 읽을 때 복호화해서 담음. 꺼낼 때도 접두어를 붙인 이름으로 꺼냄 |
| 키 하나씩 `try` | 한 키의 복호화가 실패해도 나머지 키는 읽음 |
| `ENVIRONMENT` | 서버 구분 (개발 / 운영). MyBatis 의 `<environment id>` 선택에 씀 ([외부 DB](/server-java/external-db#sqlsession-얻기)) |
| 기본 보안 컨텍스트 | 배치가 쓸 `ctx::역할.회사.협업공간` 문자열 |

키 묶음은 서비스 주소, 인터페이스 계정, 환경 이름, 기본 보안 컨텍스트, SMTP 설정입니다.

::: warning 고친 뒤 재시작
`static` 블록은 class 가 처음 로딩될 때 한 번만 실행됩니다. 값을 고치면 서버를 다시 시작해야 합니다. [Reload Cache](/deploy/#reload-cache) 로는 바뀌지 않습니다.
:::

## 서버에서 Context 만들기

스케줄러 Job 이나 외부 시스템이 부르는 REST 주소에는 로그인 사용자가 없습니다. 이때는 인터페이스 계정으로 `Context` 를 직접 만듭니다.

```java
public static Context getContext(String user, String password, String securityContext) throws Exception {
    Context context = new Context("localhost");
    context.setLocale(Locale.US);
    context.connect();
    context.resetContext(user, password, null);
    if (securityContext != null) {
        context.resetRole(securityContext);
    } else if (PersonUtil.isValidSecurityContext(context, DEFAULT_SECURITY_CONTEXT)) {
        context.resetRole(DEFAULT_SECURITY_CONTEXT);
    }
    return context;
}
```

| 호출 | 내용 |
| --- | --- |
| `new Context("localhost")` | 같은 서버 프로세스 안에서 쓰는 Context |
| `context.connect()` | 연결 |
| `context.resetContext(user, password, vault)` | 사용자 지정. vault 는 `null` |
| `context.resetRole("ctx::역할.회사.협업공간")` | 보안 컨텍스트 지정 ([형식](/rest-api/security-context#형식)) |
| `PersonUtil.isValidSecurityContext(context, sc)` | 그 사용자가 쓸 수 있는 보안 컨텍스트인지 확인 |
| `context.shutdown()` / `context.disconnect()` | 다 쓴 뒤 닫기. `finally` 에서 부름 |

```java
Context context = null;
try {
    context = MyDomainUtil.getContext();
    JPO.invoke(context, "MyInterfaceJob", null, "transferCustomer", JPO.packArgs(new HashMap<>()));
} finally {
    if (context != null) {
        context.shutdown();
    }
}
```

- 직접 만든 Context 는 직접 닫습니다. 닫지 않으면 서버에 세션이 남는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- 보안 컨텍스트를 지정하지 않으면 그 계정의 기본값으로 실행됩니다. 객체를 만드는 배치는 소유 조직과 협업공간이 여기서 정해지므로 반드시 지정합니다. <Badge type="danger" text="검증 필요" />
- 로그인 사용자가 있는 REST 요청에서는 이 방법을 쓰지 않고 [요청에서 Context 를 얻습니다](/server-java/rest-service#로그인-사용자의-context). 이력에 실제 사용자가 남아야 하기 때문입니다.
- JPO 안에서 잠깐 권한만 높일 때는 Context 를 새로 만들지 않고 [pushContext](/jpo/transaction-context#슈퍼유저로-바꾸기-pushcontext) 를 씁니다.

## JPO 에서 요청 객체 쓰기

JPO 메서드는 `Context` 와 `String[]` 만 받으므로 `HttpServletRequest` 에 닿을 수 없습니다. 프로젝트는 서블릿 `Filter` 가 요청을 `ThreadLocal` 에 담아 두고, 같은 요청을 처리하는 동안 어디서든 꺼내 쓰게 합니다.

```java
public class MyRequestContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {
            MyRequestContext.setRequest((HttpServletRequest) request);
            chain.doFilter(request, response);
        } finally {
            MyRequestContext.clear();
        }
    }
}
```

- 꺼낼 때는 `MyRequestContext.getRequest()` 를 부릅니다.
- `finally` 의 `clear()` 가 빠지면 스레드 풀이 스레드를 재사용할 때 이전 요청이 남습니다.
- 필터는 `web.xml` 에 `<filter>` 와 `<filter-mapping>` (`<url-pattern>/*</url-pattern>`) 으로 등록해야 동작합니다. 분석한 `web.xml` 에는 이 등록이 없어서 실제 등록 형태는 확인하지 못했습니다. <Badge type="danger" text="검증 필요" />
- 스케줄러 Job 처럼 요청 없이 도는 코드에서는 꺼낸 값이 `null` 입니다.

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [커스텀 REST 서비스](/server-java/rest-service) | 위젯이나 외부 시스템이 부를 주소 만들기. `ModelerBase`, `RestService` |
| [스케줄러](/server-java/scheduler) | 정해진 시각에 JPO 실행. Quartz, cron 설정 |
| [외부 DB (MyBatis)](/server-java/external-db) | 인터페이스 테이블 조회와 상태 갱신 |
| [메일](/server-java/mail) | 템플릿 메일 보내기, 오류 알림 메일 |

Slack 알림, 독립 실행 이관 프로그램의 내부는 아직 분석하지 않았습니다. 이관 프로그램 실행 방법만 [서버 반영 절차](/deploy/#독립-실행-프로그램-이관) 에 있습니다.
