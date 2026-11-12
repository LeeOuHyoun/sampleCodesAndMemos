# DataGridViewUtils 사용법

DataGridView 를 다룰 때 반복되는 처리(행 갱신, 키로 찾기, 선택, 트리 지연 로딩, 변경 모으기 등)를 모은 개발용 보조 모듈입니다.

- 소스: `DataGridViewUtils.js` (같은 폴더)
- 각 함수의 인자와 반환값 상세는 소스의 JSDoc 을 봅니다.

## 1. 불러오기

```js
define('DS/MyApp/PartListView', ['DS/CommonUtils/DataGridViewUtils'], (GridUtils) => {
  GridUtils.loadRows('partGrid', fetchParts);
});
```

- 모듈 이름 `DS/CommonUtils/DataGridViewUtils` 와 의존 모듈 `DS/lodash` 의 루트는 현장 경로로 바꿔서 씁니다.
- 그 밖의 의존 모듈: `DS/DataGridView/DataGridView`, `DS/TreeModel/TreeDocument`, `DS/TreeModel/TreeNodeModel`

## 2. 첫 인자 target

모든 함수의 첫 인자로 아래 중 아무거나 넘길 수 있습니다.

| 넘기는 값 | 예 |
| --- | --- |
| 그리드 인스턴스 | `GridUtils.getRows(grid)` |
| 그리드를 담은 DOM 요소의 id | `GridUtils.getRows('partGrid')` (`grid.inject(document.getElementById('partGrid'))` 한 경우) |
| DOM 요소 (그리드를 담은 요소, 셀 안의 요소) | `GridUtils.getRows(event.target)` |
| TreeDocument | `GridUtils.getRows(treeDocument)` (데이터만 다루는 함수만) |

- 그리드를 못 찾으면 `DataGridView not found: ...` 오류를 던집니다.
- 그리드 화면을 다루는 함수(선택, 이동, 정렬, 컬럼, 로딩, 이벤트, CSV)는 TreeDocument 를 받지 않습니다. 아래 함수 목록의 target 열을 봅니다.

## 3. 행 데이터와 조건

### 행 데이터(Row)

행을 넣고 읽을 때 쓰는 평범한 객체입니다. 아래 키를 뺀 나머지는 모두 컬럼 값(`dataIndex: 값`)이 됩니다.

```js
{
  label: 'PRT-0001',
  id: 'a1b2',
  title: '브라켓',
  status: '작업중',
  icons: [{ iconName: 'folder', fontIconFamily: 1 }],
  children: []
}
```

| 키 | 뜻 |
| --- | --- |
| `label` | 트리 컬럼(`dataIndex: 'tree'`) 값 |
| `children` | 하위 행 배열. 빈 배열 `[]` 은 "하위 행이 있지만 아직 안 불러옴" (펼침 아이콘 표시) |
| `icons`, `badges`, `data` | TreeNodeModel 옵션 그대로 |

`getRow(node)` 와 `getRows(...)` 는 `{ label, ...컬럼 값 }` 형태로 돌려줍니다. children 은 넣지 않습니다.

### 행 조건(predicate)

행을 고르는 함수(`getNodes`, `findNode`, `removeNodes`, `selectNodes`, `showRowsWhere` 등)는 lodash iteratee 형태로 조건을 받습니다.

| 형태 | 예 | 뜻 |
| --- | --- | --- |
| 함수 | `(row, node) => row.qty > 10` | 행 데이터와 TreeNodeModel 을 받음 |
| 객체 | `{ status: '완료' }` | 값이 모두 같은 행 |
| 문자열 | `'checked'` | 그 컬럼 값이 truthy 인 행 |

`removeNodes`, `selectNodes` 는 조건 대신 TreeNodeModel 하나나 배열도 받습니다.

## 4. 상황별 사용법

### 데이터 불러와서 전체 교체

```js
GridUtils.loadRows('partGrid', () => fetchParts(), 'Loading...');
GridUtils.setRows('partGrid', rows);
GridUtils.clearRows('partGrid');
```

