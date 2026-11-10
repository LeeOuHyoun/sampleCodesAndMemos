---
title: 데이터 (TreeDocument)
---

# 데이터 (TreeDocument / TreeNodeModel) <Badge type="info" text="원본 분석" />

그리드에 표시할 데이터입니다. `TreeDocument` 가 데이터 묶음, `TreeNodeModel` 이 행 하나입니다.

```js
var treeDocument = new TreeDocument();
treeDocument.prepareUpdate();
treeDocument.addRoot(new TreeNodeModel({ label: 'PRT-0001', grid: { title: '브라켓' } }));
treeDocument.pushUpdate();
```

::: tip
서버 저장 후 행 값을 바꾸거나 변경 이력을 관리하는 함수는 [저장 후 화면 반영](/datagridview/save-and-reflect) 에 정리되어 있습니다.
:::

## 그리드에서 TreeDocument 꺼내기, 바꾸기

이미 만든 그리드에서 데이터를 다시 얻을 때는 `getTreeDocument()` 를 씁니다.

```js
var treeDocument = grid.getTreeDocument();
treeDocument.getSelectedNodes();
```

| 상황 | 방법 | 비고 |
| --- | --- | --- |
| 그리드 객체가 있을 때 | <code>grid.getTreeDocument()</code> | 권장. 넣기 전이면 `undefined` |
| 그리드 객체가 있을 때 | <code>grid.treeDocument</code> | 같은 객체. 넣기 전이면 `null` |
| 행(TreeNodeModel)만 있을 때 | <code>nodeModel.getTreeDocument()</code> | 이벤트의 `cellInfos.nodeModel` 등 |
| 툴바 동작 모듈 안 | <code>e.context.executionContext.treeDocument</code> | [툴바](/datagridview/toolbar) 참고 |
| 데이터 통째로 교체 | <code>grid.treeDocument = newTreeDocument</code> | 별도 `setTreeDocument` 함수는 없음 |

::: info 근거
DataGridView.js 의 DataGridView.getTreeDocument (`this._rowModel._getTreeDocument()` 반환), publishedProperties `treeDocument`, `_applyTreeDocument`. 그리드의 다른 함수는 [그리드 메서드](/datagridview/api/grid-methods) 에 있습니다.
:::

## new TreeNodeModel({ ... }) — 행

| 키 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- |
| <code>label</code> | <code>undefined</code> | 문자열 | 트리 컬럼(dataIndex 'tree') 값 |
| <code>grid</code> | <code>{}</code> | { dataIndex: 값, ... } | 나머지 컬럼 값. 컬럼이 없는 키(서버 ID 등)도 넣어 둘 수 있음 |
| <code>children</code> | <code>null</code> | TreeNodeModel 배열 &#124; <code>[]</code> &#124; 없음 | 하위 행. 없으면 끝 행(펼침 아이콘 없음), 빈 배열 <code>[]</code> 이면 "하위 행이 있지만 아직 안 불러옴" 으로 펼침 아이콘이 생김 ([트리 구조](/datagridview/tree)) |
| <code>icons</code> | <code>[]</code> | 아이콘 배열 | 트리 셀 글자 앞 아이콘. 아래 "아이콘과 배지" 참고 |
| <code>badges</code> | 네 모서리 모두 <code>null</code> | <code>{ topLeft, topRight, bottomLeft, bottomRight }</code> | 아이콘 모서리에 겹쳐 그리는 작은 아이콘 |
| <code>data</code> | <code>{}</code> | 객체 | 화면에 쓰이지 않는 보관용 자리 |

### 아이콘과 배지

```js
new TreeNodeModel({
  label: 'ASM-0001',
  icons: [{ iconName: 'folder', fontIconFamily: 1 }],
  badges: { bottomRight: 'lock' },
  grid: { title: '구동 어셈블리' }
});
```

