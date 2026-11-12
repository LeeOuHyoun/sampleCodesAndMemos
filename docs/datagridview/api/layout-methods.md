---
title: 레이아웃 메서드
---

# 레이아웃 메서드 (grid.layout) <Badge type="tip" text="로컬 실행 확인" />

`grid.layout` 객체에서 부르는 함수입니다. 컬럼을 숨기거나 너비를 바꾸는 것처럼 **만든 뒤에 컬럼을 다루는 일**은 대부분 그리드가 아니라 이 객체에 있습니다. 그리드 객체의 함수는 [그리드 메서드](/datagridview/api/grid-methods), 생성할 때 넣는 옵션은 [layoutOptions](/datagridview/api/layout-options) 에 있습니다.

```js
var grid = new DataGridView({ treeDocument: treeDocument, columns: columns });

grid.layout.setColumnVisibleFlag('price', false);
grid.layout.setColumnWidth('title', 240);
grid.layout.setColumnPinned('tree', 'left');
```

샘플: [12_header.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/12_header.html) 의 "컬럼" 버튼 줄

"사용" 칸은 enovia2025 webapps 에서 DataGridView 를 쓰는 앱 파일 119개 가운데 그 이름이 나오는 파일 수입니다.

::: info 근거
DataGridView.js 의 `DS/DataGridView/layouts/DataGridViewLayout` (클래스 이름 CollectionViewDataGridLayout) 함수 정의와 `DS/DataGridView/ColumnModel` (getColumnIndex, getColumnIdentifiers, getColumnVisibleState, moveColumnOrGroup, `_isColumnDisplayedByHierarchy`). 2026 도 같은 이름입니다. 표의 반환값과 동작은 샘플을 원본 webapps 파일로 로컬에서 띄워 확인 (3DSpace 서버에서는 미확인).
:::

## 먼저 알아 둘 것: 컬럼을 가리키는 방법

이 페이지의 `column` 인자는 **dataIndex 문자열** 또는 **컬럼 번호(columnIndex)** 를 받습니다. 둘 다 같은 컬럼을 가리킵니다.

| 이름 | 뜻 |
| --- | --- |
| <code>dataIndex</code> | 컬럼 정의에 넣은 키 (`'tree'`, `'title'`) |
| <code>columnIndex</code> | `columns` 배열에 정의한 순서. 0 부터. 사용자가 헤더를 끌어 순서를 바꿔도 **변하지 않습니다**. 이벤트의 `cellInfos.columnID` 가 이 번호입니다 |
| 화면 순서 | 지금 화면에 놓인 순서. `getOrderedColumnsIndexes()` 로 읽습니다 |

```js
grid.addEventListener('click', function (event, cellInfos) {
  if (!cellInfos || cellInfos.columnID < 0) { return; }
  var dataIndex = grid.layout.getDataIndexFromColumnIndex(cellInfos.columnID);
});
```

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>getDataIndexFromColumnIndex(columnIndex)</code> | 36 | <code>string</code> | 컬럼 번호 → dataIndex. 범위를 벗어나면(행 머리 포함) `'rowHeader'` |
| <code>getColumnIndex(column)</code> | 20 | <code>number</code> | dataIndex → 컬럼 번호. 숫자를 주면 그대로 돌려줌. 없는 dataIndex 면 `undefined` |
| <code>getColumnIdentifiers(key)</code> | 2 | <code>{ dataIndex, columnIndex }</code> | `key` 는 dataIndex, 컬럼 번호, `{ dataIndex }`, `{ columnIndex }` 중 하나 |

