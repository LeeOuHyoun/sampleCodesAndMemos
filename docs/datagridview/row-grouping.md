# 행 그룹핑 <Badge type="tip" text="로컬 실행 확인" />

같은 컬럼 값을 가진 행을 "그룹 행" 아래로 모아, 접고 펼칠 수 있게 하는 기능입니다. 그룹 행은 그리드가 TreeDocument 안에 새로 만들어 넣는 행이라서, 선택된 행이나 전체 행을 읽는 코드에 같이 섞여 나옵니다.

샘플: [14_rowGrouping.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/14_rowGrouping.html)

::: info 근거
DataGridView.js 의 DataGridView publishedProperties (`rowGroupingEnabledFlag`, `rowGroupingOptions`), `_applyRowGroupingOptions`, groupRows / reapplyRowGrouping / getGroupingOptions / createGroupingUI, 행 모델의 `_doGroupingOnModel` / `_applySortModel`, `_getCellTypeRepresentation`, getModelAt, getAsCSV, `_getCellValueForCopy`, 기본 메뉴의 `_supportedMenus` / `_createColumnsManagementContextualMenu`, 사용자 뷰 대화상자의 `_groupingSelectionChips`, 필터 값 목록의 `ignoreGroupingNodes`. CollectionView.js 의 행 모델 groupRows / `_reapplyRowGrouping` (2026 은 DataGridView.js 안). TreeModel.js 의 TreeDocument.groupNodes / ungroupNodes, TreeNodeModel 의 groupChildren / ungroupChildren / `NODE_SOURCE`, 그룹 행 클래스의 getNodeSource / getProperty / getIdentifier / getOriginalChildrenInformation / canBeFiltered. 호출부: ENXHistoryUX, ENXNav, ENOXEngineer, CATFLCockpitWidget, ENOChgGovernanceUX. 샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 어디에 넣나

```js{7,9-12,15}
var grid = new DataGridView({
  treeDocument: treeDocument,
  columns: [
    { text: '품번', dataIndex: 'tree' },
    { text: '품명', dataIndex: 'title' },
    { text: '상태', dataIndex: 'status' },
    { text: '비고', dataIndex: 'note', groupableFlag: false }
  ],
  rowGroupingEnabledFlag: true,
  rowGroupingOptions: {
    hideGroupedColumns: false
  }
});

grid.groupRows({ dataIndexesToGroup: ['status'] });
grid.inject(document.getElementById('grid'));
```

1. **그리드 옵션** : `rowGroupingOptions` 에 "어떻게 묶을지"를 넣습니다. 이것만으로는 묶이지 않습니다.
2. **컬럼 옵션** : 묶는 기준이 되면 안 되는 컬럼에 `groupableFlag: false` 를 줍니다.
3. **메서드** : `grid.groupRows({ dataIndexesToGroup: [...] })` 를 불러야 실제로 묶입니다. 배열에는 묶을 컬럼의 `dataIndex` 를 넣습니다. 위처럼 `inject` 전에 불러도 됩니다.

묶으면 `상태: 승인 (3)` 같은 제목의 그룹 행이 생기고, 원래 행은 그 아래로 옮겨집니다. 제목은 `컬럼 text: 값 (보이는 행 수)` 형태입니다. 값이 비어 있는 행은 `상태: 해당 없음 (1)` 처럼 `해당 없음`(영어 화면은 `NA`) 그룹으로 모입니다. 그룹 행은 키가 처음 나온 순서대로 생기고, 펼친 상태로 만들어집니다.

그룹 행의 다른 칸은 기본으로 비어 있습니다. 컬럼에 `getGroupingNodeOptions` 를 주면 합계 같은 값이 들어갑니다 (예제 6). 아래는 샘플에서 상태로 묶고 수량 합계와 담당자 수를 넣은 화면입니다.

```text
품번                  품명    상태    담당자  수량
- 상태: 작업중 (2)                    2명       5
    PRT-0001          브라켓  작업중  김철수    4
    PRT-0004          커버    작업중  이영희    1
- 상태: 승인 (3)                      3명      36
    ...
- 상태: 해당 없음 (1)                 1명      24
    PRT-0007          너트            김철수   24
```

## 옵션 목록

"사용"은 DataGridView 를 쓰는 앱 파일 119개 중 그 이름이 나오는 파일 수입니다.

### ① 그리드 옵션

