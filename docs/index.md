---
layout: home

hero:
  name: ENOVIA 분석 사양서
  text: 3DSpace 서버 · webapps 개발 사양
  tagline: 공식 사양서가 없는 ENOVIA(3DEXPERIENCE) 를 원본 소스로 분석해 정리한 구조, API, 설정 키, 예제
  actions:
    - theme: brand
      text: 처음 읽는 순서
      link: /guide/roadmap
    - theme: alt
      text: 3DSpace 서버
      link: /schema/
    - theme: alt
      text: webapps
      link: /widget/

features:
  - title: 3DSpace 서버
    details: 데이터 모델과 MQL, 화면 정의(command, table, webform), JPO, 트리거, properties
    link: /schema/
    linkText: 데이터 모델부터
  - title: webapps
    details: AMD 로딩, 위젯과 플랫폼, UWA, 화면 컨트롤, 이벤트, REST API, DataGridView, Tweakers
    link: /widget/
    linkText: 위젯부터
  - title: 레퍼런스
    details: settings 키, JPO 인자 구조, REST 엔드포인트, 컨트롤 옵션 표. 키 이름은 상단 검색(Ctrl + K)
    link: /ui-components/settings
    linkText: settings 레퍼런스
---

## 3DSpace 서버

3DSpace 고전 화면과 서버 로직입니다. 화면 하나는 보통 **데이터 정의(MQL) → 화면 정의 → JPO** 순서로 만듭니다.

| 분야 | 내용 | 문서 |
| --- | --- | --- |
| 데이터 모델 / MQL | type, attribute, policy, relationship, role. MQL 문법과 조회 | [개요](/schema/) · [Admin 객체](/schema/admin) · [Policy](/schema/policy) · [MQL 문법](/schema/mql) · [mql 폴더 규칙](/schema/conventions) |
| UI 구성 요소 | command, menu, table, webform, portal, channel 로 화면 조립 | [개요](/ui-components/) · [command, menu](/ui-components/command-menu) · [table](/ui-components/table) · [webform](/ui-components/webform) · [portal, channel](/ui-components/portal-channel) |
| JPO | 화면과 트리거에서 부르는 서버 Java 코드 | [개요](/jpo/) · [인자 구조](/jpo/args) · [DomainObject, select](/jpo/domain-object) · [MqlUtil](/jpo/mql-util) · [트랜잭션, 권한 전환](/jpo/transaction-context) · [다국어, 예외](/jpo/i18n-exception) |
| 트리거 | 생성, 수정, promote 때 실행되는 검사와 후처리 | [개요](/trigger/) · [등록](/trigger/register) · [JPO 인자](/trigger/jpo-args) · [라이프사이클](/trigger/lifecycle) · [채번기](/trigger/generator) |
| properties | 다국어 문자열과 시스템 설정 | [개요](/properties/) · [문자열 리소스](/properties/string-resource) · [시스템 설정](/properties/system-settings) |

## webapps

3DDashboard 위젯과 브라우저 쪽 화면입니다.

| 분야 | 내용 | 문서 |
| --- | --- | --- |
| AMD 로딩 | 모듈 이름 규칙, `i18n!` · `css!` · `text!` 플러그인 | [개요](/amd/) · [플러그인](/amd/plugins) · [WebappsUtils](/amd/webapps-utils) |
| 위젯과 플랫폼 | `widget` 객체, 설정, 플랫폼 서비스 | [개요](/widget/) · [widget 객체](/widget/widget-api) · [설정](/widget/preferences) · [PlatformAPI](/widget/platform-api) · [Compass 서비스](/widget/compass-services) · [3DSpace 주소, SecurityContext](/widget/space-url) |
| UWA | 기반 라이브러리 | [개요](/uwa/) · [Core 유틸](/uwa/core) · [DOM](/uwa/element) · [클래스](/uwa/class) · [Model, View](/uwa/mvc) · [Promise](/uwa/promise) · [서버 호출](/uwa/request) · [InterCom](/uwa/intercom) |
| 화면 컨트롤 | 버튼, 입력칸, 다이얼로그, 알림 | [개요](/controls/) · [WebUX 컨트롤](/controls/webux-controls) · [다이얼로그](/controls/dialog) · [UIKIT](/controls/uikit) · [알림](/controls/notifications) |
| 이벤트 | 위젯 간 연동, 선택, 끌어 놓기 | [개요](/events/) · [PubSub](/events/pubsub) · [선택](/events/selection) · [끌어 놓기](/events/drag-and-drop) |
| REST API | 3DSpace REST 호출 규칙과 엔드포인트 | [공통 규칙](/rest-api/) · [보안 컨텍스트](/rest-api/security-context) · [엔드포인트 목록](/rest-api/catalog) · [documents](/rest-api/documents) |
| DataGridView | 트리 / 표 그리드 | [개요](/datagridview/) · [기본 그리드](/datagridview/getting-started) · [셀 타입](/datagridview/cell-types) · [편집](/datagridview/editing) · [툴바](/datagridview/toolbar) |
| Tweakers | 셀, 툴바, 폼의 편집기 | [개요](/tweakers/) · [단독 사용](/tweakers/standalone) · [사용자 타입](/tweakers/custom-type) · [GeneratedToolbar](/tweakers/generated-toolbar) |

