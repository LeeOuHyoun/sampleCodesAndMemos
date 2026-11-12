# 기본 그리드 <Badge type="tip" text="서버 확인" />

컬럼 3개와 데이터 5행으로 그리드를 띄우는 최소 구성입니다.

샘플: [01_basic.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/01_basic.html)

::: info 근거
DataGridViewSample/01_basic.html (ENOVIA 서버에서 동작 확인), DataGridView.js 의 DataGridView publishedProperties (`treeDocument`, `columns`, `height` 기본값 `'inherit'`, `maxVisibleRowCount`).
:::

## 1. 화면 준비

```html
<link rel="stylesheet" type="text/css" href="../Core/wux.css" />
<script type="text/javascript" src="../AmdLoader/AmdLoader.js"></script>

<div id="grid" style="position: relative; height: 400px"></div>
```

| 파일 | 역할 |
| --- | --- |
| `../Core/wux.css` | WebUX 공통 스타일 (그리드, 컨트롤 모양) |
| `../AmdLoader/AmdLoader.js` | `require()` 로더. `DS/모듈/파일` 을 `webapps/모듈/파일.js` 로 찾습니다 |

::: warning 그리드를 넣을 요소에 높이를 꼭 주세요
그리드 높이 기본값은 `'inherit'` 이라 부모 요소 높이를 그대로 씁니다. 부모에 높이가 없으면 그리드가 보이지 않습니다. 행 수만큼 높이를 맞추려면 그리드 옵션 `maxVisibleRowCount` 를 씁니다.

높이 기본값일 때 그리드는 자신을 `position: absolute` (위, 왼쪽, 아래 0, 너비 100%) 로 놓습니다 (CollectionView `_applyHeight`). 그래서 그리드를 넣을 요소에 `position: relative` 도 줘야 그 요소 안에 맞게 들어갑니다. 없으면 가장 가까운 위치 지정 조상(없으면 페이지 전체)을 덮습니다 (로컬 실행 확인).
:::

## 2. 데이터 준비

TreeDocument(데이터 묶음)에 TreeNodeModel(행)을 넣습니다.

```js
var treeDocument = new TreeDocument();
treeDocument.prepareUpdate();
[
  { label: 'PRT-0001', grid: { title: '브라켓', owner: '김철수' } },
  { label: 'PRT-0002', grid: { title: '샤프트', owner: '이영희' } },
  { label: 'PRT-0003', grid: { title: '하우징', owner: '박민수' } }
].forEach(function (row) {
  treeDocument.addRoot(new TreeNodeModel(row));
});
treeDocument.pushUpdate();
```

- `label` : 첫 번째 트리 컬럼(`dataIndex: 'tree'`)에 표시되는 값
- `grid` : 나머지 컬럼 값. 키 이름이 컬럼의 `dataIndex` 와 연결됩니다.
- `prepareUpdate()` 와 `pushUpdate()` 사이에서 여러 행을 넣으면 화면을 한 번만 다시 그립니다.

## 3. 그리드 생성

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: [
    { text: '품번', dataIndex: 'tree', width: 150 },
    { text: '품명', dataIndex: 'title', width: 200 },
    { text: '담당자', dataIndex: 'owner', width: 120 }
  ]
}).inject(document.getElementById('grid'));
```

- `text` : 헤더 글자
- `dataIndex` : 값을 가져올 키. `'tree'` 는 행의 `label` 을 보여주는 특별한 컬럼입니다.
- `inject(요소)` : 그리드를 화면 요소 안에 붙입니다.

## 다음 단계

- 셀을 콤보, 체크박스, 날짜 등으로 바꾸기 → [셀 타입](/datagridview/cell-types)
- 셀 편집하기 → [편집](/datagridview/editing)
- 하위 행이 있는 트리로 만들기 → [트리 구조](/datagridview/tree)
- 행마다 값, 콤보 목록, 모양을 다르게 하기 → [컬럼 함수](/datagridview/cell-functions)
- 우클릭 메뉴 넣기, 선택된 행 알기 → [우클릭 메뉴와 선택](/datagridview/context-menu)
- 모든 옵션 보기 → [그리드 옵션](/datagridview/api/grid-options)