| 키 | 사용 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>rowGroupingEnabledFlag</code> | 14 | <code>true</code> | <code>true &#124; false</code> | 사용자가 화면에서 묶는 기능을 켜고 끔 (사용자 뷰 대화상자의 그룹 영역, 그룹 영역으로 끌어 놓기, 사용자 뷰에 저장된 그룹 적용). 코드로 부르는 `groupRows` 는 막지 않음 |
| <code>rowGroupingOptions</code> | 10 | 아래 ② 표 | <code>object</code> | 묶는 방법. 일부 키만 넣어도 나머지는 기본값으로 채워짐. 만든 뒤에 `grid.rowGroupingOptions = { ... }` 로 바꿀 수 있고, 다음에 묶을 때(`reapplyRowGrouping()` 등)부터 쓰임 |
| <code>filterViewOptions.ignoreGroupingNodes</code> | 4 | 없음 | <code>true &#124; false</code> | 필터 팝업의 값 목록을 만들 때 그룹 행을 건너뜀 |

### ② rowGroupingOptions 안

| 키 | 사용 | 기본값 | 호출 형태 / 값 | 반환값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>depth</code> | - | <code>0</code> | 숫자 &#124; 숫자 배열 &#124; fn(깊이)  this=TreeDocument | (함수일 때) boolean | 어느 깊이의 행을 묶을지. 0 = 최상위 행. [트리와 같이 쓸 때](#트리와-같이-쓸-때) 참고 |
| <code>maxDepth</code> | 2 | <code>undefined</code> | 숫자 | - | `depth` 가 함수일 때만 쓰임. 이 깊이까지만 내려가며 묶음 |
| <code>hideGroupedColumns</code> | 8 | <code>true</code> | <code>true &#124; false</code> | - | 묶은 기준 컬럼을 숨김 (`tree` 컬럼은 숨기지 않음). 그룹에서 빠진 컬럼은 다시 보이게 함. 기준 컬럼을 계속 보여 주려면 false |
| <code>canNodeBeGrouped</code> | 1 | <code>null</code> | fn(node) | boolean | false 를 돌려준 행은 묶지 않고 제자리에 둠 |
| <code>getNodeGroupingKey</code> | 1 | <code>null</code> | fn(node, dataIndex) | 그룹 키 | 행이 들어갈 그룹의 키. 컬럼에 `getCellGroupingKey` 가 있으면 컬럼 쪽이 우선 |
| <code>mapGroupingKeys</code> | 1 | <code>null</code> | fn(keys) | 객체 또는 Promise | 키를 한꺼번에 다른 키로 바꿈. 받는 값은 `{ dataIndex: [키, ...] }`, 돌려줄 값은 `{ dataIndex: { 원래 키: 바꿀 키 } }`. 받은 키는 빠짐없이 돌려줌 |
| <code>getGroupingNodeLabel</code> | 3 | <code>null</code> | fn(groupingNode)  this=그리드 | 문자열 | 그룹 행 제목. 넣으면 기본 제목 대신 사용. 값이 빈 그룹의 `getIdentifier()` 는 `'NA'` 그대로 옴 |
| <code>getGroupingNodeIcons</code> | 3 | <code>null</code> | fn(groupingNode)  this=그리드 | 아이콘 배열 | 그룹 행 아이콘 |
| <code>getGroupingNodeOptions</code> | 2 | <code>null</code> | fn(groupingNode, rows)  this=그리드 | `{ dataIndex: 값 }` | 그룹 행의 컬럼 값. `rows` 는 그 그룹에 묶인 원래 행 배열. 넣으면 컬럼 옵션 `getGroupingNodeOptions` 는 쓰이지 않음 |

- 키를 정하는 순서: 컬럼 `getCellGroupingKey` → `rowGroupingOptions.getNodeGroupingKey` → 기본값(컬럼 `getCellValue` 가 있으면 그 결과, 없으면 행의 값. `tree` 는 `label`).
- 키가 `undefined` 이거나 빈 문자열이면 문자열 `'NA'` 가 키가 됩니다. 기본 제목에서는 이것을 `해당 없음` 으로 바꿔 보여줍니다.
- `getGroupingNodeLabel`, `getGroupingNodeIcons`, `getGroupingNodeOptions` 는 묶을 때 그룹 행마다 한 번, 그리고 그룹 아래 행이 숨겨지거나 필터로 걸러져 개수가 바뀔 때 다시 호출됩니다. 예를 들어 `상태: 작업중 (2)` 아래 행 하나를 `hide()` 하면 제목이 `상태: 작업중 (1)` 로 바뀝니다.

