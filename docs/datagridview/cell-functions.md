# 컬럼 함수 (셀마다 다르게) <Badge type="info" text="원본 분석" />

컬럼 옵션은 그 컬럼의 모든 셀에 똑같이 적용됩니다. **행마다 달라야 하면** 고정값 대신 함수를 넣습니다. 그리드가 셀을 그릴 때마다 함수를 불러서 그 셀의 값, 타입, 콤보 목록, 편집 가능 여부, 모양을 정합니다.

샘플: [07_columnFunctions.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/07_columnFunctions.html)

::: info 근거
DataGridView.js 의 DataGridViewLayout (`getColumnOptionValue(columnID, "함수명")` 으로 컬럼 함수를 읽는 getter 들), DataGridView 의 getCellCssClassesAt / _getCellTooltip / setNodeModelValue / _getCellValueForSort. 호출부: ENOXEngineer, PIMwebUX (getCellValue, getCellSemantics, getCellEditableState), ENOChgGovernanceUX, PowerByHome (getCellClassName), ENXNav (getCellTooltip), ENORouteMgmt (getCellTypeRepresentation).
:::

## 하고 싶은 일로 찾기

괄호 안은 DataGridView 를 쓰는 앱 파일 119개 중 그 함수를 쓰는 파일 수입니다.

| 하고 싶은 일 | 컬럼 함수 | 돌려주는 값 |
| --- | --- | --- |
| 행마다 다른 콤보 목록, 최소/최대값 | `getCellSemantics` (57) | semantics 객체 |
| 데이터에 없는 값을 계산해서 표시 | `getCellValue` (47) | 표시할 값 |
| 셀 툴팁 | `getCellTooltip` (52) | `{ shortHelp: '글자' }` |
| 행마다 다른 셀 타입 | `getCellTypeRepresentation` (39) | typeRepresentation 문자열 |
| 조건에 따라 셀 색, 굵기 바꾸기 | `getCellClassName` (34) | CSS 클래스 이름 |
| 행마다 편집 잠그기 | `getCellEditableState` (26) | `true` / `false` |
| 편집한 값을 직접 저장 | `setCellValue` (25) | - ([저장 후 화면 반영](/datagridview/save-and-reflect)) |
| 특정 행의 셀을 빈 칸으로 | `hasCellValue` (19) | `true` / `false` |
| 셀을 직접 그리기 | `onCellRequest` (41) | - ([셀 직접 그리기](/datagridview/custom-cell)) |

전체 목록과 호출 형태는 [컬럼 함수 레퍼런스](/datagridview/api/column-functions) 에 있습니다.

## 먼저: nodeModel 이 있는지 확인하기

컬럼 함수는 인자로 `cellInfos` 를 받고, 행 값은 `cellInfos.nodeModel.options.grid.키` 로 읽습니다.

<<< @/../DataGridViewSample/07_columnFunctions.html#rowOf{js}

::: warning 컬럼 헤더 셀에서도 호출됩니다
함수에 따라 컬럼 헤더 셀(rowID -1)에도 호출되고, 그때는 `nodeModel` 이 없습니다. 예를 들어 그리드는 rowID 를 가리지 않고 `getCellClassName` 을 부릅니다 (DataGridView.getCellCssClassesAt). 확인 없이 `cellInfos.nodeModel.options` 를 읽으면 오류가 납니다. 실제 ENOVIA 앱도 대부분 `cellInfos && cellInfos.nodeModel` 을 먼저 확인합니다.
:::

## 행마다 다른 콤보 목록, 편집 잠그기

`getCellSemantics` 가 돌려준 객체가 컬럼의 `semantics` 대신 쓰입니다. `getCellEditableState` 가 `false` 를 돌려주면 그 셀은 편집되지 않습니다 (`editableFlag: true` 인 컬럼에서만 의미가 있음).

<<< @/../DataGridViewSample/07_columnFunctions.html#semantics{js}

## 계산해서 표시하기

`dataIndex` 가 행 데이터에 없는 키여도 됩니다. `getCellValue` 가 표시할 값을 돌려줍니다.

<<< @/../DataGridViewSample/07_columnFunctions.html#computed{js}

::: warning getCellValueForSort 는 인자가 다릅니다
다른 컬럼 함수는 `cellInfos` 를 받지만 `getCellValueForSort` 는 `(nodeModel, dataIndex)` 를 받습니다. 계산 컬럼은 데이터에 값이 없으므로 이 함수를 같이 넣어야 정렬할 값이 생깁니다.
:::

## 특정 행의 셀 비우기

`hasCellValue` 가 `false` 를 돌려주면 그 셀은 빈 칸이 되고 `getCellValue` 도 불리지 않습니다.

<<< @/../DataGridViewSample/07_columnFunctions.html#hasValue{js}

## 조건부 모양과 툴팁

`getCellClassName` 은 CSS 클래스 **이름만** 돌려줍니다. 색, 굵기 같은 모양은 페이지 CSS 에 직접 정의합니다.

<<< @/../DataGridViewSample/07_columnFunctions.html#style{js}

```css
.cell-warn { background: #fde9e6 !important; color: #b3261e; font-weight: bold; }
.cell-done { background: #e8f5e4 !important; }
```

일부 행만 툴팁을 직접 정하고 나머지는 그리드 기본 툴팁을 쓰려면 `grid.getCellDefaultTooltip(cellInfos)` 를 돌려줍니다. `getCellTooltip` 은 `this` 없이 호출되므로 그리드 변수를 직접 참조합니다.

```js
getCellTooltip: function (cellInfos) {
  var row = rowOf(cellInfos);
  return row && row.progress < 30 ? { shortHelp: '진행률이 낮습니다' } : grid.getCellDefaultTooltip(cellInfos);
}
```

::: warning 그리드 옵션 getCellTooltip 과 같이 쓰면 컬럼 쪽은 무시됩니다
그리드 옵션에 `getCellTooltip` 을 넣으면 모든 셀이 그 함수만 쓰고, 컬럼의 `getCellTooltip` 은 호출되지 않습니다. 컬럼마다 다른 툴팁이 필요하면 그리드 옵션 쪽을 비워 둡니다.
:::

## 행마다 다른 셀 타입

`getCellTypeRepresentation` 이 돌려준 타입에 맞춰 셀 모양과 편집기가 바뀝니다. 값은 [typeRepresentation](/datagridview/api/type-representation) 목록의 이름입니다.

<<< @/../DataGridViewSample/07_columnFunctions.html#cellType{js}

## 함수가 참조하는 값이 바뀌었을 때

컬럼 함수는 셀을 그릴 때 호출됩니다. 행 값(`updateOptions`, 셀 편집)이 바뀌면 그리드가 다시 그리지만, 함수가 **행 데이터가 아닌 바깥 변수**를 참조하고 그 변수만 바뀌었다면 다시 그려지지 않습니다. 이때는 `grid.updateView()` 로 다시 그리게 합니다 ([그리드 메서드](/datagridview/api/grid-methods#화면-갱신)).
