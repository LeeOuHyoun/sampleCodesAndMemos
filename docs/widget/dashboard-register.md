# 3DDashboard 에 위젯 올리기 <Badge type="info" text="원본 분석" />

만든 위젯을 3DDashboard 에서 쓰려면 두 가지가 필요합니다. 위젯 파일을 브라우저가 읽을 수 있는 **주소** 에 두는 것, 그리고 그 주소를 대시보드에 **알려 주는 것** 입니다. 주소를 알려 주는 방법은 원본에서 두 가지를 확인했습니다.

| 방법 | 누가 | 쓰임 |
| --- | --- | --- |
| [Run Your App 위젯](#run-your-app-으로-열기) | 대시보드 사용자 | 개발 중 확인. 위젯 주소만 넣으면 그 위젯으로 바뀜 |
| [Additional App 등록](#additional-app-으로-등록) | 플랫폼 관리자 | 정식 등록. Compass 에 앱으로 나타나고 구성원에게 공개 / 부여 |

::: info 근거
RunYourApp/RunYourApp.html, RunYourApp/assets/nls/RunYourApp_en.js, RunYourApp_ko.js. PlatformManagement/PlatformManagement.js 의 `DS/PlatformManagement/Modal/ThirdPartyApps` (등록 창), `Model/AppModel`, `Collection/AppsCollection`, `Utils` (`getWidgetDomaine`), 주소 표(`baseUrlBackend`), Additional Apps 목록 뷰. PlatformManagement/assets/lang/en.json. UWA2/js/Widget.js 의 `mutate`. 대시보드 본체(위젯을 바꾸는 쪽)와 앱 등록을 받는 서버 코드는 3DSpace 소스 폴더에 없습니다
:::

## 배포 위치와 주소

위젯은 폴더째 3DSpace 웹앱의 `webapps/` 아래에 둡니다. ENOVIA 의 위젯도 모두 같은 자리에 있습니다.

```text
<TomEE>/webapps/3dspace/
└─ webapps/
   ├─ AmdLoader/, c/, UWA2/ ...     OOTB 모듈
   └─ MyWidget/
      ├─ MyWidget.html              위젯 HTML (등록할 주소)
      ├─ MyWidget.js                DS/MyWidget/MyWidget
      ├─ MyWidget.css
      └─ assets/nls/MyWidget_ko.js
```

| 항목 | 값 |
| --- | --- |
| 위젯 주소 | `https://<3DSpace 주소>/webapps/MyWidget/MyWidget.html` |
| 모듈 이름 | `DS/MyWidget/MyWidget` (폴더 이름 = 가운데 조각 → [AMD 로딩](/amd/)) |
| 반영 | 파일을 넣으면 끝. 정적 파일이라 서버를 다시 시작하지 않아도 되는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> |

- 위젯 HTML 이 `../AmdLoader/AmdLoader.js`, `../c/UWA/js/UWA_Standalone_Alone.js` 를 상대 경로로 부르므로 **OOTB 모듈과 같은 `webapps/` 아래** 에 둬야 합니다 ([위젯 HTML 구조](/widget/#위젯-html-구조)).
- 등록 전에 브라우저로 위젯 주소를 직접 열어 [단독 실행](/widget/#실행-환경) 으로 화면이 뜨는지 먼저 확인합니다.
- 서버가 여러 대이면 모든 서버의 같은 위치에 넣어야 하는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

## Run Your App 으로 열기

`RunYourApp` 은 설정 값이 주소 하나뿐인 OOTB 위젯입니다. 주소를 넣으면 **자기 자신을 그 주소의 위젯으로 바꿉니다**. 관리자 등록 없이 개발 중인 위젯을 대시보드 안에서 확인할 때 씁니다.

| 순서 | 할 일 |
| --- | --- |
| 1 | 대시보드 탭에 Run Your App 위젯을 추가 |
| 2 | 입력칸에 위젯 주소를 넣고 Enter 또는 실행(Run) 버튼. 위젯 설정의 `Web App Url` (한글: `Widget URL`) 에 넣어도 같음 |
| 3 | 위젯이 그 주소의 위젯으로 바뀜 |

Run Your App 이 앱 목록에 보이는지는 부여된 역할에 따라 다른 것으로 보입니다. <Badge type="danger" text="검증 필요" />

### 동작

| 상황 | 동작 |
| --- | --- |
| `moduleUrl` 설정이 비어 있음 | 주소 입력칸과 실행 버튼을 그림 |
| `moduleUrl` 이 있고 지금 위젯 주소(`widget.getUrl()`)와 다름 | 대시보드 창의 위젯 인스턴스를 찾아 `mutate(moduleUrl, { failureCb })` 호출 |
| 주소를 읽지 못함 | `failureCb` 가 `moduleUrl` 을 `''` 로 되돌리고 오류 메시지와 입력칸을 다시 그림 |

```js
function findWidget(id) {
  return parent.UWA.Widgets.instances.detect(function (inst) {
    return inst.id === id;
  }) || widget;
}

findWidget(widget.id).mutate(widget.getValue('moduleUrl'), { failureCb: failure });
```

- `widget.mutate(url, options)` 는 UWA `Widget` 의 메서드이지만 실행 환경에 `mutate` 가 있을 때만 됩니다. 위젯 프레임 안의 `widget` (`Frame` 환경) 에는 없어서 Run Your App 은 **부모 창** (`parent.UWA.Widgets.instances`) 의 인스턴스를 찾아 부릅니다. 단독 실행에서는 `Current Environment do not support widget.mutate` 오류가 납니다.
- 바뀐 뒤에는 새 위젯의 설정 항목(`<widget:preferences>`)이 적용되고, 탭을 다시 열어도 바뀐 위젯으로 남는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

## Additional App 으로 등록

Platform Management (구성원과 역할을 관리하는 관리자 화면) 에서 앱을 등록합니다. 등록한 앱은 Compass 에 Short Name 으로 나타납니다.

| 여는 곳 | 조건 |
| --- | --- |
| Members 화면 아래의 **Additional Apps** 목록 → `Create Additional App` | 플랫폼을 고른 상태 |
| 상단 `+` 메뉴 → `Additional Apps` | 플랫폼을 고른 상태 |

등록 버튼이 보이려면 플랫폼 관리자 권한이 있어야 하는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

### 입력 항목

| 화면 이름 | 요청 키 | 규칙 |
| --- | --- | --- |
| Short Name | `displayname` | 필수. 3 ~ 45 자. Compass 에 보이는 이름 |
| Long Name | `tooltip` | 선택. 넣으면 3 자 이상, 최대 255 자. 툴팁에 보임 |
| Type | `type` | 서버가 주는 목록에서 고름. **만든 뒤에는 바꿀 수 없음** (수정 창에서 비활성) |
| Storage Type | - | `External` (주소) / `Internal` (HTML 파일 올리기). Type 이 위젯일 때만 보임 |
| Source code URL | `launchinfos` | 위젯 주소. URL 형식이 아니면 `Must be a valid URL.` |
| Source Code File | `launchinfos` = `file:파일이름` | Storage Type 이 Internal 일 때. `.html` 파일, 이름에 공백 금지 |
| Configuration file URL | `config` | 선택. Type 이 위젯일 때 보임 |
| Object Type Compatibility | `compatibility` | 선택. 쉼표로 나눈 type 목록 (예: `Issue, VPMReference`) |
| Available to all members | `visibility` | 체크하면 `Public`, 풀면 `Private` |
| 아이콘 | `icon` | 이미지 (base64). 없으면 기본 아이콘 |

- Type 의 값 목록은 서버 응답(`ui.type`)으로 옵니다. 화면 코드는 `web`, `widget`, `native` 세 경우를 나눠 처리합니다. 위젯은 `Widget` 을 고르는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- Compass Quadrant (`quadrant`) 항목은 화면에서 숨겨져 있고 기본값 `NORTH` 로 보냅니다.
- Configuration file URL 에 무엇을 넣는지는 화면 코드로는 알 수 없습니다. 위젯 설정 초기값을 담은 파일 주소인 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- Object Type Compatibility 는 그 type 의 객체에서 "다른 앱으로 열기" 를 했을 때 이 앱이 후보로 나오게 하는 값으로 보입니다. <Badge type="danger" text="검증 필요" /> ([OpenWith](/widget/compass-services#openwith))

### Type 별로 보이는 항목

| Type | 주소 항목 이름 | 함께 보이는 항목 |
| --- | --- | --- |
| `web` | URL | - |
| `widget` + External | Source code URL | Storage Type, Configuration file URL |
| `widget` + Internal | (숨김) | Storage Type, Source Code File, Configuration file URL |
| `native` | ID | Executable, Custom Error Message |

`native` 는 PC 에 설치된 클라이언트 프로그램을 여는 앱입니다. Executable 은 필수이고, 값이 `3DExperience` 또는 `3DExperience.exe` 이면 ID 도 필수입니다.

### 저장 요청

저장하면 앱 모델(`Model/AppModel`, 주소 `app/custom`)로 요청 한 번이 나갑니다. Platform Management 의 다른 요청이 Compass(My Apps) 주소 뒤에 `/resources/AppsMngt/` 를 붙여 쓰므로 전체 주소는 아래와 같은 것으로 보입니다. <Badge type="danger" text="검증 필요" />

| 항목 | 값 |
| --- | --- |
| 주소 | `<app.urls.myapps 값>/resources/AppsMngt/app/custom` |
| 목록 조회 | 같은 주소 (`Collection/AppsCollection`). 응답 `{ count, data: [...] }` |
| 한 건 조회 | `id`, `ui: true`, `platform` 을 넣어 조회. 응답 `{ ui: { type, quadrant }, app: { ..., editable, remove, granted } }` |
| 삭제 | 구성원에게 부여된 앱이면 확인 창에서 경고 |

```json
{
  "type": "Widget",
  "quadrant": "NORTH",
  "platforms": "OnPremise",
  "displayname": "My Widget",
  "tooltip": "My Widget for parts",
  "description": "",
  "icon": "",
  "launchinfos": "https://3dspace.example.com/3dspace/webapps/MyWidget/MyWidget.html",
  "config": "",
  "compatibility": "",
  "visibility": "Public"
}
```

요청을 받는 서버 코드는 소스 폴더에 없어 HTTP 메서드와 응답 형식은 확인하지 못했습니다. 수정은 `id` 를 넣은 같은 본문을 보내는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

### Internal 저장

Storage Type 을 Internal 로 하면 주소 대신 HTML 파일 하나를 올립니다.

| 순서 | 일 |
| --- | --- |
| 1 | 앱 저장 요청. `launchinfos` 는 `file:MyWidget.html` |
| 2 | `<3DDashboard 주소>/api/security/csrf` 로 CSRF 토큰 조회 |
| 3 | `<3DDashboard 주소>/api/widgets/store-html-file` 에 `file`, `appId` 를 multipart POST |

- 3DDashboard 주소는 위젯의 `widgetDomain` 에서 얻고, 없으면 Compass 에 `3DDASHBOARD` 서비스 주소를 물어 얻습니다.
- 올라가는 것은 **HTML 한 장** 입니다. 3DSpace `webapps/` 의 AMD 모듈을 상대 경로로 부르는 위젯은 주소가 달라져 모듈을 찾지 못하므로 External 로 등록하는 편이 안전한 것으로 보입니다. <Badge type="danger" text="검증 필요" />

## 등록한 뒤

| 설정 | 결과 |
| --- | --- |
| Available to all members 체크 (`Public`) | 플랫폼의 모든 구성원에게 보임 |
| 체크 해제 (`Private`) | 구성원 초대 / 역할 부여 화면의 **Additional Apps** 단계에서 사람별로 부여 |

- 구성원은 Compass 에서 Short Name 으로 앱을 찾아 대시보드 탭에 올리는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- 대시보드 안에서 위젯은 `Frame` 환경으로 실행됩니다. 플랫폼 id, 사용자, 3DSpace 주소를 얻는 방법은 [3DSpace 주소와 SecurityContext](/widget/space-url) 에 있습니다.

## 자주 틀리는 것

| 틀린 생각 | 실제 |
| --- | --- |
| 위젯 폴더는 아무 웹 서버에나 두면 됨 | `AmdLoader`, `UWA` 를 상대 경로로 부르면 3DSpace `webapps/` 아래여야 함 |
| Type 은 나중에 바꾸면 됨 | 수정 창에서 Type 은 비활성. 지우고 다시 만들어야 함 |
| Internal 로 올리면 js, css 도 같이 올라감 | HTML 파일 하나만 올라감 |
| Source code URL 에 상대 경로를 넣어도 됨 | URL 형식이 아니면 저장 전에 막힘 |
| Run Your App 에 틀린 주소를 넣으면 빈 화면으로 남음 | 설정이 지워지고 입력칸이 다시 나옴 |
| 위젯 안에서 `widget.mutate` 를 부르면 됨 | 프레임 안의 `widget` 에는 없음. 부모 창의 인스턴스로 호출 |
