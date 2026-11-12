# 우클릭 메뉴와 선택 <Badge type="info" text="원본 분석" />

행을 우클릭했을 때 열리는 메뉴는 그리드 옵션 `onContextualEvent` 로 만듭니다. 실제 ENOVIA 앱에서 가장 많이 쓰는 그리드 옵션 중 하나입니다 (DataGridView 를 쓰는 앱 파일 119개 중 78개).

샘플: [08_contextMenu.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/08_contextMenu.html)

::: info 근거
DataGridView.js 의 publishedProperties `onContextualEvent` (기본값 = `buildDefaultContextualMenu` 호출), 컨텍스트 메뉴 리스너 (`onContextualEvent.call(grid, { context, collectionView, infos, data, cellInfos })`), 메뉴 빌더의 `buildMenu` 기본 옵션, `showContextualMenuColumnFlag` 로 추가되는 `ContextualMenuColumn` 컬럼, Tweakers.js 의 `chevronMenuIcon` (`contextMenuFallback`). 호출부: CompareWidget2, CfgBulkTablePresenter, ConfiguratorPanel, ENOChgGovernanceUX.
:::

## onContextualEvent

우클릭할 때마다 호출되고, **메뉴 항목 배열**을 돌려줍니다. 빈 배열을 돌려주면 메뉴가 열리지 않습니다.

<<< @/../DataGridViewSample/08_contextMenu.html#grid{js}

| `params` 의 키 | 내용 |
| --- | --- |
| `params.cellInfos` | 우클릭한 셀 (`rowID`, `columnID`, `cellID`, `nodeModel`, `cellModel`). 빈 영역이면 없음 |
| `params.collectionView` | 그리드 |
| `params.data` / `params.infos` / `params.context` | 원래 이벤트 정보 |

`cellInfos.rowID` 로 어디를 눌렀는지 구분합니다.

| 누른 곳 | `cellInfos` |
| --- | --- |
| 데이터 행 | `rowID` 0 이상, `nodeModel` 있음 |
| 컬럼 헤더 | `rowID` -1 이하 |
| 빈 영역 | `cellInfos` 없음 |

- 함수 안의 `this` 는 그리드입니다.
- 만든 뒤에 `grid.onContextualEvent = function (params) { ... }` 로 바꿀 수도 있습니다.
- 우클릭한 행이 선택되어 있지 않으면 그리드가 먼저 그 행을 선택합니다 (`selectionBehavior.selectOnContextualEvent`, 기본 `true`). 그래서 메뉴를 만들 때 `treeDocument.getSelectedNodes()` 에 그 행이 들어 있습니다.

::: warning 2025 와 2026 의 정의 위치
`onContextualEvent` 는 2025 에서 DataGridView 에, 2026 에서 부모인 CollectionView 에 정의되어 있습니다. 정의 위치만 옮겨졌고 두 버전 모두 그리드 옵션으로 씁니다.
:::

## 메뉴 항목

<<< @/../DataGridViewSample/08_contextMenu.html#rowMenu{js}

| 키 | 값 | 설명 |
| --- | --- | --- |
| `type` | `'PushItem'` / `'CheckItem'` / `'RadioItem'` / `'SeparatorItem'` / `'TitleItem'` | 누르는 항목 / 체크 항목 / 하나만 고르는 항목 / 구분선 / 제목 |
| `title` | 문자열 | 글자 |
| `icon` | `{ iconName: 'trash', fontIconFamily: 1 }` | 아이콘 (1 = 3DS 폰트). 실제 앱은 `fonticon: { content: 'wux-ui-3ds wux-ui-3ds-...' }` 형태도 씀 |
| `state` | `'enabled'` / `'disabled'` / `'selected'` / `'unselected'` | 비활성, 체크 상태. <code>'selected&#124;disabled'</code> 처럼 <code>&#124;</code> 로 이어 씀 |
| `action` | `{ callback: function (e) { ... }, context: 값 }` | 눌렀을 때 호출. `context` 에 넣은 값은 `e.context` 로 받음 |
| `submenu` | 항목 배열 | 하위 메뉴 |

