# 모듈 경로 색인

원본 소스의 `define([...])`, `require([...])` 에서 본 모듈 경로로 문서를 찾는 표입니다. 경로의 일부만 알면 <kbd>Ctrl</kbd> + <kbd>F</kbd> 로 이 페이지 안에서 찾습니다.

- `DS/폴더/모듈` 은 `webapps/폴더/` 아래 파일에 들어 있습니다. 한 파일에 여러 모듈이 묶여 있는 경우가 많습니다. → [AMD 로딩](/amd/)
- 여기 없는 모듈은 아직 분석하지 않은 것입니다. 없는 모듈이라는 뜻이 아닙니다.

## 로딩, 공통 유틸

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `DS/WebappsUtils/WebappsUtils` | webapps 폴더 주소, 자산(이미지, 아이콘) 주소 | [WebappsUtils](/amd/webapps-utils) |
| `DS/WebappsUtils/Utils` | uuid, 쿠키, debounce, throttle | [WebappsUtils](/amd/webapps-utils) |
| `DS/WebappsUtils/Emitter`, `Inherit`, `Promise`, `Map`, `Console`, `Performance`, `BetaOptions` | 보조 모듈 | [WebappsUtils](/amd/webapps-utils) |
| `i18n!`, `css!`, `text!` 접두어 | 다국어, 스타일, 텍스트 플러그인 | [플러그인](/amd/plugins) |

