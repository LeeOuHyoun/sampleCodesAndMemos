---
title: UIKIT API
---

# UIKIT API <Badge type="info" text="원본 분석" />

`DS/UIKIT/*` 모듈별 옵션(`defaultOptions`), 메서드, 이벤트입니다. 사용법은 [UIKIT](/controls/uikit) 에 있습니다.

```js
var btn = new Button({ value: '저장', className: 'primary', events: { onClick: function () { console.log('저장'); } } }).inject(el);
btn.addEvent('onClick', function () { console.log('두 번째'); });
```

::: info 근거
UIKIT.js 각 모듈의 `defaultOptions`, `dispatchEvent("...")` 호출, 메서드 정의. UWA2/js/Controls/Abstract.js (inject, getContent, destroy). 2026 은 enovia2026_webapps 의 UIKIT.js
:::

- 옵션은 `defaultOptions` 와 깊게 합쳐져 `this.options` 에 들어갑니다. 표의 "-" 기본값은 `defaultOptions` 에 없지만 코드가 읽는 키입니다.
- 이벤트는 옵션 `events: { onXxx: fn }` 또는 `x.addEvent('onXxx', fn)` 으로 받습니다. 인자는 이벤트마다 다릅니다 (대개 브라우저 이벤트).
- 모든 컨트롤에 `inject(el, where?)`, `getContent()`, `destroy()`, `addEvent` / `removeEvent` 가 있습니다.

## Input

`Input/Text`, `Input/Button`, `Input/Toggle`, `Input/Select` 등의 부모입니다. 직접 만들면 `Use a subclass of Input` 예외가 납니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | 추가 클래스 |
| <code>attributes</code> | <code>{}</code> | 입력 요소에 넣을 HTML 속성 |
| <code>value</code> | <code>''</code> | 처음 값 |
| <code>name</code> | <code>''</code> | <code>name</code> 속성 |
| <code>disabled</code> | <code>false</code> | 비활성 |
| <code>commonClassName</code> | <code>'form-control'</code> | 공통 클래스 |
| <code>rounded</code> <Badge type="warning" text="2026" /> | <code>false</code> | 둥근 모양 |
| <code>id</code> | - | 입력 요소 <code>id</code> |
| <code>events</code> | - | <code>{ onChange: fn, ... }</code> |

메서드: <code>getContent()</code>, <code>setFocus()</code>, <code>focus()</code>, <code>blur()</code>, <code>setDisabled()</code>, <code>isDisabled()</code>, <code>enable()</code>, <code>disable()</code>, <code>setName()</code>, <code>getName()</code>, <code>setId()</code>, <code>getId()</code>, <code>setValue()</code>, <code>getValue()</code><br>이벤트: <code>onChange</code>

`onChange` 는 브라우저 `change`, `onClick` / `onMouseDown` 은 바깥 요소, `onKeyDown` 은 입력 요소에서 옵니다.

## Input/Button

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>'btn-default'</code> | <code>primary</code>, <code>default</code>, <code>info</code>, <code>warning</code>, <code>error</code>, <code>success</code>, <code>link</code>, <code>block</code>, <code>small</code>, <code>large</code>, <code>xsmall</code>, <code>large-icon</code> (앞에 <code>btn-</code> 자동) |
| <code>dropdownCaret</code> | <code>true</code> | <code>dropdown</code> 이 있을 때 화살표 |
| <code>active</code> | <code>false</code> | 눌린 모양 |
| <code>rounded</code> <Badge type="warning" text="2026" /> | <code>false</code> | 둥근 모양 |
| <code>value</code> | - | 글자 |
| <code>icon</code> | - | 아이콘 이름 (<code>fonticon-</code> 자동). <code>left</code> / <code>right</code> 위치 |
| <code>dropdown</code> | - | DropdownMenu 옵션 |

메서드: <code>setDropdown()</code>, <code>setIcon()</code>, <code>removeIcon()</code>, <code>setValue()</code>, <code>setActive()</code>, <code>toggleActive()</code>, <code>isActive()</code>, <code>load()</code>, <code>setClassName()</code><br>이벤트: Input 과 같음 (<code>onClick</code>, <code>onMouseDown</code>, <code>onChange</code>, <code>onKeyDown</code>)

드롭다운이 있으면 `onDropdownShow`, `onDropdownHide`, `onDropdownClick`, `onDropdownClickOutside`, `onDropdownMouseLeave` 도 냅니다.

## Input/IconButton <Badge type="warning" text="2026" />

