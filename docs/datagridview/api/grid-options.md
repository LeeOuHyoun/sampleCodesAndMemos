---
title: 그리드 옵션
---

# 그리드 옵션 <Badge type="info" text="원본 분석" />

`new DataGridView({ ... })` 에 넘기는 설정 객체 최상위 키입니다. DataGridView 자체 옵션과 상속받은 CollectionView, Controls/Abstract 옵션을 함께 정리했습니다.

생성 후에도 `grid.옵션 = 값` 으로 바꿀 수 있습니다 (readOnly 표시 제외). 그리드 객체에서 부르는 함수는 [그리드 메서드](/datagridview/api/grid-methods) 에 있습니다.

```js
var grid = new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  rowSelection: 'single',
  showRowIndexFlag: false
});
grid.showColumnBorderFlag = true;
```

::: info 근거
DataGridView.js, CollectionView.js, Controls.js 의 publishedProperties 와 실제 비교 코드.
:::

## 데이터

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>treeDocument</code> | <code>TreeDocument</code> | <code>null</code> | <code>new TreeDocument()</code> | 표시할 데이터. 행 = TreeNodeModel |
| <code>columns</code> | <code>array</code> | <code>[]</code> | 컬럼 정의 배열 | [컬럼 옵션](/datagridview/api/column-options) 참고 |
| <code>defaultColumnDef</code> | <code>object</code> | [컬럼 옵션](/datagridview/api/column-options)의 기본값 | 컬럼 옵션 객체 | 모든 컬럼 공통 기본값. 빠진 키는 원래 기본값으로 채워짐 |
| <code>layoutOptions</code> | <code>object (readOnly)</code> | <code>null</code> | [layoutOptions](/datagridview/api/layout-options) 참고 | 레이아웃 옵션. 생성할 때만 지정 가능 |
| <code>dataSource</code> | <code>object</code> | <code>null</code> | 서버 데이터 소스 | 서버 사이드 페이징용 (RowModelServerSide) |
| <code>virtuallyLoadAllModelItems</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 서버 사이드 모드에서 모든 행을 가상으로 로드 |
| <code>syncClientModelOnDemand</code> <Badge type="tip" text="2025" /> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 서버 사이드 모드 클라이언트 모델 동기화 |
| <code>maxVisibleRowCount</code> | <code>number</code> | <code>undefined</code> | 숫자 | 그리드 높이를 행 N개 높이로 자동 계산 |
| <code>height</code> | <code>integer&#124;string</code> | <code>'inherit'</code> | 'inherit' &#124; 숫자 | 그리드 높이 |
| <code>placeholder</code> <Badge type="tip" text="2025" /> | <code>string</code> | 'No objects found' (번역) | 문자열 | 행이 없을 때 표시할 문구 |
| <code>shouldNodeBeRepresented</code> <Badge type="tip" text="2025" /> | <code>function</code> | - | <code>function (nodeModel) → boolean</code> | false 를 돌려주는 행은 그리드에 표시하지 않음 |

## 선택

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>rowSelection</code> | <code>string</code> | <code>'multiple'</code> | <code>'none' &#124; 'single' &#124; 'multiple'</code> | 행 선택 방식 (CollectionView) |
| <code>cellSelection</code> | <code>string</code> | <code>'multiple'</code> | <code>'none' &#124; 'single' &#124; 'multiple'</code> | 셀 선택 방식 (DataGridView 에서 기본 multiple 로 변경) |
| <code>columnSelection</code> | <code>string</code> | <code>'none'</code> | <code>'none' &#124; 'single' &#124; 'multiple'</code> | 컬럼 헤더 클릭으로 컬럼 전체 선택 |
| <code>showSelectionCheckBoxesFlag</code> | <code>string&#124;boolean</code> | <code>'OnOver'</code> | <code>'OnOver' &#124; true &#124; false</code> | 행 머리 선택 체크박스. 'OnOver' = 마우스 올릴 때만, true = 항상, false = 안 보임 |
| <code>selectionStyle</code> | <code>string</code> | <code>''</code> | <code>'' &#124; 'lightSelectionEdging'</code> | 선택 표시 스타일 (lightSelectionEdging = 테두리 위주의 옅은 표시) |
| <code>cellActivationFeedback</code> | <code>string</code> | <code>'cell'</code> | <code>'cell' &#124; 'row' &#124; 'none'</code> | 클릭(활성) 시 강조 범위 |
| <code>cellPreselectionFeedback</code> | <code>string</code> | <code>'cell'</code> | <code>'cell' &#124; 'none'</code> | 마우스 올렸을 때(프리셀렉션) 강조 |
| <code>selectionBehavior</code> | <code>object</code> | [하위 옵션 객체](/datagridview/api/sub-options) 참고 | <code>{ toggle, unselectAllOnEmptyArea, ... }</code> | 선택 동작 세부 설정 |
| <code>columnHeadersLayout</code> | <code>enum</code> | <code>0</code> | <code>0 (DEFAULT) &#124; 1 (SELECTION_FIRST)</code> | 1 이면 헤더의 선택 체크박스를 헤더 왼쪽에 둔다 |

