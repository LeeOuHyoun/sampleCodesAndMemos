---
title: 컬럼 함수
---

# 컬럼 함수 <Badge type="info" text="원본 분석" />

컬럼 옵션에 고정값 대신 함수를 넣으면 셀마다 다르게 정할 수 있습니다. 인자 `cellInfos` 에는 rowID, columnID, cellID, nodeModel(행 데이터), cellModel(셀 값) 등이 들어 있고, 함수 안의 `this` 는 그리드입니다.

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
DataGridView.js 의 DataGridViewLayout (`getColumnOptionValue(columnID, "함수명")` 으로 컬럼 함수를 읽는 getter 들), DataGridView 의 getCellInfosAt / setNodeModelValue / getCellValueForSort 호출부, CollectionView.js 의 셀 선택, 활성 판단 코드.
:::

## 값 (표시 / 저장 / 정렬)

| 키 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- |
| <code>getCellValue</code> | fn(cellInfos)  this=그리드 | 표시할 값 | <code>var g = cellInfos.nodeModel.options.grid; return g.qty * g.price;</code> | grid[dataIndex] 대신 계산한 값을 표시. 화면, 찾기, 내보내기에 모두 쓰임 |
| <code>setCellValue</code> | fn(cellInfos, newValue)  this=그리드 | - | <code>cellInfos.nodeModel.updateOptions({ grid: { qty: newValue } });</code> | 편집 결과 저장 방법을 직접 지정. cellInfos.cellModel = 바뀌기 전 값 |
| <code>hasCellValue</code> | fn(cellInfos)  this=그리드 | boolean | <code>return cellInfos.nodeModel.options.grid.type === 'PART';</code> | false 를 돌려주면 해당 셀은 빈 칸 (getCellValue 도 호출 안 됨) |
| <code>getCellValueForSort</code> | fn(nodeModel, dataIndex)  this=그리드 | 정렬용 값 | <code>return nodeModel.options.grid.dueDate.getTime();</code> | ※ 인자가 cellInfos 가 아님. 정렬에 쓸 값이 표시값과 다를 때 |
| <code>compareFunction</code> | fn(값A, 값B, 행A, 행B, dataIndex) | 음수 &#124; 0 &#124; 양수 | <code>return ORDER[a] - ORDER[b];</code> | 정렬 비교 함수 자체를 바꿈. 내림차순은 그리드가 -1 을 곱함 |

## 셀 타입 / 편집

| 키 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- |
| <code>getCellTypeRepresentation</code> | fn(cellInfos)  this=그리드 | typeRepresentation 문자열 | <code>return cellInfos.nodeModel.options.grid.kind === 'N' ? 'integer' : 'string';</code> | 행마다 다른 셀 타입 ([typeRepresentation](/datagridview/api/type-representation) 값) |
| <code>getCellSemantics</code> | fn(cellInfos)  this=그리드 | semantics 객체 | <code>return { possibleValues: listByType[cellInfos.nodeModel.options.grid.type], allowMultipleValuesFlag: true };</code> | 행마다 다른 콤보 목록, 최소/최대값 등. 지정하면 컬럼 semantics 대신 사용 |
| <code>getCellEditableState</code> | fn(cellInfos)  this=그리드 | boolean | return cellInfos.nodeModel.options.grid.status !== '승인'; | 행마다 편집 가능 여부 (editableFlag:true 인 컬럼에서) |
| <code>getCellSelectableState</code> | fn(cellInfos, eventTarget)  this=그리드 | boolean | - | false 면 클릭해도 선택되지 않고 활성만 됨 |
| <code>getCellActivableState</code> | fn(cellInfos)  this=그리드 | boolean | - | false 면 클릭/키보드로 활성(포커스)되지 않음 |

## 모양

| 키 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- |
| <code>getCellClassName</code> | fn(cellInfos)  this=그리드 | CSS 클래스 문자열 | <code>return cellInfos.nodeModel.options.grid.progress &lt; 30 ? 'cell-warn' : '';</code> | 조건부 셀 스타일 (CSS 는 페이지에 직접 정의) |
| <code>getCellAttributes</code> | fn(cellInfos)  this=그리드 | { 속성명: 값 } | <code>return { 'data-status': cellInfos.nodeModel.options.grid.status };</code> | 셀 DOM 에 속성 추가 (CSS 선택자, 테스트용) |
| <code>getCellTooltip</code> | fn(cellInfos)  ※ this 없음 | 툴팁 객체 | return { shortHelp: '담당: ' + cellInfos.nodeModel.options.grid.owner }; | 셀 툴팁. 없으면 그리드 기본 툴팁 |
| <code>getCellIcons</code> | fn(cellInfos)  ※ this 없음 | 아이콘 배열 | <code>return [{ iconName: 'lock', fontIconFamily: 1 }];</code> | 셀 앞 아이콘 (기본: nodeModel.getIcons()) |
| <code>getCellKPIColor</code> | fn(cellInfos)  this=그리드 | 색상 문자열 | <code>return g.progress &lt; 30 ? '#ea4f37' : '#57b847';</code> | KPI 색 (그리드 showNodeKPIColorFlag:true 필요) |
| <code>shouldCellAllowUnsafeHTMLContentAt</code> | fn(cellInfos)  this=그리드 | boolean | - | 셀 단위로 HTML 렌더링 허용 (allowUnsafeHTMLContent 의 셀 버전) |
| <code>onCellRequest</code> | fn(cellInfos)  this=그리드 | - | cellInfos.cellView 의 내용을 직접 구성 | 셀 DOM 을 직접 그림. 지정하면 기본 렌더링(defaultOnCellRequest) 대신 호출 |

## 그룹핑 / 찾기

| 키 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- |
| <code>getCellGroupingKey</code> | fn(cellInfos, dataIndex)  this=그리드 | 그룹 키 | <code>return g.dueDate.getFullYear() + '-' + (g.dueDate.getMonth() + 1);</code> | 행 그룹핑 시 묶을 기준 값 (예: 날짜를 월 단위로) |
| <code>isCellMatchingFind</code> | fn(셀 값, 찾을 문자열) | boolean | - | 찾기(setFindStr) 일치 여부 직접 판단 |
| <code>getFindPositionsInCellString</code> | fn(셀 문자열, 찾을 문자열, 결과배열) | - | 결과배열.push({ start, end }) | 찾기 결과 강조 위치 직접 지정 |

## cellInfos 구조 (위 함수들의 인자)

| 키 | 호출 형태 (this) | 반환값 | 예 | 설명 |
| --- | --- | --- | --- | --- |
| <code>cellInfos.cellID / rowID / columnID</code> | 숫자 | - | - | rowID -1 = 컬럼 헤더 줄, columnID -1 = 행 머리(번호) 칸 |
| <code>cellInfos.nodeModel</code> | <code>TreeNodeModel</code> | - | nodeModel.options.grid.키 / nodeModel.options.label | 행 데이터 |
| <code>cellInfos.cellModel</code> | 값 | - | - | 현재 셀 값 (getCellInfosAt 계열에서만. 편집 가능 여부 판단 계열은 없음) |
| <code>cellInfos.cellView</code> | 셀 뷰 | - | - | onCellRequest, 이벤트 리스너에서 제공 |
