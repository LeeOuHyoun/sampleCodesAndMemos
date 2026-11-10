# 서버 반영 절차 <Badge type="info" text="원본 분석" />

고친 것의 종류에 따라 서버에 해야 하는 일이 다릅니다. MQL 은 실행하면 끝나지만 UI 정의는 캐시를 비워야 보이고, 커스텀 Java 와 일부 properties 는 서버를 다시 시작해야 합니다. 이 페이지는 "무엇을 고쳤으면 무엇을 해야 하는가" 를 한곳에 모읍니다.

::: info 근거
mql/97.prod-mql, 98.migration, 99.config, 19.program 폴더. 3dspace/common/emxReloadCache.jsp 와 프로젝트가 복사해 고친 Reload Cache JSP. mql/06.command 의 Reload Cache command 정의. resources/custom/migration 의 실행 bat. resources/custom 의 properties 머리말과 메일 템플릿(.vm) 머리말. 3dspace/WEB-INF/web.xml. JPO 를 서버에 넣고 컴파일하는 명령은 소스 폴더에 예가 없습니다
:::

## 한눈에 보기

| 고친 것 | 반영 방법 | 재시작 |
| --- | --- | --- |
| 스키마 (attribute, type, policy, relationship, role) | MQL 실행 | 필요 없음 |
| UI 정의 (command, menu, table, webform, portal, channel) | MQL 실행 → [Reload Cache](#reload-cache) | 필요 없음 |
| 심볼릭 이름 등록 (`add property ... on program eServiceSchemaVariableMapping.tcl`) | MQL 실행 → [Reload Cache](#reload-cache) | 필요 없음 |
| 트리거 설정 객체 | MQL 실행 → [트리거 캐시 비우기](/trigger/register#_4-캐시) | 필요 없음 |
| JPO | 프로그램 코드를 넣고 컴파일 | 필요 없는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> |
| properties (문자열, 시스템 설정) | 파일 교체 → [Reload Cache](#reload-cache) | 캐시로 안 될 때 |
| 커스텀 Java (`src/`) | class 파일을 `WEB-INF/classes` 에 교체 | 필요 |
| 커스텀 리소스 (`resources/custom/`) | `WEB-INF/classes/custom` 에 교체 | [읽는 방식에 따라 다름](#커스텀-리소스-resources-custom) |
| `web.xml` (서블릿, 필터) | 파일 교체 | 필요 |
| 검색 설정 (`99.config`) | 서버별 설정 파일에 항목 추가 | [검색 설정](/schema/conventions#검색-설정-99-config) 참고 |

## MQL (스키마, UI 정의)

정의 파일은 `mql/` 의 폴더 번호 순서대로 실행합니다. 뒤 번호 폴더가 앞 번호 폴더의 객체를 참조하기 때문입니다 (type 은 attribute 를, policy 는 type 을, command 는 role 을 참조).

| 단계 | 내용 | 문서 |
| --- | --- | --- |
| 1. 개발 서버 | 폴더별 정의 파일을 실행. 다시 실행할 때는 파일 위쪽의 `#del ...` 주석을 풀어 지우고 다시 만들거나 `mod` 로 고침 | [본문 순서](/schema/conventions#본문-순서) |
| 2. 운영 반영 묶음 | `97.prod-mql/YYMM/DD.mql` 에 그날 반영할 명령을 폴더 번호 순서로 모음 | [운영 반영](/schema/conventions#운영-반영-97-prod-mql) |
| 3. 운영 서버 | 묶음 파일을 한 번 실행 | |
| 4. 캐시 | UI 정의나 심볼릭 이름이 바뀌었으면 Reload Cache | [아래](#reload-cache) |

- 묶음 파일 이름에 `-v1`, `-del` 같은 꼬리를 붙여 같은 날의 묶음을 나눕니다 (`08-기능-v1.mql`, `09-기능-v1-del.mql`). `-del` 은 되돌릴 때 쓰는 삭제 묶음으로 보입니다. <Badge type="danger" text="검증 필요" />
- 스키마(type, attribute, policy)는 MQL 실행 직후부터 새 정의가 적용됩니다. UI 정의는 서버가 캐시에 담아 두므로 Reload Cache 전에는 이전 화면이 보입니다.

### OOTB program 을 고칠 때

program 객체에는 JPO 뿐 아니라 CSS 같은 리소스도 들어 있습니다. `19.program` 폴더는 OOTB program (화면 스타일 CSS) 을 고치기 전에 같은 이름에 `_OOTB` 를 붙여 복사해 두고, 그 다음에 `code` 를 통째로 바꿉니다. 되돌릴 때는 복사본의 코드를 다시 넣습니다.

```text
copy prog emxSomeStyle.css emxSomeStyle.css_OOTB ;
mod prog emxSomeStyle.css code '...';
```

## JPO

JPO 소스는 파일이 아니라 **DB 의 program 객체** 에 들어 있습니다 ([JPO 개요](/jpo/#classname-class-이름)). `jpo/` 폴더의 `이름_mxJPO.java` 를 고친 뒤에는 그 코드를 program 객체에 넣고 컴파일해야 서버가 새 코드를 씁니다.

소스 폴더에는 이 단계의 스크립트가 없습니다. 일반적으로 알려진 MQL 은 아래 형태입니다. <Badge type="danger" text="검증 필요" />

```text
insert program [작업폴더]/jpo/MyPartUI_mxJPO.java;
compile program 'MyPartUI' force update;
```

- 컴파일 오류가 나면 이전 class 가 그대로 남는 것으로 보입니다. 컴파일 결과 메시지를 꼭 확인합니다. <Badge type="danger" text="검증 필요" />
- 다른 JPO 가 `${CLASS:MyPartUI}` 로 참조하는 JPO 를 고쳤으면 참조하는 쪽도 다시 컴파일해야 하는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- JPO 가 커스텀 Java (`src/`) 의 class 를 쓰면 그 class 가 먼저 서버에 있어야 컴파일됩니다. Java → JPO 순서로 반영합니다.
- 트리거에서 부르는 JPO 는 컴파일만 하면 됩니다. 설정 객체(프로그램 이름, 메서드 이름)를 바꿨을 때만 [트리거 캐시](/trigger/register#_4-캐시) 를 비웁니다.

## Reload Cache

UI 정의, 심볼릭 이름, properties 캐시를 비우는 관리자 기능입니다.

| 항목 | 내용 |
| --- | --- |
| JSP | `common/emxReloadCache.jsp` |
| 실행 권한 | `role_AdministrationManager`, `role_VPLMAdmin` 중 하나. 없으면 아무것도 하지 않고 끝남 (오류 없음) |
| 메뉴 | 관리자 툴바의 "Reload Cache" command (`href 'emxReloadCache.jsp'`, `Target Location` = `hiddenFrame`) |
| 성공 메시지 | `emxNavigator.UIMenu.ResetCacheMessage` ("UI Configuration Cache Reset Successfully...") |
| 실패 메시지 | `emxNavigator.UIMenu.ResetRemoteCacheFailedMessage` 뒤에 실패한 서버 이름 |

JSP 가 하는 일은 아래 순서입니다.

| 순서 | 호출 | 내용 |
| --- | --- | --- |
| 1 | `PropertyUtil.clearAdminPropertyCache()` | admin property (심볼릭 이름) 캐시 |
| 2 | `UICache.loadUserRoles(context, session)` | 세션에 담아 둔 현재 사용자의 역할 목록 다시 읽기 |
| 3 | `UICache.clearTenantCache(context)` | tenant 단위 캐시 (UI 정의, properties) |
| 4 | `CacheManager.resetRemoteAPPServerCache(context, pageContext)` | 다른 앱 서버의 캐시. 실패한 서버 이름 목록을 돌려줌 |
| 5 | `CacheManager.resetRMIServerCache(context)` | `emxReloadCacheServerInfo` JPO 에 적어 둔 RMI 서버의 캐시 |

::: warning 서버가 여러 대일 때
4, 5 번은 다른 서버 목록이 설정되어 있을 때만 동작합니다. 설정이 없으면 Reload Cache 는 **지금 접속한 서버 하나** 만 비웁니다. 로드 밸런서 뒤에 서버가 여러 대면 서버마다 실행하거나 서버 목록을 설정해야 하는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
:::

### 문자열 리소스까지 비우기

OOTB JSP 는 Java 의 `ResourceBundle` 이 자체적으로 들고 있는 캐시는 비우지 않습니다. 프로젝트는 JSP 를 복사해 아래 한 단계를 더 넣어 씁니다. `ResourceBundle.getBundle` 로 직접 읽는 properties 까지 재시작 없이 다시 읽게 하려는 것입니다.

```java
Class klass = ResourceBundle.getBundle("emxSystem").getClass().getSuperclass();
Field field = klass.getDeclaredField("cacheList");
field.setAccessible(true);
ConcurrentHashMap cache = (ConcurrentHashMap) field.get(null);
cache.clear();
```

- `cacheList` 는 `ResourceBundle` 의 `static` 필드라서 한 번 비우면 모든 번들의 캐시가 함께 비워집니다.
- JDK 내부 필드를 리플렉션으로 건드리는 방식입니다. JDK 버전이 바뀌면 필드 이름이나 접근 제한 때문에 실패할 수 있는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- `static` 변수에 이미 옮겨 담은 값은 이 방법으로도 바뀌지 않습니다 ([아래](#커스텀-리소스-resources-custom)).

## properties

| 파일 | 위치 | 반영 |
| --- | --- | --- |
| OOTB / 앱 properties (`emxSystem.properties`, `*StringResource*.properties`) | `<설치 폴더>/3DSpace/managed/properties/` | Reload Cache. 안 되면 재시작 |
| 커스텀 properties (`resources/custom/*.properties`) | `WEB-INF/classes/custom/` | [아래](#커스텀-리소스-resources-custom) |

자세한 내용은 [properties 개요](/properties/#고친-뒤-반영) 를 봅니다.

## 커스텀 Java (src/)

JPO 가 아닌 Java (REST 서비스, 스케줄러, 유틸, 메일 → [서버 Java](/server-java/)) 는 컴파일한 class 를 웹앱에 넣습니다.

```text
<TomEE>/
├─ lib/                          서버 공통 jar
└─ webapps/3dspace/
   └─ WEB-INF/
      ├─ web.xml
      ├─ lib/                    웹앱 jar (OOTB, 외부 라이브러리)
      └─ classes/
         ├─ com/example/...      src/ 를 컴파일한 class
         └─ custom/...           resources/custom/ 을 그대로 복사
```

- class 를 교체한 뒤에는 서버(웹앱)를 다시 시작합니다. 이미 로딩된 class 는 파일을 바꿔도 그대로 쓰입니다.
- 새 라이브러리(jar)가 필요하면 `WEB-INF/lib` 에 넣습니다. OOTB jar 와 같은 라이브러리의 다른 버전을 넣으면 충돌하므로 먼저 `WEB-INF/lib` 과 `<TomEE>/lib` 에 이미 있는지 확인합니다.
- `web.xml` 은 여러 조각 파일(`*.web.xml.part`)을 합쳐 만든 파일입니다 (조각마다 `WebAppMerger FRAGMENT` 주석이 남아 있음). 서블릿이나 필터를 직접 추가하면 제품 업데이트 때 다시 만들어지면서 사라질 수 있으므로 추가한 블록을 따로 보관해 둡니다. <Badge type="danger" text="검증 필요" />

## 커스텀 리소스 (resources/custom/)

`resources/custom/` 아래 파일은 `WEB-INF/classes/custom/` 에 같은 구조로 복사되고 Java 가 클래스패스에서 읽습니다.

| 파일 | 읽는 방식 | 고친 뒤 |
| --- | --- | --- |
| 설정 properties (접속 정보, 계정, 환경 이름) | class 의 `static { }` 블록에서 한 번 읽어 `Map` 에 담음 | 재시작 |
| 메일 문구 properties | class 로딩 때 한 번 읽음 | 재시작 |
| MyBatis 설정, mapper XML | `SqlSessionFactory` 를 처음 만들 때 한 번 읽음 | 재시작 |
| 메일 템플릿 (`.vm`) | 템플릿 엔진이 읽음 | 엔진 캐시 설정에 따름 <Badge type="danger" text="검증 필요" /> |

::: warning Reload Cache 로는 바뀌지 않습니다
`static` 블록에서 읽은 값은 class 가 다시 로딩될 때까지 그대로입니다. Reload Cache 를 눌러도, properties 파일을 바꿔도 반영되지 않습니다. 이런 properties 의 머리말에는 "수정 후 서버 재시작 필요" 라고 적어 둡니다.
:::

## 독립 실행 프로그램 (이관)

대량 데이터 이관처럼 서버 밖에서 따로 돌리는 Java 프로그램은 웹앱의 class 와 jar 를 클래스패스로 잡아 실행합니다.

```text
java -cp "<classes>;<WEB-INF/lib>\*;<TomEE/lib>\*" -Xmx1024m -Dfile.encoding=UTF-8 com.example.migration.MyMigrationApp <종류> "<입력 JSON 경로>" <abort|commit>
```

| 인자 | 내용 |
| --- | --- |
| 종류 | 이관할 데이터 종류 |
| 입력 JSON 경로 | 생략하면 `WEB-INF/classes/custom/migration/` 아래 기본 파일 |
| `abort` (기본) | 끝까지 실행한 뒤 트랜잭션을 되돌림. 오류만 확인하는 미리 돌려 보기 |
| `commit` | 실제로 저장 |

::: tip abort 로 먼저 돌립니다
실행 스크립트(bat)의 기본값이 `abort` 입니다. 인자를 빼먹고 실행해도 데이터가 바뀌지 않게 한 것입니다. 로그에서 오류가 없는 것을 확인한 뒤 `commit` 으로 다시 실행합니다.
:::

MQL 로 하는 이관은 [데이터 이관 (98.migration)](/schema/conventions#데이터-이관-98-migration) 을 봅니다. 이관 스크립트 머리말에도 "로드 후 UI 캐시 갱신 (emxReloadCache.jsp) 필요" 라고 적힌 것이 있습니다.

## 반영 순서

여러 종류를 함께 반영할 때는 참조되는 쪽을 먼저 넣습니다.

| 순서 | 대상 | 이유 |
| --- | --- | --- |
| 1 | 외부 DB 테이블 (`sql/`) | Java, JPO 가 조회함 |
| 2 | 커스텀 Java, 리소스, `web.xml` → 재시작 | JPO 가 이 class 를 import 함 |
| 3 | properties | UI 정의의 label 이 문자열 키를 참조함 |
| 4 | MQL (`97.prod-mql` 묶음) | 폴더 번호 순서 |
| 5 | JPO 넣기, 컴파일 | UI 정의, 트리거가 부름 |
| 6 | Reload Cache, 트리거 캐시 | |
| 7 | 화면에서 확인 | [트리거 확인하기](/trigger/register#_5-확인하기) |

이 순서는 참조 관계에서 정리한 것이고 원본에 반영 절차서가 있는 것은 아닙니다. <Badge type="danger" text="검증 필요" />
