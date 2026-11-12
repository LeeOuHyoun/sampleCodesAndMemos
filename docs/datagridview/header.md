# 헤더 (높이, 글자, 2단 헤더) <Badge type="tip" text="로컬 실행 확인" />

컬럼 헤더 줄과 행 머리(왼쪽 번호 칸)에 관한 설정을 한곳에 모았습니다. 헤더 높이, 헤더 숨기기, 헤더 글자와 아이콘, 헤더를 2단으로 묶기, 헤더를 직접 그리기를 다룹니다.

샘플: [12_header.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/12_header.html)

::: info 근거
DataGridView.js 의 DataGridViewLayout (`_applyColumnHeaderHeight`, `getColumnHeaderHeight`, `getHeaderContainerHeight`, `_computeColumnHeadersHeight`, `setColumnOrGroupProperties`, `setColumnGroupExpandedFlag`), ColumnModel (`setColumns`, `_isColumnDisplayedByHierarchy`), DataGridViewColumnHeaderCell (`buildColumnGroupExpander`, `_applyCustomHeader`), DataGridView (`DefaultOnColumnHeaderRequest`, `getCellDefaultTooltip`). 2026 도 같습니다. 호출부: CATFLCockpitWidget, DMUControls (컬럼 그룹), DocumentFiles (customHeader). 샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 헤더의 구역

```
┌──────┬──────────────────────────────┐
│ 모서리 │ 컬럼 헤더 줄 (rowID -1)        │  ← layoutOptions.columnsHeader, columnHeaderHeight
├──────┼──────────────────────────────┤
│ 행    │                              │
│ 머리  │ 데이터 행 (rowID 0, 1, 2 ...)  │
│      │                              │
└──────┴──────────────────────────────┘
   ↑ layoutOptions.rowsHeader (columnID -1)
```

| 구역 | 번호 | 내용 |
| --- | --- | --- |
| 컬럼 헤더 줄 | `rowID` -1 (2단이면 위쪽 줄이 -2) | 컬럼 이름, 정렬 표시, 필터 아이콘 |
| 행 머리 | `columnID` -1 | 행 번호, 선택 체크박스 |
| 모서리 | `rowID`, `columnID` 모두 음수 | 전체 선택 체크박스 |

## 하고 싶은 일로 찾기

| 하고 싶은 일 | 키 | 넣는 자리 |
| --- | --- | --- |
| 헤더 높이 바꾸기 | <code>columnHeaderHeight</code> | `layoutOptions` |
| 컬럼 헤더 줄 숨기기 | <code>columnsHeader: false</code> | `layoutOptions` |
| 행 머리(번호 칸) 숨기기 | <code>rowsHeader: false</code> | `layoutOptions` |
| 행 번호만 숨기기 | <code>showRowIndexFlag: false</code> | 그리드 옵션 |
| 행 머리 배경 없애기 | <code>showRowHeaderBackgroundFlag: false</code> | 그리드 옵션 |
| 헤더 글자 | <code>text</code> | 컬럼 옵션 |
| 헤더 아이콘, 아이콘만 보이기 | <code>icon</code>, <code>showTextFlag: false</code> | 컬럼 옵션 |
| 헤더 툴팁 | <code>description</code> | 컬럼 옵션 |
| 헤더를 2단으로 묶기 | <code>children</code> | 컬럼 옵션 |
| 묶은 컬럼을 접고 펼치기 | <code>expandedFlag</code>, <code>columnGroupShow</code> | 컬럼 옵션 |
| 헤더를 직접 그리기 | <code>customHeader</code> | 컬럼 옵션 |
| 만든 뒤에 헤더 글자 바꾸기 | <code>grid.layout.setColumnOrGroupProperties(...)</code> | [레이아웃 메서드](/datagridview/api/layout-methods) |
| 헤더 체크박스 (전체 선택) | <code>rowSelection</code>, <code>showSelectionCheckBoxesFlag</code> | 그리드 옵션 |
| 헤더 클릭으로 정렬, 필터 아이콘 | <code>sortableFlag</code>, <code>setFilterModel</code> | [정렬과 필터](/datagridview/sort-filter) |
| 헤더 우클릭 메뉴 | <code>onContextualEvent</code> | [우클릭 메뉴와 선택](/datagridview/context-menu) |
| 헤더를 끌어서 컬럼 순서 바꾸기 | <code>columnDragEnabledFlag</code> | 그리드 옵션 |

## 헤더 높이

`layoutOptions.columnHeaderHeight` 에 숫자(px)를 줍니다. 기본값은 27 입니다.