### ③ 컬럼 옵션

| 키 | 사용 | 기본값 | 호출 형태 / 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>groupableFlag</code> | 16 | <code>true</code> | <code>true &#124; false</code> | false 면 이 컬럼으로 묶을 수 없음. `groupRows` 에 넘겨도 조용히 빠지고, 그룹 영역에 끌어 놓아도 받지 않음. 메뉴 버튼 컬럼(`ContextualMenuColumn`)은 false |
| <code>getCellGroupingKey</code> | 11 | 없음 | fn(cellInfos, dataIndex)  this=그리드 | 이 컬럼으로 묶을 때 행이 들어갈 그룹의 키를 돌려줌 |
| <code>getGroupingNodeOptions</code> | 2 | 없음 | <code>'sum' &#124; 'avg' &#124; 'min' &#124; 'max' &#124; 'first' &#124; 'last'</code> &#124; fn(values)  this=그리드 | 그룹 행의 이 컬럼 칸에 넣을 값. `values` 는 그 그룹에 묶인 행들의 이 컬럼 값 배열. `'sum'`, `'avg'` 는 값을 `parseInt` 로 바꿔 더함 (소수점 아래는 버림. 1.5 와 1.9 의 `'sum'` 은 2) |

### ④ 메서드

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>groupRows({ dataIndexesToGroup: [...] })</code> | 10 | - | 묶기. 배열 순서대로 여러 단계로 묶음. 빈 배열이면 해제. 부른 뒤 조금 있다가 끝남 (예제 10) |
| <code>getGroupingOptions()</code> | 3 | 객체 &#124; <code>undefined</code> | 마지막으로 `groupRows` 에 넘긴 객체(같은 객체). 한 번도 묶지 않았으면 `undefined`, 풀었으면 `{ dataIndexesToGroup: [] }` |
| <code>reapplyRowGrouping()</code> | 2 | - | 지금 설정으로 다시 묶음. 행을 추가하거나 값을 바꾼 뒤에 사용 |
| <code>createGroupingUI()</code> | 0 | 칩 컨트롤 (`DS/Controls/SelectionChips`) | 컬럼 헤더를 끌어 놓아 묶는 영역을 만들어 돌려줌. 화면에 붙이는 것은 직접 함 (예제 11) |
| <code>getRowReorderEnabledState()</code> | - | boolean | 지금 끌어서 행 순서를 바꿀 수 있는지. 묶여 있는 동안은 `rowDragEnabledFlag: true` 여도 false |

## 그룹 행은 어떤 행인가

그룹 행은 TreeNodeModel 을 상속한 별도 클래스의 행입니다. 그리드가 TreeDocument 에 `addChild` 로 넣고, 원래 행을 그 아래로 옮깁니다. 묶기를 풀면 그룹 행을 지우고 원래 행을 처음 순서대로 제자리에 돌려놓습니다.

### 일반 행과 구분하기

| 함수 | 그룹 행 | 일반 행 |
| --- | --- | --- |
| `node.getNodeSource()` | `TreeNodeModel.NODE_SOURCE.GROUPING` (1) | `TreeNodeModel.NODE_SOURCE.MODEL` (0) |
| `node._isFromOriginalModel()` | `false` | `true` |

- `isGroupingNode()` 같은 이름의 함수는 TreeNodeModel 에 없습니다. `isGroupingNode` 를 읽는 앱은 자기가 넣은 속성을 읽는 것입니다.
- 2026 에는 `NODE_SOURCE.FILTERING` (2) 이 추가되었습니다. <Badge type="warning" text="2026" /> 그룹 행만 가려낼 때는 `=== NODE_SOURCE.GROUPING` 으로 비교합니다.

그룹 행에만 있는 함수:

| 함수 | 반환 |
| --- | --- |
| `groupingNode.getProperty()` | 묶은 기준 컬럼의 `dataIndex` |
| `groupingNode.getIdentifier()` | 그룹 키 (값이 빈 그룹은 `'NA'`) |
| `groupingNode.getOriginalChildrenInformation()` | `{ childrenCount, notHiddenNotFilteredChildrenCount }`. 그룹에 묶인 행 수 / 그중 숨김, 필터에 걸리지 않은 행 수 |

### 기능별 취급

