# 드래그앤드롭 <Badge type="tip" text="로컬 실행 확인" />

그리드 안에서 행을 끌어 순서를 바꾸거나, 행을 밖으로 끌어 내거나, 밖에서 끌어 온 것을 그리드에 놓는 방법입니다. 위젯 사이에서 주고받는 데이터 형식(3DXContent)은 [끌어 놓기](/events/drag-and-drop) 에 있고, 이 페이지는 그리드의 옵션과 콜백만 다룹니다.

샘플: [11_dragDrop.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/11_dragDrop.html)

::: info 근거
DataGridView.js 의 `_manageDragAndDrop` / `_processDragAndDropCallbacks` (콜백 호출 순서, cellInfos 에 붙는 값), `onDragStartCellDefault` / `onDragOverCellDefault` / `onDropCellDefault` 같은 `on...Default` 기본 동작 함수, `_serializeDragAndDropEvent`, `getRowReorderEnabledState` / `enableRowReordering` / `disableRowReordering`, `getDraggedRowData` / `getDraggedColumnData`, `getCellAttributesAt` (draggable 속성), DataGridViewRowHeaderCell.buildDragGrip, 사용자 뷰 대화상자의 `onDropCell`. CollectionView.js 의 `addEventListener` (cellInfos), `groupRows` (그룹핑 중 순서 바꾸기 끄기). TreeModel.js 의 `moveNodes`, TreeDocument 옵션 `shouldAcceptDrag` / `shouldAcceptDrop`, `onUpdate`. Core/wux.css 의 `.wux-datagridview-drag-row-feedback`, `.wux-datagridview-drag-grip`. 호출부: ENXMeetingMgmt, ENORouteMgmt, IssueManagement, IssueComponents, FolderEditor, SpecTreeDGV. 샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 무엇을 켜야 하나

