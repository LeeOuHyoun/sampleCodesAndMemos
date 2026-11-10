---
title: 그리드 메서드
---

# 그리드 메서드 <Badge type="info" text="원본 분석" />

`new DataGridView({ ... })` 로 만든 그리드 객체에서 부르는 함수입니다. DataGridView 자체 함수와 상속받은 CollectionView 함수를 함께 정리했습니다. 옵션(`grid.옵션 = 값`)은 [그리드 옵션](/datagridview/api/grid-options) 에 있습니다.

```js
var grid = new DataGridView({ treeDocument: treeDocument, columns: columns });

var doc = grid.getTreeDocument();
var info = grid.getCellInfosAt(grid.getActiveCellID());
grid.ensureNodeModelVisible(doc.getRoots()[10], false, true);
```

::: info 근거
DataGridView.js 의 `DS/DataGridView/DataGridView`, CollectionView.js 의 `DS/CollectionView/CollectionView` 함수 정의. 2026 에서도 같은 이름으로 쓸 수 있습니다 (일부는 CollectionView 로 옮겨졌지만 그리드에서 부르는 방법은 같음).
:::

## 먼저 알아 둘 것: cellID 와 rowID

| 이름 | 뜻 | 얻는 방법 |
| --- | --- | --- |
| <code>cellID</code> | 셀 번호 (숫자). 대부분의 셀 함수가 받는 인자 | 이벤트의 `cellInfos.cellID`, `grid.getActiveCellID()` |
| <code>rowID</code> | **지금 화면에 보이는 순서**의 행 번호. 0 부터. 헤더는 -1 | `cellInfos.rowID` |
| <code>columnID</code> | 컬럼 번호. 행 번호 헤더는 -1 | `cellInfos.columnID` |

::: warning
`rowID` 는 펼침/접힘, 정렬, 필터에 따라 바뀝니다. 행을 오래 들고 있어야 하면 rowID 가 아니라 `nodeModel` 을 저장합니다.
:::

## 데이터 (TreeDocument, 행)

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getTreeDocument()</code> | <code>TreeDocument &#124; undefined</code> | 그리드에 연결된 데이터. TreeDocument 를 넣기 전이면 `undefined` |
| <code>treeDocument</code> (속성) | <code>TreeDocument &#124; null</code> | 위와 같은 객체. 대입하면 데이터 교체: `grid.treeDocument = newDoc` |
| <code>getNodeModelAtRowID(rowID)</code> | <code>TreeNodeModel</code> | 보이는 순서 rowID 의 행 |
| <code>getNodeModelAt(cellID)</code> | <code>TreeNodeModel</code> | 셀이 속한 행 |
| <code>getModelLength()</code> | <code>number</code> | 지금 화면에 표시되는 행 수 (접힌 하위 행, 필터로 빠진 행 제외) |
| <code>getNodesXSO()</code> | <code>XSO</code> | 행 선택 목록. `treeDocument.getXSO()` 와 같음 |

TreeDocument 자체의 함수(행 추가, 선택 목록 등)는 [데이터 (TreeDocument)](/datagridview/api/data) 에 있습니다.

## 셀 정보와 값

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getCellInfosAt(cellID)</code> | <code>{ cellID, rowID, columnID, cellModel, nodeModel }</code> | 셀 정보. `cellModel` 은 화면에 표시되는 셀 값 |
| <code>getLightCellInfosAt(cellID)</code> | <code>{ cellID, rowID, columnID, nodeModel }</code> | 값(cellModel) 계산을 건너뛴 가벼운 버전 |
| <code>getCellInfosFromHtmlElement(el)</code> | <code>cellInfos &#124; undefined</code> | DOM 요소가 들어 있는 셀의 정보 (+ `cellView`). 셀 안 버튼 click 처리에 사용 |
| <code>getModelAt(cellID)</code> | 값 | 셀 값. 행 번호 컬럼이면 `"1"` 같은 문자열 |
| <code>setModelAt(cellID, value)</code> | - | 셀 값 바꾸기. 컬럼 `setCellValue` 가 있으면 그것을 거침 |
| <code>getCellEditableState(cellID)</code> | <code>boolean</code> | 이 셀이 지금 편집 가능한지 |