| 기능 | 그룹 행이 어떻게 취급되나 |
| --- | --- |
| 화면 표시 | 제목은 트리 컬럼(`dataIndex: 'tree'`)에 그려짐. 그 칸의 셀 타입은 항상 `'string'`. 다른 칸은 그룹 행의 `grid` 값(기본은 비어 있음)을 보여줌 |
| 펼침 | 만들 때 펼친 상태. 보이는 하위 행이 0개가 되면 숨겨지고, 하위 행이 하나도 없으면 지워짐 |
| 선택 | 선택 코드에 그룹 행을 가려내는 분기가 없음. 헤더의 전체 선택 체크박스를 누르면 그룹 행도 선택되어 `treeDocument.getSelectedNodes()` 에 섞여 나옴. 실제 앱(ENXNav, ENOXEngineer)은 걸러서 씀 (예제 8) |
| 정렬 | 그룹 행도 형제끼리 정렬됨. 비교 값은 그룹 행의 `label`(트리 컬럼)과 `grid` 값. 묶을 때마다 지금 `sortModel` 을 다시 적용함 (예제 13) |
| 필터 | `canBeFiltered()` 가 false 라서 필터 조건으로 걸러지지 않음. 하위 행이 모두 걸러지면 그룹 행이 숨겨지고, 제목의 개수도 다시 계산됨 |
| 필터 팝업의 값 목록 | 그룹 행의 값도 목록에 들어감. `filterViewOptions: { ignoreGroupingNodes: true }` 를 주면 건너뜀 |
| `getRoots()`, `getAllDescendants()` | 그룹 행이 포함됨. 최상위 행을 묶으면 `getRoots()` 는 그룹 행만 돌려줌 |
| `getParent()`, `getNodeDepth()` | 원래 행의 부모가 그룹 행이 되고, 깊이는 묶은 단계 수만큼 커짐 (두 단계로 묶으면 최상위 행의 깊이가 2) |
| CSV 내보내기 (`getAsCSV`) | 보이는 행을 그대로 내보내므로 그룹 행도 한 줄로 나감. `canNodeModelBeExported` 로 뺄 수 있음 (예제 12) |
| 복사, 붙여넣기 | 그룹 행의 셀은 컬럼의 `getCellValueForCopy`, `processCellValueFromPaste` 를 쓰지 않고 기본 처리를 함 |
| 컬럼 함수 | `getCellValue` 등은 그룹 행의 셀에도 호출됨. 이때 `cellInfos.nodeModel.options.grid` 에는 원래 행의 값이 없음 |
| 행 순서 바꾸기 | 묶여 있는 동안은 끌어서 행 순서를 바꾸는 기능이 꺼짐 (`getRowReorderEnabledState()` 가 false). 풀면 다시 켜짐 |

## 화면에서 묶기

그리드 기본 우클릭 메뉴에는 "이 컬럼으로 묶기" 같은 항목이 없습니다. 헤더 기본 메뉴에는 `열 고정`, `크기에 맞게 열 조정`, 컬럼 보이기 목록, `테이블 보기 구성...` 같은 항목만 있습니다. 사용자가 화면에서 묶는 길은 두 가지입니다.

1. **사용자 뷰 대화상자** : 컬럼 헤더를 우클릭해 `테이블 보기 구성...` 을 고릅니다. 대화상자의 `여기로 끌어서 행 그룹 설정` 영역에 컬럼 목록의 행을 끌어다 놓고 `적용` 을 누릅니다. `rowGroupingEnabledFlag: false` 면 이 영역이 나오지 않습니다. 이렇게 정한 그룹은 사용자 뷰에 같이 저장됩니다.
2. **그룹 영역** : 앱이 `createGroupingUI()` 로 만든 영역을 화면에 붙여 두면, 사용자가 컬럼 헤더를 그 영역에 끌어다 놓아 묶습니다 (예제 11).

실제 앱은 대부분 헤더 우클릭 메뉴에 묶기 항목을 직접 넣습니다 (예제 7).

## 예제

예제의 코드는 샘플에서 가져옵니다. 샘플의 그리드는 품번(`tree`), 품명, 상태, 담당자, 수량, 등록일, 비고(`groupableFlag: false`) 컬럼을 갖고, `hideGroupedColumns: false`, `rowDragEnabledFlag: true` 로 만듭니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#grid{js}

### 예제 1. 한 컬럼으로 묶기

<<< @/../DataGridViewSample/14_rowGrouping.html#groupOne{js}