## 위젯, 플랫폼

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `UWA/Widget` | 전역 `widget` 객체의 클래스 | [widget 객체](/widget/widget-api) |
| `UWA/Environments/Dashboard` | 위젯 실행 환경 (3DDashboard 가 아님) | [위젯 개요](/widget/) |
| `DS/PlatformAPI/PlatformAPI` | 로그인 사용자, 테넌트, 대시보드 설정, 위젯 간 publish / subscribe | [PlatformAPI](/widget/platform-api) |
| `DS/UWPClientCode/PublicAPI`, `DS/Tenant/Tenant`, `DS/PubSub/PubSub` | PlatformAPI 가 내부에서 쓰는 모듈 | [PlatformAPI](/widget/platform-api) |
| `DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices` | 서비스 주소(3DSpace, 3DSwym ...), 역할, 앱 정보 | [Compass 서비스](/widget/compass-services) |
| `DS/i3DXCompass/i3DXCompassServices`, `DS/i3DXCompass/i3DXCompass` | 위 모듈의 실제 구현 | [Compass 서비스](/widget/compass-services) |
| `DS/i3DXCompass/ServiceApi/GrantedRolesApi`, `PortfolioApi` | 부여된 역할 조회 | [Compass 서비스](/widget/compass-services#getgrantedroles) |
| `DS/i3DXCompassPlatformServices/OpenWith` | "다른 앱으로 열기" 메뉴 | [Compass 서비스](/widget/compass-services#openwith) |
| `DS/WidgetServices/WidgetServices` | 3DSpace 주소, SecurityContext 보조 함수 | [WidgetServices](/widget/widget-services) |
| `DS/WidgetServices/securityContextServices/SecurityContextServices` | SecurityContext 목록과 선택 값 | [WidgetServices](/widget/widget-services) · [3DSpace 주소와 SecurityContext](/widget/space-url) |

## 서버 호출

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `DS/WAFData/WAFData` | 3DSpace REST 호출 (`authenticatedRequest`) | [서버 호출](/uwa/request) · [REST 공통 규칙](/rest-api/) |
| `UWA/Data` | UWA 의 요청 함수. 3DSpace 호출에는 직접 쓰지 않음 | [서버 호출](/uwa/request) |

## UWA

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `UWA/Core` | 기반 함수 (`UWA.extend`, `UWA.createElement` ...) | [Core 유틸](/uwa/core) |
| `UWA/Utils`, `UWA/String`, `UWA/Array`, `UWA/Json` | 유틸 | [Core 유틸](/uwa/core) |
| `UWA/Utils/Client` | 브라우저, OS, 기능 지원 여부 | [Core 유틸](/uwa/core#환경-정보-utils-client) |
| `UWA/Element`, `UWA/Event` | DOM 요소 확장, 이벤트 | [DOM](/uwa/element) |
| `UWA/Class` | 클래스 정의 (`extend`, `_parent`) | [클래스](/uwa/class) |
| `UWA/Class/Options`, `Events`, `Listener`, `Timed`, `Debug` | 클래스에 섞어 쓰는 기능 | [클래스](/uwa/class) |
| `UWA/Class/Model`, `Collection`, `View`, `Store` | Model, Collection, View | [Model, Collection, View](/uwa/mvc) |
| `UWA/Promise`, `UWA/Class/Promise` | Promise | [Promise](/uwa/promise) |
| `UWA/Utils/InterCom` | 위젯 간 통신 | [InterCom](/uwa/intercom) |

## 화면 컨트롤

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `DS/Controls/Button` | 버튼 | [WebUX 컨트롤](/controls/webux-controls#button) · [API](/controls/api/webux-controls) |
| `DS/Controls/Toggle` | 체크박스, 스위치, 라디오 | [WebUX 컨트롤](/controls/webux-controls#toggle) |
| `DS/Controls/LineEditor`, `DS/Controls/Editor` | 한 줄 / 여러 줄 입력 | [WebUX 컨트롤](/controls/webux-controls#lineeditor-editor) |
| `DS/Controls/ComboBox` | 선택 목록 | [WebUX 컨트롤](/controls/webux-controls#combobox) |
| `DS/Controls/Loader`, `DS/Controls/ModalLoader` | 로딩 표시, 로딩 가리개 | [WebUX 컨트롤](/controls/webux-controls#loader-modalloader) |
| `DS/Controls/ButtonGroup`, `Label`, `Expander`, `Popup`, `ProgressBar` | 그 밖의 WebUX 컨트롤 | [WebUX 컨트롤 API](/controls/api/webux-controls) |
| `DS/Controls/Abstract`, `DS/Controls/AbstractEditor`, `DS/Core/BaseComponent` | WebUX 컨트롤의 공통 바탕 | [WebUX 컨트롤 API](/controls/api/webux-controls) |
| `DS/Core/TooltipModel`, `DS/Controls/TooltipModel` | 툴팁 내용 | [WebUX 컨트롤](/controls/webux-controls#툴팁) |
| `DS/Windows/Dialog` | 모달 다이얼로그 | [다이얼로그](/controls/dialog) · [Windows API](/controls/api/windows) |
| `DS/Windows/ImmersiveFrame`, `Panel`, `Window` | 다이얼로그를 올리는 틀, 패널 | [Windows API](/controls/api/windows) |
| `DS/Notifications/NotificationsManagerUXMessages`, `NotificationsManagerViewOnScreen` | 알림 메시지 | [알림 메시지](/controls/notifications) |
| `DS/UIKIT/Modal`, `DS/UIKIT/SuperModal` | UIKIT 모달, 확인 창 | [UIKIT](/controls/uikit) · [UIKIT API](/controls/api/uikit) |
| `DS/UIKIT/Mask` | 로딩 가리개 | [UIKIT](/controls/uikit#mask) |
| `DS/UIKIT/Alert`, `DropdownMenu`, `Form`, `Popover`, `Tooltip` | UIKIT 컨트롤 | [UIKIT](/controls/uikit) |
| `DS/UIKIT/Input/Button`, `IconButton`, `Select`, `Text`, `Toggle` | UIKIT 입력 컨트롤 | [UIKIT](/controls/uikit) · [무엇을 쓸까](/controls/#무엇을-쓸까) |

## 이벤트, 선택, 끌어 놓기

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `DS/CoreEvents/Events` | 창 전체에서 하나인 publish / subscribe | [PubSub](/events/pubsub) |
| `DS/CoreEvents/ModelEvents` | 만들어서 공유하는 publish / subscribe | [PubSub](/events/pubsub) |
| `DS/Selection/CSOManager`, `HSOManager`, `PSOManager`, `DS/Selection/XSO` | 선택된 객체 공유 | [선택](/events/selection) |
| `DS/DataDragAndDrop/DataDragAndDrop` | 끌기, 놓기 | [끌어 놓기](/events/drag-and-drop) |
| `DS/3DXContentChecker/3DXContentChecker_v2.1` | 끌어 놓기 데이터(3DXContent) 검사 | [끌어 놓기](/events/drag-and-drop) |

## DataGridView, Tweakers

| 모듈 | 내용 | 문서 |
| --- | --- | --- |
| `DS/DataGridView/DataGridView` | 트리 / 표 그리드 | [DataGridView](/datagridview/) · [옵션](/datagridview/api/grid-options) · [메서드](/datagridview/api/grid-methods) |
| `DS/CollectionView/CollectionView` | 그리드의 부모 클래스. 2026 에서 일부 메서드가 여기로 옮겨짐 | [그리드 메서드](/datagridview/api/grid-methods) |
| `DS/TreeModel/TreeDocument`, `DS/TreeModel/TreeNodeModel` | 그리드 데이터 (행) | [데이터 (TreeDocument)](/datagridview/api/data) |
| `DS/Tweakers/TypeRepresentationFactory` | 값 타입별 편집기 등록, 생성 | [사용자 타입 등록](/tweakers/custom-type) · [API](/tweakers/api/type-representation-factory) |
| `DS/Tweakers/TweakerString`, `TweakerNumber`, `TweakerBoolean` | 값 타입별 편집기 | [편집기 단독 사용](/tweakers/standalone) · [API](/tweakers/api/tweaker) |
| `DS/Tweakers/GeneratedToolbar` | JSON 으로 만드는 툴바 | [GeneratedToolbar](/tweakers/generated-toolbar) · [API](/tweakers/api/generated-toolbar) |
