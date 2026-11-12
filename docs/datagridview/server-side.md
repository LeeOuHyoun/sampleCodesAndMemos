# 서버 사이드 데이터 <Badge type="tip" text="로컬 실행 확인" />

행이 아주 많을 때 처음부터 다 넣지 않고, 필요한 만큼만 서버에서 불러오는 방법입니다. 그리드 옵션 `dataSource` 를 넣으면 그리드가 스크롤에 맞춰 "몇 번째 행부터 몇 번째 행까지 달라" 고 요청합니다.

샘플: [15_serverSide.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/15_serverSide.html)

::: info 근거
TreeModel.js 의 DataSourceBase (numberOfRowsPerRequest / rowsOffsetToTriggerRequest / getModelItems / getCurrentFindResult / pushUpdatesNotifications / onNodeModelUpdate), CollectionView.js 의 ItemModelServerSide (`_loadRows` 와 successCallback 처리 / getVisibleNodeModel / getRowModelLength / `_resetTreeDocument` / `_applySortModel` / `_doGroupingOnModel` / `_updateClientModelFromFind` / `_onPushUpdatesNotifications` / `_createNodeModelFromData`), CollectionView (onInfiniteScroll / infiniteScrollProcessDone / onEndResizeOrOnReadyModelRequest / getModelLength / resetTreeDocument / selectAll), CollectionViewStatusBar, DataGridView.js 의 RowModelServerSide, DataGridView (`_applyDataSource` / requestDelayedModelData / getRowModelLength / getAsCSV), DataGridViewLayout 의 autoRowHeightFlag 경고, 필터 화면의 getCustomFilterSetValues 예외. 호출부: ENOXCADManageScope (dataSource), FolderEditor, ENOChgGovernanceUX, IPClassifyUX (onInfiniteScroll), ENXNav, ENOXDocumentControlUI, CATFLCockpitWidget (onDelayedModelDataRequest, requestDelayedModelData), ENORouteMgmt, RouteWebAppUX, PowerByHome (virtuallyLoadAllModelItems, getRowModelLength). 샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 언제 쓰나

행을 나눠 불러오는 방법은 여러 가지입니다. `dataSource` 는 그중 하나이고 실제 ENOVIA 앱에서는 드뭅니다. "사용" 칸은 DataGridView 를 쓰는 앱 파일 119개 가운데 그 이름이 나오는 파일 수입니다.

| 방법 | 행을 들고 있는 곳 | 맞는 경우 | 사용 |
| --- | --- | --- | --- |
| <code>dataSource</code> (이 페이지) | 그리드가 안에서 만든 TreeDocument | 행이 아주 많고, 정렬과 필터도 서버가 처리할 때 | 1 |
| 스크롤이 끝에 닿으면 행 더하기 <code>onInfiniteScroll</code> (예제 5) | 내가 만든 TreeDocument | 목록을 100건씩 이어 붙일 때 | 7 |
| 보이는 행의 값만 나중에 채우기 <code>onDelayedModelDataRequest</code> (예제 6) | 내가 만든 TreeDocument | 행은 다 넣되, 느린 컬럼 값만 나중에 채울 때 | 14 |
| 펼칠 때 하위 행 불러오기 <code>onPreExpand</code> | 내가 만든 TreeDocument | 트리. 하위 행이 많을 때 ([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)) | 21 |
| 한 번에 넣기 <code>prepareUpdate</code> / <code>pushUpdate</code> | 내가 만든 TreeDocument | 행 수가 감당할 만할 때. 가장 단순 | 99 |

`dataSource` 의 1개는 그리드 옵션으로 쓴 파일만 센 것입니다. `dataSource` 라는 단어는 10개 파일에 나오지만 나머지 9개는 검색 속성 이름처럼 그리드와 관계없는 곳입니다.

고르는 기준은 이렇습니다.

- 먼저 "한 번에 넣기" 를 씁니다. 그리드는 화면에 보이는 셀만 그리므로 행이 많아도 그리는 부담은 크지 않습니다. 느린 것은 서버 조회와 TreeNodeModel 만들기입니다.
- 서버 조회가 느리면 `onInfiniteScroll` 이나 `onPreExpand` 로 나눠 불러옵니다. 정렬, 필터, 찾기는 그리드가 **불러온 행만** 대상으로 처리합니다.
- 정렬, 필터까지 서버가 해야 할 만큼 행이 많으면 `dataSource` 를 씁니다. 이때는 정렬, 필터, 찾기를 모두 서버 쪽에서 구현해야 합니다.

샘플은 한 페이지에서 방식(A 스크롤 끝에서 행 더하기, B 보이는 행의 값만 나중에, C `dataSource`, D `dataSource` + 전체 길이 스크롤, E `dataSource` + 하위 행)을 골라 그리드를 다시 만듭니다. 서버는 메모리에 5,000행을 만들어 두고 0.3초 뒤에 답하는 가짜 함수 `loadRows(start, count, sort, filter)` 로 흉내 내며, 요청이 올 때마다 로그에 범위를 남깁니다.