## 표시

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>showRowIndexFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 번호 |
| <code>showRowBorderFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행 가로 구분선 |
| <code>showColumnBorderFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 컬럼 세로 구분선 |
| <code>showAlternateBackgroundFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 줄무늬 배경 |
| <code>showRowHeaderBackgroundFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 머리(번호 영역) 배경 |
| <code>showOutlineFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 그리드 외곽선 |
| <code>showBackgroundFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 그리드 배경 |
| <code>showScrollbarsOnHover</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 마우스를 올렸을 때만 스크롤바 표시 |
| <code>showEditableFeedbackFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 편집 가능한 셀 표시 |
| <code>showRequiredFeedbackFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 필수 값(requiredFlag) 셀 표시 |
| <code>showModelChangesFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 변경된 셀 강조 |
| <code>showNodeKPIColorFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행 KPI 색상 표시 (컬럼 getCellKPIColor 와 같이 사용) |
| <code>showContextualMenuColumnFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행마다 메뉴(⋮) 컬럼 추가 |
| <code>showMatchingCellBackgroundFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 찾기(find) 결과 셀 배경 강조 |
| <code>treeNodeCellOptions</code> | <code>object</code> | [하위 옵션 객체](/datagridview/api/sub-options) 참고 | <code>{ expanderStyle, showIconsFlag, ... }</code> | 트리 컬럼(dataIndex tree) 표시 방식 |
| <code>getCellTooltip</code> | <code>function</code> | <code>null</code> | function (cellInfos) → 툴팁 | 그리드 전체 셀 툴팁 (컬럼 getCellTooltip 이 우선) |

## 편집 / 키보드

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>editOnKeyPressFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 셀 선택 후 글자를 치면 바로 편집 시작 |
| <code>focusNextEditableCellOnTabFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | Tab 키로 다음 편집 가능 셀로 이동 |
| <code>selectNextCellOnEnterFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | Enter 로 편집 완료 후 아래 셀 선택 |
| <code>deleteOptions</code> | <code>object</code> | <code>undefined</code> | <code>{ deleteSelectionOnKeyPress, showConfirmationDialog }</code> | Delete 키로 선택 행 삭제 |

## 정렬 / 필터 / 찾기

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>sortModel</code> | <code>array</code> | <code>null</code> | [{ dataIndex: '키', sort: 'asc' &#124; 'desc' }, ...] | 정렬 상태. 배열 순서 = 우선순위. [] = 정렬 해제 |
| <code>sortOptions</code> | <code>object</code> | <code>undefined</code> | <code>{ maxSortedColumnsCount, onOutOfBoundSortRequest }</code> | 다중 정렬 제한 |
| <code>filterViewOptions</code> | <code>object</code> | <code>undefined</code> | <code>{ maxAppliedFilterCount, ignoreGroupingNodes }</code> | 필터 팝업 옵션 (필터 자체는 [필터](/datagridview/api/filter)) |
| <code>findNavigationMode</code> | <code>string</code> | <code>'substring'</code> | <code>'substring' &#124; 'cell' &#124; 'row'</code> | 찾기(setFindStr) 결과 이동 단위 |
| <code>customViewsOptions</code> | <code>object</code> | <code>undefined</code> | <code>{ dialogMaximizedFlag, ... }</code> | 사용자 뷰(컬럼 구성 저장) 대화상자 옵션 |
| <code>useWidgetPreferencesFlag</code> | <code>boolean (readOnly)</code> | <code>false</code> | <code>true &#124; false</code> | 위젯 환경설정에 컬럼 상태 저장 |

## 드래그 / 그룹

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>columnDragEnabledFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 컬럼 헤더 드래그로 순서 변경 |
| <code>rowReorderEnabledFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 머리 드래그로 행 순서 변경 |
| <code>rowDragEnabledFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 행을 그리드 밖으로 드래그 (onDragStartRowHeader 등과 사용) |
| <code>cellDragEnabledFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 셀 드래그 |
| <code>onDragStart/End/Enter/Leave/Over + ColumnHeader &#124; RowHeader &#124; Cell &#124; Blank, onDrop...</code> | <code>function</code> | <code>undefined</code> | <code>function (event, cellInfos)</code> | 드래그앤드롭 콜백. 예: onDropCell, onDragOverRowHeader, onDropBlank |
| <code>rowGroupingEnabledFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 컬럼 기준 행 그룹핑 허용 |
| <code>rowGroupingOptions</code> | <code>object</code> | [하위 옵션 객체](/datagridview/api/sub-options) 참고 | <code>{ depth, maxDepth, hideGroupedColumns, ... }</code> | 행 그룹핑 세부 설정 |
| <code>onContextualEvent</code> <Badge type="tip" text="2025" /> | <code>function</code> | 기본 메뉴 | <code>function (event, cellInfos)</code> | 우클릭 메뉴 직접 처리 |
| <code>useAsyncPreExpand</code> | <code>boolean</code> | <code>undefined</code> | <code>true &#124; false</code> | 트리 펼치기 비동기 처리 |

## 공통 (Controls/Abstract, CollectionView)

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>identifier</code> | <code>string</code> | <code>undefined</code> | 문자열 | 컴포넌트 식별자 (환경설정 저장 키 등) |
| <code>domId</code> | <code>string</code> | <code>null</code> | 문자열 | 최상위 DOM id |
| <code>visibleFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 표시 여부 |
| <code>disabled</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 비활성 |
| <code>touchMode</code> | <code>boolean</code> | <code>undefined</code> | <code>true &#124; false</code> | 터치 모드 (행 높이 40px 등) |
| <code>tooltipInfos</code> | <code>object</code> | <code>undefined</code> | <code>{ shortHelp, ... }</code> | 컴포넌트 툴팁 |
| <code>fireOnlyFromUIInteractionFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | UI 조작으로 바뀔 때만 이벤트 발생 |
| <code>cellClass / layout / model / nodeModelClass</code> | - | - | - | 내부 확장용. 일반적으로 지정하지 않음 |
