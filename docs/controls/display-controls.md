# 색상, 표시 컨트롤 <Badge type="info" text="원본 분석" />

색을 고르는 컨트롤(ColorPicker, ColorChooser, ColorPalette, ColorCanvas, ColorEditors), 시간 선택판(TimeChooser), 막대 표시(Gauge, Timeline), 툴팁 화면(Tooltip 과 2026 의 툴팁 뷰, UserCard)을 다룹니다. 속성, 이벤트, 메서드 전체는 [API](/controls/api/display-controls) 에 있습니다.

::: info 근거
Controls.js (2025, 2026) 의 ColorPicker (`_preEditValue`, `_applyValue`, `_createPopup`), ColorChooser (`buildColorChooserView`, `_applyValue`, `_applyHsvValue`, `_handleEvents`), ColorPalette (`_addSwatches`, `_applyValue`), ColorCanvas, ColorEditors, TimeChooser (`_preEditValue`, `_applyMode`, `_setHours`), Gauge (`_setValue`, `_constraintValue`, `_buildScaling`), Timeline (`init`, `_play`, `setValue`, `getValue`), Tooltip (`show`, `hide`, `_setInitialTimer`), TooltipLoader, 2026 의 AbstractTooltipView, StandardTooltipView, RichUserTooltipView, UserCard, BaseCard. Utilities.js 의 `DS/Utilities/Color` (`hexToRgb`, `rgbToHex`, `isValidColorString`, `compareColorStrings`, `addAlphaComponentToHex`). Core.js 의 BaseComponent (`init`, advancedSetter), TooltipManager, TooltipLoader, 2026 TooltipUtils. Tweakers.js 의 TweakerColor. 호출부: MePreferencesUIBuilder, 2DAnnotation, ParameterizationSkeleton, SocialGlobe (ColorPicker), SearchControlCenter, TagNavigator, StudioUIActorModelWeb (ColorChooser, ColorPalette), SmartInputs, DMUControls (Gauge), SIMAnimationWebUI, VCXWebTimeline (Timeline), GEOMSCommands, DELWebInfrastructure (Tooltip)
:::

## 색상 값 형식

색 컨트롤의 `value` 는 모두 문자열이지만 형식이 조금씩 다릅니다.