- `loadRows` 는 불러오는 동안 그리드에 로딩 표시를 덮고, 끝나면 `setRows` 로 교체합니다. 함수 대신 Promise 를 넘겨도 됩니다.
- `setRows` 는 변경 트랜잭션 모드가 켜져 있어도 변경 기록 없이 새 데이터로 시작합니다. 저장 안 된 변경은 버려집니다.

### 서버 저장 결과 반영

```js
saveToServer(payload).then((results) => {
  const notFound = GridUtils.updateRows('partGrid', results);
  GridUtils.upsertRows('partGrid', results, 'physicalId');
});
```

- `updateRows` 는 키 컬럼(기본 `id`) 값이 같은 행을 찾아 값을 바꾸고, 못 찾은 행 데이터를 돌려줍니다.
- `upsertRows` 는 없는 행을 최상위에 추가하고, 추가된 행을 돌려줍니다.
- 행 하나만 바꿀 때는 `GridUtils.updateNode(node, { title: '새 품명', label: 'PRT-0001-A' })` 를 씁니다.
- 여러 번 바꿀 때는 `GridUtils.batch(target, (doc) => { ... })` 로 감싸면 화면을 한 번만 다시 그립니다. 위 함수들은 안에서 이미 묶여 있습니다.

### 행 추가, 삭제

```js
GridUtils.addRows('partGrid', { label: 'NEW-1', id: 'tmp1', status: '작업중' });
GridUtils.addRows('partGrid', childRows, parentNode);
GridUtils.removeSelected('partGrid');
GridUtils.removeById('partGrid', ['a1b2', 'c3d4']);
GridUtils.removeNodes('partGrid', { status: '폐기' });
```

### 찾기, 읽기

```js
const node = GridUtils.getNodeById('partGrid', 'a1b2');
const first = GridUtils.findNode('partGrid', (row) => row.label.startsWith('ASM'));
const doneRows = GridUtils.getRows('partGrid', { status: '완료' });
const selected = GridUtils.getSelectedRows('partGrid');
const active = GridUtils.getActiveNode('partGrid');
const nodeById = GridUtils.keyNodesBy('partGrid', 'id');
const qtyList = GridUtils.getColumnValues('partGrid', 'qty');
```

- 읽기 함수는 하위 행과 접힌 행까지 모두 포함합니다.
- `getSelectedNodes` 는 선택 배열의 복사본을 돌려줍니다. 돌면서 선택이나 삭제를 해도 안전합니다.

### 선택, 행으로 이동

```js
GridUtils.selectById('partGrid', 'a1b2');
GridUtils.selectNodes('partGrid', { status: '작업중' });
GridUtils.selectNodes('partGrid', []);
GridUtils.revealNode('partGrid', { id: 'a1b2' });

const off = GridUtils.onSelectionChange('partGrid', (nodes) => updateDetailPanel(nodes));
off();
```

- 선택은 그리드 옵션 `rowSelection` 이 `'single'` 또는 `'multiple'` 이어야 동작합니다. `add` 인자(기존 선택 유지)는 `'multiple'` 일 때만 의미가 있습니다.
- `revealNode` 는 접힌 부모를 펼치고, 행이 화면 가운데 오게 스크롤한 뒤 깜빡여 표시하고 선택합니다.
- `onSelectionChange` 는 한 번의 조작으로 선택이 여러 번 바뀌어도 콜백을 한 번만 부릅니다.

### 트리 하위 행 지연 로딩

```js
const treeDocument = new TreeDocument({ useAsyncPreExpand: true });
GridUtils.setRows(treeDocument, [{ label: 'ASM-0001', id: 'x1', children: [] }]);
GridUtils.setChildrenLoader(treeDocument, (node, row) => fetchChildren(row.id));
```

- TreeDocument 를 `useAsyncPreExpand: true` 로 만들고, 불러올 행은 `children: []` 로 넣어 둡니다.
- 하위 행이 이미 있는 행은 다시 불러오지 않습니다. 불러오기가 실패해도 행이 "펼치는 중" 에서 멈추지 않습니다.
- `onPreExpand` 는 하나만 등록됩니다. 다시 부르면 이전 loader 를 대체합니다.

