# 문자열 리소스 (다국어) <Badge type="info" text="원본 분석" />

화면 글자는 `...StringResource.properties` 파일에서 키로 찾아 옵니다. 스키마 이름(type, 속성, state)은 영어 그대로 저장되고, 화면에 보이는 이름만 이 파일에서 바꿉니다.

::: info 근거
`properties/emxFrameworkStringResource.properties` (55,105 줄), `_en` (53,462 줄), `_ko` (54,492 줄), `_koNative` (52,850 줄), `_kernel`, 프로젝트 앱의 `...StringResource.properties` / `_ko`, `emxSystem.properties` 의 `eServiceSuite*.StringResourceFileId` (189 개), `emxFrameworkCustom.properties`. 코드 쪽: `jpo/` 의 `EnoviaResourceBundle.getProperty` 호출(번들 이름별 건수), `i18nNow.get*I18NString` 호출, `jpo/emxRouteBase_mxJPO.java`, `jpo/emxTriggerValidationBase_mxJPO.java`, `3dspace/common/*.jsp` 의 `emxUtil:localize` / `emxUtil:i18n` 태그, `mql/06.command` ~ `09.webform` 의 `Registered Suite` 설정
:::

## 파일 규칙

| 파일 | 형식 | 쓰임 |
| --- | --- | --- |
| `이름.properties` | 영어, ASCII | 기본. 언어 파일에 키가 없을 때 여기서 찾음 |
| `이름_ko.properties` | 한글을 `판단` 처럼 적은 ASCII | 실행 때 읽는 한국어 파일 |
| `이름_koNative.properties` | CP949 로 저장한 한글 원문 | 사람이 읽는 원본으로 보입니다. `_ko` 보다 줄 수가 적어 최신이 아님 |
| `이름_en.properties` | 영어 | 영어 사용자. 없는 키는 기본 파일에서 찾음 |
| `emxFrameworkStringResource_kernel.properties` | 영어 | kernel type 표시 이름 (`VPLMtyp/...`) |

```text
emxFramework.Common.Name= 이름
```

::: warning _ko 에는 \u 로 적습니다
OOTB 와 프로젝트 모두 `_ko` 에 `\uXXXX` 로 적습니다. 한글을 그대로 저장하면 깨질 수 있습니다. 편집기의 properties 모드나 변환 도구로 바꿔 넣고, `Native` 파일은 고치지 않습니다.
:::

## 키 이름 규칙

### 스키마 표시 이름

| 키 | 예 | 건수 (emxFramework) |
| --- | --- | --- |
| `emxFramework.Type.타입` | `emxFramework.Type.Part` | 4,946 |
| `emxFramework.Attribute.속성` | `emxFramework.Attribute.Metal_Composition` | 13,804 |
| `emxFramework.Range.속성.값` | `emxFramework.Range.Force_Part_Reuse.Yes` | 15,692 |
| `emxFramework.State.정책.state` | `emxFramework.State.Route.In_Process` | 4,114 |
| `emxFramework.Policy.정책` | `emxFramework.Policy.eService_Trigger_Program_Policy` | 901 |
| `emxFramework.Relationship.관계` | `emxFramework.Relationship.Library_Representation` | 1,067 |
| `emxFramework.Interface.인터페이스` | | 2,357 |
| `emxFramework.Role.역할` | `emxFramework.Role.Request_Reviewer` | 370 |

- 이름 안의 **공백은 `_`** 로 바꿉니다. 괄호 같은 다른 문자는 그대로 둡니다 (`Disposition_(In_Field)`).
- **실제 이름** 기준입니다. 심볼릭 이름(`type_Part`)이 아닙니다.
- 이 키들은 `emxFrameworkStringResource` 에서만 찾는 것으로 보입니다. OOTB 와 프로젝트 모두 이 파일에만 두고, 코드도 `"Framework"` 별칭이나 `emxFrameworkStringResource` 로 읽습니다.

```java
String typeLabel  = i18nNow.getTypeI18NString(typeName, lang);
String attrLabel  = i18nNow.getAttributeI18NString(attrName, lang);
String rangeLabel = i18nNow.getRangeI18NString(attrName, value, lang);
String stateLabel = i18nNow.getStateI18NString(policyName, stateName, lang);
```

### 화면 글자, 메시지

`앱접두어.영역.이름` 형태입니다.

```text
emxFramework.Common.Name
emxComponents.RouteDetails.UnAssignedTasksMessage
emxFramework.Trigger.emxTriggerManagerBase.TriggerFail
myApp.Msg.CannotDeleteReleased
myApp.Label.RequestTitle
```

## 코드에서 읽기

### Java