`Input/Button` 을 상속한 아이콘 버튼입니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> <Badge type="warning" text="2026" /> | <code>'lite'</code> | 모양 |
| <code>dropdownCaret</code> <Badge type="warning" text="2026" /> | <code>true</code> | 화살표 |
| <code>active</code> <Badge type="warning" text="2026" /> | <code>false</code> | 눌린 모양 |
| <code>rounded</code> <Badge type="warning" text="2026" /> | <code>true</code> | 둥근 모양 |
| <code>value</code> <Badge type="warning" text="2026" /> | <code>'icon'</code> | 글자 |

## Input/Text

`Input/Password` 는 같은 옵션에 `type="password"` 입니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | <code>input-sm</code> 등 |
| <code>multiline</code> | <code>false</code> | <code>textarea</code> 로 만듦 |
| <code>spellcheck</code> | <code>true</code> | 맞춤법 검사 |
| <code>fixIframedIosScroll</code> | <code>false</code> | iOS iframe 스크롤 보정 |
| <code>placeholder</code> | - | 안내 글자 |
| <code>required</code> | - | 필수 |
| <code>pattern</code> | - | HTML <code>pattern</code> |
| <code>maxlength</code> | - | 최대 글자 수 |
| <code>rows</code> | - | 줄 수 (<code>multiline</code>) |

메서드: <code>setFocus()</code>, <code>getValue()</code>, <code>setClassName()</code>, <code>setCaret()</code><br>이벤트: Input 과 같음 (<code>onClick</code>, <code>onMouseDown</code>, <code>onChange</code>, <code>onKeyDown</code>)

## Input/Toggle

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>type</code> | <code>'radio'</code> | <code>radio</code>, <code>checkbox</code>, <code>switch</code> |
| <code>className</code> | <code>''</code> | <code>small</code>, <code>large</code>, <code>inline</code>, 색 이름 (앞에 <code>toggle-</code> 자동) |
| <code>checked</code> | <code>false</code> | 처음 상태 |
| <code>mixed</code> | <code>false</code> | 일부 선택 모양 (<code>checkbox</code>) |
| <code>label</code> | - | 글자 |
| <code>required</code> | - | 필수 |

메서드: <code>setFocus()</code>, <code>isChecked()</code>, <code>setCheck()</code>, <code>setMixed()</code>, <code>setLabel()</code>, <code>getLabel()</code>, <code>check()</code>, <code>uncheck()</code>, <code>setClassName()</code><br>이벤트: Input 과 같음 (<code>onClick</code>, <code>onMouseDown</code>, <code>onChange</code>, <code>onKeyDown</code>)

## Input/Select

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>options</code> | <code>[]</code> | <code>{ label, value, selected, disabled }</code> 배열 |
| <code>maxHeight</code> | <code>240</code> | 목록 최대 높이 (px) |
| <code>tooltipPosition</code> | <code>'top'</code> | 항목 툴팁 위치 |
| <code>placeholder</code> | - | 맨 위 안내 항목. <code>false</code> 면 없음 |
| <code>multiple</code> | - | 여러 개 선택 |
| <code>nativeSelect</code> | - | <code>true</code> 면 브라우저 기본 select |
| <code>showTooltips</code> | - | 항목 툴팁 |
| <code>renderTo</code> | - | 목록을 붙일 곳 |

메서드: <code>getOption()</code>, <code>getOptions()</code>, <code>remove()</code>, <code>removeOption()</code>, <code>add()</code>, <code>addOption()</code>, <code>enable()</code>, <code>disable()</code>, <code>setDisabled()</code>, <code>setPlaceholder()</code>, <code>getSelection()</code>, <code>clear()</code>, <code>select()</code>, <code>setValue()</code>, <code>getValue()</code>, <code>setClassName()</code>, <code>setSelection()</code>, <code>setFocus()</code>, <code>toggleDropdown()</code>, <code>destroy()</code><br>이벤트: <code>onChange</code>

`getValue()` 는 배열을 돌려줍니다.

## Mask

객체를 만들지 않습니다.

| 함수 | 설명 |
| --- | --- |
| <code>mask(el, text?)</code> | 가리개 (<code>div.mask</code>) + Spinner + 글자. <code>el</code> 은 UWA 요소 |
| <code>unmask(el)</code> | 제거 |
| <code>isMasked(el)</code> | <code>masked</code> 클래스가 있는지 |

