---
title: 컬럼 옵션
---

# 컬럼 옵션 <Badge type="info" text="원본 분석" />

`columns: [ { ... } ]` 배열의 각 컬럼 객체에 넣는 키입니다. 기본값은 DataGridView 의 defaultColumnDef 기준입니다.

그리드 옵션 `defaultColumnDef` 로 모든 컬럼 공통 기본값을 줄 수 있습니다. 빠진 키만 원래 기본값으로 채워지므로 일부 키만 넣어도 됩니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  defaultColumnDef: { width: 120, editableFlag: true },
  columns: [
    { text: '품번', dataIndex: 'tree', editableFlag: false, pinned: 'left' },
    { text: '품명', dataIndex: 'title', width: 200 }
  ]
});
```

::: info 근거
DataGridView.js 의 ColumnModel (`_defaultColumnDef` 기본값과 컬럼 정의 해석), DataGridViewLayout 의 `getColumnOptionValue`. <Badge type="warning" text="2026" /> 표시 키는 enovia2026_webapps 에만 있음.
:::

## 기본

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>text</code> | <code>string</code> | - | 문자열 | 헤더 글자 |
| <code>dataIndex</code> | <code>string</code> | - | 'tree' &#124; grid 안의 키 | 값을 가져올 키. 'tree' = 행의 label + 트리 펼침 컬럼 |
| <code>typeRepresentation</code> | <code>string</code> | <code>'string'</code> | [typeRepresentation](/datagridview/api/type-representation) 목록 | 셀 모양/편집기 종류 |
| <code>semantics</code> | <code>object</code> | - | [semantics](/tweakers/api/semantics) 목록 | 편집기 세부 옵션 (콤보 목록, 최소/최대값 등) |
| <code>description</code> | <code>string</code> | <code>''</code> | 문자열 | 헤더 설명(툴팁) |
| <code>icon</code> | <code>string&#124;object</code> | - | '아이콘명' &#124; { iconName, fontIconFamily } | 헤더 아이콘 |
| <code>customHeader</code> | <code>object</code> | - | <code>{ buildContent, updateContent, ... }</code> | 헤더 칸을 직접 만든 DOM 으로 그림 ([헤더를 직접 그리기](/datagridview/header#헤더를-직접-그리기-customheader)) |

## 컬럼 그룹 (2단 헤더)

예제는 [헤더를 2단으로 묶기](/datagridview/header#헤더를-2단으로-묶기-컬럼-그룹) 에 있습니다.

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>children</code> | <code>array</code> | - | 컬럼 배열 | 컬럼 그룹. { text: '그룹명', dataIndex: '그룹키', children: [컬럼, 컬럼] } 형태로 헤더를 2단으로 묶음 (CATFLCockpitWidget 사용 예) |
| <code>expandedFlag</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 그룹에 넣음. 처음에 펼쳐 둘지. 넣으면 그룹 헤더에 펼침 버튼이 생김 |
| <code>columnGroupShow</code> | <code>string</code> | - | <code>'open' &#124; 'closed'</code> | 그룹의 하위 컬럼에 넣음. 'open' = 그룹을 펼쳤을 때만 보임, 'closed' = 접었을 때만 보임. 넣지 않으면 항상 보임 |
| <code>splittableFlag</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 그룹에 넣음. false 면 헤더를 끌어 컬럼 순서를 바꿀 때 그룹 밖의 컬럼이 그룹 사이로 끼어들거나 하위 컬럼이 그룹 밖으로 나갈 수 없음 |

## 크기 / 위치

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>width</code> | <code>number&#124;string</code> | <code>'auto'</code> | 숫자(px) &#124; 'auto' | 너비 |
| <code>minWidth</code> | <code>number</code> | <code>40</code> | 숫자 | 최소 너비 |
| <code>autoSizePadding</code> | <code>number</code> | <code>0</code> | 숫자 | 자동 너비 계산 시 여유 공간 |
| <code>pinned</code> | <code>string</code> | <code>'unpinned'</code> | <code>'left' &#124; 'right' &#124; 'unpinned'</code> | 좌/우 고정 |
| <code>alignment</code> | <code>string</code> | - | <code>'near' &#124; 'center' &#124; 'far'</code> | 셀 정렬 (왼쪽 / 가운데 / 오른쪽) |
| <code>autoRowHeightFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 내용에 맞춰 행 높이 자동 |
| <code>allowWrapFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 줄바꿈 허용 |

## 표시 / 기능 on-off

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>visibleFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 컬럼 표시 |
| <code>alwaysVisibleFlag</code> | <code>boolean</code> | - (2026: <code>false</code>) | <code>true &#124; false</code> | 숨길 수 없는 컬럼. true 면 `visibleFlag: false` 나 `setColumnVisibleFlag(…, false)` 로도 숨겨지지 않음. `visibleFlag: false` 와 같이 쓰면 컬럼은 보이고 `getColumnVisibleFlag` 는 false, `getColumnVisibleState` 는 true |
| <code>showTextFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 셀 글자 표시 (false 면 아이콘만) |
| <code>resizableFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 너비 조절 |
| <code>sortableFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 정렬 가능 |
| <code>groupableFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 행 그룹핑 기준으로 사용 가능. false 인 컬럼은 groupRows 에 넘겨도 조용히 빠지고, 그룹 영역에 끌어 놓아도 받지 않음 ([행 그룹핑](/datagridview/row-grouping)) |
| <code>selectableFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 셀 선택 가능 |
| <code>printableFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 인쇄/내보내기 포함 |
| <code>findableFlag</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 찾기 대상 포함 |
| <code>massUpdateAllowedFlag</code> | <code>boolean</code> | <code>true</code> | <code>true &#124; false</code> | 여러 행 일괄 수정 허용 |
| <code>className</code> | <code>string</code> | <code>''</code> | CSS 클래스명 | 이 컬럼의 데이터 셀에 붙일 CSS 클래스. 헤더 칸에는 붙지 않음. 컬럼 함수 `getCellClassName` 을 넣으면 쓰이지 않음 ([헤더 칸에 CSS 클래스 주기](/datagridview/header#헤더-칸에-css-클래스-주기)) |
| <code>allowUnsafeHTMLContent</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 셀 값을 HTML 로 렌더링 (보안 주의) |
| <code>hyperlinkTarget</code> | <code>string</code> | - | '_blank' 등 | url 타입 링크 열기 대상 |

## 편집

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>editableFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 편집 가능 |
| <code>editionPolicy</code> | <code>string</code> | <code>'EditionOnDoubleClick'</code> | <code>'EditionOnDoubleClick' &#124; 'EditionOnClick' &#124; 'DelayedEditionOnClick' &#124; 'EditionOnOver' &#124; 'EditionInPlace'</code> | 편집 시작 방식 ([편집](/datagridview/editing)) |
| <code>disabled</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 컬럼 비활성 |
| <code>allowResetToUndefinedByUIFlag</code> | <code>boolean</code> | <code>false</code> | <code>true &#124; false</code> | 사용자가 값을 비울(undefined) 수 있음 |
| <code>liveUpdateFlag</code> | <code>boolean</code> | - | <code>true &#124; false</code> | 입력 중에도 값 반영 |

## 정렬

| 키 | 타입 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>compareFunction</code> | <code>function</code> | 기본 비교 | function (값A, 값B, 행A, 행B, dataIndex) → 음수&#124;0&#124;양수 | 사용자 정의 정렬. 내림차순은 그리드가 -1 을 곱함 |
