# 행 높이 <Badge type="tip" text="서버 확인" />

행 높이 설정은 모두 `new DataGridView({ ... })` 에 넘기는 설정 객체 안에 넣습니다. 다만 넣는 자리가 세 군데로 나뉩니다. treeDocument(데이터)에는 넣지 않습니다.

::: info 근거
DataGridView.js 의 DataGridViewLayout (getDefaultCellHeight / _applyCellHeight / getRowHeightFromCellHeight / getRowHeightFromCellContents). 호출부: ENORouteMgmt, ENXMeetingMgmt (layoutOptions), CompareWidget2, CATFLCockpitWidget, FolderEditor (autoRowHeightFlag), WUXAutoComplete (getRowHeightFunction).
:::

## 어디에 넣나

```js{4-9,13,16}
var grid = new DataGridView({
  treeDocument: treeDocument,

  layoutOptions: {
    cellHeight: 32,
    layoutDensity: 'compact',
    rowSpacing: 0,
    getRowHeightFunction: function (rowID) { return undefined; }
  },

  columns: [
    { text: '품번', dataIndex: 'tree' },
    { text: '비고', dataIndex: 'note', autoRowHeightFlag: true }
  ],

  maxVisibleRowCount: 10
});
```

1. **`layoutOptions`** : 설정 객체 안의 하위 객체. 행 높이를 정하는 기본 자리입니다. 그리드를 만들 때만 넣을 수 있고(readOnly), 만든 뒤에는 `grid.layout.키 = 값` 으로 바꿉니다.
2. **컬럼 옵션** : `columns` 배열의 각 컬럼 객체. 그 컬럼 내용에 맞춰 행 높이를 자동으로 늘릴 때 씁니다.
3. **그리드 옵션** : 설정 객체 최상위. 행 높이가 아니라 **그리드 전체 높이**를 정합니다. 행 높이와 헷갈리기 쉬워서 같이 적었습니다.

## 옵션 목록

### ① layoutOptions 안

| 키 | 기본값 | 값 | 만든 뒤에 바꾸기 | 설명 |
| --- | --- | --- | --- | --- |
| <code>cellHeight</code> | <code>26</code> | 26 이상 숫자(px) | <code>grid.layout.cellHeight = 32</code> | 모든 행의 기본 높이. 26 보다 작게 주면 26 으로 되돌린다. 실제 높이 = max(cellHeight, 밀도 기본 높이) |
| <code>layoutDensity</code> | <code>'compact'</code> | <code>'compact' &#124; 'comfortable'</code> | <code>grid.layout.layoutDensity = 'comfortable'</code> | compact = 행 기본 26px, comfortable = 40px (터치 모드도 40px). comfortable 에서는 cellHeight 를 40 보다 작게 줘도 40 |
| <code>rowSpacing</code> | <code>0</code> | 숫자(px) | <code>grid.layout.rowSpacing = 4</code> | 행과 행 사이 간격 |
| <code>rowMaxHeight</code> | <code>undefined</code> | 26 이상 숫자(px) | <code>grid.layout.rowMaxHeight = 120</code> | 행 최대 높이 (내용 자동 높이일 때 상한) |
| <code>columnHeaderHeight</code> | <code>27</code> | 숫자(px) | <code>grid.layout.columnHeaderHeight = 32</code> | 컬럼 헤더 줄 높이 |
| <code>getRowHeightFunction</code> | <code>null</code> | <code>function (rowID) → 높이 &#124; undefined</code> | <code>grid.layout.getRowHeightFunction = fn;</code><br><code>grid.layout.resetRowHeights();</code> | 행마다 다른 높이. undefined 를 돌려주면 기본 높이. 행 데이터는 grid.model[rowID] (TreeNodeModel). 실제 ENOVIA 앱은 만든 뒤에 넣는 경우가 많다 (예제 4, 5) |

### ② 컬럼 옵션 (columns 의 각 컬럼)

| 키 | 기본값 | 값 | 만든 뒤에 바꾸기 | 설명 |
| --- | --- | --- | --- | --- |
| <code>autoRowHeightFlag</code> | <code>false</code> | <code>true &#124; false</code> | <code>grid.layout.setColumnAutoRowHeightFlag(컬럼, true)</code> | 이 컬럼 내용 길이에 맞춰 행 높이 자동 계산 (여러 줄 텍스트 등). getRowHeightFunction 을 직접 넣으면 그쪽이 우선. 서버 사이드(virtuallyLoadAllModelItems)에서는 지원 안 됨 (예제 6) |
| <code>allowWrapFlag</code> <Badge type="warning" text="2026" /> | <code>false</code> | <code>true &#124; false</code> | - | 셀 글자 줄바꿈 허용. autoRowHeightFlag 와 같이 쓰면 줄 수만큼 행이 커진다 |