## 하고 싶은 일로 찾기

| 하고 싶은 일 | 문서 |
| --- | --- |
| 새 type 과 attribute 를 만들고 싶다 | [Admin 객체](/schema/admin) → [mql 폴더 규칙](/schema/conventions) |
| 상태별 권한을 바꾸고 싶다 | [Policy](/schema/policy) |
| 메뉴에 명령을 추가하고 싶다 | [command, menu](/ui-components/command-menu) |
| 목록 화면(표)을 만들고 싶다 | [table](/ui-components/table) → [JPO 인자 구조](/jpo/args) |
| 상세 / 생성 화면을 만들고 싶다 | [webform](/ui-components/webform) → [JPO 인자 구조](/jpo/args) |
| 명령을 특정 사람에게만 보이고 싶다 | [settings 레퍼런스](/ui-components/settings) → [JPO 인자 구조](/jpo/args) |
| 객체와 연결된 객체를 조회하고 싶다 | [DomainObject, select](/jpo/domain-object) |
| 저장이나 승인 전에 검사하고 싶다 | [트리거](/trigger/) → [트리거 JPO 인자](/trigger/jpo-args) |
| 화면 글자를 다국어로 바꾸고 싶다 | [문자열 리소스](/properties/string-resource) |
| 위젯을 처음 만들고 싶다 | [위젯 개요](/widget/) → [AMD 로딩](/amd/) |
| 위젯에서 3DSpace 데이터를 읽고 쓰고 싶다 | [3DSpace 주소, SecurityContext](/widget/space-url) → [서버 호출](/uwa/request) → [REST API](/rest-api/) |
| 위젯에 목록 그리드를 넣고 싶다 | [DataGridView](/datagridview/) |
| 확인 다이얼로그, 알림 메시지를 띄우고 싶다 | [다이얼로그](/controls/dialog) · [알림](/controls/notifications) |
| 다른 위젯에서 끌어 온 객체를 받고 싶다 | [끌어 놓기](/events/drag-and-drop) |

## 레퍼런스 바로가기

| 레퍼런스 | 내용 |
| --- | --- |
| [settings 레퍼런스](/ui-components/settings) | command, table column, webform field 의 setting 키 |
| [URL 파라미터](/ui-components/url-parameters) | emxIndentedTable.jsp, emxForm.jsp 등 화면 JSP 파라미터 |
| [JPO 인자 구조](/jpo/args) | 호출 종류별 programMap 구조와 반환 형식 |
| [REST 엔드포인트](/rest-api/catalog) | `resources/v1/modeler/*` 목록 |
| [컨트롤 API](/controls/api/webux-controls) | WebUX 컨트롤 옵션, 이벤트 |
| [DataGridView API](/datagridview/api/grid-options) | 그리드, 컬럼, 이벤트 옵션 |
| [Tweakers API](/tweakers/api/tweaker) · [semantics](/tweakers/api/semantics) | 편집기 속성, 세부 옵션 |

## 이 문서에 대해

- 모든 내용은 원본 소스(enovia2025, 부족하면 2026)에서 확인한 것입니다. 페이지마다 "근거" 상자에 원본 파일을 적어 둡니다. → [표기 규칙](/guide/)
- 2025, 2026 한쪽에만 있는 기능은 배지로 표시합니다.
- 문서를 추가하는 방법은 [문서 추가 방법](/guide/contributing) 에 있습니다.
