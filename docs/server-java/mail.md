# 메일 <Badge type="info" text="원본 분석" />

서버 코드에서 HTML 메일을 보내는 방법입니다. 프로젝트는 OOTB 의 알림 기능을 쓰지 않고 SMTP 로 직접 보내는 class 를 두었습니다. 본문은 [Velocity](https://velocity.apache.org/) 템플릿으로 만들고, 문구는 properties 에 둡니다.

| 층 | class | 역할 |
| --- | --- | --- |
| 발송 | `MyMailApps` | 제목, 템플릿, 수신자를 받아 SMTP 로 보냄 |
| 본문 | `MyMailRenderer` | `.vm` 템플릿에 값을 채워 HTML 문자열을 만듦 |
| 수신자 | `MyMailRecipients` | 사용자 이름에서 메일 주소를 찾음 |
| 업무 메일 | `MyApprovalMailSender`, `MySystemMailSender` | 문구를 properties 에서 읽어 위 class 들을 부름 |

::: info 근거
프로젝트 `src/` 의 mail, email 패키지 (발송 class, 렌더러, 결재 메일 4 개, 시스템 메일 2 개, 수신자 1 개), `resources/custom/mail/*.vm`, 문구 properties, 그 javadoc 과 템플릿 머리말 주석. class 이름과 문구는 일반적인 이름으로 바꿔 적었습니다
:::

## 보내기

```java
Map<String, String> variables = new HashMap<>();
variables.put("SUBJECT", subject);
variables.put("HEADER", header);
variables.put("LINK", link);

new MyMailApps()
        .setSubject(subject)
        .setTemplate("custom/mail/MyApprovalMail.vm", variables)
        .addReceivers(MyMailRecipients.ofPersons(context, userNames))
        .addCCReceivers("pm@example.com", "PM")
        .doProcess();
```

| 메서드 | 내용 |
| --- | --- |
| `setSubject(subject)` | 제목. 필수 |
| `setTemplate(path, variables)` | 클래스패스 기준 템플릿 경로와 채울 값. 필수. 값은 `Map` 또는 `VelocityContext` |
| `setSender(address, name)` | 보내는 사람. 생략하면 설정의 기본 주소와 이름 |
| `addReceivers(address, name)` / `addReceivers(list)` | 받는 사람. 한 명 이상 필수 |
| `addCCReceivers(...)` | 참조 |
| `addBCCReceivers(...)` | 숨은 참조 |
| `doProcess()` | 검사하고 보냄 |

### doProcess 가 하는 일

| 순서 | 내용 |
| --- | --- |
| 1 | 템플릿, 수신자, 제목 중 빠진 것이 있으면 `IllegalStateException` |
| 2 | 주소 형식이 틀린 수신자는 경고 로그를 남기고 뺌 |
| 3 | 남은 받는 사람이 0 명이면 예외 |
| 4 | 템플릿으로 본문을 만들어 `message.setText(html, "UTF-8", "html")` |
| 5 | `Transport` 를 열어 보내고 `finally` 에서 닫음 |

```java
MimeMessage message = new MimeMessage(SESSION);
message.setFrom(new InternetAddress(sender, senderName, "UTF-8"));
message.setSubject(subject, "UTF-8");
message.setText(MyMailRenderer.render(templatePath, velocityContext), "UTF-8", "html");

Transport transport = SESSION.getTransport("smtp");
try {
    transport.connect();
    transport.sendMessage(message, message.getAllRecipients());
} finally {
    transport.close();
}
```

- `Session` 은 class 가 로딩될 때 한 번 만들어 함께 씁니다. SMTP 인증을 쓰는 설정일 때만 인증 정보를 넣습니다.
- 연결, 읽기, 쓰기 제한 시간을 각각 10 초로 줍니다 (`mail.smtp.connectiontimeout`, `mail.smtp.timeout`, `mail.smtp.writetimeout`). 제한 시간이 없으면 메일 서버가 응답하지 않을 때 업무 처리 스레드가 함께 멈춥니다.
- 주소의 일부가 틀려도 나머지 사람에게는 보냅니다.

### 발송 실패와 업무 처리

메일은 승인, 반려 같은 업무 처리의 끝에 붙습니다. 메일 서버가 잠깐 안 된다고 승인까지 실패하면 안 되므로, 발송 예외를 밖으로 던질지를 설정으로 고릅니다.

| `mail.exception` | 발송 실패 시 |
| --- | --- |
| `true` | 로그를 남기고 예외를 다시 던짐. 부른 쪽의 트랜잭션이 롤백될 수 있음 |
| 그 밖의 값 | 로그만 남기고 끝냄. 업무 처리는 계속됨 |

필수 값이 빠진 경우(위 표의 1, 3)는 발송 전의 검사라서 이 설정과 상관없이 예외가 나는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

## 수신자

```java
MailRecipient one = MyMailRecipients.ofPerson(context, "user01");
List<MailRecipient> many = MyMailRecipients.ofPersons(context, userNames);
```

- 사용자 이름으로 `PersonUtil.getEmail(context, userName)` 을 불러 주소를 얻고 표시 이름과 함께 담습니다.
- 메일 주소가 없는 사용자는 경고 로그만 남고, 발송 단계에서 주소 형식 검사에 걸려 빠집니다.
- 수신자를 구하는 데 `Context` 가 필요합니다. [스케줄러](/server-java/scheduler) 처럼 사용자 없이 도는 코드에서는 [직접 만든 Context](/server-java/#서버에서-context-만들기) 를 넘깁니다.

## 템플릿 (.vm)

| 항목 | 내용 |
| --- | --- |
| 소스 위치 | `resources/custom/mail/*.vm` |
| 서버 위치 | `WEB-INF/classes/custom/mail/*.vm` |
| 코드에서 쓰는 경로 | `custom/mail/MyApprovalMail.vm` (클래스패스 기준) |

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="padding:0; margin:0; background:#fff">
    <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <th style="padding:12px; border:1px solid #ccc; text-align:left">$!{SUBJECT}</th>
        </tr>
        <tr>
            <td style="padding:12px; border:1px solid #ccc">
                <p>$!{HEADER}</p>
                <p>$!{OWNER} / $!{DATE}</p>
                <a href="$!{LINK}">바로 가기</a>
            </td>
        </tr>
        <tr>
            <td style="padding:12px; color:#888">$!{FOOTER}</td>
        </tr>
    </table>
</body>
</html>
```

| 규칙 | 이유 |
| --- | --- |
| `$!{VAR}` 로 씀 | 값이 `null` 이면 빈 문자열이 됨. `$VAR` 나 `${VAR}` 로 쓰면 `$VAR` 글자가 그대로 메일에 나옴 |
| `table` 배치와 인라인 `style` | 메일 프로그램은 `<style>` 블록과 `flex`, `grid` 를 지원하지 않는 경우가 많음 |
| 문구는 템플릿에 두지 않음 | 템플릿은 틀만 담고 문구는 값으로 받음. 여러 업무가 한 템플릿을 같이 씀 |
| 주석은 `#* ... *#` | 렌더링 결과에 나오지 않음. 원본은 파일 머리에 변수 목록을 적어 둠 |

### 렌더러

```java
public class MyMailRenderer {

    private static final VelocityEngine ENGINE = new VelocityEngine();

    static {
        ENGINE.setProperty("resource.loaders", "classpath");
        ENGINE.setProperty("resource.loader.classpath.class", ClasspathResourceLoader.class.getName());
        ENGINE.setProperty("resource.default_encoding", "UTF-8");
        ENGINE.init();
    }

    public static String render(String templatePath, VelocityContext context) {
        Template template = ENGINE.getTemplate(templatePath, "UTF-8");
        StringWriter writer = new StringWriter();
        template.merge(context, writer);
        return writer.toString();
    }
}
```

::: warning Velocity 2.x 의 설정 키
위 키는 Velocity 2.x 의 이름입니다. 검색하면 많이 나오는 1.x 의 키(`resource.loader`, `classpath.resource.loader.class`)를 2.x 에 쓰면 오류 없이 무시되고, 클래스패스 로더가 등록되지 않아 `getTemplate()` 에서 템플릿을 찾지 못한다는 예외가 납니다. 원본 렌더러의 주석에 이 문제를 겪은 기록이 있습니다.
:::

## 문구 (properties)

제목과 본문 문구는 `resources/custom/Mail.properties` 에 둡니다.

```properties
ITEM.REQUEST.Subject = [PLM] %s requested approval of %s
ITEM.REQUEST.Header = Approval of %s was requested by %s.
ITEM.REQUEST.Footer = Open the link to approve or reject.
```

| 자리 | 값 |
| --- | --- |
| 업무 | 업무마다 하나 (`ITEM`, `DOCUMENT` ...) |
| 종류 | `REQUEST` 요청, `COMPLETE` 완료, `WITHDRAW` 회수, `REJECT` 반려 |
| 부분 | `Subject`, `Header`, `Footer` |

- 키는 `업무.종류.부분` 입니다. 업무 하나에 4 종류 × 3 부분 = 12 줄입니다.
- `%s` 는 `String.format` 으로 채웁니다. **넣는 순서가 부분마다 다릅니다.** 원본은 `Subject` 에 (기안자, 대상), `Header` 에 (대상, 기안자) 순서로 넣습니다. 문구를 고칠 때 `%s` 의 순서를 바꾸면 이름이 뒤바뀝니다.
- 한글 문구는 `\uXXXX` 로 바꿔 적습니다 ([파일 규칙](/properties/string-resource#파일-규칙)).
- 이 파일은 class 가 로딩될 때 `static` 블록에서 한 번 읽어 담아 둡니다. 문구를 고치면 서버를 다시 시작해야 합니다.

## 결재 메일

업무와 종류는 `enum` 입니다. 업무 `enum` 은 쓸 템플릿 경로를 가집니다.

```java
public enum MyApprovalMailDomain {

    ITEM("custom/mail/MyApprovalMail.vm"),
    DOCUMENT("custom/mail/MyApprovalMail.vm");

    private final String templatePath;

    MyApprovalMailDomain(String templatePath) {
        this.templatePath = templatePath;
    }

    public String getTemplatePath() {
        return templatePath;
    }
}
```

```java
MyApprovalMailSender.sendApprovalMail(
        MyApprovalMailDomain.ITEM,
        MyApprovalMailType.REQUEST,
        ownerFullName,
        itemLabel,
        ownerFullNameWithGroup,
        requestedDate,
        link,
        MyMailRecipients.ofPersons(context, approvers));
```

| 인자 | 쓰이는 곳 |
| --- | --- |
| 업무, 종류 | properties 키와 템플릿을 고름 |
| 기안자 이름, 대상 이름 | 제목과 머리 문구의 `%s` |
| 기안자 이름 (소속 포함) | 템플릿의 `OWNER` |
| 기안일 | `DATE` |
| 바로 가기 주소 | `LINK` |
| 수신자, 참조 (생략 가능) | 받는 사람 |

| 하려는 일 | 고칠 곳 |
| --- | --- |
| 업무 추가 | `enum` 상수 1 개 + properties 12 줄 |
| 업무마다 다른 본문 | 템플릿을 복사하고 그 업무 `enum` 의 경로만 바꿈 |
| 문구 변경 | properties 만 |

부르는 곳은 상태가 바뀌는 지점, 곧 승인 요청, 완료, 반려를 처리하는 JPO 나 [promote 트리거](/trigger/) 입니다.

## 시스템 오류 메일

[스케줄러 Job](/server-java/scheduler) 처럼 화면이 없는 처리가 실패하면 아무도 모릅니다. 그런 곳의 `catch` 에서 관리자에게 보내는 메일입니다.

```java
try {
    transfer(context);
} catch (Exception e) {
    MySystemMailSender.sendErrorMail(MySystemMailType.INTERFACE_ERROR, "Customer", e);
}
```

| 항목 | 내용 |
| --- | --- |
| 수신자 | properties 의 `SYSTEM.Receivers` (쉼표로 구분한 주소). `Context` 가 필요 없음 |
| 문구 키 | `SYSTEM.종류.부분` |
| 본문 | 인터페이스 이름, 서버 구분(`ENVIRONMENT`), 시각, 예외 메시지와 스택의 앞 12 줄 |
| 예외 | **밖으로 던지지 않음**. 오류를 알리다가 다시 오류가 나서 원래 처리를 가리지 않게 함 |
| 인자 | `(종류, 이름, Throwable)` 또는 `(종류, 이름, 메시지)` |

짧은 주기로 도는 Job 이 계속 실패하면 주기마다 메일이 갑니다. 원본에는 같은 오류를 묶거나 횟수를 제한하는 처리가 보이지 않습니다. <Badge type="danger" text="검증 필요" />

## SMTP 설정

[설정 로더](/server-java/#설정-로더) 가 읽는 properties 에 둡니다.

| 키 | 내용 |
| --- | --- |
| `ENCRYPTED_mail.smtp.host`, `ENCRYPTED_mail.smtp.port` | 메일 서버 |
| `ENCRYPTED_mail.smtp.auth` | 인증 사용 여부 |
| `ENCRYPTED_mail.smtp.id`, `ENCRYPTED_mail.smtp.pw` | 인증 계정 |
| `ENCRYPTED_mail.smtp.sender` | 기본 보내는 주소 |
| `mail.smtp.starttls.enable`, `ENCRYPTED_mail.smtp.ssl.trust` | TLS 설정. 원본은 이 값을 쓰는 코드를 막아 둠 |
| `mail.exception` | [발송 실패를 예외로 올릴지](#발송-실패와-업무-처리) |

## 서버에 넣기

| 항목 | 내용 |
| --- | --- |
| class | `WEB-INF/classes` 에 넣고 재시작 ([서버 반영 절차](/deploy/#커스텀-java-src)) |
| 템플릿, properties | `WEB-INF/classes/custom/` 아래로 복사 ([커스텀 리소스](/deploy/#커스텀-리소스-resources-custom)) |
| jar | Velocity 2.x 와 메일 API jar. 분석한 `WEB-INF/lib` 에는 없어서 실제 위치는 확인하지 못했습니다. <Badge type="danger" text="검증 필요" /> |
| 방화벽 | 3DSpace 서버에서 메일 서버의 SMTP 포트로 나가는 길 |

템플릿만 고친 경우에도 Velocity 가 읽은 템플릿을 기억하고 있으면 재시작해야 바뀝니다. 원본 설정에는 템플릿 캐시를 켜는 키가 없어서 바로 반영되는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
