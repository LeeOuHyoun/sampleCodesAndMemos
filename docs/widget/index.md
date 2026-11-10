# 위젯 <Badge type="info" text="원본 분석" />

3DDashboard 에 올리는 앱은 **UWA 위젯** 입니다. HTML 한 장에 메타 정보, 설정 항목(`<widget:preferences>`), 스크립트를 넣고, 스크립트는 전역 `widget` 객체로 화면과 설정 값을 다룹니다. 플랫폼 정보(사용자, 서비스 주소, 역할)는 별도 모듈로 얻습니다.

샘플: [WidgetSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.html) (설정, 이벤트, `i18n!` / `css!`, 3DSpace 주소와 SecurityContext)

::: info 근거
UWA2/js/Widget.js, Environment.js, Environments/Frame.js, Environments/Standalone.js, c/UWA/js/UWA_Standalone_Alone.js. 위젯 HTML 226 개 (`xmlns:widget` 포함, 예: ENORouteMgmt/ENOROUTApp.html, EditPropWidget/EditPropWidget.html, 3DDashboardGettingStarted.html). 호출 횟수: `widget.getValue(` 3,177, `widget.setValue(` 1,207, `widget.body` 1,222, `widget.id` 1,458, `widget.lang` 700
:::

## 실행 환경

같은 위젯 HTML 이 두 가지 방식으로 실행됩니다.

| 환경 | 여는 방법 | `widget` 을 만드는 것 | `widget.environment.name` |
| --- | --- | --- | --- |
| 3DDashboard | 대시보드에 위젯 주소를 등록 ([3DDashboard 에 위젯 올리기](/widget/dashboard-register)) | 대시보드의 위젯 프레임 (iframe, 주소에 `/api/widget/frame` 이 들어간 것으로 보임 <Badge type="danger" text="검증 필요" />) | `'frame'` |
| 단독 실행 | 브라우저로 `<3DSpace>/webapps/내폴더/위젯.html` 직접 열기 | `c/UWA/js/UWA_Standalone_Alone.js` | `'uwa'` |

- 3DDashboard 는 위젯 HTML 을 읽어 제목, 메타, 설정 항목, 본문, 스크립트를 뽑아 프레임 안에서 다시 실행하는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> (UWA `Environment.convertSourceToJson` 기준). 이때 주소에 `Standalone` 이 들어간 스크립트와 `standalone.css`, `UWA/assets` CSS 는 **건너뜁니다**. 그래서 단독 실행용 파일을 넣어 두어도 대시보드에서 충돌하지 않습니다. ENOVIA 위젯 HTML 226 개 중 133 개가 `UWA_Standalone_Alone.js` 를, 165 개가 `AmdLoader.js` 를 넣어 둡니다.
- 대시보드 안 프레임과 대시보드 본체는 메시지로 통신합니다. 제목 변경, 설정 값 저장, 새로고침 같은 요청이 이 통로로 오갑니다 ([InterCom](/uwa/intercom) 의 `uwa.embedded` 서버).
- 사용자, 테넌트, 서비스 주소 같은 플랫폼 정보는 **대시보드 최상위 창** 의 모듈에서 가져옵니다. 단독 실행에서는 대부분 비어 있거나 응답이 오지 않습니다.

::: warning UWA/Environments/Dashboard 는 3DDashboard 가 아닙니다
`UWA/Environments/Dashboard` 는 macOS 의 Dashboard 위젯용입니다 (`/System/Library/WidgetResources/resize.png`). 3DDashboard 위젯은 `Frame` 환경에서 실행됩니다.
:::

## 위젯 HTML 구조

```html
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:widget="http://www.netvibes.com/ns/">
<head>
  <title>Parts</title>
  <meta name="author" content="..." />
  <meta name="description" content="..." />
  <meta name="autoRefresh" content="0" />

  <link rel="stylesheet" type="text/css" href="../c/UWA/assets/css/standalone.css" />
  <script type="text/javascript" src="../AmdLoader/AmdLoader.js"></script>
  <script type="text/javascript" src="../c/UWA/js/UWA_Standalone_Alone.js"></script>

  <widget:preferences>
    <widget:preference name="x3dPlatformId" type="hidden" defaultValue=""></widget:preference>
    <widget:preference name="pageSize" type="range" label="Page size" defaultValue="20" min="10" max="100" step="10"></widget:preference>
  </widget:preferences>

  <script type="text/javascript">
  //<![CDATA[
    require(['DS/MyWidget/MyWidget'], function (MyWidget) {
      widget.addEvents({
        onLoad: function () { MyWidget.start(widget); },
        onRefresh: function () { MyWidget.refresh(); }
      });
    });
  //]]>
  </script>
</head>
<body>
  <p>Loading...</p>
</body>
</html>
```