| 하고 싶은 일 | 넣을 것 | 예제 |
| --- | --- | --- |
| 행을 끌어서 순서 바꾸기 | <code>rowDragEnabledFlag: true</code> | [예제 1](#예제-1-행-순서-바꾸기) |
| 셀을 잡고 끌어도 순서 바꾸기 | <code>rowDragEnabledFlag: true</code> + <code>cellDragEnabledFlag: true</code> | [예제 1](#예제-1-행-순서-바꾸기) |
| 순서가 바뀐 뒤 저장하기 | <code>onDragEndRowHeader</code> / <code>onDragEndCell</code> | [예제 2](#예제-2-순서가-바뀐-뒤-저장하기) |
| 다른 행의 하위로 옮기기 (부모 바꾸기) | 순서 바꾸기와 같음. 허용 범위는 TreeDocument 의 <code>shouldAcceptDrop</code> | [예제 3](#예제-3-다른-행의-하위로-옮기기) |
| 옮기는 처리를 직접 하기 | <code>onDropCell</code> / <code>onDropRowHeader</code> 에서 처리하고 <code>false</code> 반환 | [예제 4](#예제-4-옮기는-처리를-직접-하기) |
| 밖에서 끌어 온 객체 받기 | 옵션은 필요 없음. <code>onDragOverCell</code> 과 <code>onDropCell</code> (빈 곳은 <code>...Blank</code>) | [예제 5](#예제-5-밖에서-끌어-온-객체-받기) |
| 그리드 행을 밖으로 끌어 내기 | <code>cellDragEnabledFlag: true</code> + <code>onDragStartCell</code> | [예제 6](#예제-6-그리드-행을-밖으로-끌어-내기) |
| 특정 행은 못 끌게 하기 | TreeDocument 의 <code>shouldAcceptDrag</code> | [예제 7](#예제-7-특정-행은-못-끌게-하기) |
| 컬럼 순서 바꾸기 막기 | <code>columnDragEnabledFlag: false</code> | - |

### 옵션 네 개와 잡는 곳

괄호 안은 DataGridView 를 쓰는 앱 파일 119개 중 그 이름이 나오는 파일 수입니다.

| 키 | 기본값 | 잡고 끄는 곳 | 켜면 |
| --- | --- | --- | --- |
| <code>rowDragEnabledFlag</code> (30) | <code>false</code> | 행 머리의 손잡이 아이콘 | 마우스를 올리면 행 머리에 손잡이(<code>.wux-datagridview-drag-grip</code>)가 보이고, 이것을 잡고 끌 수 있다. 터치 모드에서는 항상 보인다. <code>layoutOptions.rowsHeader</code> (기본 <code>true</code>)가 켜져 있어야 한다 |
| <code>cellDragEnabledFlag</code> (42) | <code>false</code> | 셀 | 데이터 셀과 그 안의 셀 내용에 <code>draggable</code> 이 붙는다. 편집 중인 셀은 빠진다 |
| <code>columnDragEnabledFlag</code> (14) | <code>true</code> | 컬럼 헤더 | 헤더를 끌어 컬럼 순서를 바꾼다. 그룹핑 영역에 놓으면 그 컬럼으로 묶는다 |
| <code>rowReorderEnabledFlag</code> (9) | <code>true</code> | 없음 | 끌어 온 행을 그리드가 직접 옮겨 주는 기본 동작을 허용한다. 끄는 기능 자체는 켜지 않는다 |

`rowReorderEnabledFlag` 는 혼자서는 아무 일도 하지 않습니다. 행 순서 바꾸기는 아래 세 가지가 모두 맞을 때만 동작합니다 (`grid.getRowReorderEnabledState()` 가 이 값을 돌려줍니다).

1. `rowDragEnabledFlag` 가 `true`
2. `rowReorderEnabledFlag` 가 `true` (기본값)
3. `disableRowReordering()` 으로 꺼 둔 상태가 아님 (그룹핑 중에는 그리드가 스스로 꺼 둡니다)

`rowDragEnabledFlag`, `rowReorderEnabledFlag` 는 만든 뒤에 `grid.rowDragEnabledFlag = false` 처럼 바꿔도 바로 적용됩니다. `disableRowReordering()` 을 두 번 부르면 `enableRowReordering()` 도 두 번 불러야 다시 켜집니다.

`cellDragEnabledFlag` 는 그리드를 만들 때 정합니다. 이 옵션이 바뀔 때 부르는 함수(`_applyCellDragEnabledFlag`)가 비어 있어서, 만든 뒤 `false` 로 바꿔도 이미 그려진 셀 내용에 붙은 `draggable` 이 남아 셀이 계속 끌립니다.

## 어디에 넣나

```js{5-6,8-10,13-15,17-19}
var grid = new DataGridView({
  treeDocument: treeDocument,
  columns: columns,

  rowDragEnabledFlag: true,
  cellDragEnabledFlag: true,

  onDragStartRowHeader: function (event, cellInfos) {
    return true;
  }
});

grid.onDropRowHeader = function (event, cellInfos) {
  return true;
};

treeDocument.options.shouldAcceptDrop = function (info) {
  return info.dropPosition !== 'middle';
};
```

1. **그리드 옵션** : 설정 객체 최상위에 켜고 끄는 옵션 네 개를 넣습니다.
2. **콜백** : 콜백 28개도 그리드 옵션입니다. 설정 객체에 넣어도 되고, 만든 뒤에 `grid.onDropRowHeader = fn` 으로 넣어도 됩니다.
3. **TreeDocument 옵션** : 끌어도 되는 행(`shouldAcceptDrag`), 놓아도 되는 자리(`shouldAcceptDrop`)는 그리드가 아니라 데이터 쪽에 넣습니다. `new TreeDocument({ shouldAcceptDrop: fn })` 로 넣거나 위처럼 `treeDocument.options` 에 넣습니다.

## 콜백

### 이름과 호출 시점

콜백 이름은 `on` + 단계 + 대상입니다 (7 단계 × 4 대상 = 28개). 이름 전체와 사용 파일 수는 [그리드 옵션](/datagridview/api/grid-options#드래그앤드롭-콜백-이름) 에 있습니다.

| 단계 | 브라우저 이벤트 | 언제 |
| --- | --- | --- |
| <code>DragStart</code> | dragstart | 끌기 시작할 때 한 번 |
| <code>Drag</code> | drag | 끄는 동안 계속 (끌기 시작한 곳 기준) |
| <code>DragEnter</code> / <code>DragOver</code> / <code>DragLeave</code> | dragenter / dragover / dragleave | 다른 곳 위에 들어올 때 / 위에 있는 동안 계속 / 나갈 때 |
| <code>Drop</code> | drop | 놓을 때 |
| <code>DragEnd</code> | dragend | 끌기가 끝날 때 (끌기 시작한 곳 기준, 놓기가 취소되어도 불림) |

| 대상 | 뜻 | 판단 기준 |
| --- | --- | --- |
| <code>RowHeader</code> | 행 머리 | <code>columnID === -1</code> |
| <code>ColumnHeader</code> | 컬럼 헤더 | <code>rowID</code> 가 -1 이하 |
| <code>Cell</code> | 데이터 셀 | 그 밖의 셀 |
| <code>Blank</code> | 빈 영역 | 마우스 아래에 셀이 없음 |

행 머리에 놓으면 `onDropRowHeader`, 셀에 놓으면 `onDropCell` 이 불립니다. 행 전체에서 받으려면 두 콜백에 같은 함수를 넣습니다.

### 콜백이 받는 인자

모든 콜백은 `function (event, cellInfos)` 형태이고, 콜백 안의 `this` 는 그리드입니다. `event` 는 브라우저의 드래그 이벤트 그대로라서 `event.dataTransfer`, `event.preventDefault()` 를 씁니다.

`cellInfos` 는 마우스 아래 셀의 정보에 드래그 정보가 붙은 객체입니다.

| 키 | 값 | 들어 있는 때 |
| --- | --- | --- |
| <code>cellID</code>, <code>rowID</code>, <code>columnID</code> | 셀 위치 | <code>Blank</code> 가 아닐 때 |
| <code>nodeModel</code> | 그 행의 TreeNodeModel | 데이터 행일 때 (헤더에서는 <code>undefined</code>) |
| <code>cellModel</code>, <code>cellView</code> | 셀 값, 셀 화면 객체 | <code>Blank</code> 가 아닐 때 |
| <code>draggedNodes</code> | 끌고 있는 행(TreeNodeModel) 배열 | 같은 창의 그리드에서 행을 끌고 있을 때 (<code>DragStart</code> ~ <code>DragEnd</code>). <code>Drop</code> 에는 없음 |
| <code>dropPosition</code> | <code>'top' &#124; 'middle' &#124; 'bottom'</code> | <code>DragEnter</code>, <code>DragOver</code>, <code>DragLeave</code>, <code>Drop</code>. 셀 위가 아니면 <code>undefined</code> |
| <code>droppedNodes</code> | 놓인 행(TreeNodeModel) 배열 | <code>Drop</code> 이고, 끌기 시작한 그리드와 놓은 그리드가 같을 때만 |

- `Blank` 콜백의 `cellInfos` 는 셀 정보가 없는 객체입니다. `cellInfos.nodeModel` 은 `undefined` 입니다 (`onDropBlank` 에서 키는 값이 `undefined` 인 `dropPosition` 하나뿐).
- `DragEnd` 의 `cellInfos.nodeModel` 은 끌기 시작한 자리에 **지금 그려진 행**입니다. 행이 옮겨진 뒤라 끈 행과 다른 행일 수 있으므로 끈 행은 `cellInfos.draggedNodes` 로 읽습니다.
- `draggedNodes` 는 그리드 사이에서도 보이지만 같은 창(같은 iframe) 안에서만입니다. 다른 위젯에서 끌어 온 것은 `event.dataTransfer` 로만 알 수 있습니다.
- `cellInfos.dropPosition` 은 콜백에서 바꿀 수 있습니다. 바꾼 값을 기본 동작이 그대로 씁니다 (IssueManagement, FolderEditor 가 `'middle'` 로 고정하는 데 사용).

### 반환값

그리드는 콜백을 먼저 부르고, **콜백이 참인 값을 돌려줄 때만** 이어서 기본 동작을 실행합니다.

| 콜백 | 기본 동작 |
| --- | --- |
| 넣지 않음 | 실행 |
| <code>return true</code> | 콜백 다음에 실행 |
| <code>return false</code> 또는 <code>return</code> 없음 | 건너뜀 |

콜백이 불리는 시점에는 기본 동작이 아직 실행되기 전입니다. 예를 들어 `onDropRowHeader` 안에서는 행이 아직 옮겨지지 않았습니다.

순서 바꾸기에서 각 콜백이 참이 아닌 값을 돌려주면 이렇게 됩니다 (셀을 끌어 확인).

| 콜백 | 결과 |
| --- | --- |
| <code>onDragStartCell</code> | 행 정보가 <code>dataTransfer</code> 에 들어가지 않아, 놓기는 되지만 행이 옮겨지지 않음 |
| <code>onDragOverCell</code> | 놓기가 허용되지 않아 <code>onDropCell</code> 이 불리지 않음 |
| <code>onDropCell</code> | 행이 옮겨지지 않음. <code>onDragEndCell</code> 은 그대로 불림 |

### 콜백을 넣지 않았을 때의 기본 동작

"순서 바꾸기 켜짐" 은 위의 세 조건이 모두 맞는 상태입니다.

| 대상 | 단계 | 기본 동작 |
| --- | --- | --- |
| 행 머리 | <code>DragStart</code> | <code>rowDragEnabledFlag</code> 가 켜져 있으면 행 정보를 <code>dataTransfer</code> 에 넣고, 끄는 그림을 그 행의 트리 컬럼 셀로 바꿈 |
| 셀 | <code>DragStart</code> | 순서 바꾸기가 켜져 있으면 행 정보를 <code>dataTransfer</code> 에 넣음. 꺼져 있으면 아무것도 넣지 않음 |
| 행 머리, 셀 | <code>DragOver</code> | 순서 바꾸기가 켜져 있고 행을 끌고 있으면 <code>shouldAcceptDrop</code> 에 묻고, 위치 표시를 그리고, 허용이면 <code>event.preventDefault()</code> |
| 셀 | <code>DragOver</code> | 순서 바꾸기가 꺼져 있고 콜백이 이미 <code>event.preventDefault()</code> 를 불렀으면 그 행을 파란 테두리로 표시 |
| 행 머리, 셀 | <code>DragLeave</code> | 위치 표시를 숨김 |
| 행 머리, 셀 | <code>Drop</code> | 순서 바꾸기가 켜져 있고 같은 그리드에서 끌어 온 행이면 행을 옮김 |
| 컬럼 헤더 | <code>DragStart</code> ~ <code>DragEnd</code> | <code>columnDragEnabledFlag</code> 가 켜져 있으면 끄는 동안 컬럼 순서를 바꿈. 고정(pinned) 영역을 넘어가면 고정 상태도 바뀜 |
| 빈 영역 | <code>DragOver</code> | 그리드 테두리를 파랗게 표시 (컬럼을 끌고 있을 때는 제외) |
| 빈 영역 | <code>DragLeave</code>, <code>Drop</code> | 테두리 표시를 지움 |

끌기 시작할 때는 콜백보다 먼저 그리드가 아래 일을 합니다.

1. TreeDocument 의 `shouldAcceptDrag(nodeModel)` 이 `false` 면 끌기를 취소합니다. 이때는 콜백도 불리지 않습니다.
2. 끄는 행이 선택되어 있지 않으면 그 행만 선택합니다 (다른 행의 선택은 풀림). `rowSelection` 이 `'none'` 이면 선택하지 않습니다.
3. 선택된 행 전체를 `rowID` 순서로 정렬해 `cellInfos.draggedNodes` 에 넣습니다. 선택된 행이 없으면 끄는 행 하나만 넣습니다.

그래서 **여러 행을 선택한 뒤 그중 하나를 끌면 선택한 행이 모두 따라옵니다.** 선택하지 않은 행을 끌면 그 행 하나만 끌립니다.

## 놓을 위치 표시

끄는 동안 그리드는 마우스가 행의 어디에 있는지를 `cellInfos.dropPosition` 으로 알려 줍니다.

| 값 | 마우스 위치 | 기본 이동의 뜻 |
| --- | --- | --- |
| <code>'top'</code> | 행 높이의 위 1/3 | 그 행 **앞**에 넣음 (같은 부모 아래) |
| <code>'middle'</code> | 가운데 1/3 | 그 행의 **하위**로 넣음 |
| <code>'bottom'</code> | 아래 1/3 | 그 행 **뒤**에 넣음 (같은 부모 아래) |

끌고 있는 행이 대상 행 자신이거나 그 조상이면, 또는 `shouldAcceptDrop` 이 `'middle'` 을 거절하면 `'middle'` 구간이 없어지고 위 절반이 `'top'`, 아래 절반이 `'bottom'` 이 됩니다.

화면 표시는 그리드 안에 만들어지는 요소 하나입니다.

| 클래스 | 모양 |
| --- | --- |
| <code>.wux-datagridview-drag-row-feedback</code> | <code>'top'</code>, <code>'bottom'</code> 은 2px 가로선, <code>'middle'</code> 은 행 전체를 두르는 1px 테두리 |
| <code>.wux-datagridview-drag-row-feedback-chip</code> | 가로선 위의 작은 원. 트리 컬럼의 들여쓰기 위치를 가리킴. <code>'middle'</code> 이거나 트리 컬럼이 없으면 숨김 |

색은 허용이면 파랑(`#368ec4`), 거절이면 어두운 빨강(`#844138`)입니다. 주황(`#E87B00`)은 비동기로 판단하는 TreeDocument 에서 답을 기다리는 동안에만 쓰이며, 기본 TreeDocument 는 비동기가 아닙니다.

위치 표시를 직접 그리는 공개 함수는 없습니다. 밖에서 끌어 온 것을 받을 때는 `onDragOverCell` 에서 `event.preventDefault()` 를 부르고 `true` 를 돌려주면 그 행에 파란 테두리가 그려집니다 ([예제 5](#예제-5-밖에서-끌어-온-객체-받기)). ENORouteMgmt 는 그 대신 `cellInfos.nodeModel.highlight()` / `unhighlight()` 로 행을 강조합니다.

## 행 순서 바꾸기

### 옮겨지는 방식

순서 바꾸기가 켜진 상태에서 행을 놓으면 그리드가 TreeDocument 를 직접 고칩니다.

1. 끌어 온 행들을 원래 부모에서 떼어 냅니다 (선택 상태는 유지).
2. `'middle'` 이면 대상 행의 하위 맨 뒤에 붙입니다. 대상 행에 하위 행이 없었으면 펼칩니다.
3. `'top'`, `'bottom'` 이면 대상 행의 부모 아래, 대상 행의 앞이나 뒤에 넣습니다.
4. `grid.sortModel` 을 `[]` 로 비우고 화면을 다시 그립니다. 옮긴 행은 잠깐 깜빡이며 화면에 보이도록 스크롤됩니다.

대상 행의 부모가 다르면 부모도 바뀝니다. 즉 **트리에서 다른 부모로 옮기는 이동이 기본으로 됩니다.** 막으려면 `shouldAcceptDrop` 을 씁니다.

### 놓아도 되는 자리 정하기 (shouldAcceptDrop)

TreeDocument 옵션 `shouldAcceptDrop(info)` 이 `false` 를 돌려주면 그 자리는 거절됩니다. 기본 함수는 항상 `true` 를 돌려줍니다. 끄는 동안 마우스가 움직일 때마다 불리므로 가볍게 만듭니다.

| <code>info</code> 의 키 | 값 |
| --- | --- |
| <code>dropNode</code> | 마우스 아래의 대상 행 |
| <code>dropPosition</code> | <code>'top' &#124; 'middle' &#124; 'bottom'</code> |
| <code>parentTreeNodeModel</code> | 옮긴 뒤의 부모. <code>'middle'</code> 이면 대상 행, 아니면 대상 행의 부모 |
| <code>draggedNodes</code> | 끌고 있는 행 전체 |
| <code>draggedTreeNodeModel</code> | 그중 지금 검사하는 행 하나 (끄는 행마다 한 번씩 불림) |

`shouldAcceptDrag(nodeModel)` 은 끌기 시작할 때 한 번 불리고, `false` 면 그 행은 끌리지 않습니다.

### 켜고 끄는 함수

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getRowReorderEnabledState()</code> | <code>boolean</code> | 지금 순서 바꾸기가 되는 상태인지 (세 조건을 모두 확인) |
| <code>disableRowReordering()</code> | - | 순서 바꾸기를 잠시 끔. 부른 횟수를 셈 |
| <code>enableRowReordering()</code> | - | 끈 횟수를 하나 줄임. <code>disableRowReordering()</code> 을 부른 만큼 불러야 다시 켜짐 |

앱 파일에서 이 세 함수를 부르는 곳은 없습니다 (0). 그리드가 그룹핑을 걸 때 `disableRowReordering()`, 풀 때 `enableRowReordering()` 을 스스로 부릅니다.

### 정렬, 그룹핑, 필터와 같이 쓸 때

| 상태 | 동작 |
| --- | --- |
| 정렬 | 행을 옮기면 <code>sortModel</code> 이 <code>[]</code> 로 비워져 정렬이 풀림 |
| 그룹핑 | 그룹핑이 걸려 있는 동안 순서 바꾸기가 꺼짐. 그룹핑을 풀면 다시 켜짐 |
| 필터 | 필터가 걸려 있어도 순서 바꾸기는 꺼지지 않음. 숨겨진 행까지 포함한 데이터에서 대상 행의 앞이나 뒤에 들어가고, 필터는 그대로 걸려 있음 |

그리드의 정렬은 화면만이 아니라 TreeDocument 의 행 순서 자체를 정렬된 순서로 바꿉니다 (하위 행도 각 부모 안에서 정렬됨). 그래서 정렬된 화면에서 옮기면 **놓을 때 본 순서에서 그 행만 옮긴 순서**가 그대로 남고, 정렬 표시(`sortModel`)만 풀립니다. 정렬하기 전의 원래 순서로는 돌아가지 않습니다.

- 헤더를 눌러 오름차순 → 내림차순 → 정렬 없음으로 돌리면 그리드가 정렬 전 순서를 기억했다가 되돌립니다. 정렬 중에 행을 옮긴 뒤 다시 헤더로 정렬을 걸고 풀면, 옮긴 뒤의 순서로 돌아옵니다.
- 코드에서 `grid.sortModel = []` 로 정렬을 풀면 정렬 전 순서로 돌아가지 않고 정렬된 순서가 남습니다.

### 순서가 바뀐 것을 알기

행을 옮긴 뒤에 나는 그리드 전용 이벤트는 없습니다. 아래 방법 중 하나를 씁니다.

| 방법 | 설명 |
| --- | --- |
| <code>onDragEndRowHeader</code> / <code>onDragEndCell</code> | <code>Drop</code> 다음에 불리므로 이때는 행이 이미 옮겨져 있음. FolderEditor 가 이 시점에 새 순서를 저장 ([예제 2](#예제-2-순서가-바뀐-뒤-저장하기)) |
| <code>treeDocument.onUpdate(fn)</code> | 옮긴 뒤 <code>pushUpdate</code> 때 불림. 한 번 옮길 때 여러 번 불리고(실행에서 3번), 다른 갱신에도 불리며, 이동이라는 표시(<code>updateType</code>)는 따로 없음 |
| <code>onDropRowHeader</code> / <code>onDropCell</code> | 놓는 순간을 알 수 있지만 **행이 옮겨지기 전**. ENXMeetingMgmt 는 여기서 "순서 바뀜" 알림을 내보내고 <code>true</code> 를 돌려줌 |

## 끄는 데이터 읽기

### 그리드가 dataTransfer 에 넣는 것

기본 동작은 `event.dataTransfer` 의 `text` 형식에 JSON 문자열을 넣습니다. 콜백이 먼저 `text` 에 JSON 을 넣어 두었으면 그 JSON 에 아래 내용을 합칩니다. 그래서 콜백에서 3DXContent 를 넣고 `true` 를 돌려주면 한 문자열에 둘 다 들어갑니다.

```json
{
  "source": { "uuid": "<그리드 고유 id>", "amd": "DS/DataGridView/DataGridView" },
  "data": {
    "DataGridView_Row_Options": {
      "dswebux/x-datagridview.rows+json": [101, 102],
      "dswebux/x-datagridview.row+number": 101,
      "dswebux/x-datagridview.row.options.label+json": "PRT-0001",
      "dswebux/x-datagridview.row.options.icons+json": [],
      "dswebux/x-datagridview.row.options.grid+json": { "name": "브라켓" },
      "dswebux/x-datagridview.row.id+json": 0
    }
  }
}
```

컬럼 헤더를 끌 때는 `data.DataGridView_Column_Options` 에 헤더 글자, 헤더 줄 번호, 컬럼 번호가 들어갑니다.

### 끌어 온 행, 컬럼 정보 읽기 (getDraggedRowData, getDraggedColumnData)

위 JSON 을 풀어 주는 함수입니다. `event.dataTransfer.getData('text')` 를 읽으므로 `Drop` 콜백에서 씁니다. 해당 데이터가 없으면 `undefined` 를 돌려줍니다. 앱 파일에서 쓰는 곳은 `getDraggedRowData` 1개(SpecTreeDGV), `getDraggedColumnData` 0개입니다.

`grid.getDraggedRowData(event)`

| 키 | 값 |
| --- | --- |
| <code>uuid</code> | 끌기 시작한 그리드의 고유 id |
| <code>rowID</code> | 잡고 끈 행의 rowID (끌기 시작할 때 값) |
| <code>label</code> | 그 행의 <code>label</code> |
| <code>icons</code> | 그 행의 <code>icons</code> |
| <code>grid</code> | 그 행의 <code>grid</code> 객체 (셀 값들) |
| <code>nodeModel</code> | 그 행의 내부 id. **TreeNodeModel 객체가 아님** |
| <code>listOfDumpedNodes</code> | 끌고 있는 행 전체의 내부 id 배열 |

`grid.getDraggedColumnData(event)`

| 키 | 값 |
| --- | --- |
| <code>uuid</code> | 끌기 시작한 그리드의 고유 id |
| <code>label</code> | 헤더 글자 |
| <code>rowID</code> | 헤더 줄 번호 (맨 아래 헤더 줄이 -1) |
| <code>columnID</code> | 컬럼 번호 |

행 객체가 필요하면 `cellInfos.droppedNodes` (같은 그리드) 나 `cellInfos.draggedNodes` (같은 창) 를 씁니다. `getDraggedRowData` 는 다른 그리드에서 끌어 온 행의 `label`, `grid` 값을 읽을 때 씁니다.

## 예제

### 예제 1. 행 순서 바꾸기

`rowDragEnabledFlag` 만 켜면 됩니다. 행 머리의 손잡이를 잡고 끕니다. 셀을 잡고도 끌게 하려면 `cellDragEnabledFlag: true` 를 더합니다.

<<< @/../DataGridViewSample/11_dragDrop.html#grid{js}

목록(트리가 아닌 그리드)에서는 행이 다른 행의 하위로 들어가지 않도록 `'middle'` 을 거절합니다 (ENXMeetingMgmt 방식). 이 함수를 `new TreeDocument({ shouldAcceptDrop: rejectMiddle })` 로 넣거나 `treeDocument.options.shouldAcceptDrop = rejectMiddle` 로 넣습니다. 샘플은 "놓기 규칙" 목록에서 고르면 뒤의 방식으로 바꿔 넣습니다.

<<< @/../DataGridViewSample/11_dragDrop.html#noMiddle{js}

`'middle'` 을 거절하면 행 높이를 반으로 나눠 위 절반은 `'top'`, 아래 절반은 `'bottom'` 이 됩니다.

### 예제 2. 순서가 바뀐 뒤 저장하기

`Drop` 콜백에서는 아직 옮겨지기 전이므로, 놓였다는 것만 기억해 두고 `DragEnd` 콜백에서 새 순서를 읽습니다. 손잡이로 끌면 `...RowHeader`, 셀로 끌면 `...Cell` 콜백이 불리므로 둘 다 넣습니다. 손잡이로 끌어 셀 위에 놓으면 `onDropCell` 다음에 `onDragEndRowHeader` 가 불립니다.

<<< @/../DataGridViewSample/11_dragDrop.html#saveOrder{js}

`markDropped` 는 `Drop` 콜백(`onDropRowHeader`, `onDropCell`)에서 부릅니다. 샘플은 여러 예제를 한 그리드에 같이 쓰므로 [같이 쓰기](#같이-쓰기) 의 `onDrop` 안에서 부릅니다. `markDropped` 가 `true` 를 돌려줘야 그리드가 행을 옮깁니다.

`getAllDescendants()` 는 하위 행까지 화면과 같은 순서로 돌려줍니다 (접히거나 필터로 숨은 행도 포함). 최상위 행만 필요하면 `getRoots()` 를 씁니다.

### 예제 3. 다른 행의 하위로 옮기기

트리에서는 기본으로 `'middle'` 에 놓으면 하위로 들어갑니다 (하위 행의 맨 뒤. 하위 행이 없던 행은 펼쳐짐). `shouldAcceptDrop` 으로 허용 범위만 정합니다. 아래는 폴더 행에만 넣을 수 있게 하고, 앞뒤로 옮기는 것은 같은 부모 안에서만 허용합니다. 넣는 방법은 예제 1 과 같습니다.

<<< @/../DataGridViewSample/11_dragDrop.html#folderOnly{js}

- 부품 행 위에서는 `'middle'` 이 거절되므로 위아래 절반이 `'top'` / `'bottom'` 이 됩니다.
- 다른 부모로 옮기는 자리는 거절 색 가로선이 그려지고, 놓아도 `onDropCell` 이 불리지 않습니다.

### 예제 4. 옮기는 처리를 직접 하기

서버에 먼저 저장해야 하는 경우처럼 그리드의 기본 이동을 쓰지 않을 때는 `Drop` 콜백에서 직접 처리하고 `false` 를 돌려줍니다 (SpecTreeDGV, 그리드의 사용자 뷰 대화상자 방식). 아래는 하위로 넣는 경우만 직접 처리하고, 나머지는 `true` 를 돌려줘 기본 이동에 맡깁니다.

<<< @/../DataGridViewSample/11_dragDrop.html#customDrop{js}

이 함수를 `grid.onDropCell`, `grid.onDropRowHeader` 에 넣습니다. 샘플은 "하위로 넣기는 직접 처리" 를 켜면 [같이 쓰기](#같이-쓰기) 의 `onDrop` 이 이 함수를 부릅니다. `false` 를 돌려주면 그리드의 기본 이동은 실행되지 않고, `onDragEnd...` 는 그대로 불려 직접 옮긴 뒤의 순서를 읽을 수 있습니다.

- `addChild(node)` 는 그 행을 원래 부모에서 떼어 새 부모의 맨 뒤에 붙입니다. 자기 자신이나 자기 하위 행에는 붙지 않습니다 (콘솔 경고).
- 정해진 자리에 넣으려면 `parent.addChild(node, 순번)` 을 씁니다.
- 서버 호출은 `event.preventDefault()` 다음에 넣고, 성공한 뒤에 `addChild` 를 합니다.
- 그리드의 기본 이동은 옮기는 동안 `treeDocument.setUseChangeTransactionMode(false)` 로 변경 기록을 꺼 둡니다. 변경 기록을 쓰는 그리드에서 직접 옮길 때도 같은 처리가 필요합니다 ([저장 후 화면 반영](/datagridview/save-and-reflect#행의-변경-상태)).

### 예제 5. 밖에서 끌어 온 객체 받기

받는 쪽은 켜야 할 옵션이 없습니다. `DragOver` 콜백에서 `event.preventDefault()` 를 불러야 브라우저가 놓기를 허용하고, `Drop` 콜백에서 데이터를 읽습니다. 행 위에 놓으면 그 행의 하위로, 빈 곳에 놓으면 최상위로 넣는 예입니다. 샘플은 순서 바꾸기도 켜진 그리드라서, 그리드 안의 행을 끌 때(`cellInfos.draggedNodes` 가 있음)는 건드리지 않습니다.

<<< @/../DataGridViewSample/11_dragDrop.html#external{js}

`allowExternalDrop` 을 `onDragOverCell`, `onDragOverBlank` 에, `dropExternal` 을 `onDropCell`, `onDropBlank` 에 넣습니다 (샘플은 [같이 쓰기](#같이-쓰기) 의 `onDrop` 이 `cellInfos.droppedNodes` 가 없을 때 부름). 빈 곳에서는 `cellInfos.nodeModel` 이 `undefined` 라서 최상위로 들어갑니다.

- `allowExternalDrop` 이 `true` 를 돌려주면 기본 동작이 행에는 파란 테두리를, 빈 곳에는 그리드 테두리 강조를 그립니다. 순서 바꾸기가 꺼진 그리드에서는 행 위에서도 `true` 를 돌려주면 됩니다.
- 순서 바꾸기가 켜진 그리드에서 행 위에 `true` 를 돌려주면 테두리가 거절 색(어두운 빨강)으로 그려집니다. 그래서 행 위에서는 `false` 를 돌려줘 표시를 그리지 않습니다. `event.preventDefault()` 는 이미 불렀으므로 놓기는 됩니다.
- `onDropBlank` 가 `true` 를 돌려주면 그리드 테두리 강조가 지워집니다.
- `DragOver` 중에는 `getData` 가 빈 값이라 무엇이 끌려오는지 알 수 없습니다. 받을지 말지는 `Drop` 에서 판단합니다.
- 놓인 항목의 검사 순서(플랫폼 id 확인 등)는 [다른 위젯에서 놓은 3DSpace 객체 받기](/events/drag-and-drop#다른-위젯에서-놓은-3dspace-객체-받기) 를 따릅니다.

### 예제 6. 그리드 행을 밖으로 끌어 내기

`cellDragEnabledFlag` 를 켜고 `onDragStartCell` 에서 3DXContent 를 넣습니다 (ENXMeetingMgmt, ENORouteMgmt 방식). `cellInfos.draggedNodes` 에 선택된 행이 모두 들어 있으므로 여러 행도 같은 코드로 됩니다. 손잡이로 끌어 낼 때를 위해 `onDragStartRowHeader` 에도 같은 함수를 넣습니다.

<<< @/../DataGridViewSample/11_dragDrop.html#dragOut{js}

- 위젯 안에서는 `source`, `widgetId`, `envId` 에 `widget.getValue('appId')`, `widget.id`, `widget.getValue('x3dPlatformId')` 를 넣습니다. 샘플은 위젯 밖에서 도는 페이지라 고정값을 씁니다.
- 순서 바꾸기가 켜져 있으면 그리드가 같은 `text` 값에 행 정보(`data.DataGridView_Row_Options`)를 합쳐 넣습니다. 받는 쪽은 `data.items` 만 읽으면 되므로 문제 없습니다. 순서 바꾸기가 꺼져 있으면 3DXContent 만 들어갑니다.
- 행 머리의 손잡이로 끌어 내려면 `rowDragEnabledFlag: true` 가 필요합니다. 이때 순서 바꾸기는 막으려면 `rowReorderEnabledFlag: false` 를 같이 넣습니다.
- 3DXContent 의 키는 [3DXContent 형식](/events/drag-and-drop#_3dxcontent-형식) 을 봅니다.

### 예제 7. 특정 행은 못 끌게 하기

TreeDocument 의 `shouldAcceptDrag` 가 `false` 를 돌려주는 행은 끌리지 않습니다. 이때는 `DragStart` 부터 `DragEnd` 까지 콜백이 하나도 불리지 않습니다.

<<< @/../DataGridViewSample/11_dragDrop.html#acceptDrag{js}

`new TreeDocument({ shouldAcceptDrag: notApproved })` 로 넣거나 `treeDocument.options.shouldAcceptDrag = notApproved` 로 넣습니다.

화면 상태에 따라 막으려면 `DragStart` 콜백에서 `event.preventDefault()` 를 부르고 `false` 를 돌려줍니다 (ENXMeetingMgmt 방식).

```js
grid.onDragStartRowHeader = function (event, cellInfos) {
  if (isReadOnly) {
    event.preventDefault();
    return false;
  }
  return true;
};
```

### 같이 쓰기

콜백 이름 하나에는 함수를 하나만 넣을 수 있습니다. 예제 2, 4, 5 처럼 `Drop` 콜백을 여러 곳에서 쓰면 한 함수로 묶습니다. `cellInfos.droppedNodes` 가 없으면 같은 그리드의 행이 아니므로 밖에서 온 것으로 처리합니다.

<<< @/../DataGridViewSample/11_dragDrop.html#combine{js}

## 주의

::: warning 콜백에서 true 를 돌려주지 않으면 기본 동작이 빠집니다
`return` 을 쓰지 않은 콜백은 `undefined` 를 돌려주므로 그리드의 기본 동작이 실행되지 않습니다. 행 순서 바꾸기를 쓰는 그리드에 `onDragStartCell`, `onDragOverCell`, `onDropCell` (또는 `...RowHeader`) 을 넣었다면 셋 모두 `true` 를 돌려줘야 행이 옮겨집니다. 컬럼 헤더 콜백도 같아서, `onDragOverColumnHeader` 가 `true` 를 돌려주지 않으면 컬럼 순서 바꾸기가 멈춥니다.
:::

::: warning rowReorderEnabledFlag 만 켜서는 순서가 바뀌지 않습니다
`rowReorderEnabledFlag` 는 기본값이 이미 `true` 입니다. 순서 바꾸기가 안 되는 것은 `rowDragEnabledFlag` 가 기본 `false` 이기 때문입니다. 반대로 행을 밖으로 끌어 내기만 하려고 `rowDragEnabledFlag` 를 켜면 순서 바꾸기도 같이 켜지므로, 원하지 않으면 `rowReorderEnabledFlag: false` 를 넣습니다.
:::

- 행을 옮기면 `sortModel` 이 비워져 **정렬이 풀립니다.** 이때 행 순서는 정렬된 순서에서 옮긴 결과로 남습니다 ([정렬, 그룹핑, 필터와 같이 쓸 때](#정렬-그룹핑-필터와-같이-쓸-때)). 그룹핑 중에는 순서 바꾸기가 꺼집니다.
- `cellInfos.droppedNodes` 는 **같은 그리드** 안에서 옮길 때만 들어 있습니다. 다른 그리드에서 끌어 온 행은 기본 동작으로 옮겨지지 않으므로 `Drop` 콜백에서 직접 처리합니다.
- 콜백이 `text` 에 JSON 이 아닌 문자열을 넣으면 그리드가 행 정보를 합치지 못해 순서 바꾸기가 되지 않습니다.
- 콜백이 3DXContent 를 넣으면 최상위 `source` 가 앱 id 문자열로 덮여서 `getDraggedRowData(event).uuid` 는 `undefined` 가 됩니다. `rowID`, `label`, `grid` 는 그대로 읽힙니다.
- 순서 바꾸기가 켜진 그리드에서 밖에서 끌어 온 것까지 받을 때, `onDragOverCell` 이 `event.preventDefault()` 후 `true` 를 돌려주면 위치 표시가 거절 색으로 그려집니다. 밖에서 온 것(`cellInfos.draggedNodes` 가 없음)일 때는 `false` 를 돌려줍니다 ([예제 5](#예제-5-밖에서-끌어-온-객체-받기)). 행을 강조하고 싶으면 직접 합니다.
- `cellDragEnabledFlag` 만 켠 그리드(순서 바꾸기 꺼짐)는 `dataTransfer` 에 아무것도 넣지 않습니다. `onDragStartCell` 에서 직접 넣습니다.
- `cellDragEnabledFlag` 는 만든 뒤에 꺼도 이미 그려진 셀은 계속 끌립니다. 끌기를 막아야 하면 `shouldAcceptDrag` 나 `DragStart` 콜백을 씁니다.
- 그리드 위아래 가장자리(40px)에서는 끄는 동안 자동으로 스크롤됩니다. 세로로 자동 스크롤되는 동안에는 `DragEnter`, `DragOver`, `DragLeave` 콜백이 불리지 않습니다.
- 그리드에 있는 `insertRowCallback(nodeModel, rowID, cellInfos)` 은 드래그앤드롭과 관계가 없습니다. 기본 우클릭 메뉴의 "행 삽입" 으로 빈 행이 추가된 직후에 불리는 함수이고, `grid.insertRowCallback = fn` 으로 바꿔 넣습니다 ([그리드 기본 메뉴 쓰기](/datagridview/context-menu#그리드-기본-메뉴-쓰기)).

## 같이 보기

- 위젯 사이에서 객체 넘기기, 3DXContent 형식 → [끌어 놓기](/events/drag-and-drop)
- 콜백 이름 전체와 사용 파일 수 → [그리드 옵션](/datagridview/api/grid-options#드래그앤드롭-콜백-이름)
- 하위 행 만들기, 펼치기 → [트리 구조](/datagridview/tree)
- `addChild`, `getRoots` 같은 데이터 함수 → [데이터 (TreeDocument)](/datagridview/api/data)
- 행 선택과 선택 변경 알림 → [우클릭 메뉴와 선택](/datagridview/context-menu#선택-변경-받기)
- 정렬 → [정렬과 필터](/datagridview/sort-filter)
- 행 그룹핑 (묶여 있는 동안 순서 바꾸기가 꺼짐) → [행 그룹핑](/datagridview/row-grouping)
