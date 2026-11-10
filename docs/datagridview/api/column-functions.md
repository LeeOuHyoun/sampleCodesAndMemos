---
title: 컬럼 함수
---

# 컬럼 함수 <Badge type="info" text="원본 분석" />

컬럼 옵션에 고정값 대신 함수를 넣으면 셀마다 다르게 정할 수 있습니다. 인자 `cellInfos` 에는 rowID, columnID, cellID, nodeModel(행 데이터), cellModel(셀 값) 등이 들어 있고, 함수 안의 `this` 는 그리드입니다.

예제와 함께 보려면 [컬럼 함수 가이드](/datagridview/cell-functions) 를 먼저 읽으세요. 샘플: [07_columnFunctions.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/07_columnFunctions.html)

```js
{
  text: '금액', dataIndex: 'amount',
  getCellValue: function (cellInfos) {
    var g = cellInfos.nodeModel.options.grid;
    return g.qty * g.price;
  },
  getCellEditableState: function (cellInfos) {
    return cellInfos.nodeModel.options.grid.status !== '승인';
  }
}
```

::: info 근거
DataGridView.js 의 DataGridViewLayout (`getColumnOptionValue(columnID, "함수명")` 으로 컬럼 함수를 읽는 getter 들), DataGridView 의 getCellInfosAt / setNodeModelValue / getCellValueForSort / _getCellValueForExport / _getCellValueForCopy / _getCellTooltip / getCellCssClassesAt 호출부, CollectionView.js 의 셀 선택, 활성 판단 코드.
:::

"사용" 칸은 enovia2025 webapps 에서 DataGridView 를 쓰는 앱 파일 119개 가운데 그 이름이 나오는 파일 수입니다. 많이 쓰이는 함수부터 익히면 됩니다.

## 값 (표시 / 저장 / 정렬)

| 키 | 사용 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>getCellValue</code> | 47 | fn(cellInfos)  this=그리드 | 표시할 값 | <code>var g = cellInfos.nodeModel.options.grid; return g.qty * g.price;</code> | grid[dataIndex] 대신 계산한 값을 표시. 화면, 찾기, 내보내기에 모두 쓰임 |
| <code>setCellValue</code> | 25 | fn(cellInfos, newValue)  this=그리드 | - | <code>cellInfos.nodeModel.updateOptions({ grid: { qty: newValue } });</code> | 편집 결과 저장 방법을 직접 지정. cellInfos.cellModel = 바뀌기 전 값 |
| <code>hasCellValue</code> | 19 | fn(cellInfos)  this=그리드 | boolean | <code>return cellInfos.nodeModel.options.grid.type === 'PART';</code> | false 를 돌려주면 해당 셀은 빈 칸 (getCellValue 도 호출 안 됨) |
| <code>getCellValueForSort</code> | 7 | fn(nodeModel, dataIndex)  this=그리드 | 정렬용 값 | <code>return nodeModel.options.grid.dueDate.getTime();</code> | ※ 인자가 cellInfos 가 아님. 정렬에 쓸 값이 표시값과 다를 때. getCellValue 로 계산해 보여주는 컬럼은 이 함수가 있어야 정렬할 값이 생김 |
| <code>getCellValueForExport</code> | 15 | fn(cellInfos)  this=그리드 | 내보낼 값 | <code>return cellInfos.nodeModel.options.grid.owners.join(';');</code> | <code>grid.getAsCSV()</code> 로 내보낼 때 쓸 값 |
| <code>getCellValueForCopy</code> | 4 | fn(cellInfos)  this=그리드 | 복사할 값 | - | 셀을 복사(Ctrl+C)할 때 클립보드에 넣을 값 |
| <code>processCellValueFromPaste</code> | 3 | fn(cellInfos, 붙여 넣는 글자)  this=그리드 | 셀에 넣을 값 | <code>return Number(text);</code> | 붙여넣기(Ctrl+V)한 글자를 셀 값으로 바꿈. 돌려준 값이 편집 가능한 셀에 들어감 |
| <code>compareFunction</code> | 24 | fn(값A, 값B, 행A, 행B, dataIndex) | 음수 &#124; 0 &#124; 양수 | <code>return ORDER[a] - ORDER[b];</code> | 정렬 비교 함수 자체를 바꿈. 내림차순은 그리드가 -1 을 곱함 |

## 셀 타입 / 편집

| 키 | 사용 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>getCellTypeRepresentation</code> | 39 | fn(cellInfos)  this=그리드 | typeRepresentation 문자열 | <code>return cellInfos.nodeModel.options.grid.kind === 'N' ? 'integer' : 'string';</code> | 행마다 다른 셀 타입 ([typeRepresentation](/datagridview/api/type-representation) 값) |
| <code>getCellSemantics</code> | 57 | fn(cellInfos)  this=그리드 | semantics 객체 | <code>return { possibleValues: listByType[cellInfos.nodeModel.options.grid.type], allowMultipleValuesFlag: true };</code> | 행마다 다른 콤보 목록, 최소/최대값 등. 지정하면 컬럼 semantics 대신 사용 |
| <code>getCellEditableState</code> | 26 | fn(cellInfos)  this=그리드 | boolean | return cellInfos.nodeModel.options.grid.status !== '승인'; | 행마다 편집 가능 여부 (editableFlag:true 인 컬럼에서) |
| <code>getCellSelectableState</code> | 2 | fn(cellInfos, eventTarget)  this=그리드 | boolean | - | false 면 클릭해도 선택되지 않고 활성만 됨 |
| <code>getCellActivableState</code> | 1 | fn(cellInfos)  this=그리드 | boolean | - | false 면 클릭/키보드로 활성(포커스)되지 않음 |

