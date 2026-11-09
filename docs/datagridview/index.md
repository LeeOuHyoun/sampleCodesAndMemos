# DataGridView 개요

DataGridView 는 ENOVIA 화면에서 쓰는 트리/표 그리드 컨트롤입니다. 데이터를 행과 컬럼으로 보여주고, 셀 편집, 정렬, 필터, 툴바, 행 그룹핑을 지원합니다.

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

필터와 툴바는 예외로 생성자 옵션이 없습니다. 필터는 `treeDocument.setFilterModel(...)`, 툴바는 `grid.setToolbar(...)` 로 만듭니다.

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [01_basic.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/01_basic.html) | 최소 구성 | [기본 그리드](/datagridview/getting-started) |
| [02_cellTypes.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/02_cellTypes.html) | 셀 타입 모음 | [셀 타입](/datagridview/cell-types) |
| [03_toolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/03_toolbar.html) | 툴바 + 그리드 | [툴바](/datagridview/toolbar) |
| [04_sortFilter.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/04_sortFilter.html) | 정렬, 필터 | [정렬과 필터](/datagridview/sort-filter) |
| [05_options.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/05_options.html) | 실시간 설정 (값을 바꾸며 확인, 이벤트 로그) | [그리드 옵션](/datagridview/api/grid-options) |

::: warning
샘플은 `<3DSpace>/webapps/DataGridViewSample/` 에 두고 ENOVIA 서버 주소로 열어야 동작합니다.
:::