### 검색, 필터, 정렬, 컬럼

```js
GridUtils.showRowsWhere('partGrid', (row) => row.label.includes(keyword));
GridUtils.showAllRows('partGrid');
GridUtils.setFilters('partGrid', { tree: 'stringRegexp', status: 'set', qty: 'number' });
GridUtils.sortBy('partGrid', 'dueDate', 'desc');
GridUtils.sortBy('partGrid', [{ dataIndex: 'status', sort: 'asc' }, { dataIndex: 'qty', sort: 'desc' }]);
GridUtils.sortBy('partGrid');
GridUtils.setColumnsVisible('partGrid', ['owner', 'modified'], false);
```

- `showRowsWhere` 는 헤더 필터와 별개로 행을 숨깁니다. 하위 행이 조건에 맞으면 부모 행도 보입니다.
- `setFilters` 는 헤더 필터를 쓸 컬럼을 지정합니다. 키 `tree` 는 자동으로 `label` 로 바뀝니다.
- `sortBy(target)` 처럼 정렬 조건을 빼면 정렬을 해제합니다.
- `alwaysVisibleFlag` 컬럼은 숨겨지지 않습니다.

### 편집을 모아서 한 번에 저장 (변경 트랜잭션 모드)

```js
const doc = GridUtils.getDoc('partGrid');
doc.setUseChangeTransactionMode(true);

function handleSave() {
  const { added, modified, removed } = GridUtils.getChanges(doc);
  saveAll({
    create: added.map(GridUtils.getRow),
    update: modified.map(GridUtils.getRow),
    delete: removed.map(GridUtils.getRow)
  })
    .then((results) => {
      GridUtils.updateRows(doc, results);
      doc.acceptChanges();
    })
    .catch(() => doc.cancelChanges());
}
```

- 이 모드에서 `removeNodes` 계열은 삭제 표시만 합니다. 실제로 지워지는 것은 `acceptChanges()` 때입니다.
- 추가했다가 지운 행은 `getChanges` 결과에 넣지 않습니다.
- 서버 응답 값을 먼저 반영(`updateRows`)한 뒤에 `acceptChanges()` 를 부릅니다. 순서가 바뀌면 응답 반영분이 다시 "변경됨" 으로 남습니다.

### 이벤트

```js
const off = GridUtils.on('partGrid', 'change', (event, cellInfos) => {
  console.log(cellInfos.nodeModel.getLabel(), cellInfos.cellModel);
});
off();
```

- `grid.removeEventListener` 는 원래 함수가 아니라 `addEventListener` 의 반환값으로 해제해야 합니다. `on` 이 돌려주는 해제 함수가 이를 처리합니다.

### 로딩 표시, CSV 다운로드

```js
GridUtils.withLoader('partGrid', () => runLongTask(), 'Processing...');
GridUtils.downloadCSV('partGrid', 'parts.csv', { onlySelectedRows: true });
```

`downloadCSV` 의 옵션은 `getAsCSV` 와 같습니다: `onlySelectedRows`, `columnKeys`, `allColumns`, `columnSeparator`, `forceQuotes`.

## 5. 함수 목록

target 열의 Grid 는 그리드, DOM 요소, DOM id 만 받습니다. Doc 은 TreeDocument 도 받습니다.