## 어디에 넣나

`DS/TreeModel/DataSourceBase` 객체를 만들어 `getModelItems` 함수를 넣고, 그리드 옵션 `dataSource` 에 넘깁니다. `treeDocument` 는 넣지 않습니다.

<<< @/../DataGridViewSample/15_serverSide.html#dataSource{js}

`loadRows` 는 `{ items: [{ tree: 'PRT-0001', title: '샤프트 1', status: '검토중', stock: 7 }, ...], total: 5000 }` 모양으로 답합니다. 응답을 그리드에 넘기는 `answer` 함수는 아래 "예제" 에 있습니다.

동작 순서는 이렇습니다.

1. 그리드가 화면에 붙어 준비되면 `getModelItems` 를 한 번 부릅니다. 요청 범위는 0행부터 `numberOfRowsPerRequest` 개입니다 (샘플은 0 ~ 199).
2. `successCallback` 으로 받은 행 객체마다 그리드가 TreeNodeModel 을 만들어 안쪽 TreeDocument 에 넣습니다.
3. 불러온 행의 끝 근처(끝에서 `rowsOffsetToTriggerRequest` 행 안쪽)가 화면에 그려지면 다음 묶음을 요청합니다 (200 ~ 399, 400 ~ 599 ...).
4. `lastRow` 로 "이번이 마지막" 이라고 알리면 더 요청하지 않습니다. 샘플에서 625행이 맞는 검색어로 끝까지 스크롤하면 600 ~ 799 요청(25행 응답) 뒤로 요청이 멈춥니다.

## 옵션과 함수

### ① 그리드 옵션

| 키 | 사용 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>dataSource</code> | 1 | <code>null</code> | DataSourceBase 객체 | 넣으면 서버 사이드 방식이 된다. 만든 뒤에 새 객체를 대입하면 행을 비우고 처음부터 다시 불러온다 |
| <code>virtuallyLoadAllModelItems</code> | 5 | <code>false</code> | <code>true &#124; false</code> | <code>dataSource</code> 와 같이 쓸 때만 불러오는 방식을 바꾼다. 아래 "불러오는 방식 두 가지" 참고 |
| <code>syncClientModelOnDemand</code> | 0 | <code>false</code> | <code>true &#124; false</code> | 서버가 먼저 알려 준 변경(<code>pushUpdatesNotifications</code>)을 바로 반영하지 않고 모아 둔다. 아래 "서버가 먼저 알려 주는 변경" 참고 |
| <code>documentClassForServerSide</code> | 1 | TreeDocument | 클래스 | 그리드가 안에서 만드는 TreeDocument 의 클래스. <code>useAsyncPreExpand: true</code> 로 만들어진다 |
| <code>onDelayedModelDataRequest</code> | 14 | <code>null</code> | <code>function (info)</code> | 보이는 행 범위를 알려 주는 콜백. <code>dataSource</code> 와는 별개 기능 (예제 6) |
| <code>pageScrollValueTriggeringInfiniteScroll</code> | 2 | <code>undefined</code> | 0 과 1 사이 숫자 &#124; <code>{ x, y }</code> | <code>onInfiniteScroll</code> 콜백을 바닥보다 일찍 부른다. 0.5 면 스크롤할 수 있는 거리의 절반 지점. 0 이하나 1 이상이면 예외 |

### ② dataSource 객체 (DataSourceBase)

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>numberOfRowsPerRequest</code> | <code>100</code> | 한 번에 요청하는 행 수 |
| <code>rowsOffsetToTriggerRequest</code> | <code>20</code> | 불러온 행의 끝에서 몇 행 앞이 그려질 때 다음 묶음을 요청할지 |
| <code>getModelItems(params)</code> | 빈 함수 | **직접 구현합니다.** 그리드가 행이 필요할 때 부른다 |
| <code>getCurrentFindResult(params)</code> | 빈 함수 | 찾기를 서버에서 처리할 때 구현 |
| <code>getModelStructure(params)</code> | 없음 | 넣으면 그리드가 행보다 먼저 트리 구조(펼침 상태, 하위 행 수)를 요청한다. <code>virtuallyLoadAllModelItems: true</code> 가 아니면 예외 |
| <code>onNodeModelUpdate(nodeModel, row, isNew)</code> | 빈 함수 | 그리드가 받은 행으로 TreeNodeModel 을 만들 때(<code>isNew</code> = true)와 이미 있는 행을 다시 받았을 때(false) 부른다. 덮어써서 쓴다 |
| <code>pushUpdatesNotifications(list, callback)</code> | 구현됨 | 서버 쪽에서 바뀐 내용을 그리드에 알릴 때 **내가 부르는** 함수 |
| <code>setFilterModel(filterModel)</code> / <code>reapplyFilterModel()</code> / <code>getFilterManager()</code> | 구현됨 | 필터를 코드로 지정 / 다시 적용 / 필터 관리 객체 읽기 |

