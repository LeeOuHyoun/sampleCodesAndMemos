---
title: 색상, 표시 컨트롤 API
---

# 색상, 표시 컨트롤 API <Badge type="info" text="원본 분석" />

색 선택(ColorPicker, ColorChooser, ColorPalette, ColorCanvas, ColorEditors), 시간 선택판(TimeChooser), 막대(Gauge, Timeline), 툴팁 화면(Tooltip, TooltipLoader, 2026 툴팁 뷰, UserCard, BaseCard)의 공개 속성, 메서드, 이벤트입니다. 사용법과 함정은 [색상, 표시 컨트롤](/controls/display-controls) 에 있습니다.

```js
var picker = new ColorPicker({ value: 'ff0000' }).inject(el);
picker.value = '00ff00';
picker.addEventListener('change', function (e) { console.log('#' + e.dsModel.value); });
```

::: info 근거
Controls.js (2025 `Object.defineProperty(t, "publishedProperties", ...)` / `inherit({ publishedProperties })`, 2026 `static get publishedProperties()`) 의 각 모듈, `fire("...")` 호출, prototype / class 메서드. Gauge, Timeline 은 `defaultOptions` 와 `_modelEvents.publish`. Core.js 의 TooltipManager, TooltipLoader, 2026 TooltipUtils. 표의 기본값은 소스의 `defaultValue` 그대로입니다.
:::

