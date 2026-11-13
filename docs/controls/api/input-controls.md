---
title: 입력 컨트롤 API
---

# 입력 컨트롤 API <Badge type="info" text="원본 분석" />

숫자, 칩, 찾기, 파일 입력 컨트롤과 터치 키패드(Decorator)의 공개 속성(publishedProperties), 메서드, 이벤트입니다. 사용법은 [입력 컨트롤](/controls/input-controls) 에 있습니다.

```js
var spin = new SpinBox({ value: 1, minValue: 0, stepValue: 1 }).inject(el);
spin.value = 3;
spin.addEventListener('change', function (e) { console.log(e.dsModel.value); });
```

::: info 근거
Controls.js (2025, 2026) 각 모듈의 `publishedProperties` (2025 `Object.defineProperty(t, "publishedProperties", ...)`, 2026 `static get publishedProperties()`), `_apply...` / `_preEdit...` 함수, `fire("...")` 호출, prototype / class 메서드. UWA 방식 모듈(Knob, Switch, SmartInput)은 `defaultOptions`. Core.js 의 BaseComponent, WebUXComponents. 표의 기본값은 소스의 `defaultValue` 그대로입니다.
:::

- 표의 키는 생성자 옵션과 속성 이름입니다. `ctrl.키 = 값` 또는 `ctrl.setProperties({ ... })` 로 바꿉니다.
- `Abstract` 를 상속한 컨트롤은 [Abstract](/controls/api/webux-controls#abstract) 의 속성(`disabled`, `visibleFlag`, `tooltipInfos`, `fireOnlyFromUIInteractionFlag` ...)도 모두 가집니다. 여기서는 다시 적지 않습니다.
- 이벤트는 `ctrl.addEventListener(이름, fn)` 으로 받습니다. `e.dsModel` 이 컨트롤, `e.options` 가 추가 정보입니다. `dimensionsChanged` 는 내부용이라 뺐습니다.
- Knob, Switch, SmartInput 은 `Abstract` 가 아니므로 이 규칙을 따르지 않습니다. 각 절에 따로 적습니다.

## SpinBox

`DS/Controls/SpinBox` (부모 `Abstract`). 안에서 `SpinBoxDecorator`, `DecoratorManager`, `DS/Units/Units` 를 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>number</code> | <code>0</code> | 값. 코드로 넣어도 <code>minValue</code> / <code>maxValue</code> 로 맞춤. 숫자로 못 바꾸는 값은 무시 |
| <code>units</code> | <code>string</code> | <code>''</code> | 화면 글자 뒤 단위. 입력의 다른 단위를 이 단위로 바꿈 (<code>DS/Units</code>) |
| <code>minValue</code> | <code>number</code> | - | 최솟값 |
| <code>maxValue</code> | <code>number</code> | - | 최댓값 |
| <code>stepValue</code> | <code>number</code> | <code>0.1</code> | 버튼, 위/아래 키, 휠 한 번의 증감 |
| <code>pageStepValue</code> | <code>number</code> | <code>10</code> | PageUp / PageDown 증감 |
| <code>decimals</code> | <code>integer</code> | <code>5</code> | 화면 소수 자릿수 (0 ~ 9 로 제한). 증감 결과만 이 자리로 반올림. 2026 은 <code>null</code> 이면 제한 없음, 숫자가 아니면 <code>5</code> |
| <code>highExponentProperty</code> | <code>integer</code> | <code>6</code> | 절댓값이 10^n 이상이면 지수 표기 |
| <code>lowExponentProperty</code> | <code>integer</code> | <code>6</code> | 0 이 아니고 10^-n 미만이면 지수 표기 |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | <code>normal</code> 이면 증감 버튼 표시. 다른 값이면 버튼 숨김 |
| <code>useScientificNotationFlag</code> | <code>boolean</code> | <code>false</code> | 늘 지수 표기 |
| <code>displayCustomizer</code> | <code>function</code> | - | 폐기. 넣으면 경고 후 <code>customFormatter</code> 로 복사 |
| <code>customFormatter</code> | <code>function</code> | - | <code>fn(value)</code> → 화면 글자. 문자열이 아니면 기본 형식 |
| <code>customValidator</code> | <code>function</code> | - | <code>fn(입력 글자, 증감량, { operationType })</code> → 숫자 / <code>Promise</code>. <code>NaN</code> 이면 현재 값 + 증감량 |
| <code>typingFilter</code> | <code>boolean</code> | - | <code>true</code> 면 숫자 외 글자 막음. 함수 <code>fn(keyCode)</code> 가 <code>true</code> 를 돌려주면 그 키도 막음. <code>units</code> 가 있으면 꺼짐 |
| <code>allowUndefinedFlag</code> | <code>boolean</code> | <code>false</code> | 비우기 / <code>Infinity</code> 를 <code>undefined</code> 로 받음. 빈 칸 안내 글자 <code>- -</code> |
| <code>useLocaleDisplayOutsideEdition</code> | <code>boolean</code> | <code>false</code> | 포커스 밖에서 <code>toLocaleString</code> 으로 표시. 2026 에서 삭제 |
| <code>handleEditionCancel</code> | <code>boolean</code> | <code>true</code> | Esc 로 마지막 확정 값으로 되돌림 |
| <code>customDecoratorDefinition</code> | <code>Object</code> | - | <code>{ decoratorID }</code>. 터치 키패드 선택. 비우면 기본 키패드 ([DecoratorManager](#decoratormanager)) |
| <code>selectAllOnFocus</code> | <code>boolean</code> | <code>true</code> | 포커스 / 증감 때 글자 전체 선택 |
| <code>selectAllOnIncrement</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | - | 증감 뒤 전체 선택. 비우면 <code>selectAllOnFocus</code> 를 따름 |
| <code>requiredFlag</code> | <code>boolean</code> | <code>false</code> | 필수. 값이 <code>undefined</code> 면 <code>validState</code> 가 <code>false</code> |
| <code>placeholder</code> | <code>string</code> | <code>''</code> | 안내 글자 |
| <code>valueToCommit</code> | <code>string</code> | <code>''</code> | 타이핑 중인 글자 |
| <code>validFlag</code> | <code>boolean</code> | <code>true</code> | <code>false</code> 면 <code>validState</code> 가 <code>false</code> (직접 오류 표시) |
| <code>validState</code> | <code>boolean</code> | <code>true</code> | 읽기 전용. <code>requiredFlag</code> / <code>validFlag</code> 결과. 화면에 <code>invalid</code> 속성 |
| <code>readOnlyFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>false</code> | 입력칸 <code>readonly</code>, 증감 버튼 숨김 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경 (코드로 바꿔도). 증감은 한 칸마다. Esc 되돌림은 제외 | - |
| <code>uncommittedChange</code> | 타이핑 | - |
| <code>beginEdit</code> | 타이핑 / 버튼 / 키 조작 시작 | - |
| <code>endEdit</code> | 조작 끝 (Enter, 포커스 이동, 버튼 / 키 뗌) | - |
| <code>cancelEdit</code> | Esc 로 편집 취소 | - |
| <code>validStateChange</code> | <code>validState</code> 변경 | - |
| <code>focus</code> | 포커스 받음 (2025 만) | - |

| 메서드 | 설명 |
| --- | --- |
| <code>increment()</code> / <code>decrement()</code> | <code>stepValue</code> 만큼 증감. 2025 는 <code>(fromUI?)</code>, 2026 은 <code>(증감량?, fromUI?)</code> |
| <code>stepIncrement()</code> / <code>stepDecrement()</code> <Badge type="warning" text="2026" /> | <code>stepValue</code> 만큼 증감 |
| <code>pageIncrement()</code> / <code>pageDecrement()</code> | <code>pageStepValue</code> 만큼 증감 |
| <code>commitCurrentEntry()</code> | <code>valueToCommit</code> 을 <code>value</code> 로 확정 |
| <code>getInputText()</code> | 입력칸의 지금 글자 |
| <code>filteringCharOtherThanNumberEdition(keyEvent)</code> | <code>typingFilter</code> 가 쓰는 판정. 막을 키면 <code>true</code> |

`minValue` / `maxValue` 를 만든 뒤 `0` 으로 바꾸면 현재 값을 범위로 옮기지 않습니다 (`if (this.minValue)` 검사). 키보드: 위/아래, PageUp/PageDown, Enter (확정), Esc (취소).

## Slider

`DS/Controls/Slider` (부모 `Abstract`). 값 말풍선은 `DS/Controls/Popup`.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>minValue</code> | <code>number</code> | <code>0</code> | 최솟값 |
| <code>maxValue</code> | <code>number</code> | <code>100</code> | 최댓값 |
| <code>stepValue</code> | <code>number</code> | <code>1</code> | 간격. 값은 <code>minValue + n × stepValue</code> 로 맞춤 |
| <code>value</code> | <code>number</code> | <code>0</code> | 값. 배열이면 손잡이 여러 개 (이웃을 넘지 못함). 숫자 / 배열 / <code>null</code> 외는 무시 |
| <code>displayStyle</code> | <code>string</code> | <code>'horizontal'</code> | <code>horizontal</code>, <code>vertical</code> |
| <code>tooltipPosition</code> | <code>string</code> | <code>''</code> | 말풍선 위치. 비우면 가로 <code>top</code>, 세로 <code>right</code> |
| <code>handleEditionCancel</code> | <code>boolean</code> | <code>true</code> | Esc 로 마지막 누르기 / 떼기 때 값으로 되돌림 |
| <code>valuePopupFlag</code> | <code>boolean</code> | <code>true</code> | 값 말풍선 (마우스 올림 / 누름) |
| <code>sliderButtonStyle</code> | <code>string</code> | <code>'standard'</code> | <code>standard</code>, <code>accurate</code> |
| <code>suffix</code> | <code>string</code> | <code>''</code> | 말풍선 글자 뒤 글자 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경. 끄는 동안 계속, 코드로 바꿔도, Esc 때도 | - |
| <code>beginEdit</code> | 누름, 키 누름, 휠 | 누름이면 <code>{ pointerDown: true }</code> |
| <code>endEdit</code> | 뗌, 키 뗌, 휠 | - |
| <code>cancelEdit</code> | Esc (끄는 중), 편집 중 숫자가 아닌 값 대입 | - |

| 메서드 | 설명 |
| --- | --- |
| <code>increment(index?)</code> / <code>decrement(index?)</code> | <code>stepValue</code> 만큼. 배열이면 <code>index</code> 번 손잡이 (기본 0) |
| <code>getPercentage(index?)</code> | 범위 안 위치 (0 ~ 100) |
| <code>setPercentage(p)</code> | 위치(0 ~ 100)로 값 지정 |
| <code>getTextFromValue(index?)</code> | 말풍선 글자 (값 + <code>suffix</code>). 2026 은 <code>NumberUtils.formatNumberToString</code> 사용 |

## ColoredSlider

`DS/Controls/ColoredSlider` (부모 `Slider`). 아래 키 외에는 [Slider](#slider) 와 같습니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>minValue</code> | <code>number</code> | <code>0</code> | 최솟값 |
| <code>maxValue</code> | <code>number</code> | <code>255</code> | 최댓값 |
| <code>stepValue</code> | <code>number</code> | <code>1</code> | 간격 |
| <code>colorFrom</code> | <code>string</code> | <code>'#000'</code> | 시작 색. <code>#rgb</code>, <code>#rrggbb</code>, <code>transparent</code>. 그 외는 <code>#000</code> |
| <code>colorTo</code> | <code>string</code> | <code>'#fff'</code> | 끝 색. 형식 같음 |

손잡이 색은 두 색 사이를 값 비율로 섞은 색입니다. 이벤트는 Slider 와 같습니다.

## GradientSlider

`DS/Controls/GradientSlider` (부모 `Slider`). `ColorEditors`, `ColorChooser` 안에서 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>gradientType</code> | <code>string</code> | <code>'Hue'</code> | <code>Hue</code> (<code>maxValue</code> 360), <code>Saturation</code>, <code>HslSaturation</code>, <code>Value</code>, <code>Lightness</code> (100), <code>Red</code>, <code>Green</code>, <code>Blue</code>, <code>Alpha</code> (255) |
| <code>modulationColor</code> | <code>array</code> | - | HSV 색 <code>[h, s, v, a?]</code>. 넣으면 해당 성분이 <code>value</code> 가 됨. 값을 바꾸면 이 배열도 갱신 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경 | <code>{ colorSubAttributeType }</code> (<code>gradientType</code>) |

| 메서드 | 설명 |
| --- | --- |
| <code>setColorSubAttribute(type, v)</code> | <code>type</code> 이 <code>gradientType</code> 과 같을 때만 <code>value = v</code> |
| <code>updateCanvas()</code> | 배경 그라데이션 다시 그림 |

## SelectionChips

`DS/Controls/SelectionChips` (부모 `Abstract`). 우클릭 메뉴는 `DS/Menu/ContextualMenu`, 끌어 놓기는 `DS/UIBehaviors/DragAndDropManager`.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>selection</code> | <code>object</code> | <code>{ toggle: true, mode: 2, unselectAllOnEmptyArea: true }</code> | <code>toggle</code> 선택된 칩 다시 누르면 해제, <code>mode</code> (<code>SELECTION_MODE</code>), <code>unselectAllOnEmptyArea</code> 빈 곳 누르면 전체 해제 |
| <code>placeholder</code> | <code>string</code> | <code>''</code> | 칩이 없을 때 글자 |
| <code>displayMenu</code> | <code>boolean</code> | <code>true</code> | <code>⋮</code> 메뉴 버튼 ("모두 지우기") |
| <code>acceptDrop</code> | <code>function</code> | - | <code>fn({ sourceSelectionChips, targetSelectionChips, dndInfos })</code> → <code>boolean</code> / <code>Promise</code>. 다른 SelectionChips 사이 이동은 양쪽 모두 참이어야 함 |
| <code>onDragStartCell</code>, <code>onDragEndCell</code>, <code>onDragOverCell</code>, <code>onDragEnterCell</code>, <code>onDragLeaveCell</code>, <code>onDropCell</code> | <code>function</code> | - | 칩 위 끌기 이벤트. <code>fn(event, dndInfos)</code>. 참을 돌려줘야 기본 동작(<code>...Default</code>) 실행 |
| <code>onDropBlank</code>, <code>onDragLeaveBlank</code>, <code>onDragOverBlank</code>, <code>onDragEnterBlank</code> | <code>function</code> | - | 빈 곳 끌기 이벤트. 규칙 같음 |

`value` 속성은 없습니다. `dndInfos` 는 `{ chipCellView, dropPosition, dropIndex }` 이고 `dropPosition` 은 `'left'` 또는 `'right'` 입니다.

칩 옵션: `{ label, value, icon, tooltip, id, index }`. `icon` 은 `Dom.generateIcon` 형식, `tooltip` 은 툴팁 객체 (없으면 글자가 잘릴 때 전체 글자 툴팁).

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | 칩 추가 / 삭제 / 글자·순서 변경 (코드로 해도) | - |
| <code>onPostAdd</code> | 추가 뒤 | <code>{ chips }</code>. <code>addChip</code> 은 내부 항목 배열, <code>addChips</code> 는 넘긴 배열 |
| <code>onPostRemove</code> | 삭제 뒤 | <code>{ chips }</code>, <code>removeAllChips</code> 는 <code>allChipsRemoved: true</code> |
| <code>selectionChange</code> | 선택 변경 (코드로 해도) | - |

| 메서드 | 설명 |
| --- | --- |
| <code>addChip(opts 또는 label)</code> | 칩 추가. 내부 항목 <code>{ chipOptions, isSelected, associatedChipCellView }</code> 반환. <code>index</code> 가 범위 밖이면 추가 안 함 |
| <code>addChips(array)</code> | 여러 개 추가. <code>change</code> 한 번. 칩 옵션 7 개 키만 복사 |
| <code>removeChip(label 또는 index 또는 { 키: 값 })</code> | 첫 번째로 맞는 칩 삭제. 객체는 첫 키로 비교. 지운 항목 반환 |
| <code>removeChips(array)</code> | 차례로 <code>removeChip</code>. index 는 큰 번호부터 |
| <code>removeAllChips()</code> | 전부 삭제 |
| <code>updateChipOptions(label 또는 index, opts)</code> | 옵션 합치기. 글자나 <code>index</code> 가 바뀔 때만 <code>change</code> |
| <code>getChipLabel(index)</code> / <code>getChipPosition(label)</code> | 글자 / 위치 (없으면 <code>''</code> / <code>-1</code>) |
| <code>getAllChipsOptions()</code> / <code>getAllChipsAsLabels()</code> | 모든 칩 옵션 (복사본) / 글자 배열 |
| <code>getSelectedChipsOptions()</code> | 선택된 칩 옵션 |
| <code>getNumberOfChips(selectedOnly?)</code> | 칩 수. <code>true</code> 면 선택된 수 |
| <code>selectChip(label 또는 index 또는 항목)</code> / <code>unselectChip(...)</code> | 선택 / 해제. 다중 선택이 아니면 <code>selectChip</code> 은 나머지를 해제 |
| <code>selectAllChips()</code> / <code>unselectAllChips()</code> | 전체 선택 (다중 선택 중일 때만) / 전체 해제 |
| <code>isInMultiSelection()</code> | <code>mode</code> 가 <code>MULTIPLE</code> 이거나, <code>MULTIPLE_ONKEYS</code> 에서 Ctrl / Shift 누름 |
| <code>addLastWidget(content)</code> / <code>removeLastWidget()</code> | 칩 뒤에 컨트롤 / 요소 붙이기 (SelectionChipsEditor 의 입력칸) |
| <code>getUUID()</code> | 끌어 놓기 구분용 id |
| <code>onDragStartCellDefault</code> ... <code>onDropBlankDefault</code> | 끌어 놓기 기본 동작 (직접 부를 일은 없음) |

정적: <code>SelectionChips.SELECTION_MODE</code> = <code>{ SINGLE: 0, MULTIPLE: 1, MULTIPLE_ONKEYS: 2 }</code>

## SelectionChipsEditor

`DS/Controls/SelectionChipsEditor` (부모 `Abstract`). 안에 `SelectionChips` 와 `LineEditor` (`displayStyle: 'lite'`) 를 만듭니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>placeholder</code> | <code>string</code> | <code>''</code> | 입력칸 안내 글자 |
| <code>value</code> | <code>Array</code> | - | 문자열 배열. 문자열 하나는 <code>[문자열]</code>. 빈 문자열 / 문자열 아닌 항목은 버림. 바꾸면 칩을 모두 다시 만듦 |
| <code>uniqueValue</code> | <code>Boolean</code> | <code>false</code> | 중복 금지. 켜면 기존 중복도 정리 |
| <code>customValidator</code> | <code>function</code> | - | <code>fn(입력 글자)</code> → 문자열 / 문자열 배열 / <code>Promise</code>. 결과만 칩이 됨 |
| <code>selection</code> | <code>object</code> | <code>{ toggle: true, mode: SELECTION_MODE.MULTIPLE_ONKEYS, unselectAllOnEmptyArea: true }</code> | 안쪽 SelectionChips 에 전달 |
| <code>maxLength</code> | <code>integer</code> | <code>-1</code> | 입력칸 최대 글자 수. 각 값을 이 길이로 자름 |

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>value</code> 변경 (입력 확정, 칩 삭제, <code>addValues</code> / <code>removeValues</code>, 코드 대입) |

| 메서드 | 설명 |
| --- | --- |
| <code>addValues(array)</code> | 문자열 추가. 하나라도 들어가면 <code>change</code> |
| <code>removeValues(array)</code> | 같은 글자의 칩 삭제 (글자마다 첫 번째 하나) |
| <code>getSelectedChipsValue()</code> | 선택된 칩 글자 배열 |
| <code>selectChip(...)</code> / <code>unselectChip(...)</code> / <code>selectAllChips()</code> | 안쪽 SelectionChips 로 위임 |

키: Enter / 포커스 이동 (확정), Tab / Shift+Tab (입력 글자가 있으면 확정 후 포커스 유지), Esc (입력 글자 지우기).

## Find

`DS/Controls/Find` (부모 `Abstract`). 안에 `LineEditor` (`displayStyle: 'lite'`, `sizeInCharNumber: 22`), `Toggle`, `Loader` 를 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>findStr</code> | <code>string</code> | <code>''</code> | 찾을 글자. 타이핑하면 바뀜. 코드로 바꾸면 입력칸에 넣고 500ms 뒤 찾기 |
| <code>count</code> | <code>number</code> | - | 찾은 개수 (대상이 넣음). 0 보다 크면 현재 번호 1 |
| <code>matchCase</code> | <code>boolean</code> | <code>false</code> | 대소문자 구분. 만든 뒤 바꾸면 <code>count = 0</code> 후 바로 찾기 |
| <code>displayMatchCaseToggle</code> | <code>boolean</code> | <code>false</code> | 대소문자 토글 표시 |
| <code>displayNavigationButtons</code> | <code>boolean</code> | <code>true</code> | 이전 / 다음 버튼. <code>count</code> 가 2 이상일 때만 눌림 |
| <code>displayClose</code> | <code>boolean</code> | <code>true</code> | 닫기 버튼 |
| <code>relatedWidget</code> | <code>object</code> | - | 찾기 대상. 아래 함수들의 <code>this</code>. <code>relatedWidget.findWidget</code> 에 Find 가 들어감. **없으면 함수가 불리지 않음** |
| <code>onFindRequest</code> | <code>function</code> | - | <code>fn(findStr, matchCase, 현재 번호)</code>. 타이핑 500ms 뒤, 대소문자 변경, 다시 보이기 |
| <code>onFindPreviousResult</code> | <code>function</code> | - | 이전 (버튼, Shift+Enter). 인자 없음 |
| <code>onFindNextResult</code> | <code>function</code> | - | 다음 (버튼, Enter). 인자 없음 |
| <code>onFindClose</code> | <code>function</code> | - | 닫기 (버튼, Esc, <code>close()</code>) |
| <code>placeholder</code> | <code>string</code> | <code>''</code> | 입력칸 안내 글자 |
| <code>closeOnEscape</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>true</code> | Esc 로 닫기 |

`fire` 이벤트는 없습니다. 위 함수로 받습니다. 현재 번호는 공개 속성이 아닌 필드 `find.currentValue` 에 있습니다.

| 메서드 | 설명 |
| --- | --- |
| <code>close()</code> | <code>visibleFlag = false</code> 후 <code>onFindClose</code> |
| <code>setCurrentValue(n)</code> | 현재 번호 표시 바꾸기 (함수는 부르지 않음) |
| <code>setLoadingState(flag)</code> | 입력칸 옆 Loader 표시 / 숨김 |
| <code>destroy()</code> | <code>relatedWidget.findWidget</code> 을 비우고 정리 |

`visibleFlag` 를 `false` 에서 `true` 로 바꾸면 `onFindRequest` 가 현재 번호와 함께 바로 불립니다. Enter 를 debounce 대기 중에 누르면 기다리지 않고 바로 찾습니다.

## FilePicker

`DS/Controls/FilePicker` (부모 `Abstract`). 안에 읽기 전용 `LineEditor`, 올리기 `Button`, 숨은 `<input type="file">` 을 만듭니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>Object</code> | - | <code>allowMultipleFiles</code> 가 <code>false</code> 면 <code>File</code>, <code>true</code> 면 <code>FileList</code>. 다른 값은 무시. <code>undefined</code> 로 비움 |
| <code>placeholder</code> | <code>string</code> | - | 입력칸 안내 글자. 문자열이 아니면 번역 리소스 <code>dragAndDropFiles</code> |
| <code>displayStyle</code> | <code>string</code> | <code>'lineEditor'</code> | 쓰는 코드가 없음. 2026 에서 삭제 |
| <code>fileTypes</code> | <code>string</code> | - | 파일 창 <code>accept</code>. 끌어 놓기는 거르지 않음 |
| <code>allowMultipleFiles</code> | <code>boolean</code> | <code>false</code> | 여러 파일. 바꾸면 현재 값을 <code>File</code> ↔ <code>FileList</code> 로 바꿈 |
| <code>allowResetToUndefinedByUIFlag</code> | <code>boolean</code> | <code>false</code> | 지우기 버튼 (LineEditor <code>displayClearFieldButtonFlag</code>) |
| <code>dropOptions</code> | <code>Object</code> | - | <code>{ dropArea, className }</code>. <code>dropArea</code> 요소에 끌어 놓기 처리와 안내 상자를 붙임. 상자 크기는 영역 높이로 <code>small</code> (42px 미만) / <code>normal</code> (280px 미만) / <code>big</code> |

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>value</code> 변경 (파일 창, 놓기, 지우기, 코드 대입) |

| 메서드 | 설명 |
| --- | --- |
| <code>focus()</code> | 안쪽 입력칸에 포커스 |

`tooltipInfos` 를 주지 않으면 파일 이름(없으면 번역 리소스 `inputNoFileChosen`)을 툴팁으로 씁니다.

## AbstractDecorator

`DS/Controls/AbstractDecorator` (부모 `Abstract`). 입력칸 아래 `Popup` (`position: 'bottom'`, `className: 'wux-controls-popup wux-decorator-popup'`)으로 뜨는 키패드의 부모입니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>widget</code> | <code>IWUXControlAbstract</code> | - | 키패드를 띄운 컨트롤 (SpinBox, LineEditor). <code>DecoratorManager.showDecorator</code> 가 넣음 |
| <code>decoratedWidget</code> | <code>HTMLElement</code> | - | 팝업 기준 요소 (입력칸) |
| <code>visibleFlag</code> | <code>boolean</code> | <code>false</code> | 표시 여부. 기본이 <code>false</code> |

| 메서드 | 설명 |
| --- | --- |
| <code>show()</code> | 표시 |
| <code>hide(validate?)</code> | 숨김. <code>validate</code> 를 <code>widget</code> 의 숨김 처리로 넘김 (SpinBox 는 <code>true</code> 면 입력 확정) |
| <code>destroy()</code> | 숨기고 정리 |

## CustomizableDecorator

`DS/Controls/CustomizableDecorator` (부모 `AbstractDecorator`). 버튼 격자 키패드입니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>items</code> | <code>Object&#124;Array</code> | - | 항목 ID 배열, 또는 <code>{ 화면이름: [ID, ...] }</code>. ID 는 [CustomizableDecoratorItems](#customizabledecoratoritems) 에 있어야 그려짐 |
| <code>activeView</code> | <code>string</code> | - | 보이는 화면 이름. 비우면 배열은 <code>'WUXDefaultActiveView'</code>, 객체는 첫 키 |
| <code>viewSwitchingDefinition</code> | <code>Object</code> | - | <code>{ 항목ID: 화면이름 }</code>. 그 항목을 누르면 화면 전환 |
| <code>onClick</code> | <code>Function</code> | - | <code>fn({ itemID, input })</code>. <code>{ preventDefault: true }</code> 를 돌려주면 기본 동작 생략. 2026 은 두 번째 인자로 pointer 이벤트 |
| <code>gridDefinition</code> | <code>Object</code> | - | <code>{ numberOfColumns, numberOfLines }</code> 또는 <code>{ 화면이름: { ... } }</code>. 비우면 항목 수의 제곱근 |

| 메서드 | 설명 |
| --- | --- |
| <code>resetActiveView()</code> | 첫 화면으로 (키패드가 닫힐 때 컨트롤이 부름) |

항목을 누르면 `widget._onDecoratorClick(itemID)` 이 기본 동작을 합니다: `label` 이 있는 항목은 커서 위치에 글자 넣기, `delete` 는 한 글자 지우기, `validate` 는 닫고 확정, `arrowUp` / `arrowDown` 은 SpinBox 증감.

## CustomizableDecoratorItems

`DS/Controls/CustomizableDecoratorItems`. 항목 ID → 모양 사전입니다 (싱글턴, 정적 함수). 기본 항목은 `DS/Controls/assets/CustomizableDecoratorItems.json` 에서 읽습니다.

| 정적 함수 | 설명 |
| --- | --- |
| <code>getItem(id)</code> | 항목 정의 <code>{ label }</code> 또는 <code>{ icon, semantics }</code> |
| <code>addDecoratorItems({ id: 정의, ... })</code> | 항목 추가 (<code>UWA.merge</code>) |
| <code>getInstance()</code> | 사전 객체 |

| 항목 정의 키 | 설명 |
| --- | --- |
| <code>label</code> | 버튼 글자. 누르면 이 글자를 입력 |
| <code>icon</code> | <code>Dom.generateIcon</code> 형식 아이콘 (<code>label</code> 이 없을 때) |
| <code>semantics</code> | <code>wux-decorator-item-</code> 뒤에 이 값을 붙인 클래스 (기본 항목은 <code>primary</code>, <code>success</code>) |

기본 ID: `0` ~ `9`, `addition` (+), `substraction` (-), `multiplication` (*), `division` (/), `percentage` (%), `decimal` (.), `exponential` (e), `PI` (π), `openParenthesis`, `closeParenthesis`, `squareRoot` (√), `square` (²), `equals`, `hash`, `sinus`, `cosinus`, `tangente`, `absoluteValue` (절댓값), `arrowUp`, `arrowDown`, `validate`, `delete`, `emptySpace` (빈 칸).

## DecoratorManager

`DS/Controls/DecoratorManager`. `UWA/Class.singleton` 이라 모듈 자체가 인스턴스입니다 (`new` 하지 않음).

| 메서드 | 설명 |
| --- | --- |
| <code>registerDecorator(id, decorator)</code> | 키패드 등록. 같은 <code>id</code> 는 콘솔 로그 후 무시 |
| <code>createDecorator(id, widget, element, amdPath, callback)</code> | <code>amdPath</code> 모듈을 불러 <code>new Module({ widget, decoratedWidget: element })</code> 로 만들고 등록 후 <code>callback</code> |
| <code>showDecorator(widget, element, id?)</code> | 보이던 키패드를 닫고 <code>id</code> (없으면 <code>widget.name</code>) 키패드 표시 |
| <code>hideDecorator(validate, force)</code> | 숨김. <code>force</code> 가 아니면 <code>widget</code> 에 포커스가 없을 때만 |
| <code>getWidget()</code> / <code>getDecorator()</code> | 지금 키패드를 띄운 컨트롤 / 키패드 |
| <code>isDecoratorDisplayed()</code> | 키패드가 보이는지 |

SpinBox 는 터치로 입력칸을 누르면 `customDecoratorDefinition.decoratorID` (없으면 `SpinBoxDecorator.getId()`), LineEditor 는 `customDecoratorDefinition.decoratorID` 가 있을 때만 `showDecorator` 를 부릅니다.

## SpinBoxDecorator

`DS/Controls/SpinBoxDecorator`. SpinBox 기본 키패드를 만드는 정적 클래스입니다.

| 정적 | 설명 |
| --- | --- |
| <code>getId()</code> | 처음 부를 때 키패드를 만들어 등록하고 <code>'defaultWebUXSpinBoxDecorator'</code> 반환 |
| <code>decoratorID</code> | 등록된 ID (<code>getId()</code> 전에는 없음) |

화면 두 개: `viewNumbers` (4×4: 숫자, `arrowUp`, `arrowDown`, `delete`, 연산자 화면 전환, `decimal`, `validate`), `viewOperators` (4×1: 숫자 화면 전환, `exponential`, `substraction`, `validate`).

## Knob

`DS/Controls/Knob` (`UWA/Controls/Abstract.extend`, 이름공간 `WUX/Controls/Knob`). 돌리는 다이얼입니다. 앱 사용은 없습니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | <code>0</code> | 처음 값 |
| <code>minValue</code> / <code>maxValue</code> | <code>0</code> / <code>360</code> | 한 바퀴의 범위 |
| <code>stepValue</code> | <code>1</code> | <code>increment(n)</code> 의 단위 |
| <code>snap</code> | <code>0</code> | 이 각도 미만은 0 도로 |
| <code>graduations</code> | <code>12</code> | 눈금 수, 또는 <code>[{ label, value }]</code> |
| <code>graduationsLabel</code> | <code>false</code> | 눈금 글자 |
| <code>dynamicGraduations</code> | <code>false</code> | 눈금을 초록→빨강으로 채움 |
| <code>activeGraduationsColor</code> / <code>inactiveGraduationsColor</code> | <code>'#00FFF5'</code> / <code>'#FF0000'</code> | 눈금 색 |
| <code>graduationsLabelColor</code> | <code>'black'</code> | 눈금 글자 색 |
| <code>knobIndicator</code> | <code>'dot'</code> | <code>wux-ui-indicator-이름</code> 클래스 (SmartInput 은 <code>line</code> 사용) |
| <code>knobMaterial</code> | <code>'pearl'</code> | <code>wux-ui-material-이름</code> 클래스 |
| <code>interactionMode</code> | <code>'rotate'</code> | <code>rotate</code> (끌어 돌리기), <code>vertical-slide</code> (위아래로 끌기) |
| <code>turn</code> | <code>null</code> | 눈금 갱신 함수 <code>fn(비율)</code>. 비우면 기본 |
| <code>onChange</code> | <code>null</code> | <code>fn(value)</code>, <code>this</code> 는 Knob |
| <code>theme</code> | <code>{ display: 'inline-block', fontSize: 10, size: 80 }</code> | 크기 |

| 메서드 | 설명 |
| --- | --- |
| <code>getValue()</code> / <code>setValue(v, fire?)</code> | 값 읽기 / 쓰기. 범위로 맞추지 않음. <code>fire</code> 가 <code>false</code> 면 알림 없음 |
| <code>increment(n)</code> / <code>decrement(n)</code> | <code>n × stepValue</code> 만큼 (콘솔 로그를 찍음) |
| <code>addEventListener('change', fn)</code> / <code>addEvent</code> / <code>addEventOnce</code> | <code>DS/CoreEvents/ModelEvents</code> 구독. 발행 <code>data</code> 는 Knob 자신 |

마우스 휠로도 돌아갑니다 (Shift 는 5 배).

## Switch

`DS/Controls/Switch` (`UWA/Controls/Abstract.extend`). 폐기 예정이며 만들 때 콘솔에 "Toggle 로 옮기라" 경고를 찍습니다. [Toggle](/controls/api/webux-controls#toggle) `type: 'switch'` 를 씁니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>label</code> | <code>null</code> | 앞 글자 (HTML) |
| <code>value</code> | <code>false</code> | 켜짐 여부 |
| <code>onChange</code> | <code>null</code> | <code>fn(value)</code> |
| <code>size</code> | <code>'mid'</code> | 늘 <code>mid</code> 로 덮어씀 |

| 메서드 | 설명 |
| --- | --- |
| <code>getValue()</code> | 켜짐 여부 |
| <code>setValue(v, fire?)</code> | 값 쓰기. <code>fire</code> 가 <code>false</code> 가 아니면 <code>onChange</code> 와 구독 함수 호출 |
| <code>onChange(fn)</code> | 변경 구독 (<code>ModelEvents</code>, 이벤트 이름 <code>EVT_CHANGE</code>) |

## SmartInput

`DS/Controls/SmartInput` (`UWA/Controls/Abstract.extend`, 이름공간 `WUX/Controls/SmartInput`). 2025 에만 있고 2026 에서 삭제되었습니다. 만들 때 "SmartInputs/* 를 쓰라" 경고를 찍습니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>kind</code> | <code>'string'</code> | <code>text</code>, <code>combo</code> (실제로는 range), <code>switch</code>, <code>translation</code>, <code>rotation</code>, <code>vector</code>, <code>direction</code>, <code>matrix4x4</code>, <code>angle</code> / <code>intensity</code> (Knob), <code>systemColor</code>, <code>distance</code>, <code>number</code>, <code>date</code>. 그 외는 UWA Form 필드 type |
| <code>label</code> | <code>'Value'</code> | 글자 |
| <code>name</code> | <code>'smart_input'</code> | 필드 이름. <code>onConfirm</code> 에 전달 |
| <code>unit</code> | <code>''</code> | 확정 후 값 뒤 글자 |
| <code>value</code> | - | 처음 값 |
| <code>inPlaceEdit</code> | <code>false</code> | <code>true</code> 면 바로 편집, <code>false</code> 면 글자를 누를 때 확인 / 취소 툴팁으로 편집 |
| <code>editEvent</code> | <code>'click'</code> | 편집 툴팁을 여는 이벤트 |
| <code>rules</code> | <code>{ minLength, maxLength, minValue, maxValue, unit, dataType }</code> (모두 <code>null</code>) | 범위. <code>stepValue</code> 도 읽음 |
| <code>onConfirm</code> | <code>null</code> | <code>fn({ name, value })</code> |
| <code>onCancel</code> / <code>onChange</code> | <code>null</code> | 취소 / 안쪽 입력 변경 |

| 메서드 | 설명 |
| --- | --- |
| <code>getValue()</code> | <code>kind</code> 에 맞는 값 |
| <code>onConfirm(fn)</code> / <code>onCancel(fn)</code> | 콜백 바꾸기 |