| 형태 | 예 | 설명 |
| --- | --- | --- |
| 폰트 아이콘 | <code>{ iconName: 'folder', fontIconFamily: 1 }</code> | 3DS 폰트 아이콘 (1 = 3DS 폰트). 실제 앱은 <code>{ iconName: 'user' }</code> 처럼 이름만 쓰기도 함 |
| 이미지 주소 | <code>'.../common/images/iconSmallPart.png'</code> | 타입 아이콘 이미지 주소 문자열. 실제 앱에서 가장 흔한 형태 |
| 만든 뒤 바꾸기 | <code>node.setIcons([...])</code>, <code>node.setBadges({ bottomRight: 'filter' })</code> | <code>setIcons</code> 는 <code>updateOptions({ icons })</code> 와 같음 |

::: info 근거
TreeModel.js 의 TreeNodeModel 생성자 (`defaultOptions`: label, badges, icons, grid, children, data), getIcons / setIcons / setBadges. 아이콘 형태는 webapps 호출부에서 센 것 (이미지 주소 변수, `{ iconName }` 순으로 많음). 호출부: ENOChgGovernanceUX, ENORouteMgmt, IssueComponents (icons), FolderEditor (setBadges).
:::

## new TreeDocument({ ... }) — 데이터 묶음

| 키 | 값 | 설명 |
| --- | --- | --- |
| <code>useAsyncPreExpand</code> | <code>true &#124; false</code> | 펼칠 때 <code>node.preExpandDone()</code> 이 불릴 때까지 기다림. 하위 행 지연 로딩용 ([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)) |
| <code>shouldAcceptDrop</code> | <code>function (info) → boolean</code> | 행 드래그앤드롭 허용 판단 |
| <code>nodeModelClass</code> | 클래스 | 행 클래스 교체 |

## 자주 쓰는 함수

### TreeDocument

| 함수 | 설명 |
| --- | --- |
| <code>prepareUpdate() / pushUpdate()</code> | 여러 변경을 묶어 한 번에 화면 반영 |
| <code>addRoot(node) / removeRoot(node)</code> | 최상위 행 추가 / 삭제 |
| <code>getRoots() / getAllDescendants()</code> | 최상위 행 / 하위까지 전체 행 |
| <code>getSelectedNodes()</code> | 선택된 행 |
| <code>getXSO()</code> | 행 선택 목록 객체. 선택 변경 알림은 [이벤트](/datagridview/api/events) |
| <code>setFilterModel({...})</code> | 컬럼 필터 지정 ([필터](/datagridview/api/filter)) |
| <code>expandAll() / collapseAll()</code> | 트리 전체 펼치기 / 접기 |
| <code>onPreExpand(fn)</code> | 행을 펼치기 직전 알림. 다시 등록하면 이전 콜백을 대체 |
| <code>empty()</code> | 모든 행 제거 |

### TreeNodeModel

| 함수 | 설명 |
| --- | --- |
| <code>addChild(node)</code> | 하위 행 추가 |
| <code>remove()</code> | 이 행 제거 (최상위 행에도 사용 가능) |
| <code>getChildren() / hasChildren() / getParent()</code> | 하위 행 배열 / 하위 행이 1개 이상인지 / 부모 행 |
| <code>isRoot() / getNodeDepth()</code> | 최상위 행인지 / 깊이 |
| <code>expand() / collapse() / expandAll() / isExpanded()</code> | 이 행 펼치기 / 접기 / 하위까지 모두 펼치기 / 펼쳐져 있는지 |
| <code>preExpandDone()</code> | 비동기 펼치기에서 "하위 행 준비 끝" 을 알림 |
| <code>getAttributeValue(dataIndex)</code> | 셀 값 읽기 |
| <code>getLabel() / setLabel(text)</code> | 트리 컬럼 값 읽기 / 바꾸기 |
| <code>updateOptions({ grid: {...} })</code> | 셀 값 바꾸기 (화면 자동 반영) |
| <code>getIcons() / setIcons(icons) / setBadges(badges)</code> | 아이콘, 배지 읽기 / 바꾸기 |
| <code>show() / hide()</code> | 행 보이기 / 숨기기 |
| <code>select() / unselect() / isSelected()</code> | 행 선택 제어 |
| <code>getTreeDocument()</code> | 이 행이 속한 TreeDocument |