<<< @/../DataGridViewSample/12_header.html#grid{js}

만든 뒤에는 `grid.layout` 에 넣습니다.

<<< @/../DataGridViewSample/12_header.html#height{js}

| 조건 | 실제 헤더 줄 높이 |
| --- | --- |
| 기본 | 27px |
| 27 보다 작은 값을 줌 | 27px (27 로 되돌림) |
| 터치 모드 | `columnHeaderHeight` 와 41 중 큰 값 |
| 2단 헤더 (`children`) | 줄마다 `columnHeaderHeight`. 전체 높이 = 단 수 × `columnHeaderHeight` (27 이면 54, 40 이면 80) |
| `customHeader` 컬럼이 있음 | 맨 아래 헤더 줄은 `columnHeaderHeight` 를 따르지 않고, 행 기본 높이(`cellHeight`)와 직접 그린 내용 높이 중 큰 값이 됩니다. 2단 헤더의 위쪽 줄은 그대로 `columnHeaderHeight` (40 을 주면 40 + 26 = 66) |

- 행 높이 설정(`cellHeight`, `layoutDensity`)은 헤더 높이에 영향을 주지 않습니다. `layoutDensity: 'comfortable'` 로 행이 40px 이 되어도 헤더는 27px 그대로이므로, 헤더도 키우려면 `columnHeaderHeight` 를 같이 줍니다.
- 그리드 옵션 `maxVisibleRowCount` 로 그리드 높이를 자동 계산할 때 헤더 높이가 포함됩니다 (행 26px 3개 + 2단 헤더 54px = 132px).
- 지금 높이는 `grid.layout.getColumnHeaderHeight()` (헤더 한 줄), `grid.layout.getHeaderContainerHeight()` (헤더 전체) 로 읽습니다.

::: warning layoutOptions 밖에 쓰면 적용되지 않습니다
`new DataGridView({ columnHeaderHeight: 40 })` 처럼 설정 객체 최상위에 쓰면 무시됩니다. 반드시 `layoutOptions: { ... }` 안에 넣습니다. [행 높이](/datagridview/row-height) 의 `cellHeight` 도 같습니다.
:::

