# 입력 컨트롤 (숫자, 칩, 검색, 파일) <Badge type="info" text="원본 분석" />

숫자 입력(`SpinBox`, `Slider`), 여러 값 입력(`SelectionChips`, `SelectionChipsEditor`), 찾기 막대(`Find`), 파일 선택(`FilePicker`) 컨트롤의 사용법입니다. 모두 `DS/Controls/Abstract` 를 상속하므로 만들기, 속성 읽고 쓰기, 이벤트 받기는 [WebUX 컨트롤 공통 사용법](/controls/webux-controls#공통-사용법) 과 같습니다. 속성 전체 표는 [입력 컨트롤 API](/controls/api/input-controls) 에 있습니다.

::: info 근거
Controls.js (2025, 2026) 의 SpinBox (`_preEditValue`, `_applyValue`, `_getValidatedValue`, `_modifyValue`, `_callCustomValidator`, 키 맵), Slider (`_preEditValue`, `_getValidatedSingleValue`, `handleEvents`), ColoredSlider, GradientSlider, SelectionChips (`addChip`, `removeChip`, `selectChip`, 끌어 놓기 함수), SelectionChipsEditor, Find (`_launchFindOnRelatedWidget`, 키 처리), FilePicker (`_preEditValue`, drop 처리), AbstractDecorator, CustomizableDecorator, CustomizableDecoratorItems (`assets/CustomizableDecoratorItems.json`), DecoratorManager, SpinBoxDecorator, Knob, Switch, SmartInput. Core.js 의 BaseComponent (`init`, `setProperties`), WebUXComponents (속성 setter). 호출부: 2DAnnotation, CATWebUXPreferences, AuthGenericCommands, 3DPlay2DExperience, ENO3DView, ENXMeetingMgmt, ENOProjectMgmtCommonComponents, IssueComponents, ENXHistoryUX, ENOUserGroupMgmt, ENOXEngineer, CollectionView, ParameterizationSkeleton, WebVisuGLTFCommands
:::

| 모듈 | 용도 | 앱 사용 파일 수 | 비고 |
| --- | --- | --- | --- |
| `DS/Controls/SpinBox` | 숫자 입력칸 + 증감 버튼 | 38 | 단위, 범위, 자릿수 |
| `DS/Controls/Slider` | 막대 슬라이더 (범위 슬라이더 포함) | 26 | |
| `DS/Controls/SelectionChips` | 칩 목록 (추가 / 삭제 / 선택) | 14 | `value` 속성 없음. 메서드로 다룸 |
| `DS/Controls/Find` | 찾기 막대 (입력칸 + 이전 / 다음 + 닫기) | 12 | DataGridView 와 짝 |
| `DS/Controls/SelectionChipsEditor` | 글자를 쳐서 칩으로 넣는 입력칸 | 10 | `value` 는 문자열 배열 |
| `DS/Controls/FilePicker` | 파일 선택 + 끌어 놓기 | 5 | `value` 는 `File` / `FileList` |
| `DS/Controls/ColoredSlider`, `GradientSlider` | 색 막대 슬라이더 | 0 (Controls, Tweakers 안에서 씀) | Slider 상속 |
| `DS/Controls/CustomizableDecorator` 외 | 터치 입력용 키패드 | 1 | SpinBox, LineEditor 의 `customDecoratorDefinition` |
| `DS/Controls/Knob`, `Switch`, `SmartInput` | 예전 UWA 방식 컨트롤 | 0 ~ 1 | 폐기 예정 / 2026 에서 SmartInput 삭제 |

## SpinBox

숫자 입력칸 오른쪽에 위 / 아래 버튼이 붙은 컨트롤입니다. 앱에서는 단위(`units`)와 범위를 함께 주는 경우가 많습니다.

```js
require(['DS/Controls/SpinBox', 'DS/Controls/Slider'], function (SpinBox, Slider) {
  var weight = new SpinBox({
    value: 5,
    units: 'px',
    minValue: 1,
    maxValue: 50,
    stepValue: 1,
    pageStepValue: 10,
    decimals: 0
  }).inject(document.getElementById('weight'));

  var slider = new Slider({ value: 5, minValue: 1, maxValue: 50, stepValue: 1 })
    .inject(document.getElementById('weightSlider'));

  weight.addEventListener('change', function (e) { slider.value = e.dsModel.value; });
  slider.addEventListener('change', function (e) { weight.value = e.dsModel.value; });
});
```

SpinBox 와 Slider 를 서로 맞추는 위 형태는 2DAnnotation 의 펜 두께 입력과 같습니다. 같은 값을 다시 넣으면 setter 가 무시하므로 두 `change` 가 서로를 끝없이 부르지 않습니다.

### 값과 화면 글자

| 상황 | 결과 |
| --- | --- |
| 코드로 범위 밖 값 (`spin.value = 99`, `maxValue: 50`) | `50` 으로 맞추고 `change` |
| 코드로 숫자가 아닌 값 (`'abc'`) | 무시 (이전 값 유지) |
| 입력칸에 `12` 를 치고 Enter / 포커스 이동 | `value = 12`, `change` |
| 입력칸에 숫자가 아닌 글자를 치고 Enter | 이전 값으로 되돌림 |
| 입력칸을 비우고 나감 | `allowUndefinedFlag: true` 면 `undefined`, 아니면 이전 값 |
| `units` 가 있는 칸에 다른 단위를 붙여 침 (`10 mm`) | `DS/Units` 로 `units` 단위 값으로 바꿈. 바꿀 수 없으면 숫자만 씀 |
| 화면 글자 | `decimals` 자리에서 반올림, 뒤에 `' ' + units`. 지수 범위(`highExponentProperty`, `lowExponentProperty`, 기본 6)를 넘으면 `1.5e+7` 형태 |

- 소수점 기호는 플랫폼 형식 언어(`currentFormatsLanguage`, 2026 은 `regionalFormatLanguage`)를 따릅니다. 한국어 / 영어는 `.` 입니다.
- `allowUndefinedFlag: true` 이고 `placeholder` 가 비어 있으면 빈 칸에 `- -` 가 보입니다.
- `requiredFlag: true` 인데 값이 `undefined` 이거나 `validFlag: false` 면 읽기 전용 속성 `validState` 가 `false` 가 되고 `validStateChange` 가 옵니다. 화면에는 `invalid` 속성이 붙습니다.

::: warning decimals 는 화면 글자만 깎습니다
`decimals: 2` 인 칸에 `1.23456` 을 치면 화면은 `1.23` 이지만 `value` 는 `1.23456` 입니다. 버튼 / 위아래 키로 바꾼 값만 `decimals` 자리로 반올림됩니다. 저장 전에 직접 반올림하거나, Tweakers 의 `valueType: 'integer'` 를 씁니다 ([숫자 편집기](/tweakers/editors#숫자)). `decimals` 는 0 ~ 9 로 제한됩니다.
:::

::: warning 버튼을 누르고 있으면 change 가 계속 옵니다
위 / 아래 버튼을 누른 채로 두면 200ms 뒤부터 100ms 마다 한 칸씩 바뀌고, 한 칸마다 `change` 가 납니다. 위아래 키, 마우스 휠(포커스가 있을 때만)도 한 칸마다 `change` 입니다. 서버 저장처럼 무거운 일은 `endEdit` (버튼 / 키를 뗄 때 한 번)에서 합니다.
:::

### 이벤트

| 이벤트 | 시점 |
| --- | --- |
| `change` | `value` 변경. 코드로 바꿔도 옴. Esc 로 되돌릴 때는 오지 않음 |
| `uncommittedChange` | 타이핑 (`valueToCommit` 변경) |
| `beginEdit` / `endEdit` | 타이핑, 버튼, 키 조작의 시작 / 끝 |
| `cancelEdit` | Esc 로 편집 취소 (`handleEditionCancel: true` 일 때) |
| `validStateChange` | `validState` 변경 |
| `focus` | 포커스 받음 (2025 만) |

키보드: 위 / 아래는 `stepValue`, PageUp / PageDown 은 `pageStepValue` 만큼 바꿉니다. Enter 는 확정, Esc 는 마지막으로 확정한 값으로 되돌립니다. `typingFilter: true` 면 숫자, 소수점, 편집 키 외의 입력을 막습니다. `units` 가 있으면 단위 글자를 쳐야 하므로 `typingFilter` 가 꺼집니다.

### 직접 바꾸기와 보여 주기 (customValidator, customFormatter)

입력 글자를 직접 숫자로 바꾸거나, 숫자를 다른 글자로 보여 줄 때 씁니다. 3DPlay2DExperience 의 페이지 이동 칸이 이 방식입니다 (값은 페이지 번호, 화면은 페이지 이름).

```js
var labels = { 1: '표지', 2: '목차', 3: '본문' };
var page = new SpinBox({
  value: 1, minValue: 1, maxValue: 3, stepValue: 1, decimals: 0,
  customValidator: function (text, delta) {
    if (delta) { return page.value + delta; }
    for (var k in labels) { if (labels[k] === text) { return Number(k); } }
    return Number(text);
  },
  customFormatter: function (value) { return labels[value]; }
}).inject(el);
```

| 함수 | 부르는 때 | 인자 | 돌려줄 값 |
| --- | --- | --- | --- |
| `customValidator` | 타이핑 확정, 증감 버튼 / 키, 코드로 문자열 대입 | `(입력 글자, 증감량, { operationType })`. 확정이면 증감량 `0`. `operationType` 은 `1` 증가, `2` 감소 | 숫자 또는 숫자를 주는 `Promise`. `NaN` 이면 `현재 값 + 증감량` |
| `customFormatter` | 화면 글자를 그릴 때 | `(value)` | 문자열. 문자열이 아니면 기본 형식으로 그림 |

돌려준 숫자도 `value` setter 를 거치므로 `minValue` / `maxValue` 로 맞춰집니다. `displayCustomizer` 는 폐기되어 `customFormatter` 로 옮겨집니다 (콘솔 경고).

::: warning minValue / maxValue 를 나중에 0 으로 바꾸면 값이 맞춰지지 않습니다
`_applyMinValue` / `_applyMaxValue` 는 새 범위 값이 참(truthy)일 때만 현재 값을 범위 안으로 옮깁니다. 값이 `-5` 인 칸에 `spin.minValue = 0` 을 넣으면 `value` 는 `-5` 그대로입니다. 생성자 옵션으로 같이 넣으면 맞춰집니다. 나중에 바꿀 때는 `value` 도 함께 넣습니다.
:::

::: warning 2026 에서 increment / decrement 인자가 바뀌었습니다
2025 는 `increment(fromUI)`, 2026 은 `increment(증감량, fromUI)` 입니다. 2025 코드의 `spin.increment(true)` 는 2026 에서 `true` 를 증감량으로 씁니다. 인자 없이 `increment()` 를 부르거나, 2026 에서는 `stepIncrement()` / `stepDecrement()` 를 씁니다.
:::

2026 변경점:

- `readOnlyFlag` <Badge type="warning" text="2026" />: 입력칸을 `readonly` 로 하고 증감 버튼을 숨깁니다.
- `selectAllOnIncrement` <Badge type="warning" text="2026" />: 버튼 / 휠로 바꾼 뒤 글자 전체 선택 여부. 비우면 `selectAllOnFocus` 를 따릅니다.
- `useLocaleDisplayOutsideEdition` 이 없어졌습니다. 2026 은 화면 글자를 `NumberUtils.formatNumberToString` 으로 만들어 지역 형식이 늘 적용되는 것으로 보입니다 <Badge type="danger" text="검증 필요" />.
- 코드로 넣은 문자열 값(`'12'`)을 숫자로 바꿔 받습니다. 2025 는 `'12'` 를 문자열 그대로 보관하므로 숫자를 넣습니다.
- `focus` 이벤트를 SpinBox 가 직접 내지 않습니다.

터치 기기에서 입력칸을 누르면 숫자 키패드가 뜹니다. 아래 [터치 키패드](#터치-키패드-decorator) 에 있습니다. 속성 전체는 [API](/controls/api/input-controls#spinbox) 에 있습니다.

## Slider

막대를 끌어 값을 고르는 컨트롤입니다. 기본 범위는 `0` ~ `100`, 간격 `1` 입니다. 앱에서는 `displayStyle: 'vertical'`, `valuePopupFlag: false` 를 자주 씁니다.

```js
require(['DS/Controls/Slider'], function (Slider) {
  var opacity = new Slider({ value: 0.5, minValue: 0, maxValue: 1, stepValue: 0.01 })
    .inject(document.getElementById('opacity'));

  opacity.addEventListener('change', function (e) { preview.style.opacity = e.dsModel.value; });
  opacity.addEventListener('endEdit', function (e) { save(e.dsModel.value); });
});
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `0` | 숫자. 배열이면 손잡이 여러 개 (범위 슬라이더) |
| `minValue` / `maxValue` / `stepValue` | `0` / `100` / `1` | 값은 `minValue` 기준으로 `stepValue` 간격에 맞춰짐 |
| `displayStyle` | `'horizontal'` | `horizontal`, `vertical` |
| `sliderButtonStyle` | `'standard'` | `standard`, `accurate` (작은 손잡이) |
| `valuePopupFlag` | `true` | 손잡이 위에 값 말풍선 |
| `tooltipPosition` | `''` | 말풍선 위치. 비우면 가로는 `top`, 세로는 `right` |
| `suffix` | `''` | 말풍선 글자 뒤에 붙일 글자 (`'%'`) |
| `handleEditionCancel` | `true` | Esc 로 끌기 전 값으로 되돌림 |

| 이벤트 | 시점 |
| --- | --- |
| `change` | `value` 변경. **끄는 동안 계속** 옴. 코드로 바꿔도 옴 |
| `beginEdit` / `endEdit` | 누르기 / 떼기, 키 누르기 / 떼기, 휠 한 번 |
| `cancelEdit` | Esc 로 되돌림 |

키보드 화살표와 마우스 휠(포커스가 있을 때)은 `stepValue` 만큼 바꿉니다.

::: warning 숫자가 아닌 값은 버려집니다
`slider.value = '50'` 처럼 문자열을 넣으면 받지 않고 이전 값을 유지합니다 (`change` 없음). `parseFloat` 로 바꿔 넣습니다. 범위 밖 숫자는 `minValue` / `maxValue` 로 맞춰집니다.
:::

::: warning Esc 도 change 를 냅니다
Esc 를 누르면 마지막으로 마우스를 누르거나 뗀 때의 값으로 돌아가며, 값이 같아도 `change` 가 옵니다. 끄는 중이면 `cancelEdit` 도 옵니다. `change` 에서 저장하면 같은 값이 한 번 더 저장됩니다. 키보드로 바꾼 값은 이 기준값을 바꾸지 않으므로 Esc 를 누르면 키보드 조작 전으로 돌아갑니다.
:::

### 범위 슬라이더

`value` 에 배열을 주면 손잡이가 그 개수만큼 생기고, 손잡이 사이가 채워집니다. 각 손잡이는 이웃 손잡이를 넘지 못합니다.

```js
var range = new Slider({ value: [20, 80], minValue: 0, maxValue: 100 }).inject(el);
range.addEventListener('change', function (e) { console.log(e.dsModel.value[0], e.dsModel.value[1]); });
range.increment(1);
range.value = [10, 90];
```

::: warning 같은 배열을 고쳐 다시 넣으면 반영되지 않습니다
Slider 는 받은 배열을 그대로 보관합니다. `arr[0] = 5; range.value = arr` 는 이전 값과 같은 배열이라 화면도 안 바뀌고 `change` 도 없습니다. `range.value = [5, arr[1]]` 처럼 새 배열을 넣습니다.
:::

2026 은 말풍선 글자를 `NumberUtils.formatNumberToString` 으로 만듭니다. 속성 전체는 [API](/controls/api/input-controls#slider) 에 있습니다.

## ColoredSlider, GradientSlider

색을 배경으로 그린 Slider 입니다. 둘 다 Slider 의 속성과 이벤트를 그대로 가집니다.

- `ColoredSlider`: `colorFrom` 에서 `colorTo` 로 가는 막대. 기본 범위 `0` ~ `255`. 색은 `#rgb`, `#rrggbb`, `'transparent'` 만 받고, 그 외는 `#000` 이 됩니다.
- `GradientSlider`: 색의 한 성분(`gradientType`: `Hue`, `Saturation`, `Value`, `HslSaturation`, `Lightness`, `Red`, `Green`, `Blue`, `Alpha`)을 고르는 막대. 성분에 맞춰 `maxValue` 를 360 / 100 / 255 로 바꿉니다. `modulationColor` 는 HSV 배열 `[h, s, v, a]` 이며, 값을 바꾸면 이 배열도 함께 바뀝니다. `change` 의 `e.options.colorSubAttributeType` 에 성분 이름이 옵니다.

```js
var hue = new GradientSlider({ gradientType: 'Hue', modulationColor: [200, 80, 90] }).inject(el);
hue.addEventListener('change', function (e) { console.log(e.options.colorSubAttributeType, hue.modulationColor); });
```

[API](/controls/api/input-controls#coloredslider), [GradientSlider API](/controls/api/input-controls#gradientslider)

## SelectionChips

글자 칩을 늘어놓고 추가 / 삭제 / 선택하는 컨트롤입니다. 칩마다 X 버튼이 있고, 우클릭(또는 `⋮` 버튼)에 "모두 지우기" 메뉴가 있습니다. 값은 속성이 아니라 메서드로 다룹니다.

```js
require(['DS/Controls/SelectionChips'], function (SelectionChips) {
  var tags = new SelectionChips({ placeholder: '태그 없음' }).inject(document.getElementById('tags'));

  tags.addChip({ label: '긴급', value: 'URGENT' });
  tags.addChips([{ label: '설계', value: 'DESIGN' }, { label: '구매', value: 'PURCHASE' }]);

  tags.addEventListener('change', function () {
    var values = tags.getAllChipsOptions().map(function (c) { return c.value; });
    console.log(values);
  });
  tags.addEventListener('onPostRemove', function (e) { console.log('삭제', e.options.chips); });
});
```

칩 옵션은 `{ label, value, icon, tooltip, id, index }` 입니다. `label` 만 화면에 보이고, `value`, `id` 는 보관만 합니다. 문자열을 넘기면 `{ label: 문자열 }` 이 됩니다.

| 할 일 | 코드 |
| --- | --- |
| 넣기 | `addChip(옵션)`, `addChips([옵션, ...])` |
| 빼기 | `removeChip(label 또는 index 또는 { id: 'x' })`, `removeChips([...])`, `removeAllChips()` |
| 고치기 | `updateChipOptions(label 또는 index, 옵션)` |
| 읽기 | `getAllChipsOptions()`, `getAllChipsAsLabels()`, `getSelectedChipsOptions()`, `getNumberOfChips(선택만?)` |
| 선택 | `selectChip(...)`, `unselectChip(...)`, `selectAllChips()`, `unselectAllChips()` |
| 끝에 입력칸 붙이기 | `addLastWidget(컨트롤)`, `removeLastWidget()` |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| `change` | 칩 추가 / 삭제 / 순서·글자 변경. 코드로 해도 옴 | - |
| `onPostAdd` | 추가 뒤 | `{ chips }` |
| `onPostRemove` | 삭제 뒤 (X, 모두 지우기, 코드) | `{ chips }`, 모두 지우기는 `allChipsRemoved: true` |
| `selectionChange` | 선택 변경 (코드로 해도 옴) | - |

::: warning value 옵션은 없습니다
`new SelectionChips({ value: [...] })` 는 `value` 가 공개 속성이 아니라 무시됩니다 (ENXMeetingMgmt 호출부에 이 형태가 있지만 효과가 없습니다). 처음 칩은 만든 뒤 `addChips` 로 넣습니다. 문자열 배열로 값을 주고받으려면 [SelectionChipsEditor](#selectionchipseditor) 를 씁니다.
:::

::: warning addChip 과 addChips 의 onPostAdd 내용이 다릅니다
`addChip` 의 `e.options.chips` 는 내부 항목(`{ chipOptions, isSelected, ... }`) 배열이고, `addChips` 는 **넘긴 옵션 배열 그대로** 입니다. 또 `addChips` 는 `label, value, icon, tooltip, id, index` 외의 키를 버립니다. 다른 키를 붙여 보관하려면 `addChip` 을 반복합니다.
:::

::: warning removeChips 에 index 배열을 주면 하나씩 밀립니다
`removeChips([0, 1])` 은 0 번을 지운 뒤 남은 목록의 1 번(원래 2 번)을 지웁니다. index 로 여러 개 지울 때는 큰 번호부터 넘깁니다 (`[1, 0]`). SelectionChips 자신도 끌어 놓기에서 이렇게 정렬해 씁니다.
:::

### 선택 방식

`selection` 옵션은 `{ toggle, mode, unselectAllOnEmptyArea }` 이고 기본값은 `{ toggle: true, mode: 2, unselectAllOnEmptyArea: true }` 입니다. 바꿀 때는 세 키를 모두 넣은 새 객체를 줍니다.

| `mode` | `SelectionChips.SELECTION_MODE` | 동작 |
| --- | --- | --- |
| `0` | `SINGLE` | 하나만 선택 |
| `1` | `MULTIPLE` | 누를 때마다 더해짐 |
| `2` (기본) | `MULTIPLE_ONKEYS` | Ctrl / Shift 를 누를 때만 여러 개 |

::: warning 기본 모드에서 selectAllChips() 는 아무것도 하지 않습니다
`selectAllChips()` 는 다중 선택 중일 때만 동작합니다. 기본 `MULTIPLE_ONKEYS` 는 Ctrl / Shift 를 누른 사용자 조작만 다중 선택으로 보므로 코드 호출은 무시됩니다. 코드로 전체 선택하려면 `selection.mode` 를 `1` 로 둡니다. 같은 이유로 기본 모드에서 `selectChip` 을 연달아 부르면 마지막 것만 선택됩니다.
:::

### 끌어 놓기

칩은 기본으로 끌 수 있습니다. 같은 SelectionChips 안에서는 순서가 바뀌고, 다른 SelectionChips 로는 양쪽 모두의 `acceptDrop` 이 `true` (또는 `true` 를 주는 `Promise`)를 돌려줄 때만 옮겨집니다. Ctrl 을 누르면 복사입니다.

```js
var accept = function (info) { return info.sourceSelectionChips !== info.targetSelectionChips; };
var left = new SelectionChips({ acceptDrop: accept }).inject(el1);
var right = new SelectionChips({ acceptDrop: accept }).inject(el2);
```

`onDragStartCell`, `onDropCell`, `onDropBlank` 등 10 개 함수로 기본 동작 앞에 끼어들 수 있습니다. 인자는 `(브라우저 이벤트, { chipCellView, dropPosition, dropIndex })` 입니다.

::: warning 끌기 함수가 값을 돌려주지 않으면 기본 동작이 멈춥니다
`onDropCell` 등은 돌려준 값이 참일 때만 기본 동작(`onDropCellDefault`)을 이어서 실행합니다. 로그만 찍고 `return` 을 빠뜨리면 놓기가 되지 않습니다. 기본 동작도 원하면 `return true` 를 씁니다.
:::

::: warning value 가 객체인 칩을 끌면 오류가 납니다
선택된 칩을 끌기 시작할 때 `chipOptions.value` 가 객체면 `value._options.value` 로 바꿔 씁니다. 일반 객체나 `null` 을 `value` 로 준 칩을 끌면 `TypeError` 가 납니다 (2025, 2026 같음). 칩 `value` 에는 문자열 / 숫자를 넣고 객체는 따로 보관합니다.
:::

속성 전체는 [API](/controls/api/input-controls#selectionchips) 에 있습니다.

## SelectionChipsEditor

SelectionChips 끝에 LineEditor 를 붙인 입력칸입니다. 글자를 치고 Enter / Tab / 포커스 이동을 하면 칩이 됩니다. `value` 는 문자열 배열이라 폼 값으로 다루기 쉽습니다.

```js
require(['DS/Controls/SelectionChipsEditor'], function (SelectionChipsEditor) {
  var mails = new SelectionChipsEditor({
    placeholder: '메일 주소',
    uniqueValue: true,
    value: ['a@example.com'],
    customValidator: function (text) {
      return text.split(/[,;\s]+/).filter(function (s) { return s.indexOf('@') > 0; });
    }
  }).inject(document.getElementById('mails'));

  mails.addEventListener('change', function (e) { console.log(e.dsModel.value); });
  mails.addValues(['b@example.com']);
  mails.removeValues(['a@example.com']);
});
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `undefined` | 문자열 배열. 문자열 하나를 넣으면 `[문자열]` |
| `placeholder` | `''` | 입력칸 안내 글자 |
| `uniqueValue` | `false` | 같은 값 막기. 중복은 기존 칩을 깜빡이고 넣지 않음 |
| `customValidator` | - | `fn(입력 글자)` → 문자열, 문자열 배열, 또는 그 `Promise` |
| `maxLength` | `-1` | 입력칸 최대 글자 수. 값마다 이 길이로 자름 |
| `selection` | `{ toggle: true, mode: 2, unselectAllOnEmptyArea: true }` | 안쪽 SelectionChips 로 전달 |

| 조작 | 동작 |
| --- | --- |
| Enter, 포커스 이동 | 입력 글자를 칩으로 (LineEditor `change`) |
| Tab / Shift+Tab | 입력 글자가 있으면 칩으로 만들고 포커스 유지 |
| Esc | 입력 글자 지우기 |
| 칩 X, 우클릭 "모두 지우기" | 칩 삭제 → `value` 갱신 |

이벤트는 `change` 하나입니다 (`value` 변경. 코드로 바꿔도 옴).

::: warning value 의 처음 값은 undefined 입니다
아무 값도 주지 않으면 `value` 는 `[]` 가 아니라 `undefined` 입니다. 칩을 넣었다 모두 지우면 그때부터 `[]` 입니다. 읽을 때 `(editor.value || [])` 로 받습니다. 배열 안의 빈 문자열, 문자열이 아닌 항목은 버려집니다.
:::

::: warning customValidator 가 거부하면 친 글자가 사라집니다
입력칸은 `customValidator` 를 부르기 **전에** 비워집니다. `undefined` 나 빈 배열을 돌려주면 칩도 안 생기고 입력 글자도 없어집니다. 거부 이유를 알려 주려면 함수 안에서 따로 메시지를 띄웁니다.
:::

칩에는 `label` 만 있으므로 화면 글자와 다른 값을 보관하려면 SelectionChips 를 직접 씁니다. `getSelectedChipsValue()` 는 선택된 칩 글자 배열입니다. 속성 전체는 [API](/controls/api/input-controls#selectionchipseditor) 에 있습니다.

## Find

찾기 막대입니다. 입력칸, `현재/전체` 숫자, 이전 / 다음 버튼, 닫기 버튼으로 이루어집니다. 스스로 찾지 않고, 대상(`relatedWidget`)의 함수를 불러 줍니다. 앱 호출부는 모두 DataGridView 와 짝을 이룹니다.

```js
require(['DS/Controls/Find'], function (Find) {
  var find = new Find({
    displayMatchCaseToggle: true,
    relatedWidget: grid,
    onFindRequest: grid.setFindStr,
    onFindPreviousResult: grid.goToPreviousMatchingCell,
    onFindNextResult: grid.goToNextMatchingCell,
    onFindClose: grid.closeFind
  }).inject(toolbarEl);
});
```

함수의 `this` 는 `relatedWidget` 이라 `grid.setFindStr` 를 `bind` 없이 넘겨도 됩니다. 만들면 `relatedWidget.findWidget` 에 Find 자신이 들어갑니다. DataGridView 쪽 함수는 [그리드 메서드](/datagridview/api/grid-methods#툴바-그룹-내보내기) 에 있습니다.

| 함수 | 부르는 때 | 인자 |
| --- | --- | --- |
| `onFindRequest` | 타이핑 후 500ms (debounce), 대소문자 토글, 다시 보이기(`visibleFlag = true`) | `(findStr, matchCase, 현재 번호)` |
| `onFindNextResult` | 다음 버튼, Enter | - |
| `onFindPreviousResult` | 이전 버튼, Shift+Enter | - |
| `onFindClose` | 닫기 버튼, Esc, `close()` | - |

찾은 개수는 대상 쪽에서 `find.count = n` 으로 알려 줍니다. 그러면 현재 번호가 1 이 되고 `1/n` 이 보입니다. 이전 / 다음 버튼은 `count` 가 2 이상일 때만 눌립니다. 번호를 직접 바꿀 때는 `find.setCurrentValue(i)`, 서버 검색 중 표시는 `find.setLoadingState(true)` 입니다 (CollectionView 가 이렇게 씁니다).

::: warning relatedWidget 이 없으면 아무 함수도 불리지 않습니다
네 함수 모두 `relatedWidget` 이 있을 때만 불립니다. 그리드 없이 직접 찾기를 구현할 때도 `relatedWidget` 에 아무 객체(`{}`)라도 넣어야 합니다. Find 는 `fire` 이벤트를 내지 않으므로 `addEventListener('change')` 로는 받을 수 없습니다.
:::

::: warning 닫기는 숨기기입니다
닫기 버튼 / Esc / `close()` 는 `visibleFlag = false` 만 합니다. 다시 열 때는 새로 만들지 말고 `find.visibleFlag = true` 를 씁니다 (ENXHistoryUX 방식: `grid.findWidget` 이 있으면 다시 보이기). 이때 `onFindRequest` 가 바로 한 번 불립니다.
:::

2026 은 `closeOnEscape` <Badge type="warning" text="2026" /> (기본 `true`) 로 Esc 닫기를 끌 수 있습니다. 속성 전체는 [API](/controls/api/input-controls#find) 에 있습니다.

## FilePicker

읽기 전용 입력칸 + 올리기 버튼으로 된 파일 선택 컨트롤입니다. 입력칸이나 버튼을 누르면 파일 창이 열리고, 컨트롤 위로 파일을 끌어 놓아도 됩니다.

```js
require(['DS/Controls/FilePicker'], function (FilePicker) {
  var picker = new FilePicker({
    placeholder: 'XML 파일 선택',
    fileTypes: '.xml',
    allowResetToUndefinedByUIFlag: true
  }).inject(document.getElementById('file'));

  picker.addEventListener('change', function () {
    var file = picker.value;
    if (!file) { return; }
    var reader = new FileReader();
    reader.onload = function (ev) { console.log(ev.target.result); };
    reader.readAsText(file);
  });
});
```

위 형태는 ParameterizationSkeleton 의 XML 가져오기와 같습니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `undefined` | `allowMultipleFiles: false` 면 `File`, `true` 면 `FileList` |
| `allowMultipleFiles` | `false` | 여러 파일. 바꾸면 현재 값을 `File` ↔ `FileList` 로 바꿈 |
| `fileTypes` | - | `<input type="file">` 의 `accept` (`'.xml'`, `'image/*'`) |
| `allowResetToUndefinedByUIFlag` | `false` | 입력칸에 지우기 버튼. 누르면 `value = undefined` |
| `placeholder` | - | 비우면 "끌어 놓기" 안내 글자 (번역 리소스) |
| `dropOptions` | - | `{ dropArea: 요소, className }`. 끌어 놓기 영역을 다른 요소로 넓힘 |

이벤트는 `change` 하나입니다 (파일 선택, 놓기, 지우기, 코드 대입). 입력칸에는 파일 이름이 ` | ` 로 이어져 보입니다.

::: warning value 에는 File / FileList 만 넣을 수 있습니다
`allowMultipleFiles: false` 인데 `FileList` 를 넣거나, 그 반대이거나, 파일 이름 문자열을 넣으면 조용히 무시됩니다 (WebVisuGLTFCommands 의 `value: 'FileList'` 옵션도 무시됩니다). 비우기는 `picker.value = undefined` 입니다. 이때 안쪽 `<input>` 도 비워져 같은 파일을 다시 고를 수 있습니다.
:::

::: warning fileTypes 는 끌어 놓기를 거르지 않습니다
`fileTypes` 는 파일 창의 `accept` 에만 들어갑니다. 끌어 놓은 파일은 종류를 보지 않고 받습니다 (폴더는 버림). `change` 에서 확장자를 다시 확인합니다. `allowMultipleFiles: false` 일 때 여러 개를 끌어 오면 놓기 자체가 막힙니다.
:::

2026 에서 `displayStyle` 키가 없어졌습니다. 2025 에도 이 키를 쓰는 코드는 없어 효과가 없습니다. 속성 전체는 [API](/controls/api/input-controls#filepicker) 에 있습니다.

## 터치 키패드 (Decorator)

`SpinBox`, `LineEditor` 의 `customDecoratorDefinition` 은 **터치로 입력칸을 눌렀을 때** 입력칸 아래에 뜨는 버튼 키패드(Decorator)를 고르는 옵션입니다. 마우스 클릭에는 뜨지 않습니다.

| 컨트롤 | 터치 시 |
| --- | --- |
| SpinBox | 늘 키패드가 뜸. `customDecoratorDefinition.decoratorID` 가 없으면 기본 숫자 키패드 (`SpinBoxDecorator`) |
| LineEditor | `customDecoratorDefinition.decoratorID` 가 있을 때만 뜸 |

키패드는 `DecoratorManager` (싱글턴)에 이름으로 등록한 `CustomizableDecorator` 입니다.

```js
require([
  'DS/Controls/LineEditor',
  'DS/Controls/CustomizableDecorator',
  'DS/Controls/DecoratorManager'
], function (LineEditor, CustomizableDecorator, DecoratorManager) {
  DecoratorManager.registerDecorator('qtyPad', new CustomizableDecorator({
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'delete', '0', 'validate'],
    gridDefinition: { numberOfColumns: 3, numberOfLines: 4 }
  }));

  new LineEditor({ customDecoratorDefinition: { decoratorID: 'qtyPad' } }).inject(el);
});
```

- `items` 는 항목 ID 배열입니다. 여러 화면을 두려면 `{ 화면이름: [ID, ...] }` 로 주고, `viewSwitchingDefinition: { 항목ID: 화면이름 }` 으로 화면 전환 버튼을 정합니다.
- 기본 항목 ID: `0` ~ `9`, `decimal`, `addition`, `substraction`, `multiplication`, `division`, `percentage`, `exponential`, `PI`, `openParenthesis`, `closeParenthesis`, `squareRoot`, `square`, `equals`, `hash`, `sinus`, `cosinus`, `tangente`, `absoluteValue`, `arrowUp`, `arrowDown`, `validate`, `delete`, `emptySpace`. 새 항목은 `CustomizableDecoratorItems.addDecoratorItems({ id: { label 또는 icon, semantics } })` 로 더합니다.
- 글자(`label`)가 있는 항목은 커서 위치에 그 글자를 넣고, `delete` 는 한 글자 지우기, `validate` 는 닫고 확정, `arrowUp` / `arrowDown` 은 SpinBox 증감입니다. `onClick({ itemID, input })` 에서 `{ preventDefault: true }` 를 돌려주면 이 기본 동작을 건너뜁니다.
- 같은 ID 로 두 번 등록하면 콘솔 로그만 남기고 무시합니다. 키패드는 화면 전체에서 하나만 보입니다.

[AbstractDecorator](/controls/api/input-controls#abstractdecorator), [CustomizableDecorator](/controls/api/input-controls#customizabledecorator), [DecoratorManager](/controls/api/input-controls#decoratormanager) API 를 참고합니다.

## 예전 UWA 컨트롤 (Knob, Switch, SmartInput)

`Abstract` 가 아닌 `UWA/Controls/Abstract.extend` 로 만든 예전 컨트롤입니다. 속성 setter, `fire` 이벤트가 없고 `options` 와 `getValue()` / `setValue()` 로 다룹니다. 새 화면에는 쓰지 않습니다.

| 모듈 | 상태 | 대신 쓸 것 |
| --- | --- | --- |
| `DS/Controls/Knob` | 앱 사용 없음. `increment` / `decrement` 에 `console.log` 가 남아 있음 | [Slider](#slider) |
| `DS/Controls/Switch` | 만들 때 "deprecated, Toggle 로 옮기라" 경고를 콘솔에 찍음. 앱 사용 1 곳 (Spreadsheet) | [Toggle](/controls/webux-controls#toggle) `type: 'switch'` |
| `DS/Controls/SmartInput` | 만들 때 "deprecated, SmartInputs/* 를 쓰라" 경고. 2026 에서 삭제 | `DS/Controls/*` 개별 컨트롤 |

```js
var sw = new Switch({ label: '자동 저장', value: true, onChange: function (v) { console.log(v); } });
sw.inject(el);
sw.setValue(false, false);
```

`setValue(v, false)` 처럼 두 번째 인자를 `false` 로 주면 `onChange` 를 부르지 않습니다. 옵션과 메서드는 [Knob](/controls/api/input-controls#knob), [Switch](/controls/api/input-controls#switch), [SmartInput](/controls/api/input-controls#smartinput) API 에 있습니다.
