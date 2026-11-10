---
title: 툴바 (setToolbar)
---

# 툴바 (setToolbar) <Badge type="info" text="원본 분석" />

툴바는 생성자 옵션이 없고 `grid.setToolbar(JSON)` 으로만 만듭니다. 돌려받은 툴바의 화면 요소(`getContent()`)를 원하는 위치에 붙입니다.

```js
var toolbar = grid.setToolbar({
  entries: [
    {
      id: 'addRow',
      position: 'far',
      dataElements: {
        typeRepresentation: 'functionIcon',
        label: '추가',
        icon: { iconName: 'plus', fontIconFamily: 1 },
        action: { module: 'DS/MyModule/ToolbarActions', func: 'addRow' }
      }
    }
  ]
});
document.getElementById('toolbar').appendChild(toolbar.getContent());
```

::: info 근거
Tweakers.js 의 GeneratedToolbar
:::

::: tip
버튼 동작 모듈을 만드는 방법은 [툴바](/datagridview/toolbar) 가이드를 보세요. 그리드 없이 툴바만 만들거나 만든 뒤 항목을 바꾸는 방법은 [GeneratedToolbar](/tweakers/generated-toolbar) 에 있습니다.
:::

| 키 | 위치 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- | --- |
| <code>entries</code> | 최상위 | - | 항목 배열 | 툴바 항목 목록 |
| <code>enums / typeRepresentations</code> | 최상위 | - | { 이름: 정의 } | 툴바에서 쓸 사용자 enum / 타입 등록 |
| <code>id</code> | 항목 | - | 문자열 | 항목 고유 id |
| <code>position</code> | 항목 | <code>'near'</code> | <code>'near' &#124; 'center' &#124; 'far'</code> | 왼쪽 / 가운데 / 오른쪽 |
| <code>category / priority / overflowPriority</code> | 항목 | <code>'other' / - / -</code> | 문자열 / 숫자 | 묶음, 순서, 공간 부족 시 드롭다운으로 넘어가는 우선순위 |
| <code>onNodeUpdate</code> | 항목 | - | <code>{ module, func, argument } &#124; function</code> | 값이 확정되면 호출 (검색창 Enter, 콤보 선택) |
| <code>onNodeLiveUpdate</code> | 항목 | - | <code>function</code> | 입력 중 실시간 호출 (module/func 방식은 소스상 버그로 동작 안 함 → function 사용) |
| <code>children</code> | 항목 | - | 항목 배열 | 하위 메뉴 (메뉴형 버튼) |
| <code>dataElements.typeRepresentation</code> | 항목 | 필수 | <code>'functionIcon' &#124; 'string' &#124; 'customEnumMember' &#124; 'boolean' ...</code> | 항목 종류 |
| <code>dataElements.label / tooltip / displayLabel</code> | 항목 | - | 문자열 / 문자열 / boolean | 글자 / 툴팁 / 라벨 표시 여부 |
| <code>dataElements.icon</code> | 항목 | - | <code>{ iconName: 'plus', fontIconFamily: 1 }</code> | 아이콘 (1 = 3DS 폰트) |
| <code>dataElements.value / possibleValues / placeholder</code> | 항목 | - | - | 입력/콤보 초기값, 목록, 안내 문구 |
| <code>dataElements.action</code> | 항목 | - | <code>{ module: 'DS/...', func: '...', argument }</code> | 버튼 클릭 시 호출. 인자 e.context.executionContext = 그리드. 함수를 넣으면 동작하지 않음 → 함수는 <code>dataElements.value</code> 에 |
| <code>dataElements.value</code> (버튼) | 항목 | - | <code>function (e)</code> | 버튼 클릭 시 호출하는 함수. 인자 e.context 는 action 과 같음 |
| <code>dataElements.visibleFlag / disabled / readOnly</code> | 항목 | <code>true / false / false</code> | <code>boolean</code> | 표시 / 비활성 / 읽기전용 |