| 부분 | 쓰임 |
| --- | --- |
| `<title>` | 위젯 제목 첫 값. 코드에서 `widget.setTitle` 로 바꿈 |
| `<meta name="...">` | `widget.metas` 로 들어감. `autoRefresh` (분), `apiVersion`, `debugMode` 등 |
| `<link rel="icon">` | 위젯 아이콘 |
| `<widget:preferences>` | 설정 항목 ([위젯 설정](/widget/preferences)) |
| `<script>` (본문 있음) | 위젯 코드. 대시보드에서는 `function (widget) { ... }` 로 감싸져 실행됨 |
| `<script src>` | 대시보드에서는 `Standalone` 이 들어간 주소만 빼고 다시 읽음 |
| `<body>` | 처음 보이는 내용. `widget.body` 안에 들어감 |

::: tip XHTML 로 씁니다
대시보드는 위젯 HTML 을 먼저 XML 로 읽고, 실패하면 HTML 로 다시 읽습니다. ENOVIA 위젯처럼 태그를 모두 닫고 스크립트는 `//<![CDATA[ ... //]]>` 로 감싸 두면 어느 쪽이든 같게 읽힙니다. `<widget:preference>` 는 `/>` 대신 `</widget:preference>` 로 닫는 편이 안전합니다. 브라우저 HTML 해석에서는 `<widget:preference ... />` 가 닫히지 않은 것으로 처리되어 다음 항목이 안쪽으로 들어갑니다.
:::

::: warning widget 은 require 콜백 안에서 씁니다
단독 실행에서 전역 `widget` 은 `UWA_Standalone_Alone.js` 가 로드된 **직후가 아니라** 다음 순간(AMD 모듈 `widget` 실행 시) 생깁니다. `<script>` 최상단에서 바로 `widget.addEvent(...)` 를 부르면 `widget is not defined` 가 날 수 있습니다. ENOVIA 위젯처럼 `require([...], function () { widget... })` 안에서 씁니다. `onLoad` 가 이미 지나간 뒤에 `addEvent('onLoad', fn)` 를 해도 `fn` 은 바로 한 번 실행됩니다.
:::

## 시작 순서

| 순서 | 일 | 이벤트 |
| --- | --- | --- |
| 1 | 환경 준비, `widget.body` 연결 | `onRegisterWidget` (환경 내부) |
| 2 | 메타, 아이콘, 설정 항목 읽기 | |
| 3 | 저장된 설정 값 적용 | `onInitConfig` |
| 4 | 시작 | `beforeLoad` → **`onLoad`** → `afterLoad` |
| 5 | 사용 중 | `onRefresh`, `onResize`, `onViewChange`, `onEdit` / `endEdit`, `onSearch` ... |