### 예제 2. 두 단계로 묶기

배열 순서대로 묶습니다. 상태 그룹 아래에 `담당자: 김철수 (1)` 같은 담당자 그룹이 생깁니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#groupTwo{js}

### 예제 3. 묶기 풀기

빈 배열을 넘깁니다. 그룹 행이 지워지고 원래 행이 처음 순서대로 돌아옵니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#ungroup{js}

### 예제 4. 그룹 행 제목과 아이콘 바꾸기

보통은 그리드를 만들 때 `rowGroupingOptions` 에 넣습니다. 샘플은 기본 제목과 비교하려고 만든 뒤에 옵션을 바꾸고 다시 묶습니다. 제목이 `작업중 - 2건` 처럼 바뀌고, 값이 빈 그룹은 `NA - 1건` 이 됩니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#label{js}

### 예제 5. 날짜를 월 단위로 묶기

컬럼의 `getCellGroupingKey` 가 돌려준 값이 같은 행끼리 묶입니다. 제목은 `등록일: 2026-01 (3)` 이 되고, 날짜가 없는 행은 `등록일: 해당 없음 (1)` 로 갑니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#monthKey{js}

### 예제 6. 그룹 행에 합계 넣기

컬럼에 `getGroupingNodeOptions` 를 주면 그룹 행의 그 칸에 계산한 값이 들어갑니다. 샘플은 수량 합계와 담당자 수(겹치지 않게 센 수)를 넣습니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#summary{js}

### 예제 7. 헤더 우클릭 메뉴에 묶기 항목 넣기

기본 메뉴를 가져와서 항목을 더합니다. 헤더 셀은 `rowID` 가 -1 입니다. 그리드에는 `onContextualEvent: buildMenu` 로 넣습니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#headerMenu{js}

### 예제 8. 선택된 행에서 그룹 행 빼기

<<< @/../DataGridViewSample/14_rowGrouping.html#excludeSelected{js}

전체 행을 읽을 때도 같습니다.

```js
var allRows = treeDocument.getAllDescendants().filter(function (node) {
  return node.getNodeSource() !== TreeNodeModel.NODE_SOURCE.GROUPING;
});
```

### 예제 9. 행을 추가한 뒤 다시 묶기

묶은 뒤에 추가한 행은 그룹에 자동으로 들어가지 않고, 그룹 행과 같은 높이(맨 아래)에 놓입니다. `reapplyRowGrouping()` 을 부르면 알맞은 그룹으로 들어가고 제목의 개수와 합계도 다시 계산됩니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#reapply{js}

실제 앱(CATFLCockpitWidget, ENOXArchitectureCommon)은 같은 일을 아래처럼 씁니다.

```js
var groupingOptions = grid.getGroupingOptions();
if (groupingOptions) {
  grid.groupRows(groupingOptions);
}
```

### 예제 10. 묶기가 끝난 뒤에 실행하기

묶기는 비동기로 끝납니다. `groupRows` 를 부른 직후, `Promise` 다음 차례, `setTimeout(0)` 뒤에도 TreeDocument 는 묶이기 전 그대로였고, 수십 ms 뒤에 묶였습니다. 끝나면 TreeDocument 에 `groupNodes` 이벤트가 납니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#afterGroup{js}

로그에는 `groupRows 직후: 최상위 행 9개` 다음에 `묶기 끝남: 최상위 행 3개` 가 찍힙니다.

- `groupNodes` 는 풀 때, `reapplyRowGrouping()` 때도 납니다.
- 아무 일도 하지 않는 호출(묶이지 않은 상태에서 빈 배열로 풀기, 잘못된 인자)에서는 나지 않습니다. 그때 등록한 리스너는 다음 묶기 때 불리므로, 확실히 묶이는 경우에만 등록합니다.

### 예제 11. 끌어 놓는 그룹 영역 붙이기

<<< @/../DataGridViewSample/14_rowGrouping.html#groupingUI{js}

