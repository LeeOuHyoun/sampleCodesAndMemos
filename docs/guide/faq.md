# 자주 틀리는 점 (트러블슈팅)

각 페이지의 주의 상자에 흩어져 있는 "자주 틀리는 점"을 **증상별**로 모았습니다. 증상을 찾고, 자세한 내용은 오른쪽 링크의 원래 절에서 봅니다.

::: tip
ENOVIA 코드는 잘못 넣은 키나 이름을 **오류 없이 무시**하는 경우가 많습니다. 콘솔이 조용한데 동작하지 않으면 먼저 [설정이 무시될 때](#설정이-오류-없이-무시될-때)를 봅니다.
:::

각 항목의 근거는 링크한 페이지의 "근거" 상자에 있습니다. 새 주의 사항을 문서에 쓰면 이 페이지에도 한 줄 추가합니다.

## 화면에 아무것도 안 보일 때

| 증상 | 원인과 해결 | 자세히 |
| --- | --- | --- |
| 그리드가 보이지 않음 | 그리드 높이 기본값이 `'inherit'` 라 부모 높이를 씀. 부모에 높이를 주거나 `maxVisibleRowCount` 사용 | [기본 그리드](/datagridview/getting-started#_1-화면-준비) |
| `require` 콜백이 아예 불리지 않음 | `css!` 로 부른 CSS 가 404 면 그 `require` 전체가 실패. 네트워크 탭에서 `.css` 요청 확인 | [css!](/amd/plugins#css) |
| 불러온 모듈 값이 `undefined` | 파일 안 `define` 이름이 틀려도 오류 없이 `undefined` 가 들어옴 | [define / require](/amd/#define-require-쓰는-법) |
| 처음 열 때 AMD timeout | `waitSeconds` 는 끝나지 않은 요청 전체에 걸림. `dsRequireWaitSeconds` 를 늘려 확인 | [오류 메시지](/amd/#오류-메시지) |
| `widget is not defined` | 전역 `widget` 은 AMD 모듈 실행 시점에 생김. `require([...], function () { widget... })` 안에서 사용 | [위젯 HTML 구조](/widget/#위젯-html-구조) |
| 알림(`addNotif`)이 화면에 안 나옴 | 앱 시작 때 `ViewOnScreen.setNotificationManager(UXMessages)` 를 한 번 불러야 함 | [알림 메시지](/controls/notifications#기본-사용) |
| 로딩 가리개(ModalLoader)가 안 사라짐 | `removeModalLoader` 는 `displayModalLoader` 에 준 **같은 글자**로 지움 | [Loader, ModalLoader](/controls/webux-controls#loader-modalloader) |
| `The given container is not positionned...` 예외 | 대상 요소에 `position: relative` 를 줌 | [Loader, ModalLoader](/controls/webux-controls#loader-modalloader) |
| 아이콘이 빈 칸 | 아이콘 이름이 글꼴마다 다름 (`floppy` 는 3DS 글꼴, FontAwesome 은 `floppy-o`) | [아이콘](/controls/webux-controls#아이콘) |
| 새 타입의 상세 화면이 안 나옴 | 프로젝트 타입은 `type_새타입` menu 를 만들어 `Tree` menu 에 넣어야 함 | [객체 트리 menu](/ui-components/command-menu#객체-트리-menu-type-menu) |

## 설정이 오류 없이 무시될 때

### webapps

| 증상 | 원인과 해결 | 자세히 |
| --- | --- | --- |
| 행 높이(`cellHeight`)가 안 바뀜 | 그리드 최상위가 아니라 `layoutOptions: { ... }` 안에 넣어야 함 | [행 높이](/datagridview/row-height#주의) |
| 트리 컬럼 필터가 안 생김 | `setFilterModel` 의 키는 `tree` 가 아니라 `label` | [필터](/datagridview/api/filter) |
| WebUX 컨트롤 옵션이 안 먹음 | `publishedProperties` 에 있는 키만 반영. 대소문자까지 맞아야 함 (`visibleflag` ✕). UIKIT 은 오타도 저장만 됨 | [두 계열의 차이](/controls/#두-계열의-차이) |
| 속성에 대입해도 그대로 | `readOnly` 속성은 getter 만 있음. `'use strict'` 에서는 `TypeError`. 생성자 옵션으로 넣음 | [속성 읽기와 쓰기](/controls/webux-controls#속성-읽기와-쓰기) |
| Dialog `className` 이 안 붙음 | Dialog / Window 에 `className` 이 없음. `dlg.getContent().addClassName(...)` | [다이얼로그](/controls/dialog#자주-쓰는-옵션) |
| UIKIT 체크박스가 라디오로 나옴 | `type` 기본값이 `radio`. `type: 'checkbox'` 를 꼭 씀 | [Input/Toggle](/controls/uikit#input-toggle) |
| UIKIT Alert `closable: false` 가 안 됨 | 값을 읽기만 하고 닫기 아이콘을 항상 붙임 (2025) | [Alert](/controls/uikit#alert) |
| `createElement` 에 준 클래스, 스타일이 안 먹음 | `className` → `'class'`, `style` → `styles`, `innerHTML` → `html` | [옵션 키](/uwa/element#옵션-키) |
| `UWA.is(v, 'Boolean')` 이 항상 false | type 이름 오타(대문자 포함)는 검사 없이 항상 false | [is, typeOf](/uwa/core#is-typeof) |
| `tweaker.setOptions({...})` 가 적용 안 됨 | 옵션 저장만 함. `tweaker.requiredFlag = true` 또는 `setProperties` | [편집기 단독 사용](/tweakers/standalone#직접-만들기) |
| `semantics.readOnly: true` 가 false 가 됨 | `'true'` 문자열과 비교. `generateView(value, { readOnly: true })` 처럼 최상위로 | [타입 이름으로 만들기](/tweakers/standalone#타입-이름으로-만들기) |
| 툴바 버튼 `action` 에 넣은 함수가 안 불림 | `action` 은 `module`, `func`, `argument` 만 복사. 함수는 `value` 에 | [버튼 콜백](/tweakers/generated-toolbar#버튼-콜백) |
| typeRepresentation 을 다시 등록해도 그대로 | 같은 이름은 처음 것이 남음. 등록된 객체를 직접 고침 | [사용자 타입 등록](/tweakers/custom-type#등록은-전역에-한-번) |
| 위젯 설정 항목이 안 생김 | type 은 7 가지만. 그 밖의 type 은 조용히 무시 | [위젯 설정 type](/widget/preferences#type) |
| HTML 의 설정 `onchange` 가 안 됨 | 위젯 읽기 코드가 일부 속성만 남김. `addPreference` 로 정의 | [항목 키](/widget/preferences#항목-키) |

### 3DSpace 서버 (settings, MQL)

| 증상 | 원인과 해결 | 자세히 |
| --- | --- | --- |
| command / table / webform 설정이 안 먹음 | settings 키는 대소문자까지 그대로 비교 (`Alternate TYPE expression` ✕) | [settings 레퍼런스](/ui-components/settings) |
| 툴바 command 의 선택 개수 검사가 안 됨 | `Row Select` 값은 `single` / `multiple` / `none` 소문자. command 에 `selection` 은 효과 없음 | [선택 행 넘기기](/ui-components/command-menu#툴바-command-선택-행-넘기기) |
| form 의 `On Change Handler` 가 무시됨 | form 은 `OnChange Handler` 가 있으면 그것만 읽음 | [편집 setting](/ui-components/webform#편집-setting) |
| attribute 열이 이상하게 나옴 | `Column Type` 이 아니라 `Field Type` `attribute` + `Admin Type` | [열 종류](/ui-components/table#열-종류-column-type-field-type) |
| 프레임 지정(Target Location)이 안 먹음 | 값은 소문자 `content` 등 | [Target Location](/ui-components/command-menu#어디에-열까-target-location) |
| JPO 를 못 찾음 | 설정에는 `_mxJPO` 를 뺀 이름 (`XX_MyPartUI`) | [이름 규칙](/jpo/#이름-규칙) |
| 채번기(generator)가 동작 안 함 | generator 는 심볼릭 type 이름으로 찾음 | [채번기 만들기](/trigger/generator#만들기) |
| 코드에서 스키마 실제 이름을 못 얻음 | `eServiceSchemaVariableMapping.tcl` 에 property 등록 누락 | [심볼릭 이름](/schema/#심볼릭-이름) |

## 이벤트, 콜백이 안 오거나 두 번 올 때

| 증상 | 원인과 해결 | 자세히 |
| --- | --- | --- |
| 초기값을 넣을 때 저장 로직이 돎 | 코드로 값을 바꿔도 `change` 가 남. `fireOnlyFromUIInteractionFlag: true` 또는 `disableEvents()` | [WebUX 이벤트](/controls/webux-controls#이벤트), [Tweakers 이벤트](/tweakers/standalone#이벤트) |
| 부모에 건 `change` 가 여러 컨트롤에서 옴 | WebUX 이벤트는 버블링됨. `e.dsModel` 로 컨트롤 확인 | [WebUX 이벤트](/controls/webux-controls#이벤트) |
| `el.addEvent('onClick')` 이 안 불림 | 요소는 `'click'`, UWA 클래스와 UIKIT 컨트롤은 `'onClick'` | [DOM 이벤트](/uwa/element#이벤트), [UIKIT](/controls/uikit#공통-사용법) |
| 다이얼로그 버튼을 눌러도 안 닫힘 | 버튼은 클릭 이벤트만 냄. 핸들러에서 `e.dsModel.dialog.close()` | [버튼](/controls/dialog#버튼-buttons) |
| 닫은 다이얼로그를 다시 열 수 없음 | 기본은 `close()` 때 `destroy()` 까지. 새로 만들거나 `autoCloseFlag: false` | [닫기와 다시 열기](/controls/dialog#닫기와-다시-열기) |
| 다른 위젯이 `Events.publish` 를 못 받음 | `Events`, `CSOManager` 는 같은 창 안에서만 하나. 위젯 사이는 PlatformAPI, InterCom, 끌어 놓기 | [어떤 것을 쓰나](/events/#어떤-것을-쓰나) |
| 구독 함수 일부만 불림 | 구독 함수에서 예외가 나면 나머지는 안 불림. 기본 순서는 나중 구독이 먼저 | [PubSub 주의](/events/pubsub#주의) |
| CSOManager `onUpdate` 를 해제할 수 없음 | 토큰을 안 돌려줌. `onAdd`, `onRemove`, `onEmpty` 를 따로 등록 | [선택 이벤트](/events/selection#이벤트) |
| 끌어 놓기 `over` 에서 데이터가 비어 있음 | 브라우저가 dragover 중에는 빈 값을 줌. `drop` 에서 판단. `draggable(el)` 은 옵션 객체를 꼭 넘김 | [droppable 옵션](/events/drag-and-drop#droppable-옵션) |
| 새로고침할 때마다 이벤트, DOM 이 겹침 | `onRefresh` 가 없으면 `onLoad` 가 다시 불림 | [onRefresh](/widget/widget-api#onrefresh) |
| 그리드 값 변경 알림이 끝없이 반복 | `onNodeModelUpdate` 안에서 저장 후 `updateOptions` 하면 다시 알림. `setCellValue` 방식 사용 | [이벤트 안에서 저장하지 않기](/datagridview/save-and-reflect#주의-이벤트-안에서-저장하지-않기) |
| 그리드 리스너가 해제되지 않음 | `removeEventListener` 에는 `addEventListener` 의 **반환값**을 넘김 | [등록 / 해제](/datagridview/api/events#등록-해제) |
| WAFData 를 감싼 Promise 가 끝나지 않음 | 세션 만료, 라이선스 오류는 `onFailure` 가 안 불림. `onPassportError` 를 꼭 넣음 | [Promise 로 감싸기](/uwa/request#promise-로-감싸기) |
| `getServiceUrl` 응답이 오지 않음 | 대시보드 밖에서는 `onComplete`, `onFailure` 둘 다 안 불림. 시간 제한과 대체값을 둠 | [서버 주소](/widget/space-url#서버-주소-3dspace) |
| 콜백에서 `this._parent()` 가 엉뚱하게 동작 | 메서드 실행 중에만 유효. 먼저 변수에 담음 | [상속과 _parent](/uwa/class#상속과-parent) |
| `onXxx` 메서드가 저절로 불림 | 이벤트 이름과 같은 메서드는 `dispatchEvent` 때 자동 호출 | [클래스 Events](/uwa/class#events) |
| 지운 View 의 `render` 가 계속 불림 | `destroy()` 는 `stopListening()` 을 안 부름. 직접 부름 | [View](/uwa/mvc#view) |

## 값이 이상할 때

| 증상 | 원인과 해결 | 자세히 |
| --- | --- | --- |
| `widget.getValue('pageSize') + 10` 이 `'2010'` | 설정 값은 문자열. `widget.getInt` 사용 | [값의 형태](/widget/preferences#값의-형태) |
| `addPreference` 로 기본값을 바꿔도 이전 값 | `getValue` 가 기본값까지 캐시함. `setValue` 로 저장 | [getValue 순서](/widget/preferences#getvalue-가-값을-찾는-순서) |
| `UWA.merge` 가 값을 안 덮어씀 | merge 는 빈 키만 채움. 덮어쓰기는 `UWA.extend` (깊은 복사는 세 번째 인자 `true`) | [Core 유틸](/uwa/core#extend) |
| `allSettled` 결과에 `status` 가 없음 | UWA Promise 는 `state: 'fullfilled'` (철자 그대로) | [Promise 메서드](/uwa/promise#메서드) |
| Model 에 `null` 을 넣었는데 기본값이 됨 | UWA Model 은 `null` 도 defaults 로 바꿈. 객체 기본값은 함수로 | [Model](/uwa/mvc#model) |
| Model `sync` 로 보낸 본문을 서버가 못 읽음 | `headers` 를 넘기면 기본 `Content-Type` 이 사라짐. 직접 넣음 | [서버 연동](/uwa/mvc#서버-연동) |
| WAFData 오류에서 상태 코드를 못 찾음 | `onFailure(error, data, headers)`. 상태 코드는 `error.message` 안에만 | [서버 호출 주의](/uwa/request#주의) |
| REST 가 200 인데 처리가 안 됨 | 실패도 200 으로 오는 경우가 있음. `res.success` 를 먼저 확인 | [REST 오류](/rest-api/#오류) |
| REST 가 SecurityContext 로 거부함 | 컨텍스트 문자열에는 `title` 이 아니라 `name` | [SecurityContext 형식](/rest-api/security-context#형식) |
| 3DSpace 주소에 포트가 빠짐 | `get3DSpaceUrl()` 대체값은 포트 없이 `/3DSpace`. Compass 응답이 없었다는 뜻 | [get3DSpaceUrlAsync](/widget/widget-services#get3dspaceurlasync) |
| 한국어 JSON 이 있는데 영어가 나옴 | `폴더_en.js` 묶음이 있으면 JSON 으로 안 넘어감. 언어는 `widget.lang` 이 아니라 로더 설정 | [언어를 찾는 순서](/amd/plugins#언어를-찾는-순서) |
| 그리드 행을 rowID 로 다시 찾으니 다른 행 | rowID 는 펼침, 정렬, 필터로 바뀜. `nodeModel` 을 보관 | [cellID 와 rowID](/datagridview/api/grid-methods#먼저-알아-둘-것-cellid-와-rowid) |
| select 결과가 String 이었다 StringList 였다 함 | 값이 하나면 String, 여럿이면 StringList | [여러 값 select](/jpo/domain-object#여러-값-select) |
| attribute 값이 계속 비어 있음 | 이름 오타도 예외 없이 빈 값. MQL `print bus ... select ... dump` 로 확인 | [관계](/jpo/domain-object#관계) |
| 폼 저장에서 이전 값이 `null` | 키는 `"Old value"` (`v` 소문자) | [저장](/jpo/args#저장-update-function) |
| 표 / 폼의 range 표시 이름이 안 나옴 | 폼은 `RangeDisplayValues`, 표는 `RangeDisplayValue` | [표 (Structure Browser)](/jpo/args#표-structure-browser) |
| 화면에 문자열 키가 그대로 보임 | 키 오타나 배포 누락. 없을 때 키를 돌려주는 함수를 둠 | [문자열 리소스 Java](/properties/string-resource#java) |
| `_ko` 파일 한글이 깨짐 | `\uXXXX` 로 적음 | [파일 규칙](/properties/string-resource#파일-규칙) |
| 어떤 policy 에서는 state 이름이 안 맞음 | `In Work` / `InWork` 가 섞임. 심볼릭 이름 `state_InWork` 로 찾음 | [state 이름](/schema/policy#state-이름과-심볼릭-이름) |

## 서버 (JPO, MQL, 트리거)

| 증상 | 원인과 해결 | 자세히 |
| --- | --- | --- |
| 경고만 보여 주려 했는데 저장이 취소됨 | postProcess 에서 `Message` 만 넣으면 abort. `Action: "continue"` 를 함께 | [postProcessJPO](/jpo/args#postprocessjpo) |
| 생성 후처리에서 엉뚱한 객체를 수정 | `paramMap.objectId` 는 새 객체, `requestMap.objectId` 는 부모 | [postProcessJPO](/jpo/args#postprocessjpo) |
| "JPO Access Program Returns NULL" | 접근 함수는 `null` 대신 `false` 를 돌려줌 | [검사 순서](/jpo/args#검사-순서) |
| 표 열이 느림 | 행마다 `getInfo` 하지 말고 id 배열로 `DomainObject.getInfo` 한 번 | [표 열 function](/jpo/args#표-열-function) |
| 내보내기 / 인쇄에 HTML 이 섞임 | `reportFormat`, `exportFormat` 이 있으면 글자만 돌려줌 | [표 열 function](/jpo/args#표-열-function) |
| commit 에서 엉뚱한 오류 | 앞에서 예외를 삼켜 트랜잭션이 aborting 상태. 로그를 남겨도 다시 던짐 | [예외](/jpo/i18n-exception#많이-쓰는-형태), [트랜잭션](/jpo/transaction-context#중첩-호출은-참조-카운트로-처리) |
| 안쪽에서 abort 했는데 변경이 남음 | 안쪽 abort 는 카운트만 줄임. 예외를 다시 던져 바깥도 abort | [트랜잭션](/jpo/transaction-context#중첩-호출은-참조-카운트로-처리) |
| 이후 처리가 슈퍼유저로 실행됨 | `popContext` 를 finally 에서 부르지 않음 | [pushContext](/jpo/transaction-context#슈퍼유저로-바꾸기-pushcontext) |
| 소유자가 User Agent 로 들어감 | `pushContext` 중에는 `context.getUser()` 가 바뀜. push 전에 담아 둠 | [pushContext](/jpo/transaction-context#슈퍼유저로-바꾸기-pushcontext) |
| 권한 없는 사용자가 수정됨 | `mqlCommand(context, cmd, true, ...)` 의 `true` 는 슈퍼유저 실행 | [boolean 인자](/jpo/mql-util#boolean-인자) |
| 이름에 공백이 있으면 MQL 이 깨짐 | 문자열을 이어 붙이지 말고 `$1` 사용 (인젝션 방지) | [기본 형태](/jpo/mql-util#기본-형태) |
| 다른 객체의 트리거도 안 돎 | `trigger off` 는 세션 전체. finally 에서 다시 켬 | [트리거 / 히스토리 끄기](/jpo/mql-util#트리거-히스토리-끄기) |
| 내 트리거를 붙였더니 OOTB 트리거가 빠짐 | 기존 이름 목록까지 함께 `input` 에 적음 | [admin 에 붙이기](/trigger/register#_2-admin-에-붙이기) |
| 화면에서 막았는데 다른 길로 통과 | 상태 규칙은 화면이 아니라 Check 트리거에 둠 | [화면에 보이는 것](/trigger/jpo-args#화면에-보이는-것) |
| `mod type ... add attribute` 실패 | attribute 를 먼저 만듦 (`01.attribute` 먼저 실행) | [나중에 고치기](/schema/admin#나중에-고치기) |
| 고친 properties 가 업그레이드 뒤 사라짐 | OOTB 파일 대신 Custom 파일, 내 앱 문자열 파일에 둠 | [고친 뒤 반영](/properties/#고친-뒤-반영) |
| command, table 을 MQL 로 고쳤는데 화면이 그대로 | 서버가 UI 정의를 기억해 둠. Reload Cache 실행 | [Reload Cache](/deploy/#reload-cache) |
| 커스텀 설정 파일 값을 고쳤는데 그대로 | `static` 블록에서 한 번만 읽는 값은 재시작해야 바뀜 | [설정 로더](/server-java/#설정-로더) |
| 커스텀 REST 가 실패했는데 `onFailure` 가 안 불림 | 예외여도 HTTP 200. 응답의 `result` 값을 확인 | [응답 형식](/server-java/rest-service#응답-형식) |
