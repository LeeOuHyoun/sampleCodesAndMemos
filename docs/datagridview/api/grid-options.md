---
title: 그리드 옵션
---

# 그리드 옵션 <Badge type="info" text="원본 분석" />

`new DataGridView({ ... })` 에 넘기는 설정 객체 최상위 키입니다. DataGridView 자체 옵션과 상속받은 CollectionView, Controls/Abstract 옵션을 함께 정리했습니다.

생성 후에도 `grid.옵션 = 값` 으로 바꿀 수 있습니다 (readOnly 표시 제외). 그리드 객체에서 부르는 함수는 [그리드 메서드](/datagridview/api/grid-methods) 에 있습니다.

"사용" 칸은 enovia2025 webapps 에서 DataGridView 를 쓰는 앱 파일 119개 가운데 그 이름이 나오는 파일 수입니다. `height`, `disabled` 처럼 그리드가 아닌 곳에도 흔히 쓰이는 이름은 셀 수 없어서 `-` 로 두었습니다.

```js
var grid = new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  rowSelection: 'single',
  showRowIndexFlag: false
});
grid.showColumnBorderFlag = true;
```

::: info 근거
DataGridView.js, CollectionView.js, Controls.js 의 publishedProperties 와 실제 비교 코드. `placeholder`, `shouldNodeBeRepresented`, `syncClientModelOnDemand`, `onContextualEvent` 는 2025 에서 DataGridView 에, 2026 에서 부모인 CollectionView 에 정의되어 있습니다. 정의 위치만 옮겨졌고 두 버전 모두 그리드 옵션으로 씁니다.
:::