## 컬럼 목록 읽기

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>getLeafColumns()</code> | 11 | 컬럼 정의 배열 | 값을 보여 주는 컬럼 전체 (그룹 헤더 제외). 배열 순번 = 컬럼 번호. 숨긴 컬럼도 포함 |
| <code>getVisibleOrderedLeafColumns()</code> | 5 | 컬럼 정의 배열 | 지금 보이는 컬럼만, 화면 순서대로 |
| <code>getOrderedColumnsIndexes()</code> | 8 | 컬럼 번호 배열 | 화면 순서대로 놓은 컬럼 번호 (숨긴 컬럼 포함) |
| <code>getVisibleOrderedColumnsIndexes()</code> | 4 | 컬럼 번호 배열 | 보이는 컬럼만, 화면 순서대로 |
| <code>getDisplayedColumnsIndexes()</code> | 2 | 컬럼 번호 배열 | 지금 스크롤 위치에서 화면 안에 들어와 있는 컬럼 |
| <code>getColumnOrGroup(key)</code> | 29 | 컬럼 정의 객체 | 컬럼 또는 그룹 하나. `grid.getColumnOrGroup(key)` 와 같음 |
| <code>getColumnOptionValue(column, '키')</code> | 7 | 값 | 컬럼 옵션 값. 컬럼에 없으면 `defaultColumnDef` 의 값 |

<<< @/../DataGridViewSample/12_header.html#read{js}

수량을 품명 앞으로 옮긴 뒤 위 코드를 실행하면 컬럼 번호는 그대로이고 화면 순서만 바뀝니다.

```
컬럼 번호: 0:tree, 1:title, 2:status, 3:sizeText, 4:width, 5:height, 6:depth, 7:qty, 8:note
화면 순서: tree, qty, title, status, width, height, depth, note
```

## 컬럼 보이기와 숨기기

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>setColumnVisibleFlag(column, flag, options?)</code> | 26 | - | 컬럼 표시 / 숨김. `columnVisibleStateChange` 이벤트 발생. `alwaysVisibleFlag: true` 인 컬럼은 숨길 수 없음 |
| <code>getColumnVisibleFlag(column)</code> | 9 | <code>boolean</code> | 컬럼 옵션 `visibleFlag` 값 |
| <code>getColumnVisibleState(column)</code> | 5 | <code>boolean</code> | 지금 실제로 보이는지. `visibleFlag` 가 true 여도 접힌 컬럼 그룹 안에 있으면 false |
| <code>getColumnAlwaysVisibleFlag(column)</code> | 3 | <code>boolean</code> | 컬럼 옵션 `alwaysVisibleFlag` 값 |
| <code>getColumnOrGroupVisibleState(columnDef)</code> | 1 | <code>boolean</code> | 컬럼 또는 그룹(하위 중 하나라도 보이면 true). 인자는 컬럼 정의 객체 |

<<< @/../DataGridViewSample/12_header.html#columnActions{js}

## 컬럼 너비

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>setColumnWidth(column, width, options?)</code> | 9 | - | 너비 바꾸기. `width` 는 숫자(px) 또는 `'auto'`. `minWidth` 보다 작으면 `minWidth` 로. `columnWidthChange` 이벤트 발생 |
| <code>setColumnsWidth({ dataIndex: width, ... }, options?)</code> | 2 | - | 여러 컬럼 너비를 한 번에. 이벤트는 한 번(`columnIDs`)만 발생 |
| <code>getColumnWidth(column)</code> | 6 | <code>number &#124; 'auto'</code> | 컬럼 옵션 `width` 값 (설정값) |
| <code>getColumnComputedWidth(column)</code> | - | <code>number</code> | 지금 화면에 그려진 실제 너비(px). `'auto'` 컬럼의 계산된 너비를 알 때 |
| <code>getColumnMinWidth(column)</code> | 3 | <code>number</code> | 컬럼 옵션 `minWidth` 값 |

