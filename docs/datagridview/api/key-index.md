---
title: 이름 색인 (A-Z)
---

# 이름 색인 (A-Z)

DataGridView 레퍼런스에 나오는 옵션, 함수, 이벤트 이름 476개를 알파벳 순으로 모았습니다. 이름은 아는데 어느 페이지에 있는지 모를 때 씁니다.

- "있는 곳" 은 그 이름이 설명된 페이지와 절입니다. 넣는 자리(그리드 옵션, `layoutOptions`, 컬럼 옵션)도 여기서 알 수 있습니다.
- 이름의 일부만 기억나면 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)에 `HeaderHeight` 처럼 넣습니다.
- 하고 싶은 일로 찾으려면 [개요의 "하고 싶은 일로 찾기"](/datagridview/#하고-싶은-일로-찾기) 를 봅니다.
- 이 페이지는 `npm run docs:key-index` 로 다시 만듭니다. 직접 고치지 않습니다.

## A

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>action</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 버튼 클릭 시 호출. 인자 e.context.executionContext = 그리드. 함수를 넣으면 동작하지 않음 → 함수는 <code>dataElements.value</code> 에 |
| <code>activeCellChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | 현재 셀: grid.getCellInfosAt(grid.getActiveCellID()) |
| <code>addCellCoordinates</code> | [layoutOptions › 그 밖](/datagridview/api/layout-options#그-밖) | 셀 DOM 에 좌표 속성 추가 (테스트 자동화용) |
| <code>addChild</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 하위 행 추가. index 를 주면 그 순번에 넣음. 이미 다른 부모에 달린 행을 넘기면 그쪽에서 떼어 옮김 |
| <code>addColumnOrGroup</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 컬럼 추가. 같은 dataIndex 가 있으면 추가하지 않음 (children 만 합침). `index` 가 없으면 맨 끝 |
| <code>addEventListener</code> | [이벤트 › 등록 / 해제](/datagridview/api/events#등록-해제) | 반환값 h 는 실제 DOM 에 등록된 감싼 함수 |
| <code>addLevelInformation</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 맨 앞에 깊이(getNodeDepth) 칸을 추가 |
| <code>addRoot</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 최상위 행 추가 / 삭제 |
| <code>alignment</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 셀 정렬 |
| <code>alignment</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 셀 정렬 (왼쪽 / 가운데 / 오른쪽) |
| <code>allCellsRendered</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | 로딩 완료 후 처리에 가장 많이 사용 (webapps 12회). 한 번만 받으려면 grid.subscribeOnceToAllCellsRendered(fn) |
| <code>allColumns</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 숨긴 컬럼까지 모두 (기본은 보이는 컬럼, 화면 순서) |
| <code>allowResetToUndefinedByUIFlag</code> | [컬럼 옵션 › 편집](/datagridview/api/column-options#편집) | 사용자가 값을 비울(undefined) 수 있음 |
| <code>allowUnsafeHTMLContent</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 셀 값을 HTML 로 렌더링 (보안 주의) |
| <code>allowWrapFlag</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 줄바꿈 허용 |
| <code>alwaysVisibleFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 숨길 수 없는 컬럼. true 면 `visibleFlag: false` 나 `setColumnVisibleFlag(…, false)` 로도 숨겨지지 않음. `visibleFlag: false` 와 같이 쓰면 컬럼은 보이고 `getColumnVisibleFlag` 는 false, `getColumnVisibleState` 는 true |
| <code>applyColumns</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 컬럼 정의 객체를 직접 고친 뒤 그리드 전체에 다시 반영 |
| <code>autoRowHeightFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 셀 타입, 행 높이 자동 |
| <code>autoRowHeightFlag</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 내용에 맞춰 행 높이 자동 |
| <code>autoSizePadding</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 자동 너비 계산 시 여유 공간 |

## B

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>badges</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeNodeModel({ ... }) — 행](/datagridview/api/data#new-treenodemodel-—-행) | 아이콘 모서리에 겹쳐 그리는 작은 아이콘 |
| <code>buildDefaultContextualMenu</code> | [그리드 메서드 › 우클릭 메뉴, 셀 직접 그리기, 상태바](/datagridview/api/grid-methods#우클릭-메뉴-셀-직접-그리기-상태바) | 그리드 기본 우클릭 메뉴. `onContextualEvent` 안에서 기본 메뉴에 항목을 더할 때 사용 ([우클릭 메뉴](/datagridview/context-menu#그리드-기본-메뉴-쓰기)) |
| <code>buildLinks</code> | [하위 옵션 객체 › treeNodeCellOptions](/datagridview/api/sub-options#treenodecelloptions) | 트리 연결선 |
| <code>buildStatusBar</code> | [그리드 메서드 › 우클릭 메뉴, 셀 직접 그리기, 상태바](/datagridview/api/grid-methods#우클릭-메뉴-셀-직접-그리기-상태바) | 그리드 아래 상태바 만들기 (21). 만든 뒤 객체는 `grid.elements.statusBar` ([상태바](/datagridview/status-bar)) |
| <code>buttonclick</code> | [이벤트 › 셀 편집기(Tweaker)에서 버블링되는 이벤트](/datagridview/api/events#셀-편집기-tweaker-에서-버블링되는-이벤트) | 셀 안 버튼 동작 처리. 여러 개 선택 칸의 `...` 버튼 같은 셀 안 모든 버튼에서 발생하므로 `cellInfos.columnID` 로 컬럼을 확인 |

## C

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>canNodeBeGrouped</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | false 를 돌려준 행은 묶지 않음 |
| <code>canNodeModelBeExported</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | false 를 돌려준 행은 내보내지 않음 (그룹 행을 뺄 때 사용) |
| <code>category</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 묶음, 순서, 공간 부족 시 드롭다운으로 넘어가는 우선순위 |
| <code>cellActivationFeedback</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 클릭(활성) 시 강조 범위 |
| <code>cellClass</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 내부 확장용. 일반적으로 지정하지 않음 |
| <code>cellDragEnabledFlag</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 데이터 셀을 잡고 끌 수 있게 함 (편집 중인 셀 제외). 넘길 데이터는 onDragStartCell 에서 넣음. 만들 때 정함: 만든 뒤 false 로 바꿔도 이미 그려진 셀은 계속 끌림 |
| <code>cellHeight</code> | [layoutOptions › 행 높이](/datagridview/api/layout-options#행-높이) | 행 기본 높이 |
| <code>cellID</code> | [그리드 메서드 › 먼저 알아 둘 것: cellID 와 rowID](/datagridview/api/grid-methods#먼저-알아-둘-것-cellid-와-rowid) | 이벤트의 `cellInfos.cellID`, `grid.getActiveCellID()` |
| <code>cellID</code> | [컬럼 함수 › cellInfos 구조 (위 함수들의 인자)](/datagridview/api/column-functions#cellinfos-구조-위-함수들의-인자) | rowID -1 = 컬럼 헤더 줄, columnID -1 = 행 머리(번호) 칸 |
| <code>cellModel</code> | [컬럼 함수 › cellInfos 구조 (위 함수들의 인자)](/datagridview/api/column-functions#cellinfos-구조-위-함수들의-인자) | 현재 셀 값 (getCellInfosAt 계열에서만. 편집 가능 여부 판단 계열은 없음) |
| <code>cellPreselectionFeedback</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 마우스 올렸을 때(프리셀렉션) 강조 |
| <code>cellSelection</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 셀 선택 방식 (DataGridView 에서 기본 multiple 로 변경) |
| <code>cellView</code> | [컬럼 함수 › cellInfos 구조 (위 함수들의 인자)](/datagridview/api/column-functions#cellinfos-구조-위-함수들의-인자) | onCellRequest, 이벤트 리스너에서 제공 |
| <code>cellWidth</code> | [layoutOptions › 컬럼 너비](/datagridview/api/layout-options#컬럼-너비) | 컬럼 width 미지정 시 참고 너비 |
| <code>change</code> | [이벤트 › 셀 편집기(Tweaker)에서 버블링되는 이벤트](/datagridview/api/events#셀-편집기-tweaker-에서-버블링되는-이벤트) | 그리드가 먼저 데이터에 반영하므로 리스너에서는 cellInfos.nodeModel 에 이미 새 값이 들어 있다 |
| <code>checkPresenceOfDataGridViewPreferences</code> | [레이아웃 메서드 (grid.layout) › 화면 상태 저장 (preferences)](/datagridview/api/layout-methods#화면-상태-저장-preferences) | 저장된 화면 상태가 있는지 |
| <code>children</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeNodeModel({ ... }) — 행](/datagridview/api/data#new-treenodemodel-—-행) | 하위 행. 없으면 끝 행(펼침 아이콘 없음), 빈 배열 <code>[]</code> 이면 "하위 행이 있지만 아직 안 불러옴" 으로 펼침 아이콘이 생김 ([트리 구조](/datagridview/tree)) |
| <code>children</code> | [컬럼 옵션 › 컬럼 그룹 (2단 헤더)](/datagridview/api/column-options#컬럼-그룹-2단-헤더) | 컬럼 그룹. { text: '그룹명', dataIndex: '그룹키', children: [컬럼, 컬럼] } 형태로 헤더를 2단으로 묶음 (CATFLCockpitWidget 사용 예) |
| <code>children</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 하위 메뉴 (메뉴형 버튼). `children` 의 `label` 은 `title` 로 바뀜. `dataElements.value: { menu: [{ type: 'PushItem', title, icon, action: { callback } }] }` 도 같은 메뉴이고 앱에서는 이쪽이 더 흔함 ([메뉴형 버튼](/tweakers/generated-toolbar#메뉴형-버튼)) |
| <code>className</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 이 컬럼 셀에 붙일 CSS 클래스 |
| <code>click</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 클릭한 행: cellInfos.nodeModel. 헤더면 rowID -1 |
| <code>closeFind</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 찾기 실행 / 닫기 |
| <code>collapse</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 이 행 펼치기 / 접기 / 하위까지 모두 펼치기 / 펼쳐져 있는지 |
| <code>collapseAll</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 트리 전체 펼치기 / 접기 |
| <code>columnDragEnabledFlag</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 컬럼 헤더 드래그로 순서 변경 |
| <code>columnGroupExpandedState</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | - |
| <code>columnGroupShow</code> | [컬럼 옵션 › 컬럼 그룹 (2단 헤더)](/datagridview/api/column-options#컬럼-그룹-2단-헤더) | 그룹의 하위 컬럼에 넣음. 'open' = 그룹을 펼쳤을 때만 보임, 'closed' = 접었을 때만 보임. 넣지 않으면 항상 보임 |
| <code>columnHeaderHeight</code> | [layoutOptions › 헤더 (컬럼 헤더, 행 머리)](/datagridview/api/layout-options#헤더-컬럼-헤더-행-머리) | 컬럼 헤더 줄 높이(px). 27 보다 작게 주면 27 로 되돌린다. 2단 헤더면 줄마다 이 높이 |
| <code>columnHeadersLayout</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 1 이면 헤더의 선택 체크박스를 헤더 왼쪽에 둔다 |
| <code>columnID</code> | [그리드 메서드 › 먼저 알아 둘 것: cellID 와 rowID](/datagridview/api/grid-methods#먼저-알아-둘-것-cellid-와-rowid) | `cellInfos.columnID` |
| <code>columnID</code> | [컬럼 함수 › cellInfos 구조 (위 함수들의 인자)](/datagridview/api/column-functions#cellinfos-구조-위-함수들의-인자) | rowID -1 = 컬럼 헤더 줄, columnID -1 = 행 머리(번호) 칸 |
| <code>columnIndex</code> | [레이아웃 메서드 (grid.layout) › 먼저 알아 둘 것: 컬럼을 가리키는 방법](/datagridview/api/layout-methods#먼저-알아-둘-것-컬럼을-가리키는-방법) | `columns` 배열에 정의한 순서. 0 부터. 사용자가 헤더를 끌어 순서를 바꿔도 **변하지 않습니다**. 이벤트의 `cellInfos.columnID` 가 이 번호입니다 |
| <code>columnKeys</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 내보낼 컬럼 지정 |
| <code>columnOrderChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | - |
| <code>columns</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | [컬럼 옵션](/datagridview/api/column-options) 참고 |
| <code>columnSelection</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 컬럼 헤더 클릭으로 컬럼 전체 선택 |
| <code>columnSeparator</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 구분자. 기본 `,` |
| <code>columnsHeader</code> | [layoutOptions › 헤더 (컬럼 헤더, 행 머리)](/datagridview/api/layout-options#헤더-컬럼-헤더-행-머리) | 컬럼 헤더 줄 표시. false 면 헤더 줄 전체를 숨김 |
| <code>columnVisibleStateChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | - |
| <code>columnWidthChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | - |
| <code>compareFunction</code> | [컬럼 옵션 › 정렬](/datagridview/api/column-options#정렬) | 사용자 정의 정렬. 내림차순은 그리드가 -1 을 곱함 |
| <code>compareFunction</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | 정렬 비교 함수 자체를 바꿈. 내림차순은 그리드가 -1 을 곱함 |
| <code>computeCellIDFromActiveCell</code> | [그리드 메서드 › 활성 셀 (포커스)](/datagridview/api/grid-methods#활성-셀-포커스) | 활성 셀에서 한 칸 옮긴 셀의 cellID. `direction` 은 `'up'`, `'down'`, `'left'`, `'right'`, `'pageup'`, `'pagedown'`. 키보드 이동을 직접 만들 때 사용 |
| <code>contextmenu</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | webapps 에서 가장 많이 사용 (15회). 그리드 우클릭 메뉴를 바꾸려면 onContextualEvent 옵션 ([우클릭 메뉴](/datagridview/context-menu)) |
| <code>copy</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 그리드 기본 복사/붙여넣기 전후 처리 |
| <code>createGroupingUI</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 컬럼 헤더를 끌어 놓아 묶는 영역(`DS/Controls/SelectionChips`)을 만들어 돌려줌. inject 는 직접 함 |
| <code>customHeader</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 헤더 칸을 직접 만든 DOM 으로 그림 ([헤더를 직접 그리기](/datagridview/header#헤더를-직접-그리기-customheader)) |
| <code>customViewsOptions</code> | [그리드 옵션 › 정렬 / 필터 / 찾기](/datagridview/api/grid-options#정렬-필터-찾기) | 사용자 뷰 대화상자 옵션. 키는 하나뿐 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views)) |

## D

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>data</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeNodeModel({ ... }) — 행](/datagridview/api/data#new-treenodemodel-—-행) | 화면에 쓰이지 않는 보관용 자리 |
| <code>dataIndex</code> | [레이아웃 메서드 (grid.layout) › 먼저 알아 둘 것: 컬럼을 가리키는 방법](/datagridview/api/layout-methods#먼저-알아-둘-것-컬럼을-가리키는-방법) | 컬럼 정의에 넣은 키 (`'tree'`, `'title'`) |
| <code>dataIndex</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 값을 가져올 키. 'tree' = 행의 label + 트리 펼침 컬럼 |
| <code>dataSource</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 행을 필요한 만큼만 서버에서 불러오는 방식. <code>treeDocument</code> 대신 넣는다. 사용 수는 그리드 옵션으로 쓴 파일만 센 값 ([서버 사이드 데이터](/datagridview/server-side)) |
| <code>dataSource</code> | [데이터 (TreeDocument / TreeNodeModel) › 그리드에서 TreeDocument 꺼내기, 바꾸기](/datagridview/api/data#그리드에서-treedocument-꺼내기-바꾸기) | 그리드가 안에서 만든 TreeDocument. 불러온 행만 들어 있고 <code>grid.treeDocument</code> 는 <code>null</code> ([서버 사이드 데이터](/datagridview/server-side)) |
| <code>dblclick</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 클릭한 행: cellInfos.nodeModel. 헤더면 rowID -1 |
| <code>defaultColumnDef</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 모든 컬럼 공통 기본값. 빠진 키는 원래 기본값으로 채워짐 |
| <code>deleteDataGridViewPreferences</code> | [레이아웃 메서드 (grid.layout) › 화면 상태 저장 (preferences)](/datagridview/api/layout-methods#화면-상태-저장-preferences) | 저장된 화면 상태 지우기. 2025 에서 `useWidgetPreferencesFlag: true` 면 지워지지 않음 ([주의](/datagridview/custom-views#주의)) |
| <code>deleteOptions</code> | [그리드 옵션 › 편집 / 키보드](/datagridview/api/grid-options#편집-키보드) | Delete 키로 선택 행 삭제 |
| <code>deleteSelectionOnKeyPress</code> | [하위 옵션 객체 › deleteOptions](/datagridview/api/sub-options#deleteoptions) | Delete 키로 선택 행 삭제 |
| <code>depth</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 묶을 행의 깊이. 0 = 최상위 행, -1 = 모든 깊이. 함수는 깊이를 받아 boolean 을 돌려줌 (this = TreeDocument) |
| <code>depthIncrement</code> | [하위 옵션 객체 › treeNodeCellOptions](/datagridview/api/sub-options#treenodecelloptions) | 단계별 들여쓰기 |
| <code>description</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 헤더 툴팁 |
| <code>description</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 헤더 설명(툴팁) |
| <code>destroy</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 그리드 정리. 위젯이 닫힐 때 호출 |
| <code>dialogMaximizedFlag</code> | [하위 옵션 객체 › customViewsOptions](/datagridview/api/sub-options#customviewsoptions) | 사용자 뷰 대화상자를 최대화로 열기. 키는 이것 하나 (2025, 2026 같음) |
| <code>disabled</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 비활성 |
| <code>disabled</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 편집 가능, 비활성 |
| <code>disabled</code> | [컬럼 옵션 › 편집](/datagridview/api/column-options#편집) | 컬럼 비활성 |
| <code>disabled</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 표시 / 비활성 / 읽기전용 |
| <code>disableRowReordering</code> | [그리드 메서드 › 드래그앤드롭](/datagridview/api/grid-methods#드래그앤드롭) | 행 순서 바꾸기를 잠시 끄기 / 되돌리기. 횟수를 세므로 끈 만큼 켜야 함. 그룹핑 중에는 그리드가 스스로 끔 |
| <code>displayLabel</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 글자 / 툴팁 / 라벨 표시 여부 |
| <code>displayModalLoader</code> | [그리드 메서드 › 로딩 표시](/datagridview/api/grid-methods#로딩-표시) | 그리드 위에 로딩 표시를 덮음 |
| <code>documentClassForServerSide</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | <code>dataSource</code> 그리드가 안에서 만드는 TreeDocument 의 클래스 |
| <code>domId</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 최상위 DOM id |
| <code>drag</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |
| <code>dragend</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |
| <code>dragenter</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |
| <code>dragleave</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |
| <code>dragover</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |
| <code>dragstart</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |
| <code>drop</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 보통은 리스너 대신 onDropCell 같은 옵션 콜백을 씀 (콜백의 cellInfos 에만 draggedNodes, dropPosition, droppedNodes 가 붙음). [드래그앤드롭](/datagridview/drag-and-drop) |

## E

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>editableFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 편집 가능, 비활성 |
| <code>editableFlag</code> | [컬럼 옵션 › 편집](/datagridview/api/column-options#편집) | 편집 가능 |
| <code>editionPolicy</code> | [컬럼 옵션 › 편집](/datagridview/api/column-options#편집) | 편집 시작 방식 ([편집](/datagridview/editing)) |
| <code>editOnKeyPressFlag</code> | [그리드 옵션 › 편집 / 키보드](/datagridview/api/grid-options#편집-키보드) | 셀 선택 후 글자를 치면 바로 편집 시작 |
| <code>empty</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 모든 행 제거 |
| <code>enableRowReordering</code> | [그리드 메서드 › 드래그앤드롭](/datagridview/api/grid-methods#드래그앤드롭) | 행 순서 바꾸기를 잠시 끄기 / 되돌리기. 횟수를 세므로 끈 만큼 켜야 함. 그룹핑 중에는 그리드가 스스로 끔 |
| <code>EndResizeOrOnReadyModelRequestDone</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | 준비됐을 때와 크기가 바뀐 뒤 <code>fn({ RowMaxNumber, ColumnsMaxNumber, viewportDimensions, event })</code> / 처리 끝 알림 (2) |
| <code>ensureCellVisible</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 셀이 보이도록 스크롤. 이미 보이면 움직이지 않음 |
| <code>ensureNodeModelVisible</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 행이 보이도록 스크롤. `expandParents: true` 면 접힌 부모를 펼침. `ratio` 0~1 은 화면 안 위치 (0.5 = 가운데). `flash: true` 면 깜빡임 표시 |
| <code>entries</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 툴바 항목 목록 |
| <code>enums</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 툴바에서 쓸 사용자 enum / 타입 등록 |
| <code>executePendingNotifications</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | <code>syncClientModelOnDemand: true</code> 로 모아 둔 서버 변경을 반영 / 버림 |
| <code>expand</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 이 행 펼치기 / 접기 / 하위까지 모두 펼치기 / 펼쳐져 있는지 |
| <code>expandAll</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 트리 전체 펼치기 / 접기 |
| <code>expandAll</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 이 행 펼치기 / 접기 / 하위까지 모두 펼치기 / 펼쳐져 있는지 |
| <code>expandedFlag</code> | [컬럼 옵션 › 컬럼 그룹 (2단 헤더)](/datagridview/api/column-options#컬럼-그룹-2단-헤더) | 그룹에 넣음. 처음에 펼쳐 둘지. 넣으면 그룹 헤더에 펼침 버튼이 생김 |
| <code>expanderStyle</code> | [하위 옵션 객체 › treeNodeCellOptions](/datagridview/api/sub-options#treenodecelloptions) | 트리 펼침 아이콘 모양 |
| <code>exportPreferencesInJson</code> | [레이아웃 메서드 (grid.layout) › 화면 상태 저장 (preferences)](/datagridview/api/layout-methods#화면-상태-저장-preferences) | 화면 상태(너비, 순서, 표시, 고정 등)를 JSON 문자열로 꺼내기 / 다시 넣기. 꺼낼 때 <code>{ onlyCustomViewsFlag }</code>, 넣을 때 <code>{ importOnlyCustomViews, importCurrentCustomViewId }</code> |

## F

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>filterViewOptions</code> | [그리드 옵션 › 정렬 / 필터 / 찾기](/datagridview/api/grid-options#정렬-필터-찾기) | 필터 팝업 옵션 (필터 자체는 [필터](/datagridview/api/filter)) |
| <code>findableFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 찾기 대상 포함 |
| <code>findNavigationMode</code> | [그리드 옵션 › 정렬 / 필터 / 찾기](/datagridview/api/grid-options#정렬-필터-찾기) | 찾기(setFindStr) 결과 이동 단위 |
| <code>fireOnlyFromUIInteractionFlag</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | UI 조작으로 바뀔 때만 이벤트 발생 |
| <code>flashEffectOnNodeModel</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 행을 잠깐 깜빡여 변경을 알림 |
| <code>flushPendingNotifications</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | <code>syncClientModelOnDemand: true</code> 로 모아 둔 서버 변경을 반영 / 버림 |
| <code>focusNextEditableCellOnTabFlag</code> | [그리드 옵션 › 편집 / 키보드](/datagridview/api/grid-options#편집-키보드) | Tab 키로 다음 편집 가능 셀로 이동 |
| <code>forceQuotes</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 모든 값을 큰따옴표로 감쌈 |

## G

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>generatePrintableViewHTML</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | 지금 보이는 행을 인쇄용 `table` HTML 문자열로 |
| <code>getActiveCellID</code> | [그리드 메서드 › 활성 셀 (포커스)](/datagridview/api/grid-methods#활성-셀-포커스) | 현재 활성 셀. 없으면 -1 |
| <code>getAllDescendants</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 최상위 행 / 하위까지 전체 행 |
| <code>getAsCSV</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 그리드 내용을 CSV 문자열로. 아래 옵션 표 참고. 행을 나눠 불러오는 그리드에서는 그 순간 불러온 행만 담김 |
| <code>getAttributeValue</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 셀 값 읽기 |
| <code>getCellActivableState</code> | [컬럼 함수 › 셀 타입 / 편집](/datagridview/api/column-functions#셀-타입-편집) | false 면 클릭/키보드로 활성(포커스)되지 않음 |
| <code>getCellAttributes</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | 셀 DOM 에 속성 추가 (CSS 선택자, 테스트용) |
| <code>getCellClassName</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | 조건부 셀 스타일 (CSS 는 페이지에 직접 정의) |
| <code>getCellCoordinatesAt</code> | [레이아웃 메서드 (grid.layout) › 셀 번호와 위치](/datagridview/api/layout-methods#셀-번호와-위치) | cellID → 행 번호, 컬럼 번호 |
| <code>getCellDefaultTooltip</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 그리드 기본 툴팁. `getCellTooltip` 함수 안에서 일부 셀만 직접 정하고 나머지는 기본 툴팁으로 돌려줄 때 사용 (앱 파일 24개) |
| <code>getCellEditableState</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 이 셀이 지금 편집 가능한지 |
| <code>getCellEditableState</code> | [컬럼 함수 › 셀 타입 / 편집](/datagridview/api/column-functions#셀-타입-편집) | 행마다 편집 가능 여부 (editableFlag:true 인 컬럼에서) |
| <code>getCellGroupingKey</code> | [컬럼 함수 › 그룹핑 / 찾기](/datagridview/api/column-functions#그룹핑-찾기) | 행 그룹핑 시 묶을 기준 값 (예: 날짜를 월 단위로) ([행 그룹핑](/datagridview/row-grouping#예제-5-날짜를-월-단위로-묶기)) |
| <code>getCellIcons</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | 셀 앞 아이콘 (기본: nodeModel.getIcons()) |
| <code>getCellIDFromCoordinates</code> | [레이아웃 메서드 (grid.layout) › 셀 번호와 위치](/datagridview/api/layout-methods#셀-번호와-위치) | 행 번호와 컬럼 → cellID. `columnID` 에 dataIndex 문자열도 쓸 수 있음. 헤더 칸은 `rowID` -1 |
| <code>getCellInfosAt</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 셀 정보. `cellModel` 은 화면에 표시되는 셀 값 |
| <code>getCellInfosFromHtmlElement</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | DOM 요소가 들어 있는 셀의 정보 (+ `cellView`). 셀 안 버튼 click 처리에 사용 |
| <code>getCellKPIColor</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | KPI 색 (그리드 showNodeKPIColorFlag:true 필요) |
| <code>getCellSelectableState</code> | [컬럼 함수 › 셀 타입 / 편집](/datagridview/api/column-functions#셀-타입-편집) | false 면 클릭해도 선택되지 않고 활성만 됨 |
| <code>getCellSemantics</code> | [컬럼 함수 › 셀 타입 / 편집](/datagridview/api/column-functions#셀-타입-편집) | 행마다 다른 콤보 목록, 최소/최대값 등. 지정하면 컬럼 semantics 대신 사용 |
| <code>getCellsFromNodeModel</code> | [레이아웃 메서드 (grid.layout) › 셀 번호와 위치](/datagridview/api/layout-methods#셀-번호와-위치) | 그 행의 모든 셀. `onlyVisible: true` 면 보이는 컬럼만, 화면 순서대로 |
| <code>getCellsXSO</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 셀 선택 목록 / 컬럼 선택 목록. 행 선택 목록은 `getNodesXSO()` |
| <code>getCellTooltip</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 그리드 전체 셀 툴팁. ※ 이 옵션을 넣으면 컬럼의 getCellTooltip 은 호출되지 않음 (DataGridView._getCellTooltip, 2025 / 2026 같음) |
| <code>getCellTooltip</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | 셀 툴팁. 없으면 그리드 기본 툴팁. ※ 그리드 옵션 <code>getCellTooltip</code> 을 넣으면 그리드 쪽만 호출되고 컬럼 쪽은 무시됨 |
| <code>getCellTypeRepresentation</code> | [컬럼 함수 › 셀 타입 / 편집](/datagridview/api/column-functions#셀-타입-편집) | 행마다 다른 셀 타입 ([typeRepresentation](/datagridview/api/type-representation) 값) |
| <code>getCellValue</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | grid[dataIndex] 대신 계산한 값을 표시. 화면, 찾기, 내보내기에 모두 쓰임 |
| <code>getCellValueForCopy</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | 셀을 복사(Ctrl+C)할 때 클립보드에 넣을 값 |
| <code>getCellValueForExport</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | <code>grid.getAsCSV()</code> 로 내보낼 때 쓸 값 |
| <code>getCellValueForSort</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | ※ 인자가 cellInfos 가 아님. 정렬에 쓸 값이 표시값과 다를 때. getCellValue 로 계산해 보여주는 컬럼은 이 함수가 있어야 정렬할 값이 생김 |
| <code>getChildren</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 하위 행 배열 / 하위 행이 1개 이상인지 / 부모 행 |
| <code>getColumnAlwaysVisibleFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 보이기와 숨기기](/datagridview/api/layout-methods#컬럼-보이기와-숨기기) | 컬럼 옵션 `alwaysVisibleFlag` 값 |
| <code>getColumnComputedWidth</code> | [레이아웃 메서드 (grid.layout) › 컬럼 너비](/datagridview/api/layout-methods#컬럼-너비) | 지금 화면에 그려진 실제 너비(px). `'auto'` 컬럼의 계산된 너비를 알 때 |
| <code>getColumnHeaderHeight</code> | [레이아웃 메서드 (grid.layout) › 높이](/datagridview/api/layout-methods#높이) | 컬럼 헤더 한 줄의 높이 ([헤더 높이](/datagridview/header#헤더-높이)) |
| <code>getColumnIdentifiers</code> | [레이아웃 메서드 (grid.layout) › 먼저 알아 둘 것: 컬럼을 가리키는 방법](/datagridview/api/layout-methods#먼저-알아-둘-것-컬럼을-가리키는-방법) | `key` 는 dataIndex, 컬럼 번호, `{ dataIndex }`, `{ columnIndex }` 중 하나 |
| <code>getColumnIndex</code> | [레이아웃 메서드 (grid.layout) › 먼저 알아 둘 것: 컬럼을 가리키는 방법](/datagridview/api/layout-methods#먼저-알아-둘-것-컬럼을-가리키는-방법) | dataIndex → 컬럼 번호. 숫자를 주면 그대로 돌려줌. 없는 dataIndex 면 `undefined` |
| <code>getColumnMinWidth</code> | [레이아웃 메서드 (grid.layout) › 컬럼 너비](/datagridview/api/layout-methods#컬럼-너비) | 컬럼 옵션 `minWidth` 값 |
| <code>getColumnOptionValue</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 컬럼 옵션 값. 컬럼에 없으면 `defaultColumnDef` 의 값 |
| <code>getColumnOrGroup</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | `key` 는 dataIndex 문자열, columnIndex 숫자, `{ dataIndex }`, `{ columnIndex }` 중 하나. 컬럼 그룹 안도 찾음 |
| <code>getColumnOrGroup</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 컬럼 또는 그룹 하나. `grid.getColumnOrGroup(key)` 와 같음 |
| <code>getColumnOrGroupCellCoordinates</code> | [레이아웃 메서드 (grid.layout) › 컬럼 그룹](/datagridview/api/layout-methods#컬럼-그룹) | 컬럼(또는 그룹) 헤더 칸의 위치 |
| <code>getColumnOrGroupFromCoordinates</code> | [레이아웃 메서드 (grid.layout) › 컬럼 그룹](/datagridview/api/layout-methods#컬럼-그룹) | 헤더 칸 위치 → 컬럼(또는 그룹) |
| <code>getColumnOrGroupPinned</code> | [레이아웃 메서드 (grid.layout) › 컬럼 그룹](/datagridview/api/layout-methods#컬럼-그룹) | 그룹의 고정 위치. 하위 컬럼의 고정 위치가 서로 다르면 `undefined` |
| <code>getColumnOrGroupVisibleState</code> | [레이아웃 메서드 (grid.layout) › 컬럼 보이기와 숨기기](/datagridview/api/layout-methods#컬럼-보이기와-숨기기) | 컬럼 또는 그룹(하위 중 하나라도 보이면 true). 인자는 컬럼 정의 객체 |
| <code>getColumnPinned</code> | [레이아웃 메서드 (grid.layout) › 컬럼 고정과 순서](/datagridview/api/layout-methods#컬럼-고정과-순서) | 지금 고정 위치 |
| <code>getColumnPosition</code> | [레이아웃 메서드 (grid.layout) › 컬럼 고정과 순서](/datagridview/api/layout-methods#컬럼-고정과-순서) | 컬럼의 가로 위치(px) |
| <code>getColumnsXSO</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 셀 선택 목록 / 컬럼 선택 목록. 행 선택 목록은 `getNodesXSO()` |
| <code>getColumnVisibleFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 보이기와 숨기기](/datagridview/api/layout-methods#컬럼-보이기와-숨기기) | 컬럼 옵션 `visibleFlag` 값 |
| <code>getColumnVisibleState</code> | [레이아웃 메서드 (grid.layout) › 컬럼 보이기와 숨기기](/datagridview/api/layout-methods#컬럼-보이기와-숨기기) | 지금 실제로 보이는지. `visibleFlag` 가 true 여도 접힌 컬럼 그룹 안에 있으면 false |
| <code>getColumnWidth</code> | [레이아웃 메서드 (grid.layout) › 컬럼 너비](/datagridview/api/layout-methods#컬럼-너비) | 컬럼 옵션 `width` 값 (설정값) |
| <code>getCustomViewsManager</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | 컬럼 구성과 정렬을 "뷰" 로 저장하고 바꾸는 관리 객체 (17). 처음 부를 때 만들어짐 |
| <code>getDataIndexFromColumnIndex</code> | [레이아웃 메서드 (grid.layout) › 먼저 알아 둘 것: 컬럼을 가리키는 방법](/datagridview/api/layout-methods#먼저-알아-둘-것-컬럼을-가리키는-방법) | 컬럼 번호 → dataIndex. 범위를 벗어나면(행 머리 포함) `'rowHeader'` |
| <code>getDefaultCellHeight</code> | [레이아웃 메서드 (grid.layout) › 높이](/datagridview/api/layout-methods#높이) | 밀도에 따른 행 기본 높이. compact 26, comfortable 또는 터치 모드 40 |
| <code>getDimensions</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 그리드 전체 크기(px) (28) |
| <code>getDisplayedColumnsIndexes</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 지금 스크롤 위치에서 화면 안에 들어와 있는 컬럼 |
| <code>getDraggedColumnData</code> | [그리드 메서드 › 드래그앤드롭](/datagridview/api/grid-methods#드래그앤드롭) | Drop 콜백에서 끌어 온 컬럼 헤더 정보 읽기 |
| <code>getDraggedRowData</code> | [그리드 메서드 › 드래그앤드롭](/datagridview/api/grid-methods#드래그앤드롭) | Drop 콜백에서 끌어 온 행 정보 읽기. nodeModel 은 행 객체가 아니라 내부 id |
| <code>getFilterViewManager</code> | [그리드 메서드 › 정렬, 그룹 다시 적용](/datagridview/api/grid-methods#정렬-그룹-다시-적용) | 사용자 정의 필터 화면 등록 (`registerFilterView`) 에 사용 ([필터](/datagridview/api/filter)) |
| <code>getFindableAttributes</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 지금 보이는 컬럼의 헤더 글자 목록 (화면 순서) |
| <code>getFindPositionsInCellString</code> | [컬럼 함수 › 그룹핑 / 찾기](/datagridview/api/column-functions#그룹핑-찾기) | 찾기 결과 강조 위치 직접 지정 |
| <code>getGroupingNodeIcons</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 그룹 행 아이콘 |
| <code>getGroupingNodeLabel</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 그룹 행 제목. 값이 빈 그룹의 `getIdentifier()` 는 `'NA'` |
| <code>getGroupingNodeOptions</code> | [컬럼 함수 › 그룹핑 / 찾기](/datagridview/api/column-functions#그룹핑-찾기) | 그룹 행의 이 컬럼 칸에 넣을 값 (합계 등). rowGroupingOptions.getGroupingNodeOptions 가 있으면 쓰이지 않음 |
| <code>getGroupingNodeOptions</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 그룹 행의 컬럼 값 |
| <code>getGroupingOptions</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 마지막으로 groupRows 에 넘긴 객체. 한 번도 묶지 않았으면 undefined |
| <code>getHeaderContainerHeight</code> | [레이아웃 메서드 (grid.layout) › 높이](/datagridview/api/layout-methods#높이) | 컬럼 헤더 전체 높이 (2단이면 두 줄 합계). 헤더를 숨겼으면 0 |
| <code>getIcons</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 아이콘, 배지 읽기 / 바꾸기 |
| <code>getLabel</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 트리 컬럼 값 읽기 / 바꾸기 |
| <code>getLeafColumns</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 값을 보여 주는 컬럼 전체 (그룹 헤더 제외). 배열 순번 = 컬럼 번호. 숨긴 컬럼도 포함 |
| <code>getLightCellInfosAt</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 값(cellModel) 계산을 건너뛴 가벼운 버전 |
| <code>getModelAt</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 셀 값. 행 번호 컬럼이면 `"1"` 같은 문자열 |
| <code>getModelLength</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 지금 화면에 표시되는 행 수 (접힌 하위 행, 필터로 빠진 행 제외). <code>dataSource</code> 그리드에서는 뜻이 다름 ([서버 사이드 데이터](/datagridview/server-side#옵션과-함수)) |
| <code>getNodeDepth</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 최상위 행인지 / 깊이 |
| <code>getNodeGroupingKey</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 행이 들어갈 그룹의 키. 컬럼 getCellGroupingKey 가 있으면 컬럼 쪽이 우선 |
| <code>getNodeModelAt</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 셀이 속한 행 |
| <code>getNodeModelAtRowID</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 보이는 순서 rowID 의 행 |
| <code>getNodeSource</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | <code>TreeNodeModel.NODE_SOURCE.MODEL</code>(0, 일반 행) / <code>GROUPING</code>(1, 그룹 행). 그룹 행 거르기에 사용 ([행 그룹핑](/datagridview/row-grouping#일반-행과-구분하기)) |
| <code>getNodesXSO</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 행 선택 목록. `treeDocument.getXSO()` 와 같음 |
| <code>getOrderedColumnsIndexes</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 화면 순서대로 놓은 컬럼 번호 (숨긴 컬럼 포함) |
| <code>getParent</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 하위 행 배열 / 하위 행이 1개 이상인지 / 부모 행 |
| <code>getPreselectedCellID</code> | [그리드 메서드 › 활성 셀 (포커스)](/datagridview/api/grid-methods#활성-셀-포커스) | 마우스를 올린 셀 |
| <code>getRoots</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 최상위 행 / 하위까지 전체 행 |
| <code>getRowHeight</code> | [레이아웃 메서드 (grid.layout) › 높이](/datagridview/api/layout-methods#높이) | 그 행의 지금 높이(px) |
| <code>getRowHeightFunction</code> | [layoutOptions › 행 높이](/datagridview/api/layout-options#행-높이) | 행별 높이 |
| <code>getRowModelLength</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 인자가 없으면 <code>getModelLength()</code> 와 같음. <code>depth</code> 를 주면 그 깊이의 표시 행 수 (-1 = 모든 깊이). <code>dataSource</code> 그리드에서는 서버가 알려 준 전체 행 수 (앱 파일 6개) |
| <code>getRowPosition</code> | [레이아웃 메서드 (grid.layout) › 셀 번호와 위치](/datagridview/api/layout-methods#셀-번호와-위치) | 행의 세로 위치(px) |
| <code>getRowReorderEnabledState</code> | [그리드 메서드 › 드래그앤드롭](/datagridview/api/grid-methods#드래그앤드롭) | 지금 행 순서 바꾸기가 되는 상태인지 (rowDragEnabledFlag, rowReorderEnabledFlag 가 모두 true 이고 꺼 둔 상태가 아닐 때 true) |
| <code>getScrollerPosition</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 스크롤 위치 읽기 / 쓰기 (화면 복원용) |
| <code>getSelectedNodes</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 선택된 행 |
| <code>getToolbar</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 툴바 만들기 / 읽기. [툴바](/datagridview/toolbar) 참고 |
| <code>getTreeDocument</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 그리드에 연결된 데이터. TreeDocument 를 넣기 전이면 `undefined` |
| <code>getTreeDocument</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 이 행이 속한 TreeDocument |
| <code>getTypeRepresentationFactory</code> | [그리드 메서드 › 우클릭 메뉴, 셀 직접 그리기, 상태바](/datagridview/api/grid-methods#우클릭-메뉴-셀-직접-그리기-상태바) | 그리드가 쓰는 타입 등록소. [사용자 타입 등록](/tweakers/custom-type) 에 사용 |
| <code>getUseClipboardFlag</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 기본 true. `false` 로 하면 Ctrl+C / Ctrl+X / Ctrl+V 때 그리드가 셀 값을 시스템 클립보드로 복사 / 붙여넣기 하지 않음 (앱이 복사 동작을 직접 처리할 때) |
| <code>getUUID</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 그리드마다 다른 내부 id (16). 드래그 데이터가 어느 그리드에서 왔는지 가릴 때 사용 |
| <code>getViewportDimensions</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 스크롤되는 영역의 보이는 크기(px) |
| <code>getVisibleOrderedColumnsIndexes</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 보이는 컬럼만, 화면 순서대로 |
| <code>getVisibleOrderedLeafColumns</code> | [레이아웃 메서드 (grid.layout) › 컬럼 목록 읽기](/datagridview/api/layout-methods#컬럼-목록-읽기) | 지금 보이는 컬럼만, 화면 순서대로 |
| <code>getXSO</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 행 선택 목록 객체. 선택 변경 알림은 [이벤트](/datagridview/api/events) |
| <code>goToNextMatchingCell</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 찾기 결과 이동 |
| <code>goToPreviousMatchingCell</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 찾기 결과 이동 |
| <code>grid</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeNodeModel({ ... }) — 행](/datagridview/api/data#new-treenodemodel-—-행) | 나머지 컬럼 값. 컬럼이 없는 키(서버 ID 등)도 넣어 둘 수 있음 |
| <code>groupableFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 행 그룹핑 기준으로 사용 가능. false 인 컬럼은 groupRows 에 넘겨도 조용히 빠지고, 그룹 영역에 끌어 놓아도 받지 않음 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>groupRows</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 행 묶기. 배열에 기준 컬럼의 dataIndex 를 순서대로 넣음. 빈 배열이면 해제. 비동기로 끝나고, 끝나면 TreeDocument 에 `groupNodes` 이벤트 ([행 그룹핑](/datagridview/row-grouping)) |

## H

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>hasCellValue</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | false 를 돌려주면 해당 셀은 빈 칸 (getCellValue 도 호출 안 됨) |
| <code>hasChildren</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 하위 행 배열 / 하위 행이 1개 이상인지 / 부모 행 |
| <code>hasPreferences</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | (정적 함수) 그 identifier 로 저장된 화면 상태가 있는지 |
| <code>height</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 그리드 높이 |
| <code>hide</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 행 보이기 / 숨기기 |
| <code>hideGroupedColumns</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 묶은 기준 컬럼 숨김 (tree 컬럼 제외). 그룹에서 빠지면 다시 보이게 함 |
| <code>hyperlinkTarget</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | url 타입 링크 열기 대상 |

## I

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>icon</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 헤더 글자, 아이콘 (`showTextFlag` 는 `text` 나 `icon` 과 같이 넣을 때만 반영) |
| <code>icon</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 헤더 아이콘 |
| <code>icon</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 아이콘 (1 = 3DS 폰트) |
| <code>icons</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeNodeModel({ ... }) — 행](/datagridview/api/data#new-treenodemodel-—-행) | 트리 셀 글자 앞 아이콘. 아래 "아이콘과 배지" 참고 |
| <code>id</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 항목 고유 id |
| <code>identifier</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 그리드 이름. 화면 상태(너비, 순서, 표시, 정렬)를 이 이름으로 저장하므로 없으면 저장되지 않음. 화면마다 겹치지 않게 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views)) |
| <code>ignoreGroupingNodes</code> | [하위 옵션 객체 › filterViewOptions](/datagridview/api/sub-options#filterviewoptions) | 필터 팝업의 값 목록을 만들 때 그룹 행을 건너뜀. 그룹 행 자체는 이 값과 상관없이 필터 조건으로 걸러지지 않음 ([행 그룹핑](/datagridview/row-grouping#기능별-취급)) |
| <code>importJsonPreferences</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | (정적 함수) 그리드를 만들기 전에 화면 상태를 넣어 둠. 항상 localStorage 에 씀 ([예제](/datagridview/custom-views#예제-4-상태를-꺼내-서버에-저장하고-되살리기)) |
| <code>importJsonPreferences</code> | [레이아웃 메서드 (grid.layout) › 화면 상태 저장 (preferences)](/datagridview/api/layout-methods#화면-상태-저장-preferences) | 화면 상태(너비, 순서, 표시, 고정 등)를 JSON 문자열로 꺼내기 / 다시 넣기. 꺼낼 때 <code>{ onlyCustomViewsFlag }</code>, 넣을 때 <code>{ importOnlyCustomViews, importCurrentCustomViewId }</code> |
| <code>infiniteScrollProcessDone</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | <code>onInfiniteScroll</code> 처리가 끝났음을 알림 (6). 부르지 않으면 콜백이 다시 오지 않음 |
| <code>insertRowCallback</code> | [그리드 메서드 › 드래그앤드롭](/datagridview/api/grid-methods#드래그앤드롭) | 기본 우클릭 메뉴의 "행 삽입" 으로 빈 행이 추가된 직후에 불림. `grid.insertRowCallback = fn` 으로 바꿔 넣음. 드래그와는 무관 |
| <code>invalidateLayout</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 너비, 높이 계산을 다시 하고 그림 |
| <code>isCellActive</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 이 셀이 선택되어 있는지 / 활성 셀인지 (`cellActivationFeedback: 'row'` 면 같은 행 전체가 활성) |
| <code>isCellInEdition</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 이 셀이 지금 편집 중인지 |
| <code>isCellMatchingFind</code> | [컬럼 함수 › 그룹핑 / 찾기](/datagridview/api/column-functions#그룹핑-찾기) | 찾기(setFindStr) 일치 여부 직접 판단 |
| <code>isCellSelected</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 이 셀이 선택되어 있는지 / 활성 셀인지 (`cellActivationFeedback: 'row'` 면 같은 행 전체가 활성) |
| <code>isColumnSelected</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 컬럼이 선택되어 있는지 (`columnSelection` 옵션 필요) |
| <code>isExpanded</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 이 행 펼치기 / 접기 / 하위까지 모두 펼치기 / 펼쳐져 있는지 |
| <code>isInitialized</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 그리드 초기화가 끝났는지 |
| <code>isReusableCellContentRegistered</code> | [그리드 메서드 › 우클릭 메뉴, 셀 직접 그리기, 상태바](/datagridview/api/grid-methods#우클릭-메뉴-셀-직접-그리기-상태바) | 그 id 가 등록되어 있는지 |
| <code>isRoot</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 최상위 행인지 / 깊이 |
| <code>isSelected</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 행 선택 제어 |

## K

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>keydown</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 현재 셀 기준 처리는 grid.getActiveCellID() |
| <code>keyup</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 현재 셀 기준 처리는 grid.getActiveCellID() |

## L

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>label</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeNodeModel({ ... }) — 행](/datagridview/api/data#new-treenodemodel-—-행) | 트리 컬럼(dataIndex 'tree') 값 |
| <code>label</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 글자 / 툴팁 / 라벨 표시 여부 |
| <code>layout</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 내부 확장용. 일반적으로 지정하지 않음 |
| <code>layoutDensity</code> | [layoutOptions › 행 높이](/datagridview/api/layout-options#행-높이) | 밀도 (행 기본 26 / 40px) |
| <code>layoutOptions</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 레이아웃 옵션. 생성할 때만 지정 가능 |
| <code>liveChange</code> | [이벤트 › 셀 편집기(Tweaker)에서 버블링되는 이벤트](/datagridview/api/events#셀-편집기-tweaker-에서-버블링되는-이벤트) | 데이터 반영은 컬럼 liveUpdateFlag:true 일 때만 |
| <code>liveUpdateFlag</code> | [컬럼 옵션 › 편집](/datagridview/api/column-options#편집) | 입력 중에도 값 반영 |
| <code>loadCustomViews</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | 사용자 뷰 목록을 통째로 바꾸고 `current` 뷰를 적용 (10). `current` 는 순번 또는 identifier. 뷰의 형식은 [뷰 하나의 키](/datagridview/custom-views#뷰-하나의-키). `layoutDensity` 가 있는 뷰를 넣으면 그 밀도가 원래 밀도가 되어 기본 뷰로 돌아가지 않음 ([주의](/datagridview/custom-views#주의)) |

## M

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>mapGroupingKeys</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | 키를 한꺼번에 다른 키로 바꿈 |
| <code>massUpdateAllowedFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 여러 행 일괄 수정 허용 |
| <code>maxAppliedFilterCount</code> | [하위 옵션 객체 › filterViewOptions](/datagridview/api/sub-options#filterviewoptions) | 동시에 적용할 수 있는 필터 수 |
| <code>maxDepth</code> | [하위 옵션 객체 › rowGroupingOptions](/datagridview/api/sub-options#rowgroupingoptions) | depth 가 함수일 때만 쓰임. 이 깊이까지만 내려가며 묶음 |
| <code>maxSortedColumnsCount</code> | [하위 옵션 객체 › sortOptions](/datagridview/api/sub-options#sortoptions) | 동시 정렬 최대 컬럼 수 |
| <code>maxVisibleRowCount</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 그리드 높이를 행 N개 높이로 자동 계산 |
| <code>minWidth</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 너비 (`setColumnWidth` 를 거침) |
| <code>minWidth</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 최소 너비 |
| <code>model</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 내부 확장용. 일반적으로 지정하지 않음 |
| <code>moveColumn</code> | [레이아웃 메서드 (grid.layout) › 컬럼 고정과 순서](/datagridview/api/layout-methods#컬럼-고정과-순서) | `column` 을 `targetColumn` 자리로 옮김. 옮겼으면 true. `columnOrderChange` 이벤트 발생 |

## N

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>nodeModel</code> | [컬럼 함수 › cellInfos 구조 (위 함수들의 인자)](/datagridview/api/column-functions#cellinfos-구조-위-함수들의-인자) | 행 데이터. 값은 <code>nodeModel.options.grid.키</code>, <code>nodeModel.options.label</code> 로 읽음 |
| <code>nodeModelClass</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 내부 확장용. 일반적으로 지정하지 않음 |
| <code>nodeModelClass</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeDocument({ ... }) — 데이터 묶음](/datagridview/api/data#new-treedocument-—-데이터-묶음) | 행 클래스 교체 |

## O

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>onCellRequest</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | 셀 DOM 을 직접 그림. 지정하면 기본 렌더링(defaultOnCellRequest) 대신 호출. 데이터 행의 셀에서만 호출 ([셀 직접 그리기](/datagridview/custom-cell)) |
| <code>onChange</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | onPreAdd, onPreRemove, onPreEmpty (변경 전) 도 있음 |
| <code>onContextualEvent</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 우클릭 메뉴 직접 구성. params.cellInfos = 우클릭한 셀, params.collectionView = 그리드 ([우클릭 메뉴](/datagridview/context-menu)) |
| <code>onDelayedModelDataRequest</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 화면에 보이는 행 범위(<code>startNodeIndex</code>, <code>endNodeIndex</code>)를 알려 주는 콜백. 느린 컬럼 값을 보이는 행만 채울 때 ([보이는 행의 값만 나중에 채우기](/datagridview/server-side#예제-6-대안-보이는-행의-값만-나중에-채우기)) |
| <code>onEmpty</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | onPreAdd, onPreRemove, onPreEmpty (변경 전) 도 있음 |
| <code>onEndResizeOrOnReadyModelRequest</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | 준비됐을 때와 크기가 바뀐 뒤 <code>fn({ RowMaxNumber, ColumnsMaxNumber, viewportDimensions, event })</code> / 처리 끝 알림 (2) |
| <code>onInfiniteScroll</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | 스크롤이 아래 / 오른쪽 끝에 닿으면 <code>fn({ reachBottom, reachRight, isVeryCloseFromBottom, isVeryCloseFromRight })</code> (7). <code>options</code> 는 <code>{ verticalTolerance: 10, horizontalTolerance: 10 }</code> (px) |
| <code>onlySelectedRows</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 선택된 행만 |
| <code>onNodeLiveUpdate</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 입력 중 실시간 호출 (module/func 방식은 소스상 버그로 동작 안 함 → function 사용) |
| <code>onNodeModelUpdate</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | 어떤 경로로 바뀌든 값 변경을 한 곳에서 받기 |
| <code>onNodeUpdate</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 값이 확정되면 호출 (검색창 Enter, 콤보 선택). `updateNodeModel` 로 항목을 바꿀 때도 매번 호출 |
| <code>onOutOfBoundSortRequest</code> | [하위 옵션 객체 › sortOptions](/datagridview/api/sub-options#sortoptions) | 최대 개수를 넘는 정렬 요청 시 호출 |
| <code>onPostAdd</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | webapps 각 50회 사용. 선택 목록은 treeDocument.getSelectedNodes(). 예제: [우클릭 메뉴와 선택](/datagridview/context-menu#선택-변경-받기) |
| <code>onPostCollapse</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | - |
| <code>onPostExpand</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | - |
| <code>onPostRemove</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | webapps 각 50회 사용. 선택 목록은 treeDocument.getSelectedNodes(). 예제: [우클릭 메뉴와 선택](/datagridview/context-menu#선택-변경-받기) |
| <code>onPostUpdateView</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 화면 갱신이 끝날 때마다 / 다음 한 번만 `fn` 실행 |
| <code>onPostUpdateViewOnce</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 화면 갱신이 끝날 때마다 / 다음 한 번만 `fn` 실행 |
| <code>onPreCollapse</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | - |
| <code>onPreExpand</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 행을 펼치기 직전 알림. 다시 등록하면 이전 콜백을 대체 |
| <code>onPreExpand</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | 하위 행 지연 로딩. 다시 등록하면 이전 콜백을 대체. 예제: [트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기) |
| <code>onReady</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 그리드가 준비되면 `fn` 실행 (36). 이미 준비됐으면 바로 실행. inject 직후에 스크롤, 선택, 너비 맞춤을 할 때 사용 |
| <code>onUpdate</code> | [이벤트 › 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확](/datagridview/api/events#데이터-treedocument-쪽-알림-—-행-선택-값-변경은-여기서-받는-것이-정확) | 끌어서 행을 옮긴 뒤에도 불림. 이때 updateType 에 이동 표시는 없음 ([순서가 바뀐 것을 알기](/datagridview/drag-and-drop#순서가-바뀐-것을-알기)) |
| <code>openPrintableViewWindow</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | 인쇄용 화면을 만들어 엶. 컬럼 옵션 `printableFlag: false` 인 컬럼은 제외 |
| <code>overflowPriority</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 묶음, 순서, 공간 부족 시 드롭다운으로 넘어가는 우선순위 |

## P

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>pageScrollValueTriggeringInfiniteScroll</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | <code>onInfiniteScroll</code> 콜백을 바닥보다 일찍 부른다. 0.5 면 스크롤할 수 있는 거리의 절반 지점 ([스크롤이 끝에 닿으면 행 더하기](/datagridview/server-side#예제-5-대안-스크롤이-끝에-닿으면-행-더하기)) |
| <code>paginationManager</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 행을 페이지로 나눠 표시. pageSize 기본 100, currentPage 기본 1, nodeDepth 기본 0 (-1 이면 모든 깊이의 행을 셈). 모듈 <code>DS/DataGridView/DataGridViewPaginationManager</code> |
| <code>paste</code> | [이벤트 › 일반 DOM 이벤트 (그리드 영역)](/datagridview/api/events#일반-dom-이벤트-그리드-영역) | 그리드 기본 복사/붙여넣기 전후 처리 |
| <code>pinned</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 고정 (`setColumnPinned` 를 거침) |
| <code>pinned</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 좌/우 고정 |
| <code>placeholder</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 행이 없을 때 표시할 문구 |
| <code>placeholder</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 초기값, 콤보 목록, 안내 문구 |
| <code>position</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 왼쪽 / 가운데 / 오른쪽 |
| <code>possibleValues</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 초기값, 콤보 목록, 안내 문구 |
| <code>postEdit</code> | [이벤트 › 셀 편집기(Tweaker)에서 버블링되는 이벤트](/datagridview/api/events#셀-편집기-tweaker-에서-버블링되는-이벤트) | Tweakers.js onPostEdit. preEdit 와 짝 |
| <code>preEdit</code> | [이벤트 › 셀 편집기(Tweaker)에서 버블링되는 이벤트](/datagridview/api/events#셀-편집기-tweaker-에서-버블링되는-이벤트) | Tweakers.js setTweakerValue |
| <code>preExpandDone</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 비동기 펼치기에서 "하위 행 준비 끝" 을 알림 |
| <code>preferencesToApply</code> | [layoutOptions › 그 밖](/datagridview/api/layout-options#그-밖) | 만들 때 한 번 적용할 화면 상태. `grid.layout.exportPreferencesInJson()` 결과와 같은 형식. 그리드 `identifier` 가 있어야 적용되고, 없으면 무시됨 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views#옵션)) |
| <code>prepareUpdate</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 여러 변경을 묶어 한 번에 화면 반영 |
| <code>prepareUpdateView</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 화면 갱신을 묶기. 짝을 맞춰 부르고 마지막 push 때 한 번 다시 그림 |
| <code>preselectedCellChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | 현재 셀: grid.getPreselectedCellID() |
| <code>printableFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 인쇄/내보내기 포함 |
| <code>priority</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 묶음, 순서, 공간 부족 시 드롭다운으로 넘어가는 우선순위 |
| <code>processCellValueFromPaste</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | 붙여넣기(Ctrl+V)한 글자를 셀 값으로 바꿈. 돌려준 값이 편집 가능한 셀에 들어감 |
| <code>pushUpdate</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 여러 변경을 묶어 한 번에 화면 반영 |
| <code>pushUpdateView</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 화면 갱신을 묶기. 짝을 맞춰 부르고 마지막 push 때 한 번 다시 그림 |

## R

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>readOnly</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 표시 / 비활성 / 읽기전용 |
| <code>reapplyRowGrouping</code> | [그리드 메서드 › 정렬, 그룹 다시 적용](/datagridview/api/grid-methods#정렬-그룹-다시-적용) | 지금 그룹 설정으로 다시 묶음. 묶은 뒤 추가한 행은 자동으로 그룹에 들어가지 않으므로 이때 부름 ([행 그룹핑](/datagridview/row-grouping#예제-9-행을-추가한-뒤-다시-묶기)) |
| <code>reapplySortModel</code> | [그리드 메서드 › 정렬, 그룹 다시 적용](/datagridview/api/grid-methods#정렬-그룹-다시-적용) | 지금 `sortModel` 로 다시 정렬. 행을 추가하거나 값을 바꾼 뒤 순서를 다시 맞출 때 |
| <code>registerReusableCellContent</code> | [그리드 메서드 › 우클릭 메뉴, 셀 직접 그리기, 상태바](/datagridview/api/grid-methods#우클릭-메뉴-셀-직접-그리기-상태바) | 직접 그리는 셀의 내용 등록 (31). 같은 id 로 다시 등록하면 대체 ([셀 직접 그리기](/datagridview/custom-cell)) |
| <code>remove</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 이 행 제거 (최상위 행에도 사용 가능) |
| <code>removeColumnOrGroup</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 컬럼 삭제. `key` 는 getColumnOrGroup 과 같음 |
| <code>removeEventListener</code> | [이벤트 › 등록 / 해제](/datagridview/api/events#등록-해제) | ※ 원래 fn 이 아니라 addEventListener 의 반환값으로 해제해야 한다 |
| <code>removeModalLoader</code> | [그리드 메서드 › 로딩 표시](/datagridview/api/grid-methods#로딩-표시) | 로딩 표시 제거 |
| <code>removeRoot</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 최상위 행 추가 / 삭제 |
| <code>requestDelayedModelData</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | 그리드 옵션 <code>onDelayedModelDataRequest</code> 콜백을 지금 부르게 함 (6). <code>allRows: true</code> 면 범위가 전체 행 (전체 컬럼). <code>context</code> 를 생략하면 콜백의 <code>info.context</code> 는 <code>undefined</code> |
| <code>resetRowHeight</code> | [레이아웃 메서드 (grid.layout) › 높이](/datagridview/api/layout-methods#높이) | 행 하나만 다시 계산. 음수를 주면 헤더 줄 |
| <code>resetRowHeights</code> | [레이아웃 메서드 (grid.layout) › 높이](/datagridview/api/layout-methods#높이) | 저장해 둔 행 높이를 모두 버리고 다시 계산. `getRowHeightFunction` 을 바꾼 뒤에 부름 |
| <code>resetTreeDocument</code> | [그리드 메서드 › 행을 나눠 불러오기](/datagridview/api/grid-methods#행을-나눠-불러오기) | <code>dataSource</code> 그리드의 행과 선택을 비우고 처음부터 다시 불러옴. <code>treeDocument</code> 그리드에서는 아무 일도 안 함 |
| <code>resizableFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 너비 조절 |
| <code>reuseCellContent</code> | [그리드 메서드 › 우클릭 메뉴, 셀 직접 그리기, 상태바](/datagridview/api/grid-methods#우클릭-메뉴-셀-직접-그리기-상태바) | 등록한 내용 하나를 꺼냄 (31). 컬럼 `onCellRequest` 안에서 사용 |
| <code>rootMargin</code> | [하위 옵션 객체 › treeNodeCellOptions](/datagridview/api/sub-options#treenodecelloptions) | 최상위 행 왼쪽 여백 |
| <code>rowDragEnabledFlag</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 행 머리에 손잡이를 보이고 행을 끌 수 있게 함. 켜면 행 순서 바꾸기도 같이 켜짐 (막으려면 rowReorderEnabledFlag: false) |
| <code>rowGroupingEnabledFlag</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 사용자가 화면에서 행을 묶는 기능 허용. 코드로 부르는 groupRows 는 막지 않음 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>rowGroupingOptions</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 행을 묶는 방법. 이것만으로는 묶이지 않고 groupRows 를 불러야 함 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>rowID</code> | [그리드 메서드 › 먼저 알아 둘 것: cellID 와 rowID](/datagridview/api/grid-methods#먼저-알아-둘-것-cellid-와-rowid) | `cellInfos.rowID` |
| <code>rowID</code> | [컬럼 함수 › cellInfos 구조 (위 함수들의 인자)](/datagridview/api/column-functions#cellinfos-구조-위-함수들의-인자) | rowID -1 = 컬럼 헤더 줄, columnID -1 = 행 머리(번호) 칸 |
| <code>rowMaxHeight</code> | [layoutOptions › 행 높이](/datagridview/api/layout-options#행-높이) | 행 최대 높이 |
| <code>rowReorderEnabledFlag</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 끌어 온 행을 그리드가 옮겨 주는 기본 동작 허용. rowDragEnabledFlag 도 true 여야 동작 ([드래그앤드롭](/datagridview/drag-and-drop#옵션-네-개와-잡는-곳)) |
| <code>rowSelection</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 행 선택 방식 (CollectionView) |
| <code>rowsHeader</code> | [layoutOptions › 헤더 (컬럼 헤더, 행 머리)](/datagridview/api/layout-options#헤더-컬럼-헤더-행-머리) | 행 머리(번호, 체크박스 영역) 표시 |
| <code>rowSpacing</code> | [layoutOptions › 행 높이](/datagridview/api/layout-options#행-높이) | 행 간격 |

## S

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>saveColumnSortModelInPreferences</code> | [레이아웃 메서드 (grid.layout) › 화면 상태 저장 (preferences)](/datagridview/api/layout-methods#화면-상태-저장-preferences) | 지금 정렬 상태를 화면 상태에 저장 |
| <code>scrollToCellAt</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 셀이 왼쪽 위에 오도록 스크롤 |
| <code>scrollToCellAt</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 셀이 왼쪽 위에 오도록 스크롤 |
| <code>select</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 행 선택 제어 |
| <code>selectableFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 셀 선택 가능 |
| <code>selectAll</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 전체 선택. `'multiple'` 일 때만. `true` 면 펼쳐져 보이는 행만. <code>dataSource</code> 그리드에서는 불러온 행만 선택 |
| <code>selectAllVisibleNodes</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | `selectAll(true)` 와 같음 |
| <code>selectCell</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 셀 선택. 셀 선택 모드가 아니면 그 셀의 행 선택 / 활성화 |
| <code>selectColumn</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 컬럼 선택 (`columnSelection` 옵션 필요) |
| <code>selectColumnOrGroup</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 컬럼 그룹의 하위 컬럼을 한 번에 선택 / 해제. 인자는 컬럼 정의 객체 |
| <code>selectionBehavior</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 선택 동작 세부 설정 |
| <code>selectionStyle</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 선택 표시 스타일 (lightSelectionEdging = 테두리 위주의 옅은 표시) |
| <code>selectNextCellOnEnterFlag</code> | [그리드 옵션 › 편집 / 키보드](/datagridview/api/grid-options#편집-키보드) | Enter 로 편집 완료 후 아래 셀 선택 |
| <code>selectNodeModel</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 행 선택. `add: true` 면 기존 선택 유지 (multiple). `range: true` 면 활성 셀 행부터 node 까지 범위 선택 |
| <code>selectNodeModelOnCellSelection</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | 셀 선택 시 행도 선택 |
| <code>selectOnContextualEvent</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | 우클릭 시 선택 |
| <code>selectOnPointerUp</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | 마우스를 뗄 때 선택 |
| <code>semantics</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 편집기 세부 옵션 (콤보 목록, 최소/최대값 등) |
| <code>setActiveCell</code> | [그리드 메서드 › 활성 셀 (포커스)](/datagridview/api/grid-methods#활성-셀-포커스) | 활성 셀 바꾸기. `scroll` 이 `false` 가 아니면 셀이 보이도록 스크롤. `activeCellChange` 이벤트 발생 |
| <code>setBadges</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 아이콘, 배지 읽기 / 바꾸기 |
| <code>setCellInEdition</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 셀을 편집 상태로 전환 (활성 셀로 만들고 편집기를 엶). 편집할 수 없는 셀이면 `false` |
| <code>setCellValue</code> | [컬럼 함수 › 값 (표시 / 저장 / 정렬)](/datagridview/api/column-functions#값-표시-저장-정렬) | 편집 결과 저장 방법을 직접 지정. cellInfos.cellModel = 바뀌기 전 값 |
| <code>setColumnAutoRowHeightFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 내용에 맞춘 행 높이 자동 켜기 / 끄기 ([행 높이](/datagridview/row-height)) |
| <code>setColumnGroupExpandedFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 그룹](/datagridview/api/layout-methods#컬럼-그룹) | 컬럼 그룹 접기 / 펼치기. `columnGroupExpandedState` 이벤트 발생 |
| <code>setColumnOrGroupPinned</code> | [레이아웃 메서드 (grid.layout) › 컬럼 그룹](/datagridview/api/layout-methods#컬럼-그룹) | 그룹 전체를 고정 |
| <code>setColumnOrGroupProperties</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 컬럼(또는 그룹)의 여러 설정을 한 번에 바꾸고 그 컬럼만 다시 그림 |
| <code>setColumnPinned</code> | [레이아웃 메서드 (grid.layout) › 컬럼 고정과 순서](/datagridview/api/layout-methods#컬럼-고정과-순서) | 고정 위치 바꾸기. `pinned` 는 `'left'`, `'right'`, `'unpinned'` |
| <code>setColumnsWidth</code> | [레이아웃 메서드 (grid.layout) › 컬럼 너비](/datagridview/api/layout-methods#컬럼-너비) | 여러 컬럼 너비를 한 번에. 이벤트는 한 번(`columnIDs`)만 발생 |
| <code>setColumnTypeRepresentation</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 셀 타입 바꾸기 |
| <code>setColumnVisibleFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 보이기와 숨기기](/datagridview/api/layout-methods#컬럼-보이기와-숨기기) | 컬럼 표시 / 숨김. `columnVisibleStateChange` 이벤트 발생. `alwaysVisibleFlag: true` 인 컬럼은 숨길 수 없음 |
| <code>setColumnWidth</code> | [레이아웃 메서드 (grid.layout) › 컬럼 너비](/datagridview/api/layout-methods#컬럼-너비) | 너비 바꾸기. `width` 는 숫자(px) 또는 `'auto'`. `minWidth` 보다 작으면 `minWidth` 로. `columnWidthChange` 이벤트 발생 |
| <code>setFilterModel</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeDocument](/datagridview/api/data#treedocument) | 컬럼 필터 지정 ([필터](/datagridview/api/filter)) |
| <code>setFindStr</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 찾기 실행 / 닫기 |
| <code>setIcons</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 아이콘, 배지 읽기 / 바꾸기 |
| <code>setLabel</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 트리 컬럼 값 읽기 / 바꾸기 |
| <code>setModelAt</code> | [그리드 메서드 › 셀 정보와 값](/datagridview/api/grid-methods#셀-정보와-값) | 셀 값 바꾸기. 컬럼 `setCellValue` 가 있으면 그것을 거침 |
| <code>setPreselectedCell</code> | [그리드 메서드 › 활성 셀 (포커스)](/datagridview/api/grid-methods#활성-셀-포커스) | 마우스를 올린 것처럼 셀을 강조. `preselectedCellChange` 이벤트 발생. 터치 모드에서는 동작하지 않음 |
| <code>setScrollerPosition</code> | [그리드 메서드 › 스크롤과 강조](/datagridview/api/grid-methods#스크롤과-강조) | 스크롤 위치 읽기 / 쓰기 (화면 복원용) |
| <code>setToolbar</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 툴바 만들기 / 읽기. [툴바](/datagridview/toolbar) 참고 |
| <code>setUseClipboardFlag</code> | [그리드 메서드 › 툴바, 그룹, 내보내기](/datagridview/api/grid-methods#툴바-그룹-내보내기) | 기본 true. `false` 로 하면 Ctrl+C / Ctrl+X / Ctrl+V 때 그리드가 셀 값을 시스템 클립보드로 복사 / 붙여넣기 하지 않음 (앱이 복사 동작을 직접 처리할 때) |
| <code>shouldAcceptDrag</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeDocument({ ... }) — 데이터 묶음](/datagridview/api/data#new-treedocument-—-데이터-묶음) | false 면 그 행은 끌리지 않음. 기본은 항상 true ([예제](/datagridview/drag-and-drop#예제-7-특정-행은-못-끌게-하기)) |
| <code>shouldAcceptDrop</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeDocument({ ... }) — 데이터 묶음](/datagridview/api/data#new-treedocument-—-데이터-묶음) | 끌어 온 행을 그 자리에 놓아도 되는지. info = { dropNode, dropPosition, parentTreeNodeModel, draggedNodes, draggedTreeNodeModel }. 기본은 항상 true ([놓아도 되는 자리 정하기](/datagridview/drag-and-drop#놓아도-되는-자리-정하기-shouldacceptdrop)) |
| <code>shouldCellAllowUnsafeHTMLContentAt</code> | [컬럼 함수 › 모양](/datagridview/api/column-functions#모양) | 셀 단위로 HTML 렌더링 허용 (allowUnsafeHTMLContent 의 셀 버전) |
| <code>shouldNodeBeRepresented</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | false 를 돌려주는 행은 그리드에 표시하지 않음 |
| <code>show</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 행 보이기 / 숨기기 |
| <code>showAlternateBackgroundFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 줄무늬 배경 |
| <code>showBackgroundFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 그리드 배경 |
| <code>showColumnBorderFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 컬럼 세로 구분선 |
| <code>showConfirmationDialog</code> | [하위 옵션 객체 › deleteOptions](/datagridview/api/sub-options#deleteoptions) | 삭제 전 확인창 |
| <code>showContextualMenuColumnFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 오른쪽 끝에 메뉴 버튼 컬럼 추가. 버튼을 누르면 onContextualEvent 가 호출됨 |
| <code>showCustomViewsDialog</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | 사용자 뷰 대화상자 열기 (10). 헤더 우클릭 기본 메뉴의 "테이블 보기 구성..." 과 같음 |
| <code>showEditableFeedbackFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 편집 가능한 셀 표시 |
| <code>showIconsFlag</code> | [하위 옵션 객체 › treeNodeCellOptions](/datagridview/api/sub-options#treenodecelloptions) | 트리 셀 아이콘 표시 |
| <code>showMatchingCellBackgroundFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 찾기(find) 결과 셀 배경 강조 |
| <code>showMixedStateOnParents</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | 트리에서 자식 일부 선택 시 부모 체크박스 중간 상태 |
| <code>showModelChangesFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 변경된 셀 강조 |
| <code>showModelMassUpdateDialog</code> | [그리드 메서드 › 사용자 뷰, 일괄 수정, 인쇄](/datagridview/api/grid-methods#사용자-뷰-일괄-수정-인쇄) | 여러 행 일괄 수정 대화상자 열기. `editableFlag` 와 `massUpdateAllowedFlag` 가 모두 true 인 컬럼이 대상 |
| <code>showNodeKPIColorFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 행 KPI 색상 표시 (컬럼 getCellKPIColor 와 같이 사용) |
| <code>showOutlineFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 그리드 외곽선 |
| <code>showRequiredFeedbackFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 필수 값(requiredFlag) 셀 표시 |
| <code>showRowBorderFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 행 가로 구분선 |
| <code>showRowHeaderBackgroundFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 행 머리(번호 영역) 배경 |
| <code>showRowIndexFlag</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 행 번호 |
| <code>showScrollbarsOnHover</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 마우스를 올렸을 때만 스크롤바 표시 |
| <code>showSelectionCheckBoxesFlag</code> | [그리드 옵션 › 선택](/datagridview/api/grid-options#선택) | 행 머리 선택 체크박스. 'OnOver' = 마우스 올릴 때만, true = 항상, false = 안 보임 |
| <code>showTextFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 헤더 글자, 아이콘 (`showTextFlag` 는 `text` 나 `icon` 과 같이 넣을 때만 반영) |
| <code>showTextFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 셀 글자 표시 (false 면 아이콘만) |
| <code>sizeAllColumnsToFit</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 모든 컬럼 너비를 내용에 맞춤 (화면에 보이는 행 기준). `options` 는 아래 sizeColumnsToFit 과 같음 |
| <code>sizeColumnOrGroupToFit</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 컬럼 그룹 헤더 칸(`rowID` -2 등) 기준으로 하위 컬럼을 모두 내용에 맞춤 |
| <code>sizeColumnsToFit</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 여러 컬럼 너비를 내용에 맞춤. `columns` 는 dataIndex, 컬럼 번호, 컬럼 정의 객체의 배열. `options` 는 `{ computeAllRows, minMax, computeColumnHeader, isUserInteraction }`. 기본은 화면에 보이는 행만 재고, `computeAllRows: true` 면 모든 행, `minMax: { minRowID, maxRowID }` 면 그 범위의 행을 잼. `computeColumnHeader: true` 면 헤더 글자 길이도 계산에 넣음 |
| <code>sizeColumnToFit</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 내용 길이에 맞게 컬럼 너비 조정. 계산된 너비 반환 |
| <code>sortableFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 정렬 가능 |
| <code>sortModel</code> | [그리드 옵션 › 정렬 / 필터 / 찾기](/datagridview/api/grid-options#정렬-필터-찾기) | 정렬 상태. 배열 순서 = 우선순위. [] = 정렬 해제 |
| <code>sortModelChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | 현재 정렬: grid.sortModel |
| <code>sortOptions</code> | [그리드 옵션 › 정렬 / 필터 / 찾기](/datagridview/api/grid-options#정렬-필터-찾기) | 다중 정렬 제한 |
| <code>splittableFlag</code> | [컬럼 옵션 › 컬럼 그룹 (2단 헤더)](/datagridview/api/column-options#컬럼-그룹-2단-헤더) | 그룹에 넣음. false 면 헤더를 끌어 컬럼 순서를 바꿀 때 그룹 밖의 컬럼이 그룹 사이로 끼어들거나 하위 컬럼이 그룹 밖으로 나갈 수 없음 |
| <code>subscribeOnceToAllCellsRendered</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 다음 렌더링이 끝나면 한 번만 `fn` 실행 |
| <code>syncClientModelOnDemand</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | <code>dataSource.pushUpdatesNotifications</code> 로 받은 변경을 바로 반영하지 않고 모아 둔다. <code>grid.executePendingNotifications()</code> 를 부를 때 반영 ([서버가 먼저 알려 주는 변경](/datagridview/server-side#서버가-먼저-알려-주는-변경)) |

## T

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>text</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 헤더 글자, 아이콘 (`showTextFlag` 는 `text` 나 `icon` 과 같이 넣을 때만 반영) |
| <code>text</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 헤더 글자 |
| <code>toggle</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | 클릭할 때마다 선택/해제 토글 (Ctrl 없이 다중 선택) |
| <code>tooltip</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 글자 / 툴팁 / 라벨 표시 여부 |
| <code>tooltipInfos</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 컴포넌트 툴팁 |
| <code>touchMode</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 터치 모드 (행 높이 40px 등) |
| <code>treeDocument</code> | [그리드 메서드 › 데이터 (TreeDocument, 행)](/datagridview/api/grid-methods#데이터-treedocument-행) | 위와 같은 객체. 대입하면 데이터 교체: `grid.treeDocument = newDoc` |
| <code>treeDocument</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | 표시할 데이터. 행 = TreeNodeModel |
| <code>treeNodeCellOptions</code> | [그리드 옵션 › 표시](/datagridview/api/grid-options#표시) | 트리 컬럼(dataIndex tree) 표시 방식 |
| <code>typeRepresentation</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 셀 타입, 행 높이 자동 |
| <code>typeRepresentation</code> | [컬럼 옵션 › 기본](/datagridview/api/column-options#기본) | 셀 모양/편집기 종류 |
| <code>typeRepresentation</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 항목 종류 |
| <code>typeRepresentations</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 툴바에서 쓸 사용자 enum / 타입 등록 |

## U

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>uncommittedChange</code> | [이벤트 › 셀 편집기(Tweaker)에서 버블링되는 이벤트](/datagridview/api/events#셀-편집기-tweaker-에서-버블링되는-이벤트) | - |
| <code>unselect</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 행 선택 제어 |
| <code>unselectAll</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 행, 셀, 컬럼 선택 모두 해제 |
| <code>unselectAllOnEmptyArea</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | 빈 영역 클릭 시 선택 해제 |
| <code>unselectAllOnEscapeKey</code> | [하위 옵션 객체 › selectionBehavior](/datagridview/api/sub-options#selectionbehavior) | Esc 로 선택 해제 |
| <code>unselectColumn</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 컬럼 선택 (`columnSelection` 옵션 필요) |
| <code>unselectColumnOrGroup</code> | [그리드 메서드 › 컬럼](/datagridview/api/grid-methods#컬럼) | 컬럼 그룹의 하위 컬럼을 한 번에 선택 / 해제. 인자는 컬럼 정의 객체 |
| <code>unselectNodeModel</code> | [그리드 메서드 › 선택](/datagridview/api/grid-methods#선택) | 행 선택 해제 (`node.unselect()` 와 같음) |
| <code>unsubscribe</code> | [그리드 메서드 › 준비 시점과 크기](/datagridview/api/grid-methods#준비-시점과-크기) | 위 함수들이 돌려준 구독 토큰으로 해제 |
| <code>updateColumnView</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 컬럼 하나의 보이는 셀만 다시 그림 (`updateRenderedColumn` 과 같음) |
| <code>updateOptions</code> | [데이터 (TreeDocument / TreeNodeModel) › TreeNodeModel](/datagridview/api/data#treenodemodel) | 셀 값 바꾸기 (화면 자동 반영) |
| <code>updateRowView</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 행 하나만 다시 그림 (`updateRenderedRow` 와 같음) |
| <code>updateView</code> | [그리드 메서드 › 화면 갱신](/datagridview/api/grid-methods#화면-갱신) | 보이는 영역을 다시 그림 |
| <code>useAsyncPreExpand</code> | [그리드 옵션 › 드래그 / 그룹](/datagridview/api/grid-options#드래그-그룹) | 트리 펼치기 비동기 처리 ([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)) |
| <code>useAsyncPreExpand</code> | [데이터 (TreeDocument / TreeNodeModel) › new TreeDocument({ ... }) — 데이터 묶음](/datagridview/api/data#new-treedocument-—-데이터-묶음) | 펼칠 때 <code>node.preExpandDone()</code> 이 불릴 때까지 기다림. 하위 행 지연 로딩용 ([트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기)) |
| <code>useLastColumnWidthAutoFlag</code> | [layoutOptions › 컬럼 너비](/datagridview/api/layout-options#컬럼-너비) | 마지막 컬럼이 남은 너비를 채움 |
| <code>userPreferencesChange</code> | [이벤트 › 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)](/datagridview/api/events#그리드-자체-이벤트-datagridview-collectionview-가-fire) | event.options 는 빈 객체. 한 번 조작에 여러 번 남 (헤더 경계 끌기 1번, 컬럼 하나를 끌어 옮기기 6번, loadCustomViews 8번) 이므로 모아서 처리. 바뀐 내용은 grid.layout.exportPreferencesInJson() 으로 읽음 ([사용자 뷰와 화면 상태 저장](/datagridview/custom-views#이벤트와-콜백)) |
| <code>useWidgetPreferencesFlag</code> | [그리드 옵션 › 정렬 / 필터 / 찾기](/datagridview/api/grid-options#정렬-필터-찾기) | 화면 상태를 저장하는 곳. false = 브라우저 localStorage, true = 위젯 설정. 저장 자체는 `identifier` 가 있어야 동작 ([저장 위치](/datagridview/custom-views#저장-위치)) |

## V

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>value</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 초기값, 콤보 목록, 안내 문구 |
| <code>value</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 버튼 타입에서는 초기값이 아니라 클릭 시 호출하는 함수. 인자 e.context 는 action 과 같음 |
| <code>virtuallyLoadAllModelItems</code> | [그리드 옵션 › 데이터](/datagridview/api/grid-options#데이터) | <code>dataSource</code> 와 같이 쓸 때, 스크롤 막대를 처음부터 전체 길이로 잡고 보이는 위치의 행만 불러온다. <code>treeDocument</code> 그리드에서는 상태바 행 수 계산만 바뀐다 ([불러오는 방식 두 가지](/datagridview/server-side#불러오는-방식-두-가지)) |
| <code>visibleFlag</code> | [그리드 옵션 › 공통 (Controls/Abstract, CollectionView)](/datagridview/api/grid-options#공통-controls-abstract-collectionview) | 표시 여부 |
| <code>visibleFlag</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 표시 (`setColumnVisibleFlag` 를 거침) |
| <code>visibleFlag</code> | [컬럼 옵션 › 표시 / 기능 on-off](/datagridview/api/column-options#표시-기능-on-off) | 컬럼 표시 |
| <code>visibleFlag</code> | [툴바 (setToolbar)](/datagridview/api/toolbar) | 표시 / 비활성 / 읽기전용 |

## W

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>width</code> | [레이아웃 메서드 (grid.layout) › 컬럼 설정 바꾸기](/datagridview/api/layout-methods#컬럼-설정-바꾸기) | 너비 (`setColumnWidth` 를 거침) |
| <code>width</code> | [컬럼 옵션 › 크기 / 위치](/datagridview/api/column-options#크기-위치) | 너비 |