## Alert

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | 추가 클래스 |
| <code>messageClassName</code> | <code>'alert-primary'</code> | 기본 메시지 색 |
| <code>animate</code> | <code>true</code> | 페이드 |
| <code>closable</code> | <code>true</code> | (읽기만 하고 쓰지 않음) |
| <code>visible</code> | <code>false</code> | 붙일 때 바로 보임 |
| <code>hideDelay</code> | <code>2000</code> | 자동 숨김까지 (ms) |
| <code>autoHide</code> | <code>false</code> | 자동 숨김 |
| <code>closeOnClick</code> | <code>true</code> | 메시지를 누르면 사라짐 |
| <code>icon</code> | <code>true</code> | 앞쪽 아이콘 |
| <code>maximumVisibleMessages</code> | <code>5</code> | 동시에 보이는 수 |
| <code>fullWidth</code> | <code>false</code> | 가로 전체 |
| <code>attributes</code> | <code>{}</code> | 바깥 요소 HTML 속성 |
| <code>messages</code> | - | 처음 메시지 |
| <code>renderTo</code> | - | 붙일 곳 |

메서드: <code>add()</code>, <code>getMessages()</code>, <code>remove()</code>, <code>toggle()</code>, <code>show()</code>, <code>hide()</code>, <code>destroy()</code><br>이벤트: <code>onShowMessage</code>, <code>onRemoveMessage</code>, <code>onClick</code>, <code>onShow</code>, <code>onHide</code>

`add` 의 메시지: 문자열 또는 `{ className, message, attributes }` (배열 가능). `message` 는 HTML 로 들어갑니다.

## Modal

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | 추가 클래스 |
| <code>animate</code> | <code>false</code> | 페이드 |
| <code>closable</code> | <code>true</code> | 닫기 아이콘 |
| <code>overlay</code> | <code>true</code> | 뒤 가리개 |
| <code>visible</code> | <code>false</code> | 붙일 때 바로 보임 |
| <code>escapeToClose</code> | <code>true</code> | Esc 로 닫기 |
| <code>header</code> | - | 머리 (문자열은 <code>h4</code>) |
| <code>body</code> | - | 본문 (문자열은 HTML) |
| <code>footer</code> | - | 바닥 |
| <code>renderTo</code> | - | 붙일 곳 |

메서드: <code>getHeader()</code>, <code>getBody()</code>, <code>getFooter()</code>, <code>setHeader()</code>, <code>setBody()</code>, <code>setFooter()</code>, <code>toggle()</code>, <code>show()</code>, <code>hide()</code>, <code>destroy()</code><br>이벤트: <code>onShow</code>, <code>onHide</code>

## SuperModal

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | 추가 클래스 |
| <code>animate</code> | <code>false</code> | 페이드 |
| <code>closable</code> | <code>true</code> | 닫기 아이콘 |
| <code>overlay</code> | <code>true</code> | 뒤 가리개 |
| <code>okButtonText</code> | - | 확인 글자 (기본: 번역 글자) |
| <code>koButtonText</code> | - | 취소 글자 (기본: 번역 글자) |
| <code>renderTo</code> | - | 붙일 곳 (기본 <code>document.body</code>) |
| <code>callback</code> | - | 콜백을 생략했을 때 쓸 기본 콜백 |

메서드: <code>alert()</code>, <code>confirm()</code>, <code>prompt()</code>, <code>dialog()</code>, <code>next()</code><br>이벤트: <code>onShowModal</code>, <code>onShow</code>, <code>onHide</code>

| 메서드 | 콜백 |
| --- | --- |
| <code>alert(message, title?, callback?, okText?)</code> | 닫힐 때 |
| <code>confirm(message, title?, callback?, okText?, koText?)</code> | <code>true</code> / <code>false</code> / X·Esc 는 <code>undefined</code> |
| <code>prompt(message, title?, callback?, okText?, koText?, placeholder?, required?, value?, maxlength?)</code> | 입력값 / <code>false</code> / <code>undefined</code> |
| <code>dialog({ title, body, buttons })</code> | 버튼마다 <code>action(modal)</code> |
| <code>next()</code> | 지금 창 닫기 |

인자 대신 `{ message, title, callback, okButtonText, koButtonText, placeholder, required, value, maxlength }` 객체 하나를 줘도 됩니다.

