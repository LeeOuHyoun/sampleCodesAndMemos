# 다국어, 예외, 로그 <Badge type="info" text="원본 분석" />

화면에 보이는 문구는 문자열 리소스 (`*StringResource*.properties`) 에서 읽고, 실패는 예외로 알리고, 추적은 서버 로그로 남깁니다.

::: info 근거
jpo 폴더 호출 수: `EnoviaResourceBundle.getProperty(` 3,862, `i18nNow.getI18nString(` 188, `EnoviaResourceBundle.getFrameworkStringResourceProperty(` 121, `printStackTrace()` 1,940, `System.out.println` 1,409, `DebugUtil.debug` 413. 시그니처는 xerinfra.jar `EnoviaResourceBundle`, `i18nNow`, `FrameworkException`, `DebugUtil`, eMatrixServletRMI.jar `MatrixException` 기준
:::

샘플: [XX_MyPartAction_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartAction_mxJPO.java) (FrameworkException 과 문자열 리소스 메시지), [MyPartTrigger_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TriggerSample/MyPartTrigger_mxJPO.java) (트리거 차단 메시지)

## 다국어

### 문자열 리소스

```java
String msg = EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource",
        context.getLocale(), "emxFramework.Common.NotUniqueMsg");
String label = EnoviaResourceBundle.getProperty(context, "Framework", "emxFramework.Basic.Policy", language);
String icon = EnoviaResourceBundle.getProperty(context, "emxFramework.smallIcon.type_Part");
```

| 형태 | 읽는 곳 | 예 |
| --- | --- | --- |
| `getProperty(context, 리소스파일, Locale, 키)` | 지정한 문자열 리소스 | `"emxEngineeringCentralStringResource"`, `context.getLocale()` |
| `getProperty(context, suite, 키, 언어)` | suite 이름으로 그 suite 의 문자열 리소스를 찾는 것으로 보입니다 | `"Framework"`, `"ProgramCentral"`, `"EngineeringCentral"` |
| `getProperty(context, 키)` | 시스템 설정 (`emxSystem.properties` 등). 언어 없음 | `"emxFramework.securityMode"` |
| `getFrameworkStringResourceProperty(context, 키, Locale)` | `emxFrameworkStringResource` 단축 | |

- 리소스 파일은 `properties/` 폴더에 언어별로 있습니다. 한국어는 `_ko.properties` (128 개) 이고 값은 `회` 같은 유니코드 이스케이프입니다.
- 키가 없으면 빈 값이나 키 그대로가 오는 것으로 보입니다. 생성 후처리는 `Message` 를 번역해 보고, 결과가 비면 원문을 그대로 씁니다.

### 스키마 이름 번역

타입, 속성, 범위 값, 상태 이름은 화면용 번역이 따로 있습니다.

| 메서드 | 예 |
| --- | --- |
| `EnoviaResourceBundle.getTypeI18NString(context, type, lang)` | `Part` → 부품 |
| `EnoviaResourceBundle.getAttributeI18NString(context, attr, lang)` | 속성 이름 |
| `EnoviaResourceBundle.getRangeI18NString(context, attr, value, lang)` | 속성 범위 값 하나 |
| `EnoviaResourceBundle.getAttrRangeI18NStringList(context, attr, values, lang)` | 범위 값 목록 (범위 function 에서 씀) |
| `EnoviaResourceBundle.getStateI18NString(context, policy, state, lang)` | 상태 이름 |
| `EnoviaResourceBundle.getAdminI18NString(context, "Type", name, lang)` | 관리 객체 종류를 지정 |

`i18nNow.getTypeI18NString(type, lang)` 처럼 context 없는 예전 static 메서드도 많이 남아 있습니다 (`i18nNow.getRangeI18NString` 93 건 등). 새 코드는 context 를 받는 `EnoviaResourceBundle` 쪽을 씁니다.

### 언어 얻기

| 상황 | 방법 |
| --- | --- |
| 표 열 function | `paramList.get("languageStr")` |
| 폼, 범위, 저장 | `paramMap.get("languageStr")` 또는 `requestMap.get("languageStr")` |
| 어디서나 | `context.getSession().getLanguage()`, `context.getLocale()` |

::: info 근거
xerinfra.jar `EnoviaResourceBundle` 의 `getProperty` 오버로드 4 개와 `get*I18NString` 메서드. 사용 예: emxECPartBase_mxJPO.java:10520-10530 (`getProperty(context, "emxEngineeringCentralStringResource", context.getLocale(), ...)`), `getProperty(context, "ProgramCentral", strKey, strLanguage)` 567 건, `getProperty(context,"emxFramework.smallIcon." + ...)`. common/emxCreateProcess.jsp:344-352
:::

## 예외

### 계층