2026 에서는 DataSourceBase 에 빈 `getModelStructure` 가 미리 들어 있어서, `hasModelStructureRequest()` 가 `true` 를 돌려주게 덮어써야 트리 구조 요청이 나갑니다. 여러 부모의 행을 한 번에 묻는 `getGroupedModelItems(params)` 도 2026 에 생겼습니다. <Badge type="warning" text="2026" />

### ③ getModelItems 가 받는 것

`params` 는 `{ request, successCallback, failCallback }` 입니다. 샘플에서 처음 받은 `request` 는 `{ startRow: 0, endRow: 199, sortModel: null, groupKeys: [], filterModel: {} }` 이고, `rowGrouping` 키는 `undefined` 로 들어 있습니다.

| <code>request</code> 의 키 | 값 | 설명 |
| --- | --- | --- |
| <code>startRow</code> | 숫자 | 요청 범위의 첫 행. 0 부터 |
| <code>endRow</code> | 숫자 | 요청 범위의 끝 행. **이 행까지 포함.** 기본 방식에서는 <code>startRow + numberOfRowsPerRequest - 1</code> |
| <code>sortModel</code> | <code>[{ dataIndex, sort }]</code> &#124; <code>null</code> | 지금 정렬 조건. 정렬한 적이 없으면 <code>null</code>. 헤더를 누르면 <code>[{ dataIndex: 'title', sort: 'asc' }]</code> |
| <code>filterModel</code> | 객체 | 지금 걸린 컬럼 필터. 없으면 빈 객체 |
| <code>groupKeys</code> | 문자열 배열 | 어느 행의 하위 행을 묻는지. 최상위 행이면 빈 배열, 하위 행이면 최상위부터 그 부모까지의 식별자 (예제 3) |
| <code>rowGrouping</code> | 객체 &#124; <code>undefined</code> | 지금 그룹핑 설정 (<code>dataIndexesToGroup</code> 등) |

### ④ 돌려주는 것

```js
params.successCallback(rows, lastRow, numberOfChildren);
params.failCallback(message);
```

| 인자 | 값 | 설명 |
| --- | --- | --- |
| <code>rows</code> | 행 객체 배열 | 요청 범위의 행. <code>startRow</code> 번째 행부터 순서대로 |
| <code>lastRow</code> | 숫자 | <code>-1</code> 또는 생략 = 뒤에 행이 더 있음. 1 이상 = 이번이 마지막 묶음 (실제 앱은 전체 행 수를 넘김). <code>0</code> 이면 그리드가 이 응답을 건너뛴다 |
| <code>numberOfChildren</code> | 숫자 | 이 부모 아래의 전체 행 수. <code>virtuallyLoadAllModelItems: true</code> 에서는 꼭 넘긴다 (없으면 예외). 기본 방식에서는 넘기지 않는다 (아래 "주의"). <code>0</code> 이면 그리드가 이 응답을 건너뛴다 |
| <code>message</code> | 문자열 | 넘기면 콘솔에 경고로 찍힌다. 화면에는 아무것도 표시하지 않는다 |

행 객체는 `{ dataIndex: 값 }` 모양입니다. 객체 전체가 TreeNodeModel 의 `grid` 가 되고, 아래 키는 따로 쓰입니다.

| 행 객체의 키 | 설명 |
| --- | --- |
| <code>tree</code> | 트리 컬럼(<code>dataIndex: 'tree'</code>) 값. TreeNodeModel 의 <code>label</code> 이 된다 |
| <code>icons</code> | 트리 컬럼 아이콘. TreeNodeModel 의 <code>icons</code> 가 된다 |
| <code>wux_group</code> | <code>true</code> 면 하위 행이 있는 행. 펼침 아이콘이 생기고, 펼칠 때 하위 행을 요청한다 |
| <code>stringIdentifier</code> | 이 행의 식별자. 하위 행을 요청할 때 <code>groupKeys</code> 에 실린다. 없으면 <code>tree</code> 값이 대신 쓰인다 |
| <code>isExpanded</code> | <code>true</code> 면 불러오자마자 펼친다 (<code>wux_group</code> 행만) |
| <code>wux_isSelected</code> | <code>true</code> 면 불러오자마자 선택한다 |
| <code>dragTransferData</code> | 행을 끌 때 실어 보낼 데이터 |