| 모듈 | `value` 예 | `#` | 화면에서 고른 값 | 알파 (`showAlphaFlag: true`) |
| --- | --- | --- | --- | --- |
| ColorPicker | `'ff0000'` | 넣으면 떼어 냄 (`'#FF0000'` → `'FF0000'`) | 소문자 6자리 | 8자리 `rrggbbaa` |
| ColorChooser | `'ff0000'` | 넣으면 그대로 남음 | 소문자 6자리 | 8자리. 6자리 값에는 `ff` 를 붙임 |
| ColorPalette | `'#FEE000'` | 견본(swatch)에 넣은 글자 그대로 | 누른 견본의 글자 | 8자리, `rgba()`, `hsla()` 도 됨 |
| ColorCanvas, ColorEditors | `'ff0000'` | - | 소문자 6자리 | 8자리 |
| [TweakerColor](/tweakers/editors#버튼-링크-색상) | `'ff0000'` | 떼어 냄 | 소문자 6자리 | 8자리 |

- 알파는 맨 뒤 두 자리이고 `00` ~ `ff` (0 ~ 255) 입니다. CSS 의 `#rrggbbaa` 와 같은 순서입니다.
- 3자리(`'f00'`)는 ColorPicker 에 그대로 남고, ColorChooser 와 TweakerColor 는 6자리(`'ff0000'`)로 늘립니다. ColorPalette 는 3자리를 색으로 보지 않습니다.
- CSS 에 쓸 때는 `'#' + value` 로 붙입니다. 앱 호출부(MePreferencesUIBuilder, 2DAnnotation, SocialGlobe)도 모두 이렇게 씁니다.
- ColorChooser, ColorCanvas, ColorEditors 는 `hsvValue` 배열 `[색상 0~360, 채도 0~100, 명도 0~100, 알파 0~255]` 도 가집니다. `value` 를 바꾸면 `hsvValue` 가, `hsvValue` 를 바꾸면 `value` 가 함께 바뀝니다.

## ColorPicker

색 견본 버튼입니다. 누르면 아래에 ColorChooser 팝업이 열립니다 (앱 9개 모듈). 속성 전체는 [API](/controls/api/display-controls#colorpicker) 에 있습니다.

```js
require(['DS/Controls/ColorPicker'], function (ColorPicker) {
  var picker = new ColorPicker({ value: '368ec4' }).inject(el);

  picker.addEventListener('liveChange', function (e) {
    preview.style.backgroundColor = '#' + e.dsModel.value;
  });
  picker.addEventListener('change', function (e) {
    save('#' + e.dsModel.value);
  });
  picker.addEventListener('cancelEdit', function (e) {
    preview.style.backgroundColor = '#' + e.dsModel.value;
  });
});
```

### 이벤트가 오는 순서

| 조작 | 이벤트 |
| --- | --- |
| 버튼 클릭 (팝업 열림) | `show` |
| 팝업에서 끌기 시작 / 끝 | `beginEdit` / `endEdit` |
| 팝업에서 색이 바뀔 때마다 | `liveChange` |
| 바깥 클릭, Enter 로 닫음 | 열 때와 값이 다르면 `change` → `endEdit`, 그다음 `hide` |
| Esc 로 닫음 | 열 때의 값으로 되돌리며 `liveChange` → `cancelEdit` → `hide` (`e.options.cancelFlag: true`) |
| 팝업이 닫힌 상태에서 코드로 `value` 변경 | `change` |

화면에서 미리 보기를 바꾸려면 `liveChange`, 저장은 `change` 에서 합니다. ParameterizationSkeleton, SocialGlobe, 2DAnnotation 이 `liveChange` 로 미리 보기를 그립니다. Esc 로 되돌린 값은 `cancelEdit` 에서 다시 읽습니다.

::: warning 잘못된 값은 조용히 버려집니다
`value` 에 넣은 글자가 16진수 3자리 / 6자리(`showAlphaFlag` 면 4자리 / 8자리도)가 아니면 대입이 무시되고 이전 값이 남습니다. `'red'`, `'rgb(255,0,0)'` 는 들어가지 않습니다. 숫자는 문자열로 바꾼 뒤 검사합니다.
:::

::: warning show() 와 hide() 는 팝업을 엽니다
ColorPicker 는 `show()` / `hide()` 를 다시 정의했습니다. 버튼을 숨기지 않고 `popupVisibleFlag` 를 바꿉니다. 버튼 자체를 숨기려면 `picker.visibleFlag = false` 를 씁니다.
:::

::: warning 처음 클릭 전에는 코드로 팝업을 열 수 없습니다
팝업은 사용자가 버튼을 처음 클릭할 때 만들어집니다 (`Popup.delayPopupCreation`). 그 전에는 `popupVisibleFlag = true`, `show()` 를 해도 열리지 않고 `getPopup()` 은 `undefined` 입니다.
:::

::: warning 코드로 바꾼 값이 기준 값과 같으면 change 가 없습니다
코드 대입의 `change` 는 "마지막으로 팝업을 연 때의 값" 과 대소문자 무시로 비교합니다. 한 번도 열지 않았다면 기준은 기본값 `'ffffff'` 입니다. `new ColorPicker({ value: 'ff0000' })` 뒤에 `picker.value = 'ffffff'` 를 넣으면 값은 바뀌지만 `change` 는 오지 않습니다.
:::

- `handleEditionCancel: false` 면 Esc 로 닫아도 값을 되돌리지 않습니다. 이때는 `change`, `endEdit`, `cancelEdit` 이 모두 오지 않으므로 `liveChange` 나 `hide` 에서 값을 읽습니다.
- `referenceValue` 는 팝업 안의 비교 견본 색입니다. 비교 견본을 더블 클릭하면 그 색으로 돌아갑니다.
- 키보드: 버튼에 포커스가 있을 때 Space 로 팝업을 열고 닫습니다.
- Tweakers 폼과 그리드 셀에서는 [TweakerColor](/tweakers/editors#버튼-링크-색상) (`typeRepresentation: 'color'`) 가 안에서 ColorPicker 를 만듭니다.

## ColorChooser

팝업 없이 화면에 바로 붙는 색 선택판입니다. ColorPicker 팝업의 내용이 이것입니다 (앱 5개 모듈 직접 사용). 왼쪽 판(ColorCanvas)에서 채도 / 명도, 세로 막대(GradientSlider)에서 색상을 고르고, 오른쪽에 16진수 입력칸과 RGB / HSV 숫자 칸이 있습니다 ([API](/controls/api/display-controls#colorchooser)).

```js
require(['DS/Controls/ColorChooser'], function (ColorChooser) {
  var chooser = new ColorChooser({ value: 'ffffff', referenceValue: 'ffffff' }).inject(el);
  chooser.addEventListener('change', function (e) {
    console.log('#' + e.dsModel.value, e.dsModel.hsvValue);
  });
});
```

| `displayStyle` | 화면 |
| --- | --- |
| `'basic'` (기본) | 판 + 막대 + 오른쪽 정보 칸 (16진수, RGB, HSV 숫자) |
| `'advanced'` | 판 + 막대 + 정보 칸, 아래에 탭으로 RGB / HSV / HSL 슬라이더 (ColorEditors) |

::: warning change 는 끄는 동안 계속 옵니다
ColorChooser 에는 `liveChange` 가 없습니다. 판이나 막대를 끄는 동안 `hsvValue` 가 바뀔 때마다 `change` 가 옵니다. 코드로 `value` / `hsvValue` 를 바꿔도 옵니다. 확정 시점이 필요하면 `endEdit` 을 받거나 ColorPicker 를 씁니다. SearchControlCenter 는 `pointerdownCanvasP` 로 끄는 중인지 확인합니다.
:::

::: warning 16진수 칸에 잘못 입력하면 값이 비워집니다
오른쪽 16진수 칸에 형식이 맞지 않는 글자를 넣고 확정하면 `value` 가 `undefined` 가 되고 견본이 흰색(빈 색 표시)이 됩니다.
:::

- `informationsVisibleFlag: false` 면 오른쪽 정보 칸을 숨기고 판과 막대만 남습니다 (StudioUIActorModelWeb).
- `showAlphaFlag` 를 켜면 `value`, `referenceValue` 가 8자리로 바뀌고 알파 칸이 생깁니다.
- 앱 코드에 `colorChooserDimensions` 를 대입하는 곳이 있지만 공개 속성이 아니라 효과가 없습니다.

## ColorPalette

정해 둔 색 견본 중 하나를 누르는 선택판입니다 (앱 3개 모듈). SearchControlCenter, TagNavigator 는 ColorPalette 탭과 ColorChooser 탭을 함께 둡니다 ([API](/controls/api/display-controls#colorpalette)).

```js
require(['DS/Controls/ColorPalette'], function (ColorPalette) {
  var palette = new ColorPalette({
    swatches: [
      { value: '#FEE000' },
      { value: '#009DDB', tooltipParams: { shortHelp: '파랑' } },
      { value: '#CC092F' }
    ],
    value: '#009DDB'
  }).inject(el);
  palette.addEventListener('change', function (e) { console.log(e.dsModel.value); });
});
```

- 견본은 `{ value, tooltipParams }` 입니다. `value` 가 없으면 "색 없음" 무늬 견본이 됩니다. `tooltipParams` 가 없으면 색 글자가 툴팁입니다.
- `value` 는 누른 견본의 글자 그대로입니다. 선택 표시는 대소문자와 `#` 를 무시하고 비교합니다 (`'#fee000'` 과 `'FEE000'` 은 같은 견본).
- 키보드 방향키로 앞뒤 견본을 고릅니다.
- `loadDefault()` 는 3DEXPERIENCE 기본 색 27개(`Color.COLORS_3DEXPERIENCE`)로 채우고, `reset()` 은 견본과 값을 비웁니다.

::: warning 넘긴 swatches 배열이 바뀝니다
중복 색(대소문자 무시)과 잘못된 색은 `swatches` 배열에서 `splice` 로 빠집니다. 넘긴 배열을 그대로 보관하므로 호출한 쪽의 배열도 같이 바뀝니다. 다른 곳에서 다시 쓸 배열이면 복사해서 넘깁니다.
:::

코드로 `value` 를 바꿔도 `change` 가 옵니다. 견본에 없는 색도 올바른 색 문자열이면 들어가고, 선택 표시만 없어집니다.

## ColorCanvas

ColorChooser 왼쪽의 2차원 판만 따로 쓰는 컨트롤입니다 (앱 직접 사용 없음). 가로축 `subColorAttributeX`, 세로축 `subColorAttributeY` 로 색 성분 두 개를 고르고, 나머지 하나는 `modulationValue` 로 고정합니다 ([API](/controls/api/display-controls#colorcanvas)).

```js
require(['DS/Controls/ColorCanvas'], function (ColorCanvas) {
  var canvas = new ColorCanvas({ value: '368ec4', subColorAttributeX: 'Saturation', subColorAttributeY: 'Value' }).inject(el);
  canvas.addEventListener('change', function (e) { console.log(e.dsModel.value); });
});
```

성분 이름은 `Hue`, `Saturation`, `Value`, `HslSaturation`, `Lightness`, `Red`, `Green`, `Blue` 입니다. 끄는 동안 Esc 를 누르면 끌기 전 색으로 돌아가고 `cancelEdit` 이 옵니다.

## ColorEditors

색을 숫자 칸(SpinBox)과 슬라이더로 고치는 편집판입니다. ColorChooser 의 정보 칸이 이것입니다 (앱 직접 사용 없음, [API](/controls/api/display-controls#coloreditors)).

- `displayStyle: 'tabs'` (기본) 는 형식 탭(ButtonGroup)을 두고 한 형식씩 보여 줍니다. `'stacked'` 는 `availableColorFormats` 의 형식을 한꺼번에 세로로 쌓습니다.
- 형식은 `RGB`, `HSV`, `HSL`, `RGBA`, `HSVA`, `HSLA` 입니다. 알파가 있는 형식은 `showAlphaFlag: true` 일 때 씁니다.
- 각 성분 옆 라디오를 누르면 `changeModulation` 이 옵니다. ColorChooser 는 이것을 받아 막대와 판의 축을 바꿉니다.

## TimeChooser

시, 분, 초 칸과 위 / 아래 화살표로 된 시간 선택판입니다. [TimePicker](/controls/api/webux-controls#timepicker) 의 팝업 내용이 이것이고, DatePicker 의 시간 칸도 TimePicker 를 거쳐 이것을 씁니다 ([날짜](/controls/webux-controls#날짜-datepicker-tweakerdate)). 앱에서 직접 만드는 곳은 없습니다 ([API](/controls/api/display-controls#timechooser)).

```js
require(['DS/Controls/TimeChooser'], function (TimeChooser) {
  var chooser = new TimeChooser({ value: new Date(2026, 11, 1, 9, 30), precision: 'sec', minutesStep: 5 }).inject(el);
  chooser.addEventListener('change', function (e) {
    console.log(e.dsModel.getHours(), e.dsModel.getMinutes());
  });
});
```

| `mode` | 값 | 화면 |
| --- | --- | --- |
| `'24'` (2025 기본) | `Date` | 0 ~ 23시 |
| `'12'` (2025 만) | `Date` | 1 ~ 12시 + AM / PM 칸 |
| `'time'` <Badge type="warning" text="2026" /> (2026 기본) | `Date` | 지역 형식 언어에 따라 AM / PM 칸을 붙이거나 뺌 |
| `'duration'` | 밀리초 숫자 | 시간 칸에 상한이 없음. 음수로는 내려가지 않음 |

- `value` 를 주지 않으면 지금 시각(`duration` 이면 `0`)으로 시작합니다. 문자열은 `new Date(값)` 으로 바뀌고, 날짜로 못 바꾸는 값은 무시됩니다.
- 화살표는 `hoursStep` / `minutesStep` / `secondsStep` 만큼 움직입니다. 시간 모드에서 23시 다음은 0시로 돌아갑니다 (날짜는 그대로).
- 칸에 범위 밖 숫자(25시, 61분)를 치면 받지 않고 이전 값을 다시 보여 줍니다.
- `change` 는 코드로 `value` 를 바꿔도 옵니다.
- 2026 에서는 `'12'` 를 포함해 `time`, `24`, `duration` 이 아닌 값을 `'time'` 으로 바꿉니다. 지역 형식 언어가 바뀌면(`onRegionalFormatLanguageChange`) 다시 그립니다.

## Gauge

눈금이 있는 가로 막대와 손잡이입니다. 숫자 하나 또는 범위(손잡이 두 개)를 고릅니다 (앱 4개 모듈). SmartInputs 의 숫자 입력 옆 슬라이더, DMUControls 의 색 막대가 이것입니다 ([API](/controls/api/display-controls#gauge)).

::: warning WebUX 컨트롤이 아닙니다
Gauge 와 Timeline 은 `UWA/Controls/Abstract` 를 상속한 옛 방식 컨트롤입니다. [공통 사용법](/controls/webux-controls#공통-사용법) 과 다릅니다.
- 옵션은 생성할 때만 줍니다. `gauge.value = 10` 같은 속성이 없고 `setValue()` / `getValue()` 를 씁니다.
- `addEventListener('change', fn)` 은 DOM 이벤트가 아니라 내부 이벤트 채널(`DS/CoreEvents/ModelEvents`)입니다. `fn` 의 인자와 `this` 가 Gauge 자신이고 `e.dsModel` 이 없습니다. 위로 전파되지도 않습니다.
- 비활성은 `disable()` / `enable()` 입니다.
:::

```js
require(['DS/Controls/Gauge'], function (Gauge) {
  var gauge = new Gauge({
    minValue: 0,
    maxValue: 100,
    stepValue: 5,
    value: 40,
    graduations: 5,
    dynamicGaugeColor: false
  }).inject(el);

  gauge.addEvent('change', function (g) { console.log(g.getValue()); });
  gauge.setValue(60);
  gauge.setValue(70, false);
});
```

### 값과 눈금

- `setValue(v)` 는 `minValue` ~ `maxValue` 로 자르고 `stepValue` 단위로 반올림한 뒤 `change` 를 냅니다. 둘째 인자를 `false` 로 주면 `change` 를 내지 않습니다.
- `value` 에 배열 `[시작, 끝]` 을 주면 범위 모드가 됩니다. 손잡이가 두 개이고 `getValue()` 도 배열입니다. 범위 모드에서 숫자 하나로 `setValue` 하면 콘솔 경고를 찍고 값은 바꾸지 않습니다 (`change` 는 그래도 옵니다). `minDeltaValue` 는 두 손잡이의 최소 간격입니다.
- `graduations` 에 숫자 `n` 을 주면 양 끝을 포함해 눈금 `n` 개를 고르게 그립니다. `[{ value, label }]` 배열을 주면 그 위치에 글자 눈금을 그립니다 (`value` 는 `minValue` 로부터의 거리).
- 눈금 글자를 누르면 그 값으로 이동합니다. 손잡이 위 글자는 `displayFunction(문자열)` 결과입니다.
- `dynamicGaugeColor` (기본 `true`) 는 값에 따라 막대 색을 초록에서 빨강 쪽으로 바꿉니다. 일반 슬라이더로 쓰는 호출부는 모두 `false` 로 둡니다.

::: warning 옵션을 주지 않으면 눈금이 13개입니다
`init` 은 옵션으로 받은 `graduations` 에서 1을 뺀 뒤 그립니다. 기본값 12 는 옵션 객체에 없어서 빼지 않으므로 눈금이 13개(0 ~ 12칸)가 됩니다. `graduations: 12` 를 직접 주면 12개입니다.
:::

::: warning 소수 단계에서는 값이 문자열이 됩니다
`stepValue` 에 소수(`0.5`)가 있으면 내부 값이 `toFixed()` 결과 문자열로 저장됩니다. 숫자 하나 모드의 `getValue()` 는 `parseFloat` 로 돌려주지만, 범위 모드의 `getValue()` 배열에는 문자열이 들어 있습니다.
:::

## Timeline

Gauge 를 상속한 재생 막대입니다. 날짜 범위를 두고 재생 / 일시 정지 / 정지를 하며, 지정한 시점을 지날 때 함수를 부릅니다 (앱 6개 모듈). SIMAnimationWebUI 의 애니메이션 막대, VCXWebTimeline 이 이것을 씁니다 ([API](/controls/api/display-controls#timeline)).

```js
require(['DS/Controls/Timeline'], function (Timeline) {
  var timeline = new Timeline({
    beginDate: '2026-01-01',
    endDate: '2026-12-31',
    date: '2026-03-01',
    dynamicGaugeColor: false,
    eventsList: [
      { date: '2026-06-30', label: '중간 점검', onEvent: function () { console.log('통과', this.getValue()); } }
    ]
  }).inject(el);

  timeline.addEvent('change', function (t) { console.log(t.getValue()); });
  timeline.onStop(function () { console.log('정지'); });
  timeline.play(86400000 * 7);
});
```

- `beginDate` / `endDate` / `date` (또는 `dateAtInit`) 는 `new Date(값).valueOf()` 로 바뀌어 `minValue` / `maxValue` / `value` 가 됩니다. 내부 값은 밀리초입니다.
- `beginDate` 가 있고 `displayFunction` 이 없으면 손잡이 글자가 `YYYY-MM-DD` 입니다.
- `eventsList` 의 항목은 눈금이 됩니다 (`graduations` 옵션은 무시됨). 값이 그 시점 이상이 되면 `onEvent` 가 한 번 불리고(`this` 는 Timeline), 다시 그 앞으로 가면 다시 부를 수 있게 됩니다. 이 검사는 `Timeline.setValue` (재생, `stop()`, 코드, 눈금 글자 클릭) 에서만 하고, 손잡이를 끌 때는 하지 않습니다.
- `play(초당증가량)` 은 50ms 마다 `증가량 / 20` 씩 더합니다. 날짜 막대에서 `play(86400000 * 7)` 은 1초에 7일입니다. `maxValue` 에 닿으면 멈춥니다.
- `pause()`, `stop()` (처음으로 되돌림, `change` 발생). `onPlay(fn)` / `onPause(fn)` / `onStop(fn)` 으로 받습니다. `next()`, `previous()` 는 빈 함수입니다.

::: warning 날짜를 안 써도 getValue() 는 Date 입니다
Timeline 은 기본으로 날짜 막대로 봅니다. `eventsList` 항목에 `date` 대신 `value` 를 써야 숫자 막대가 됩니다. 그렇지 않으면 `minValue: 0, maxValue: 100` 처럼 숫자로 만들어도 `getValue()` 가 `new Date(값)` 을 돌려줍니다. SIMAnimationWebUI 는 `eventsList: [{ label: '0%', value: 0 }, ...]` 로 숫자 막대를 만듭니다.
:::

::: warning play() 기본값으로는 움직이지 않습니다
`play()` 의 기본 증가량은 1 이라 한 번에 0.05 씩 더하는데, 값은 `stepValue` (기본 1) 단위로 반올림되므로 제자리입니다. 한 번 증가량(`인자 / 20`)이 `stepValue` 의 절반 이상이 되게 인자를 줍니다. 숫자 막대(`stepValue: 1`)라면 `play(10)` 이상입니다.
:::

## Tooltip

`tooltipInfos` 를 실제로 화면에 띄우는 떠 있는 상자입니다 (`Popup` 상속). 툴팁 내용과 지연 시간은 [툴팁](/controls/webux-controls#툴팁) 과 [TooltipModel](/controls/api/webux-controls#tooltipmodel) 에 있고, 여기서는 그것이 화면에 뜨는 과정을 다룹니다. 보통은 직접 만들지 않습니다 ([API](/controls/api/display-controls#tooltip)).

### 화면에 뜨는 과정

| 단계 | 하는 일 |
| --- | --- |
| `DS/Core/Core` 로드 | `TooltipManager.init()` 이 `document` 의 마우스 / 터치 이벤트를 감시. `DS/Core/TooltipLoader` 가 `DS/Controls/Tooltip` 을 불러와 문서마다 **하나** 만듦 |
| 마우스가 요소 위로 | TooltipManager 가 부모 방향으로 `dsModel.tooltipInfos` 나 요소의 `tooltipInfos` 를 찾아 Tooltip 의 `target` 으로 넣고 `show()` |
| `initialDelay` 뒤 | 마우스가 아직 `target` 영역 안이면 짧은 설명 표시 |
| `shortToLongDelay` 뒤 | `longHelp` 표시 |
| 요소를 벗어남 | `hide()`. `reshowDelay` 안에 다른 요소로 가면 대기 없이 바로 표시 |

컨트롤이 아닌 일반 DOM 요소(캔버스, 직접 만든 `div`)도 `el.tooltipInfos` 를 넣으면 같은 방식으로 뜹니다.

```js
require(['DS/Core/TooltipModel'], function (TooltipModel) {
  cell.tooltipInfos = new TooltipModel({ title: '상태', shortHelp: '승인 대기' });
});
```

::: warning 2025 에서는 DOM 요소에 TooltipModel 객체를 넣습니다
2025 TooltipManager 는 요소의 `tooltipInfos.isEmpty()` 를 부릅니다. 컨트롤의 `tooltipInfos` 는 일반 객체도 TooltipModel 로 바뀌지만, DOM 요소에 직접 넣은 일반 객체는 바뀌지 않아 `isEmpty` 가 없습니다. 2026 TooltipManager 는 `TooltipUtils.isEmpty(객체)` 로 검사하므로 일반 객체도 됩니다.
:::

### 직접 띄우기

3D 화면처럼 마우스 이벤트를 직접 받는 곳에서는 Tooltip 을 따로 만들어 씁니다 (GEOMSCommands).

```js
require(['DS/Controls/Tooltip', 'DS/Core/TooltipModel'], function (Tooltip, TooltipModel) {
  var tooltip = new Tooltip({ target: viewerEl });
  viewerEl.tooltipInfos = new TooltipModel({ title: 'Tags', shortHelp: 'A, B' });

  viewerEl.addEventListener('mousemove', function (e) {
    tooltip.mousePosition = { x: e.clientX, y: e.clientY };
    tooltip.target = viewerEl;
    tooltip.show();
  });
});
```

::: warning hide() 는 target 을 지웁니다
`hide()` 가 끝나면 `target` 이 `undefined` 가 됩니다. 다시 띄울 때 `target` 을 다시 넣습니다. DELWebInfrastructure 의 Tooltip 은 이 때문에 `hide` 를 덮어써 `target` 을 되살립니다.
:::

::: warning mousePosition 이 target 영역 밖이면 뜨지 않습니다
`initialDelay` 가 끝난 순간 `mousePosition` 이 `target` 의 사각형 안에 있어야 표시됩니다 (터치 모드와 다시 표시 대기 중은 예외). `show()` 전에 `mousePosition` 을 넣지 않으면 시간이 끝날 때 오류가 납니다.
:::

- 2026 에서는 `tooltipInfos` 의 종류에 따라 안쪽 화면을 고릅니다. `title` / `shortHelp` / `longHelp` 키가 있으면 [StandardTooltipView](#standardtooltipview), 없고 `name` 과 `trigram` 또는 `email` 이 있으면 [RichUserTooltipView](#richusertooltipview) 입니다. <Badge type="warning" text="2026" />
- 2026 에서 읽기 전용 상태 속성 이름이 `isShortHelpVisible` / `isLongHelpVisible` 에서 `isShortDisplayVisible` / `isLongDisplayVisible` 로 바뀌었습니다.

## TooltipLoader

`DS/Controls/TooltipLoader` 는 `DS/Core/TooltipLoader` 를 그대로 돌려주는 이름뿐인 모듈입니다. 불러오면 콘솔에 폐기 오류(`console.error`)를 찍습니다. 2026 에는 `DS/Controls/TooltipLoader` 가 없고 `DS/Core/TooltipLoader` 만 있습니다.

`DS/Core/TooltipLoader.initTooltipFrame(doc)` 은 그 문서에 Tooltip 을 하나 만들어 TooltipManager 에 등록합니다. 기본 문서는 모듈을 불러올 때 자동으로 되므로, 직접 부르는 경우는 iframe 이나 새 창의 문서에 툴팁을 띄울 때입니다.

```js
require(['DS/Core/TooltipManager', 'DS/Core/TooltipLoader'], function (TooltipManager, TooltipLoader) {
  var doc = frameEl.contentDocument;
  TooltipManager.registerDocument(doc);
  TooltipLoader.initTooltipFrame(doc);
});
```

## AbstractTooltipView

<Badge type="warning" text="2026" /> 2026 Tooltip 안에 들어가는 화면의 부모 클래스입니다 (`DS/Controls/Abstract` 상속). Tooltip 이 `updateModel(tooltipInfos)`, `willLongDisplay()`, `displayLong()`, `onClick(요소)` 를 부르고, 화면 요소에 `wux-controls-<getClassId()>-tooltip-view` 클래스를 붙입니다. 종류는 Tooltip 안에 `Standard`, `RichUser` 두 개로 고정되어 있어 새 화면 종류를 등록하는 방법은 없습니다.

## StandardTooltipView

<Badge type="warning" text="2026" /> 제목, 짧은 설명, 긴 설명, 이미지, "More Help" 링크를 그리는 기본 툴팁 화면입니다. 2025 Tooltip 이 직접 그리던 내용을 2026 에서 떼어 낸 것이고, 그리는 내용과 CSS 클래스(`wux-tooltip-title`, `wux-tooltip-shortHelp` ...)는 같습니다. "More Help" 링크는 `tooltipInfos.moreHelpCB` 가 함수일 때 생기고, 누르면 그 함수를 부릅니다.

## RichUserTooltipView

<Badge type="warning" text="2026" /> 사람 정보 카드([UserCard](#usercard))를 툴팁으로 띄웁니다. `tooltipInfos` 에 `title` / `shortHelp` / `longHelp` 를 넣지 않고 `name` 과 `trigram` 또는 `email` 을 넣으면 이 화면이 됩니다.

```js
new Button({
  label: '담당자',
  tooltipInfos: {
    name: 'Hong Gildong',
    email: 'user@example.com',
    role: 'Designer',
    company: 'Sample Co.',
    presence: 'busy',
    subPresence: 'inMeeting',
    actionsFlag: true,
    onChat: function (card) { console.log('chat', card.email); }
  }
}).inject(el);
```

- `tooltipInfos` 의 키를 그대로 UserCard 속성에 넣습니다. 넣지 않은 키는 기본값으로 되돌립니다.
- 이 툴팁은 늘 "닿을 수 있는" 툴팁이라 마우스를 툴팁 안으로 옮겨 버튼을 누를 수 있습니다.

::: warning title 키가 있으면 Standard 가 됩니다
종류 판정은 키가 **있는지** (`in`) 로 합니다. `title: ''` 처럼 빈 값이라도 `title`, `shortHelp`, `longHelp` 중 하나가 있으면 Standard 툴팁이 되어 사람 카드가 나오지 않습니다.
:::

## UserCard

<Badge type="warning" text="2026" /> 사람 사진(없으면 이름 머리글자 아바타), 이름, 트라이그램 또는 메일, 현재 상태, 역할, 회사, 국가, 동작 버튼을 보여 주는 카드입니다 (`BaseCard` 상속). RichUserTooltipView 가 쓰고, 화면에 직접 붙여도 됩니다 ([API](/controls/api/display-controls#usercard)).

```js
require(['DS/Controls/UserCard'], function (UserCard) {
  var card = new UserCard({
    name: 'Hong Gildong',
    trigram: 'HGD',
    presence: 'away',
    presenceDate: new Date(Date.now() - 3600000),
    mainAction: { url: 'https://example.com/people/hgd', target: '_blank' },
    actionsFlag: true,
    followFlag: true,
    onFollow: function (c) { console.log('follow', c.name); }
  }).inject(el);
});
```

- `trigram` 이 있으면 이름 아래에 트라이그램을, 없으면 `email` 을 보여 줍니다.
- `presence` 는 `online`, `offline` (기본), `away`, `busy`, `dnd`, `out` 입니다. `busy` + `subPresence: 'inCall'` / `'inMeeting'`, `dnd` + `'presenting'` 이면 상태 뒤에 세부 상태가 붙습니다.
- `presenceDate`: `offline` / `away` 면 "~분째" 같은 지난 시간(3일 넘으면 날짜), `out` 이면 "~까지" 날짜를 붙입니다. 10초마다 다시 계산합니다.
- `actionsFlag: true` 면 아래에 대화, 전화, 화상, 화면 공유 버튼이 생기고, `followFlag: true` 를 함께 주면 팔로우 버튼도 생깁니다. 누르면 `onChat` / `onCall` / `onVisio` / `onScreenSharing` / `onFollow` 를 카드 자신을 인자로 부릅니다.
- `country` 는 원본 타입 표기가 `boolean` 이지만 국기와 나라 이름을 찾는 기호 문자열로 씁니다. 형식은 ISO 2글자 국가 코드로 보입니다. <Badge type="danger" text="검증 필요" />

## BaseCard

<Badge type="warning" text="2026" /> UserCard 와 ControlsEx 의 Card 가 상속하는 카드 부모 클래스입니다. 직접 만들지 않습니다. 공통 속성은 `mainAction` 하나가 실제로 동작합니다 (UserCard 에서는 이름을 누를 때).

| `mainAction` 형태 | 누르면 |
| --- | --- |
| 함수 | 그 함수를 부름 |
| `{ func: 함수, argument }` | `func(argument 복사본)` |
| `{ module: 'DS/...', func: '함수이름', argument }` | 모듈을 불러와 그 함수를 부름 |
| `'https://...'` | 새 창(`_blank`)으로 엶 |
| `{ url, parameters, target }` | `url + parameters` 를 `target` (`_blank` 기본, `_self`, `_parent`, `_top`, 프레임 이름)으로 엶 |

`highlightModel` 은 공개 속성에 있지만 2026 BaseCard / UserCard 에서는 적용 함수가 비어 있어 효과가 없습니다.
