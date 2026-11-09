# URL 파라미터

command 의 `href` 는 프레임워크 JSP 에 URL 파라미터로 화면을 지시합니다. 이 페이지는 JSP 별로 파라미터를 모읍니다. "사용" 은 프로젝트 MQL 정의(command, menu, column, field 의 `href` / `range`)에서 나온 횟수입니다.

::: info 근거
각 JSP 의 `emxGetParameter(request, "...")` / `requestMap.get("...")`: `3dspace/common/emxIndentedTable.jsp`, `emxTable.jsp`, `emxForm.jsp`, `emxCreate.jsp`, `emxCreateProcess.jsp`, `emxPortal.jsp`, `emxPortalDisplay.jsp`, `emxTree.jsp`, `emxNavigator.jsp`, `emxFullSearch.jsp`. `emxIndentedTable.jsp` 는 대부분을 `indentedTableBean.init(...)` 에 넘기므로 `framework.jar` 의 `UITableIndented.class` / `UITableCommon.class` 문자열 상수와 `emxToolbarJavaScript.jsp`, `scripts/emxUIFreezePane.js` 로 확인. 사용 횟수: `mql/06.command` ~ `11.portal` 의 `href` 를 node 스크립트로 집계
:::

## 공통

| 파라미터 | 설명 |
| --- | --- |
| `objectId` | 대상 객체 id. 트리 / 포털 / 목록 링크에서는 프레임워크가 붙임 |
| `relId` | 대상 연결 id |
| `parentOID` | 부모 객체 id |
| `suiteKey` | suite 이름 (`ProductLine`, `ProgramCentral` ...). label 키를 찾을 문자열 파일을 정함 |
| `StringResourceFileId`, `SuiteDirectory` / `emxSuiteDirectory` | suite 대신 문자열 파일 / 폴더를 직접 지정 |
| `header`, `subHeader` | 제목 / 부제목 문자열 리소스 키. `UINavigatorUtil.parseHeader` 가 `objectId` 와 함께 풀어서, 키 값 안의 `$<select식>` 도 바뀌는 것으로 보입니다 |
| `toolbar` | 툴바 menu 이름. 쉼표로 여러 개 (`ENCBOMToolBar,ENCBOMCustomToolBar`) |
| `HelpMarker` | 도움말 페이지 키 |
| `Export`, `PrinterFriendly` | `false` 면 내보내기 / 인쇄 버튼 숨김 |
| `portalMode` | `true` 면 포털 칸 안 화면 |
| `targetLocation` | 이 화면이 열린 곳 (`slidein`, `popup` ...). command 의 `Target Location` 에 따라 프레임워크가 붙이기도 함 |

## emxIndentedTable.jsp

목록 / 구조 화면. 프로젝트 사용 59 건 (프로젝트에서 복사한 사본 JSP 26 건 별도).

### 행과 열

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `table` | table 이름 | 열 정의 | 59 |
| `tableMenu` | menu 이름 | 보기 전환. menu 안 command 마다 `setting 'table'` | - |
| `program` | <code>JPO:method</code> (쉼표로 여러 개) | 행 목록 (한 단계) | 53 |
| `programLabel` | 문자열 키 (쉼표로 여러 개) | `program` 이 여럿일 때 필터 목록 글자 | - |
| `expandProgram` | <code>JPO:method</code> | 구조 펼침. 행을 펼칠 때마다 불림 | 7 |
| `expandProgramMenu` | menu 이름 | 펼침 방식 고르기 | - |
| `relationship`, `direction` | 심볼릭 관계, `from` / `to` | JPO 없이 관계로 펼침 | 1 |
| `expandLevel`, `expandByDefault` | `1`, `All` / `true` | 처음 펼칠 단계 | 1 |
| `expandLevelFilter`, `expandLevelFilterMenu` | `true` / menu 이름 | 펼침 단계 고르기 칸 | 4 / 2 |
| `type` | 심볼릭 타입 | 행 추가 / 필터에서 쓰는 타입으로 보입니다 | 18 |
| `objectBased` | `false` | 행이 객체가 아닌 데이터일 때 쓰는 것으로 보입니다 | 1 |
| `connectionProgram` | <code>JPO:method</code> | 행을 끼워 넣을 때 연결을 처리하는 것으로 보입니다 | - |