```java
String msg = EnoviaResourceBundle.getProperty(context, "emxComponentsStringResource",
        context.getLocale(), "emxComponents.RouteDetails.UnAssignedTasksMessage");

String label = EnoviaResourceBundle.getProperty(context, "Framework",
        "emxFramework.Range.My_Category." + value, context.getLocale().getLanguage());

String text = EnoviaResourceBundle.getFrameworkStringResourceProperty(context,
        "emxFramework.Message.DesktopClient", new Locale(lang));

String old = i18nNow.getI18nString("emxFramework.label.under", "emxFrameworkStringResource", lang);
```

| 형태 | 인자 순서 |
| --- | --- |
| 파일 이름 | `(context, "파일이름", Locale, 키)` |
| 앱 별칭 | `(context, "Framework", 키, 언어문자열)`. 별칭은 `eServiceSuite별칭.StringResourceFileId` 로 파일을 찾음 |
| Framework 전용 | `getFrameworkStringResourceProperty(context, 키, Locale)` |
| 예전 방식 | `i18nNow.getI18nString(키, "파일이름", 언어문자열)` |

`jpo/` 에서 많이 읽는 번들: `ProgramCentral` 별칭 581, `emxFrameworkStringResource` 284, `emxComponentsStringResource` 271, `Framework` 별칭 161 건.

::: warning 키가 없을 때
돌아오는 값이 키 문자열 그대로이거나 빈 값, `null` 일 수 있습니다. OOTB 코드도 세 가지를 모두 검사합니다. 화면에 키가 그대로 보이면 키 오타나 배포 누락입니다. `null` 이 `Map` 키 같은 곳에 들어가면 원인이 안 보이는 오류가 나므로, 키 문자열로 대체하는 작은 함수를 두고 씁니다.

```java
private String label(Context context, String key) {
    try {
        String v = EnoviaResourceBundle.getProperty(context, "myAppStringResource", context.getLocale(), key);
        return v == null || v.isEmpty() ? key : v;
    } catch (Exception e) {
        return key;
    }
}
```
:::

### JSP

```html
<emxUtil:localize id="i18nId" bundle="emxFrameworkStringResource" locale='<%= request.getHeader("Accept-Language") %>' />
<emxUtil:i18n localize="i18nId">emxFramework.Collections.OnlyCollection</emxUtil:i18n>
```

```java
String s = i18nNow.getI18nString("emxNavigator.UIMenu.ResetCacheMessage",
        "emxFrameworkStringResource", request.getHeader("Accept-Language"));
```

### command, table, form 의 label

admin 객체의 `label` 에는 키를 적고, `Registered Suite` 설정으로 어느 파일에서 찾을지 정합니다.

```text
add command 'MyPartCreate'
    label 'myApp.Command.CreatePart'
    setting 'Registered Suite' 'MyApp'
;
```

`Registered Suite` 값 `MyApp` → `eServiceSuiteMyApp.StringResourceFileId` → `myAppStringResource` 순서로 찾아갑니다. 프로젝트 command / table / form 에서 많이 쓰는 값은 `ProductLine` 1,343, `ProgramCentral` 500, `Framework` 210 건입니다.

## 키 추가하기

### 내 문자열 파일 만들기

메시지, 버튼, 라벨은 내 앱 전용 파일에 둡니다. OOTB 파일과 섞이지 않아 업그레이드 때 안전합니다.

1. `myAppStringResource.properties`, `myAppStringResource_ko.properties` 를 만듭니다.
2. `emxFrameworkCustom.properties` 에 앱을 등록합니다. [앱 등록](/properties/system-settings#앱-등록-키)

```text
eServiceSuiteMyApp.StringResourceFileId = myAppStringResource
```

3. 코드에서는 파일 이름이나 별칭으로 읽습니다.

```java
EnoviaResourceBundle.getProperty(context, "myAppStringResource", context.getLocale(), "myApp.Msg.CannotDeleteReleased");
EnoviaResourceBundle.getProperty(context, "MyApp", "myApp.Msg.CannotDeleteReleased", lang);
```

### 스키마 표시 이름

type, 속성, range, state 표시 이름은 위 이유로 `emxFrameworkStringResource` 에 넣습니다. 기본 파일과 `_ko` 두 곳에 같은 키를 넣고, 블록 표시를 남겨 업그레이드 후 다시 옮길 수 있게 합니다.

```text
# MyPart [B]
emxFramework.Type.MyPart = My Part
emxFramework.Attribute.My_Category = Category
emxFramework.Range.My_Category.Standard = Standard
emxFramework.State.MyPartPolicy.In_Work = In Work
# MyPart [E]
```

| 확인 | 이유 |
| --- | --- |
| 기본 파일에도 넣음 | 영어 사용자, `_en` 에 없는 키의 기본값 |
| `_ko` 에는 `\u` 로 | 위 경고 참고 |
| 공백은 `_` | `My Category` → `My_Category` |
| range 값마다 한 줄 | 값을 추가하면 키도 추가 |

고친 뒤에는 Reload Cache 로 반영합니다. [반영](/properties/#고친-뒤-반영)