| 함수 | target | 반환 | 설명 |
| --- | --- | --- | --- |
| `getGrid(target)` | Grid | DataGridView | 그리드 인스턴스 |
| `getDoc(target)` | Doc | TreeDocument | 그리드의 데이터 |
| `batch(target, fn)` | Doc | fn 반환값 | 변경을 묶어 한 번만 다시 그림 |
| `getValue(node, dataIndex)` | - | 값 | 셀 값. `'tree'` 는 label |
| `getRow(node)` | - | Row | 행 데이터 객체 |
| `getNodes(target, predicate?)` | Doc | TreeNodeModel[] | 전체 또는 조건에 맞는 행 |
| `getRows(target, predicate?)` | Doc | Row[] | 위의 행 데이터 버전 |
| `findNode(target, predicate)` | Doc | TreeNodeModel | 조건에 맞는 첫 행 |
| `getNodeById(target, id, key='id')` | Doc | TreeNodeModel | 키 값으로 찾기 |
| `keyNodesBy(target, key='id')` | Doc | { 키: TreeNodeModel } | 키 사전 |
| `getSelectedNodes(target)` | Doc | TreeNodeModel[] | 선택 행 (복사본) |
| `getSelectedRows(target)` | Doc | Row[] | 선택 행 데이터 |
| `getActiveNode(target)` | Grid | TreeNodeModel | 활성 셀의 행 |
| `getColumnValues(target, dataIndex)` | Doc | 값[] | 한 컬럼의 값 목록 |
| `toNode(row)` | - | TreeNodeModel | 행 데이터로 행 만들기 (children 포함) |
| `addRows(target, rows, parent?)` | Doc | TreeNodeModel[] | 최상위 또는 parent 하위에 추가 |
| `setRows(target, rows)` | Doc | TreeNodeModel[] | 전체 교체 (변경 기록 없음) |
| `clearRows(target)` | Doc | - | 전체 삭제 (변경 기록 없음) |
| `updateNode(node, values)` | - | TreeNodeModel | 행 값 바꾸기 |
| `updateRows(target, rows, key='id')` | Doc | Row[] | 키로 찾아 바꾸기. 못 찾은 행 반환 |
| `upsertRows(target, rows, key='id')` | Doc | TreeNodeModel[] | 바꾸고 없으면 추가. 추가된 행 반환 |
| `removeNodes(target, selector)` | Doc | TreeNodeModel[] | 행, 배열, 조건으로 삭제 |
| `removeById(target, ids, key='id')` | Doc | TreeNodeModel[] | 키 값으로 삭제 |
| `removeSelected(target)` | Doc | TreeNodeModel[] | 선택 행 삭제 |
| `selectNodes(target, selector, add=false)` | Grid | TreeNodeModel[] | 선택. `[]` 이면 해제 |
| `selectById(target, ids, key='id', add=false)` | Grid | TreeNodeModel[] | 키 값으로 선택 |
| `onSelectionChange(target, fn)` | Doc | 해제 함수 | 선택 변경 구독 |
| `revealNode(target, selector, select=true)` | Grid | TreeNodeModel | 펼치고 스크롤하고 깜빡이고 선택 |
| `setChildrenLoader(target, loader)` | Doc | - | 펼칠 때 하위 행 불러오기 |
| `showRowsWhere(target, predicate)` | Doc | - | 조건에 맞는 행만 표시 |
| `showAllRows(target)` | Doc | - | 모두 표시 |
| `setFilters(target, filters)` | Doc | - | 헤더 필터 지정 |
| `sortBy(target, spec?, sort='asc')` | Grid | - | 정렬. spec 이 없으면 해제 |
| `setColumnsVisible(target, dataIndexes, visible=true)` | Grid | - | 컬럼 표시/숨김 |
| `getChanges(target)` | Doc | { added, modified, removed } | 변경 트랜잭션 모드의 변경 행 |
| `on(target, name, fn)` | Grid | 해제 함수 | 그리드 이벤트 등록 |
| `withLoader(target, task, text?)` | Grid | Promise | 로딩 표시 중 작업 실행 |
| `loadRows(target, task, text?)` | Grid | Promise&lt;TreeNodeModel[]&gt; | 로딩 표시 + 전체 교체 |
| `downloadCSV(target, fileName?, options?)` | Grid | - | CSV 파일 내려받기 |

## 6. 확인 상태

- 행 변환, 키 기준 갱신, 변경 분류, 트리 표시, 지연 로딩 흐름은 가짜 TreeModel 객체로 로직만 확인했습니다.
- 실제 ENOVIA 서버에서는 아직 돌려 보지 않았습니다. 특히 그리드 화면이 필요한 선택, 컬럼 숨김, 로딩 표시, CSV 다운로드, 행 이동은 처음 쓸 때 동작을 확인합니다.