### ⑤ 그리드 메서드

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getModelLength()</code> | 숫자 | 그리드가 지금 행으로 갖고 있는 수. 아래 표 참고 |
| <code>getRowModelLength(depth?)</code> | 숫자 | 행 모델이 아는 행 수. 아래 표 참고 (사용 6) |
| <code>resetTreeDocument()</code> | - | 불러온 행과 선택을 모두 비우고 0행부터 다시 요청. <code>dataSource</code> 그리드에서만 동작 |
| <code>getTreeDocument()</code> | TreeDocument | 그리드가 안에서 만든 TreeDocument. **불러온 행만** 들어 있다. <code>dataSource</code> 그리드에서 <code>grid.treeDocument</code> 는 <code>null</code> 이므로 이 함수로 읽는다 |
| <code>executePendingNotifications(callback?)</code> / <code>flushPendingNotifications()</code> | - | <code>syncClientModelOnDemand: true</code> 로 모아 둔 변경을 반영 / 버림 |
| <code>requestDelayedModelData(context?, allRows?)</code> | - | <code>onDelayedModelDataRequest</code> 콜백을 지금 부르게 한다 (사용 6). <code>dataSource</code> 와는 별개 (예제 6) |
| <code>onInfiniteScroll(fn, options?)</code> / <code>infiniteScrollProcessDone()</code> | - | 스크롤이 끝에 닿았을 때 콜백 등록 / 처리 끝 알림 (사용 7 / 6). <code>dataSource</code> 와는 별개 (예제 5) |
| <code>onEndResizeOrOnReadyModelRequest(fn)</code> / <code>EndResizeOrOnReadyModelRequestDone()</code> | - | 그리드가 준비됐을 때와 크기가 바뀐 뒤에 "화면에 몇 행이 들어가는지" 를 알려 주는 콜백 / 처리 끝 알림 (사용 2) |

행 수를 돌려주는 두 함수는 방식에 따라 뜻이 다릅니다. 괄호 안은 샘플(5,000행, 한 번에 200행)에서 첫 묶음을 받은 뒤 읽은 값입니다.

| 함수 | TreeDocument 그리드 | dataSource 기본 방식 | dataSource + virtuallyLoadAllModelItems |
| --- | --- | --- | --- |
| <code>getModelLength()</code> | 지금 표시되는 행 수 | 불러온 행 중 표시되는 행 수 (200) | 아직 안 불러온 행까지 포함한 행 수 (5000) |
| <code>getRowModelLength()</code> | <code>getModelLength()</code> 와 같음 | 서버가 <code>numberOfChildren</code> 로 알려 준 최상위 행 전체 수. 안 알려 줬으면 불러온 행 수 (200, 마지막 묶음을 받은 뒤에는 전체 수) | 최상위와 펼쳐진 행들의 하위 행 수 합 (5000, 안 불러온 행 포함) |
| <code>getRowModelLength(depth)</code> | 그 깊이의 표시 행 수. <code>-1</code> 이면 모든 깊이 (페이지 계산용) | 인자를 쓰지 않음 | 인자를 쓰지 않음 |

<<< @/../DataGridViewSample/15_serverSide.html#count{js}

`virtuallyLoadAllModelItems: true` 에서는 `getTreeDocument()` 에 불러온 행과 함께 "자리만 잡은 행" 도 들어 있습니다 (샘플 D 에서 0 ~ 199 와 2480 ~ 2679 를 불러온 뒤 행 402개 = 불러온 400행 + 자리만 잡은 행 2개).

## 불러오는 방식 두 가지

`dataSource` 를 넣었을 때 `virtuallyLoadAllModelItems` 값에 따라 방식이 갈립니다.

| | <code>false</code> (그리드 기본값) | <code>true</code> |
| --- | --- | --- |
| 스크롤 막대 | 불러온 행만큼만. 불러올수록 길어진다 (<code>numberOfChildren</code> 를 넘기면 전체 길이가 되지만 아래 "주의" 참고) | 처음부터 전체 길이 |
| 요청 범위 | 항상 불러온 행 바로 다음 묶음 | 지금 보이는 위치의 묶음. 보이는 첫 행보다 <code>rowsOffsetToTriggerRequest</code> 행 앞부터 요청한다. 중간을 건너뛰어 불러올 수 있다 |
| 요청 시점 | 끝 근처 행이 그려질 때 바로 | 첫 묶음은 바로, 그 뒤로는 그 위치가 그려지고 0.5초 뒤 |
| 안 불러온 행 | 그리드에 없다 | "자리만 잡은 행" 한 개가 여러 행을 대신한다 |
| <code>numberOfChildren</code> | 넘기지 않는다 | 꼭 필요 |
| 찾기, <code>getModelStructure</code> | 쓰면 예외 | 쓸 수 있다 |
| <code>autoRowHeightFlag</code> | 동작 | 콘솔 경고 후 무시 |

샘플의 D 방식에서 첫 묶음(0 ~ 199) 뒤 가운데(y = 65000px, 보이는 첫 행 2500)로 건너뛰면, 0.5초 뒤에 2480 ~ 2679 행만 요청하고 그 사이 200 ~ 2479 행은 요청하지 않습니다. 한 번에 100행으로 시험했을 때 끝으로 건너뛰면 4900 ~ 4999 행만 요청했습니다.

### 서버가 먼저 알려 주는 변경

다른 사용자가 행을 바꾼 경우처럼 서버 쪽 변경을 그리드에 알릴 때 `dataSource.pushUpdatesNotifications(list, callback)` 을 부릅니다. `list` 의 각 항목은 `operationType` 이 `'nodesAdded'`, `'nodesRemoved'`, `'nodesChanged'`, `'reset'` 중 하나입니다. `'reset'` 은 전체를 다시 불러옵니다.

