# UIKIT <Badge type="info" text="원본 분석" />

`DS/UIKIT/*` 는 UWA 컨트롤(`UWA/Controls/Abstract`) 위에 만든 Bootstrap 모양의 부품입니다. 옵션은 `this.options` 에 저장되고, 화면은 메서드(`setValue`, `show`, `hide` ...)로 바꿉니다. 이벤트 이름은 `onClick` 처럼 `on` 으로 시작합니다.

새 화면은 [WebUX 컨트롤](/controls/webux-controls) 을 권장합니다 ([무엇을 쓸까](/controls/#무엇을-쓸까)). 이 페이지는 기존 코드를 읽고 고칠 때, 그리고 `Mask` / `Alert` 처럼 간단한 부품을 쓸 때를 위한 것입니다.

샘플: [03_feedback.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/ControlsSample/03_feedback.html)

::: info 근거
UIKIT.js 의 Mask, Input, Input/Button, Input/Text, Input/Toggle, Input/Select, Alert, Modal, SuperModal, Tooltip, Popover, Spinner, Scroller, Menu, Dropdown, DropdownMenu, Iconbar, Form. UIKIT.css 의 `.alert`, `.masked`, `.mask`. UWA2/js/Controls/Abstract.js. 호출부: `Mask.mask(this.contentDiv)` 50 건, `t.mask(widget.body)` 11 건, Alert `.add({ className: "error", message ... })` 65 건
:::

## 공통 사용법

```js
require(['DS/UIKIT/Input/Button'], function (Button) {
  var btn = new Button({
    value: '저장',
    className: 'primary',
    icon: 'floppy',
    events: {
      onClick: function (e) { console.log('저장'); }
    }
  }).inject(document.getElementById('buttons'));

  btn.addEvent('onClick', function () { console.log('두 번째 리스너'); });
  btn.setValue('수정');
  btn.disable();
});
```

| 할 일 | 코드 |
| --- | --- |
| 만들기 | `new X({ ... })`. 옵션은 `defaultOptions` 와 깊게 합쳐짐 |
| 이벤트 등록 | 옵션의 `events: { onXxx: fn }` 또는 `x.addEvent('onXxx', fn)` |
| 붙이기 | `x.inject(parent, where?)`. 많은 부품이 `renderTo: 요소` 옵션도 받음 |
| 화면 요소 | `x.getContent()` |
| 정리 | `x.destroy()` |

옵션, 이벤트의 동작(깊은 합치기, `dispatchEvent` 인자 펼치기)은 [UWA 클래스](/uwa/class#options) 와 같습니다.

::: warning 이벤트 이름은 on 으로 시작합니다
UIKIT 컨트롤의 `addEvent` 는 `'onClick'`, `'onChange'` 처럼 씁니다. 요소의 `addEvent('click')` 과 반대입니다 ([UWA DOM](/uwa/element#이벤트)). `addEventListener` 는 없습니다.
:::

## Mask

영역 위에 반투명 가리개와 스피너, 글자를 띄웁니다. 객체를 만들지 않고 함수만 씁니다.

```js
require(['DS/UIKIT/Mask'], function (Mask) {
  Mask.mask(widget.body, '불러오는 중...');
  load().then(function () {
    Mask.unmask(widget.body);
  });
});
```

| 함수 | 설명 |
| --- | --- |
| `mask(el, text?)` | 가리개 표시. `text` 생략 시 번역된 "Loading". 이미 가려져 있으면 지우고 다시 만듦 |
| `unmask(el)` | 가리개 제거 |
| `isMasked(el)` | 가려져 있는지 (`masked` 클래스) |

- `el` 은 **UWA 요소** 여야 합니다 (`addClassName`, `getElement` 를 씀). `document.getElementById` 로 얻은 요소는 `UWA.extendElement(el)` 로 감쌉니다 ([UWA DOM](/uwa/element#다른-방법으로-얻은-요소)).
- `.masked` 클래스가 `position: relative` 를 강제하므로 대상 위치를 따로 정하지 않아도 됩니다.
- 횟수를 세지 않습니다. 두 곳에서 `mask` 하고 한 곳에서 `unmask` 하면 바로 사라집니다. 횟수가 필요하면 WebUX [ModalLoader](/controls/webux-controls#loader-modalloader) 를 씁니다.

## Input/Button

```js
var btn = new Button({ value: '삭제', className: 'error small', icon: 'trash' }).inject(el);
btn.load(true, '삭제 중...');    // 글자를 바꾸고 비활성
btn.load(false);                 // 원래대로
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | <code>''</code> | 글자 |
| <code>className</code> | <code>'btn-default'</code> | <code>primary</code>, <code>default</code>, <code>info</code>, <code>warning</code>, <code>error</code>, <code>success</code>, <code>link</code>, <code>block</code>, 크기 <code>small</code>, <code>large</code>, <code>xsmall</code>. 앞에 <code>btn-</code> 이 자동으로 붙음 |
| <code>icon</code> | - | 아이콘 이름. <code>fonticon-</code> 가 자동으로 붙음. <code>'floppy right'</code> 처럼 위치 지정 |
| <code>active</code> | <code>false</code> | 눌린 모양 |
| <code>disabled</code> | <code>false</code> | 비활성 |
| <code>dropdown</code> | - | DropdownMenu 옵션. 누르면 메뉴 |
| <code>rounded</code> <Badge type="warning" text="2026" /> | <code>false</code> | 둥근 모양 |

메서드: `setValue(t)`, `getValue()`, `setIcon(name)`, `removeIcon()`, `setActive(b)`, `toggleActive()`, `isActive()`, `load(b, text?)`, `setClassName(c)`, `setDisabled(b)`, `enable()`, `disable()`, `focus()`.

이벤트: `onClick`, `onMouseDown`, `onChange`, `onKeyDown` (Input 공통).

2026 에는 아이콘만 있는 둥근 버튼 `DS/UIKIT/Input/IconButton` <Badge type="warning" text="2026" /> 이 추가되었습니다 (기본 `className: 'lite'`, `rounded: true`).

## Input/Text

```js
var title = new Text({ placeholder: '품명', required: true, maxlength: 40 }).inject(el);
title.addEvent('onChange', function () { console.log(title.getValue()); });
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | <code>''</code> | 값 |
| <code>placeholder</code>, <code>required</code>, <code>pattern</code>, <code>maxlength</code> | - | 같은 이름의 HTML 속성으로 들어감 |
| <code>multiline</code> | <code>false</code> | <code>textarea</code> (<code>rows</code> 사용) |
| <code>name</code>, <code>id</code> | - | 입력칸 속성 |
| <code>attributes</code> | <code>{}</code> | 그 밖의 HTML 속성 |
| <code>className</code> | <code>''</code> | <code>input-sm</code> 등 |

`onChange` 는 브라우저 `change`(포커스가 빠질 때) 입니다. 타이핑마다 받으려면 `title.getContent().addEvent('input', fn)` 처럼 요소 이벤트를 씁니다. `Input/Password` 는 같은 사용법에 `type="password"` 입니다.

## Input/Toggle

```js
var useFlag = new Toggle({ type: 'switch', label: '사용', checked: true }).inject(el);
useFlag.addEvent('onChange', function () { console.log(useFlag.isChecked()); });
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>type</code> | <code>'radio'</code> | <code>radio</code>, <code>checkbox</code>, <code>switch</code> |
| <code>label</code> | - | 글자 |
| <code>checked</code> | <code>false</code> | 처음 상태 |
| <code>mixed</code> | <code>false</code> | 일부 선택 모양 (<code>checkbox</code> 만) |
| <code>name</code> | - | 라디오 묶음 이름 |

::: warning 기본 type 은 radio 입니다
`type` 을 빼면 라디오가 됩니다. 체크박스는 `type: 'checkbox'` 를 꼭 씁니다.
:::

메서드: `isChecked()`, `check()`, `uncheck()`, `setCheck(b)`, `setMixed(b)`, `setLabel(t)`, `getLabel()`.

## Input/Select

```js
var state = new Select({
  placeholder: '상태 선택',
  options: [
    { label: '작업중', value: 'WIP' },
    { label: '승인', value: 'RELEASED', selected: true }
  ]
}).inject(el);

state.addEvent('onChange', function () {
  console.log(state.getValue());   // ['RELEASED']
});
state.setValue('WIP');
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>options</code> | <code>[]</code> | <code>{ label, value, selected, disabled }</code> 배열. <code>value</code> 를 빼면 <code>label</code> 이 값 |
| <code>placeholder</code> | - | 맨 위 안내 항목 (값 <code>''</code>). <code>false</code> 면 없음 |
| <code>multiple</code> | <code>false</code> | 여러 개 선택 |
| <code>nativeSelect</code> | <code>false</code> | <code>true</code> 면 브라우저 기본 <code>select</code> |
| <code>maxHeight</code> | <code>240</code> | 목록 최대 높이 |
| <code>showTooltips</code> | - | 항목에 툴팁 |

- `getValue()` 는 **배열** 을 돌려줍니다. 하나만 고르는 목록도 `getValue()[0]` 로 읽습니다.
- `placeholder` 를 주지 않아도 `false` 가 아니면 빈 안내 항목이 맨 위에 들어갑니다.
- `setValue(v)`, `select(...)` 처럼 코드로 바꿔도 `onChange` 가 발생합니다.

메서드: `add(opts)`, `addOption(opt)`, `remove(v)`, `getOption(v)`, `getOptions()`, `getSelection()`, `clear()`, `setValue(v)`, `getValue()`, `setPlaceholder(t)`, `setDisabled(b)`.

## Alert

화면 위쪽에 쌓이는 메시지 띠입니다.

```js
require(['DS/UIKIT/Alert'], function (Alert) {
  var alert = new Alert({ visible: true, autoHide: true, hideDelay: 3000 })
    .inject(widget.body, 'top');

  alert.add({ className: 'success', message: '저장했습니다.' });
  alert.add({ className: 'error', message: '권한이 없습니다.' });
});
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>visible</code> | <code>false</code> | <code>true</code> 가 아니면 <code>show()</code> 를 불러야 보임 |
| <code>autoHide</code> | <code>false</code> | <code>hideDelay</code> 후 자동으로 사라짐 (마우스를 올리면 멈춤) |
| <code>hideDelay</code> | <code>2000</code> | ms |
| <code>closeOnClick</code> | <code>true</code> | 메시지를 누르면 사라짐 |
| <code>messageClassName</code> | <code>'alert-primary'</code> | 기본 색 |
| <code>maximumVisibleMessages</code> | <code>5</code> | 동시에 보이는 수. 넘는 것은 대기 |
| <code>icon</code> | <code>true</code> | 앞쪽 아이콘 |
| <code>fullWidth</code> | <code>false</code> | 가로 전체 |
| <code>messages</code> | - | 처음 메시지 |

- `add(메시지)` 의 메시지는 문자열 또는 `{ className, message, attributes }` 입니다. 배열도 됩니다.
- `className`: `primary`, `success`, `warning`, `error`. `info`, `default` 는 `primary` 로 바뀝니다.
- `message` 는 **HTML 로 해석** 됩니다. 서버 메시지나 사용자 입력은 이스케이프해서 넣습니다.
- `.alert` 는 높이 1px 짜리 기준선이고 메시지가 그 아래로 겹쳐 뜹니다. 보통 영역 맨 위(`'top'`)에 붙입니다.

::: warning closable: false 는 효과가 없습니다
옵션에 `closable` 이 있지만 코드는 값을 읽기만 하고 닫기 아이콘을 항상 붙입니다 (2025 기준).
:::

이벤트: `onShowMessage(el)`, `onRemoveMessage(el)`, `onClick(e, el)`, `onShow`, `onHide`. 메서드: `add`, `remove(el)`, `getMessages()`, `show()`, `hide()`, `toggle()`.

같은 일을 WebUX 로 하려면 [알림 메시지](/controls/notifications) 를 씁니다.

## Modal

머리, 본문, 바닥으로 된 모달 창입니다.

```js
require(['DS/UIKIT/Modal', 'DS/UIKIT/Input/Button'], function (Modal, Button) {
  var ok = new Button({ value: '확인', className: 'primary' });
  var modal = new Modal({
    header: '속성',
    body: '<p>내용</p>',
    footer: [ok],
    renderTo: widget.body
  });
  ok.addEvent('onClick', function () { modal.hide(); });
  modal.addEvent('onHide', function () { modal.destroy(); });
  modal.show();
});
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>header</code> | - | 문자열(<code>h4</code> 로 감쌈) 또는 요소 |
| <code>body</code> | - | 내용 (문자열은 HTML) |
| <code>footer</code> | - | 바닥 내용 (버튼 배열 등) |
| <code>closable</code> | <code>true</code> | 머리의 닫기 아이콘 |
| <code>overlay</code> | <code>true</code> | 뒤 가리개 |
| <code>escapeToClose</code> | <code>true</code> | Esc 로 닫기 |
| <code>visible</code> | <code>false</code> | 붙일 때 바로 보임 |
| <code>animate</code> | <code>false</code> | 페이드 |
| <code>renderTo</code> | - | 붙일 곳. 가리개도 여기에 붙음 |

- `inject` 또는 `renderTo` 로 붙인 뒤 `show()` 해야 보입니다.
- `hide()` 는 숨기기만 합니다. 다시 쓰지 않으면 `destroy()` 합니다.

메서드: `show()`, `hide()`, `toggle()`, `setHeader(c)`, `setBody(c)`, `setFooter(c)`, `getHeader()`, `getBody()`, `getFooter()`. 이벤트: `onShow`, `onHide`.

## SuperModal

알림 / 확인 / 입력 받기를 한 줄로 띄웁니다. 창은 닫힐 때 자동으로 정리됩니다.

```js
require(['DS/UIKIT/SuperModal'], function (SuperModal) {
  var sm = new SuperModal({ renderTo: widget.body });

  sm.alert('저장했습니다.', '완료');
  sm.confirm('삭제할까요?', '삭제', function (ok) { console.log(ok); });
  sm.prompt('새 이름', '이름 바꾸기', function (value) { console.log(value); });
  sm.dialog({
    title: '선택',
    body: '<p>어느 쪽으로 할까요?</p>',
    buttons: [
      { value: '저장', className: 'primary', action: function (modal) { modal.hide(); } },
      { value: '취소', action: function (modal) { modal.hide(); } }
    ]
  });
});
```

| 메서드 | 인자 | 콜백 값 |
| --- | --- | --- |
| `alert(message, title?, callback?, okText?)` | 또는 `{ message, title, callback, okButtonText }` | 닫힐 때 인자 없이 |
| `confirm(message, title?, callback?, okText?, koText?)` | 또는 `{ ..., koButtonText }` | 확인 `true`, 취소 `false`, X / Esc 는 `undefined` |
| `prompt(message, title?, callback?, okText?, koText?, placeholder?, required?, value?, maxlength?)` | 또는 같은 키의 객체 | 확인: 입력값, 취소: `false`, X / Esc: `undefined` |
| `dialog({ title, body, buttons })` | `buttons`: Input/Button 옵션 + `action(modal)` | - |

- `message` 는 글자(`text`)로 들어가 안전합니다. `dialog` 의 `body` 는 HTML 입니다.
- 열려 있는 창이 있으면 다음 창은 줄을 서서 앞 창이 닫힌 뒤에 뜹니다. 이 대기열은 **모든 SuperModal 객체가 함께 씁니다**.
- `dialog` 의 버튼은 누르면 `action` 만 부릅니다. 닫으려면 `modal.hide()` 를 부릅니다.

이벤트: `onShow`, `onHide`.

## Tooltip, Popover

```js
require(['DS/UIKIT/Tooltip', 'DS/UIKIT/Popover'], function (Tooltip, Popover) {
  new Tooltip({ target: btn.getContent(), body: '변경 내용을 저장합니다', position: 'bottom' });

  new Popover({ target: infoIcon, title: '상태', body: '<p>승인 후에는 수정할 수 없습니다.</p>' });
});
```

| 옵션 | Tooltip 기본값 | Popover 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>target</code> | - | - | 기준 요소 |
| <code>body</code> | - | - | 내용 (HTML) |
| <code>title</code> | - | - | 제목 (Popover) |
| <code>position</code> | <code>'top'</code> | <code>'right'</code> | <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code>, <code>'top right'</code> 같은 조합 |
| <code>trigger</code> | <code>'hover focus'</code> | <code>'click'</code> | 여는 조작 |
| <code>delay</code> | <code>{ show: 500, hide: 250 }</code> | <code>false</code> | 지연 (ms) |
| <code>autoHideOnClickOutside</code> | <code>true</code> | <code>true</code> | 바깥을 누르면 닫힘 |

메서드: `show()`, `hide()`, `toggle()`, `setBody(c)`, `getBody()`, `setTitle(t)` (Popover), `destroy()`. 이벤트: `onShow`, `onHide`, `onClickOutside`.

WebUX 컨트롤에는 `tooltipInfos` 를 쓰는 편이 간단합니다 ([툴팁](/controls/webux-controls#툴팁)).

## Spinner

```js
var spinner = new Spinner({ visible: true }).inject(el);
spinner.hide();
spinner.show();
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>visible</code> | <code>false</code> | 붙일 때 바로 보임 |
| <code>spin</code> | <code>true</code> | 돌기 |
| <code>className</code> | <code>''</code> | 크기 등 |

메서드: `show()`, `hide()`, `toggle()`, `spin()`, `stop()`. 이벤트: `onShow`, `onHide`, `onSpin`, `onSpinStop`. Mask 안에 들어가는 것도 이 Spinner 입니다.

## Scroller

내용 요소에 UIKIT 모양 스크롤바를 붙입니다.

```js
var list = UWA.createElement('div', { html: items });
new Scroller({ element: list }).inject(container);
```

`element` 가 스크롤될 내용입니다. 메서드: `scrollTo(x, y)`, `scrollToElement(el)`, `update()` (내용 크기가 바뀐 뒤).

## DropdownMenu

```js
require(['DS/UIKIT/DropdownMenu'], function (DropdownMenu) {
  var menu = new DropdownMenu({
    target: btn.getContent(),
    items: [
      { text: '편집', fonticon: 'pencil', name: 'edit' },
      { text: '삭제', fonticon: 'trash', name: 'delete', handler: function () { console.log('삭제'); } },
      { className: 'divider' },
      { text: '내보내기', items: [ { text: 'CSV', name: 'csv' }, { text: 'Excel', name: 'xlsx' } ] }
    ],
    events: {
      onClick: function (e, item) { console.log(item.name); }
    }
  });
});
```

| 항목 키 | 설명 |
| --- | --- |
| `text` | 글자 |
| `name` | 구분 이름 (없으면 `text`) |
| `fonticon` | 아이콘 이름 (`fonticon-` 자동) |
| `icon` | 이미지 경로 또는 클래스 |
| `handler` | 누를 때 (`this` 는 메뉴) |
| `disabled`, `selectable`, `selected` | 상태 |
| `items` | 하위 메뉴 |
| `className: 'divider'` | 구분선 |

- `target` 을 누르면 열리고 닫힙니다 (`bound: true` 기본). 오른쪽 클릭 메뉴는 `contextual: true` 입니다.
- 항목을 누르면 `onClick(e, item)` 과 `item.handler(e)` 가 모두 불립니다.

메서드: `show()`, `hide()`, `addItem(item)`, `removeItem(name)`, `enableItem(name)`, `disableItem(name)`, `getItem(name)`, `getSelectedItems()`.

## Iconbar

아이콘 버튼을 가로로 늘어놓은 툴바입니다. 넘치는 항목은 `...` 메뉴로 들어갑니다.

```js
var bar = new Iconbar({
  items: [
    { name: 'add', text: '추가', fonticon: 'plus' },
    { name: 'search', text: '검색', fonticon: 'search' },
    { name: 'settings', text: '설정', fonticon: 'cog', disabled: true }
  ],
  events: { onClick: function (e, item) { console.log(item.name); } }
}).inject(el);
```

- 항목 키는 DropdownMenu 와 같습니다. `text` 는 글자 대신 툴팁으로 들어갑니다 (`tooltipsPosition` 기본 `'top'`).
- 메서드: `addItem(item)`, `enableItem(name)`, `disableItem(name)`, `getItem(name)`, `select(name)`.

## Form

필드 정의로 폼 전체를 만듭니다.

```js
require(['DS/UIKIT/Form'], function (Form) {
  var form = new Form({
    fields: [
      { type: 'text', name: 'partNo', label: '품번', required: true, placeholder: 'PRT-0000' },
      { type: 'select', name: 'state', label: '상태', options: [ { label: '작업중', value: 'WIP' }, { label: '승인', value: 'RELEASED' } ] },
      { type: 'checkbox', name: 'useFlag', label: '사용' }
    ],
    buttons: [ { type: 'submit', value: '저장' } ],
    events: {
      onSubmit: function (values) { console.log(values); }
    }
  }).inject(el);
});
```

| `type` | 만드는 것 |
| --- | --- |
| `text`, `textarea`, `email`, `url`, `tel` | Input/Text |
| `password` | Input/Password |
| `number`, `range` | Input/Number, 범위 |
| `select` | Input/Select |
| `checkbox`, `radio` | Input/Toggle |
| `date` | Input/Date |
| `file` | Input/File |
| `autocomplete` | Autocomplete |
| `html` | 그대로 넣을 내용 |
| `hidden` | 숨은 값 |
| 그 밖 | `text` 로 바뀜 |

- 필드 키: `name`, `label`, `value`, `required`, `placeholder`, `helperText`, `errorText`, `className`, 타입별 옵션.
- `buttons` 의 `type`: `submit`, `reset`, 그 밖은 `button`.
- 저장 버튼을 누르면 `validate()` 를 통과할 때만 `onSubmit(값 객체)` 이 불립니다. 값 객체는 `getValues()` 와 같습니다.
- `checkbox` 값은 `'true'` / `'false'` **문자열** 입니다.

메서드: `getValues()`, `getValue(name)`, `setValues(obj)`, `setValue(name, v)`, `getField(name)`, `validate()`, `submit()`, `reset()`, `setDisabled(b)`. 이벤트: `onSubmit`, `onReset`, `onChange`.
