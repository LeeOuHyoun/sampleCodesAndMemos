# DataGridView 개요 <Badge type="tip" text="서버 확인" />

DataGridView 는 ENOVIA 화면에서 쓰는 트리/표 그리드 컨트롤입니다. 데이터를 행과 컬럼으로 보여주고, 셀 편집, 정렬, 필터, 툴바, 행 그룹핑을 지원합니다.

::: info 근거
DataGridView/DataGridView.js (`DS/DataGridView/DataGridView` 와 하위 모듈), CollectionView/CollectionView.js (상속 원본), TreeModel/TreeModel.js (`DS/TreeModel/TreeDocument`, `DS/TreeModel/TreeNodeModel`). DataGridViewSample 은 ENOVIA 서버에서 동작 확인.
:::

## 구성 요소

그리드는 화면(DataGridView)과 데이터(TreeDocument)가 나뉘어 있습니다. **데이터를 바꾸면 그리드가 알아서 다시 그립니다.**

| 모듈 | 역할 | AMD 모듈 이름 |
| --- | --- | --- |
| DataGridView | 그리드 화면. 컬럼, 모양, 동작 설정 | `DS/DataGridView/DataGridView` |
| TreeDocument | 데이터 묶음. 행 추가/삭제, 선택, 필터 | `DS/TreeModel/TreeDocument` |
| TreeNodeModel | 행 하나. 셀 값, 하위 행 | `DS/TreeModel/TreeNodeModel` |

```js
require([
  'DS/DataGridView/DataGridView',
  'DS/TreeModel/TreeDocument',
  'DS/TreeModel/TreeNodeModel'
], function (DataGridView, TreeDocument, TreeNodeModel) {
  var treeDocument = new TreeDocument();
  treeDocument.addRoot(new TreeNodeModel({ label: 'PRT-0001', grid: { title: '브라켓' } }));

  new DataGridView({
    treeDocument: treeDocument,
    columns: [
      { text: '품번', dataIndex: 'tree' },
      { text: '품명', dataIndex: 'title' }
    ]
  }).inject(document.getElementById('grid'));
});
```

## 데이터와 컬럼의 연결

행(TreeNodeModel)의 값은 컬럼의 `dataIndex` 로 연결됩니다.

| 행 데이터 | 컬럼 | 설명 |
| --- | --- | --- |
| `label` | `dataIndex: 'tree'` | 첫 번째 트리 컬럼. 펼치기/접기 아이콘이 붙습니다 |
| `grid.title` | `dataIndex: 'title'` | 나머지 컬럼은 `grid` 안의 같은 이름 키 |

컬럼이 없는 키도 `grid` 안에 넣어 둘 수 있습니다. 화면에는 보이지 않으므로 서버 ID 같은 값을 보관할 때 씁니다.

## 설정을 넣는 자리

모든 설정은 `new DataGridView({ ... })` 에 넘기는 객체 안에 넣지만, 넣는 자리가 세 군데로 나뉩니다.

| 자리 | 예 | 만든 뒤에 바꾸기 | 레퍼런스 |
| --- | --- | --- | --- |
| 설정 객체 최상위 | `rowSelection`, `showRowIndexFlag`, `sortModel` | `grid.키 = 값` | [그리드 옵션](/datagridview/api/grid-options) |
| `layoutOptions: { ... }` | `cellHeight`, `rowsHeader`, `layoutDensity` | `grid.layout.키 = 값` | [layoutOptions](/datagridview/api/layout-options) |
| `columns: [ { ... } ]` | `width`, `typeRepresentation`, `editableFlag` | - | [컬럼 옵션](/datagridview/api/column-options) |

필터, 툴바, 상태바는 예외로 생성자 옵션이 없습니다. 필터는 `treeDocument.setFilterModel(...)`, 툴바는 `grid.setToolbar(...)`, 상태바는 `grid.buildStatusBar(...)` 로 만듭니다.

