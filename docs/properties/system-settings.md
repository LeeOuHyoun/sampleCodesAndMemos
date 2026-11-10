# 시스템 설정과 page 객체 <Badge type="info" text="원본 분석" />

언어와 상관없는 동작 설정은 `emxSystem.properties` 와 앱별 `.properties` 에 있고, 프로젝트 값은 `emxFrameworkCustom.properties` 에 둡니다. 파일 대신 DB 에 두는 설정은 **page 객체** 를 씁니다.

::: info 근거
`properties/emxSystem.properties` (키 3,431 개), `properties/emxFrameworkCustom.properties`, 앱 설정 파일(`emxComponents.properties` 등). 코드 쪽: `jpo/` 의 `EnoviaResourceBundle.getProperty(context, 키)` 2 인자 호출 643 건, `FrameworkProperties.getProperty`, `MessageUtil.getMessage`, `jpo/emxTriggerManagerBase_mxJPO.java`, `jpo/emxContextUtilBase_mxJPO.java`, `jpo/emxTriggerValidationBase_mxJPO.java`. page 객체: `mql/21.page/*.mql` (8 개), `print page` 를 쓰는 JPO 13 개 (`emxECPartBase`, `ENOConditionalQuestionnaireBase`, `WhereUsedBase` 등)
:::

## 파일

| 파일 | 내용 |
| --- | --- |
| `emxSystem.properties` | Framework 전체 설정. 아이콘, 팝업 크기, 앱(suite) 등록, 캐시, 검색 |
| `emx앱.properties` (`emxComponents`, `emxEngineeringCentral` ...) | 앱별 설정. `eServiceSuite앱.ApplicationPropertyFile` 로 등록 |
| `emxFrameworkCustom.properties` | 프로젝트 설정. OOTB 에는 없고 직접 만듦 |

이 소스에는 `emxFramework.properties` 가 없고, Framework 설정은 `emxSystem.properties` 에 모여 있습니다.

### emxSystem.properties 의 키 분포

| 접두어 | 키 수 |
| --- | --- |
| `emxFramework.smallIcon.*` | 1,163 |
| `emxFramework.largeIcon.*` | 300 |
| `emxFramework.HelpAbout.*` | 111 |
| `emxFramework.FullTextSearch.*` | 36 |
| `eServiceSuite*.StringResourceFileId` | 189 |

### 자주 보는 키