## Tooltip

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | 추가 클래스 |
| <code>animate</code> | <code>true</code> | 페이드 |
| <code>offset</code> | <code>{"x":0,"y":0}</code> | 어긋남 |
| <code>anchor</code> | <code>'target'</code> | 기준 |
| <code>position</code> | <code>'top'</code> | <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> 와 <code>'top right'</code> 같은 조합 |
| <code>trigger</code> | <code>'hover focus'</code> | <code>hover</code>, <code>focus</code>, <code>click</code>, <code>touch</code> (공백 구분) |
| <code>autoHide</code> | <code>true</code> | 자동 숨김 |
| <code>autoHideOnClickOutside</code> | <code>true</code> | 바깥을 누르면 닫힘 |
| <code>closeOnClick</code> | <code>false</code> | 툴팁을 누르면 닫힘 |
| <code>delay</code> | <code>{"show":500,"hide":250,"click":true}</code> | 지연 (ms) |
| <code>target</code> | - | 기준 요소 |
| <code>body</code> | - | 내용 (HTML) |
| <code>allowedPositions</code> | - | 허용 위치 배열 |

메서드: <code>getBody()</code>, <code>setBody()</code>, <code>toggle()</code>, <code>show()</code>, <code>hide()</code>, <code>destroy()</code><br>이벤트: <code>onClickOutside</code>, <code>onShow</code>, <code>onHide</code>

`new Tooltip(요소)` 처럼 요소만 주면 `{ target: 요소 }` 로 봅니다.

## Popover

`Tooltip` 을 상속합니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>position</code> | <code>'right'</code> | 위치 |
| <code>trigger</code> | <code>'click'</code> | 여는 조작 |
| <code>autoHideOnClickOutside</code> | <code>true</code> | 바깥을 누르면 닫힘 |
| <code>delay</code> | <code>false</code> | 지연 |
| <code>target</code> | - | 기준 요소 |
| <code>title</code> | - | 제목 |
| <code>body</code> | - | 내용 (HTML) |

메서드: <code>getTitle()</code>, <code>setTitle()</code>, <code>hide()</code><br>이벤트: Tooltip 과 같음

## Spinner

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>''</code> | 크기 등 |
| <code>hwaccel</code> | <code>true</code> | 하드웨어 가속 |
| <code>visible</code> | <code>false</code> | 붙일 때 바로 보임 |
| <code>spin</code> | <code>true</code> | 돌기 |
| <code>animate</code> | <code>true</code> | 페이드 |

메서드: <code>spin()</code>, <code>stop()</code>, <code>toggle()</code>, <code>show()</code>, <code>hide()</code>, <code>destroy()</code><br>이벤트: <code>onSpin</code>, <code>onSpinStop</code>, <code>onShow</code>, <code>onHide</code>

## Scroller

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>snap</code> | <code>0</code> | 스냅 간격 |
| <code>delay</code> | <code>0</code> | 지연 |
| <code>forceStopOutOfFrame</code> | <code>true</code> | 범위 밖에서 멈춤 |
| <code>element</code> | - | 스크롤할 내용 요소 |

메서드: <code>destroy()</code>, <code>scrollToElement()</code>, <code>scrollTo()</code>, <code>update()</code><br>이벤트: -

## Menu

`DropdownMenu`, `Iconbar` 가 쓰는 항목 목록입니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>multiSelect</code> | <code>false</code> | 여러 개 선택 |
| <code>attributes</code> | <code>{}</code> | HTML 속성 |
| <code>items</code> | - | 항목 배열 |

메서드: <code>hide()</code>, <code>show()</code>, <code>addItem()</code>, <code>removeItem()</code>, <code>updateItem()</code>, <code>enableItem()</code>, <code>disableItem()</code>, <code>getItem()</code>, <code>toggleSelection()</code>, <code>setHeight()</code>, <code>destroy()</code><br>이벤트: <code>onHide</code>, <code>onShow</code>

| 항목 키 | 설명 |
| --- | --- |
| <code>text</code> | 글자 |
| <code>name</code> | 구분 이름 (없으면 <code>text</code>) |
| <code>id</code> | 없으면 <code>itm-xxxxxx</code> 자동 |
| <code>fonticon</code> | 아이콘 이름 (<code>fonticon-</code> 자동) |
| <code>icon</code> | 이미지 경로 또는 클래스 |
| <code>title</code> | 툴팁 글자 |
| <code>className</code> | <code>divider</code>, <code>header</code> 는 구분선 / 머리 |
| <code>handler</code> | 누를 때 함수 |
| <code>disabled</code> / <code>selectable</code> / <code>selected</code> | 상태 |
| <code>items</code> | 하위 메뉴 (DropdownMenu) |
| <code>index</code> | 넣을 위치 (1 부터) |