- 붙이면 얇은 회색 테두리의 한 줄짜리 칩 입력 영역이 생깁니다. 비어 있을 때는 `여기로 끌어서 행 그룹 설정` 이 흐리게 보이고, 오른쪽 끝에 세로 점 3개 버튼이 있습니다. 너비는 붙인 요소에 맞춰집니다.
- 컬럼 헤더를 이 영역에 끌어다 놓으면 `상태 ×` 같은 칩이 생기고 그 컬럼으로 묶입니다. 하나 더 놓으면 칩이 늘고 두 단계로 묶입니다. 칩의 `×` 를 누르면 그 단계가 풀립니다.
- 코드로 부른 `groupRows`(우클릭 메뉴, 버튼 포함)에도 칩이 따라 바뀝니다.
- `groupableFlag: false` 인 컬럼은 받지 않습니다. `rowGroupingEnabledFlag: false` 면 끌어 놓아도 아무 일도 없습니다.
- 이 영역에서 그룹을 바꾸면 그리드가 그 값을 환경 설정(preferences)에 저장하는 함수(`_saveGroupingOptionsInPreferences`)를 부릅니다. 코드로 부른 `groupRows` 는 저장하지 않습니다.
- DataGridView 를 쓰는 앱 파일 119개 중 이 함수를 부르는 파일은 없습니다.

### 예제 12. CSV 에서 그룹 행 빼기

`getAsCSV()` 는 그룹 행도 한 줄로 내보냅니다. 품번 칸에 그룹 제목이, 합계를 넣은 칸에 합계가 들어갑니다.

```text
품번,품명,상태,담당자,수량,등록일,비고
상태: 작업중 (2),,,2명,5,,
PRT-0001,브라켓,작업중,김철수,4,2026. 1. 12.,
PRT-0004,커버,작업중,이영희,1,2026. 2. 17.,
상태: 승인 (3),,,3명,36,,
...
```

`canNodeModelBeExported` 에서 그룹 행을 빼면 원래 행만 남습니다.

<<< @/../DataGridViewSample/14_rowGrouping.html#excludeCsv{js}

### 예제 13. 그룹 순서를 정렬에 맞추기

그룹 행의 `grid` 값은 기본으로 비어 있어서, 묶은 기준 컬럼으로 정렬해도 그룹 행끼리는 같은 값으로 비교됩니다. 실행해 보면 `sortModel: [{ dataIndex: 'status', sort: 'asc' }]` 와 `'desc'` 의 그룹 순서가 같았습니다 (`해당 없음`, `검토중`, `승인`, `작업중`. 정렬 방향을 따르지 않음).

그룹 행에 값을 넣어 주면 정렬이 그 값을 읽습니다. 아래 설정에서 오름차순은 `검토중`, `승인`, `작업중`, `해당 없음` 이고, 내림차순은 그 반대가 됩니다. 값이 빈 그룹에는 `'NA'` 가 들어갑니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  sortModel: [{ dataIndex: 'status', sort: 'asc' }],
  rowGroupingOptions: {
    hideGroupedColumns: false,
    getGroupingNodeOptions: function (groupingNode) {
      var values = {};
      values[groupingNode.getProperty()] = groupingNode.getIdentifier();
      return values;
    }
  }
});
```

트리 컬럼으로 정렬하면 그룹 행은 제목(`label`) 순서로 정렬됩니다.

## 트리와 같이 쓸 때

하위 행이 있는 데이터도 묶을 수 있습니다. `rowGroupingOptions.depth` 로 어느 깊이의 행을 묶을지 정합니다. 깊이는 `getNodeDepth()` 와 같은 기준(최상위 행 = 0)이고, 이미 만들어진 그룹 행은 깊이에 세지 않습니다.

| `depth` 값 | 묶이는 행 |
| --- | --- |
| `0` (기본) | 최상위 행끼리. 하위 행은 자기 부모 행을 따라 그룹 안으로 같이 들어감 |
| `1` | 최상위 행은 그대로 두고, 각 최상위 행 아래의 하위 행끼리 |
| `[0, 1]` | 적은 깊이 모두 |
| `-1` | 모든 깊이 |
| `function (depth) { return depth > 0; }` | true 를 돌려준 깊이. `maxDepth` 를 같이 주면 그 깊이에서 멈춤 |

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  rowGroupingOptions: { depth: 1, hideGroupedColumns: false }
});
```

같이 쓸 때의 제약:

