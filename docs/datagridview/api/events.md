---
title: 이벤트
---

# 이벤트 <Badge type="tip" text="서버 확인" />

```js
grid.addEventListener('이벤트', function (event, cellInfos) { ... });
```

DataGridView 의 `addEventListener` 는 CollectionView 에서 재정의되어 있어, 이벤트가 셀 안에서 발생하면 **두 번째 인자로 그 셀의 cellInfos** (cellID, rowID, columnID, cellModel, nodeModel, cellView) 를 넘겨줍니다. 셀 밖이면 event 만 넘어옵니다.

- `event.dsModel` 은 그리드, `event.options` 에 추가 정보가 들어 있습니다.
- 그리드 영역 DOM 에 등록되므로 일반 DOM 이벤트(click 등)와 셀 편집기에서 버블링되는 이벤트도 모두 받을 수 있습니다.
- [실시간 설정 샘플](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/05_options.html) 의 이벤트 로그에서 실제로 언제 발생하는지 확인할 수 있습니다.

::: info 근거
CollectionView.js 의 CollectionView.addEventListener (cellInfos 를 붙여 감싼 함수 반환) 와 `fire(...)` 호출부, DataGridView.js 의 `fire(...)` 호출부, Tweakers.js 의 setTweakerValue / onPostEdit, TreeModel.js 의 TreeDocument 알림 함수. 사용 횟수는 enovia2025 webapps 전체 소스에서 센 값.
:::

## 그리드 자체 이벤트 (DataGridView / CollectionView 가 fire)

| 이벤트 | 발생 시점 | event.options | 2번째 인자 cellInfos | 설명 / 사용 팁 |
| --- | --- | --- | --- | --- |
| <code>activeCellChange</code> | 활성 셀이 바뀔 때 (클릭, 키보드 이동) | - | 없음 | 현재 셀: grid.getCellInfosAt(grid.getActiveCellID()) |
| <code>preselectedCellChange</code> | 마우스를 올린 셀이 바뀔 때 | - | 없음 | 현재 셀: grid.getPreselectedCellID() |
| <code>allCellsRendered</code> | 화면에 보이는 셀 렌더링이 끝날 때마다 (초기, 스크롤, 데이터 변경 후) | - | 없음 | 로딩 완료 후 처리에 가장 많이 사용 (webapps 12회). 한 번만 받으려면 grid.subscribeOnceToAllCellsRendered(fn) |
| <code>sortModelChange</code> | 정렬이 바뀔 때 (헤더 클릭, grid.sortModel 대입) | - | 없음 | 현재 정렬: grid.sortModel |
| <code>columnOrderChange</code> | 컬럼 순서가 바뀔 때 (헤더 드래그) | - | 없음 | - |
| <code>columnVisibleStateChange</code> | 컬럼 표시/숨김이 바뀔 때 | <code>{ visibleState, columnID }</code> | 없음 | - |
| <code>columnWidthChange</code> | 컬럼 너비가 바뀔 때 | { columnID } 또는 { columnIDs } | 없음 | - |
| <code>columnGroupExpandedState</code> | 컬럼 그룹(children) 펼침/접힘 | <code>{ visibleState, rowID, ... }</code> | 없음 | - |
| <code>userPreferencesChange</code> | 사용자 화면 상태(너비, 순서, 표시, 사용자 뷰)가 바뀔 때 | - | 없음 | 화면 상태를 저장할 시점 |

## 셀 편집기(Tweaker)에서 버블링되는 이벤트

| 이벤트 | 발생 시점 | event.options | 2번째 인자 cellInfos | 설명 / 사용 팁 |
| --- | --- | --- | --- | --- |
| <code>change</code> | 셀 편집 확정 (Enter, 포커스 이동, 콤보 선택, 체크 클릭) | - | 있음 | 그리드가 먼저 데이터에 반영하므로 리스너에서는 cellInfos.nodeModel 에 이미 새 값이 들어 있다 |
| <code>liveChange</code> | 입력 중 실시간 (글자 입력, 슬라이더 이동) | - | 있음 | 데이터 반영은 컬럼 liveUpdateFlag:true 일 때만 |
| <code>preEdit</code> | 편집 중 처음으로 값이 바뀔 때 (편집 시작) | - | 있음 | Tweakers.js setTweakerValue |
| <code>postEdit</code> | 값이 바뀐 편집이 끝날 때 | - | 있음 | Tweakers.js onPostEdit. preEdit 와 짝 |
| <code>uncommittedChange</code> | 확정 전 입력 변화 (일부 편집기) | - | 있음 | - |
| <code>buttonclick</code> | function / functionIcon 타입 셀의 버튼 클릭 | - | 있음 | 셀 안 버튼 동작 처리 |