이벤트 목록은 [widget 객체](/widget/widget-api#이벤트) 에 있습니다.

## 무엇을 어디서 얻나

| 얻을 것 | 쓰는 것 | 문서 |
| --- | --- | --- |
| 화면 영역, 제목, 설정 값, 이벤트 | 전역 `widget` | [widget 객체](/widget/widget-api), [위젯 설정](/widget/preferences) |
| 위젯이 속한 플랫폼 id | `widget.getValue('x3dPlatformId')` | [위젯 설정](/widget/preferences#플랫폼이-넣어-주는-값) |
| 로그인 사용자, 테넌트, 대시보드 설정, 위젯 간 메시지 | `DS/PlatformAPI/PlatformAPI` | [PlatformAPI](/widget/platform-api) |
| 3DSpace / 3DSwym / 3DSearch 서버 주소, 역할, 앱 정보 | `DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices` | [Compass 서비스](/widget/compass-services) |
| 3DSpace 주소, SecurityContext 를 한 번에 (ENOVIA 앱 공용 도우미) | `DS/WidgetServices/WidgetServices` | [WidgetServices](/widget/widget-services) |
| 3DSpace REST 호출 | `DS/WAFData/WAFData` | [서버 호출](/uwa/request) |
| 3DSpace 주소 + SecurityContext 를 얻는 순서 정리 | - | [3DSpace 주소와 SecurityContext](/widget/space-url) |

## 자주 틀리는 것

| 틀린 생각 | 실제 | 문서 |
| --- | --- | --- |
| 3DDashboard 위젯은 `UWA/Environments/Dashboard` | `Frame` 환경. Dashboard 는 macOS 용 | [실행 환경](#실행-환경) |
| `widget.getValue('pageSize')` 는 숫자 | 문자열 `'20'`. `widget.getInt` 를 씀 | [위젯 설정](/widget/preferences#값의-형태) |
| `onRefresh` 를 안 달면 아무 일 없음 | `onRefresh` 핸들러가 없으면 `onLoad` 가 다시 불림 | [widget 객체](/widget/widget-api#onrefresh) |
| `addPreference` 로 `defaultValue` 를 바꾸면 바로 반영 | 이미 `getValue` 로 읽은 값은 캐시되어 그대로 | [위젯 설정](/widget/preferences#getvalue-가-값을-찾는-순서) |
| 설정 type 은 아무 값이나 | 7 가지 외의 type 은 **조용히 무시** 되어 항목이 생기지 않음 | [위젯 설정](/widget/preferences#type) |
| `PlatformAPI.getUser()` 는 언제나 사용자를 줌 | 대시보드 밖에서는 `undefined` | [PlatformAPI](/widget/platform-api) |
| `getServiceUrl` 은 실패하면 `onFailure` | 단독 실행에서는 둘 다 안 불리고 끝나지 않을 수 있음 | [Compass 서비스](/widget/compass-services#getserviceurl) |
| `getGrantedRoles({ onComplete })` | 인자는 콜백 함수 하나 | [Compass 서비스](/widget/compass-services#getgrantedroles) |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [widget 객체](/widget/widget-api) | 화면 영역, 제목, 값 읽기 / 쓰기, 이벤트 (`onLoad`, `onRefresh` ...) |
| [위젯 설정 (preferences)](/widget/preferences) | 설정 항목 정의, type, 값의 형태, 플랫폼이 넣어 주는 값 |
| [3DDashboard 에 위젯 올리기](/widget/dashboard-register) | 배포 위치와 주소, Run Your App, Additional App 등록 |
| [PlatformAPI](/widget/platform-api) | 로그인 사용자, 테넌트, 대시보드 설정, 위젯 간 publish / subscribe |
| [Compass 서비스](/widget/compass-services) | 서비스 주소, 부여된 역할, 앱 정보, 다른 앱으로 열기 |
| [WidgetServices](/widget/widget-services) | ENOVIA 앱 공용 도우미. 플랫폼 id, 언어, 3DSpace 주소 |
| [3DSpace 주소와 SecurityContext](/widget/space-url) | 플랫폼 id → 3DSpace 주소 → SecurityContext 를 얻는 순서 |

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [WidgetSample.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.html) | 위젯 HTML, `widget:preferences` (hidden, range, boolean, list) | [위젯 설정](/widget/preferences) |
| [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) | `i18n!` / `css!`, onLoad / onRefresh / endEdit / onResize / onViewChange, `addPreference` 로 SecurityContext 목록 추가, 3DSpace 주소 얻기 | [widget 객체](/widget/widget-api), [3DSpace 주소와 SecurityContext](/widget/space-url) |

::: warning
샘플은 `<3DSpace>/webapps/WidgetSample/` 에 두고 ENOVIA 서버 주소로 열어야 동작합니다. 단독 실행에서는 Compass 응답이 없어 5 초 뒤 webapps 주소로 3DSpace 주소를 계산합니다. 단독 실행은 jsdom 과 모의 서버(enovia2025 webapps 파일 + 가짜 pno/person 응답)에서 NLS 요청 순서, 설정 라벨 번역, onLoad / onRefresh, SecurityContext 목록까지 확인했습니다. 실제 서버와 3DDashboard 안에서는 아직 확인하지 않았습니다. 다르게 동작하면 원본 쪽이 맞습니다.
:::