| 키 | 값 (이 소스) | 쓰임 |
| --- | --- | --- |
| `emxFramework.smallIcon.type_Part` | `iconSmallPart.png` | type 아이콘. `type_` 심볼릭 이름 |
| `emxFramework.smallIcon.defaultType` | `iconSmallDefault.gif` | 아이콘이 없는 type |
| `emxFramework.PopupSize` / `.Large` | `Small,Medium,...` / `965x700` | 팝업 크기 이름과 값 |
| `emxFramework.FullName.Format` | `<First Name> <Last Name>` | 사람 이름 표시 형식 |
| `emxFramework.Routes.EnableMails` | `false` | Route 메일 |
| `emxFramework.Lifecycle.MassPromoteDemote.Enable` | `true` | 일괄 promote / demote |
| `emxNavigator.UICache.ComponentAge` | `3600` | UI 캐시 수명(초). `emxTriggerManager` 도 읽음 |
| `emxFramework.RestoreRPE` | `FALSE` | 트리거 실행 후 RPE 복원 여부. [트리거](/trigger/jpo-args#트리거끼리-값-넘기기) |
| `emxFramework.CustomProperties.Filename` | `emxFrameworkCustom.properties` | Custom 파일 이름 |
| `emxFramework.PromoteTrigger.Validation.To.Rels.정책.state` | 관계 심볼릭 목록 | 트리거 검증 화면이 함께 검사할 연결 객체 |

## emxFrameworkCustom.properties

`emxSystem.properties` 에 이렇게 등록되어 있습니다.

```text
#Added for Property file Hierarchy Registration
#The OTTB custom property is emxFrameworkCustom.properties as defined below in the key.
#But this property file will not be provided OOTB.
emxFramework.CustomProperties.Filename=emxFrameworkCustom.properties
```

OOTB 키와 **같은 키** 를 Custom 파일에 적으면 Custom 값이 쓰이는 것으로 보입니다. 프로젝트는 `emxFramework.PopupSize`, `eServiceSuites.DisplayedSuites`, `emxFramework.ApplicationList` 같은 OOTB 목록을 Custom 에서 통째로 다시 적어 씁니다.

```text
emxFramework.PopupSize = Small,Medium,Large,SmallTall,MediumTall,1250x720
emxFramework.PopupSize.1250x720 = 1250x720

myApp.Interface.Url.Prod = https://interface.example.com
myApp.Interface.Url.Dev  = https://interface-dev.example.com
```

| 규칙 | 이유 |
| --- | --- |
| 새 키는 내 앱 접두어로 (`myApp.`) | OOTB 키와 겹치지 않게 |
| OOTB 목록을 바꿀 때는 **전체** 를 적음 | 값 하나만 더하는 문법은 없는 것으로 보입니다. 원래 값을 복사해서 더함 |
| 업그레이드 후 OOTB 목록과 비교 | OOTB 쪽에 새 값이 생겨도 Custom 의 옛 목록이 이김 |
| 운영 / 개발 값은 키 이름으로 나눔 | 같은 파일을 두 서버에 배포 |
| 블록 표시 (`# 기능 [B]` ... `# 기능 [E]`) | 누가 왜 넣었는지 추적 |

::: warning emxSystem.properties 를 직접 고치지 않습니다
프로젝트 type 아이콘 키를 `emxSystem.properties` 끝에 직접 넣은 예가 있습니다. 동작은 하지만 제품 파일이라 업그레이드 때 사라집니다. 같은 키를 Custom 파일에 두는 편이 안전한 것으로 보입니다.
:::

## 앱 등록 키

내 앱(suite) 을 만들면 문자열 파일, 설정 파일, 폴더를 등록합니다. 프로젝트는 아래 키를 모두 Custom 파일에 둡니다.

```text
eServiceSuites.DisplayedSuites = eServiceSuiteCPGGSM, \
                                 ...기존 목록..., \
                                 eServiceSuiteMyApp
emxFramework.ApplicationList = Common, \
                               ...기존 목록..., \
                               MyApp

eServiceSuiteMyApp.Directory = myApp
eServiceSuiteMyApp.ApplicationPropertyFile = myApp.properties
eServiceSuiteMyApp.StringResourceFileId = myAppStringResource
eServiceSuiteMyApp.PropertyFileAlias = myAppProperties
eServiceSuiteMyApp.UIForm.ValidationFile = myAppFormValidation.js
eServiceSuiteMyApp.UIFreezePane.ValidationFile = myAppTableValidation.jsp
```

| 키 | 뜻 |
| --- | --- |
| `eServiceSuites.DisplayedSuites` | 시작할 때 읽을 앱 목록. 앱의 설정 파일과 **문자열 파일을 찾는 데도 씀** |
| `emxFramework.ApplicationList` | 앱 목록. 앱별 mapping 파일 이름을 만드는 데 씀 |
| `.Directory` | 3dspace 아래 앱 폴더. command href 의 `${SUITE_DIR}` 가 이 폴더로 바뀌는 것으로 보입니다 |
| `.ApplicationPropertyFile` | 앱 설정 파일 |
| `.StringResourceFileId` | 앱 문자열 파일. `Registered Suite` 와 별칭 조회가 이 값을 씀 |
| `.PropertyFileAlias` | 앱 설정 파일 별칭 |
| `.UIForm.ValidationFile`, `.UIFreezePane.ValidationFile` | form / 표 편집 화면에 함께 실을 검증 스크립트 |

OOTB 앱 화면에 검증 스크립트를 더할 때도 같은 키를 씁니다. 원래 파일을 앞에 두고 쉼표로 내 파일을 붙입니다.

```text
eServiceSuiteProgramCentral.UIForm.ValidationFile = emxProgramCentralUIFormValidation.jsp,myAppProgramCentralValidation.js
```

## 코드에서 읽기

```java
String size = EnoviaResourceBundle.getProperty(context, "emxFramework.PopupSize.Large");
String dir  = FrameworkProperties.getProperty(context, "eServiceSuite" + suite + ".Directory");
String age  = MessageUtil.getMessage(context, "emxNavigator.UICache.ComponentAge", null, null, null, "emxSystem");
String rels = EnoviaResourceBundle.getProperty(context, "emxSystem", context.getLocale(), key);
```

| 형태 | 쓰임 |
| --- | --- |
| `getProperty(context, 키)` | 가장 흔함. 등록된 설정 파일 전체에서 찾음 |
| `getProperty(context, "emxSystem", Locale, 키)` | 파일을 정해서 찾음 |
| `FrameworkProperties.getProperty(context, 키)` | 예전 방식. 같은 결과로 보입니다 |
| `MessageUtil.getMessage(context, 키, null, null, null, "emxSystem")` | OOTB 트리거, 컨텍스트 JPO 에서 사용 |

- 2 인자 `getProperty` 로 많이 읽는 접두어: `emxFramework` 168, `emxComponents` 103, `emxEngineeringCentral` 82, `emxProgramCentral` 73 건 (`jpo/` 의 OOTB 파일).
- 키가 없으면 키 문자열이나 빈 값이 올 수 있습니다. [키가 없을 때](/properties/string-resource#코드에서-읽기)
- 값 끝의 공백은 남을 수 있으므로 `trim()` 합니다.

## page 객체

설정을 파일이 아니라 DB 의 admin 객체 `page` 에 둘 수도 있습니다. 서버 파일을 배포하지 않아도 되고, MQL 로 바로 바꿀 수 있습니다.

```text
add page MyAppLeadTime
    content '{
  "TYPE_A": { "min": 5, "max": 7 },
  "TYPE_B": { "min": 3, "max": 5 }
}';
```

```java
String json = MqlUtil.mqlCommand(context, "print page $1 select content dump", "MyAppLeadTime");
```

| page (OOTB) | 내용 | 읽는 곳 |
| --- | --- | --- |
| `ECMConfig` | 변경 관리 허용 type, 그룹별 role (XML) | 변경 관리 |
| `WhereUsedDefinition` | Where Used 정의 | `WhereUsedBase` |
| `BOMUOMTypeMapping` | 단위 매핑 (XML) | `emxECPartBase` |
| `DomainAccess` | policy 목록 | `emxSecurityMigrationMigrateMOAAccessBase` |
| `ConditionalQuestionnaireExpression` | 조건식 (XML) | `ENOConditionalQuestionnaireBase` |

| properties 와 비교 | properties | page |
| --- | --- | --- |
| 저장 위치 | 서버 파일 | DB |
| 반영 | Reload Cache 또는 재시작 | `print page` 로 매번 읽으면 바로 |
| 언어별 값 | 파일로 나눔 | 없음 |
| 형식 | 키 = 값 | 자유 (JSON, XML) |

::: tip OOTB page 를 고칠 때
먼저 복사본을 만듭니다.

```text
copy page ECMConfig ECMConfig_BACKUP;
mod page ECMConfig content '...';
```

`content` 는 통째로 바뀌므로 원래 내용을 `print page ECMConfig select content dump;` 로 받아 고친 뒤 넣습니다.
:::