## 데이터

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>treeDocument</code> | - | <code>TreeDocument</code> | <code>null</code> | <code>new TreeDocument()</code> | 표시할 데이터. 행 = TreeNodeModel |
| <code>columns</code> | - | <code>array</code> | <code>[]</code> | 컬럼 정의 배열 | [컬럼 옵션](/datagridview/api/column-options) 참고 |
| <code>defaultColumnDef</code> | 72 | <code>object</code> | [컬럼 옵션](/datagridview/api/column-options)의 기본값 | 컬럼 옵션 객체 | 모든 컬럼 공통 기본값. 빠진 키는 원래 기본값으로 채워짐 |
| <code>layoutOptions</code> | 36 | <code>object (readOnly)</code> | <code>null</code> | [layoutOptions](/datagridview/api/layout-options) 참고 | 레이아웃 옵션. 생성할 때만 지정 가능 |
| <code>dataSource</code> | 1 | <code>object</code> | <code>null</code> | <code>new DataSourceBase()</code> | 행을 필요한 만큼만 서버에서 불러오는 방식. <code>treeDocument</code> 대신 넣는다. 사용 수는 그리드 옵션으로 쓴 파일만 센 값 ([서버 사이드 데이터](/datagridview/server-side)) |
| <code>virtuallyLoadAllModelItems</code> | 5 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | <code>dataSource</code> 와 같이 쓸 때, 스크롤 막대를 처음부터 전체 길이로 잡고 보이는 위치의 행만 불러온다. <code>treeDocument</code> 그리드에서는 상태바 행 수 계산만 바뀐다 ([불러오는 방식 두 가지](/datagridview/server-side#불러오는-방식-두-가지)) |
| <code>syncClientModelOnDemand</code> | 0 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | <code>dataSource.pushUpdatesNotifications</code> 로 받은 변경을 바로 반영하지 않고 모아 둔다. <code>grid.executePendingNotifications()</code> 를 부를 때 반영 ([서버가 먼저 알려 주는 변경](/datagridview/server-side#서버가-먼저-알려-주는-변경)) |
| <code>documentClassForServerSide</code> | 1 | <code>function</code> | TreeDocument | 클래스 | <code>dataSource</code> 그리드가 안에서 만드는 TreeDocument 의 클래스 |
| <code>onDelayedModelDataRequest</code> | 14 | <code>function</code> | <code>null</code> | <code>function (info)</code> | 화면에 보이는 행 범위(<code>startNodeIndex</code>, <code>endNodeIndex</code>)를 알려 주는 콜백. 느린 컬럼 값을 보이는 행만 채울 때 ([보이는 행의 값만 나중에 채우기](/datagridview/server-side#예제-6-대안-보이는-행의-값만-나중에-채우기)) |
| <code>pageScrollValueTriggeringInfiniteScroll</code> | 2 | <code>number&#124;object</code> | <code>undefined</code> | 0 과 1 사이 숫자 &#124; <code>{ x, y }</code> | <code>onInfiniteScroll</code> 콜백을 바닥보다 일찍 부른다. 0.5 면 스크롤할 수 있는 거리의 절반 지점 ([스크롤이 끝에 닿으면 행 더하기](/datagridview/server-side#예제-5-대안-스크롤이-끝에-닿으면-행-더하기)) |
| <code>paginationManager</code> | 2 | <code>object</code> | <code>undefined</code> | <code>new DataGridViewPaginationManager({ pageSize, currentPage, nodeDepth })</code> | 행을 페이지로 나눠 표시. pageSize 기본 100, currentPage 기본 1, nodeDepth 기본 0 (-1 이면 모든 깊이의 행을 셈). 모듈 <code>DS/DataGridView/DataGridViewPaginationManager</code> |
| <code>maxVisibleRowCount</code> | 8 | <code>number</code> | <code>undefined</code> | 숫자 | 그리드 높이를 행 N개 높이로 자동 계산 |
| <code>height</code> | - | <code>integer&#124;string</code> | <code>'inherit'</code> | 'inherit' &#124; 숫자 | 그리드 높이 |
| <code>placeholder</code> | - | <code>string</code> | 'No objects found' (번역) | 문자열 | 행이 없을 때 표시할 문구 |
| <code>shouldNodeBeRepresented</code> | 1 | <code>function</code> | - | <code>function (nodeModel) → boolean</code> | false 를 돌려주는 행은 그리드에 표시하지 않음 |

## 선택

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>rowSelection</code> | 89 | <code>string</code> | <code>'multiple'</code> | <code>'none' &#124; 'single' &#124; 'multiple'</code> | 행 선택 방식 (CollectionView) |
| <code>cellSelection</code> | 85 | <code>string</code> | <code>'multiple'</code> | <code>'none' &#124; 'single' &#124; 'multiple'</code> | 셀 선택 방식 (DataGridView 에서 기본 multiple 로 변경) |
| <code>columnSelection</code> | 20 | <code>string</code> | <code>'none'</code> | <code>'none' &#124; 'single' &#124; 'multiple'</code> | 컬럼 헤더 클릭으로 컬럼 전체 선택 |
| <code>showSelectionCheckBoxesFlag</code> | 40 | <code>string&#124;boolean</code> | <code>'OnOver'</code> | <code>'OnOver' &#124; true &#124; false</code> | 행 머리 선택 체크박스. 'OnOver' = 마우스 올릴 때만, true = 항상, false = 안 보임 |
| <code>selectionStyle</code> | 5 | <code>string</code> | <code>''</code> | <code>'' &#124; 'lightSelectionEdging'</code> | 선택 표시 스타일 (lightSelectionEdging = 테두리 위주의 옅은 표시) |
| <code>cellActivationFeedback</code> | 14 | <code>string</code> | <code>'cell'</code> | <code>'cell' &#124; 'row' &#124; 'none'</code> | 클릭(활성) 시 강조 범위 |
| <code>cellPreselectionFeedback</code> | 11 | <code>string</code> | <code>'cell'</code> | <code>'cell' &#124; 'none'</code> | 마우스 올렸을 때(프리셀렉션) 강조 |
| <code>selectionBehavior</code> | 43 | <code>object</code> | [하위 옵션 객체](/datagridview/api/sub-options) 참고 | <code>{ toggle, unselectAllOnEmptyArea, ... }</code> | 선택 동작 세부 설정 |
| <code>columnHeadersLayout</code> | 0 | <code>enum</code> | <code>0</code> | <code>0 (DEFAULT) &#124; 1 (SELECTION_FIRST)</code> | 1 이면 헤더의 선택 체크박스를 헤더 왼쪽에 둔다 |

## 표시

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>showRowIndexFlag</code> | 42 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 번호 |
| <code>showRowBorderFlag</code> | 39 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행 가로 구분선 |
| <code>showColumnBorderFlag</code> | 9 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 컬럼 세로 구분선 |
| <code>showAlternateBackgroundFlag</code> | 32 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 줄무늬 배경 |
| <code>showRowHeaderBackgroundFlag</code> | 15 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 머리(번호 영역) 배경 |
| <code>showOutlineFlag</code> | 22 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 그리드 외곽선 |
| <code>showBackgroundFlag</code> | 8 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 그리드 배경 |
| <code>showScrollbarsOnHover</code> | 2 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 마우스를 올렸을 때만 스크롤바 표시 |
| <code>showEditableFeedbackFlag</code> | 4 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 편집 가능한 셀 표시 |
| <code>showRequiredFeedbackFlag</code> | 0 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 필수 값(requiredFlag) 셀 표시 |
| <code>showModelChangesFlag</code> | 16 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 변경된 셀 강조 |
| <code>showNodeKPIColorFlag</code> | 19 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행 KPI 색상 표시 (컬럼 getCellKPIColor 와 같이 사용) |
| <code>showContextualMenuColumnFlag</code> | 35 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 오른쪽 끝에 메뉴 버튼 컬럼 추가. 버튼을 누르면 onContextualEvent 가 호출됨 |
| <code>showMatchingCellBackgroundFlag</code> | 1 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 찾기(find) 결과 셀 배경 강조 |
| <code>treeNodeCellOptions</code> | 13 | <code>object</code> | [하위 옵션 객체](/datagridview/api/sub-options) 참고 | <code>{ expanderStyle, showIconsFlag, ... }</code> | 트리 컬럼(dataIndex tree) 표시 방식 |
| <code>getCellTooltip</code> | - | <code>function</code> | <code>null</code> | function (cellInfos) → 툴팁 | 그리드 전체 셀 툴팁. ※ 이 옵션을 넣으면 컬럼의 getCellTooltip 은 호출되지 않음 (DataGridView._getCellTooltip, 2025 / 2026 같음) |

## 편집 / 키보드

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>editOnKeyPressFlag</code> | 2 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 셀 선택 후 글자를 치면 바로 편집 시작 |
| <code>focusNextEditableCellOnTabFlag</code> | 5 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | Tab 키로 다음 편집 가능 셀로 이동 |
| <code>selectNextCellOnEnterFlag</code> | 4 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | Enter 로 편집 완료 후 아래 셀 선택 |
| <code>deleteOptions</code> | 0 | <code>object</code> | <code>undefined</code> | <code>{ deleteSelectionOnKeyPress, showConfirmationDialog }</code> | Delete 키로 선택 행 삭제 |

## 정렬 / 필터 / 찾기

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>sortModel</code> | 43 | <code>array</code> | <code>null</code> | [{ dataIndex: '키', sort: 'asc' &#124; 'desc' }, ...] | 정렬 상태. 배열 순서 = 우선순위. [] = 정렬 해제 |
| <code>sortOptions</code> | 2 | <code>object</code> | <code>undefined</code> | <code>{ maxSortedColumnsCount, onOutOfBoundSortRequest }</code> | 다중 정렬 제한 |
| <code>filterViewOptions</code> | 5 | <code>object</code> | <code>undefined</code> | <code>{ maxAppliedFilterCount, ignoreGroupingNodes }</code> | 필터 팝업 옵션 (필터 자체는 [필터](/datagridview/api/filter)) |
| <code>findNavigationMode</code> | 2 | <code>string</code> | <code>'substring'</code> | <code>'substring' &#124; 'cell' &#124; 'row'</code> | 찾기(setFindStr) 결과 이동 단위 |
| <code>customViewsOptions</code> | 0 | <code>object</code> | <code>undefined</code> | <code>{ dialogMaximizedFlag }</code> | 사용자 뷰 대화상자 옵션. 키는 하나뿐 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views)) |
| <code>useWidgetPreferencesFlag</code> | 13 | <code>boolean (readOnly)</code> | <code>false</code> | <code>true &#124; false</code> | 화면 상태를 저장하는 곳. false = 브라우저 localStorage, true = 위젯 설정. 저장 자체는 `identifier` 가 있어야 동작 ([저장 위치](/datagridview/custom-views#저장-위치)) |

## 드래그 / 그룹

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>columnDragEnabledFlag</code> | 14 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 컬럼 헤더 드래그로 순서 변경 |
| <code>rowReorderEnabledFlag</code> | 9 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 끌어 온 행을 그리드가 옮겨 주는 기본 동작 허용. rowDragEnabledFlag 도 true 여야 동작 ([드래그앤드롭](/datagridview/drag-and-drop#옵션-네-개와-잡는-곳)) |
| <code>rowDragEnabledFlag</code> | 30 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행 머리에 손잡이를 보이고 행을 끌 수 있게 함. 켜면 행 순서 바꾸기도 같이 켜짐 (막으려면 rowReorderEnabledFlag: false) |
| <code>cellDragEnabledFlag</code> | 42 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 데이터 셀을 잡고 끌 수 있게 함 (편집 중인 셀 제외). 넘길 데이터는 onDragStartCell 에서 넣음. 만들 때 정함: 만든 뒤 false 로 바꿔도 이미 그려진 셀은 계속 끌림 |
| <code>onDragStart/Drag/DragEnter/DragOver/DragLeave/Drop/DragEnd + ColumnHeader &#124; RowHeader &#124; Cell &#124; Blank</code> | - | <code>function</code> | <code>undefined</code> | <code>function (event, cellInfos) → boolean</code> | 드래그앤드롭 콜백 28개. 예: onDropCell, onDragOverRowHeader, onDropBlank. true 를 돌려줘야 그리드 기본 동작이 이어서 실행됨. 이름 전체는 아래 "드래그앤드롭 콜백 이름" 표, 인자와 기본 동작은 [드래그앤드롭](/datagridview/drag-and-drop#콜백) |
| <code>rowGroupingEnabledFlag</code> | 14 | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 사용자가 화면에서 행을 묶는 기능 허용. 코드로 부르는 groupRows 는 막지 않음 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>rowGroupingOptions</code> | 10 | <code>object</code> | [하위 옵션 객체](/datagridview/api/sub-options#rowgroupingoptions) 참고 | <code>{ depth, maxDepth, hideGroupedColumns, ... }</code> | 행을 묶는 방법. 이것만으로는 묶이지 않고 groupRows 를 불러야 함 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>onContextualEvent</code> | 78 | <code>function</code> | 기본 메뉴 | <code>function (params) → 메뉴 항목 배열</code> | 우클릭 메뉴 직접 구성. params.cellInfos = 우클릭한 셀, params.collectionView = 그리드 ([우클릭 메뉴](/datagridview/context-menu)) |
| <code>useAsyncPreExpand</code> | 45 | <code>boolean</code> | <code>undefined</code> | <code>true &#124; false</code> | 트리 펼치기 비동기 처리 ([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)) |

### 드래그앤드롭 콜백 이름

콜백 이름은 `on` + 단계 + 대상입니다. 모두 `function (event, cellInfos)` 형태이고, 괄호 안은 사용 파일 수입니다. 콜백이 `true` 를 돌려주지 않으면 그리드의 기본 동작(행 이동, 컬럼 순서 바꾸기, 위치 표시)이 실행되지 않습니다.

| 대상 | 콜백 |
| --- | --- |
| 셀 | <code>onDragStartCell</code> (38), <code>onDragOverCell</code> (24), <code>onDropCell</code> (22), <code>onDragEndCell</code> (19), <code>onDragLeaveCell</code> (13), <code>onDragEnterCell</code> (9), <code>onDragCell</code> (2) |
| 행 머리 | <code>onDropRowHeader</code> (11), <code>onDragStartRowHeader</code> (10), <code>onDragOverRowHeader</code> (10), <code>onDragEnterRowHeader</code> (5), <code>onDragLeaveRowHeader</code> (5), <code>onDragEndRowHeader</code> (3), <code>onDragRowHeader</code> (2) |
| 컬럼 헤더 | <code>onDragOverColumnHeader</code> (7), <code>onDragStartColumnHeader</code> (6), <code>onDropColumnHeader</code> (6), <code>onDragEndColumnHeader</code> (5), <code>onDragEnterColumnHeader</code> (4), <code>onDragLeaveColumnHeader</code> (4), <code>onDragColumnHeader</code> (0) |
| 빈 영역 | <code>onDragEnterBlank</code> (15), <code>onDropBlank</code> (14), <code>onDragOverBlank</code> (10), <code>onDragLeaveBlank</code> (6), <code>onDragEndBlank</code> (4), <code>onDragStartBlank</code> (0), <code>onDragBlank</code> (0) |

단계는 브라우저의 드래그 이벤트와 같습니다 (`DragStart` 끌기 시작, `Drag` 끄는 동안, `DragEnter` / `DragOver` / `DragLeave` 다른 곳 위를 지날 때, `Drop` 놓을 때, `DragEnd` 끝날 때). 인자, 반환값, 예제는 [드래그앤드롭](/datagridview/drag-and-drop), 그리드 밖과 주고받는 데이터 형식은 [끌어 놓기](/events/drag-and-drop) 를 보세요.

## 공통 (Controls/Abstract, CollectionView)

| 키 | 사용 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>identifier</code> | - | <code>string (readOnly)</code> | <code>undefined</code> | 문자열 | 그리드 이름. 화면 상태(너비, 순서, 표시, 정렬)를 이 이름으로 저장하므로 없으면 저장되지 않음. 화면마다 겹치지 않게 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views)) |
| <code>domId</code> | - | <code>string</code> | <code>null</code> | 문자열 | 최상위 DOM id |
| <code>visibleFlag</code> | - | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 표시 여부 |
| <code>disabled</code> | - | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 비활성 |
| <code>touchMode</code> | - | <code>boolean</code> | <code>undefined</code> | <code>true &#124; false</code> | 터치 모드 (행 높이 40px 등) |
| <code>tooltipInfos</code> | - | <code>object</code> | <code>undefined</code> | <code>{ shortHelp, ... }</code> | 컴포넌트 툴팁 |
| <code>fireOnlyFromUIInteractionFlag</code> | 13 | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | UI 조작으로 바뀔 때만 이벤트 발생 |
| <code>cellClass / layout / model / nodeModelClass</code> | - | - | - | - | 내부 확장용. 일반적으로 지정하지 않음 |