만든 뒤에 컬럼을 숨기거나 너비, 고정, 순서를 바꾸는 함수는 `grid.layout` 에 있습니다 ([레이아웃 메서드](/datagridview/api/layout-methods)).

## 하고 싶은 일로 찾기

키 이름을 모를 때는 아래 표에서 찾습니다. 이름을 알면 [이름 색인 (A-Z)](/datagridview/api/key-index) 이나 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)을 씁니다. 검색은 `HeaderHeight` 처럼 이름의 일부만 넣어도 됩니다.

### 모양

| 하고 싶은 일 | 키 / 함수 | 넣는 자리 | 문서 |
| --- | --- | --- | --- |
| 헤더 높이 바꾸기 | `columnHeaderHeight` | `layoutOptions` | [헤더 높이](/datagridview/header#헤더-높이) |
| 헤더 줄, 행 머리(번호 칸) 숨기기 | `columnsHeader`, `rowsHeader`, `showRowIndexFlag` | `layoutOptions`, 그리드 옵션 | [헤더 숨기기](/datagridview/header#헤더-숨기기) |
| 헤더를 2단으로 묶기 | `children` | 컬럼 옵션 | [컬럼 그룹](/datagridview/header#헤더를-2단으로-묶기-컬럼-그룹) |
| 헤더 글자, 아이콘, 툴팁 | `text`, `icon`, `description` | 컬럼 옵션 | [헤더 글자](/datagridview/header#헤더-글자-아이콘-툴팁) |
| 행 높이 바꾸기 | `cellHeight`, `layoutDensity` | `layoutOptions` | [행 높이](/datagridview/row-height) |
| 긴 글에 맞춰 행 높이 자동 | `autoRowHeightFlag` | 컬럼 옵션 | [행 높이](/datagridview/row-height#예제-6-긴-글에-맞춰-자동으로) |
| 그리드 전체 높이 | `height`, `maxVisibleRowCount` | 그리드 옵션 | [행 높이](/datagridview/row-height#예제-7-그리드-전체-높이-행-높이-아님) |
| 줄무늬, 구분선, 외곽선 | `showAlternateBackgroundFlag`, `showRowBorderFlag`, `showColumnBorderFlag`, `showOutlineFlag` | 그리드 옵션 | [표시](/datagridview/api/grid-options#표시) |
| 컬럼 너비, 좌우 고정, 정렬 방향 | `width`, `minWidth`, `pinned`, `alignment` | 컬럼 옵션 | [크기 / 위치](/datagridview/api/column-options#크기-위치) |
| 컬럼 너비를 내용에 맞추기 | `grid.sizeAllColumnsToFit()` | 그리드 메서드 | [컬럼](/datagridview/api/grid-methods#컬럼) |
| 만든 뒤에 컬럼 숨기기, 너비 / 고정 / 순서 바꾸기 | `grid.layout.setColumnVisibleFlag(...)` 등 | `grid.layout` | [레이아웃 메서드](/datagridview/api/layout-methods) |
| 셀을 콤보, 날짜, 체크박스로 | `typeRepresentation`, `semantics` | 컬럼 옵션 | [셀 타입](/datagridview/cell-types) |
| 행마다 셀 색, 툴팁, 아이콘 다르게 | `getCellClassName`, `getCellTooltip`, `getCellIcons` | 컬럼 함수 | [컬럼 함수](/datagridview/cell-functions) |
| 셀에 버튼이나 직접 만든 DOM 넣기 | `onCellRequest` | 컬럼 함수 | [셀 직접 그리기](/datagridview/custom-cell) |
| 행이 없을 때 문구 | `placeholder` | 그리드 옵션 | [데이터](/datagridview/api/grid-options#데이터) |

### 데이터와 편집

| 하고 싶은 일 | 키 / 함수 | 넣는 자리 | 문서 |
| --- | --- | --- | --- |
| 셀 편집 켜기, 한 번 클릭으로 편집 | `editableFlag`, `editionPolicy` | 컬럼 옵션 | [편집](/datagridview/editing) |
| 행마다 편집 가능 여부 다르게 | `getCellEditableState` | 컬럼 함수 | [컬럼 함수](/datagridview/cell-functions) |
| 편집한 값을 서버에 저장 | `change` 이벤트, `updateOptions` | 이벤트, 행 | [저장 후 화면 반영](/datagridview/save-and-reflect) |
| 하위 행 달기, 펼칠 때 불러오기 | `addChild`, `onPreExpand` | 행, TreeDocument | [트리 구조](/datagridview/tree) |
| 행 추가, 삭제, 값 읽기 | `addRoot`, `remove`, `getAttributeValue` | TreeDocument, 행 | [데이터](/datagridview/api/data) |
| 행이 아주 많을 때 나눠 불러오기 | `grid.onInfiniteScroll(...)`, `dataSource` | 그리드 메서드, 그리드 옵션 | [서버 사이드 데이터](/datagridview/server-side) |
| 로딩 표시 | `grid.displayModalLoader()` | 그리드 메서드 | [로딩 표시](/datagridview/api/grid-methods#로딩-표시) |
| CSV 로 내보내기, 인쇄 | `grid.getAsCSV()`, `grid.openPrintableViewWindow()` | 그리드 메서드 | [그리드 메서드](/datagridview/api/grid-methods#툴바-그룹-내보내기) |

### 기능

| 하고 싶은 일 | 키 / 함수 | 넣는 자리 | 문서 |
| --- | --- | --- | --- |
| 한 행만 선택, 체크박스 보이기 | `rowSelection`, `showSelectionCheckBoxesFlag` | 그리드 옵션 | [선택](/datagridview/api/grid-options#선택) |
| 선택된 행 읽기, 선택이 바뀔 때 알기 | `getSelectedNodes()`, `getXSO().onPostAdd` | TreeDocument | [선택 변경 받기](/datagridview/context-menu#선택-변경-받기) |
| 정렬, 필터 | `sortModel`, `setFilterModel` | 그리드 옵션, TreeDocument | [정렬과 필터](/datagridview/sort-filter) |
| 같은 값끼리 행 묶기 | `rowGroupingOptions`, `grid.groupRows(...)` | 그리드 옵션, 그리드 메서드 | [행 그룹핑](/datagridview/row-grouping) |
| 우클릭 메뉴 | `onContextualEvent` | 그리드 옵션 | [우클릭 메뉴와 선택](/datagridview/context-menu) |
| 행을 끌어 순서 바꾸기, 끌어 놓기 | `rowDragEnabledFlag`, `onDropCell` | 그리드 옵션 | [드래그앤드롭](/datagridview/drag-and-drop) |
| 검색창, 버튼이 있는 툴바 | `grid.setToolbar(...)` | 그리드 메서드 | [툴바](/datagridview/toolbar) |
| 아래에 행 수, 선택 수 표시 | `grid.buildStatusBar(...)` | 그리드 메서드 | [상태바](/datagridview/status-bar) |
| 사용자가 바꾼 컬럼 너비, 순서 기억 | `identifier`, `useWidgetPreferencesFlag` | 그리드 옵션 | [사용자 뷰와 화면 상태 저장](/datagridview/custom-views) |
| 특정 행으로 스크롤 | `grid.ensureNodeModelVisible(...)` | 그리드 메서드 | [스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) |

## 실제 앱에서 많이 쓰는 기능

enovia2025 webapps 에서 DataGridView 를 쓰는 앱 파일 119개를 기준으로, 기능별로 그 이름이 나오는 파일 수를 센 것입니다. 무엇부터 익힐지 정할 때 참고합니다.

| 기능 | 대표 이름 (파일 수) | 문서 |
| --- | --- | --- |
| 트리 (하위 행) | `addChild` (89), `expandAll` (52), `onPreExpand` (21) | [트리 구조](/datagridview/tree) |
| 우클릭 메뉴 | `onContextualEvent` (78), `showContextualMenuColumnFlag` (35) | [우클릭 메뉴와 선택](/datagridview/context-menu) |
| 행 값 바꾸기 | `updateOptions` (75), `setCellValue` (25) | [저장 후 화면 반영](/datagridview/save-and-reflect) |
| 선택 | `getSelectedNodes` (72), `getXSO` (53) | [우클릭 메뉴와 선택](/datagridview/context-menu#선택-변경-받기) |
| 컬럼 공통 기본값 | `defaultColumnDef` (72) | [컬럼 옵션](/datagridview/api/column-options) |
| 컬럼 함수 | `getCellSemantics` (57), `getCellTooltip` (52), `getCellValue` (47) | [컬럼 함수](/datagridview/cell-functions) |
| 셀 직접 그리기 | `onCellRequest` (41), `registerReusableCellContent` (31) | [셀 직접 그리기](/datagridview/custom-cell) |
| 필터 | `setFilterModel` (36) | [정렬과 필터](/datagridview/sort-filter) |
| 드래그앤드롭 | `cellDragEnabledFlag` (42), `onDragStartCell` (38), `rowDragEnabledFlag` (30), `onDropCell` (22) | [드래그앤드롭](/datagridview/drag-and-drop) |
| 만든 뒤에 컬럼 다루기 | `getDataIndexFromColumnIndex` (36), `setColumnVisibleFlag` (26) | [레이아웃 메서드](/datagridview/api/layout-methods) |
| 사용자 뷰, 화면 상태 | `getCustomViewsManager` (17), `useWidgetPreferencesFlag` (13) | [사용자 뷰와 화면 상태 저장](/datagridview/custom-views) |
| 행 그룹핑 | `groupableFlag` (16), `rowGroupingEnabledFlag` (14), `groupRows` (10) | [행 그룹핑](/datagridview/row-grouping) |
| 행을 나눠 불러오기 | `onDelayedModelDataRequest` (14), `onInfiniteScroll` (7), `dataSource` (1) | [서버 사이드 데이터](/datagridview/server-side) |
| 툴바 | `setToolbar` (27) | [툴바](/datagridview/toolbar) |
| 상태바 | `buildStatusBar` (21) | [상태바](/datagridview/status-bar) |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [기본 그리드](/datagridview/getting-started) | 컬럼과 데이터로 그리드를 띄우는 최소 구성 |
| [셀 타입](/datagridview/cell-types) | `typeRepresentation` 별 셀 모양과 편집기 |
| [편집](/datagridview/editing) | `editableFlag`, `editionPolicy`, 편집 이벤트 |
| [저장 후 화면 반영](/datagridview/save-and-reflect) | 서버 저장 뒤 행 값 갱신, 실패 시 되돌리기 |
| [헤더](/datagridview/header) | 헤더 높이, 헤더 숨기기, 헤더 글자와 아이콘, 2단 헤더, 헤더 직접 그리기 |
| [행 높이](/datagridview/row-height) | 행 높이 설정을 넣는 세 자리 |
| [정렬과 필터](/datagridview/sort-filter) | `sortModel`, `setFilterModel` |
| [서버 사이드 데이터](/datagridview/server-side) | 행을 필요한 만큼만 불러오기. `dataSource`, `onInfiniteScroll`, `onDelayedModelDataRequest` |
| [행 그룹핑](/datagridview/row-grouping) | `rowGroupingOptions`, `groupRows`, 그룹 행 다루기 |
| [드래그앤드롭](/datagridview/drag-and-drop) | 행 순서 바꾸기, 드래그 콜백, 밖에서 끌어 온 것 받기 |
| [사용자 뷰와 화면 상태 저장](/datagridview/custom-views) | 컬럼 너비, 순서, 표시, 정렬을 저장하고 되살리기 |
| [툴바](/datagridview/toolbar) | `grid.setToolbar(JSON)` 으로 검색창, 콤보, 버튼 놓기 |
| [트리 구조](/datagridview/tree) | 하위 행, 펼치기, 펼칠 때 하위 행 불러오기, 행 아이콘 |
| [컬럼 함수](/datagridview/cell-functions) | 행마다 다른 값, 셀 타입, 콤보 목록, 편집 가능 여부, 모양 |
| [우클릭 메뉴와 선택](/datagridview/context-menu) | `onContextualEvent`, 메뉴 버튼 컬럼, 선택 변경 받기 |
| [셀 직접 그리기](/datagridview/custom-cell) | `onCellRequest` 와 셀 내용 재사용 |
| [상태바](/datagridview/status-bar) | `grid.buildStatusBar([...])` 로 행 수, 선택 수 표시 |
| [이름 색인 (A-Z)](/datagridview/api/key-index) | 옵션, 함수, 이벤트 이름을 알파벳 순으로 찾기 |
| [그리드 옵션](/datagridview/api/grid-options) · [그리드 메서드](/datagridview/api/grid-methods) · [layoutOptions](/datagridview/api/layout-options) · [레이아웃 메서드](/datagridview/api/layout-methods) | 그리드 레퍼런스 |
| [컬럼 옵션](/datagridview/api/column-options) · [컬럼 함수](/datagridview/api/column-functions) · [typeRepresentation](/datagridview/api/type-representation) · [하위 옵션 객체](/datagridview/api/sub-options) | 컬럼 레퍼런스 |
| [필터 (filterId)](/datagridview/api/filter) · [툴바 (setToolbar)](/datagridview/api/toolbar) · [데이터 (TreeDocument)](/datagridview/api/data) · [이벤트](/datagridview/api/events) | 필터, 툴바, 데이터, 이벤트 레퍼런스 |

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [01_basic.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/01_basic.html) | 최소 구성 | [기본 그리드](/datagridview/getting-started) |
| [02_cellTypes.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/02_cellTypes.html) | 셀 타입 모음 | [셀 타입](/datagridview/cell-types) |
| [03_toolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/03_toolbar.html) | 툴바 + 그리드 | [툴바](/datagridview/toolbar) |
| [04_sortFilter.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/04_sortFilter.html) | 정렬, 필터 | [정렬과 필터](/datagridview/sort-filter) |
| [05_options.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/05_options.html) | 실시간 설정 (값을 바꾸며 확인, 이벤트 로그) | [그리드 옵션](/datagridview/api/grid-options) |
| [06_tree.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/06_tree.html) | 트리, 펼칠 때 불러오기, 행 아이콘 | [트리 구조](/datagridview/tree) |
| [07_columnFunctions.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/07_columnFunctions.html) | 컬럼 함수 모음 | [컬럼 함수](/datagridview/cell-functions) |
| [08_contextMenu.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/08_contextMenu.html) | 우클릭 메뉴, 선택 | [우클릭 메뉴와 선택](/datagridview/context-menu) |
| [09_save.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/09_save.html) | 셀 단위 저장, 모아서 저장, 실패 시 되돌리기 | [저장 후 화면 반영](/datagridview/save-and-reflect) |
| [10_customCell.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/10_customCell.html) | 셀 직접 그리기, 상태바 | [셀 직접 그리기](/datagridview/custom-cell) · [상태바](/datagridview/status-bar) |

01 ~ 05 는 ENOVIA 서버에서 동작을 확인했습니다. 06 ~ 10 은 원본 소스 분석으로 작성했고 아직 서버에서 확인하지 않았습니다. 다르게 동작하면 원본 쪽이 맞습니다.

::: warning
샘플은 `<3DSpace>/webapps/DataGridViewSample/` 에 두고 ENOVIA 서버 주소로 열어야 동작합니다.
:::