### 모양

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `selection` | `multiple`, `single`, `none` | 행 체크박스 | 45 |
| `sortColumnName`, `sortDirection` | 열 `name`, `ascending` / `descending` | 처음 정렬 | 20 / 16 |
| `freezePane` | 열 이름 (쉼표로 여러 개) | 왼쪽 고정 열 | 19 |
| `pageSize` | 숫자 | 한 번에 그릴 행 수로 보입니다 | 5 |
| `hideHeader`, `hideToolbar` | `true` | 제목줄 / 툴바 숨김 | 5 / 1 |
| `showPageHeader` | `true` / `false` | 페이지 머리글 | 3 |
| `cellwrap` | `true` | 칸 글자 줄바꿈 | 7 |
| `displayView` | `details`, `thumbnails`, `tree` | 처음 보기 방식 (`emxFramework.Freezepane.view`) | 1 |
| `rowGrouping`, `rowGroupingColumnNames` | `true`, 열 이름 | 열 값으로 행 묶기 | 1 |
| `calculations` | `true` | 합계 / 평균 줄 | 2 |
| `showClipboard`, `showRMB` | `false` | 클립보드 버튼 / 오른쪽 클릭 메뉴 끄기 | 1 / 11 |
| `hideRootSelection` | `true` | 구조의 맨 위 행 체크박스 숨김 | 1 |
| `CancelButton`, `cancelLabel` | `true`, 문자열 키 | 팝업 아래 닫기 버튼 | 2 |

### 편집

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `editLink` | `true` / `false` | 툴바의 편집 버튼 | 12 |
| `mode` | `edit` / `view` | 처음부터 편집 모드 | - |
| `massUpdate` | `false` | 여러 행 한꺼번에 고치기 끄기 | 4 |
| `insertNewRow` | `false` | 새 행 추가 끄기로 보입니다 | 4 |
| `editRootNode` | `false` | 구조의 맨 위 행 편집 금지 | 1 |
| `applyURL` | URL / `javascript:함수()` | 편집 적용 버튼이 부를 곳 | 4 |
| `preProcessJPO`, `preProcessURL` | <code>JPO:method</code>, URL | 편집 모드 들어가기 전 | - |
| `postProcessJPO`, `postProcessURL` | <code>JPO:method</code>, URL | 편집 저장 뒤 | - |
| `cancelProcessJPO`, `cancelProcessURL` | <code>JPO:method</code>, URL | 편집 취소 시 | - |
| `editRelationship`, `resequenceRelationship` | 심볼릭 관계 | 행 추가 / 순서 바꾸기에 쓸 관계로 보입니다 | - |

## emxTable.jsp

예전 평면 목록 JSP 입니다. `tableType=new` 이거나 `emxFramework.Table.Type` 이 `new` 면 받은 파라미터를 그대로 `emxIndentedTable.jsp` 로 넘깁니다. 이 환경 기본값은 `classic` 입니다. 파라미터는 `table`, `program`, `selection`, `sortColumnName`, `toolbar`, `header` 처럼 위와 같습니다. 이 JSP 가 따로 읽는 것으로는 `FilterFramePage` / `FilterFrameSize` (목록 위에 붙일 필터 JSP 와 그 높이), `listMode`, `tableType` 이 있습니다. 프로젝트 정의에서는 `emxTable.jsp` 를 쓰지 않습니다.

## emxForm.jsp

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `form` | form 이름 | 필드 정의 | 22 |
| `mode` | `view` (기본) / `edit` | 보기 / 편집 | 9 |
| `formHeader` | 문자열 키 | 제목 | 7 |
| `toolbar` | menu 이름 | 툴바 | 10 |
| `editLink` | `true` | 편집 버튼 | 3 |
| `postProcessJPO`, `postProcessURL` | <code>JPO:method</code>, URL | 저장 뒤 | 3 / 1 |
| `preProcessJavaScript` | JS 함수 | 편집 화면 직후 | 1 |
| `formFieldsOnly` | `true` | 머리글 / 버튼 없이 필드만 | 1 |
| `slideinType` | `wider` | 넓은 슬라이드인 | - |

## emxCreate.jsp

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `type` | 심볼릭 타입 | 만들 타입 | 19 |
| `form` | form 이름 | 입력 필드 | 19 |
| `policy` | 심볼릭 policy | 사용할 policy | 17 |
| `header` | 문자열 키 | 제목 | 17 |
| `createJPO` | <code>JPO:method</code> | 생성 메서드 | 17 |
| `submitAction` | `refreshCaller`, `refreshCallerParent`, `treeContent`, `treePopup` | 생성 뒤 동작 | 17 |
| `nameField` | `autoname`, `keyin`, `both` | 이름 정하는 방식 | 14 |
| `postProcessJPO`, `postProcessURL` | <code>JPO:method</code>, URL | 생성 뒤 | 5 / 2 |
| `slideinType` | `wider` | 넓은 슬라이드인 | 7 |
| `preProcessJavaScript` | JS 함수 | 화면 직후 | 3 |
| `formFieldsOnly` | `true` | 필드만 | 3 |
| `typeChooser`, `autoNameChecked` | `false` | 타입 고르기 / 자동 채번 체크 기본값 | 2 / 2 |