내용에 맞춰 너비를 자동으로 맞추는 것은 그리드 쪽 함수입니다: `grid.sizeColumnToFit(columnID)`, `grid.sizeAllColumnsToFit()` ([그리드 메서드](/datagridview/api/grid-methods#컬럼)).

## 컬럼 고정과 순서

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>setColumnPinned(column, pinned, options?)</code> | 7 | - | 고정 위치 바꾸기. `pinned` 는 `'left'`, `'right'`, `'unpinned'` |
| <code>getColumnPinned(column)</code> | 2 | <code>string</code> | 지금 고정 위치 |
| <code>moveColumn(column, targetColumn, options?)</code> | 10 | <code>boolean</code> | `column` 을 `targetColumn` 자리로 옮김. 옮겼으면 true. `columnOrderChange` 이벤트 발생 |
| <code>getColumnPosition(columnIndex)</code> | 2 | <code>number</code> | 컬럼의 가로 위치(px) |

`moveColumn` 은 기본으로 원래 자리보다 뒤로 옮길 때는 대상의 뒤, 앞으로 옮길 때는 대상의 앞에 놓습니다. `options.insertBeforeOrAfter` 에 `'before'` 또는 `'after'` 를 주면 직접 정할 수 있습니다. 샘플의 "수량을 품명 앞으로" 버튼이 `moveColumn('qty', 'title', { insertBeforeOrAfter: 'before' })` 입니다.

## 컬럼 설정 바꾸기

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>setColumnOrGroupProperties(key, properties)</code> | 8 | - | 컬럼(또는 그룹)의 여러 설정을 한 번에 바꾸고 그 컬럼만 다시 그림 |
| <code>setColumnTypeRepresentation(column, type)</code> | - | - | 셀 타입 바꾸기 |
| <code>setColumnAutoRowHeightFlag(column, flag)</code> | - | - | 내용에 맞춘 행 높이 자동 켜기 / 끄기 ([행 높이](/datagridview/row-height)) |
| <code>applyColumns()</code> | 10 | - | 컬럼 정의 객체를 직접 고친 뒤 그리드 전체에 다시 반영 |

`setColumnOrGroupProperties` 로 바꿀 수 있는 키:

| 키 | 설명 |
| --- | --- |
| <code>text</code>, <code>icon</code>, <code>showTextFlag</code> | 헤더 글자, 아이콘 (`showTextFlag` 는 `text` 나 `icon` 과 같이 넣을 때만 반영) |
| <code>description</code> | 헤더 툴팁 |
| <code>editableFlag</code>, <code>disabled</code> | 편집 가능, 비활성 |
| <code>alignment</code> | 셀 정렬 |
| <code>width</code>, <code>minWidth</code> | 너비 (`setColumnWidth` 를 거침) |
| <code>pinned</code> | 고정 (`setColumnPinned` 를 거침) |
| <code>visibleFlag</code> | 표시 (`setColumnVisibleFlag` 를 거침) |
| <code>typeRepresentation</code>, <code>autoRowHeightFlag</code> | 셀 타입, 행 높이 자동 |

```js
grid.layout.setColumnOrGroupProperties('qty', { text: '수량 (EA)', editableFlag: true, width: 100 });
```

이 표에 없는 키(컬럼 함수 등)를 바꿀 때는 컬럼 정의 객체를 고친 뒤 `applyColumns()` 를 부릅니다.

```js
var column = grid.layout.getColumnOrGroup('qty');
column.getCellClassName = function (cellInfos) { return 'qty-cell'; };
grid.layout.applyColumns();
```

## options.isUserInteraction

`setColumnVisibleFlag`, `setColumnWidth`, `setColumnsWidth`, `setColumnPinned`, `moveColumn` 의 마지막 인자에 `{ isUserInteraction: true }` 를 주면 사용자가 화면에서 직접 바꾼 것처럼 처리되어, 바뀐 상태가 화면 상태 저장(preferences)에 기록됩니다. 넣지 않으면 화면만 바뀌고 저장되지 않습니다. 저장 기능은 [사용자 뷰와 화면 상태 저장](/datagridview/custom-views) 을 보세요.

## 컬럼 그룹

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>setColumnGroupExpandedFlag(rowID, columnID, flag)</code> | 1 | - | 컬럼 그룹 접기 / 펼치기. `columnGroupExpandedState` 이벤트 발생 |
| <code>getColumnOrGroupCellCoordinates(columnDef)</code> | - | <code>{ rowID, columnID }</code> | 컬럼(또는 그룹) 헤더 칸의 위치 |
| <code>getColumnOrGroupFromCoordinates({ rowID, columnID })</code> | 2 | 컬럼 정의 객체 | 헤더 칸 위치 → 컬럼(또는 그룹) |
| <code>setColumnOrGroupPinned(columnDef, pinned, options?)</code> | 1 | <code>number</code> | 그룹 전체를 고정 |
| <code>getColumnOrGroupPinned(columnDef)</code> | 1 | <code>string &#124; undefined</code> | 그룹의 고정 위치. 하위 컬럼의 고정 위치가 서로 다르면 `undefined` |

<<< @/../DataGridViewSample/12_header.html#groupToggle{js}

`setColumnGroupExpandedFlag` 뒤에 `updateCellView` 로 그룹 헤더 칸을 다시 그리는 이유는 [헤더](/datagridview/header#그룹-접고-펼치기) 에 있습니다. 2단 헤더에서 그룹 헤더 칸의 위치는 `{ rowID: -2, columnID: 그 줄에서의 순번 }` 입니다.

컬럼 그룹을 만드는 방법은 [헤더](/datagridview/header#헤더를-2단으로-묶기-컬럼-그룹) 에 있습니다.

## 셀 번호와 위치

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>getCellIDFromCoordinates({ rowID, columnID })</code> | 14 | <code>number</code> | 행 번호와 컬럼 → cellID. `columnID` 에 dataIndex 문자열도 쓸 수 있음. 헤더 칸은 `rowID` -1 |
| <code>getCellCoordinatesAt(cellID)</code> | 2 | <code>{ rowID, columnID }</code> | cellID → 행 번호, 컬럼 번호 |
| <code>getCellsFromNodeModel(nodeModel, onlyVisible?)</code> | 4 | cellID 배열 | 그 행의 모든 셀. `onlyVisible: true` 면 보이는 컬럼만, 화면 순서대로 |
| <code>getRowPosition(rowID)</code> | 5 | <code>number</code> | 행의 세로 위치(px) |

```js
var cellID = grid.layout.getCellIDFromCoordinates({ rowID: 0, columnID: 'title' });
grid.setActiveCell(cellID);
```

`rowID` 는 지금 화면에 보이는 순서의 행 번호입니다 ([그리드 메서드](/datagridview/api/grid-methods#먼저-알아-둘-것-cellid-와-rowid)).

## 높이

| 함수 | 사용 | 반환 | 설명 |
| --- | --- | --- | --- |
| <code>getRowHeight(rowID)</code> | - | <code>number</code> | 그 행의 지금 높이(px) |
| <code>getDefaultCellHeight()</code> | 1 | <code>number</code> | 밀도에 따른 행 기본 높이. compact 26, comfortable 또는 터치 모드 40 |
| <code>resetRowHeights()</code> | 2 | - | 저장해 둔 행 높이를 모두 버리고 다시 계산. `getRowHeightFunction` 을 바꾼 뒤에 부름 |
| <code>resetRowHeight(rowID)</code> | 1 | - | 행 하나만 다시 계산. 음수를 주면 헤더 줄 |
| <code>getColumnHeaderHeight()</code> | 1 | <code>number</code> | 컬럼 헤더 한 줄의 높이 ([헤더 높이](/datagridview/header#헤더-높이)) |
| <code>getHeaderContainerHeight()</code> | 1 | <code>number</code> | 컬럼 헤더 전체 높이 (2단이면 두 줄 합계). 헤더를 숨겼으면 0 |

## 화면 상태 저장 (preferences)

| 함수 | 사용 | 설명 |
| --- | --- | --- |
| <code>exportPreferencesInJson(options?)</code> / <code>importJsonPreferences(json, options?)</code> | 1 | 화면 상태(너비, 순서, 표시, 고정 등)를 JSON 문자열로 꺼내기 / 다시 넣기. 꺼낼 때 <code>{ onlyCustomViewsFlag }</code>, 넣을 때 <code>{ importOnlyCustomViews, importCurrentCustomViewId }</code> |
| <code>saveColumnSortModelInPreferences()</code> | 5 | 지금 정렬 상태를 화면 상태에 저장 |
| <code>deleteDataGridViewPreferences()</code> | 3 | 저장된 화면 상태 지우기. 2025 에서 `useWidgetPreferencesFlag: true` 면 지워지지 않음 ([주의](/datagridview/custom-views#주의)) |
| <code>checkPresenceOfDataGridViewPreferences()</code> | 0 | 저장된 화면 상태가 있는지 |

형식과 사용 방법은 [사용자 뷰와 화면 상태 저장](/datagridview/custom-views) 에 있습니다.
