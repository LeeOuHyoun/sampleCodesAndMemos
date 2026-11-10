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
| <code>ignoreGroupingNodes</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 그룹핑 행은 필터에서 제외 |

## customViewsOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>dialogMaximizedFlag</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 사용자 뷰 대화상자를 최대화로 열기 |

## rowGroupingOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>depth</code> | <code>number</code> | <code>0</code> | 숫자 | 처음 그룹핑 깊이 |
| <code>maxDepth</code> | <code>number</code> | <code>undefined</code> | 숫자 | 최대 그룹핑 깊이 |
| <code>hideGroupedColumns</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 그룹 기준 컬럼 숨김 |
| <code>canNodeBeGrouped / getNodeGroupingKey / getGroupingNodeOptions / getGroupingNodeLabel / getGroupingNodeIcons / mapGroupingKeys</code> | <code>function</code> | <code>null</code> | <code>function</code> | 그룹핑 사용자 정의 |

## treeNodeCellOptions

| 옵션.키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>expanderStyle</code> | <code>string</code> | <code>'classic'</code> | <code>'classic' &#124; 'triangle' &#124; 'none'</code> | 트리 펼침 아이콘 모양 |
| <code>showIconsFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 트리 셀 아이콘 표시 |
| <code>buildLinks</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 트리 연결선 |
| <code>depthIncrement</code> | <code>number</code> | <code>22</code> | 숫자(px) | 단계별 들여쓰기 |
| <code>rootMargin</code> | <code>object</code> | <code>{ mouse: 18, touch: 25 }</code> | <code>{ mouse, touch }</code> | 최상위 행 왼쪽 여백 |