| 클래스 | 상속 | 생성자 |
| --- | --- | --- |
| `matrix.util.MatrixException` | `java.lang.Exception` | `(String)`, `(Throwable)`, `(String, Throwable)`, `(MatrixException)` |
| `com.matrixone.apps.domain.util.FrameworkException` | `MatrixException` | `()`, `(String)`, `(Exception)` |

`DomainObject`, `MqlUtil`, `ContextUtil` 의 메서드는 대부분 `FrameworkException` 을 던집니다. JPO 메서드는 보통 `throws Exception` 으로 선언합니다.

### 사용자에게 오류 보여 주기

JPO 가 던진 예외 문구는 화면 처리 JSP 가 받아서 경고창으로 보여 줍니다.

```java
if (!canRelease) {
    String msg = EnoviaResourceBundle.getProperty(context, "emxMyAppStringResource",
            context.getLocale(), "emxMyApp.Error.CannotRelease");
    throw new FrameworkException(msg);
}
```

- `JPO.invoke` 를 거친 예외 문구에는 `System Error: #5000001: java.lang.Exception:` 같은 앞부분이 붙는 것으로 보입니다. 생성 / 편집 처리 JSP 는 이 앞부분을 잘라서 보여 줍니다.
- 이름 중복 같은 커널 오류는 코드 (`1500789`) 로 구분해 다른 문구로 바꿔 보여 줍니다.
- 트리거에서는 예외 대신 `notice` 와 반환값 `1` 로 막는 방식이 일반적입니다 ([트리거](/trigger/)).

### 많이 쓰는 형태

```java
try {
    ...
} catch (Exception e) {
    ContextUtil.abortTransaction(context);
    throw new FrameworkException(e);
}
```

::: warning 예외를 삼키지 않습니다
`catch (Exception e) { e.printStackTrace(); }` 로 끝내고 진행하면 화면에는 성공처럼 보입니다. 트랜잭션 안이었다면 커널이 "aborting" 상태가 되어 나중 commit 에서 엉뚱한 오류가 납니다 ([트랜잭션](/jpo/transaction-context#트랜잭션)). 로그를 남기더라도 다시 던집니다.
:::

::: warning 오류 문구에 HTML / 따옴표
경고창은 JavaScript 문자열로 들어갑니다. 직접 만든 JSP 에서 예외 문구를 `alert` 로 보여 줄 때는 `XSSUtil.encodeForJavaScript` 로 감쌉니다 (`emxAEFSubmitJPO.jsp` 가 그렇게 함). 따옴표나 줄바꿈이 들어간 문구가 스크립트를 깨뜨리지 않습니다.
:::

::: info 근거
xerinfra.jar `FrameworkException` (상위 `matrix.util.MatrixException`), eMatrixServletRMI.jar `MatrixException` (상위 `java.lang.Exception`). common/emxCreateProcess.jsp:222-258 (`1500789` → `emxFramework.Common.NotUniqueMsg`, `System Error: #5000001:` 잘라 내기, `java.lang.Exception:` 제거), common/emxFormEditProcess.jsp (`System Error: #5000001: java.lang.Exception:`), common/emxAEFSubmitJPO.jsp:40-50
:::

## 로그

| 방법 | 건수 | 출력 |
| --- | --- | --- |
| `e.printStackTrace()` | 1,940 | 서버 표준 출력 / 오류 로그 |
| `System.out.println` | 1,409 | 서버 표준 출력 로그 |
| `DebugUtil.debug(msg)` | 413 | `DebugUtil.setDebug(true)` 일 때만 표준 출력 |
| slf4j `Logger` / `XLogger` | 25 개 파일 (import 기준) | 서버의 로그 설정을 따름 |

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class XX_MyPartUI_mxJPO {
    private static final Logger LOG = LoggerFactory.getLogger(XX_MyPartUI_mxJPO.class);
}
```

- OOTB 일부 (`ENOGLSFormulationTypeUIBase` 등) 와 사용자 정의 JPO 는 slf4j 를 씁니다. 서버에 slf4j 가 들어 있어 따로 jar 를 넣지 않아도 되는 것으로 보입니다.
- `System.out.println` 은 레벨 구분 없이 항상 찍혀서 운영 로그가 커집니다. 새 코드는 slf4j 를 씁니다.
- 열 function 처럼 행 수만큼 도는 곳에서 행마다 로그를 찍지 않습니다.

::: info 근거
xerinfra.jar `DebugUtil.debug` 바이트코드 (`_debug` 확인 후 `System.out.println`). ENOGLSFormulationTypeUIBase_mxJPO.java:28-32 (`XLoggerFactory.getXLogger`). `import org.slf4j.Logger` 17 개 파일, `org.slf4j.ext.XLogger` 8 개 파일
:::