::: tip
값을 바꿀 때는 보통 `nodeModel.updateOptions({ grid: { ... } })` 를 씁니다. `setModelAt` 은 cellID 만 알고 있을 때 편합니다. 자세한 방법은 [저장 후 화면 반영](/datagridview/save-and-reflect).
:::

## 활성 셀 (포커스)

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getActiveCellID()</code> | <code>number</code> | 현재 활성 셀. 없으면 -1 |
| <code>setActiveCell(cellID, scroll?)</code> | <code>boolean</code> | 활성 셀 바꾸기. `scroll` 이 `false` 가 아니면 셀이 보이도록 스크롤. `activeCellChange` 이벤트 발생 |
| <code>getPreselectedCellID()</code> | <code>number</code> | 마우스를 올린 셀 |

## 선택

`rowSelection` / `cellSelection` 옵션이 `'single'` 또는 `'multiple'` 일 때만 동작합니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>selectNodeModel(node, add?, range?)</code> | - | 행 선택. `add: true` 면 기존 선택 유지 (multiple). `range: true` 면 활성 셀 행부터 node 까지 범위 선택 |
| <code>unselectNodeModel(node)</code> | - | 행 선택 해제 (`node.unselect()` 와 같음) |
| <code>selectCell(cellID)</code> | - | 셀 선택. 셀 선택 모드가 아니면 그 셀의 행 선택 / 활성화 |
| <code>selectAll(onlyVisible?)</code> | - | 전체 선택. `'multiple'` 일 때만. `true` 면 펼쳐져 보이는 행만 |
| <code>unselectAll()</code> | - | 행, 셀, 컬럼 선택 모두 해제 |
| <code>selectColumn(columnID)</code> / <code>unselectColumn(columnID)</code> | - | 컬럼 선택 (`columnSelection` 옵션 필요) |

선택된 행 목록은 `grid.getTreeDocument().getSelectedNodes()` 로 읽습니다. 선택 변경 알림은 [이벤트](/datagridview/api/events) 의 `getXSO().onPostAdd` 를 봅니다.

## 스크롤과 강조

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>ensureNodeModelVisible(node, animate?, expandParents?, ratio?, flash?)</code> | <code>boolean</code> | 행이 보이도록 스크롤. `expandParents: true` 면 접힌 부모를 펼침. `ratio` 0~1 은 화면 안 위치 (0.5 = 가운데). `flash: true` 면 깜빡임 표시 |
| <code>ensureCellVisible(cellID, animate?, ratio?)</code> | <code>boolean</code> | 셀이 보이도록 스크롤. 이미 보이면 움직이지 않음 |
| <code>scrollToCellAt(cellID)</code> 또는 <code>scrollToCellAt({ cellID, animate })</code> | - | 셀이 왼쪽 위에 오도록 스크롤 |
| <code>getScrollerPosition()</code> / <code>setScrollerPosition({ x, y, animate })</code> | <code>{ x, y }</code> / - | 스크롤 위치 읽기 / 쓰기 (화면 복원용) |
| <code>flashEffectOnNodeModel('ui-modified', node)</code> | - | 행을 잠깐 깜빡여 변경을 알림 |

```js
var doc = grid.getTreeDocument();
var target = doc.getAllDescendants().find(function (n) { return n.getLabel() === 'PRT-0123'; });
grid.ensureNodeModelVisible(target, true, true, 0.5, true);
grid.selectNodeModel(target);
```

## 컬럼

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getColumnOrGroup(key)</code> | 컬럼 정의 객체 | `key` 는 dataIndex 문자열, columnIndex 숫자, `{ dataIndex }`, `{ columnIndex }` 중 하나. 컬럼 그룹 안도 찾음 |
| <code>addColumnOrGroup(columnDef, index?)</code> | - | 컬럼 추가. 같은 dataIndex 가 있으면 추가하지 않음 (children 만 합침). `index` 가 없으면 맨 끝 |
| <code>removeColumnOrGroup(key)</code> | - | 컬럼 삭제. `key` 는 getColumnOrGroup 과 같음 |
| <code>sizeColumnToFit(columnID)</code> | <code>number</code> | 내용 길이에 맞게 컬럼 너비 조정. 계산된 너비 반환 |
| <code>sizeAllColumnsToFit()</code> | - | 모든 컬럼 너비를 내용에 맞춤 |

