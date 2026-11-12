---
title: 하위 옵션 객체
---

# 하위 옵션 객체 <Badge type="info" text="원본 분석" />

그리드 옵션 중 객체로 넘기는 것들의 내부 키입니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  sortOptions: { maxSortedColumnsCount: 3 }
});
```

::: info 근거
DataGridView.js 의 DataGridView publishedProperties (`sortOptions`, `rowGroupingOptions`, `treeNodeCellOptions`, `customViewsOptions`, `filterViewOptions`, `deleteOptions`) 와 각 키를 읽는 코드 (`_preEditSortModel`, 삭제 키 처리 등), CollectionView.js 의 `selectionBehavior` 기본값.
:::

## selectionBehavior

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>toggle</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 클릭할 때마다 선택/해제 토글 (Ctrl 없이 다중 선택) |
| <code>unselectAllOnEmptyArea</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 빈 영역 클릭 시 선택 해제 |
| <code>unselectAllOnEscapeKey</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | Esc 로 선택 해제 |
| <code>selectNodeModelOnCellSelection</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 셀 선택 시 행도 선택 |
| <code>selectOnContextualEvent</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 우클릭 시 선택 |
| <code>selectOnPointerUp</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 마우스를 뗄 때 선택 |
| <code>showMixedStateOnParents</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 트리에서 자식 일부 선택 시 부모 체크박스 중간 상태 |

## sortOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>maxSortedColumnsCount</code> | <code>number</code> | - | 숫자 | 동시 정렬 최대 컬럼 수 |
| <code>onOutOfBoundSortRequest</code> | <code>function</code> | - | <code>function</code> | 최대 개수를 넘는 정렬 요청 시 호출 |

## deleteOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>deleteSelectionOnKeyPress</code> | <code>boolean</code> | - | <code>true &#124; false</code> | Delete 키로 선택 행 삭제 |
| <code>showConfirmationDialog</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 삭제 전 확인창 |

## filterViewOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>maxAppliedFilterCount</code> | <code>number</code> | - | 숫자 | 동시에 적용할 수 있는 필터 수 |
| <code>ignoreGroupingNodes</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 필터 팝업의 값 목록을 만들 때 그룹 행을 건너뜀. 그룹 행 자체는 이 값과 상관없이 필터 조건으로 걸러지지 않음 ([행 그룹핑](/datagridview/row-grouping#기능별-취급)) |

## customViewsOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>dialogMaximizedFlag</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 사용자 뷰 대화상자를 최대화로 열기. 키는 이것 하나 (2025, 2026 같음) |

뷰의 형식과 저장 방법은 [사용자 뷰와 화면 상태 저장](/datagridview/custom-views) 에 있습니다.

## rowGroupingOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>depth</code> | <code>number &#124; array &#124; function</code> | <code>0</code> | 숫자 &#124; 숫자 배열 &#124; fn(깊이) | 묶을 행의 깊이. 0 = 최상위 행, -1 = 모든 깊이. 함수는 깊이를 받아 boolean 을 돌려줌 (this = TreeDocument) |
| <code>maxDepth</code> | <code>number</code> | <code>undefined</code> | 숫자 | depth 가 함수일 때만 쓰임. 이 깊이까지만 내려가며 묶음 |
| <code>hideGroupedColumns</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 묶은 기준 컬럼 숨김 (tree 컬럼 제외). 그룹에서 빠지면 다시 보이게 함 |
| <code>canNodeBeGrouped</code> | <code>function</code> | <code>null</code> | fn(node) → boolean | false 를 돌려준 행은 묶지 않음 |
| <code>getNodeGroupingKey</code> | <code>function</code> | <code>null</code> | fn(node, dataIndex) → 키 | 행이 들어갈 그룹의 키. 컬럼 getCellGroupingKey 가 있으면 컬럼 쪽이 우선 |
| <code>mapGroupingKeys</code> | <code>function</code> | <code>null</code> | fn(keys) → 객체 &#124; Promise | 키를 한꺼번에 다른 키로 바꿈 |
| <code>getGroupingNodeLabel</code> | <code>function</code> | <code>null</code> | fn(groupingNode) → 문자열, this=그리드 | 그룹 행 제목. 값이 빈 그룹의 `getIdentifier()` 는 `'NA'` |
| <code>getGroupingNodeIcons</code> | <code>function</code> | <code>null</code> | fn(groupingNode) → 아이콘 배열, this=그리드 | 그룹 행 아이콘 |
| <code>getGroupingNodeOptions</code> | <code>function</code> | <code>null</code> | fn(groupingNode, rows) → { dataIndex: 값 }, this=그리드 | 그룹 행의 컬럼 값 |

사용법과 예제는 [행 그룹핑](/datagridview/row-grouping) 에 있습니다.

## treeNodeCellOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>expanderStyle</code> | <code>string</code> | <code>'classic'</code> | <code>'classic' &#124; 'triangle' &#124; 'none'</code> | 트리 펼침 아이콘 모양 |
| <code>showIconsFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 트리 셀 아이콘 표시 |
| <code>buildLinks</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 트리 연결선 |
| <code>depthIncrement</code> | <code>number</code> | <code>22</code> | 숫자(px) | 단계별 들여쓰기 |
| <code>rootMargin</code> | <code>object</code> | <code>{ mouse: 18, touch: 25 }</code> | <code>{ mouse, touch }</code> | 최상위 행 왼쪽 여백 |
