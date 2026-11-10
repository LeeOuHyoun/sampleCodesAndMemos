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
| 드래그앤드롭 | `rowDragEnabledFlag` (30), `onDropCell` (22) | [그리드 옵션](/datagridview/api/grid-options#드래그-그룹) |
| 툴바 | `setToolbar` (27) | [툴바](/datagridview/toolbar) |
| 상태바 | `buildStatusBar` (21) | [상태바](/datagridview/status-bar) |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [기본 그리드](/datagridview/getting-started) | 컬럼과 데이터로 그리드를 띄우는 최소 구성 |
| [셀 타입](/datagridview/cell-types) | `typeRepresentation` 별 셀 모양과 편집기 |
| [편집](/datagridview/editing) | `editableFlag`, `editionPolicy`, 편집 이벤트 |
| [저장 후 화면 반영](/datagridview/save-and-reflect) | 서버 저장 뒤 행 값 갱신, 실패 시 되돌리기 |
| [행 높이](/datagridview/row-height) | 행 높이 설정을 넣는 세 자리 |
| [정렬과 필터](/datagridview/sort-filter) | `sortModel`, `setFilterModel` |
| [툴바](/datagridview/toolbar) | `grid.setToolbar(JSON)` 으로 검색창, 콤보, 버튼 놓기 |
| [트리 구조](/datagridview/tree) | 하위 행, 펼치기, 펼칠 때 하위 행 불러오기, 행 아이콘 |
| [컬럼 함수](/datagridview/cell-functions) | 행마다 다른 값, 셀 타입, 콤보 목록, 편집 가능 여부, 모양 |
| [우클릭 메뉴와 선택](/datagridview/context-menu) | `onContextualEvent`, 메뉴 버튼 컬럼, 선택 변경 받기 |
| [셀 직접 그리기](/datagridview/custom-cell) | `onCellRequest` 와 셀 내용 재사용 |
| [상태바](/datagridview/status-bar) | `grid.buildStatusBar([...])` 로 행 수, 선택 수 표시 |
| [그리드 옵션](/datagridview/api/grid-options) · [그리드 메서드](/datagridview/api/grid-methods) · [layoutOptions](/datagridview/api/layout-options) | 그리드 레퍼런스 |
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