## 모양

| 키 | 사용 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>getCellClassName</code> | 34 | fn(cellInfos)  this=그리드 | CSS 클래스 문자열 | <code>return cellInfos.nodeModel.options.grid.progress &lt; 30 ? 'cell-warn' : '';</code> | 조건부 셀 스타일 (CSS 는 페이지에 직접 정의) |
| <code>getCellAttributes</code> | 1 | fn(cellInfos)  this=그리드 | { 속성명: 값 } | <code>return { 'data-status': cellInfos.nodeModel.options.grid.status };</code> | 셀 DOM 에 속성 추가 (CSS 선택자, 테스트용) |
| <code>getCellTooltip</code> | 52 | fn(cellInfos)  ※ this 없음 | 툴팁 객체 | return { shortHelp: '담당: ' + cellInfos.nodeModel.options.grid.owner }; | 셀 툴팁. 없으면 그리드 기본 툴팁. ※ 그리드 옵션 <code>getCellTooltip</code> 을 넣으면 그리드 쪽만 호출되고 컬럼 쪽은 무시됨 |
| <code>getCellIcons</code> | 3 | fn(cellInfos)  ※ this 없음 | 아이콘 배열 | <code>return [{ iconName: 'lock', fontIconFamily: 1 }];</code> | 셀 앞 아이콘 (기본: nodeModel.getIcons()) |
| <code>getCellKPIColor</code> | 11 | fn(cellInfos)  this=그리드 | 색상 문자열 | <code>return g.progress &lt; 30 ? '#ea4f37' : '#57b847';</code> | KPI 색 (그리드 showNodeKPIColorFlag:true 필요) |
| <code>shouldCellAllowUnsafeHTMLContentAt</code> | 10 | fn(cellInfos)  this=그리드 | boolean | - | 셀 단위로 HTML 렌더링 허용 (allowUnsafeHTMLContent 의 셀 버전) |
| <code>onCellRequest</code> | 41 | fn(cellInfos)  this=그리드 | - | cellInfos.cellView 의 내용을 직접 구성 | 셀 DOM 을 직접 그림. 지정하면 기본 렌더링(defaultOnCellRequest) 대신 호출. 데이터 행의 셀에서만 호출 ([셀 직접 그리기](/datagridview/custom-cell)) |

## 그룹핑 / 찾기

| 키 | 사용 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- | --- |
| <code>getCellGroupingKey</code> | 11 | fn(cellInfos, dataIndex)  this=그리드 | 그룹 키 | <code>return g.dueDate.getFullYear() + '-' + (g.dueDate.getMonth() + 1);</code> | 행 그룹핑 시 묶을 기준 값 (예: 날짜를 월 단위로) |
| <code>isCellMatchingFind</code> | 0 | fn(셀 값, 찾을 문자열) | boolean | - | 찾기(setFindStr) 일치 여부 직접 판단 |
| <code>getFindPositionsInCellString</code> | 0 | fn(셀 문자열, 찾을 문자열, 결과배열) | - | 결과배열.push({ start, end }) | 찾기 결과 강조 위치 직접 지정 |

## cellInfos 구조 (위 함수들의 인자)

| 키 | 타입 | 설명 |
| --- | --- | --- |
| <code>cellInfos.cellID</code> / <code>rowID</code> / <code>columnID</code> | 숫자 | rowID -1 = 컬럼 헤더 줄, columnID -1 = 행 머리(번호) 칸 |
| <code>cellInfos.nodeModel</code> | <code>TreeNodeModel</code> | 행 데이터. 값은 <code>nodeModel.options.grid.키</code>, <code>nodeModel.options.label</code> 로 읽음 |
| <code>cellInfos.cellModel</code> | 값 | 현재 셀 값 (getCellInfosAt 계열에서만. 편집 가능 여부 판단 계열은 없음) |
| <code>cellInfos.cellView</code> | 셀 뷰 | onCellRequest, 이벤트 리스너에서 제공 |

::: warning nodeModel 이 없을 수 있습니다
함수에 따라 컬럼 헤더 셀(rowID -1)에도 호출되고, 그때는 `nodeModel` 이 없습니다. 예를 들어 그리드는 rowID 를 가리지 않고 `getCellClassName` 을 부릅니다 (DataGridView.getCellCssClassesAt). 실제 ENOVIA 앱의 컬럼 함수도 대부분 `cellInfos && cellInfos.nodeModel` 을 먼저 확인하고 값을 읽습니다. 위 표의 "예" 칸은 짧게 쓰느라 이 확인을 뺐습니다.
:::
