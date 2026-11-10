# 자주 쓰는 유틸리티 <Badge type="info" text="원본 분석" />

JPO 에서 `DomainObject`, `MqlUtil` 다음으로 자주 쓰는 보조 클래스입니다. 빈 값 검사, HTML 이스케이프, 로그인 사용자 정보, 날짜 변환, 타입과 상태 이름 처리, 서버 캐시를 모았습니다.

::: info 근거
jpo 폴더 바로 아래 1,615 개 파일의 호출 수 (메서드별 건수는 각 절의 표). 시그니처와 동작은 xerinfra.jar (`UIUtil`, `StringUtil`, `FrameworkUtil`, `XSSUtil`, `PersonUtil`, `eMatrixDateFormat`, `mxType`, `CacheUtil`, `DomainAccess`), pnocommon.jar (`com.matrixone.apps.common.Person`, `ComponentsUtil`) class 파일의 바이트코드 기준
:::

## 한눈에 보기

| 하고 싶은 일 | 쓰는 것 | 건수 |
| --- | --- | --- |
| 값이 비었는지 확인 | `UIUtil.isNullOrEmpty(s)` / `isNotNullAndNotEmpty(s)` | 977 / 1,357 |
| 문자열 자르기, 붙이기, 바꾸기 | `FrameworkUtil.split`, `join`, `findAndReplace` | 1,143, 151, 240 |
| HTML 열에 값 넣기 | `XSSUtil.encodeForHTML(context, s)` 외 4 개 | 2,206 |
| 로그인 사용자 정보 | `PersonUtil`, `Person.getPerson(context)` | 802, 179 |
| 날짜 속성 읽기, 쓰기, 화면 표시 | `eMatrixDateFormat` | 697 |
| 객체 없이 타입 상속 확인 | `mxType.isOfParentType(context, type, parentType)` | 140 |
| 실제 이름을 심볼릭 이름으로 | `FrameworkUtil.getAliasForAdmin` | 223 |
| 서버 전체에서 같이 쓰는 캐시 | `CacheUtil` | 116 |

## 빈 값과 문자열

```java
String objectId = (String) programMap.get("objectId");
if (UIUtil.isNullOrEmpty(objectId)) {
    return new MapList();
}
StringList ids = FrameworkUtil.split(idList, ",");
String joined = FrameworkUtil.join(ids, "|");
```

