---
title: Tweaker API
---

# Tweaker API <Badge type="info" text="원본 분석" />

모든 편집기(TweakerString, TweakerNumber ...)가 `TweakerBase` 에서 물려받는 속성, 메서드, 이벤트입니다. 편집기별 세부 옵션은 [semantics](/tweakers/api/semantics) 에 있습니다.

```js
var tweaker = new TweakerNumber({ value: 1, minValue: 0 }).inject(el);
tweaker.addEventListener('change', function (e) { console.log(e.dsModel.value); });
```

::: info 근거
Tweakers.js 의 TweakerBase publishedProperties / prototype, Controls.js 의 Abstract, Core.js 의 BaseComponent
:::

## 속성

생성자 옵션으로 넣거나, 만든 뒤 `tweaker.키 = 값` / `tweaker.setProperties({ ... })` 로 바꿉니다. semantics 에 있는 키(`possibleValues`, `readOnly`, `placeholder` ...)도 모두 같은 방식입니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>any</code> | 편집기별 | 현재 값 |
| <code>validState</code> | <code>boolean</code> | <code>true</code> | 유효 여부 (읽기 전용) |
| <code>disabled</code> | <code>boolean</code> | <code>false</code> | 비활성 |
| <code>visibleFlag</code> | <code>boolean</code> | <code>true</code> | 표시 여부 |
| <code>touchMode</code> | <code>boolean</code> | - | 터치용 큰 모양 |
| <code>fireOnlyFromUIInteractionFlag</code> | <code>boolean</code> | <code>false</code> | true 면 사용자 조작으로 생긴 이벤트만 발생 (코드로 값을 넣을 때 change 없음) |
| <code>handleEditionCancel</code> | <code>boolean</code> | <code>true</code> | Esc 로 편집 취소, 값 복원 |
| <code>executionContext</code> | <code>object</code> | - | 버튼 편집기 콜백의 <code>e.context</code> 로 전달 |
| <code>getDisplayedInformation</code> | <code>function</code> | - | 화면 표시 정보를 직접 계산 |
| <code>allowUnsafeHTMLContent</code> | <code>boolean</code> | <code>false</code> | HTML 내용 허용 |
| <code>numeric</code> | <code>boolean</code> | <code>false</code> | 숫자형 값으로 취급 (정렬 등) |
| <code>useWrappedView</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | - | 줄바꿈 표시 모양 사용 |
| <code>invalidTooltip</code> <Badge type="warning" text="2026" /> | - | - | 유효하지 않을 때 툴팁 |

### 편집기별 속성

| 편집기 | 키 (기본값) |
| --- | --- |
| `TweakerString` | `value` (`''`), `displayStyle` (`'lineEditor'`), `pattern`, `requiredFlag`, `autoCorrectFlag`, `minLengthBeforeSearch`, `typeDelayBeforeSearch`, `keepSearchResultsFlag` |
| `TweakerNumber` | `value` (`0`), `displayStyle` (`'spinBox'`), `valueType` (`'number'`), `stepValue` (`0.1`), `decimals` (`5`), `units`, `colorFrom`, `colorTo`, `highExponentProperty`, `lowExponentProperty` |
| `TweakerBoolean` | `value` (`false`), `displayStyle` (`'checkbox'`), `label` |
| `TweakerDate` | `value` (Date), `displayStyle` (`'date'`), `timePickerFlag`, `timePickerPrecision` (`'min'`) |
| `TweakerEnum` | `displayStyle` (`'combo'`), `valueType` (`'enumString'`), `possibleValues` |

## 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>inject(parent, where?)</code> | 화면에 붙임. 자기 자신 반환 |
| <code>getContent()</code> | 화면 요소 (<code>div.wux-tweakers</code>). 요소의 <code>dsModel</code> 이 편집기 |
| <code>remove()</code> | 화면에서 떼기만 함 (정리 안 함) |
| <code>destroy()</code> | 정리 |
| <code>setProperties(obj)</code> | 속성 여러 개 변경 |
| <code>addEventListener(name, fn) / removeEventListener</code> | 이벤트 등록 / 해제 (<code>getContent()</code> 에 위임) |
| <code>disableEvents() / enableEvents()</code> | 이벤트 일시 정지 / 재개. 횟수를 세므로 짝을 맞춤 |
| <code>getEventsAllowedState()</code> | 이벤트가 켜져 있는지 |
| <code>setValueAsReference() / resetToReferenceValue()</code> | 현재 값을 기준값으로 저장 / 기준값으로 되돌림 (<code>referenceValue</code>) |

`getValue()`, `setValue()` 는 없습니다. `value` 속성을 씁니다.

## 이벤트

브라우저 DOM 이벤트이며 위로 전파(bubbles)됩니다. `e.dsModel` 이 편집기, `e.options` 가 추가 정보입니다.

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | 값 확정. 코드로 값을 바꿔도 발생 | 대개 <code>{}</code> |
| <code>liveChange</code> | 타이핑 중 | <code>{ value }</code> |
| <code>preEdit</code> | 편집 시작 (첫 입력) | - |
| <code>postEdit</code> | 편집 끝 | - |
| <code>cancelEdit</code> | Esc 로 취소 | - |
| <code>validStateChange</code> | validState 변경 | - |
| <code>show / hide</code> | 팝업 열림 / 닫힘 | <code>hide</code>: <code>{ cancelFlag }</code> |
| <code>viewBuilt</code> | 비동기 화면 모듈 준비 완료 | - |
