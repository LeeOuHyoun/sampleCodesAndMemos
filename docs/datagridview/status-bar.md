# 상태바 <Badge type="info" text="원본 분석" />

그리드 아래에 전체 행 수, 선택 행 수 같은 정보를 보여주는 줄입니다. 생성자 옵션이 없고 `grid.buildStatusBar([...])` 로 만듭니다.

샘플: [10_customCell.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/10_customCell.html)

::: info 근거
CollectionView.js 의 CollectionView.buildStatusBar / getStatusBarContainerHeight, `DS/CollectionView/CollectionViewStatusBar` (GeneratedToolbar 상속, `STATUS` 값, setModel, updateTotalRows 등). 호출부: ENOChgGovernanceUX, ENOUserGroupMgmt, ENOSubscriptionMgmt, ConfiguratorPanel.
:::

## 만들기

`DS/CollectionView/CollectionViewStatusBar` 모듈의 `STATUS` 값으로 항목 종류를 정합니다.

<<< @/../DataGridViewSample/10_customCell.html#statusBar{js}

- 항목 배열을 넘기면 그리드 아래에 상태바가 생깁니다. 다시 부르면 항목이 통째로 바뀌고, 빈 배열을 넘기면 상태바 자리가 없어집니다.
- `inject` 보다 먼저 불러도 됩니다.

## 항목 종류

| `type` | 값 | 내용 | 갱신 |
| --- | --- | --- | --- |
| `STATUS.NB_ITEMS` | 1 | 전체 행 수 | 그리드가 자동으로 |
| `STATUS.NB_SELECTED_ROWS` | 2 | 선택 행 수 | 그리드가 자동으로 |
| `STATUS.NB_SELECTED_CELLS` | 3 | 선택 셀 수 | 그리드가 자동으로 |
| `STATUS.ACTIVE_CELL` | 4 | 활성 셀 | 그리드가 자동으로 |
| `STATUS.PAGINATION` | 5 | 페이지 이동 (그리드에 `paginationManager` 가 있을 때) | 그리드가 자동으로 |
| `STATUS.NB_VISIBLE_ITEMS` | 6 | 보이는 행 수 (필터, 접힘 반영) | 그리드가 자동으로 |
| `STATUS.NB_SELECTED_AND_TOTAL_ROWS` | 7 | "선택 수 / 전체 수" | 그리드가 자동으로 |
| `STATUS.CUSTOM` | 0 | 직접 넣는 항목 | 직접 |

실제 앱에서는 `CUSTOM`, `NB_SELECTED_ROWS`, `NB_ITEMS` 순으로 많이 씁니다.

## 직접 넣는 항목 (CUSTOM)

[툴바](/datagridview/toolbar) 항목과 같은 형식입니다.

| 키 | 값 | 설명 |
| --- | --- | --- |
| `type` | `STATUS.CUSTOM` | 생략해도 CUSTOM 으로 처리됨 |
| `id` | 문자열 | 나중에 갱신할 때 쓰는 이름 |
| `position` | `'near'` (기본) / `'far'` | 왼쪽 / 오른쪽 |
| `dataElements.typeRepresentation` | `'string'` 등 | 항목 종류 |
| `dataElements.value` | 값 | 처음 표시할 값 |
| `dataElements.icon` / `tooltip` / `visibleFlag` | - | 아이콘 / 툴팁 / 표시 여부 |

상태바 항목은 기본이 읽기 전용(`readOnly: true`)입니다.

## 직접 넣은 항목 갱신

상태바 객체는 `grid.elements.statusBar` 에 있습니다. `updateNodeModel(id, 바꿀 값)` 으로 고칩니다.

```js
grid.elements.statusBar.updateNodeModel('approvedCount', { grid: { data: '승인 3건' } });
grid.elements.statusBar.updateNodeModel('approvedCount', { visibleFlag: false });
```

| 바꿀 것 | 넘기는 값 |
| --- | --- |
| 표시 글자 | `{ grid: { data: '새 글자' } }` |
| 표시 여부 | `{ visibleFlag: true }` / `{ visibleFlag: false }` |

`updateNodeModel` 의 다른 사용법은 [GeneratedToolbar](/tweakers/generated-toolbar#항목-바꾸기) 에 있습니다.

::: warning buildStatusBar 를 부르기 전에는 statusBar 가 없습니다
`grid.elements.statusBar` 는 `buildStatusBar` 를 한 번 부른 뒤에 생깁니다. 그 전에 `updateNodeModel` 을 부르면 오류가 납니다.
:::
