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
| <code>getModelLength()</code> | <code>number</code> | 지금 화면에 표시되는 행 수 (접힌 하위 행, 필터로 빠진 행 제외). <code>dataSource</code> 그리드에서는 뜻이 다름 ([서버 사이드 데이터](/datagridview/server-side#옵션과-함수)) |
| <code>getRowModelLength(depth?)</code> | <code>number</code> | 인자가 없으면 <code>getModelLength()</code> 와 같음. <code>depth</code> 를 주면 그 깊이의 표시 행 수 (-1 = 모든 깊이). <code>dataSource</code> 그리드에서는 서버가 알려 준 전체 행 수 (앱 파일 6개) |
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
| <code>getCellDefaultTooltip(cellInfos)</code> | 툴팁 객체 | 그리드 기본 툴팁. `getCellTooltip` 함수 안에서 일부 셀만 직접 정하고 나머지는 기본 툴팁으로 돌려줄 때 사용 (앱 파일 24개) |
| <code>setCellInEdition(cellID)</code> | <code>boolean &#124; Promise</code> | 셀을 편집 상태로 전환 (활성 셀로 만들고 편집기를 엶). 편집할 수 없는 셀이면 `false` |
| <code>isCellInEdition(cellID)</code> | <code>boolean</code> | 이 셀이 지금 편집 중인지 |

::: tip
값을 바꿀 때는 보통 `nodeModel.updateOptions({ grid: { ... } })` 를 씁니다. `setModelAt` 은 cellID 만 알고 있을 때 편합니다. 자세한 방법은 [저장 후 화면 반영](/datagridview/save-and-reflect).
:::

## 활성 셀 (포커스)

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getActiveCellID()</code> | <code>number</code> | 현재 활성 셀. 없으면 -1 |
| <code>setActiveCell(cellID, scroll?)</code> | <code>boolean</code> | 활성 셀 바꾸기. `scroll` 이 `false` 가 아니면 셀이 보이도록 스크롤. `activeCellChange` 이벤트 발생 |
| <code>getPreselectedCellID()</code> | <code>number</code> | 마우스를 올린 셀 |
| <code>setPreselectedCell(cellID)</code> | - | 마우스를 올린 것처럼 셀을 강조. `preselectedCellChange` 이벤트 발생. 터치 모드에서는 동작하지 않음 |
| <code>computeCellIDFromActiveCell(direction)</code> | <code>number</code> | 활성 셀에서 한 칸 옮긴 셀의 cellID. `direction` 은 `'up'`, `'down'`, `'left'`, `'right'`, `'pageup'`, `'pagedown'`. 키보드 이동을 직접 만들 때 사용 |

## 선택

`rowSelection` / `cellSelection` 옵션이 `'single'` 또는 `'multiple'` 일 때만 동작합니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>selectNodeModel(node, add?, range?)</code> | - | 행 선택. `add: true` 면 기존 선택 유지 (multiple). `range: true` 면 활성 셀 행부터 node 까지 범위 선택 |
| <code>unselectNodeModel(node)</code> | - | 행 선택 해제 (`node.unselect()` 와 같음) |
| <code>selectCell(cellID)</code> | - | 셀 선택. 셀 선택 모드가 아니면 그 셀의 행 선택 / 활성화 |
| <code>selectAll(onlyVisible?)</code> | - | 전체 선택. `'multiple'` 일 때만. `true` 면 펼쳐져 보이는 행만. <code>dataSource</code> 그리드에서는 불러온 행만 선택 |
| <code>selectAllVisibleNodes()</code> | - | `selectAll(true)` 와 같음 |
| <code>unselectAll()</code> | - | 행, 셀, 컬럼 선택 모두 해제 |
| <code>selectColumn(columnID)</code> / <code>unselectColumn(columnID)</code> | - | 컬럼 선택 (`columnSelection` 옵션 필요) |
| <code>isCellSelected(cellID)</code> / <code>isCellActive(cellID)</code> | <code>boolean</code> | 이 셀이 선택되어 있는지 / 활성 셀인지 (`cellActivationFeedback: 'row'` 면 같은 행 전체가 활성) |
| <code>getCellsXSO()</code> / <code>getColumnsXSO()</code> | <code>XSO</code> | 셀 선택 목록 / 컬럼 선택 목록. 행 선택 목록은 `getNodesXSO()` |

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
| <code>sizeAllColumnsToFit(options?)</code> | - | 모든 컬럼 너비를 내용에 맞춤 (화면에 보이는 행 기준). `options` 는 아래 sizeColumnsToFit 과 같음 |
| <code>sizeColumnsToFit(columns, options?)</code> | <code>{ dataIndex: 너비 }</code> | 여러 컬럼 너비를 내용에 맞춤. `columns` 는 dataIndex, 컬럼 번호, 컬럼 정의 객체의 배열. `options` 는 `{ computeAllRows, minMax, computeColumnHeader, isUserInteraction }`. 기본은 화면에 보이는 행만 재고, `computeAllRows: true` 면 모든 행, `minMax: { minRowID, maxRowID }` 면 그 범위의 행을 잼. `computeColumnHeader: true` 면 헤더 글자 길이도 계산에 넣음 |
| <code>sizeColumnOrGroupToFit(columnID, rowID, options?)</code> | - | 컬럼 그룹 헤더 칸(`rowID` -2 등) 기준으로 하위 컬럼을 모두 내용에 맞춤 |
| <code>isColumnSelected(column)</code> | <code>boolean</code> | 컬럼이 선택되어 있는지 (`columnSelection` 옵션 필요) |
| <code>selectColumnOrGroup(columnDef, add?)</code> / <code>unselectColumnOrGroup(columnDef)</code> | - | 컬럼 그룹의 하위 컬럼을 한 번에 선택 / 해제. 인자는 컬럼 정의 객체 |

컬럼 숨기기, 너비, 고정, 순서를 코드로 바꾸는 함수는 그리드가 아니라 `grid.layout` 에 있습니다 → [레이아웃 메서드](/datagridview/api/layout-methods).

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
| <code>updateColumnView(columnID, options?)</code> | - | 컬럼 하나의 보이는 셀만 다시 그림 (`updateRenderedColumn` 과 같음) |
| <code>invalidateLayout(options?)</code> | - | 너비, 높이 계산을 다시 하고 그림 |
| <code>subscribeOnceToAllCellsRendered(fn)</code> | - | 다음 렌더링이 끝나면 한 번만 `fn` 실행 |

`options` 는 `{ updateCellContent, updateCellLayout, updateCellAttributes }` (각 `true | false`) 입니다.

## 준비 시점과 크기

괄호 안은 앱 파일 119개 중 그 함수를 쓰는 파일 수입니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>onReady(fn)</code> | 구독 토큰 &#124; - | 그리드가 준비되면 `fn` 실행 (36). 이미 준비됐으면 바로 실행. inject 직후에 스크롤, 선택, 너비 맞춤을 할 때 사용 |
| <code>isInitialized()</code> | <code>boolean</code> | 그리드 초기화가 끝났는지 |
| <code>onPostUpdateView(fn)</code> / <code>onPostUpdateViewOnce(fn)</code> | 구독 토큰 | 화면 갱신이 끝날 때마다 / 다음 한 번만 `fn` 실행 |
| <code>unsubscribe(token)</code> | - | 위 함수들이 돌려준 구독 토큰으로 해제 |
| <code>getDimensions()</code> | <code>{ width, height }</code> | 그리드 전체 크기(px) (28) |
| <code>getViewportDimensions()</code> | <code>{ width, height }</code> | 스크롤되는 영역의 보이는 크기(px) |
| <code>getUUID()</code> | <code>string</code> | 그리드마다 다른 내부 id (16). 드래그 데이터가 어느 그리드에서 왔는지 가릴 때 사용 |

```js
grid.inject(document.getElementById('grid'));
grid.onReady(function () {
  grid.sizeAllColumnsToFit();
});
```

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

## 행을 나눠 불러오기

괄호 안은 앱 파일 119개 중 그 함수를 쓰는 파일 수입니다. 예제는 [서버 사이드 데이터](/datagridview/server-side) 에 있습니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>onInfiniteScroll(fn, options?)</code> | - | 스크롤이 아래 / 오른쪽 끝에 닿으면 <code>fn({ reachBottom, reachRight, isVeryCloseFromBottom, isVeryCloseFromRight })</code> (7). <code>options</code> 는 <code>{ verticalTolerance: 10, horizontalTolerance: 10 }</code> (px) |
| <code>infiniteScrollProcessDone()</code> | - | <code>onInfiniteScroll</code> 처리가 끝났음을 알림 (6). 부르지 않으면 콜백이 다시 오지 않음 |
| <code>requestDelayedModelData(context?, allRows?)</code> | - | 그리드 옵션 <code>onDelayedModelDataRequest</code> 콜백을 지금 부르게 함 (6). <code>allRows: true</code> 면 범위가 전체 행 (전체 컬럼). <code>context</code> 를 생략하면 콜백의 <code>info.context</code> 는 <code>undefined</code> |
| <code>onEndResizeOrOnReadyModelRequest(fn)</code> / <code>EndResizeOrOnReadyModelRequestDone()</code> | - | 준비됐을 때와 크기가 바뀐 뒤 <code>fn({ RowMaxNumber, ColumnsMaxNumber, viewportDimensions, event })</code> / 처리 끝 알림 (2) |
| <code>resetTreeDocument()</code> | - | <code>dataSource</code> 그리드의 행과 선택을 비우고 처음부터 다시 불러옴. <code>treeDocument</code> 그리드에서는 아무 일도 안 함 |
| <code>executePendingNotifications(callback?)</code> / <code>flushPendingNotifications()</code> | - | <code>syncClientModelOnDemand: true</code> 로 모아 둔 서버 변경을 반영 / 버림 |

## 툴바, 그룹, 내보내기

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>setToolbar(json)</code> / <code>getToolbar()</code> | <code>GeneratedToolbar</code> | 툴바 만들기 / 읽기. [툴바](/datagridview/toolbar) 참고 |
| <code>groupRows({ dataIndexesToGroup: [...] })</code> | - | 행 묶기. 배열에 기준 컬럼의 dataIndex 를 순서대로 넣음. 빈 배열이면 해제. 비동기로 끝나고, 끝나면 TreeDocument 에 `groupNodes` 이벤트 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>getGroupingOptions()</code> | 객체 &#124; <code>undefined</code> | 마지막으로 groupRows 에 넘긴 객체. 한 번도 묶지 않았으면 undefined |
| <code>createGroupingUI()</code> | 칩 컨트롤 | 컬럼 헤더를 끌어 놓아 묶는 영역(`DS/Controls/SelectionChips`)을 만들어 돌려줌. inject 는 직접 함 |
| <code>getAsCSV(options?)</code> | <code>string</code> | 그리드 내용을 CSV 문자열로. 아래 옵션 표 참고. 행을 나눠 불러오는 그리드에서는 그 순간 불러온 행만 담김 |
| <code>setFindStr(text, matchCase?)</code> / <code>closeFind()</code> | - | 찾기 실행 / 닫기 |
| <code>goToNextMatchingCell()</code> / <code>goToPreviousMatchingCell()</code> | - | 찾기 결과 이동 |
| <code>setUseClipboardFlag(flag)</code> / <code>getUseClipboardFlag()</code> | - / <code>boolean</code> | 기본 true. `false` 로 하면 Ctrl+C / Ctrl+X / Ctrl+V 때 그리드가 셀 값을 시스템 클립보드로 복사 / 붙여넣기 하지 않음 (앱이 복사 동작을 직접 처리할 때) |
| <code>getFindableAttributes()</code> | 문자열 배열 | 지금 보이는 컬럼의 헤더 글자 목록 (화면 순서) |
| <code>destroy()</code> | - | 그리드 정리. 위젯이 닫힐 때 호출 |

`getAsCSV(options)` 옵션:

| 키 | 값 | 설명 |
| --- | --- | --- |
| <code>onlySelectedRows</code> | <code>true &#124; false</code> | 선택된 행만 |
| <code>columnKeys</code> | dataIndex 배열 | 내보낼 컬럼 지정 |
| <code>allColumns</code> | <code>true &#124; false</code> | 숨긴 컬럼까지 모두 (기본은 보이는 컬럼, 화면 순서) |
| <code>columnSeparator</code> | 문자열 | 구분자. 기본 `,` |
| <code>forceQuotes</code> | <code>true &#124; false</code> | 모든 값을 큰따옴표로 감쌈 |
| <code>canNodeModelBeExported</code> | fn(node) → boolean | false 를 돌려준 행은 내보내지 않음 (그룹 행을 뺄 때 사용) |
| <code>addLevelInformation</code> | <code>true &#124; false</code> | 맨 앞에 깊이(getNodeDepth) 칸을 추가 |

반환 문자열은 엑셀에서 한글이 깨지지 않도록 앞에 BOM(`﻿`)이 붙어 있습니다. 컬럼별 값은 컬럼 옵션 `getCellValueForExport` 로 바꿀 수 있습니다.

## 우클릭 메뉴, 셀 직접 그리기, 상태바

괄호 안은 DataGridView 를 쓰는 앱 파일 119개 중 그 함수를 쓰는 파일 수입니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>buildDefaultContextualMenu(params, options?)</code> | 메뉴 항목 배열 | 그리드 기본 우클릭 메뉴. `onContextualEvent` 안에서 기본 메뉴에 항목을 더할 때 사용 ([우클릭 메뉴](/datagridview/context-menu#그리드-기본-메뉴-쓰기)) |
| <code>registerReusableCellContent({ id, buildContent, cleanContent })</code> | - | 직접 그리는 셀의 내용 등록 (31). 같은 id 로 다시 등록하면 대체 ([셀 직접 그리기](/datagridview/custom-cell)) |
| <code>isReusableCellContentRegistered(id)</code> | <code>boolean</code> | 그 id 가 등록되어 있는지 |
| <code>reuseCellContent(id)</code> | 등록한 내용 | 등록한 내용 하나를 꺼냄 (31). 컬럼 `onCellRequest` 안에서 사용 |
| <code>buildStatusBar(items)</code> | - | 그리드 아래 상태바 만들기 (21). 만든 뒤 객체는 `grid.elements.statusBar` ([상태바](/datagridview/status-bar)) |
| <code>getTypeRepresentationFactory()</code> | <code>TypeRepresentationFactory</code> | 그리드가 쓰는 타입 등록소. [사용자 타입 등록](/tweakers/custom-type) 에 사용 |

## 사용자 뷰, 일괄 수정, 인쇄

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getCustomViewsManager()</code> | 사용자 뷰 관리 객체 | 컬럼 구성과 정렬을 "뷰" 로 저장하고 바꾸는 관리 객체 (17). 처음 부를 때 만들어짐 |
| <code>loadCustomViews(views, current?)</code> | - | 사용자 뷰 목록을 통째로 바꾸고 `current` 뷰를 적용 (10). `current` 는 순번 또는 identifier. 뷰의 형식은 [뷰 하나의 키](/datagridview/custom-views#뷰-하나의-키). `layoutDensity` 가 있는 뷰를 넣으면 그 밀도가 원래 밀도가 되어 기본 뷰로 돌아가지 않음 ([주의](/datagridview/custom-views#주의)) |
| <code>showCustomViewsDialog()</code> | 대화상자 | 사용자 뷰 대화상자 열기 (10). 헤더 우클릭 기본 메뉴의 "테이블 보기 구성..." 과 같음 |
| <code>DataGridView.hasPreferences(identifier)</code> | <code>boolean</code> | (정적 함수) 그 identifier 로 저장된 화면 상태가 있는지 |
| <code>DataGridView.importJsonPreferences(identifier, json)</code> | - | (정적 함수) 그리드를 만들기 전에 화면 상태를 넣어 둠. 항상 localStorage 에 씀 ([예제](/datagridview/custom-views#예제-4-상태를-꺼내-서버에-저장하고-되살리기)) |
| <code>showModelMassUpdateDialog()</code> | - | 여러 행 일괄 수정 대화상자 열기. `editableFlag` 와 `massUpdateAllowedFlag` 가 모두 true 인 컬럼이 대상 |
| <code>generatePrintableViewHTML()</code> | <code>string</code> | 지금 보이는 행을 인쇄용 `table` HTML 문자열로 |
| <code>openPrintableViewWindow()</code> | - | 인쇄용 화면을 만들어 엶. 컬럼 옵션 `printableFlag: false` 인 컬럼은 제외 |

## 드래그앤드롭

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getRowReorderEnabledState()</code> | <code>boolean</code> | 지금 행 순서 바꾸기가 되는 상태인지 (rowDragEnabledFlag, rowReorderEnabledFlag 가 모두 true 이고 꺼 둔 상태가 아닐 때 true) |
| <code>disableRowReordering()</code> / <code>enableRowReordering()</code> | - | 행 순서 바꾸기를 잠시 끄기 / 되돌리기. 횟수를 세므로 끈 만큼 켜야 함. 그룹핑 중에는 그리드가 스스로 끔 |
| <code>getDraggedRowData(event)</code> | <code>{ uuid, rowID, label, icons, grid, nodeModel, listOfDumpedNodes } &#124; undefined</code> | Drop 콜백에서 끌어 온 행 정보 읽기. nodeModel 은 행 객체가 아니라 내부 id |
| <code>getDraggedColumnData(event)</code> | <code>{ uuid, label, rowID, columnID } &#124; undefined</code> | Drop 콜백에서 끌어 온 컬럼 헤더 정보 읽기 |
| <code>insertRowCallback(nodeModel, rowID, cellInfos)</code> | - | 기본 우클릭 메뉴의 "행 삽입" 으로 빈 행이 추가된 직후에 불림. `grid.insertRowCallback = fn` 으로 바꿔 넣음. 드래그와는 무관 |

예제는 [드래그앤드롭](/datagridview/drag-and-drop) 에 있습니다.

## 정렬, 그룹 다시 적용

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>reapplySortModel()</code> | - | 지금 `sortModel` 로 다시 정렬. 행을 추가하거나 값을 바꾼 뒤 순서를 다시 맞출 때 |
| <code>reapplyRowGrouping()</code> | - | 지금 그룹 설정으로 다시 묶음. 묶은 뒤 추가한 행은 자동으로 그룹에 들어가지 않으므로 이때 부름 ([행 그룹핑](/datagridview/row-grouping#예제-9-행을-추가한-뒤-다시-묶기)) |
| <code>getFilterViewManager()</code> | 필터 화면 관리 객체 | 사용자 정의 필터 화면 등록 (`registerFilterView`) 에 사용 ([필터](/datagridview/api/filter)) |

::: info 근거
DataGridView.js 의 buildDefaultContextualMenu / getCustomViewsManager / loadCustomViews / showCustomViewsDialog / showModelMassUpdateDialog (`_buildMassUpdateDialogAttributes`) / generatePrintableViewHTML / openPrintableViewWindow / reapplySortModel / reapplyRowGrouping / setCellInEdition / isCellSelected / isCellActive / getColumnsXSO, CollectionView.js 의 registerReusableCellContent / reuseCellContent / buildStatusBar / getCellsXSO / isCellInEdition.
:::
