# 검증 대기 목록

본문에 <Badge type="danger" text="검증 필요" /> 배지가 붙은 추정 사양 147 곳을 모은 목록입니다. 실무에 쓰기 전에 서버에서 확인합니다.

- 각 줄 앞의 링크는 그 문장이 있는 절로 갑니다.
- 확인했으면 원래 페이지에서 배지를 지우고 문장을 단정형으로 고칩니다. 다르게 동작하면 내용을 고칩니다.
- 이 페이지는 `npm run docs:verify-list` 로 다시 만듭니다. 직접 고치지 않습니다.

## 데이터 모델 / MQL (22)

### Attribute, Type, Relationship, Role (2)

- [자료형](/schema/admin#자료형) : 키워드는 대소문자를 가리지 않는 것으로 보입니다.
- [나중에 고치기](/schema/admin#나중에-고치기) : `mod type ... remove attribute` 를 하면 그 type 의 기존 객체에 있던 값도 사라지는 것으로 보입니다.

### mql 폴더 작성 규칙 (7)

- [폴더 구조](/schema/conventions#폴더-구조) : `14.tcl` : 채번용 OOTB tcl 프로그램 사본으로 보입니다
- [본문 순서](/schema/conventions#본문-순서) : 운영에 이미 반영된 객체는 `mod` 만 다시 실행하면 되기 때문으로 보입니다.
- [본문 순서](/schema/conventions#본문-순서) : 정의를 지우면 그 attribute 값이나 연결이 함께 사라지는 것으로 보입니다.
- [property 블록](/schema/conventions#property-블록) : `version` : 최근 파일은 `R427` (R2025x 의 내부 릴리스 번호로 보입니다
- [OOTB 수정 규칙](/schema/conventions#ootb-수정-규칙) : 같은 이름의 사본이 있으면 `copy` 가 실패하기 때문으로 보입니다.
- [데이터 이관 (98.migration)](/schema/conventions#데이터-이관-98-migration) : 엑셀 같은 원본에서 한 줄 = 명령 하나로 만들어 낸 것으로 보입니다.
- [데이터 이관 (98.migration)](/schema/conventions#데이터-이관-98-migration) : 이관한 번호와 채번기의 `eService Next Number` 가 겹치지 않도록 번호 구간을 나누거나 다음 번호를 맞춰 두어야 하는 것으로 보입니다.

### 데이터 모델 개요 (1)

- [심볼릭 이름](/schema/#심볼릭-이름) : `getSchemaProperty` 는 `eServiceSchemaVariableMapping.tcl` 에 붙은 property 를 보고 실제 이름을 찾는 것으로 보입니다

### MQL 문법과 조회 (7)

- [기본 규칙](/schema/mql#기본-규칙) : 대소문자 : 키워드는 섞어 써도 동작하는 것으로 보입니다
- [business object 명령](/schema/mql#business-object-명령) : 대상 객체의 수정 일시를 바꾸지 않는 옵션으로 보입니다.
- [temp query bus](/schema/mql#temp-query-bus) : `T N R` : type 의 자식 type 도 함께 찾는 것으로 보입니다
- [expand bus](/schema/mql#expand-bus) : `terse` : type / name / revision 대신 id 위주로 짧게 출력하는 것으로 보입니다
- [expand bus](/schema/mql#expand-bus) : 출력은 한 줄에 연결 하나이고, 단계, 관계, 방향, 반대편 type / name / revision, select 값이 차례로 나오는 것으로 보입니다.
- [실행 환경](/schema/mql#실행-환경) : `set context user ... role 'ctx::역할.조직.협업공간'` : 권한 검사와 객체의 조직 / 협업공간에 영향을 주는 것으로 보입니다
- [Java 에서 MQL 부르기](/schema/mql#java-에서-mql-부르기) : 공백이 있는 이름도 따옴표 없이 그대로 넘기는 것으로 보아 따옴표 처리를 대신해 주는 것으로 보입니다.

### Policy (상태와 권한) (5)

- [조건](/schema/policy#조건) : `single organization` : 객체의 조직과 사용자 로그인 컨텍스트의 조직이 같을 때로 보입니다
- [조건](/schema/policy#조건) : `single project` : 객체의 협업공간(project)과 로그인 컨텍스트의 협업공간이 같을 때로 보입니다
- [trigger](/schema/policy#trigger) : `Override` : 이벤트의 기본 동작 대신 실행되는 것으로 보입니다
- [trigger](/schema/policy#trigger) : state : `Active` 여야 실행되는 것으로 보입니다.
- [문법에는 있지만 프로젝트에서 안 쓰는 것](/schema/policy#문법에는-있지만-프로젝트에서-안-쓰는-것) : 프로젝트의 결재는 이 기능 대신 Route(`Object Route` 관계)와 trigger 로 처리하는 것으로 보입니다.

## UI 구성 요소 (28)

### command, menu (4)

- [command 정의](/ui-components/command-menu#command-정의) : `nothidden` / `hidden` : 화면 동작과는 무관한 것으로 보입니다
- [어디에 열까: Target Location](/ui-components/command-menu#어디에-열까-target-location) : 프레임 이름 비교는 대소문자를 가리는 것으로 보입니다.
- [창 크기](/ui-components/command-menu#창-크기) : `가로x세로` 형식(`1500x1000`)은 `emxFramework.PopupSize` 목록에 등록된 것만 쓰는 것으로 보입니다.
- [보일지 말지: 접근 setting](/ui-components/command-menu#보일지-말지-접근-setting) : `Access Expression` : 현재 객체 기준으로 평가하는 것으로 보입니다.

### portal, channel (2)

- [channel 정의](/ui-components/portal-channel#channel-정의) : `setting 'Height'` : 높이는 행 단위로 정해지는 것으로 보입니다
- [탭 command](/ui-components/portal-channel#탭-command) : `portalMode` : 받는 JSP 는 이 값으로 "포털 칸 안" 인지 알고 머리글 / 버튼 배치를 바꾸는 것으로 보입니다

### settings 레퍼런스 (10)

- [settings 레퍼런스](/ui-components/settings) : `Input Type1`, `On Change Handler1`, `OnFocus Handler1` : 이름을 바꿔 임시로 끈 것으로 보입니다
- [command](/ui-components/settings#command) : `Mode` : 구조 브라우저의 보기 / 편집 중 어느 쪽 툴바에 보일지로 보입니다
- [command](/ui-components/settings#command) : `Range Values`, `Range Display Values` : 툴바 combobox 선택지를 직접 적는 것으로 보입니다
- [command](/ui-components/settings#command) : `Pull Right` : 하위 메뉴를 오른쪽으로 펼치는 것으로 보입니다
- [menu (툴바, 트리)](/ui-components/settings#menu-툴바-트리) : `Tree Scope ID` : 트리 노드에 붙일 범위 id 로 보입니다
- [menu (툴바, 트리)](/ui-components/settings#menu-툴바-트리) : `ImageDrop Relationship` : 트리에 이미지를 끌어 놓을 때 쓸 관계로 보입니다
- [표시](/ui-components/settings#표시) : `Group By` : 행 묶기 기준 열로 보입니다
- [편집](/ui-components/settings#편집) : `Type Ahead Mapping` : 자동 완성 결과에서 칸에 넣을 값으로 보입니다
- [편집](/ui-components/settings#편집) : `Validate Type` : 기본 금지 문자 검사로 보입니다
- [편집](/ui-components/settings#편집) : `Type Ahead Validate` : 자동 완성 결과 값만 허용하는 것으로 보입니다

### table (목록, 구조 브라우저) (3)

- [table 정의](/ui-components/table#table-정의) : 붙이지 않으면 사용자 개인 table 로 보입니다.
- [열 종류: Column Type, Field Type](/ui-components/table#열-종류-column-type-field-type) : 이 둘은 `Field Type` 쪽 값으로 보입니다.
- [편집 가능한 열](/ui-components/table#편집-가능한-열) : `Field Type` `attribute` 열은 `Update ...` 가 없어도 attribute 에 바로 저장되는 것으로 보입니다.

### URL 파라미터 (7)

- [공통](/ui-components/url-parameters#공통) : `header`, `subHeader` : `UINavigatorUtil.parseHeader` 가 `objectId` 와 함께 풀어서, 키 값 안의 `$<select식>` 도 바뀌는 것으로 보입니다
- [행과 열](/ui-components/url-parameters#행과-열) : `type` : 행 추가 / 필터에서 쓰는 타입으로 보입니다
- [행과 열](/ui-components/url-parameters#행과-열) : `objectBased` : 행이 객체가 아닌 데이터일 때 쓰는 것으로 보입니다
- [행과 열](/ui-components/url-parameters#행과-열) : `connectionProgram` : 행을 끼워 넣을 때 연결을 처리하는 것으로 보입니다
- [모양](/ui-components/url-parameters#모양) : `pageSize` : 한 번에 그릴 행 수로 보입니다
- [편집](/ui-components/url-parameters#편집) : `insertNewRow` : 새 행 추가 끄기로 보입니다
- [편집](/ui-components/url-parameters#편집) : `editRelationship`, `resequenceRelationship` : 행 추가 / 순서 바꾸기에 쓸 관계로 보입니다

### webform (상세, 편집, 생성 화면) (2)

- [필드 종류: Field Type](/ui-components/webform#필드-종류-field-type) : `Group Holder` : 다음 N 개 필드를 가로로 묶는 자리로 보임
- [배치](/ui-components/webform#배치) : `Group Holder` + `Group Count` `2` 는 바로 다음 두 필드를 한 줄에 놓는 것으로 보입니다.

## JPO (19)

### 호출 종류별 인자 구조 (5)

- [구조 펼치기 program](/jpo/args#구조-펼치기-program) : JPO 가 단계를 직접 처리했다는 표시로 보입니다.
- [구조 펼치기 program](/jpo/args#구조-펼치기-program) : href 에 `expandProgram=` 을 따로 주면 루트 목록은 `program`, 펼치기는 `expandProgram` 이 맡는 것으로 보입니다.
- [셀 스타일 (Style Function)](/jpo/args#셀-스타일-style-function) : 열 설정에 붙으므로 그 열의 셀에 적용되는 것으로 보입니다.
- [범위 (Range Function)](/jpo/args#범위-range-function) : `fieldMap` (폼) / `columnMap` (표) : 표에서는 `columnMap` 이 오는 것으로 보입니다
- [검사 순서](/jpo/args#검사-순서) : `setting "Access Behavior" "disable"` 이면 숨기지 않고 회색으로 비활성 처리하는 것으로 보입니다

### DomainObject 와 select (4)

- [객체 얻기](/jpo/domain-object#객체-얻기) : `DomainObject.newInstance(context, id)` : id 로 타입을 조회해 알맞은 하위 클래스 (`Part`, `Document` ...) 로 만들어 주는 것으로 보입니다.
- [여러 값 select](/jpo/domain-object#여러-값-select) : 2 이상 : 구분자로 이어 붙인 `String` 으로 오는 경우도 있는 것으로 보입니다
- [연결, 끊기](/jpo/domain-object#연결-끊기) : `DomainRelationship.connect(context, fromId, relName, toId, preserve)` : id 로 연결. `preserve=true` 면 MQL `connect ... preserve` 로 실행 (수정 일자를 바꾸지 않는 옵션으로 보입니다
- [관계](/jpo/domain-object#관계) : `attribute[없는이름]` 처럼 이름을 틀리면 예외 없이 `null` / 빈 값이 오는 것으로 보입니다.

### 다국어, 예외, 로그 (4)

- [문자열 리소스](/jpo/i18n-exception#문자열-리소스) : `getProperty(context, suite, 키, 언어)` : suite 이름으로 그 suite 의 문자열 리소스를 찾는 것으로 보입니다
- [문자열 리소스](/jpo/i18n-exception#문자열-리소스) : 키가 없으면 빈 값이나 키 그대로가 오는 것으로 보입니다.
- [사용자에게 오류 보여 주기](/jpo/i18n-exception#사용자에게-오류-보여-주기) : `JPO.invoke` 를 거친 예외 문구에는 `System Error: #5000001: java.lang.Exception:` 같은 앞부분이 붙는 것으로 보입니다.
- [로그](/jpo/i18n-exception#로그) : 서버에 slf4j 가 들어 있어 따로 jar 를 넣지 않아도 되는 것으로 보입니다.

### JPO 개요 (1)

- [Base / 파생 구조](/jpo/#base-파생-구조) : Base 를 직접 고치면 업그레이드 때 사라지는 것으로 보입니다.

### MqlUtil (2)

- [기본 형태](/jpo/mql-util#기본-형태) : 끝의 줄바꿈은 잘라서 돌려주는 것으로 보입니다.
- [트리거 / 히스토리 끄기](/jpo/mql-util#트리거-히스토리-끄기) : `trigger off` 는 같은 context (세션) 의 이후 명령 전체에 적용되는 것으로 보입니다.

### Context, 트랜잭션, 권한 전환 (3)

- [Context 에서 꺼내는 값](/jpo/transaction-context#context-에서-꺼내는-값) : `context.getRole()` : 현재 보안 컨텍스트 (역할 / 조직 / 공간) 로 보입니다
- [UI 가 열어 주는 트랜잭션](/jpo/transaction-context#ui-가-열어-주는-트랜잭션) : 트리거는 객체를 바꾸는 MQL 명령의 트랜잭션 안에서 실행되는 것으로 보입니다.
- [슈퍼유저로 바꾸기 (pushContext)](/jpo/transaction-context#슈퍼유저로-바꾸기-pushcontext) : 이력 (history) 의 사용자도 User Agent 로 남는 것으로 보입니다.

## 트리거 (11)

### 채번기 (Object Generator) (3)

- [속성](/trigger/generator#속성) :  : 호출 때 policy 를 주지 않으면 쓰는 값으로 보입니다
- [속성](/trigger/generator#속성) :  : 위와 같은 용도로 보입니다
- [번호가 만들어지는 방식](/trigger/generator#번호가-만들어지는-방식) : `FrameworkUtil.autoName` 도 같은 방식으로 보입니다.

### 트리거 개요 (2)

- [이벤트](/trigger/#이벤트) : type 의 Connect / Disconnect 는 그 type 객체에 관계가 연결 / 해제될 때 실행되는 것으로 보입니다.
- [Check, Action, Override](/trigger/#check-action-override) : `Override` : 이벤트의 기본 동작 대신 실행되는 것으로 보입니다

### 트리거 JPO 와 인자 (1)

- [macro 치환](/trigger/jpo-args#macro-치환) : 없는 변수 : 빈 값으로 보입니다

### 라이프사이클과 promote (3)

- [promote 한 번에 일어나는 일](/trigger/lifecycle#promote-한-번에-일어나는-일) : Action 이 예외를 던지면 state 변경도 남지 않는 것으로 보입니다.
- [코드에서 state 바꾸기](/trigger/lifecycle#코드에서-state-바꾸기) : `obj.setState(context, "Release")` : 거치는 전이마다 트리거가 실행되는 것으로 보입니다
- [서명과 자동 promote](/trigger/lifecycle#서명과-자동-promote) : `${AUTOPROMOTE}` : 트리거 안에서 자동 promote 인지 구분하는 RPE 변수로 보입니다

### 트리거 등록 (2)

- [속성](/trigger/register#속성) : `eService Sequence Number` : 실행 순서로 쓰이는 것으로 보입니다.
- [2. admin 에 붙이기](/trigger/register#_2-admin-에-붙이기) : 내 이름만 적으면 OOTB 트리거가 빠지는 것으로 보입니다.

## properties (7)

### 문자열 리소스 (다국어) (2)

- [파일 규칙](/properties/string-resource#파일-규칙) : `이름_koNative.properties` : 사람이 읽는 원본으로 보입니다.
- [스키마 표시 이름](/properties/string-resource#스키마-표시-이름) : 이 키들은 `emxFrameworkStringResource` 에서만 찾는 것으로 보입니다.

### 시스템 설정과 page 객체 (5)

- [emxFrameworkCustom.properties](/properties/system-settings#emxframeworkcustom-properties) : OOTB 키와 같은 키 를 Custom 파일에 적으면 Custom 값이 쓰이는 것으로 보입니다.
- [emxFrameworkCustom.properties](/properties/system-settings#emxframeworkcustom-properties) : OOTB 목록을 바꿀 때는 **전체** 를 적음 : 값 하나만 더하는 문법은 없는 것으로 보입니다.
- [emxFrameworkCustom.properties](/properties/system-settings#emxframeworkcustom-properties) : 같은 키를 Custom 파일에 두는 편이 안전한 것으로 보입니다.
- [앱 등록 키](/properties/system-settings#앱-등록-키) : `.Directory` : command href 의 `${SUITE_DIR}` 가 이 폴더로 바뀌는 것으로 보입니다
- [코드에서 읽기](/properties/system-settings#코드에서-읽기) : `FrameworkProperties.getProperty(context, 키)` : 같은 결과로 보입니다

## 서버 Java (18)

### 외부 DB (MyBatis) (1)

- [서버에 넣기](/server-java/external-db#서버에-넣기) : jar : 분석한 `WEB-INF/lib` 에는 없어서 실제 위치는 확인하지 못했습니다.

### 서버 Java 개요 (3)

- [서버에서 Context 만들기](/server-java/#서버에서-context-만들기) : 닫지 않으면 서버에 세션이 남는 것으로 보입니다.
- [서버에서 Context 만들기](/server-java/#서버에서-context-만들기) : 객체를 만드는 배치는 소유 조직과 협업공간이 여기서 정해지므로 반드시 지정합니다.
- [JPO 에서 요청 객체 쓰기](/server-java/#jpo-에서-요청-객체-쓰기) : 분석한 `web.xml` 에는 이 등록이 없어서 실제 등록 형태는 확인하지 못했습니다.

### 메일 (4)

- [발송 실패와 업무 처리](/server-java/mail#발송-실패와-업무-처리) : 필수 값이 빠진 경우(위 표의 1, 3)는 발송 전의 검사라서 이 설정과 상관없이 예외가 나는 것으로 보입니다.
- [시스템 오류 메일](/server-java/mail#시스템-오류-메일) : 원본에는 같은 오류를 묶거나 횟수를 제한하는 처리가 보이지 않습니다.
- [서버에 넣기](/server-java/mail#서버에-넣기) : jar : 분석한 `WEB-INF/lib` 에는 없어서 실제 위치는 확인하지 못했습니다.
- [서버에 넣기](/server-java/mail#서버에-넣기) : 원본 설정에는 템플릿 캐시를 켜는 키가 없어서 바로 반영되는 것으로 보입니다.

### 커스텀 REST 서비스 (6)

- [Modeler](/server-java/rest-service#modeler) : `@ApplicationPath` 어노테이션을 서버가 찾아서 등록하는 것으로 보입니다.
- [로그인 사용자의 Context](/server-java/rest-service#로그인-사용자의-context) : 뜻은 확인하지 못했습니다.
- [로그인 사용자의 Context](/server-java/rest-service#로그인-사용자의-context) : OOTB 서비스와 같은 틀을 쓰므로 필요한 것으로 보입니다.
- [응답 형식](/server-java/rest-service#응답-형식) : Context 를 얻지 못한 경우(로그인 만료)도 같은 형태로 오는 것으로 보입니다.
- [외부 시스템이 부르는 주소](/server-java/rest-service#외부-시스템이-부르는-주소) : `resources/` 아래 주소에 서버가 기본으로 로그인을 요구하는지는 확인하지 못했습니다.
- [위젯에서 부르기](/server-java/rest-service#위젯에서-부르기) : 원본 webapps 폴더에는 이 서비스를 부르는 위젯 소스가 없어서 위 호출은 OOTB 서비스를 부르는 방식([서버 호출](/uwa/request))을 그대로 적용한 것입니다.

### 스케줄러 (4)

- [Job](/server-java/scheduler#job) : 몇 분마다 도는 Job 이므로 `finally` 에서 닫는 편이 안전한 것으로 보입니다.
- [Job](/server-java/scheduler#job) : 원본에는 붙어 있지 않습니다.
- [서버에 넣기](/server-java/scheduler#서버에-넣기) : 분석한 `web.xml` 에는 이 등록이 없어서 위 형태는 서블릿 표준에 따른 추정입니다.
- [서버에 넣기](/server-java/scheduler#서버에-넣기) : 원본에는 이에 대한 처리가 보이지 않습니다.

## 서버 반영 (10)

### 서버 반영 절차 (10)

- [한눈에 보기](/deploy/#한눈에-보기) : JPO : 필요 없는 것으로 보입니다
- [MQL (스키마, UI 정의)](/deploy/#mql-스키마-ui-정의) : `-del` 은 되돌릴 때 쓰는 삭제 묶음으로 보입니다.
- [JPO](/deploy/#jpo) : 일반적으로 알려진 MQL 은 아래 형태입니다.
- [JPO](/deploy/#jpo) : 컴파일 결과 메시지를 꼭 확인합니다.
- [JPO](/deploy/#jpo) : 다른 JPO 가 `${CLASS:MyPartUI}` 로 참조하는 JPO 를 고쳤으면 참조하는 쪽도 다시 컴파일해야 하는 것으로 보입니다.
- [Reload Cache](/deploy/#reload-cache) : 로드 밸런서 뒤에 서버가 여러 대면 서버마다 실행하거나 서버 목록을 설정해야 하는 것으로 보입니다.
- [문자열 리소스까지 비우기](/deploy/#문자열-리소스까지-비우기) : JDK 버전이 바뀌면 필드 이름이나 접근 제한 때문에 실패할 수 있는 것으로 보입니다.
- [커스텀 Java (src/)](/deploy/#커스텀-java-src) : 서블릿이나 필터를 직접 추가하면 제품 업데이트 때 다시 만들어지면서 사라질 수 있으므로 추가한 블록을 따로 보관해 둡니다.
- [커스텀 리소스 (resources/custom/)](/deploy/#커스텀-리소스-resources-custom) : 메일 템플릿 (`.vm`) : 엔진 캐시 설정에 따름
- [반영 순서](/deploy/#반영-순서) : 이 순서는 참조 관계에서 정리한 것이고 원본에 반영 절차서가 있는 것은 아닙니다.

## AMD 로딩 (1)

### WebappsUtils (1)

- [로드될 때 하는 일](/amd/webapps-utils#로드될-때-하는-일) : 3DDashboard 위젯 프레임에서는 AmdLoader 를 프레임이 먼저 읽으므로 webapps 주소도 프레임이 정하는 것으로 보입니다.

## 위젯과 플랫폼 (22)

### Compass 서비스 (i3DXCompassPlatformServices) (1)

- [OpenWith](/widget/compass-services#openwith) : 열리는 앱은 이 `content` 를 위젯 값 `X3DContentId` (JSON 문자열)로 받는 것으로 보입니다

### 3DDashboard 에 위젯 올리기 (12)

- [배포 위치와 주소](/widget/dashboard-register#배포-위치와-주소) : 반영 : 정적 파일이라 서버를 다시 시작하지 않아도 되는 것으로 보입니다
- [배포 위치와 주소](/widget/dashboard-register#배포-위치와-주소) : 서버가 여러 대이면 모든 서버의 같은 위치에 넣어야 하는 것으로 보입니다.
- [Run Your App 으로 열기](/widget/dashboard-register#run-your-app-으로-열기) : Run Your App 이 앱 목록에 보이는지는 부여된 역할에 따라 다른 것으로 보입니다.
- [동작](/widget/dashboard-register#동작) : 바뀐 뒤에는 새 위젯의 설정 항목(`<widget:preferences>`)이 적용되고, 탭을 다시 열어도 바뀐 위젯으로 남는 것으로 보입니다.
- [Additional App 으로 등록](/widget/dashboard-register#additional-app-으로-등록) : 등록 버튼이 보이려면 플랫폼 관리자 권한이 있어야 하는 것으로 보입니다.
- [입력 항목](/widget/dashboard-register#입력-항목) : 위젯은 `Widget` 을 고르는 것으로 보입니다.
- [입력 항목](/widget/dashboard-register#입력-항목) : 위젯 설정 초기값을 담은 파일 주소인 것으로 보입니다.
- [입력 항목](/widget/dashboard-register#입력-항목) : Object Type Compatibility 는 그 type 의 객체에서 "다른 앱으로 열기" 를 했을 때 이 앱이 후보로 나오게 하는 값으로 보입니다.
- [저장 요청](/widget/dashboard-register#저장-요청) : Platform Management 의 다른 요청이 Compass(My Apps) 주소 뒤에 `/resources/AppsMngt/` 를 붙여 쓰므로 전체 주소는 아래와 같은 것으로 보입니다.
- [저장 요청](/widget/dashboard-register#저장-요청) : 수정은 `id` 를 넣은 같은 본문을 보내는 것으로 보입니다.
- [Internal 저장](/widget/dashboard-register#internal-저장) : 3DSpace `webapps/` 의 AMD 모듈을 상대 경로로 부르는 위젯은 주소가 달라져 모듈을 찾지 못하므로 External 로 등록하는 편이 안전한 것으로 보입니다.
- [등록한 뒤](/widget/dashboard-register#등록한-뒤) : 구성원은 Compass 에서 Short Name 으로 앱을 찾아 대시보드 탭에 올리는 것으로 보입니다.

### 위젯 (2)

- [실행 환경](/widget/#실행-환경) : 3DDashboard : 대시보드의 위젯 프레임 (iframe, 주소에 `/api/widget/frame` 이 들어간 것으로 보임
- [실행 환경](/widget/#실행-환경) : 3DDashboard 는 위젯 HTML 을 읽어 제목, 메타, 설정 항목, 본문, 스크립트를 뽑아 프레임 안에서 다시 실행하는 것으로 보입니다

### PlatformAPI (1)

- [publish / subscribe](/widget/platform-api#publish-subscribe) : `targets` : 데스크톱 앱 안 위젯(Web-in-Win)용으로 보입니다

### 위젯 설정 (preferences) (2)

- [getValue 가 값을 찾는 순서](/widget/preferences#getvalue-가-값을-찾는-순서) : 대시보드에서는 프레임이 값을 대시보드로 보내 위젯마다 저장하는 것으로 보입니다.
- [설정 창 흐름](/widget/preferences#설정-창-흐름) : 2 : 대시보드가 `getPreferences()` 결과로 그리는 것으로 보임

### 3DSpace 주소와 SecurityContext (2)

- [플랫폼 id](/widget/space-url#플랫폼-id) : 온프레미스 환경의 플랫폼 id 는 `OnPremise` 로 보입니다.
- [목록과 기본값 받기](/widget/space-url#목록과-기본값-받기) : 3DSpace 가 여러 플랫폼을 서비스하는 환경에서 필요한 것으로 보입니다.

### widget 객체 (2)

- [이벤트](/widget/widget-api#이벤트) : `onDestroy` : 앱 코드나 대시보드가 보내는 것으로 보입니다
- [endEdit](/widget/widget-api#endedit) : 3DDashboard 의 설정 창은 대시보드가 그리는 것으로 보입니다.

## UWA (1)

### 위젯 간 통신 (InterCom) (1)

- [Socket 으로 붙기](/uwa/intercom#socket-으로-붙기) : 넣어도 효과가 없는 것으로 보입니다.

## 화면 컨트롤 (1)

### 화면 컨트롤 개요 (1)

- [무엇을 쓸까](/controls/#무엇을-쓸까) : UIKIT 은 UWA 컨트롤(`UWA/Controls/Abstract`) 위에 만든 예전 계열로 보입니다.

## 이벤트, 선택, 끌어 놓기 (4)

### 끌어 놓기 (DataDragAndDrop, 3DXContent) (1)

- [items[] 항목](/events/drag-and-drop#items-항목) : 검사 함수 `DS/3DXContentChecker/3DXContentChecker_v2.1` 의 `check()` 를 부르는 곳은 없어서, 실제로는 필수 키만 지키면 통하는 것으로 보입니다.

### 이벤트, 선택, 끌어 놓기 개요 (1)

- [어떤 것을 쓰나](/events/#어떤-것을-쓰나) : 대시보드의 위젯은 보통 각자 iframe 에서 돌기 때문에, 위젯 A 에서 `Events.publish` 해도 위젯 B 의 `Events.subscribe` 는 받지 못하는 것으로 보입니다.

### 선택 (CSOManager, HSOManager, PSOManager) (2)

- [선택 (CSOManager, HSOManager, PSOManager)](/events/selection) : `DS/Selection/HSOManager` : 강조(highlight) 목록으로 보입니다
- [선택 (CSOManager, HSOManager, PSOManager)](/events/selection) : `DS/Selection/PSOManager` : 미리 선택(마우스 올림) 목록으로 보입니다

## 3DSpace REST API (3)

### 3DSpace REST API 공통 규칙 (2)

- [URL 구성](/rest-api/#url-구성) : `tenant=` : 온프레미스에서는 생략해도 되는 것으로 보입니다
- [쿼리 파라미터](/rest-api/#쿼리-파라미터) : `$terse` : 응답 줄이기로 보입니다

### 보안 컨텍스트 (SecurityContext) (1)

- [헤더에 넣기](/rest-api/security-context#헤더에-넣기) : 두 방식이 모두 동작하는 것으로 보입니다.