- WebUX 컨트롤(아래 Gauge, Timeline 을 뺀 전부)은 [Abstract](/controls/api/webux-controls#abstract) 속성도 가집니다. 키는 생성자 옵션과 속성 이름이고 `ctrl.키 = 값` 으로 바꿉니다.
- 이벤트는 `ctrl.addEventListener(이름, fn)` 으로 받는 DOM 이벤트입니다. `e.dsModel` 이 컨트롤입니다. Gauge, Timeline 만 다릅니다.
- 색 값 형식 비교는 [색상 값 형식](/controls/display-controls#색상-값-형식) 에 있습니다.

## ColorPicker

`DS/Controls/ColorPicker`. 색 견본 버튼 + ColorChooser 팝업 (`Popup`, `position: 'bottom'`, `trigger: 'click escape'`).

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>'ffffff'</code> | <code>#</code> 없는 16진수. 3 / 6자리 (<code>showAlphaFlag</code> 면 4 / 8자리도). 앞의 <code>#</code> 는 떼어 냄. 형식이 틀리면 무시. <code>null</code> / <code>undefined</code> 는 빈 색(흰 바탕) |
| <code>referenceValue</code> | <code>string</code> | <code>'ffffff'</code> | 팝업 안 비교 견본 색 |
| <code>showAlphaFlag</code> | <code>boolean</code> | <code>false</code> | 알파 허용. 견본에 체크무늬 배경 |
| <code>popupVisibleFlag</code> | <code>boolean</code> | <code>false</code> | 팝업 열림. 처음 클릭 전에는 바꿔도 팝업이 없음 |
| <code>handleEditionCancel</code> | <code>boolean</code> | <code>true</code> | Esc 로 닫으면 열 때 값으로 되돌림 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>liveChange</code> | 팝업이 열린 동안 값 변경 (Esc 되돌림 포함) | - |
| <code>change</code> | 팝업을 Esc 아닌 방법으로 닫을 때 값이 열 때와 다르면. 팝업이 닫힌 상태의 코드 대입 | - |
| <code>show</code> | 팝업 열림 | - |
| <code>hide</code> | 팝업 닫힘 | <code>{ cancelFlag }</code> (Esc 면 <code>true</code>) |
| <code>beginEdit</code> / <code>endEdit</code> | 팝업 안 편집 시작 / 끝. 값이 바뀐 채 닫힐 때도 <code>change</code> 다음에 <code>endEdit</code> | - |
| <code>cancelEdit</code> | Esc 로 닫아 값을 되돌림 (<code>handleEditionCancel</code>) | - |

| 메서드 | 설명 |
| --- | --- |
| <code>show()</code> | <code>popupVisibleFlag = true</code>. 자기 자신 반환. Abstract 의 <code>show()</code> 와 다름 |
| <code>hide()</code> | <code>popupVisibleFlag = false</code> |
| <code>getPopup()</code> | 팝업 Popup 객체. 처음 클릭 전에는 <code>undefined</code> |

키보드: Space 로 팝업 열고 닫기, 팝업 안 Enter 로 닫기, Esc 로 취소.

## ColorChooser

`DS/Controls/ColorChooser`. ColorCanvas + GradientSlider + LineEditor(16진수) + ColorEditors 로 된 색 선택판.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>'ffffff'</code> | 16진수. <code>showAlphaFlag</code> 에 맞춰 알파 자리를 붙이거나 뗌. 3자리는 6자리로 늘림 |
| <code>hsvValue</code> | <code>array</code> | - | <code>[h, s, v, a?]</code> (0~360, 0~100, 0~100, 0~255). <code>value</code> 와 서로 맞춰짐 |
| <code>referenceValue</code> | <code>string</code> | <code>'ffffff'</code> | 비교 견본 색. 견본을 더블 클릭하면 <code>value</code> 가 이 값이 됨 |
| <code>informationsVisibleFlag</code> | <code>boolean</code> | <code>true</code> | 오른쪽 정보 칸(견본, 16진수, 숫자 칸) 표시 |
| <code>handleEditionCancel</code> | <code>boolean</code> | <code>true</code> | 판 / 막대를 끄는 동안 Esc 로 되돌림 |
| <code>displayStyle</code> | <code>string</code> | <code>'basic'</code> | <code>basic</code> (정보 칸에 RGB / HSV 숫자), <code>advanced</code> (아래에 ColorEditors 탭) |
| <code>showAlphaFlag</code> | <code>boolean</code> | <code>false</code> | 알파 칸 |

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>hsvValue</code> 가 바뀔 때마다 (끄는 중 계속, 코드 대입 포함) |
| <code>beginEdit</code> / <code>endEdit</code> | 판 / 막대 누름 / 놓음, 16진수 칸 포커스 / 벗어남 |
| <code>cancelEdit</code> | Esc 로 되돌림 |

| 메서드 | 설명 |
| --- | --- |
| <code>setColorSubAttribute(name, v)</code> | 성분 하나 변경. <code>Hue</code>, <code>Saturation</code>, <code>Value</code>, <code>HslSaturation</code>, <code>Lightness</code>, <code>Red</code>, <code>Green</code>, <code>Blue</code>, <code>Alpha</code> |
| <code>getColorSubAttribute(name)</code> | 성분 하나 읽기 (이름은 위와 같음) |

## ColorPalette

`DS/Controls/ColorPalette`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>''</code> | 선택 색. 색 문자열(6 / 8자리 16진수, <code>rgb()</code>, <code>rgba()</code>, <code>hsl()</code>, <code>hsla()</code>)이 아니면 무시 |
| <code>swatches</code> | <code>array</code> | <code>[]</code> | <code>[{ value, tooltipParams }]</code>. 중복, 잘못된 색은 이 배열에서 빠짐 |

| 견본 키 | 설명 |
| --- | --- |
| <code>value</code> | 색 문자열. 없으면 "색 없음" 견본 |
| <code>tooltipParams</code> | 견본 툴팁 (<code>tooltipInfos</code> 형식). 없으면 <code>{ shortHelp: 색 }</code> |

이벤트: <code>change</code> (<code>value</code> 변경, 코드 대입 포함)

| 메서드 | 설명 |
| --- | --- |
| <code>loadDefault()</code> | <code>Color.COLORS_3DEXPERIENCE</code> 27색으로 <code>swatches</code> 채움 |
| <code>reset()</code> | <code>swatches = []</code>, <code>value = ''</code> |
| <code>reApplySwatches()</code> | 견본을 다시 그림 |

키보드: 방향키로 앞 / 뒤 견본 선택.

## ColorCanvas

`DS/Controls/ColorCanvas`. 두 색 성분을 가로 / 세로로 고르는 판.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>undefined</code> | 16진수 |
| <code>hsvValue</code> | <code>array</code> | <code>undefined</code> | <code>[h, s, v, a?]</code> |
| <code>handleEditionCancel</code> | <code>boolean</code> | <code>true</code> | 끄는 동안 Esc 로 되돌림 |
| <code>coordinatesInBitmap</code> | <code>object</code> | <code>undefined</code> | 판 위 위치 <code>{ x, y }</code> (각 축 성분 값) |
| <code>subColorAttributeX</code> | <code>string</code> | <code>'Hue'</code> | 가로축 성분 |
| <code>subColorAttributeY</code> | <code>string</code> | <code>'Lightness'</code> | 세로축 성분 |
| <code>modulationValue</code> | <code>integer</code> | <code>100</code> | 판에 없는 셋째 성분 값 |

성분 이름: <code>Hue</code> (0~360), <code>Saturation</code>, <code>Value</code>, <code>HslSaturation</code>, <code>Lightness</code> (0~100), <code>Red</code>, <code>Green</code>, <code>Blue</code> (0~255).

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>value</code> 적용 (코드 대입 포함) |
| <code>beginEdit</code> / <code>endEdit</code> | 판 누름 / 놓음 |
| <code>cancelEdit</code> | Esc 로 되돌림 |

메서드: <code>setColorSubAttribute(name, v)</code> (축 성분 이면 그 축 위치 변경), <code>getColorSubAttribute(name)</code>, <code>buildCanvas()</code> (판 다시 그리기)

## ColorEditors

`DS/Controls/ColorEditors`. SpinBox, GradientSlider, ButtonGroup, Toggle 로 된 숫자 편집판.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>string</code> | <code>'ff0000'</code> | 16진수 |
| <code>hsvValue</code> | <code>array</code> | <code>undefined</code> | <code>[h, s, v, a?]</code>. 만들 때 <code>value</code> 로 채움 |
| <code>availableColorFormats</code> | <code>array</code> | <code>undefined</code> | 쓸 형식. 주지 않으면 <code>['RGB', 'HSV', 'HSL', 'RGBA', 'HSVA', 'HSLA']</code> |
| <code>displayStyle</code> | <code>string</code> | <code>'tabs'</code> | <code>tabs</code> (형식 탭), <code>stacked</code> (모든 형식을 세로로) |
| <code>useColorSlidersFlag</code> | <code>boolean</code> | <code>true</code> | 숫자 칸 옆 슬라이더 |
| <code>showAlphaFlag</code> | <code>boolean</code> | <code>false</code> | 알파 형식 사용. <code>tabs</code> 에서 처음 형식이 목록의 4번째(기본 <code>RGBA</code>)가 됨 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | 숫자 칸 / 슬라이더로 성분 변경 | <code>{ colorSubAttributeType, currentColorFormat }</code> |
| <code>changeModulation</code> | 성분 옆 라디오 선택 | <code>{ colorSubAttributeType, currentColorFormat }</code> |
| <code>beginEdit</code> / <code>endEdit</code> / <code>cancelEdit</code> | 안의 편집기에서 올라온 것 | - |

메서드: <code>setColorSubAttribute(name, v)</code>

## TimeChooser

`DS/Controls/TimeChooser`. [TimePicker](/controls/api/webux-controls#timepicker) 팝업의 내용.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>date</code> | <code>undefined</code> | 만들 때 지금 시각(<code>duration</code> 이면 <code>0</code>)으로 채움. <code>duration</code> 에서는 밀리초 숫자. 문자열은 <code>Date</code> 로 바꿈 |
| <code>precision</code> | <code>string</code> | <code>'min'</code> | <code>min</code>, <code>sec</code> (초 칸 표시) |
| <code>mode</code> | <code>string</code> | <code>'24'</code> (2026: <code>'time'</code>) | 2025: <code>24</code>, <code>12</code>, <code>duration</code>. 2026: <code>time</code> (지역 형식), <code>24</code>, <code>duration</code>. 그 밖은 <code>time</code> 으로 바뀜 |
| <code>hoursStep</code> | <code>integer</code> | <code>1</code> | 시 화살표 단위 |
| <code>minutesStep</code> | <code>integer</code> | <code>1</code> | 분 화살표 단위 |
| <code>secondsStep</code> | <code>integer</code> | <code>1</code> | 초 화살표 단위 |

이벤트: <code>change</code> (<code>value</code> 변경, 코드 대입 포함)

| 메서드 | 설명 |
| --- | --- |
| <code>getHours()</code> / <code>getMinutes()</code> / <code>getSeconds()</code> | 현재 값의 시 / 분 / 초. <code>duration</code> 이면 밀리초에서 계산 (시는 상한 없음) |
| <code>setHours(n)</code> / <code>setMinutes(n)</code> / <code>setSeconds(n)</code> | 사용자 조작으로 값 변경. 시간 모드는 24 / 60 으로 나눈 나머지, <code>duration</code> 은 음수가 되면 무시 |
| <code>incrementHours()</code> / <code>decrementHours()</code> | <code>hoursStep</code> 만큼 |
| <code>incrementMinutes()</code> / <code>decrementMinutes()</code> | <code>minutesStep</code> 만큼 |
| <code>incrementSeconds()</code> / <code>decrementSeconds()</code> | <code>secondsStep</code> 만큼 |
| <code>incrementAmPm()</code> / <code>decrementAmPm()</code> | 12시간 앞 / 뒤 |

## Gauge

`DS/Controls/Gauge`. `UWA/Controls/Abstract` 상속 (WebUX Abstract 아님). 옵션은 생성할 때만 줍니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | <code>0</code> | 숫자. 배열 <code>[시작, 끝]</code> 이면 범위 모드 (손잡이 두 개) |
| <code>minValue</code> / <code>maxValue</code> | <code>0</code> / <code>360</code> | 범위 |
| <code>stepValue</code> | <code>1</code> | 반올림 단위. 소수면 내부 값이 문자열 |
| <code>minDeltaValue</code> | <code>0</code> | 범위 모드의 두 손잡이 최소 간격 |
| <code>graduations</code> | <code>12</code> | 숫자 <code>n</code>: 눈금 <code>n</code> 개 (옵션으로 줄 때. 기본값 그대로면 13개). 배열 <code>[{ value, label }]</code>: 그 위치에 글자 눈금 |
| <code>graduationsLabel</code> | <code>true</code> | 눈금 글자 표시. 누르면 그 값으로 이동 |
| <code>dynamicGraduations</code> | <code>false</code> | 눈금 색을 hsl 그라데이션으로 칠함 (처음 투명도 0) |
| <code>dynamicGaugeColor</code> | <code>true</code> | 값에 따라 막대 색 변경 (hsl 120 → 20) |
| <code>showCursorLabel</code> | <code>true</code> | <code>false</code> 면 손잡이와 글자를 숨김 |
| <code>displayFunction</code> | <code>function (v) { return v.toString(); }</code> | 손잡이 글자. 인자는 문자열 |
| <code>onChange</code> | <code>null</code> | 값이 바뀔 때 <code>onChange.call(gauge, getValue())</code> |
| <code>theme</code> | <code>{ shiftCursorOnBorders: true, fontSize: 10, height: 22, gaugeHeight: 10, cursor: { width: 16, height: 16, borderRadius: '50%' }, width: 200, graduations: { width: 1, height: 24 } }</code> | 크기 (px) |
| <code>snap</code> | <code>0</code> | 코드에서 쓰지 않음 |
| <code>className</code> | - | 바깥 요소에 붙일 클래스 |
| <code>inactiveGraduationsColor</code> / <code>graduationsLabelColor</code> | - | 눈금 / 눈금 글자 색 |

| 메서드 | 설명 |
| --- | --- |
| <code>setValue(v, fire?)</code> | 범위로 자르고 <code>stepValue</code> 로 반올림. <code>fire</code> 기본 <code>true</code>, <code>false</code> 면 <code>change</code> 없음 |
| <code>getValue()</code> | 숫자 (범위 모드는 배열) |
| <code>enable()</code> / <code>disable()</code> | 비활성 (<code>wux-ui-state-disabled</code>, <code>pointer-events: none</code>) |
| <code>addEvent(name, fn)</code> / <code>addEventListener(name, fn)</code> | 내부 이벤트 구독. 토큰 반환 |
| <code>addEventOnce(name, fn)</code> | 한 번만 |
| <code>inject(parent)</code> / <code>getContent()</code> / <code>destroy()</code> | UWA 컨트롤 공통 |

| 이벤트 | 시점 | 콜백 |
| --- | --- | --- |
| <code>change</code> | <code>setValue</code> (둘째 인자 <code>false</code> 제외), 손잡이 끌기, 눈금 글자 클릭 | <code>fn(gauge)</code>, <code>this</code> 도 gauge |

## Timeline

`DS/Controls/Timeline` (부모 Gauge). Gauge 옵션, 메서드, <code>change</code> 를 모두 가집니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>beginDate</code> / <code>endDate</code> | - | <code>new Date(값).valueOf()</code> 가 <code>minValue</code> / <code>maxValue</code> |
| <code>date</code> / <code>dateAtInit</code> | - | 처음 값. 둘 다 있으면 <code>date</code> |
| <code>eventsList</code> | - | <code>[{ date 또는 value, label, onEvent }]</code>. 눈금이 되고 <code>graduations</code> 를 대신함. <code>value</code> 로 쓰면 숫자 막대 |
| <code>displayFunction</code> | <code>beginDate</code> 있으면 <code>'%Y-%m-%d'</code>, 없으면 그대로 | 손잡이 글자 |

| 메서드 | 설명 |
| --- | --- |
| <code>play(step?, notify?)</code> | 50ms 마다 <code>step / 20</code> 씩 더함 (1초에 <code>step</code>). <code>step</code> 기본 <code>1</code>. <code>notify</code> 기본 <code>true</code> 면 PLAY 발행 |
| <code>pause(notify?)</code> | 멈춤. PAUSE 발행 |
| <code>stop(notify?)</code> | 멈추고 <code>minValue</code> 로. STOP 발행 |
| <code>onPlay(fn)</code> / <code>onPause(fn)</code> / <code>onStop(fn)</code> | PLAY / PAUSE / STOP 구독. 토큰 반환 |
| <code>setValue(v, fire?)</code> | Gauge 와 같음 + <code>maxValue</code> 면 <code>pause()</code>, <code>eventsList</code> 의 <code>onEvent</code> 검사 |
| <code>getValue()</code> | 날짜 막대면 <code>Date</code>, 숫자 막대면 숫자 |
| <code>next()</code> / <code>previous()</code> | 빈 함수 |

## Tooltip

`DS/Controls/Tooltip` (부모 `DS/Controls/Popup`). 문서마다 하나를 `DS/Core/TooltipLoader` 가 만들고 `DS/Core/TooltipManager` 가 씁니다. 자체 `publishedProperties` 는 비어 있고 Popup 속성을 가집니다. 만들 때 `constraint: 'screen'`, `autoHide: false`, `position: 'bottom'`, `forceKeepOrientation: true` 로 고정합니다.

| 속성 | 설명 |
| --- | --- |
| <code>target</code> | 툴팁을 띄울 컨트롤 또는 DOM 요소. <code>target.tooltipInfos</code> 를 읽음. <code>hide()</code> 뒤 <code>undefined</code> |
| <code>mousePosition</code> | <code>{ x, y }</code> (<code>clientX</code>, <code>clientY</code>). 쓰기 전용 (2026 에서 읽기 추가) |
| <code>isShortHelpVisible</code> / <code>isLongHelpVisible</code> | 읽기 전용. 2026 이름은 <code>isShortDisplayVisible</code> / <code>isLongDisplayVisible</code> |
| <code>hasInitialTimerEnded</code> | 읽기 전용. <code>initialDelay</code> 가 지났는지 |

| 메서드 | 설명 |
| --- | --- |
| <code>show()</code> | <code>target.tooltipInfos</code> 가 비어 있지 않으면 표시 대기 시작. <code>initialDelay</code> 뒤 마우스가 <code>target</code> 안이면 표시 |
| <code>hide()</code> | 닫고 타이머, <code>target</code> 정리 |
| <code>isPositionInRZ(pos, 'target' &#124; 'tooltip', margin?)</code> | 위치가 대상 / 툴팁 영역 안인지 |
| <code>getView()</code> <Badge type="warning" text="2026" /> | 안쪽 화면 (StandardTooltipView / RichUserTooltipView) |
| <code>isReachable()</code> <Badge type="warning" text="2026" /> | 마우스를 툴팁 안으로 옮길 수 있는지 (Standard 는 <code>moreHelpCB</code> 가 있을 때, RichUser 는 항상) |
| <code>onClick(el)</code> <Badge type="warning" text="2026" /> | 툴팁 안 클릭을 화면에 전달 |

이벤트: <code>wux-tooltip-updateview</code> (위치를 잡고 보이게 한 뒤)

### TooltipManager

`DS/Core/TooltipManager`. 정적 함수만 있습니다. `DS/Core/Core` 를 불러오면 `init()` 이 기본 문서를 등록합니다.

| 함수 | 설명 |
| --- | --- |
| <code>registerDocument(doc)</code> / <code>unregisterDocument(doc)</code> | 문서의 마우스 / 터치 감시 시작 / 끝 |
| <code>enable(doc?)</code> / <code>disable(doc?)</code> | 감시 켜기 / 끄기 (등록은 유지) |
| <code>show(el, doc?)</code> | <code>el</code> (또는 <code>el.dsModel</code>) 을 <code>target</code> 으로 바로 표시 |
| <code>hide(doc?)</code> | 그 문서의 툴팁 닫기 |

## TooltipLoader

`DS/Controls/TooltipLoader` (2025 만). `DS/Core/TooltipLoader` 를 그대로 돌려주고 콘솔에 폐기 오류를 찍습니다. 2026 에는 없습니다.

| 함수 | 설명 |
| --- | --- |
| <code>TooltipLoader.initTooltipFrame(doc?)</code> | <code>DS/Controls/Tooltip</code> 을 불러와 그 문서(기본 <code>document</code>)의 툴팁을 하나 만들어 TooltipManager 에 등록. Promise 반환. 같은 문서는 한 번만. 모듈을 불러올 때 기본 문서로 한 번 불림 |

## AbstractTooltipView

<Badge type="warning" text="2026" /> `DS/Controls/AbstractTooltipView` (부모 `DS/Controls/Abstract`). 공개 속성 없음. 화면 요소에 `wux-controls-<getClassId()>-tooltip-view` 클래스.

| 메서드 | 설명 |
| --- | --- |
| <code>getClassId()</code> | <code>'abstract'</code> (자식이 바꿈) |
| <code>updateModel(tooltipInfos)</code> | 내용 반영 |
| <code>willLongDisplay()</code> | 긴 설명 단계가 있는지. 기본 <code>false</code> |
| <code>displayLong()</code> | 긴 설명 표시 |
| <code>postInjectTooltip()</code> | 툴팁에 붙인 뒤 크기 측정 |
| <code>onClick(el)</code> | 툴팁 안 클릭 |

## StandardTooltipView

<Badge type="warning" text="2026" /> `DS/Controls/StandardTooltipView` (부모 AbstractTooltipView). `getClassId()` 는 `'standard'`.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>tooltipModel</code> | <code>object</code> | <code>undefined</code> | 그릴 <code>tooltipInfos</code> (<code>title</code>, <code>shortHelp</code>, <code>longHelp</code>, 이미지, <code>moreHelpCB</code> ...) |

| 메서드 | 설명 |
| --- | --- |
| <code>updateModel(m)</code> | <code>tooltipModel</code> 교체. 같은 객체면 다시 그림 |
| <code>willLongDisplay()</code> | 짧은 설명(또는 이미지)과 긴 설명(또는 이미지)이 모두 있으면 <code>true</code> |
| <code>displayLong()</code> | 긴 설명, 긴 설명 이미지 표시 |
| <code>updateOverflow(flag)</code> | 넘치는 글자 줄 수 표시 (<code>--nb-lines</code>) |
| <code>onClick(el)</code> | "More Help" 를 누르면 <code>tooltipModel.moreHelpCB()</code> |

## RichUserTooltipView

<Badge type="warning" text="2026" /> `DS/Controls/RichUserTooltipView` (부모 AbstractTooltipView). `getClassId()` 는 `'richuser'`. 안에 UserCard 하나.

| 메서드 | 설명 |
| --- | --- |
| <code>updateModel(m)</code> | <code>Object.assign(userCard, m)</code>. <code>m</code> 에 없는 UserCard 속성은 기본값으로 |
| <code>willLongDisplay()</code> | 항상 <code>false</code> |
| <code>onClick(el)</code> | <code>userCard.onClick(el)</code> |

`tooltipInfos` 가 이 화면이 되는 조건 (2026 `TooltipUtils.getType`):

| 종류 | 조건 (키가 있는지로 판정) |
| --- | --- |
| <code>Standard</code> | <code>title</code>, <code>shortHelp</code>, <code>longHelp</code> 중 하나 |
| <code>RichUser</code> | Standard 가 아니고 <code>name</code> 과 (<code>trigram</code> 또는 <code>email</code>) |
| 그 밖 | <code>Standard</code> |

## UserCard

<Badge type="warning" text="2026" /> `DS/Controls/UserCard` (부모 BaseCard). 모든 키가 2026 신규입니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>picture</code> | <code>string</code> | <code>undefined</code> | 사진 URL. 없으면 <code>name</code> 머리글자 아바타 |
| <code>name</code> | <code>string</code> | <code>undefined</code> | 이름. <code>mainAction</code> 이 있으면 누를 수 있음 |
| <code>trigram</code> | <code>string</code> | <code>undefined</code> | 이름 아래 글자 (있으면 <code>email</code> 대신) |
| <code>email</code> | <code>string</code> | <code>undefined</code> | 이름 아래 글자 (<code>trigram</code> 이 없을 때) |
| <code>presence</code> | <code>string</code> | <code>undefined</code> | <code>online</code>, <code>offline</code> (비우면 이것), <code>away</code>, <code>busy</code>, <code>dnd</code>, <code>out</code> |
| <code>subPresence</code> | <code>string</code> | <code>undefined</code> | <code>busy</code> 의 <code>inCall</code>, <code>inMeeting</code>, <code>dnd</code> 의 <code>presenting</code> |
| <code>presenceDate</code> | <code>Date</code> | <code>undefined</code> | <code>offline</code> / <code>away</code>: 그 뒤 지난 시간, <code>out</code>: 돌아오는 날짜 |
| <code>role</code> | <code>string</code> | <code>undefined</code> | 역할 |
| <code>company</code> | <code>string</code> | <code>undefined</code> | 회사 |
| <code>externalFlag</code> | <code>boolean</code> | <code>undefined</code> | 외부인 표시 ("External", 아바타 표시) |
| <code>country</code> | <code>boolean</code> | <code>undefined</code> | 국가 기호. 원본 타입 표기와 달리 문자열로 씀 (국기 + 나라 이름) |
| <code>followFlag</code> | <code>boolean</code> | <code>false</code> | 팔로우 버튼 (<code>actionsFlag</code> 와 함께) |
| <code>actionsFlag</code> | <code>boolean</code> | <code>false</code> | 대화, 전화, 화상, 화면 공유 버튼 |
| <code>onFollow</code> / <code>onChat</code> / <code>onCall</code> / <code>onVisio</code> / <code>onScreenSharing</code> | <code>WUX.FunctionDefinition</code> | <code>undefined</code> | 버튼을 누르면 <code>fn(card)</code> |

메서드: <code>onClick(el)</code> (툴팁에서 전달받은 클릭을 버튼 함수로), <code>destroy()</code> (상태 갱신 타이머 정리). 이벤트 없음.

## BaseCard

<Badge type="warning" text="2026" /> `DS/Controls/BaseCard` (부모 `DS/Controls/Abstract`). UserCard, `DS/ControlsEx/Card` 의 부모. 화면 요소 클래스 `wux-controls-basecard wux-controls-<종류>`.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>highlightModel</code> | <code>object</code> | <code>undefined</code> | 적용 함수가 비어 있어 BaseCard / UserCard 에서는 효과 없음 |
| <code>mainAction</code> | <code>WUX.LinkDefinition &#124; WUX.FunctionDefinition</code> | <code>undefined</code> | 주 동작. 함수, <code>{ func, argument }</code>, <code>{ module, func: '이름', argument }</code>, URL 문자열(<code>_blank</code>), <code>{ url, parameters, target }</code> |

이벤트 없음. 주 동작 요소를 한 번 누르면 `visited` 속성이 붙습니다.