- 기본값(`depth: 0`)에서는 하위 행의 값은 보지 않습니다. 최상위 행의 값으로만 그룹이 정해집니다.
- 일부 행만 묶지 않으려면 `canNodeBeGrouped` 에서 false 를 돌려줍니다. 그 행은 그룹 행과 같은 높이에 그대로 남습니다.
- 펼칠 때 불러오는 하위 행([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기))은 불러온 뒤에 다시 묶어야 그룹에 들어갑니다 (예제 9).
- 원래 행의 `getParent()` 와 `getNodeDepth()` 가 달라지므로, 부모나 깊이로 판단하는 코드는 그룹 행을 건너뛰어야 합니다.
- `dataSource` 로 데이터를 받는 서버 사이드 방식에서는 그리드가 직접 묶지 않습니다. 데이터를 처음부터 다시 요청하고, 요청에 `rowGrouping` 값(`getGroupingOptions()` 의 결과)을 실어 보냅니다.

## 주의

::: warning rowGroupingOptions 만 넣으면 묶이지 않습니다
`rowGroupingOptions` 는 묶는 방법만 정합니다. `groupRows({ dataIndexesToGroup: [...] })` 를 부르거나 사용자가 화면에서 묶어야 그룹 행이 생깁니다. 인자는 배열이 아니라 `dataIndexesToGroup` 키를 가진 객체입니다. 배열(`['status']`), 문자열, `null`, 빈 객체를 넘기면 오류 없이 아무 일도 일어나지 않습니다.
:::

::: warning rowGroupingEnabledFlag: false 는 groupRows 를 막지 않습니다
이 값은 사용자가 화면에서 묶는 길만 끕니다. 코드에서 부른 `groupRows` 는 그대로 동작합니다.
:::

::: warning 그룹 행도 "행"입니다
`getSelectedNodes()`, `getAllDescendants()`, `getRoots()`, `getAsCSV()` 결과에 그룹 행이 섞입니다. 그룹 행의 `options.grid` 에는 원래 행의 값이 없으므로, 행을 서버로 보내거나 값을 읽기 전에 `getNodeSource()` 로 걸러냅니다 (예제 8). 컬럼 함수(`getCellValue` 등)도 그룹 행의 셀에 호출됩니다.
:::

- `groupableFlag: false` 인 컬럼은 `groupRows` 에 넘겨도 오류 없이 빠집니다. 컬럼에 없는 `dataIndex` 를 넘겨도 같은 식으로 빠집니다. 남은 것이 없으면 묶기를 푼 것과 같습니다.
- `groupRows` 는 넘긴 객체의 `dataIndexesToGroup` 을 걸러낸 배열로 바꿔 넣고, 그 객체를 그대로 보관합니다 (`getGroupingOptions()` 가 돌려주는 값). `{ dataIndexesToGroup: ['note', 'status'] }` 를 넘기면 그 객체가 `{ dataIndexesToGroup: ['status'] }` 로 바뀝니다.
- `hideGroupedColumns: true`(기본)에서는 묶은 기준 컬럼이 숨겨지고, 다른 컬럼으로 바꿔 묶거나 풀면 기준 컬럼의 `visibleFlag` 를 true 로 만듭니다. 처음부터 숨겨 둔(`visibleFlag: false`) 컬럼으로 묶었다가 풀면 그 컬럼이 화면에 나타납니다.
- 묶은 뒤에 추가한 행, 값이 바뀐 행은 자동으로 다시 묶이지 않습니다. `reapplyRowGrouping()` 을 부릅니다.
- 그룹 행의 제목은 트리 컬럼에 그려집니다. `dataIndex: 'tree'` 컬럼이 없는 그리드에서는 그룹 행이 제목 없는 빈 줄로 보입니다.
- TreeDocument 에도 `groupNodes`, `ungroupNodes` 가 있지만 직접 부르지 않습니다. 그리드의 `getGroupingOptions()`, 숨긴 컬럼, 행 순서 바꾸기 상태가 맞지 않게 됩니다.

## 같이 보기

- 옵션 표 → [하위 옵션 객체](/datagridview/api/sub-options#rowgroupingoptions), [그리드 옵션](/datagridview/api/grid-options), [컬럼 옵션](/datagridview/api/column-options)
- 컬럼 함수와 `cellInfos` → [컬럼 함수](/datagridview/api/column-functions)
- 헤더 우클릭 메뉴에 항목 넣기 → [우클릭 메뉴와 선택](/datagridview/context-menu#그리드-기본-메뉴-쓰기)
- 하위 행, `getRoots`, `getAllDescendants` → [트리 구조](/datagridview/tree)
- 정렬, 필터 → [정렬과 필터](/datagridview/sort-filter)
- `getAsCSV`, `reapplyRowGrouping` → [그리드 메서드](/datagridview/api/grid-methods)
