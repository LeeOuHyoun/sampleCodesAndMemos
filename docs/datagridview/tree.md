# 트리 구조 <Badge type="info" text="원본 분석" />

행 아래에 하위 행을 달면 그리드가 트리가 됩니다. 실제 ENOVIA 앱은 그리드를 트리로 쓰는 경우가 많습니다 (DataGridView 를 쓰는 앱 파일 119개 중 89개에 `addChild` 가 나옴).

샘플: [06_tree.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/06_tree.html)

::: info 근거
TreeModel.js 의 TreeNodeModel 생성자 (`children` 값에 따른 `_expandState`), addChild / remove / expand / preExpandDone / hasChildren / getNodeDepth, TreeDocument 의 `useAsyncPreExpand` 처리와 onPreExpand, DataGridView.js 의 `_subscribeToPreExpand` (펼치는 동안 로딩 표시). 호출부: ENXNav, FolderEditor, IssueManagement, ENXHistoryUX.
:::

## 하위 행 만들기

`children` 에 TreeNodeModel 배열을 넣거나, 만든 뒤에 `addChild` 로 붙입니다. 두 방법의 결과는 같습니다.

<<< @/../DataGridViewSample/06_tree.html#data{js}

`dataIndex: 'tree'` 컬럼이 트리 컬럼입니다. 들여쓰기, 펼침 아이콘, 행 아이콘이 이 컬럼에 그려집니다.

### children 값과 펼침 아이콘

| `children` 값 | 뜻 | 펼침 아이콘 |
| --- | --- | --- |
| 없음 (기본 `null`) | 끝 행 | 없음 |
| `[하위행, ...]` | 하위 행이 있는 행 | 있음 |
| `[]` (빈 배열) | 하위 행이 있지만 아직 안 불러온 행 | 있음 |

끝 행에 `addChild` 로 하위 행을 붙이면 그 행에 펼침 아이콘이 생깁니다.

## 펼치기와 접기

| 대상 | 함수 |
| --- | --- |
| 전체 | `treeDocument.expandAll()` / `treeDocument.collapseAll()` |
| 행 하나 | `node.expand()` / `node.collapse()` |
| 행과 그 하위 전체 | `node.expandAll()` / `node.collapseAll()` |
| 상태 확인 | `node.isExpanded()` |

<<< @/../DataGridViewSample/06_tree.html#actions{js}

## 펼칠 때 하위 행 불러오기

하위 행이 많으면 처음부터 다 넣지 않고, 사용자가 펼치는 순간 서버에서 불러옵니다. 세 가지를 같이 씁니다.

1. `new TreeDocument({ useAsyncPreExpand: true })` : 펼칠 때 `preExpandDone()` 이 불릴 때까지 기다립니다.
2. 불러올 행은 `children: []` 로 만듭니다 (펼침 아이콘이 생김).
3. `treeDocument.onPreExpand(fn)` 에서 하위 행을 붙이고 `node.preExpandDone()` 을 부릅니다.

<<< @/../DataGridViewSample/06_tree.html#lazy{js}

기다리는 동안 그리드는 그 행의 펼침 아이콘을 "펼치는 중" 상태(`data-wux-state="expanding"`)로 표시합니다.

::: warning preExpandDone() 을 빠뜨리면 펼쳐지지 않습니다
`useAsyncPreExpand: true` 인 TreeDocument 에 `onPreExpand` 를 등록하면, **모든** 행의 펼침이 이 콜백을 거칩니다. 이미 하위 행이 있는 행, 서버 호출이 실패한 행도 반드시 `preExpandDone()` 을 불러야 합니다. 부르지 않으면 그 행은 "펼치는 중" 상태에서 멈춥니다.
:::

::: warning onPreExpand 는 하나만 등록됩니다
`treeDocument.onPreExpand(fn)` 은 이전에 등록한 콜백을 모두 지우고 새로 등록합니다. 여러 곳에서 등록하면 마지막 것만 남습니다.
:::

## 행 아이콘

`icons` 에 아이콘 배열을 넣으면 트리 컬럼의 글자 앞에 그려집니다. `badges` 는 아이콘 모서리에 겹쳐 그리는 작은 아이콘입니다.

<<< @/../DataGridViewSample/06_tree.html#icons{js}

아이콘 형태(폰트 아이콘, 이미지 주소)와 만든 뒤 바꾸는 방법은 [데이터 (TreeDocument)](/datagridview/api/data#아이콘과-배지) 에 있습니다.

## 트리 읽기

<<< @/../DataGridViewSample/06_tree.html#read{js}

| 함수 | 반환 |
| --- | --- |
| `treeDocument.getRoots()` | 최상위 행만 |
| `treeDocument.getAllDescendants()` | 하위까지 전체 행 (접혀 있어도 포함) |
| `node.getChildren()` | 바로 아래 하위 행 배열. 끝 행이면 `null` |
| `node.hasChildren()` | 하위 행이 1개 이상인지. `children: []` 인 행은 `false` |
| `node.getParent()` | 부모 행 |
| `node.isRoot()` / `node.getNodeDepth()` | 최상위 행인지 / 깊이 (최상위 = 0) |

## 트리 컬럼 모양

그리드 옵션 `treeNodeCellOptions` 로 펼침 아이콘 모양, 들여쓰기, 아이콘 표시 여부를 바꿉니다. 키 목록은 [하위 옵션 객체](/datagridview/api/sub-options#treenodecelloptions) 에 있습니다.

<<< @/../DataGridViewSample/06_tree.html#grid{js}

## 같이 보기

- 정렬, 필터 → [정렬과 필터](/datagridview/sort-filter)
- 같은 값끼리 행 묶기 (트리와 같이 쓸 때의 제약) → [행 그룹핑](/datagridview/row-grouping#트리와-같이-쓸-때)
- 행을 끌어 다른 행 아래로 옮기기 → [드래그앤드롭](/datagridview/drag-and-drop)
- 행이 아주 많을 때 나눠 불러오기 → [서버 사이드 데이터](/datagridview/server-side)
- 하위 행 값을 서버 저장 뒤에 바꾸기 → [저장 후 화면 반영](/datagridview/save-and-reflect)
- TreeDocument, TreeNodeModel 함수 목록 → [데이터 (TreeDocument)](/datagridview/api/data)