| 메서드 | 건수 | 내용 |
| --- | --- | --- |
| `UIUtil.isNullOrEmpty(s)` | 977 | `null`, 공백뿐인 문자열, `"null"` (대소문자 무시) 이면 `true` |
| `UIUtil.isNotNullAndNotEmpty(s)` | 1,357 | 위의 반대 |
| `FrameworkUtil.split(s, sep)` | 1,143 | `StringList` 로 자름 ([여러 값 받기](/jpo/mql-util#여러-값-받기)) |
| `FrameworkUtil.join(list, sep)` | 151 | `StringList` 나 `String[]` 를 구분자로 이어 붙임 |
| `FrameworkUtil.findAndReplace(s, from, to)` | 240 | 문자열 바꾸기 |

- 요청 값에는 `"null"` 문자열이 들어오는 경우가 있습니다 ([공통](/jpo/args#공통)). `UIUtil.isNullOrEmpty` 는 이것까지 빈 값으로 보므로 `"null".equals` 를 따로 확인하지 않아도 됩니다.
- `split`, `join` 은 `FrameworkUtil` 의 상위 클래스 `StringUtil` 에 있는 메서드입니다.

::: info 근거
xerinfra.jar `UIUtil.isNullOrEmpty(String)`: `null` 이거나 `trim().length() == 0` 이거나 `"null".equalsIgnoreCase(s)` 이면 참. `isNotNullAndNotEmpty` 는 `!isNullOrEmpty`. `FrameworkUtil extends StringUtil` (`split(String, String)`, `join(StringList, String)`, `join(String[], String)`), `FrameworkUtil.findAndReplace(String, String, String)`
:::

## HTML 이스케이프

`programHTMLOutput` 열이나 필드처럼 JPO 가 HTML 을 만들어 돌려줄 때, 값을 넣는 자리에 맞는 함수로 감쌉니다.

| 메서드 | 건수 | 넣는 자리 |
| --- | --- | --- |
| `XSSUtil.encodeForHTML(context, s)` | 649 | 태그 사이의 글자 |
| `XSSUtil.encodeForHTMLAttribute(context, s)` | 374 | `title="..."`, `value="..."` 같은 속성 값 |
| `XSSUtil.encodeForURL(context, s)` | 311 | URL 의 인자 값 (`?objectId=...`) |
| `XSSUtil.encodeForJavaScript(context, s)` | 619 | `onclick` 이나 `<script>` 안의 문자열 |
| `XSSUtil.encodeForXML(context, s)` | 253 | XML 로 돌려주는 값 |

```java
String name = (String) row.get(DomainConstants.SELECT_NAME);
String title = (String) row.get(selectTitle);
result.add("<span title=\"" + XSSUtil.encodeForHTMLAttribute(context, title) + "\">"
        + XSSUtil.encodeForHTML(context, name) + "</span>");
```

- 내보내기와 인쇄 중에는 HTML 을 만들지 않고 글자만 돌려줍니다 ([표 열 function](/jpo/args#표-열-function)).
- 직접 만든 JSP 에서 예외 문구를 `alert` 로 보여 줄 때도 `encodeForJavaScript` 를 씁니다 ([예외](/jpo/i18n-exception#예외)).

::: info 근거
xerinfra.jar `XSSUtil` (`encodeForHTML(Context, String)`, `encodeForHTMLAttribute(Context, String)`, `encodeForURL(Context, String)`, `encodeForJavaScript(Context, String)`, `encodeForXML(Context, String)`). 건수는 jpo 폴더 호출 수
:::

## 현재 사용자

```java
String personId = PersonUtil.getPersonObjectID(context);
String fullName = PersonUtil.getFullName(context);
boolean isLeader = PersonUtil.hasAssignment(context, PropertyUtil.getSchemaProperty(context, "role_MyTeamLeader"));
```

| 메서드 | 반환 | 건수 | 내용 |
| --- | --- | --- | --- |
| `PersonUtil.getPersonObjectID(context)` | `String` | 216 | 로그인 사용자의 Person 객체 id. `(context, 사용자이름)` 형태도 있음 |
| `PersonUtil.getFullName(context)` | `String` | 155 | 화면에 보이는 이름. `(context, 사용자이름)` 형태도 있음 |
| `PersonUtil.hasAssignment(context, 역할)` | `boolean` | 48 | 그 역할이나 그 하위 역할을 가졌는지 |
| `PersonUtil.getAssignments(context)` | `Vector` | 34 | 가진 역할 (assignment) 이름 목록 |
| `PersonUtil.getActiveSecurityContext(context)` | `String` | 19 | 지금 보안 컨텍스트. `context.getRole()` 에서 앞의 `ctx::` 를 뗀 값 |
| `PersonUtil.getActiveOrganization(context)`, `getActiveProject(context)` | `String` | 12, 16 | 지금 보안 컨텍스트의 조직, 협업공간 |
| `PersonUtil.getDefaultOrganization(context, 사용자이름)` | `String` | 19 | 기본 조직 |
| `PersonUtil.getEmail(context)` | `String` | 6 | 메일 주소 |
| `Person.getPerson(context)` | `Person` | 179 | 로그인 사용자의 Person 객체. `DomainObject` 의 하위 클래스라 `getInfo` 등을 바로 씀 |

::: warning pushContext 안에서는 User Agent 기준입니다
`getPersonObjectID(context)`, `getFullName(context)`, `getAssignments(context)` 는 `context.getUser()` 로 사용자를 정합니다. `pushContext` 안에서 부르면 User Agent 의 값이 나옵니다. 실제 사용자 정보는 push 전에 구해 둡니다 ([pushContext](/jpo/transaction-context#슈퍼유저로-바꾸기-pushcontext)).
:::

::: info 근거
xerinfra.jar `PersonUtil` 바이트코드: `getPersonObjectID(Context)`, `getFullName(Context)`, `getAssignments(Context)` 가 `context.getUser()` 로 얻은 이름으로 `(Context, String)` 메서드를 부름. `hasAssignment` 는 `getAssignments(context).contains(역할)` 이 거짓이면 `getChildrenUser(context, 역할)` 의 하위 역할로 다시 확인. `getActiveSecurityContext` 는 `context.getRole()` 이 `ctx::` 로 시작하면 그 뒤를 돌려줌. pnocommon.jar `Person extends DomainObject` (`getPerson(Context)`)
:::

## 날짜

DB 의 날짜 속성 값은 서버 설정 형식의 **문자열** 입니다. 형식은 `emxSystem.properties` 에서 읽습니다.

| 설정 | 값 | 읽는 메서드 |
| --- | --- | --- |
| `eServiceSuites.eMatrixDateFormat` | `MM/dd/yyyy hh:mm:ss a` | `eMatrixDateFormat.getEMatrixDateFormat()` (119 건) |
| `eServiceSuites.eMatrixInputDateFormat` | `MM/dd/yyyy hh:mm:ss a` | `eMatrixDateFormat.getInputDateFormat()` |
| `emxFramework.DateTime.DisplayFormat` | `MEDIUM` | `eMatrixDateFormat.getEMatrixDisplayDateFormat()`. `DateFormat.MEDIUM` 같은 `int` |

### DB 값 읽고 쓰기

```java
SimpleDateFormat mxFormat = new SimpleDateFormat(eMatrixDateFormat.getEMatrixDateFormat(), Locale.US);
Date due = mxFormat.parse(obj.getAttributeValue(context, attrDueDate));
obj.setAttributeValue(context, attrDueDate, mxFormat.format(new Date()));
```

`eMatrixDateFormat.getJavaDate(value)` (263 건) 도 같은 형식의 문자열을 `Date` 로 바꿉니다.

::: warning SimpleDateFormat 은 Locale.US 로 만듭니다
형식 끝의 `a` 는 `AM` / `PM` 입니다. `new SimpleDateFormat(형식)` 처럼 Locale 을 주지 않으면 서버 기본 Locale 을 써서, 한국어 Locale 서버에서는 `오후` 로 만들어지고 `PM` 이 든 DB 값은 읽지 못합니다. OOTB 도 대부분 `Locale.US` 를 줍니다 (67 건, Locale 없이 20 건).
:::

### 화면 표시와 입력 변환

화면은 사용자의 시간대와 언어로 보여 줍니다. 시간대는 요청의 `timeZone` (시간 차이를 담은 문자열), Locale 은 `localeObj` 로 옵니다.

```java
double tz = Double.parseDouble((String) requestMap.get("timeZone"));
Locale locale = (Locale) requestMap.get("localeObj");
String display = eMatrixDateFormat.getFormattedDisplayDate(dbValue, tz, locale);
String dbInput = eMatrixDateFormat.getFormattedInputDate(context, userValue, tz, locale);
```

| 메서드 | 건수 | 내용 |
| --- | --- | --- |
| `getFormattedDisplayDate(값, tz, locale)` | 28 | DB 값 → 화면 날짜 |
| `getFormattedDisplayDateTime(context, 값, 시간표시, 형식, tz, locale)` | 62 | DB 값 → 화면 날짜와 시간. 형식은 `getEMatrixDisplayDateFormat()` |
| `getFormattedInputDate(context, 값, tz, locale)` | 97 | 화면에서 입력한 날짜 → DB 형식 |
| `getFormattedInputDateTime(context, 날짜, 시간, tz, locale)` | 43 | 날짜와 시간 입력 → DB 형식 |

- `timeZone` 은 폼과 생성 / 편집 처리에서는 `requestMap`, 표 열 function 에서는 `paramList` 에서 꺼냅니다 (`get("timeZone")` 145 건).
- `localeObj` 는 `Locale` 객체입니다 (`get("localeObj")` 91 건). 없으면 `context.getLocale()` 을 씁니다.

::: info 근거
properties/emxSystem.properties:1278-1279, 1290. xerinfra.jar `eMatrixDateFormat.setEMatrixDateFormat(Context)` 가 `eServiceSuites.eMatrixDateFormat`, `eServiceSuites.eMatrixInputDateFormat`, `emxFramework.DateTime.DisplayFormat` (`SHORT` / `MEDIUM` / `LONG` / `FULL`), `emxFramework.DateTime.DisplayTime` 을 읽고, `getEMatrixDisplayDateFormat()` 은 그 결과 `int` 를 돌려줌. jpo 폴더: `new SimpleDateFormat(eMatrixDateFormat.getEMatrixDateFormat(), Locale.US)` 67 건, `(new Double((String) requestMap.get("timeZone"))).doubleValue()` 형태의 시간대 변환, `(Locale) requestMap.get("localeObj")`
:::

## 타입과 상태 이름

| 메서드 | 건수 | 내용 |
| --- | --- | --- |
| `mxType.isOfParentType(context, type, parentType)` | 140 | 타입 이름만으로 상속 확인. 객체가 있으면 `obj.isKindOf(context, type)` ([DomainObject](/jpo/domain-object#정보-읽기)) |
| `FrameworkUtil.getAliasForAdmin(context, "type", 실제이름, true)` | 223 | 실제 이름 → 심볼릭 이름 (`Part` → `type_Part`). 두 번째 인자에 `"policy"` 등도 씀 |
| `FrameworkUtil.lookupStateName(context, policy, "state_Release")` | 172 | 심볼릭 상태 이름 → 실제 상태 이름 ([Policy](/schema/policy)) |
| `FrameworkUtil.reverseLookupStateName(context, policy, 상태)` | 28 | 위의 반대 |
| `FrameworkUtil.isSuiteRegistered(context, "appVersionProgramCentral", false, null, null)` | 97 | 그 앱 (suite) 이 설치되어 있는지 |
| `FrameworkUtil.getRanges(context, attr)` | 39 | 속성 범위 값 ([범위](/jpo/args#범위-range-function)) |
| `FrameworkUtil.autoName(...)` | 131 | 채번해서 객체 만들기 ([채번기](/trigger/generator)) |

- `mxType.isOfParentType` 은 두 이름이 같으면 바로 `true`, 다르면 `print type` MQL 로 확인합니다. 반복문 안에서 같은 타입을 여러 번 물으면 그만큼 서버를 부릅니다.
- 심볼릭 이름 자체는 [심볼릭 이름](/jpo/domain-object#심볼릭-이름) 을 봅니다.

::: info 근거
xerinfra.jar `mxType.isOfParentType(Context, String, String)` (같은 이름이면 참, 아니면 `MqlUtil.mqlCommand(context, "print type $1 select $2 dump", ...)` 결과가 `true` 인지), `FrameworkUtil.getAliasForAdmin(Context, String, String, boolean)` → `PropertyUtil.getAliasForAdmin`, `lookupStateName(Context, String, String)`, `reverseLookupStateName(Context, String, String)`, `isSuiteRegistered(Context, String, boolean, String, String)`, `getRanges(Context, String)`. 호출 형태: `getAliasForAdmin(context, "type", ..., true)` 51 건, `"policy"` 17 건
:::

## 서버 전체 캐시 (CacheUtil)

```java
Object icons = CacheUtil.getCacheObject(context, "MyApp.TypeIcons");
if (icons == null) {
    icons = loadTypeIcons(context);
    CacheUtil.setCacheObject(context, "MyApp.TypeIcons", icons);
}
```

| 메서드 | 건수 |
| --- | --- |
| `CacheUtil.getCacheObject(context, key)` | 57 |
| `CacheUtil.setCacheObject(context, key, value)` | 35 |
| `CacheUtil.removeCacheObject(context, key)` | 24 |

::: warning 모든 사용자가 같이 씁니다
값은 서버 (JVM) 의 static Map 에 테넌트별로 들어갑니다. 요청이나 사용자에 따라 달라지는 값 (권한, 언어별 문구) 을 넣으면 다른 사용자에게 그대로 보입니다. 서버를 여러 대로 돌리면 서버마다 따로 쌓입니다. 바뀔 수 있는 값은 `removeCacheObject` 로 비울 때를 정해 둡니다.
:::

::: info 근거
xerinfra.jar `CacheUtil.setCacheObject(Context, String, Object)`: `_lock` 으로 동기화하고 `getTenantMap(context)` 에 put, static `_GLOBAL_CACHE` 에 테넌트 이름으로 보관. `getCacheObject(Context, String)` 은 같은 Map 에서 get
:::

## 그 밖에

| 클래스 / 메서드 | 건수 | 내용 |
| --- | --- | --- |
| `BusinessObject.getSelectBusinessObjectData` | 168 | 여러 객체의 select 를 한 번에 ([DomainObject](/jpo/domain-object#정보-읽기)) |
| `DomainAccess.createObjectOwnership` / `deleteObjectOwnership` | 132 / 57 | 객체에 사람별 접근 (`COMMENT_MULTIPLE_OWNERSHIP`) 을 붙이고 뗌 |
| `MailUtil.sendNotification`, `sendMessage` | 12, 13 | OOTB 알림. 이 프로젝트는 메일을 SMTP 로 직접 보냄 ([메일](/server-java/mail)) |
| `FrameworkProperties.getProperty(context, 키)` | 137 | 안에서 `EnoviaResourceBundle.getProperty(context, 키)` 를 그대로 부름 |
| `ComponentsUtil.i18nStringNow(키, 언어)` | 140 | context 없이 `i18nNow` 로 문자열 리소스를 읽는 예전 형태. 새 코드는 [EnoviaResourceBundle](/jpo/i18n-exception#문자열-리소스) |

::: info 근거
xerinfra.jar `DomainAccess.createObjectOwnership` 오버로드 10 개 (호출 예: `createObjectOwnership(context, objectId, personId, access, DomainAccess.COMMENT_MULTIPLE_OWNERSHIP, true, true)`), `FrameworkProperties.getProperty(Context, String)` 바이트코드 (`EnoviaResourceBundle.getProperty` 호출), pnocommon.jar `ComponentsUtil.i18nStringNow(String, String)` (`new i18nNow().GetString(...)`)
:::