- `syncClientModelOnDemand: false` (기본) : 알림을 받는 즉시 그리드에 반영합니다.
- `syncClientModelOnDemand: true` : 알림을 모아 두기만 합니다. `grid.executePendingNotifications()` 를 부를 때 한꺼번에 반영하고, `grid.flushPendingNotifications()` 를 부르면 버립니다.

두 옵션은 서로 다른 것을 정합니다. `virtuallyLoadAllModelItems` 는 **안 불러온 행을 어떻게 다룰지**, `syncClientModelOnDemand` 는 **서버가 알려 준 변경을 언제 반영할지** 입니다. 이 기능을 쓰는 앱 파일은 없습니다 (사용 0).

## 정렬, 필터, 찾기는 어떻게 되나

`dataSource` 그리드는 불러온 행만 갖고 있으므로 대부분을 서버에 맡깁니다.

| 기능 | dataSource 그리드에서 |
| --- | --- |
| 정렬 | 서버에 맡김. <code>sortModel</code> 이 바뀌면 행을 모두 비우고 0행부터 다시 요청한다. 그리드는 행을 정렬하지 않으므로 요청의 <code>sortModel</code> 대로 서버가 정렬해서 돌려준다 |
| 필터 | 서버에 맡김. 필터가 바뀌면 행을 모두 비우고 다시 요청한다 (<code>filterModel</code>). 목록에서 값을 고르는 필터는 그 컬럼에 <code>filterOptions.getCustomFilterSetValues</code> 가 없으면 예외가 난다 |
| 찾기 | 서버에 맡김 (<code>getCurrentFindResult</code>). <code>virtuallyLoadAllModelItems: true</code> 가 아니면 예외가 난다. 기본 구현은 빈 함수라서 구현하지 않으면 결과가 오지 않는다 |
| 그룹핑 | 서버에 맡김. 그룹 설정이 바뀌면 행을 모두 비우고 다시 요청한다 (<code>rowGrouping</code>) |
| 선택 | 불러온 행만 선택할 수 있다. 다시 불러올 때(정렬, 필터 변경 포함) 선택이 모두 풀린다 |
| 전체 선택 | 그리드가 갖고 있는 행만 선택한다. 서버에 알리는 호출은 없다. <code>virtuallyLoadAllModelItems: true</code> 면 "자리만 잡은 행" 도 선택 목록에 들어간다 |
| <code>autoRowHeightFlag</code> | 기본 방식에서는 동작. <code>virtuallyLoadAllModelItems: true</code> 면 콘솔 경고 후 무시되므로 <code>layoutOptions.getRowHeightFunction</code> 을 직접 넣는다 ([행 높이](/datagridview/row-height)) |
| CSV 내보내기, 인쇄 | <code>getAsCSV()</code> 와 인쇄용 화면은 그 순간 그리드가 갖고 있는 행만 담는다. 안 불러온 행이 오기를 기다리지 않는다 |
| 상태바 행 수 | 기본 방식은 불러온 행 수, <code>virtuallyLoadAllModelItems: true</code> 면 <code>getModelLength()</code> 값 |

샘플에서 2행을 선택하고 헤더를 눌러 정렬하면, 누른 직후 행이 0개가 되고 `sortModel: [{ dataIndex: 'title', sort: 'asc' }]` 로 0 ~ 199 행을 다시 요청하며, 선택은 0개가 됩니다.

그룹핑에서 서버가 그룹 행을 어떤 모양으로 돌려줘야 하는지는 호출 예가 없어 확인하지 못했습니다. `wux_group: true` 인 행을 돌려주는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

`virtuallyLoadAllModelItems: true` 에서 한 번에 100행씩 0 ~ 99, 2287 ~ 2386, 4900 ~ 4999 를 불러온 뒤 `selectAll()` 을 부르면 선택 목록이 302개입니다. 불러온 300행과 함께, 라벨이 비어 있고 `options.multipleNodesRep`(대신하는 행 수, 2187 과 2513)를 가진 "자리만 잡은 행" 2개가 들어갑니다. 선택 목록을 서버로 보낼 때는 이런 행을 걸러 냅니다.

## 불러오는 동안의 화면

| 상황 | 화면 |
| --- | --- |
| 첫 묶음 (그리드에 행이 하나도 없을 때) | 그리드 위에 도는 로딩 표시를 덮는다. 문구는 "Loading data" (한국어 "데이터 로드"). 그 밑에 행이 없을 때의 문구(기본 "개체를 찾을 수 없음")가 같이 보인다. <code>successCallback</code> 이나 <code>failCallback</code> 이 불리면 걷는다. 정렬, <code>resetTreeDocument()</code> 로 다시 불러올 때도 같다 |
| 다음 묶음부터 | 로딩 표시가 없다. 기본 방식은 끝에 닿기 전에 미리 요청한다 |
| <code>virtuallyLoadAllModelItems: true</code> 의 안 불러온 구간 | "자리만 잡은 행" 이 그 자리를 채운다. 행 번호만 있고 셀이 모두 빈 행으로 보인다. 행마다 도는 로더는 없다 |
| <code>wux_group</code> 행을 펼칠 때 | 펼침 아이콘이 "펼치는 중" 상태(도는 아이콘)가 된다 ([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)와 같음) |
| 행이 없을 때 | 그리드 옵션 <code>placeholder</code> 문구 |