::: tip
컬럼 정의를 바꿀 때 `grid.columns` 배열을 직접 고치면 화면에 반영되지 않을 수 있습니다. 추가와 삭제는 위 함수를 쓰고, 전체를 바꿀 때는 `grid.columns = newColumns` 로 대입합니다.
:::

## 화면 갱신

데이터(`TreeDocument`, `TreeNodeModel`)를 바꾸면 그리드가 알아서 다시 그리므로 **보통은 부를 필요가 없습니다.** 컬럼 함수(`getCellValue` 등)가 외부 변수를 참조해서 데이터 변경 없이 표시만 바뀌어야 할 때 씁니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>prepareUpdateView()</code> / <code>pushUpdateView()</code> | - | 화면 갱신을 묶기. 짝을 맞춰 부르고 마지막 push 때 한 번 다시 그림 |
| <code>updateView(options?)</code> | - | 보이는 영역을 다시 그림 |
| <code>updateRowView(rowID, options?)</code> | - | 행 하나만 다시 그림 (`updateRenderedRow` 와 같음) |
| <code>invalidateLayout(options?)</code> | - | 너비, 높이 계산을 다시 하고 그림 |
| <code>subscribeOnceToAllCellsRendered(fn)</code> | - | 다음 렌더링이 끝나면 한 번만 `fn` 실행 |

`options` 는 `{ updateCellContent, updateCellLayout, updateCellAttributes }` (각 `true | false`) 입니다.

## 로딩 표시

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>displayModalLoader(text?)</code> | - | 그리드 위에 로딩 표시를 덮음 |
| <code>removeModalLoader()</code> | - | 로딩 표시 제거 |

```js
grid.displayModalLoader('Loading...');
loadRows().then(function (rows) {
  var doc = grid.getTreeDocument();
  doc.prepareUpdate();
  rows.forEach(function (row) { doc.addRoot(new TreeNodeModel(row)); });
  doc.pushUpdate();
}).finally(function () {
  grid.removeModalLoader();
});
```

## 툴바, 그룹, 내보내기

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>setToolbar(json)</code> / <code>getToolbar()</code> | <code>GeneratedToolbar</code> | 툴바 만들기 / 읽기. [툴바](/datagridview/toolbar) 참고 |
| <code>groupRows(rowGroupingOptions)</code> | - | 행 그룹핑 적용. [하위 옵션 객체](/datagridview/api/sub-options) 의 rowGroupingOptions 참고 |
| <code>getAsCSV(options?)</code> | <code>string</code> | 그리드 내용을 CSV 문자열로. 아래 옵션 표 참고 |
| <code>setFindStr(text, matchCase?)</code> / <code>closeFind()</code> | - | 찾기 실행 / 닫기 |
| <code>goToNextMatchingCell()</code> / <code>goToPreviousMatchingCell()</code> | - | 찾기 결과 이동 |
| <code>destroy()</code> | - | 그리드 정리. 위젯이 닫힐 때 호출 |

`getAsCSV(options)` 옵션:

| 키 | 값 | 설명 |
| --- | --- | --- |
| <code>onlySelectedRows</code> | <code>true &#124; false</code> | 선택된 행만 |
| <code>columnKeys</code> | dataIndex 배열 | 내보낼 컬럼 지정 |
| <code>allColumns</code> | <code>true &#124; false</code> | 숨긴 컬럼까지 모두 (기본은 보이는 컬럼, 화면 순서) |
| <code>columnSeparator</code> | 문자열 | 구분자. 기본 `,` |
| <code>forceQuotes</code> | <code>true &#124; false</code> | 모든 값을 큰따옴표로 감쌈 |

반환 문자열은 엑셀에서 한글이 깨지지 않도록 앞에 BOM(`﻿`)이 붙어 있습니다. 컬럼별 값은 컬럼 옵션 `getCellValueForExport` 로 바꿀 수 있습니다.