### ③ 그리드 옵션 (그리드 전체 높이)

| 키 | 기본값 | 값 | 만든 뒤에 바꾸기 | 설명 |
| --- | --- | --- | --- | --- |
| <code>maxVisibleRowCount</code> | <code>undefined</code> | 숫자 | <code>grid.maxVisibleRowCount = 10</code> | 그리드 높이를 "행 N개 + 헤더" 높이로 자동 계산 (행이 적으면 그만큼만) (예제 7) |
| <code>height</code> | <code>'inherit'</code> | <code>'inherit' &#124; 숫자</code> | <code>grid.height = 400</code> | 그리드 전체 높이. 기본은 부모 요소 높이를 따름 → 부모 div 에 높이를 꼭 줘야 한다 |

## 예제

### 예제 1. 모든 행을 32px 로

`layoutOptions.cellHeight` 에 숫자를 줍니다. 26 보다 작게 주면 26 으로 되돌아갑니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  layoutOptions: { cellHeight: 32 }
});
```

### 예제 2. 넉넉한 화면 (comfortable)

행 기본 높이가 40px 이 됩니다. 이때 `cellHeight` 를 40 보다 작게 줘도 40 입니다 (실제 높이 = max(cellHeight, 밀도 기본 높이)).

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  layoutOptions: { layoutDensity: 'comfortable', rowSpacing: 2 }
});
```

### 예제 3. 만든 뒤에 높이 바꾸기

`layoutOptions` 는 생성할 때만 넣을 수 있습니다. 만든 뒤에는 `grid.layout` 에 직접 넣으면 바로 다시 그려집니다.

```js
grid.layout.cellHeight = 40;
grid.layout.layoutDensity = 'comfortable';
grid.layout.rowSpacing = 4;
```

### 예제 4. 특정 행만 높게

`rowID` 를 받아 높이(px)를 돌려줍니다. `undefined` 를 돌려주면 기본 높이입니다. 행 데이터는 `grid.model[rowID]` 로 읽습니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  layoutOptions: {
    getRowHeightFunction: function (rowID) {
      var node = grid.model[rowID];
      if (node && node.getAttributeValue('status') === '검토중') {
        return 50;
      }
      return undefined;
    }
  }
});
```

### 예제 5. 만든 뒤에 행별 높이 함수 넣기

실제 ENOVIA 앱에서 많이 쓰는 방식입니다. 행 높이는 한 번 계산하면 저장해 두므로, 함수를 넣거나 데이터가 바뀐 뒤에는 `resetRowHeights()` 로 다시 계산시킵니다.

```js
grid.layout.getRowHeightFunction = function (rowID) {
  return rowID === 0 ? 60 : undefined;
};
grid.layout.resetRowHeights();
```

### 예제 6. 긴 글에 맞춰 자동으로

컬럼에 `autoRowHeightFlag: true` 를 주면 그 컬럼 내용 높이에 맞춰 행이 커집니다. 너무 커지지 않게 `layoutOptions.rowMaxHeight` 로 상한을 둘 수 있습니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  layoutOptions: { rowMaxHeight: 120 },
  columns: [
    { text: '품번', dataIndex: 'tree' },
    { text: '비고', dataIndex: 'note', typeRepresentation: 'multilineString', autoRowHeightFlag: true }
  ]
});
```

### 예제 7. 그리드 전체 높이 (행 높이 아님)

`height` 기본값 `'inherit'` 은 부모 요소 높이를 따릅니다. 부모 div 에 높이가 없으면 그리드가 안 보이므로, 높이를 주거나 `maxVisibleRowCount` 를 씁니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  maxVisibleRowCount: 10
});
```

## 주의

::: warning layoutOptions 밖에 쓰면 적용되지 않습니다
`new DataGridView({ cellHeight: 32 })` 처럼 설정 객체 최상위에 쓰면 무시됩니다. 그리드 자체에는 `cellHeight` 속성이 없고 레이아웃에만 있습니다. 반드시 `layoutOptions: { ... }` 안에 넣습니다.
:::

- `autoRowHeightFlag` 컬럼이 있어도 `getRowHeightFunction` 을 직접 넣으면 **직접 넣은 함수가 우선**이고 자동 계산은 쓰이지 않습니다.
- 서버 사이드(`virtuallyLoadAllModelItems`) 모드에서는 `autoRowHeightFlag` 가 지원되지 않습니다 (콘솔 경고 후 무시). 이때는 `getRowHeightFunction` 을 직접 구현합니다.
- [실시간 설정 샘플](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/05_options.html) 의 "행 높이" 묶음에서 값을 바꿔 보며 바로 확인할 수 있습니다.