조회 중에 직접 로딩 표시를 덮으려면 `grid.displayModalLoader(문구)` 와 `grid.removeModalLoader(문구)` 를 씁니다 ([그리드 메서드](/datagridview/api/grid-methods#로딩-표시)).

## 예제

예제 1 ~ 4 는 응답 처리를 아래 함수로 줄여 씁니다. 세 번째 인자(전체 행 수)는 `virtuallyLoadAllModelItems: true` 일 때만 넘깁니다.

<<< @/../DataGridViewSample/15_serverSide.html#answer{js}

### 예제 1. 정렬과 필터를 서버로 넘기기

헤더를 눌러 정렬하면 그리드가 행을 비우고 `getModelItems` 를 다시 부릅니다. 요청에 실려 온 `sortModel` 을 서버로 그대로 넘깁니다. 위 "어디에 넣나" 의 코드가 이 예제입니다 (`request.sortModel` 을 `loadRows` 로 넘김). 컬럼 필터를 쓰면 `request.filterModel` 도 같은 방법으로 넘깁니다.

### 예제 2. 조건을 바꿔 처음부터 다시 불러오기

검색어 같은 조건은 변수에 두고, 바뀔 때 `resetTreeDocument()` 를 부릅니다. 불러온 행과 선택이 모두 비워지고 0행부터 다시 요청합니다. 샘플의 `getModelItems` 는 `keyword` 변수를 `loadRows` 의 네 번째 인자로 넘깁니다.

<<< @/../DataGridViewSample/15_serverSide.html#reload{js}

실제 앱(ENOXCADManageScope)은 조건이 바뀔 때마다 DataSourceBase 를 새로 만들어 `grid.dataSource = 새객체` 로 대입합니다. 결과는 같습니다.

### 예제 3. 하위 행이 있는 행

행에 `wux_group: true` 를 주면 펼침 아이콘이 생깁니다. 사용자가 펼치면 `getModelItems` 가 다시 불리고, `groupKeys` 에 그 행까지의 식별자가 들어옵니다.

<<< @/../DataGridViewSample/15_serverSide.html#children{js}

- `groupKeys` 가 `[]` 이면 최상위 행, `['A']` 면 A 의 하위 행, `['A', 'B']` 면 A 아래 B 의 하위 행 요청입니다. 샘플에서 ASM-0001 을 펼치면 `{ startRow: 0, endRow: 99, groupKeys: ['ASM-0001'], ... }` 로 요청이 옵니다.
- `result.total` 은 그 부모 아래의 행 수입니다.
- 하위 행이 실제로 있는 행에만 `wux_group: true` 를 줍니다. 아래 "주의" 를 봅니다.

### 예제 4. 스크롤 막대를 처음부터 전체 길이로

`virtuallyLoadAllModelItems: true` 를 주면 스크롤 막대가 전체 행 수에 맞춰지고, 사용자가 멀리 건너뛰면 그 위치의 묶음만 불러옵니다. `successCallback` 의 세 번째 인자(전체 행 수)를 꼭 넘깁니다 (샘플은 `createDataSource(true)`).

<<< @/../DataGridViewSample/15_serverSide.html#virtual{js}

세 번째 인자를 빼면 `successCallback` 안에서 `Error : need to provide total number of children (numberOfChildren) for all nodes when virtuallyLoadAllModelItems is set to true.` 예외가 나고, 첫 묶음의 로딩 표시가 걷히지 않습니다.

행 높이를 내용에 맞추는 `autoRowHeightFlag` 는 이 방식에서 동작하지 않습니다.

### 예제 5. 대안: 스크롤이 끝에 닿으면 행 더하기

실제 앱에서 가장 흔한 "더 불러오기" 방식입니다. `dataSource` 를 쓰지 않고, 내가 만든 TreeDocument 에 행을 이어 붙입니다.

<<< @/../DataGridViewSample/15_serverSide.html#infinite{js}

- `info` 는 `{ reachBottom, reachRight, isVeryCloseFromBottom, isVeryCloseFromRight }` 입니다. 오른쪽 끝에 닿아도 불리므로 `reachBottom` 을 확인합니다.
- 마우스 휠로 바닥까지 내려도, `grid.setScrollerPosition({ x: 0, y: 큰값 })` 으로 옮겨도 불립니다. 바닥에 닿지 않는 스크롤에서는 불리지 않습니다.
- 두 번째 인자 `{ verticalTolerance: 10, horizontalTolerance: 10 }` 은 끝에서 몇 px 앞부터 "닿았다" 로 볼지입니다.
- 정렬, 필터, 찾기, CSV 는 그리드가 처리하지만 **불러온 행만** 대상입니다.

### 예제 6. 대안: 보이는 행의 값만 나중에 채우기

행은 한 번에 넣되, 조회가 느린 컬럼 값은 화면에 보이는 행만 채웁니다. 그리드가 "지금 몇 번째 행부터 몇 번째 행까지 보인다" 를 `onDelayedModelDataRequest` 로 알려 줍니다.

<<< @/../DataGridViewSample/15_serverSide.html#delayed{js}

| <code>info</code> 의 키 | 설명 |
| --- | --- |
| <code>collectionView</code> | 그리드 (콜백 안의 <code>this</code> 도 그리드). <code>collectionView.model</code> 이 지금 표시되는 행 배열 |
| <code>startNodeIndex</code> / <code>endNodeIndex</code> | 화면에 보이는 첫 행 / 끝 행의 rowID. 끝 행 포함 (샘플 첫 화면은 0 / 23) |
| <code>displayedColumnsIndexes</code> | 화면에 보이는 컬럼 번호 배열 (샘플은 <code>[0, 1, 2, 3]</code>) |
| <code>context</code> | 불린 이유. 아래 값 또는 <code>requestDelayedModelData(context)</code> 로 넘긴 값 |

그리드가 스스로 부르는 때와 `context` 값입니다.

| <code>context</code> | 때 |
| --- | --- |
| <code>'OnReady'</code> | 그리드가 준비됐을 때. 바로 뒤에 <code>'OnResize'</code> 가 한 번 더 온다 |
| <code>'OnResize'</code> | 그리드 크기가 바뀐 뒤. <code>setScrollerPosition</code> 으로 멀리 옮겼을 때도 <code>'OnScrollEnd'</code> 와 같이 온다 |
| <code>'OnScrollEnd'</code> | 스크롤이 멈췄을 때 |
| <code>'OnSyncModel'</code> | 표시되는 행 목록이 바뀌었을 때 (행 추가, 삭제, 펼침 등) |
| <code>'OnShowColumn'</code> / <code>'OnAddColumn'</code> | 컬럼을 보이게 했을 때 / 추가했을 때 |
| <code>'OnExport'</code> / <code>'OnPrint'</code> | <code>getAsCSV()</code> / 인쇄용 화면을 만들기 직전. 이때는 범위가 전체 행, 전체 컬럼 (샘플은 0 ~ 4999) |

<<< @/../DataGridViewSample/15_serverSide.html#requestDelayed{js}

- 값을 채운 뒤 코드에서 다시 부르게 하려면 `grid.requestDelayedModelData()` 를 씁니다. 인자 없이 부르면 `context` 는 `undefined` 이고, 두 번째 인자에 `true` 를 넘기면 범위가 전체 행(0 ~ 행 수 - 1), 전체 컬럼이 됩니다. `onDelayedModelDataRequest` 가 없으면 아무 일도 하지 않습니다.
- 스크롤이 멈출 때마다, 크기가 바뀔 때마다 불리고 둘이 연달아 오기도 합니다. 같은 행을 두 번 요청하지 않게 샘플은 요청한 행에 바로 `'...'` 을 넣어 둡니다. 실제 앱은 대부분 200 ~ 500ms 의 debounce 로 감쌉니다 (ENXNav, CATFLCockpitWidget, ENOXDocumentControlUI).
- `'OnExport'` 는 콜백을 부르기만 하고 응답을 기다리지 않습니다. 아직 못 채운 값은 CSV 에 빠집니다.

## 주의

::: warning successCallback 은 인자 여러 개로 넘깁니다
`successCallback(rows, lastRow, numberOfChildren)` 형식은 2025, 2026 모두 동작합니다. 객체 한 개(`{ rows, lastRow, numberOfChildren }`)로 넘기는 형식도 원본에 있지만, 2025 원본은 그 `rows` 의 **첫 번째 원소**를 행 배열로 읽습니다. 2025 에서 `{ rows: 행배열, lastRow: -1, numberOfChildren: 5000 }` 을 넘기면 오류 없이 로딩 표시만 걷히고 행이 하나도 들어오지 않습니다 ("개체를 찾을 수 없음"). `{ rows: [행배열], lastRow: [-1], numberOfChildren: [5000] }` 처럼 배열로 한 번 더 감싸면 들어옵니다. 행 배열을 그대로 넣는 객체 형식은 2026 부터 맞게 처리됩니다. <Badge type="warning" text="2026" />
:::

::: warning 기본 방식에서는 numberOfChildren 를 넘기지 않습니다
`virtuallyLoadAllModelItems` 없이 세 번째 인자(전체 행 수)를 넘기면 스크롤 막대가 처음부터 전체 길이가 됩니다. 그런데 기본 방식은 "불러온 행 바로 다음 묶음" 만 요청하므로, 사용자가 가운데로 건너뛰면 행 번호만 있는 빈 행이 보이고 요청이 나가지 않습니다 (샘플에서 200행을 불러온 뒤 2308번째 행 근처로 건너뛰고 휠을 굴려도 요청 없음). 불러온 행 끝 근처로 돌아와야 다음 묶음을 요청합니다. 실제 앱(ENOXCADManageScope)도 `successCallback(rows, lastRow)` 로 두 개만 넘깁니다. 전체 길이 스크롤이 필요하면 `virtuallyLoadAllModelItems: true` 를 씁니다 (예제 4).
:::

::: warning virtuallyLoadAllModelItems 만으로는 서버 사이드가 되지 않습니다
이 옵션은 `dataSource` 가 있을 때만 불러오는 방식을 바꿉니다. `treeDocument` 그리드에 `true` 를 주면 행은 그대로이고 상태바의 행 수 계산만 바뀝니다 (전체 행 수 자리에 지금 표시되는 행 수가 나옴). 이 옵션이 나오는 앱 파일 5개는 모두 `dataSource` 없이 쓰고 있습니다.
:::

::: warning dataSource 에는 DataSourceBase 객체를 넣습니다
그리드는 `dataSource` 안의 이벤트 객체(`_modelEvents`)에 구독을 겁니다. `{ getModelItems: function () {} }` 같은 일반 객체를 넣으면 `new DataGridView(...)` 에서 `TypeError: Cannot read properties of undefined (reading 'subscribe')` 가 나고 그리드가 만들어지지 않습니다. `new DataSourceBase()` 로 만들고 함수만 덮어씁니다.
:::

- `dataSource` 와 `treeDocument` 는 둘 중 하나만 넣습니다. 둘 다 넣으면 `dataSource` 쪽이 쓰입니다. 넣은 TreeDocument 의 행은 보이지 않고, `getTreeDocument()` 도 그리드가 안에서 만든 TreeDocument 를 돌려줍니다.
- 행이 0건이면 실제 앱(ENOXCADManageScope)은 `failCallback()` 을 부릅니다. `lastRow` 나 `numberOfChildren` 에 0 을 넘기면 그리드가 그 응답을 건너뜁니다.
- `wux_group: true` 인 행을 펼쳤는데 `failCallback()` 이나 0 으로 답하면, 원본은 그 경로에서 `preExpandDone()` 을 부르지 않습니다. 그 행은 펼침 아이콘이 계속 도는 "펼치는 중" 상태에서 멈추고 펼쳐지지 않습니다.
- 정렬, 필터, 그룹 설정이 바뀔 때마다 처음부터 다시 불러옵니다. 그때 선택도 풀리므로, 선택을 지켜야 하면 행 객체의 `wux_isSelected` 로 다시 알려 줍니다.
- `grid.getTreeDocument().getAllDescendants()` 는 불러온 행만 돌려줍니다. 전체 행을 대상으로 하는 처리(일괄 저장, 전체 내보내기)는 서버 쪽에서 합니다.
- `dataSource.onNodeModelUpdate(nodeModel, row, isNew)` 는 그리드가 부르는 함수입니다. 리스너를 등록하는 `treeDocument.onNodeModelUpdate(fn)` 과 이름만 같습니다.
- `onInfiniteScroll` 콜백은 `infiniteScrollProcessDone()` 을 부를 때까지 다시 불리지 않습니다 (부르지 않으면 바닥에 몇 번을 닿아도 첫 1번뿐). 더 불러올 것이 없을 때와 서버 호출이 실패했을 때도 꼭 부릅니다.
- `onInfiniteScroll` 은 스크롤이 움직여야 불립니다. 첫 묶음이 화면을 다 채우지 못하면 스크롤 막대가 없어서 불리지 않습니다 (5행만 넣고 휠을 굴려도 0번). 첫 묶음을 넉넉히 불러오거나, `onEndResizeOrOnReadyModelRequest` 콜백의 `RowMaxNumber`(화면에 들어가는 행 수)와 `getModelLength()` 를 비교해 더 불러옵니다 (FolderEditor 방식). 이 콜백도 끝에 `EndResizeOrOnReadyModelRequestDone()` 을 불러야 합니다.

## 같이 보기

- 펼칠 때 하위 행 불러오기 → [트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)
- 행을 한 번에 넣기, 값 바꾸기 → [데이터 (TreeDocument)](/datagridview/api/data)
- 그리드가 처리하는 정렬과 필터 → [정렬과 필터](/datagridview/sort-filter)
- 필터 형식 → [필터](/datagridview/api/filter)
- 행 높이와 `getRowHeightFunction` → [행 높이](/datagridview/row-height)
- 상태바의 행 수, 페이지 이동 → [상태바](/datagridview/status-bar)
- 관련 옵션 표 → [그리드 옵션](/datagridview/api/grid-options#데이터), [그리드 메서드](/datagridview/api/grid-methods)
