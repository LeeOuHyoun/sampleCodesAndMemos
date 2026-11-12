---
title: layoutOptions
---

# layoutOptions <Badge type="info" text="원본 분석" />

레이아웃(DataGridViewLayout) 객체를 만들 때 넘기는 옵션입니다. `new DataGridView({ layoutOptions: { ... } })` 처럼 설정 객체 **안의 하위 객체**로 넣습니다.

그리드를 만들 때만 넣을 수 있고(readOnly), 만든 뒤에는 `grid.layout.옵션 = 값` 으로 바꿉니다.

```js
var grid = new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  layoutOptions: { cellHeight: 32, rowsHeader: false }
});
grid.layout.rowSpacing = 4;
```

::: info 근거
DataGridView.js 의 DataGridViewLayout publishedProperties, DataGridViewLayout.getDefaultCellHeight (compact 26 / comfortable 40), `_applyColumnHeaderHeight` (최소 27), DataGridView publishedProperties 의 `layoutOptions` (readOnly).
:::

`grid.layout` 에서 부르는 함수(컬럼 숨기기, 너비 바꾸기 등)는 [레이아웃 메서드](/datagridview/api/layout-methods) 에 있습니다.

## 행 높이

예제는 [행 높이](/datagridview/row-height) 가이드에 있습니다.

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>cellHeight</code> | <code>integer</code> | <code>26</code> | 26 이상 | 행 기본 높이 |
| <code>rowMaxHeight</code> | <code>integer</code> | <code>undefined</code> | 26 이상 | 행 최대 높이 |
| <code>layoutDensity</code> | <code>string</code> | <code>'compact'</code> | <code>'compact' &#124; 'comfortable'</code> | 밀도 (행 기본 26 / 40px) |
| <code>rowSpacing</code> | <code>integer</code> | <code>0</code> | 숫자 | 행 간격 |
| <code>getRowHeightFunction</code> | <code>function</code> | <code>null</code> | function (rowID) → 높이 | 행별 높이 |

## 헤더 (컬럼 헤더, 행 머리)

예제는 [헤더](/datagridview/header) 가이드에 있습니다.

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>columnHeaderHeight</code> | <code>integer</code> | <code>27</code> | 27 이상 | 컬럼 헤더 줄 높이(px). 27 보다 작게 주면 27 로 되돌린다. 2단 헤더면 줄마다 이 높이 |
| <code>columnsHeader</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 컬럼 헤더 줄 표시. false 면 헤더 줄 전체를 숨김 |
| <code>rowsHeader</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 머리(번호, 체크박스 영역) 표시 |

## 컬럼 너비

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>cellWidth</code> | <code>integer</code> | <code>100</code> | 숫자 | 컬럼 width 미지정 시 참고 너비 |
| <code>useLastColumnWidthAutoFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 마지막 컬럼이 남은 너비를 채움 |

## 그 밖

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>addCellCoordinates</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 셀 DOM 에 좌표 속성 추가 (테스트 자동화용) |
| <code>preferencesToApply</code> | <code>string (readOnly)</code> | <code>undefined</code> | JSON 문자열 | 만들 때 한 번 적용할 화면 상태. `grid.layout.exportPreferencesInJson()` 결과와 같은 형식. 그리드 `identifier` 가 있어야 적용되고, 없으면 무시됨 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views#옵션)) |