`getItem(키)` 의 키는 위치, `id`, `name` 모두 됩니다.

## DropdownMenu

`Menu` 와 `Dropdown` 을 합친 것입니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>subMenuMaxDepth</code> | <code>20</code> | 하위 메뉴 깊이 |
| <code>maxItemsBeforeScroll</code> | <code>12</code> | 이 수를 넘으면 스크롤 |
| <code>responsiveMode</code> | <code>true</code> | 좁은 화면 모드 |
| <code>responsiveItemsWithSubMenusDivided</code> | <code>false</code> | 좁은 화면에서 하위 메뉴 분리 |
| <code>scrollMode</code> | <code>true</code> | 스크롤 사용 |
| <code>zindex</code> | <code>1000</code> | z-index |
| <code>scrollableResponsive</code> | <code>false</code> | 좁은 화면 스크롤 |
| <code>target</code> | - | 여는 요소 |
| <code>items</code> | - | 항목 배열 |
| <code>bound</code> | - | <code>target</code> 클릭으로 열고 닫기 (Dropdown 기본 <code>true</code>) |
| <code>contextual</code> | - | 오른쪽 클릭 메뉴 |
| <code>closeOnClick</code> | - | 항목을 누르면 닫힘 (Dropdown 기본 <code>true</code>) |
| <code>position</code> | - | 위치 (Dropdown 기본 <code>'bottom left'</code>) |

메서드: <code>addItem()</code>, <code>removeItem()</code>, <code>updateItem()</code>, <code>enableItem()</code>, <code>disableItem()</code>, <code>getItem()</code>, <code>show()</code>, <code>hide()</code>, <code>getSelectedItems()</code>, <code>isSelected()</code>, <code>toggleSelection()</code>, <code>destroy()</code><br>이벤트: <code>onClick</code>

`onClick` 인자는 `(e, item, keepOpen)` 입니다.

## Iconbar

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>items</code> | - | 항목 배열 (Menu 항목 키) |
| <code>tooltipsPosition</code> | - | 툴팁 위치 (기본 <code>'top'</code>) |
| <code>tooltipsTrigger</code> | - | 툴팁 조작 (기본 <code>'hover focus'</code>) |
| <code>renderTo</code> | - | 붙일 곳 |

메서드: <code>show()</code>, <code>getItem()</code>, <code>addItem()</code>, <code>enableItem()</code>, <code>disableItem()</code>, <code>isInjected()</code>, <code>select()</code>, <code>destroy()</code><br>이벤트: <code>onClick</code>

`onClick` 인자는 `(e, item)`, 항목의 `handler` 는 `(e, item)` 입니다.

## Form

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>className</code> | <code>'form-vertical'</code> | <code>form-vertical</code> 등 |
| <code>fields</code> | <code>[]</code> | 필드 정의 배열 |
| <code>buttons</code> | <code>[]</code> | 버튼 정의 배열 |
| <code>labelSuffix</code> | <code>''</code> | 라벨 뒤 글자 |
| <code>grid</code> | <code>'2 10'</code> | 라벨 / 입력 칸 비율 (12 단위) |
| <code>autocomplete</code> | <code>false</code> | 브라우저 자동 완성 |
| <code>method</code> | <code>'POST'</code> | <code>url</code> 로 보낼 때 방식 |
| <code>encoding</code> | <code>'application/x-www-form-urlencoded'</code> | <code>url</code> 로 보낼 때 형식 |
| <code>spellcheck</code> | <code>true</code> | 맞춤법 검사 |
| <code>url</code> | - | 주면 숨은 iframe 으로 실제 전송 |
| <code>novalidate</code> | - | 검사 없이 제출 |

메서드: <code>getFields()</code>, <code>getField()</code>, <code>unvalidate()</code>, <code>validate()</code>, <code>submit()</code>, <code>getAllInputInstances()</code>, <code>setDisabled()</code>, <code>enable()</code>, <code>disable()</code>, <code>reset()</code>, <code>getValues()</code>, <code>getValue()</code>, <code>setValues()</code>, <code>setValue()</code>, <code>setClassName()</code><br>이벤트: <code>onSubmit</code>, <code>onReset</code>, <code>onChange</code>

필드 `type`: `text`, `textarea`, `email`, `url`, `tel`, `password`, `number`, `range`, `select`, `checkbox`, `radio`, `date`, `file`, `autocomplete`, `html`, `hidden`. 버튼 `type`: `submit`, `reset`, 그 밖은 `button`.