## 일반 DOM 이벤트 (그리드 영역)

| 이벤트 | 발생 시점 | event.options | 2번째 인자 cellInfos | 설명 / 사용 팁 |
| --- | --- | --- | --- | --- |
| <code>click / dblclick</code> | 클릭 / 더블클릭 | - | 셀이면 있음 | 클릭한 행: cellInfos.nodeModel. 헤더면 rowID -1 |
| <code>contextmenu</code> | 우클릭 | - | 셀이면 있음 | webapps 에서 가장 많이 사용 (15회). 그리드 우클릭 메뉴를 바꾸려면 onContextualEvent 옵션 ([우클릭 메뉴](/datagridview/context-menu)) |
| <code>keydown / keyup</code> | 키 입력 | - | 셀 편집기 안이면 있음 | 현재 셀 기준 처리는 grid.getActiveCellID() |
| <code>dragstart / dragend / dragover / drop</code> | 드래그앤드롭 | - | 셀이면 있음 | rowDragEnabledFlag / cellDragEnabledFlag 와 같이 사용 (onDropCell 같은 옵션 콜백도 있음) |
| <code>copy / paste</code> | Ctrl+C / Ctrl+V | - | - | 그리드 기본 복사/붙여넣기 전후 처리 |

## 데이터(TreeDocument) 쪽 알림 — 행 선택, 값 변경은 여기서 받는 것이 정확

`grid.addEventListener` 가 아니라 TreeDocument 의 등록 함수에 콜백을 넘깁니다.

| 등록 함수 | 발생 시점 | 콜백 인자 | 설명 / 사용 팁 |
| --- | --- | --- | --- |
| <code>treeDocument.getXSO().onPostAdd(fn) / onPostRemove(fn)</code> | 행 선택 / 선택 해제 후 | - | webapps 각 50회 사용. 선택 목록은 treeDocument.getSelectedNodes(). 예제: [우클릭 메뉴와 선택](/datagridview/context-menu#선택-변경-받기) |
| <code>treeDocument.getXSO().onEmpty(fn) / onChange(fn)</code> | 선택 전체 해제 / 선택 변경 | - | onPreAdd, onPreRemove, onPreEmpty (변경 전) 도 있음 |
| <code>treeDocument.onNodeModelUpdate(fn)</code> | 행 값이 바뀔 때 (편집, updateOptions) | <code>e.data.nodeModel</code>, <code>e.data.attributes</code> | 어떤 경로로 바뀌든 값 변경을 한 곳에서 받기 |
| <code>treeDocument.onUpdate(fn)</code> | 데이터 갱신 (pushUpdate 등) | <code>e.options.updateType</code> | - |
| <code>treeDocument.onPreExpand(fn)</code> | 행을 펼치기 직전 | <code>e.target</code> = 펼치는 행 | 하위 행 지연 로딩. 다시 등록하면 이전 콜백을 대체. 예제: [트리 구조](/datagridview/tree#펼칠-때-하위-행-불러오기) |
| <code>treeDocument.onPostExpand / onPreCollapse / onPostCollapse(fn)</code> | 펼친 뒤 / 접기 전 / 접은 뒤 | <code>e.target</code> = 대상 행 | - |

## 등록 / 해제

| 호출 | 설명 |
| --- | --- |
| <code>var h = grid.addEventListener(이름, fn)</code> | 반환값 h 는 실제 DOM 에 등록된 감싼 함수 |
| <code>grid.removeEventListener(이름, h)</code> | ※ 원래 fn 이 아니라 addEventListener 의 반환값으로 해제해야 한다 |
