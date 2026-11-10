# 셀 직접 그리기 <Badge type="info" text="원본 분석" />

[셀 타입](/datagridview/cell-types)(`typeRepresentation`)으로 표현할 수 없는 모양은 컬럼의 `onCellRequest` 로 직접 그립니다. 상태 칩, 막대, 버튼 여러 개, 썸네일 같은 셀에 씁니다.

샘플: [10_customCell.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/10_customCell.html)

::: info 근거
DataGridView.js 의 `_manageCellRequests` (컬럼 `onCellRequest` 가 있으면 `defaultOnCellRequest` 대신 호출, rowID / columnID 0 이상에서만), CollectionView.js 의 registerReusableCellContent / reuseCellContent, CollectionViewCell 의 setReusableContent / getReusableContent, Utilities.js 의 `DS/Utilities/ReusableContentsManager`, `DS/Utilities/ReusableContent`. 호출부: PowerByHome, ENOChgGovernanceUX, ENORouteMgmt, ConfiguratorPanel, CollaborativeTasks.
:::

## 먼저 볼 것

직접 그리기 전에 더 간단한 방법으로 되는지 확인합니다.

| 하고 싶은 일 | 방법 |
| --- | --- |
| 조건에 따라 색, 굵기만 바꾸기 | 컬럼 함수 `getCellClassName` ([컬럼 함수](/datagridview/cell-functions#조건부-모양과-툴팁)) |
| 콤보, 체크박스, 프로그레스 바, 아이콘 토글 | `typeRepresentation` ([셀 타입](/datagridview/cell-types)) |
| 자주 쓰는 콤보나 아이콘 토글을 이름으로 등록 | [사용자 타입 등록](/tweakers/custom-type) |
| 위 방법으로 안 되는 모양 | 이 페이지의 `onCellRequest` |

## 동작 원리

그리드는 화면에 보이는 셀만 만들고, 스크롤하면 그 셀을 다른 행에 다시 씁니다. 그래서 셀 내용을 매번 새로 만들지 않고 **미리 등록해 둔 내용을 꺼내서 값만 바꿔 넣습니다.**

1. `grid.registerReusableCellContent(...)` 로 셀 내용 만드는 방법을 등록합니다.
2. 컬럼의 `onCellRequest` 에서 `this.reuseCellContent(id)` 로 하나를 꺼내 값을 넣습니다.
3. `cellInfos.cellView.setReusableContent(내용)` 으로 셀에 넣습니다. 전에 있던 내용은 그리드가 회수해서 다음에 다시 씁니다.

## 셀 내용 등록

<<< @/../DataGridViewSample/10_customCell.html#register{js}

| 키 | 설명 |
| --- | --- |
| `id` | `reuseCellContent` 에 넘길 이름 |
| `buildContent` | 내용 하나를 만들어 돌려주는 함수. 화면 요소(HTMLElement)나 WebUX 컨트롤 |
| `cleanContent` | 회수할 때 호출되는 함수 (생략 가능). 인자로 그 내용을 받음 |

- 같은 `id` 로 다시 등록하면 이전 등록을 대체합니다.
- `onCellRequest` 가 처음 불리기 전에 등록해야 하므로 `inject` 보다 먼저 합니다.

## onCellRequest

<<< @/../DataGridViewSample/10_customCell.html#grid{js}

- 함수 안의 `this` 는 그리드입니다.
- 데이터 행의 셀에서만 호출됩니다. 컬럼 헤더는 기본 렌더링 그대로입니다.
- `onCellRequest` 를 넣은 컬럼은 그리드의 기본 렌더링(`defaultOnCellRequest`)을 거치지 않습니다. 값을 바꾸는 동작이 필요하면 아래처럼 클릭을 직접 처리합니다.
- 꺼낸 내용에는 **이전 행의 값이 남아 있습니다.** 글자, 속성, 스타일을 매번 모두 다시 넣습니다. 조건에 따라 일부만 넣으면 다른 행의 모양이 섞여 보입니다.

## 클릭 처리

셀 안의 요소를 눌렀을 때는 그리드의 `click` 이벤트로 받습니다. 두 번째 인자로 그 셀의 `cellInfos` 가 오고, `event.target` 으로 어느 요소를 눌렀는지 구분합니다.

<<< @/../DataGridViewSample/10_customCell.html#click{js}

행 값을 바꾸면(`updateOptions`) 그리드가 그 행을 다시 그리면서 `onCellRequest` 를 다시 부릅니다. 화면 요소를 직접 고치지 말고 **행 값을 바꾸는 쪽**으로 처리합니다.

## 같이 보기

- 그리드 아래 상태바 → [상태바](/datagridview/status-bar)
- 셀 안 요소에서 셀 찾기 → `grid.getCellInfosFromHtmlElement(el)` ([그리드 메서드](/datagridview/api/grid-methods#셀-정보와-값))