`submitAction` 동작은 [webform](/ui-components/webform#emxcreate-jsp-생성) 에 정리했습니다.

## emxPortal.jsp

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `portal` | portal 이름 | 배치 | 22 |
| `showPageHeader` | `false` | 제목줄 숨김 | 15 |
| `header`, `subHeader` | 문자열 키 | 없으면 `emxFramework.ObjectPortal.Header` (객체 있음) / `emxFramework.HomePortal.Header` | 1 |
| `toolbar` | menu 이름 | 포털 툴바 | - |

탭 화면에 붙는 파라미터(`portalMode`, `portalCmdName` ...)는 [portal, channel](/ui-components/portal-channel#탭-command) 을 봅니다.

## emxTree.jsp

객체 하나의 트리(왼쪽 카테고리 + 가운데 화면)를 엽니다. 프로젝트 사용 103 건 (대부분 목록 열의 `href`).

| 파라미터 | 값 | 설명 | 사용 |
| --- | --- | --- | --- |
| `objectId` | 객체 id | 대상. 목록 링크에서는 자동으로 붙음 | - |
| `treeMenu` | menu 이름 | 타입의 `type_` menu 대신 이 menu | 2 |
| `DefaultCategory` | command 이름 | 처음 열 카테고리 | 1 |
| `mode` | `replace` (기본) / `insert` | `insert` 는 지금 보던 구조 트리를 유지한 채 대상 객체를 엶 | 43 |
| `treeLabel` | 글자 | 트리 맨 위 글자 | - |
| `relId` | 연결 id | 연결 기준 화면일 때 | - |
| `emxSuiteDirectory`, `suiteKey` | suite | 카테고리 label 을 찾을 suite | - |
| `treemode` | `structure` | 구조 트리 모드 | - |

`mode` 처리: `emxTree.jsp` 501, 513, 608 행. 비어 있거나 `replace` 면 화면을 바꾸고, `insert` 면 현재 화면의 구조 URL 을 그대로 씁니다.

## emxNavigator.jsp

3DSpace 첫 화면(전체 틀)입니다. 다른 화면에서 이 URL 로 특정 객체나 화면을 바로 열 수 있습니다. 프로젝트 정의에서는 쓰지 않습니다.

| 파라미터 | 설명 |
| --- | --- |
| `objectId`, `physicalId` | 바로 열 객체 (`physicalId` 면 id 로 바꿈) |
| `treeMenu`, `treeLabel`, `DefaultCategory` | 위 `emxTree.jsp` 와 같은 뜻 |
| `ContentPage` | 가운데에 열 페이지 |
| `MenuName`, `CommandName` | 열 menu / command |
| `TargetLocation` | 열 위치 |
| `appName` | 앱 이름 |
| `isPopup` | 팝업 창 모드 |

## emxFullSearch.jsp

검색 / 선택 화면입니다. form 필드의 `range`, 툴바 command 의 `href` 에서 씁니다.

| 파라미터 | 값 | 설명 |
| --- | --- | --- |
| `field` | `TYPES=type_X` , `TYPES=type_X:CURRENT=policy_P.state_S` | 검색 조건. `:` 로 조건 추가, `!=` 로 제외 |
| `table` | table 이름 | 결과 열 |
| `selection` | `single` / `multiple` | 고를 개수 |
| `showInitialResults` | `true` / `false` | 열자마자 결과 표시 |
| `submitURL` | URL | 고른 뒤 보낼 곳. 기본 처리기는 `${COMMON_DIR}/AEFSearchUtil.jsp` |
| `includeOIDprogram`, `excludeOIDprogram` | <code>JPO:method</code> | 결과에 넣을 / 뺄 객체 id 목록 |
| `form` | form 이름 | 검색 조건 폼 |
| `fieldNameActual`, `fieldNameDisplay`, `fieldNameOID` | 필드 이름 | 고른 값을 넣을 form 칸 |
| `chooserType` | 문자열 | 선택기 종류 |
| `hideHeader` | `true` | 머리글 숨김 |

::: warning emxFullSearch.jsp 를 브라우저에 바로 열면
이 환경의 `emxFullSearch.jsp` 파일 자체는 "This configuration is not supported" 만 출력합니다. 실제 검색은 화면 스크립트가 URL 을 가로채서 엽니다. `showModalDialog` 가 URL 에서 `emxFullSearch.jsp` 를 `emxFullSearchGetData.jsp` 로 바꿔 새 검색 화면으로 넘깁니다 (`scripts/emxUIModal.js` 172 행). 그래서 `emxFullSearch.jsp` URL 은 command `href`, field `range` 처럼 **프레임워크가 팝업으로 여는 자리** 에만 씁니다.
:::

## emxLifecycle.jsp

라이프사이클 화면입니다. 보통 OOTB command `AEFLifecycle` 을 그대로 씁니다. 직접 열 때는 `header`, `toolbar`, `mode=basic`, `export=false` 를 씁니다.
