# 저장 후 화면 반영 <Badge type="info" text="원본 분석" />

서버 저장이 끝난 뒤 그리드에 반영할 때는 **행(TreeNodeModel)의 값을 바꾸면 됩니다.** 그리드를 다시 만들거나 새로고침할 필요는 없습니다. 행 값이 바뀌면 그리드가 알아서 다시 그립니다.

아래 예제에서 `saveToServer(...)` 는 이미 갖고 있는 저장 함수이고 Promise 를 돌려준다고 가정합니다.

::: info 근거
TreeModel.js 의 TreeNodeModel.updateOptions / setValuesAsReference / acceptChanges / cancelChanges, TreeDocument.setUseChangeTransactionMode, DataGridView.js 의 setNodeModelValue
:::

## 응답 값으로 행 값 바꾸기

```js
saveToServer(payload).then(function (result) {
  node.updateOptions({ grid: { title: result.title, revision: result.revision, modified: result.modified } });
});
```

- 이전 값과 다른 키만 다시 그려집니다.
- 트리 컬럼(`dataIndex: 'tree'`) 값은 `node.updateOptions({ label: result.name })` 또는 `node.setLabel(result.name)` 으로 바꿉니다.

## 셀 편집 → 저장 → 반영, 실패하면 되돌리기

컬럼에 `setCellValue` 를 넣으면 편집 값을 데이터에 넣는 과정을 직접 처리할 수 있습니다.

```js
{
  text: '품명', dataIndex: 'title', editableFlag: true,
  setCellValue: function (cellInfos, newValue) {
    var node = cellInfos.nodeModel;
    var oldValue = cellInfos.cellModel;
    node.updateOptions({ grid: { title: newValue } });
    saveToServer({ id: node.options.grid.id, title: newValue })
      .then(function (result) {
        node.updateOptions({ grid: { title: result.title, modified: result.modified } });
        node.setValuesAsReference();
      })
      .catch(function () {
        node.updateOptions({ grid: { title: oldValue } });
        node.setValuesAsReference();
      });
  }
}
```

- `cellInfos.cellModel` 은 바뀌기 전 값입니다.
- 첫 번째 `updateOptions` 는 서버 응답을 기다리지 않고 화면부터 바꿉니다. 응답이 온 뒤에 바꾸려면 이 줄을 빼면 됩니다.

::: tip setValuesAsReference() 를 부르는 이유
`setCellValue` 를 쓰면 그리드가 내부에서 원래 값을 보관하고 이 행을 "변경됨" 으로 표시합니다 (`setReferenceValue`). 저장이 끝나면 `setValuesAsReference()` 로 그 표시를 지웁니다.
:::

## 여러 행을 한꺼번에 반영

```js
saveToServer(rows).then(function (results) {
  var nodeById = {};
  treeDocument.getAllDescendants().forEach(function (node) {
    nodeById[node.options.grid.id] = node;
  });
  treeDocument.prepareUpdate();
  results.forEach(function (r) {
    var node = nodeById[r.id];
    if (node) {
      node.updateOptions({ grid: r });
    }
  });
  treeDocument.pushUpdate();
});
```

- `prepareUpdate()` 와 `pushUpdate()` 로 감싸면 화면을 한 번만 다시 그립니다.
- 서버 ID 는 컬럼이 없어도 `grid` 안에 넣어 둘 수 있습니다 (예: `grid: { id: 'xxx', ... }`).

## 행 추가, 삭제 반영

```js
treeDocument.addRoot(new TreeNodeModel({ label: result.name, grid: { id: result.id, title: result.title } }));
parentNode.addChild(new TreeNodeModel({ label: result.name, grid: { id: result.id } }));
node.remove();
```

`node.remove()` 는 최상위 행에도 쓸 수 있습니다.

## 편집을 모아서 한 번에 저장 (변경 트랜잭션 모드)

"저장" 버튼을 누를 때까지 편집을 모아 두는 화면에 씁니다. TreeDocument 가 바뀐 행과 원래 값을 기억합니다.

```js
treeDocument.setUseChangeTransactionMode(true);
var grid = new DataGridView({ treeDocument: treeDocument, columns: columns, showModelChangesFlag: true });

function handleSave() {
  if (!treeDocument.hasPendingChanges()) {
    return;
  }
  var changed = treeDocument.getAllDescendants().filter(function (node) {
    return node.getChangeStates() !== WUXModelChangeStates.Unchanged;
  });
  saveToServer(changed.map(function (node) { return node.options.grid; }))
    .then(function (results) {
      treeDocument.prepareUpdate();
      results.forEach(function (r, i) {
        changed[i].updateOptions({ grid: r });
      });
      treeDocument.pushUpdate();
      treeDocument.acceptChanges();
    })
    .catch(function () {
      treeDocument.cancelChanges();
    });
}
```

| 함수 | 대상 | 설명 |
| --- | --- | --- |
| `setUseChangeTransactionMode(true)` | TreeDocument | 변경 기록 시작 |
| `hasPendingChanges()` | TreeDocument | 저장 안 된 변경이 있는지 |
| `getChangeStates()` | TreeNodeModel | 이 행의 변경 상태 (`WUXModelChangeStates.Unchanged` 면 변경 없음) |
| `getReferenceValues()` | TreeNodeModel | 바뀐 키의 원래 값 |
| `acceptChanges()` | TreeDocument | 지금 값을 확정. "변경됨" 표시를 지우고, 삭제 표시된 행은 실제로 제거 |
| `cancelChanges()` | TreeDocument | 원래 값으로 되돌리고, 추가했던 행은 제거 |
| `setValuesAsReference()` | TreeDocument / TreeNodeModel | 지금 값을 원래 값으로 (변경 표시만 지움) |
| `resetToReferenceValues()` | TreeDocument / TreeNodeModel | 값만 원래대로 되돌림 |

::: warning 순서가 중요합니다
이 모드에서는 `updateOptions` 로 바꾼 값도 "변경됨" 으로 기록됩니다. 서버 응답 값을 먼저 반영한 뒤에 `acceptChanges()` 를 불러야 합니다.
:::

## 주의: 이벤트 안에서 저장하지 않기

`treeDocument.onNodeModelUpdate(...)` 안에서 서버에 저장하고 결과를 다시 `updateOptions` 로 반영하면, 그 반영이 같은 이벤트를 또 발생시킵니다. `updateOptions` 는 값이 같아도 알림을 보내므로 끝없이 반복될 수 있습니다.

셀 단위로 저장하려면 위의 `setCellValue` 방식을 쓰세요.
