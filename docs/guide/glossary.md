# 용어집

이 문서에 반복해서 나오는 말을 한 줄로 풀고, 자세한 설명이 있는 페이지로 잇습니다. 처음 읽을 때 막히는 말이 있으면 여기서 찾습니다.

## 제품과 실행 환경

| 용어 | 뜻 | 자세히 |
| --- | --- | --- |
| 3DEXPERIENCE | 다쏘시스템의 플랫폼 이름. ENOVIA 는 그 안의 데이터, 프로세스 관리 제품군 | [문서 소개](/guide/) |
| 3DSpace | 업무 데이터를 가진 서버(웹앱). JPO, MQL, REST 가 여기서 돎 | [서버 반영 절차](/deploy/) |
| 3DDashboard | 위젯을 올려 쓰는 화면. 위젯은 각자 iframe 에서 돎 | [위젯 개요](/widget/#실행-환경) |
| 3DPassport | 로그인(SSO) 서버 | [서버 호출](/uwa/request) |
| 3DCompass | 앱 목록과 서비스 주소를 알려 주는 서비스 | [i3DXCompassServices](/widget/compass-services) |
| Platform Management | 구성원, 역할, 앱을 관리하는 관리자 화면 | [Additional App 으로 등록](/widget/dashboard-register#additional-app-으로-등록) |
| Additional App | 관리자가 주소를 넣어 Compass 에 추가한 앱 (위젯, 웹 페이지, PC 프로그램) | [Additional App 으로 등록](/widget/dashboard-register#additional-app-으로-등록) |
| Run Your App | 주소를 넣으면 그 위젯으로 바뀌는 OOTB 위젯. 개발 중 확인용 | [Run Your App 으로 열기](/widget/dashboard-register#run-your-app-으로-열기) |
| OOTB | Out Of The Box. 제품이 처음부터 주는 것. "커스텀" 의 반대말 | [OOTB 수정 규칙](/schema/conventions#ootb-수정-규칙) |
| tenant, 플랫폼 id | 한 서버 묶음을 가리키는 id. 온프레미스는 보통 `OnPremise` | [플랫폼 id](/widget/space-url#플랫폼-id) |
| webapps | 3DSpace 의 `webapps/` 폴더. 웹 화면 모듈이 폴더 하나씩 들어 있음 | [모듈 경로 색인](/guide/module-index) |

## 데이터 모델

| 용어 | 뜻 | 자세히 |
| --- | --- | --- |
| admin 객체 | 스키마를 이루는 정의. type, attribute, relationship, policy, role, command, table 등 | [admin 객체 한눈에](/schema/#admin-객체-한눈에) |
| business object | 업무 데이터 한 건. type 의 인스턴스 | [business object 식별](/schema/#business-object-식별) |
| TNR | type, name, revision. business object 를 구별하는 세 값 | [business object 식별](/schema/#business-object-식별) |
| id, physicalid | 시스템이 붙이는 객체 id. 웹(REST, 위젯)은 주로 physicalid (32 자리 16 진수) 를 씀 | [select 문법](/jpo/domain-object#객체) |
| type | 객체의 종류. 상속 구조를 가짐 | [type](/schema/admin#type) |
| attribute | type 이나 relationship 에 붙는 값 | [attribute](/schema/admin#attribute) |
| relationship | 두 객체를 잇는 연결. from 쪽과 to 쪽이 있음 | [relationship](/schema/admin#relationship) |
| policy | type 의 상태 흐름과 상태별 권한을 정한 것 | [policy](/schema/policy) |
| state, current | policy 안의 상태. 객체의 지금 상태가 `current` | [정의](/schema/policy#정의) |
| promote, demote | 다음 상태로 올리기, 이전 상태로 내리기 | [트리거 수명 주기](/trigger/lifecycle) |
| role | 권한을 주는 단위 | [role](/schema/admin#role) |
| vault | 객체의 저장 구역. 업무 데이터는 `eService Production` | [business object 식별](/schema/#business-object-식별) |
| 심볼릭 이름 | `type_Part` 처럼 코드가 스키마를 찾을 때 쓰는 별명. 실제 이름이 바뀌어도 코드를 고치지 않으려고 씀 | [심볼릭 이름](/schema/#심볼릭-이름) |
| MQL | Matrix Query Language. 스키마를 만들고 데이터를 다루는 명령 언어 | [MQL 기본](/schema/mql) |
| property | admin 객체에 붙이는 이름-값 표시. 설치 버전, 원래 이름 등을 적음 | [property](/schema/mql#property) |
| 채번기 | 이름을 접두어 + 일련번호로 자동으로 만드는 객체 (`eService Object Generator`) | [채번기](/schema/conventions#채번기-13-generator) |
| SecurityContext | `ctx::역할.조직.협업공간`. 어떤 자격으로 일하는지를 나타내는 문자열 | [SecurityContext](/rest-api/security-context#형식) |
| 협업공간 | Collaborative Space. 데이터를 나눠 담는 공간. 권한의 한 축 | [SecurityContext](/rest-api/security-context#형식) |

## 서버 화면 (UI 정의)

| 용어 | 뜻 | 자세히 |
| --- | --- | --- |
| command | 버튼이나 링크 하나. `href` 와 setting 을 가짐 | [command, menu](/ui-components/command-menu#command-정의) |
| menu | command 와 menu 의 묶음. 툴바, 탭, 객체 트리에 쓰임 | [menu 정의](/ui-components/command-menu#menu-정의) |
| table | 목록 화면의 컬럼 정의 | [table](/ui-components/table) |
| form (webform) | 속성 화면, 생성 화면의 필드 정의 | [form](/ui-components/webform) |
| portal, channel | 한 화면을 여러 칸으로 나누고 칸마다 탭을 넣는 구성 | [portal, channel](/ui-components/portal-channel) |
| setting | UI 정의에 붙이는 이름-값 옵션 (`Target Location`, `Registered Suite` ...) | [setting 사전](/ui-components/settings) |
| Structure Browser | 트리 형태의 목록 화면 (`emxIndentedTable.jsp`) | [table](/ui-components/table) |
| Registered Suite | 그 UI 정의가 속한 앱. 어떤 문자열 파일과 폴더를 쓸지 정함 | [공통 규칙](/ui-components/#공통-규칙) |
| StringResource | 화면 글자를 담은 properties. 언어별 파일이 있음 | [문자열 리소스](/properties/string-resource) |
| Reload Cache | 서버가 기억해 둔 UI 정의와 심볼릭 이름을 다시 읽게 하는 관리자 메뉴 | [Reload Cache](/deploy/#reload-cache) |

## 서버 코드

| 용어 | 뜻 | 자세히 |
| --- | --- | --- |
| JPO | Java Program Object. DB 에 저장되고 서버가 컴파일해 실행하는 Java class | [JPO 개요](/jpo/) |
| program 객체 | JPO 소스나 CSS 같은 코드를 담는 admin 객체 | [OOTB program 을 고칠 때](/deploy/#ootb-program-을-고칠-때) |
| `_mxJPO` | JPO 파일과 class 이름 끝에 붙는 접미어 | [이름 규칙](/jpo/#이름-규칙) |
| `${CLASSNAME}`, `${CLASS:이름}` | JPO 소스에서 자기 class, 다른 JPO class 를 가리키는 매크로 | [매크로](/jpo/#classname-class-이름) |
| 패키지 JPO | `package` 선언이 있는 JPO. 설정에는 `jpo.plmprovider.Connect` 처럼 패키지까지 씀 | [패키지가 있는 JPO](/jpo/#패키지가-있는-jpo) |
| `mxMain` | 메서드 이름 없이 JPO 를 실행할 때 불리는 기본 메서드. `execute program`, 트리거가 씀 | [MQL 에서 실행](/jpo/#mql-에서-실행-mxmain) |
| Context | 접속 사용자, 역할, 트랜잭션을 가진 객체. 거의 모든 API 의 첫 인자 | [Context 와 트랜잭션](/jpo/transaction-context) |
| programMap, paramMap, requestMap | 화면이 JPO 에 넘기는 `Map`. `JPO.unpackArgs(args)` 로 꺼냄 | [호출 형태별 인자](/jpo/args#공통) |
| packArgs, unpackArgs | `Map` 을 `String[]` 로 싸고 푸는 함수. JPO 인자 전달에 씀 | [다른 JPO 에서](/jpo/#다른-jpo-에서) |
| DomainObject | business object 를 다루는 Java class | [DomainObject](/jpo/domain-object) |
| select | 객체에서 읽을 값을 가리키는 표현식 (`attribute[X]`, `from[R].to.name`) | [select 문법](/jpo/domain-object#select-문법) |
| MapList, StringList | 조회 결과와 select 목록에 쓰는 컬렉션 | [MapList, StringList](/jpo/domain-object#maplist-stringlist) |
| pushContext | 잠깐 슈퍼유저로 바꿔 실행하는 호출. `popContext` 로 되돌림 | [pushContext](/jpo/transaction-context#슈퍼유저로-바꾸기-pushcontext) |
| trigger | 생성, 수정, promote 같은 이벤트에 걸어 두는 JPO 호출 | [트리거 개요](/trigger/) |
| Check, Action, Override | 트리거의 세 시점. 막기, 뒤처리, 대신 실행 | [Check, Action, Override](/trigger/#check-action-override) |
| 트리거 설정 객체 | `eService Trigger Program Parameters` type 의 객체. 어떤 JPO 를 어떤 인자로 부를지 담음 | [등록](/trigger/register#_1-설정-객체-만들기) |
| Modeler, Service | 커스텀 REST 주소를 만드는 두 class | [커스텀 REST 서비스](/server-java/rest-service) |
| 인터페이스 테이블 | 외부 시스템과 데이터를 주고받는 중간 테이블 | [외부 DB](/server-java/external-db#인터페이스-테이블) |

## 웹 (위젯, 화면 컨트롤)

| 용어 | 뜻 | 자세히 |
| --- | --- | --- |
| AMD | `define` / `require` 로 모듈을 불러오는 방식. 모듈 이름은 `DS/폴더/파일` | [AMD 로딩](/amd/) |
| 묶음 파일 | 한 폴더의 모듈들을 합쳐 minify 한 파일. 원본 분석의 주 대상 | [묶음 파일](/amd/#묶음-파일-concatenated-module) |
| UWA | 위젯 실행 틀과 기본 라이브러리 (class, DOM, 요청) | [UWA 개요](/uwa/) |
| widget | 3DDashboard 에 올리는 화면 단위. 전역 `widget` 객체로 설정과 이벤트를 다룸 | [위젯 개요](/widget/) |
| preference | 위젯마다 저장되는 설정 값 | [preference](/widget/preferences) |
| WAFData | 로그인 정보를 붙여 서버를 부르는 요청 모듈 | [서버 호출](/uwa/request) |
| CSRF 토큰 | 3DSpace 에 쓰기 요청을 할 때 먼저 받아 헤더에 넣는 값 | [CSRF 토큰](/uwa/request#csrf-토큰-3dspace-쓰기-요청) |
| PlatformAPI | 위젯 사이에 메시지를 주고받고 플랫폼 정보를 얻는 모듈 | [PlatformAPI](/widget/platform-api) |
| i3DXCompassServices | 서비스 주소, 사용자, 역할을 얻는 모듈 | [i3DXCompassServices](/widget/compass-services) |
| WebUX (WUX), UIKIT | 화면 컨트롤의 두 계열 | [두 계열의 차이](/controls/#두-계열의-차이) |
| DataGridView | WebUX 의 표 / 트리 그리드 | [DataGridView](/datagridview/) |
| TreeDocument, TreeNodeModel | 그리드의 데이터 모델. 문서 하나에 행(노드)들이 달림 | [구성 요소](/datagridview/#구성-요소) |
| typeRepresentation | 컬럼의 타입 이름. 셀 모양과 편집기를 정함 | [typeRepresentation](/datagridview/api/type-representation) |
| semantics | 편집기에 넘기는 세부 옵션 (`possibleValues`, `minValue` ...) | [semantics](/tweakers/api/semantics) |
| Tweaker | 값 하나를 보여 주고 고치는 편집기 컨트롤 | [Tweakers](/tweakers/) |
| XSO, CSO | 선택 목록 객체. CSO 는 그 창의 "현재 선택" | [선택](/events/selection) |
| ModelEvents | 화면 부품 사이에서 쓰는 publish / subscribe 객체 | [ModelEvents](/events/pubsub#modelevents) |

## 이 문서에서 쓰는 말

| 용어 | 뜻 | 자세히 |
| --- | --- | --- |
| 원본 분석 | minify 된 원본 소스를 읽어 정리한 내용 | [작성 규칙](/guide/contributing) |
| 서버 확인 | 실제 서버에서 동작을 확인한 내용 | [작성 규칙](/guide/contributing) |
| 검증 필요 | 소스만 보고 추정한 문장. 실무에 쓰기 전에 확인이 필요 | [검증 대기 목록](/guide/verify-list) |
| 근거 | 그 페이지가 어떤 파일을 보고 쓰였는지 적은 상자 | [작성 규칙](/guide/contributing) |
| 프로젝트 | 분석 대상인 커스터마이징 소스. OOTB 와 구별해서 부름 | [문서 소개](/guide/) |
| `My...`, `XX...` | 샘플에서 실제 이름 대신 쓰는 이름 | [작성 규칙](/guide/contributing) |