## 그리드 기본 메뉴 쓰기

`onContextualEvent` 를 넣지 않으면 그리드 기본 메뉴가 열립니다. 직접 만든 함수 안에서 기본 메뉴를 가져오려면 `buildDefaultContextualMenu` 를 씁니다. 돌려받은 배열에 항목을 더하거나 빼서 돌려주면 됩니다.

```js
onContextualEvent: function (params) {
  var menu = params.collectionView.buildDefaultContextualMenu(params, { pin: false, insertRow: false });
  menu.push({ type: 'PushItem', title: '내 메뉴', action: { callback: function () { } } });
  return menu;
}
```

두 번째 인자로 기본 메뉴를 묶음별로 켜고 끕니다.

| 옵션 | 기본값 | 메뉴 묶음 |
| --- | --- | --- |
| `filter` | `true` | 컬럼 필터 열기 (필터가 지정된 컬럼의 헤더에서만) |
| `pin` | `true` | 컬럼 고정 (왼쪽 / 오른쪽 / 해제) |
| `sizeColumnToFit` | `true` | "크기에 맞게 열 조정" 과 "크기에 맞게 모든 열 조정" 두 항목 (헤더에서만) |
| `firstColumnsVisibility` | `true` | 화면 순서로 앞쪽 컬럼 8개의 표시 / 숨김 체크 항목 (헤더에서만). 숨긴 컬럼도 체크가 꺼진 채 나옴. `alwaysVisibleFlag` 컬럼은 비활성 |
| `columnsManagement` | `true` | "테이블 보기 구성..." = 사용자 뷰 대화상자 열기 (헤더에서만) ([사용자 뷰](/datagridview/custom-views#사용자가-헤더에서-할-수-있는-일)) |
| `expandCollapse` | `false` | 펼치기 / 접기 |
| `insertRow` | `false` | 행 삽입 (앞 / 뒤) |
| `deleteSelectedRows` | 꺼짐 | 선택 행 삭제 |

## 메뉴 버튼 컬럼

`showContextualMenuColumnFlag: true` 를 넣으면 오른쪽 끝에 메뉴 버튼 컬럼이 생깁니다. 버튼을 누르면 그 셀에서 `contextmenu` 이벤트를 일으키므로 **우클릭과 같은 `onContextualEvent`** 가 호출됩니다. 메뉴를 한 번만 만들면 우클릭과 버튼 양쪽에서 쓰입니다.

- 그리드가 `dataIndex: 'ContextualMenuColumn'` 인 컬럼을 `columns` 끝에 추가합니다 (오른쪽 고정, 정렬, 편집, 크기 조절 불가).
- `columns` 에 같은 `dataIndex` 의 컬럼을 직접 넣어 두면 그 정의를 쓰고, 빠진 키만 기본값으로 채웁니다 (`UWA.merge`).

## 선택 변경 받기

선택 목록은 그리드가 아니라 **TreeDocument** 가 갖고 있습니다. 선택 목록 객체(XSO)에 콜백을 등록합니다.

<<< @/../DataGridViewSample/08_contextMenu.html#selection{js}

| 함수 | 언제 |
| --- | --- |
| `treeDocument.getXSO().onPostAdd(fn)` | 행이 선택된 뒤 |
| `treeDocument.getXSO().onPostRemove(fn)` | 행 선택이 풀린 뒤 |
| `treeDocument.getXSO().onEmpty(fn)` | 선택이 모두 풀릴 때 |
| `treeDocument.getSelectedNodes()` | 지금 선택된 행 배열 |

선택 방식(`rowSelection`, `showSelectionCheckBoxesFlag`, `selectionBehavior`)은 [그리드 옵션](/datagridview/api/grid-options#선택) 에 있습니다.

## 코드로 선택하기

<<< @/../DataGridViewSample/08_contextMenu.html#select{js}

함수 목록은 [그리드 메서드](/datagridview/api/grid-methods#선택) 에 있습니다. 다른 위젯과 선택을 맞추는 방법은 [선택 (CSOManager)](/events/selection) 을 보세요.