## 헤더 숨기기

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  layoutOptions: { columnsHeader: false, rowsHeader: false }
});
```

만든 뒤에 바꿀 때는 `grid.layout` (헤더 줄, 행 머리) 과 그리드 (행 번호) 에 넣습니다.

<<< @/../DataGridViewSample/12_header.html#hide{js}

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>columnsHeader</code> | <code>true</code> | `false` 면 컬럼 헤더 줄 전체를 숨깁니다 (`getHeaderContainerHeight()` 가 0). 헤더 클릭 정렬, 헤더 우클릭 메뉴도 쓸 수 없게 됩니다 |
| <code>rowsHeader</code> | <code>true</code> | `false` 면 행 머리(번호, 체크박스 칸)를 숨깁니다 |

행 머리는 두고 번호만 숨기려면 그리드 옵션 `showRowIndexFlag: false` 를, 체크박스만 숨기려면 `showSelectionCheckBoxesFlag: false` 를 씁니다.

## 헤더 글자, 아이콘, 툴팁

<<< @/../DataGridViewSample/12_header.html#text{js}

| 컬럼 옵션 | 설명 |
| --- | --- |
| <code>text</code> | 헤더 글자 |
| <code>icon</code> | 헤더 아이콘. `'아이콘명'` 또는 `{ iconName, fontIconFamily }` |
| <code>showTextFlag</code> | `false` 면 글자를 숨기고 아이콘만 보입니다 |
| <code>description</code> | 헤더에 마우스를 올렸을 때 나오는 툴팁 |

헤더 툴팁은 아래 순서로 정해집니다.

1. `description` 이 있으면 그 글자
2. `showTextFlag: false` 이고 `icon` 이 있으면 `text`
3. 둘 다 아니면, 헤더 글자가 잘려 보일 때만 전체 글자

### 만든 뒤에 헤더 글자 바꾸기

컬럼 정의 객체를 직접 고치지 말고 `setColumnOrGroupProperties` 를 씁니다. 바꾼 헤더 칸만 다시 그립니다.

<<< @/../DataGridViewSample/12_header.html#rename{js}

바꿀 수 있는 키는 [레이아웃 메서드](/datagridview/api/layout-methods#컬럼-설정-바꾸기) 에 있습니다.

## 헤더를 2단으로 묶기 (컬럼 그룹)

컬럼 객체에 `children` 을 넣으면 그 컬럼은 그룹 헤더가 되고, `children` 의 컬럼들이 그 아래 줄에 놓입니다.

```js
var columns = [
  { text: '품번', dataIndex: 'tree' },
  {
    text: '치수',
    dataIndex: 'sizeGroup',
    children: [
      { text: '가로', dataIndex: 'width' },
      { text: '세로', dataIndex: 'height' },
      { text: '두께', dataIndex: 'depth' }
    ]
  }
];
```

- 값을 보여 주는 것은 맨 아래 줄 컬럼뿐입니다. 맨 아래 줄 컬럼에는 `dataIndex` 가 꼭 있어야 합니다 (없으면 콘솔에 경고가 나옵니다).
- 그룹의 `dataIndex` 는 값과 연결되지 않습니다. `grid.getColumnOrGroup('sizeGroup')` 처럼 나중에 그룹을 찾을 때 쓰는 이름입니다.
- `children` 안에 다시 `children` 을 넣어 3단 이상으로 만들 수 있습니다.
- 헤더 줄 번호는 맨 아래 줄이 `rowID` -1, 그 위가 -2 입니다.

### 그룹 접고 펼치기

그룹에 `expandedFlag` 를 주면 그룹 헤더에 펼침 버튼이 생깁니다. 하위 컬럼마다 `columnGroupShow` 로 언제 보일지 정합니다.

<<< @/../DataGridViewSample/12_header.html#group{js}

| 키 | 넣는 곳 | 값 | 설명 |
| --- | --- | --- | --- |
| <code>expandedFlag</code> | 그룹 | <code>true &#124; false</code> | 처음에 펼쳐 둘지. 넣지 않으면 펼침 버튼이 없습니다 |
| <code>columnGroupShow</code> | 하위 컬럼 | <code>'open' &#124; 'closed'</code> | `'open'` = 펼쳤을 때만 보임, `'closed'` = 접었을 때만 보임. 넣지 않으면 항상 보임 |
| <code>splittableFlag</code> | 그룹 | <code>true &#124; false</code> | `false` 면 사용자가 헤더를 끌어 순서를 바꿀 때 그룹이 쪼개지지 않습니다 (하위 컬럼이 그룹 밖으로 나가거나 다른 컬럼이 그룹 사이로 끼어들 수 없음) |

- 하위 컬럼이 모두 같은 종류(전부 `'open'` 이거나 전부 항상 보임)이면 접어도 달라질 것이 없으므로 펼침 버튼이 숨겨집니다.
- 사용자가 접거나 펼치면 `columnGroupExpandedState` 이벤트가 발생합니다 ([이벤트](/datagridview/api/events)).
- 코드로 접고 펼치려면 `grid.layout.setColumnGroupExpandedFlag(rowID, columnID, true)` 를 씁니다. `rowID`, `columnID` 는 그룹 헤더 칸의 위치입니다 ([레이아웃 메서드](/datagridview/api/layout-methods#컬럼-그룹)).

<<< @/../DataGridViewSample/12_header.html#groupToggle{js}

::: warning 코드로 접고 펼친 뒤에는 그룹 헤더 칸을 다시 그립니다
`setColumnGroupExpandedFlag` 는 컬럼은 바로 접고 펼치지만, 그룹 헤더의 펼침 버튼 모양(`expanded` 속성)은 바꾸지 않습니다. 그대로 두면 버튼 모양이 실제 상태와 반대로 남아서 사용자가 버튼을 두 번 눌러야 합니다. 위처럼 `grid.updateCellView(그룹 헤더 칸의 cellID, { updateCellContent: true })` 로 그 칸을 다시 그립니다.
:::

## 헤더 체크박스

| 체크박스 | 나타나는 조건 | 동작 |
| --- | --- | --- |
| 모서리 칸 (전체 선택) | `rowSelection` 이 `'none'` 이 아니고 행 머리와 컬럼 헤더 줄이 모두 보임 | 전체 행 선택 / 해제. 일부만 선택되면 중간 상태. 행이 없으면 비활성 |
| 컬럼 헤더 칸 | `columnSelection` 이 `'none'` 이 아님 (만든 뒤 `grid.columnSelection = 'multiple'` 로 바꿔도 나타남) | 그 컬럼 전체 선택 |

컬럼 헤더 칸의 체크박스는 기본으로 헤더 글자 오른쪽에 놓입니다. 그리드 옵션 `columnHeadersLayout: 1` 을 주면 글자 왼쪽에 놓입니다.

## 헤더를 직접 그리기 (customHeader)

컬럼 옵션 `customHeader` 에 함수를 넣으면 그 컬럼의 헤더 칸을 직접 만든 DOM 으로 그립니다. 필수 입력 표시(`*`)처럼 글자와 아이콘만으로 안 되는 헤더에 씁니다.

```js
var columns = [
  { text: '품번', dataIndex: 'tree' },
  {
    text: '비고',
    dataIndex: 'note',
    editableFlag: true,
    customHeader: {
      buildContent: function (cellInfos) {
        var box = document.createElement('div');
        var label = document.createElement('span');
        var mark = document.createElement('span');
        label.textContent = '비고';
        mark.textContent = ' *';
        mark.style.color = 'red';
        box.appendChild(label);
        box.appendChild(mark);
        return box;
      }
    }
  }
];
```

| 함수 | 필수 | 인자 → 반환 | 설명 |
| --- | --- | --- | --- |
| <code>buildContent</code> | 필수 | `(cellInfos)` → DOM 요소 | 헤더 칸에 넣을 내용을 만들어 돌려줍니다. 없으면 오류가 납니다 |
| <code>updateContent</code> | 선택 | `(content, { sortModel, filterModel })` | 헤더를 다시 그릴 때마다 호출됩니다. `content` 는 `buildContent` 가 돌려준 요소입니다. 정렬, 필터 상태에 따라 모양을 바꿀 때 씁니다 |
| <code>getSortIconContainer</code> | 선택 | `(content)` → DOM 요소 | 정렬 아이콘을 넣을 자리 |
| <code>getFilterViewContainer</code> | 선택 | `(content)` → DOM 요소 | 필터 아이콘을 넣을 자리 |
| <code>getSelectionCheckBoxContainer</code> | 선택 | `(content)` → DOM 요소 | 컬럼 선택 체크박스를 넣을 자리 |

- 맨 아래 줄 헤더(`rowID` -1)에만 적용됩니다. 그룹 헤더에는 적용되지 않습니다.
- `text` 도 같이 넣어 둡니다 (원본 호출부도 그렇게 씁니다). 헤더 밖에서 컬럼 이름이 필요한 곳에 쓰입니다. <Badge type="danger" text="검증 필요" />
- `customHeader` 컬럼이 하나라도 있으면 맨 아래 헤더 줄 높이가 내용 높이에 맞춰 자동으로 정해집니다 ([헤더 높이](#헤더-높이) 표).
- 자리 함수(`get...Container`)를 넣지 않은 아이콘은 기본 자리(헤더 칸 오른쪽)에 놓입니다.
- 헤더 칸에는 CSS 클래스 `wux-datagridview-custom-column-header` 가 붙습니다.
- 만든 뒤에 붙이거나 떼려면 컬럼 정의의 `customHeader` 를 바꾸고 `grid.layout.applyColumns()` 를 부릅니다. 샘플의 "비고 헤더 직접 그리기" 체크박스가 이 방식입니다.

<<< @/../DataGridViewSample/12_header.html#customToggle{js}

::: warning getRowHeightFunction 을 같이 쓸 때
`layoutOptions.getRowHeightFunction` 을 직접 넣었고 `customHeader` 컬럼이 있으면, 이 함수가 헤더 줄에도 `rowID` -1 로 호출됩니다 (샘플에서 48 을 돌려주면 헤더 줄이 48px 이 되는 것을 확인했습니다). 헤더 줄은 `undefined` 를 돌려주어 기본 높이를 쓰게 하거나 원하는 높이를 돌려줍니다.

```js
getRowHeightFunction: function (rowID) {
  if (rowID < 0) { return 48; }
  return undefined;
}
```
:::

## 같이 보기

- 행 높이 → [행 높이](/datagridview/row-height)
- 컬럼 너비, 고정, 숨기기를 코드로 바꾸기 → [레이아웃 메서드](/datagridview/api/layout-methods)
- 헤더 클릭 정렬, 필터 아이콘 → [정렬과 필터](/datagridview/sort-filter)
- 헤더 우클릭 메뉴 항목 → [우클릭 메뉴와 선택](/datagridview/context-menu#그리드-기본-메뉴-쓰기)
- 컬럼 옵션 전체 → [컬럼 옵션](/datagridview/api/column-options)
- 컬럼이 바뀔 때 받는 이벤트 (`columnGroupExpandedState`, `columnWidthChange` 등) → [이벤트](/datagridview/api/events)
