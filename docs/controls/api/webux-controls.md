---
title: WebUX 컨트롤 API
---

# WebUX 컨트롤 API <Badge type="info" text="원본 분석" />

`DS/Controls/*` 컨트롤별 공개 속성(publishedProperties), 메서드, 이벤트입니다. 사용법은 [WebUX 컨트롤](/controls/webux-controls) 에 있습니다.

```js
var btn = new Button({ label: '저장' }).inject(el);
btn.label = '수정';
btn.addEventListener('buttonclick', function (e) { console.log(e.dsModel.label); });
```

::: info 근거
Controls.js 각 모듈의 `publishedProperties` getter (2025 는 `Object.defineProperty(t, "publishedProperties", ...)`, 2026 은 `static get publishedProperties()`), `fire("...")` 호출, prototype 메서드. Core.js 의 BaseComponent, TooltipModel. 표의 기본값은 소스의 `defaultValue` 그대로입니다.
:::

- 표의 키는 생성자 옵션과 속성 이름입니다. `ctrl.키 = 값` 또는 `ctrl.setProperties({ ... })` 로 바꿉니다.
- 각 컨트롤은 [Abstract](#abstract) 의 속성도 모두 가집니다.
- 이벤트는 `ctrl.addEventListener(이름, fn)` 으로 받습니다. `e.dsModel` 이 컨트롤, `e.options` 가 추가 정보입니다.
- `dimensionsChanged` 는 크기가 바뀔 때 내부용으로 나는 이벤트라 표에서 뺐습니다.

## Abstract

모든 컨트롤의 부모입니다 (`DS/Controls/Abstract`, 부모는 `DS/Core/BaseComponent`).

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>domId</code> | <code>string</code> | <code>null</code> | 화면 요소의 <code>id</code> |
| <code>disabled</code> | <code>boolean</code> | <code>false</code> | 비활성 |
| <code>visibleFlag</code> | <code>boolean</code> | <code>true</code> | 표시 여부 |
| <code>animation</code> | <code>object</code> | <code>null</code> | <code>{ show, hide }</code> 애니메이션 이름 |
| <code>touchMode</code> | <code>boolean</code> | - | 터치용 모양. 비우면 기기 설정 |
| <code>tooltipInfos</code> | <code>DS/Core/TooltipModel</code> | - | 툴팁 (일반 객체도 됨) |
| <code>recId</code> | <code>string</code> | <code>null</code> | 녹화 / 재생용 id (<code>data-rec-id</code>) |
| <code>fireOnlyFromUIInteractionFlag</code> | <code>boolean</code> | <code>false</code> | 사용자 조작으로 생긴 이벤트만 발생 |
| <code>identifier</code> | <code>string</code> | - | 자동 테스트용 식별자. 읽기 전용 |

| 메서드 | 설명 |
| --- | --- |
| <code>inject(parent, where?)</code> | 화면에 붙임. 자기 자신 반환 |
| <code>getContent()</code> | 화면 요소. 요소의 <code>dsModel</code> 이 컨트롤 |
| <code>remove()</code> | 화면에서 떼기만 함 |
| <code>destroy()</code> | 정리 |
| <code>setProperties(obj)</code> | 속성 여러 개 변경 |
| <code>addEventListener(name, fn, capture?)</code> / <code>removeEventListener</code> | 이벤트 등록 / 해제 (<code>getContent()</code> 에 위임) |
| <code>fire(name, options?)</code> | 이벤트 발생 (직접 만든 컨트롤에서 씀) |
| <code>show()</code> / <code>hide()</code> | <code>visibleFlag</code> 를 바꿈 |
| <code>focus()</code> | 포커스 |
| <code>getPublishedPropertiesDefaultValue()</code> | 모든 속성의 기본값 객체 |
| <code>Abstract.inherit({ ... })</code> | 컨트롤 클래스 만들기 ([직접 만들기](/controls/webux-controls#컨트롤-직접-만들기)) |

## Button

`DS/Controls/Button`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>label</code> | <code>string</code> | <code>''</code> | 글자 |
| <code>emphasize</code> | <code>string</code> | <code>'secondary'</code> | <code>primary</code>, <code>secondary</code>, <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code>, <code>medium-attention</code>, <code>high-attention</code> |
| <code>icon</code> | <code>object</code> | <code>''</code> | 아이콘. 문자열은 FontAwesome, 객체 <code>{ iconName, fontIconFamily }</code> |
| <code>iconSize</code> | <code>string</code> | <code>'1x'</code> | <code>1x</code>, <code>2x</code> ... |
| <code>value</code> | <code>object</code> | - | 아무 값 |
| <code>type</code> | <code>string</code> | <code>'standard'</code> | <code>standard</code>, <code>check</code>, <code>radio</code> |
| <code>checkFlag</code> | <code>boolean</code> | <code>false</code> | 눌림 상태 (<code>check</code>, <code>radio</code>) |
| <code>minWidth</code> | <code>integer</code> | <code>-1</code> | 최소 너비 px (<code>-1</code> 없음) |
| <code>minHeight</code> | <code>integer</code> | <code>-1</code> | 최소 높이 px |
| <code>preferredWidth</code> | <code>integer</code> | <code>-1</code> | 최대 너비 px |
| <code>preferredHeight</code> | <code>integer</code> | <code>-1</code> | 최대 높이 px |
| <code>onClick</code> | <code>function</code> | - | <code>buttonclick</code> 리스너로 등록 |
| <code>clickMode</code> | <code>integer</code> | <code>0</code> | <code>0</code> 놓을 때, <code>1</code> 누를 때 실행 |
| <code>multiSelFlag</code> | <code>boolean</code> | <code>false</code> | radio 여러 개 선택 허용 |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | <code>normal</code>, <code>lite</code>, <code>icon</code>, <code>lite-borders</code>, <code>flyout</code> |
| <code>showLabelFlag</code> | <code>boolean</code> | <code>true</code> | 글자 표시 |
| <code>allowUnsafeHTMLLabel</code> | <code>boolean</code> | - | <code>label</code> 을 HTML 로 해석. 비우면 전역 설정 |
| <code>labelPosition</code> <Badge type="warning" text="2026" /> | <code>string</code> | <code>'right'</code> | 아이콘 기준 글자 위치 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>buttonclick</code> | 클릭, Enter, Space (비활성이면 없음) | <code>{ ctrlKey, shiftKey, altKey }</code> |
| <code>buttonDblClick</code> | 더블 클릭 | - |
| <code>change</code> | <code>checkFlag</code> 변경 | - |

## Toggle

`DS/Controls/Toggle`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>type</code> | <code>string</code> | <code>'checkbox'</code> | <code>checkbox</code>, <code>radio</code>, <code>switch</code>, <code>toggleIcon</code> |
| <code>checkFlag</code> | <code>boolean</code> | <code>false</code> | 켜짐 여부 |
| <code>mixedState</code> | <code>boolean</code> | <code>false</code> | 일부 선택 표시 |
| <code>label</code> | <code>string</code> | <code>''</code> | 글자 |
| <code>value</code> | <code>object</code> | - | 아무 값 (ButtonGroup 구분용) |
| <code>internalLabelsFlag</code> | <code>boolean</code> | <code>false</code> | switch 안에 켜짐 / 꺼짐 글자 |
| <code>clickMode</code> | <code>integer</code> | <code>0</code> | <code>0</code> 놓을 때, <code>1</code> 누를 때 |
| <code>multiSelFlag</code> | <code>boolean</code> | <code>false</code> | radio 여러 개 선택 허용 |
| <code>allowUnsafeHTMLLabel</code> | <code>boolean</code> | - | <code>label</code> 을 HTML 로 해석 |
| <code>iconsReference</code> | <code>array</code> | <code>[{"value":"checked","icon":"check"},{"value":"unchecked","icon":"wrong"},{"value":"checked_mixed","icon":""},{"value":"unchecked_mixed","icon":""}]</code> | 상태별 아이콘 (<code>toggleIcon</code>) |
| <code>icon</code> | <code>string&#124;WUXIconDefinition</code> | - | 아이콘 (<code>toggleIcon</code>) |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>checkFlag</code> 변경 (코드로 바꿔도) | - |
| <code>buttonclick</code> | 클릭, Space | <code>{ ctrlKey, shiftKey, altKey }</code> |
| <code>valueChangedByKeyPressed</code> | 키보드로 바꿈 | <code>{ ctrlKey, shiftKey, altKey, key }</code> |
| <code>buttonDblClick</code> | 더블 클릭 | - |

메서드: <code>toggle()</code>

## ButtonGroup

`DS/Controls/ButtonGroup`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>array</code> | - | 눌린 자식의 <code>value</code> 배열 |
| <code>type</code> | <code>string</code> | <code>'radio'</code> | <code>radio</code>, <code>checkbox</code>, <code>switch</code> |
| <code>minButtonWidth</code> | <code>integer</code> | <code>-1</code> | 자식 최소 너비 |
| <code>preferredButtonWidth</code> | <code>integer</code> | <code>-1</code> | 자식 최대 너비 |
| <code>multiSelFlag</code> | <code>boolean</code> | <code>false</code> | Ctrl 클릭으로 여러 개 |
| <code>allowResetToUndefinedByUIFlag</code> | <code>boolean</code> | <code>true</code> | <code>false</code> 면 마지막 하나는 해제 불가 |
| <code>direction</code> <Badge type="warning" text="2026" /> | <code>string</code> | <code>'vertical'</code> | 배치 방향 |

| 메서드 | 설명 |
| --- | --- |
| <code>addChild(btn, index?)</code> / <code>removeChild(btn)</code> | 자식 Button / Toggle 넣기 / 빼기 |
| <code>moveButton(btn, index)</code> | 순서 바꾸기 |
| <code>getButtonCount()</code> / <code>getButton(index)</code> / <code>getButtonIndex(btn)</code> | 자식 찾기 |
| <code>getButtonFromValue(v)</code> | <code>value</code> 로 자식 찾기 |
| <code>selectValue(v)</code> / <code>selectIndex(i)</code> | 선택 |
| <code>selectNext()</code> / <code>selectPrevious()</code> | 다음 / 이전 선택 |

이벤트: <code>change</code> (<code>value</code> 변경)

## AbstractEditor

`LineEditor`, `Editor` 의 부모입니다 (`DS/Controls/AbstractEditor`).

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>requiredFlag</code> | <code>boolean</code> | <code>false</code> | 필수 |
| <code>placeholder</code> | <code>string</code> | <code>''</code> | 안내 글자 |
| <code>value</code> | <code>string</code> | <code>''</code> | 확정 값 |
| <code>valueToCommit</code> | <code>string</code> | <code>''</code> | 타이핑 중인 값 |
| <code>validFlag</code> | <code>boolean</code> | <code>true</code> | 유효 여부 (브라우저 validity). 읽기 전용 |
| <code>selectAllOnFocus</code> | <code>boolean</code> | <code>false</code> | 포커스 때 전체 선택 |
| <code>escapeHTML</code> | <code>boolean</code> | <code>false</code> | 값을 HTML 이스케이프해서 보관 |
| <code>readOnlyFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>false</code> | 읽기 전용 |
| <code>onDrop</code> <Badge type="warning" text="2026" /> | <code>function</code> | - | 끌어 놓기 처리 함수 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 확정 (코드로 바꿔도) | - |
| <code>uncommittedChange</code> | 타이핑 (<code>valueToCommit</code> 변경) | <code>{ uncommittedValue }</code> |
| <code>validFlagChange</code> | <code>validFlag</code> 변경 | - |
| <code>focus</code> | 포커스 받음 | - |

메서드: <code>commitCurrentEntry()</code> (타이핑 중인 값을 확정)

## LineEditor

`DS/Controls/LineEditor`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>pattern</code> | <code>string</code> | <code>''</code> | HTML <code>pattern</code> |
| <code>sizeInCharNumber</code> | <code>integer</code> | <code>-1</code> | 글자 수 기준 너비 |
| <code>displayStyle</code> | <code>string</code> | <code>'text'</code> | <code>text</code>, <code>password</code>, <code>lite</code> |
| <code>autoCommitFlag</code> | <code>boolean</code> | <code>false</code> | 타이핑마다 확정 |
| <code>value</code> | <code>string</code> | <code>''</code> | 확정 값 |
| <code>autoCorrectFlag</code> | <code>boolean</code> | <code>true</code> | 브라우저 자동 수정 |
| <code>displayClearFieldButtonFlag</code> | <code>boolean</code> | <code>false</code> | 지우기 버튼 |
| <code>icon</code> | <code>string</code> | - | 앞쪽 아이콘 |
| <code>customDecoratorDefinition</code> | <code>Object</code> | - | 입력 보조 장식 정의 |
| <code>maxLength</code> | <code>integer</code> | <code>-1</code> | 최대 글자 수 |

이벤트: AbstractEditor 이벤트 + <code>blur</code>, <code>clear</code> (지우기 버튼), <code>click</code>

## Editor

`DS/Controls/Editor` (여러 줄)

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>''</code> | 확정 값 |
| <code>widthInCharNumber</code> | <code>integer</code> | <code>20</code> | 글자 수 기준 너비 |
| <code>maxLength</code> | <code>integer</code> | <code>-1</code> | 최대 글자 수 |
| <code>nbRows</code> | <code>integer</code> | <code>2</code> | 줄 수 |
| <code>newLineMode</code> | <code>string</code> | <code>'shiftEnter'</code> | 줄바꿈 키 |
| <code>autoCommitFlag</code> | <code>boolean</code> | <code>false</code> | 타이핑마다 확정 |
| <code>resizableFlag</code> | <code>boolean</code> | <code>false</code> | 크기 조절 |

이벤트: AbstractEditor 이벤트 + <code>blur</code>. 메서드: <code>setHeight(h)</code>

## ComboBox

`DS/Controls/ComboBox` 는 `ComboBoxBase` 를 상속합니다. 두 표를 합친 것이 ComboBox 의 속성입니다.

### ComboBoxBase

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>nbDisplayedElements</code> | <code>integer</code> | <code>-1</code> | 보이는 항목 수. 읽기 전용 |
| <code>selectedIndex</code> | <code>integer</code> | <code>-1</code> | 선택 위치 |
| <code>preselectedIndex</code> | <code>integer</code> | <code>-1</code> | 지나가는 위치. 읽기 전용 |
| <code>selectedIndexes</code> | <code>array</code> | <code>[]</code> | 선택 위치 배열 (<code>multiSelFlag</code>) |
| <code>value</code> | <code>object</code> | - | 선택 값 (<code>value</code> / <code>valueItem</code>, 없으면 글자) |
| <code>currentValue</code> | <code>object</code> | - | 현재 값 |
| <code>label</code> | <code>string</code> | <code>''</code> | 선택 글자. 읽기 전용 |
| <code>currentLabel</code> | <code>string</code> | <code>''</code> | 현재 글자. 읽기 전용 |
| <code>elementsList</code> | <code>array</code> | <code>[]</code> | 항목 배열 |
| <code>elementsTree</code> | <code>array</code> | - | 항목 TreeDocument (계층) |
| <code>multiSelFlag</code> | <code>boolean</code> | <code>false</code> | 여러 개 선택 |
| <code>showToggleColumnForMultiSelFlag</code> | <code>boolean</code> | <code>true</code> | 여러 개 선택 때 체크 열 |
| <code>reachablePlaceholderFlag</code> | <code>boolean</code> | <code>false</code> | 안내 글자 항목 선택 가능 |
| <code>popupSizeAdjustPolicy</code> | <code>integer</code> | - | 목록 크기 정책 |
| <code>mainElementSizeAdjustPolicy</code> | <code>integer</code> | - | 본체 크기 정책 |
| <code>selectionStyle</code> | <code>string</code> | <code>''</code> | 선택 표시 방식 |
| <code>onContextualEvent</code> | <code>function</code> | - | 오른쪽 클릭 메뉴 |
| <code>completeModel</code> | <code>function</code> | - | 목록을 늦게 채우는 함수 |

### ComboBox 추가 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>placeholder</code> | <code>string</code> | <code>''</code> | 안내 글자 |
| <code>mainElementVisibleFlag</code> | <code>boolean</code> | <code>true</code> | 본체 표시 |
| <code>mainElementContent</code> | <code>string</code> | <code>'all'</code> | 본체에 보일 것 |
| <code>expanderVisibleFlag</code> | <code>boolean</code> | <code>true</code> | 펼침 화살표 표시 |
| <code>enableSearchFlag</code> | <code>boolean</code> | <code>true</code> | 입력해서 거르기 |
| <code>generateRegexpString</code> | <code>function</code> | 함수 | 검색 정규식 생성 |
| <code>useMatchingSearchFunction</code> | <code>boolean</code> | <code>false</code> | <code>isNodeMatchingSearch</code> 사용 |
| <code>isNodeMatchingSearch</code> | <code>function</code> | 함수 | 검색 일치 판정 |
| <code>autocompleteFlag</code> | <code>boolean</code> | <code>true</code> | 자동 완성 |
| <code>actionOnClickFlag</code> | <code>boolean</code> | <code>false</code> | 눌러서 동작 (메뉴처럼) |
| <code>expanderIcon</code> | <code>object</code> | <code>'expand-down'</code> | 펼침 아이콘 |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | 모양 |
| <code>getMainElementCustomization</code> | <code>function</code> | - | 본체 표시 바꾸기 |
| <code>selectAllOnFocus</code> | <code>boolean</code> | <code>false</code> | 포커스 때 전체 선택 |

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | 선택 변경 |
| <code>preselectionChange</code> | 목록에서 지나가는 항목 변경 |
| <code>preDropdown</code> | 목록을 열기 직전 |
| <code>show</code> / <code>hide</code> | 목록 열림 / 닫힘 |
| <code>popupVisibilityChange</code> | 목록 표시 상태 변경 |
| <code>modelLoaded</code> | 목록 모델 준비 완료 |
| <code>uncommittedChange</code> | 검색 입력 중 |
| <code>click</code> | 눌림 |

## Label

`DS/Controls/Label`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>''</code> | 글자 |
| <code>maxDisplayLength</code> | <code>integer</code> | <code>50</code> | 넘으면 <code>...</code> |
| <code>emphasize</code> | <code>string</code> | <code>'secondary'</code> | 색 |
| <code>backgroundColor</code> | <code>Color.COLORS_STATUS</code> | - | 배경색 |
| <code>icon</code> | <code>string</code> | <code>''</code> | 아이콘 |
| <code>appearance</code> | <code>string</code> | <code>'chip'</code> | <code>chip</code>, <code>closeable-chip</code> |

이벤트: <code>close</code> (<code>appearance: 'closeable-chip'</code> 의 닫기 아이콘)

## Expander

`DS/Controls/Expander`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>header</code> | <code>string</code> | <code>''</code> | 제목 |
| <code>body</code> | <code>HTMLElement</code> | - | 내용 요소 |
| <code>interactiveFlag</code> | <code>boolean</code> | <code>true</code> | 눌러서 접기 |
| <code>expandedFlag</code> | <code>boolean</code> | <code>false</code> | 펼침 |
| <code>style</code> | <code>string</code> | <code>'filled-separate'</code> | <code>filled-separate</code>, <code>filled-group</code>, <code>simple</code> |
| <code>icon</code> | <code>object</code> | <code>''</code> | 제목 아이콘 |
| <code>height</code> | <code>string</code> | <code>'auto'</code> | 내용 높이 |
| <code>orientation</code> | <code>string</code> | <code>'vertical'</code> | 방향 |
| <code>customHeader</code> | <code>object</code> | - | 제목 옆 요소 |
| <code>customHeaderPosition</code> | <code>string</code> | <code>'far'</code> | <code>near</code>, <code>far</code> |
| <code>allowUnsafeHTMLHeader</code> | <code>boolean</code> | - | 제목을 HTML 로 |
| <code>headerTooltipInfos</code> | <code>DS/Core/TooltipModel</code> | - | 제목 툴팁 |
| <code>stretchableContentFlag</code> | <code>boolean</code> | <code>false</code> | 내용을 늘림 |
| <code>usePaddingFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>true</code> | 안쪽 여백 |

메서드: <code>expand()</code>, <code>close()</code>, <code>toggle()</code>. 이벤트: <code>expand</code>, <code>collapse</code>

## Popup

`DS/Controls/Popup`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>identifier</code> | <code>string</code> | <code>''</code> | 식별자. 읽기 전용 |
| <code>position</code> | <code>string</code> | <code>'right'</code> | <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code> |
| <code>alignment</code> | <code>string</code> | <code>'near'</code> | <code>near</code>, <code>far</code> 등 |
| <code>visibleFlag</code> | <code>boolean</code> | <code>false</code> | 표시 여부 |
| <code>target</code> | <code>object</code> | <code>null</code> | 기준 요소 (trigger 이벤트를 받는 곳) |
| <code>positionTarget</code> | <code>object</code> | <code>null</code> | 위치 기준 (비우면 <code>target</code>) |
| <code>offset</code> | <code>vector2</code> | <code>{"x":0,"y":0}</code> | <code>{ x, y }</code> 어긋남 |
| <code>constraint</code> | <code>string</code> | <code>'none'</code> | 넘지 않을 영역 |
| <code>trigger</code> | <code>string</code> | <code>''</code> | <code>click</code>, <code>hover</code>, <code>focus</code>, <code>mousePress</code> (공백 구분) |
| <code>mouseRelativePosition</code> | <code>boolean</code> | <code>false</code> | 마우스 위치 기준 |
| <code>overlap</code> | <code>boolean</code> | <code>true</code> | 겹침 허용 |
| <code>overlapCallback</code> | <code>function</code> | 함수 | - |
| <code>shouldDisplayCallback</code> | <code>function</code> | <code>null</code> | - |
| <code>beforeDisplayCallback</code> | <code>function</code> | <code>null</code> | - |
| <code>postOverlapCallback</code> | <code>function</code> | <code>null</code> | - |
| <code>toggleFlag</code> | <code>boolean</code> | <code>true</code> | 다시 누르면 닫힘 |
| <code>className</code> | <code>string</code> | <code>'wux-controls-popup'</code> | 바깥 요소 클래스 |
| <code>arrowBoxFlag</code> | <code>boolean</code> | <code>false</code> | 말풍선 화살표 |
| <code>autoHide</code> | <code>boolean</code> | <code>true</code> | 바깥 누르면 닫힘 |
| <code>usePaddingFlag</code> | <code>boolean</code> | <code>true</code> | 안쪽 여백 |
| <code>forceKeepOrientation</code> | <code>boolean</code> | - | - |
| <code>resizableFlag</code> | <code>boolean</code> | <code>false</code> | 크기 조절 |
| <code>modalFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>false</code> | 뒤를 막음 |
| <code>preferredHeight</code> <Badge type="warning" text="2026" /> | <code>number</code> | - | 높이 |
| <code>canClosePopup</code> <Badge type="warning" text="2026" /> | <code>function</code> | 함수 | 닫아도 되는지 판정 |

메서드: <code>setBody(el)</code>, <code>getBody()</code>, <code>show()</code>, <code>hide()</code>, <code>toggle()</code>, <code>isElementInside(el)</code>. 이벤트: <code>show</code>, <code>hide</code>

## ProgressBar

`DS/Controls/ProgressBar`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>number</code> | <code>0</code> | 0 ~ 100 |
| <code>shape</code> | <code>string</code> | <code>'linear'</code> | <code>linear</code>, <code>circular</code> |
| <code>emphasize</code> | <code>string</code> | <code>'info'</code> | 색 |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | 모양 |
| <code>statusFlag</code> | <code>boolean</code> | <code>true</code> | 퍼센트 글자 |
| <code>infiniteFlag</code> | <code>boolean</code> | <code>false</code> | 끝없는 막대 |
| <code>height</code> | <code>number</code> | - | 높이 |
| <code>gradientAnimationFlag</code> | <code>boolean</code> | <code>true</code> | 그라데이션 움직임 |

이벤트: <code>change</code>

## Loader

`DS/Controls/Loader`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>shape</code> | <code>string</code> | <code>'circular'</code> | <code>circular</code> 등 |
| <code>fadeDuration</code> | <code>number</code> | <code>1000</code> | 나타남 / 사라짐 시간 (ms) |
| <code>text</code> | <code>string</code> | <code>''</code> | 글자 |
| <code>showButtonFlag</code> | <code>boolean</code> | <code>false</code> | 버튼 표시 |
| <code>height</code> | <code>number</code> | - | 높이 |
| <code>allowUnsafeHTMLText</code> | <code>boolean</code> | - | 글자를 HTML 로 |

| 메서드 | 설명 |
| --- | --- |
| <code>on(text?)</code> | 켜기. 부를 때마다 횟수 +1, 처음에만 나타남 |
| <code>off(text?)</code> | 같은 글자를 찾아 횟수 -1. 0 이면 사라짐 |
| <code>update(percent)</code> | 진행률 막대 (<code>'40%'</code> 또는 <code>40</code>). 비우면 끝없는 막대 |

이벤트: <code>show</code>, <code>hide</code>

## ModalLoader, ModalContainer

객체를 만들지 않고 정적 함수만 씁니다.

| 함수 | 설명 |
| --- | --- |
| <code>ModalLoader.displayModalLoader(el, text?, callback?)</code> | <code>el</code> 위에 Loader 가리개. <code>callback</code> 은 화면에 그려진 뒤 |
| <code>ModalLoader.removeModalLoader(el, text?)</code> | 같은 글자로 하나 줄임. 0 이면 제거 |
| <code>ModalContainer.createModal(el, content?, { transparentFlag }?)</code> | <code>el</code> 위에 가리개 (<code>div.wux-controls-modalContainer</code>)와 내용. <code>el</code> 이 <code>position: static</code> 이면 예외 |
| <code>ModalContainer.removeModal(el)</code> | 가리개 제거 |

## TooltipModel

`DS/Core/TooltipModel`. 컨트롤의 `tooltipInfos` 에 일반 객체를 넘기면 이 클래스로 바뀝니다. `DS/Controls/TooltipModel` 은 같은 클래스를 돌려주며 콘솔에 폐기 경고를 찍습니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>owner</code> | <code>object</code> | - | 툴팁을 가진 요소 (자동) |
| <code>title</code> | <code>string</code> | <code>''</code> | 제목 |
| <code>postTitle</code> | <code>string</code> | <code>''</code> | 제목 뒤 글자 |
| <code>shortHelp</code> | <code>string</code> | <code>''</code> | 짧은 설명 |
| <code>longHelp</code> | <code>string</code> | <code>''</code> | 긴 설명 |
| <code>shortHelpImage</code> | <code>string</code> | <code>''</code> | 짧은 설명 이미지 |
| <code>longHelpImage</code> | <code>string</code> | <code>''</code> | 긴 설명 이미지 |
| <code>shortHelpImageDimension</code> | <code>vector2</code> | <code>null</code> | - |
| <code>longHelpImageDimension</code> | <code>vector2</code> | <code>null</code> | - |
| <code>initialDelay</code> | <code>integer</code> | <code>1000</code> | 표시 대기 (ms) |
| <code>shortToLongDelay</code> | <code>integer</code> | <code>2000</code> | 긴 설명까지 (ms) |
| <code>reshowDelay</code> | <code>integer</code> | <code>1000</code> | 다시 표시 대기 (ms) |
| <code>mouseRelativePosition</code> | <code>boolean</code> | <code>true</code> | 마우스 위치 기준 |
| <code>position</code> | <code>string</code> | <code>'bottom'</code> | 위치 |
| <code>wrapPolicy</code> | <code>integer</code> | - | - |
| <code>wrapThreshold</code> | <code>integer</code> | <code>270</code> | 줄바꿈 너비 |
| <code>allowUnsafeHTMLTitle</code> | <code>boolean</code> | - | - |
| <code>allowUnsafeHTMLShortHelp</code> | <code>boolean</code> | - | - |
| <code>allowUnsafeHTMLLongHelp</code> | <code>boolean</code> | - | - |
| <code>moreHelpCB</code> | <code>function</code> | - | 자세히 보기 링크 함수 |
| <code>getAllInformationCB</code> | <code>function</code> | - | 표시 직전에 내용을 돌려주는 함수 |
| <code>mouseOffset</code> <Badge type="warning" text="2026" /> | <code>object</code> | - | 마우스 기준 어긋남 |
