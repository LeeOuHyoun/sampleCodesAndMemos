# DOM (Element, Event) <Badge type="info" text="원본 분석" />

`UWA.createElement` 로 요소를 만들고, UWA 가 요소에 붙여 주는 메서드(`inject`, `addEvent`, `setStyles` ...)로 다룹니다. jQuery 처럼 감싼 객체가 아니라 **브라우저 요소에 메서드를 직접 붙이는** 방식입니다.

샘플: [01_element.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/01_element.html)

::: info 근거
UWA2/js/Element.js, Event.js, Dispatcher.js. 호출부: `UWA.createElement(` 5,288 건 / 284 파일. 예: CfgConfigurationContextUX, CfgAuthoringContextUX, SocialToolbar
:::

## createElement

```js
require(['UWA/Core', 'UWA/Element'], function (UWA) {
  var box = UWA.createElement('div', {
    'class': 'part-box',
    styles: { padding: 8, border: '1px solid #ccc' },
    html: [
      { tag: 'h4', text: 'PRT-0001' },
      { tag: 'span', 'class': 'state', text: '작업중' },
      { tag: 'button', text: '승인', events: { click: function () { console.log('승인'); } } }
    ]
  }).inject(document.body);
});
```

- 돌려받는 것은 메서드가 붙은 **진짜 DOM 요소** 입니다. `box.appendChild` 같은 기본 기능도 그대로 씁니다.
- `UWA/Element` 를 불러야 `UWA.createElement` 가 생깁니다. 보통 `UWA/Core` 와 함께 불러 둡니다.

### 옵션 키

| 키 | 동작 |
| --- | --- |
| `'class'` | 클래스 (덮어쓰기). 예약어라 따옴표로 감쌈 |
| `id`, `value` | 속성 그대로 |
| `text` | 글자 (HTML 로 해석 안 함) |
| `html` | 문자열이면 innerHTML, 배열 / 객체면 자식 요소 |
| `content` | 자식 요소 (배열 / 요소 / 객체) |
| `styles` | `{ padding: 8, 'z-index': 2 }`. 숫자에는 `px` 가 자동으로 붙음 (`zIndex`, `opacity`, `flex`, `lineHeight` 등 제외) |
| `events` | `{ click: fn, mouseover: fn }` |
| `attributes` | `{ 'data-id': 'P1', role: 'button' }` |
| `data` | `{ id: 'P1' }` → `data-*` 에 JSON 으로 저장 |
| `checked`, `disabled`, `readOnly`, `selected`, `multiple` ... | boolean 속성 |
| 그 밖의 키 (`title`, `src`, `href`, `type`, `for` ...) | `setAttribute(키, 값)` |

자식 요소는 `html` / `content` 배열 안에 아래 형태로 섞어 넣습니다.

| 넣는 것 | 결과 |
| --- | --- |
| `{ tag: 'span', ...옵션 }` | 요소 생성 (`tag` 생략 시 `div`) |
| DOM 요소 | 그대로 붙임 |
| `inject` 가 있는 객체 (UWA 컨트롤, WebUX 컨트롤) | `obj.inject(...)` 로 붙임 |
| 문자열 | `<` 나 `&amp;` 같은 엔티티가 있으면 HTML, 없으면 글자 |

::: warning 동작하지 않는 키
옵션 키는 `set + 키이름` 메서드 → 내장 키 → `setAttribute` 순서로 처리됩니다. 그래서 아래 키는 오류 없이 **조용히 잘못 동작** 합니다. 실제 ENOVIA 코드에도 이런 사례가 있습니다.

| 잘못 쓴 키 | 결과 | 바른 키 |
| --- | --- | --- |
| `className` | `className="..."` 라는 속성만 생기고 클래스는 안 붙음 | `'class'` |
| `style: { ... }` 또는 `style: '...'` | 무시됨 | `styles: { ... }` |
| `textContent`, `innerHTML` | 속성으로 들어감 | `text`, `html` |
| `children` | 속성으로 들어감 | `html: [ ... ]` |
| `position` | 위치 계산 함수(`setPosition`)가 불림 | `styles: { position: ... }` |
| `width` (div 등) | 속성이라 효과 없음 (img, td 는 동작) | `styles: { width: ... }` |
:::

::: danger 사용자 입력은 text 로
`html` 문자열과 `setContent` / `addContent` 의 문자열은 HTML 로 해석됩니다. 서버 데이터나 사용자 입력은 `text` / `setText` 로 넣습니다.
:::

## 요소 메서드

`UWA.createElement` 로 만든 요소, `getElement(s)` 로 찾은 요소에 붙어 있습니다. ✓ 는 자기 자신을 돌려줘서 이어 쓸 수 있는 메서드입니다.

### 넣기, 빼기

| 메서드 | 설명 | |
| --- | --- | --- |
| `inject(target, where?)` | `where`: `'bottom'` (기본), `'top'`, `'before'`, `'after'`. target 은 DOM 요소 | ✓ |
| `grab(el, where?)` | `inject` 의 반대 방향 | ✓ |
| `remove()` | 화면에서 떼기만 함. 이벤트는 남음 | ✓ |
| `destroy()` | 자신과 하위 요소의 UWA 이벤트를 지우고 뗌 | - |
| `empty(destroyChildren?)` | 자식 비우기. `true` 면 자식을 destroy | ✓ |
| `isInjected()` | 문서에 붙어 있는지 | - |

### 내용

| 메서드 | 설명 | |
| --- | --- | --- |
| `setText(t)` / `appendText(t)` / `getText()` | 글자 | ✓ |
| `setHTML(s)` / `getHTML()` | innerHTML | ✓ |
| `setContent(...)` / `addContent(...)` | 내용 교체 / 추가. 인자는 위 자식 요소 형태 | ✓ |
| `set(key, value)` / `set(obj)` | `createElement` 옵션과 같은 규칙 | ✓ |
| `setAttributes(obj)` | 속성 여러 개 | ✓ |
| `setData(k, v)` / `getData(k)` / `removeData(k)` | `data-*` 에 JSON 으로 저장 / 읽기 | ✓ |

### 찾기

| 메서드 | 설명 |
| --- | --- |
| `getElement(sel)` | 첫 번째 (없으면 `null`) |
| `getElements(sel)` | 배열 |
| `getParent(sel?)` / `getParents(sel?)` / `getClosest(sel)` | 부모 / 조상 / 자신 포함 가장 가까운 것 |
| `getChildren()` | 자식 요소 |
| `match(sel)` | 선택자와 맞는지 |

`getElement('> .child')` 처럼 `>` 로 시작하는 선택자도 됩니다.

### 클래스, 스타일, 표시

| 메서드 | 설명 | |
| --- | --- | --- |
| `addClassName` / `removeClassName` / `toggleClassName(c, force?)` / `hasClassName` | 클래스 | ✓ |
| `setStyle(name, v)` / `setStyles(obj)` | 스타일. 숫자에 `px` 자동 | ✓ |
| `getStyle(name)` / `getStyles([...])` | 계산된 스타일 | - |
| `show()` / `hide()` / `toggle(force?)` / `isHidden()` | 표시 | ✓ |
| `getSize()` | `{ width, height }` | - |
| `getDimensions()` / `getOffsets()` / `getPosition()` / `getScrolls()` | 크기, 위치 | - |

`removeClassName` 은 같은 클래스가 여러 번 들어 있으면 첫 번째만 지웁니다.

## 이벤트

```js
box.addEvent('click', function (e) {
  console.log(this, e.target);
});

list.addEvent('click .item', function (e) {
  var item = UWA.Event.getElement(e);
  console.log(item.getData('id'));
});

box.removeEvent('click', handler);
```

| 메서드 | 설명 |
| --- | --- |
| `addEvent(type, fn, forceNative?, priority?)` | 등록. `'click .selector'` 처럼 쓰면 하위 요소 위임 |
| `addEvents({ click: fn, ... })` | 여러 개 |
| `removeEvent(type?, fn?)` / `removeEvents()` | 해제. 인자 없으면 전부 |
| `triggerEvent(type)` | UWA 로 등록한 핸들러만 직접 실행 (버블링, 기본 동작 없음) |

- 핸들러는 브라우저 이벤트 객체를 그대로 받고, `this` 는 요소입니다.
- 같은 함수를 두 번 등록해도 한 번만 실행됩니다.
- 핸들러가 `false` 를 돌려주면 같은 요소의 나머지 핸들러만 멈춥니다. `preventDefault` 는 되지 않으므로 직접 부릅니다.

::: warning 'onClick' 이 아니라 'click'
요소의 `addEvent` 는 이름을 바꾸지 않습니다. `el.addEvent('onClick', fn)` 은 존재하지 않는 `onClick` 이벤트를 기다리므로 실행되지 않습니다.

`onClick`, `onReady` 처럼 `on` 이 붙은 이름은 UWA 클래스 이벤트(컨트롤, View, Model 의 `addEvent`)에서 씁니다. 같은 `addEvent` 라도 **요소는 `click`, 컨트롤은 `onClick`** 입니다. [클래스 이벤트](/uwa/class#events)
:::

### UWA.Event

이벤트 객체를 다루는 함수 모음입니다. 이벤트 객체에 메서드가 붙지는 않으므로 `UWA.Event.stop(e)` 처럼 부릅니다.

| 함수 | 설명 |
| --- | --- |
| `stop(e)` | `preventDefault` + `stopPropagation` |
| `preventDefault(e)` / `stopPropagation(e)` | 각각 |
| `getElement(e)` | 이벤트가 난 요소 (위임이면 선택자에 맞은 요소). UWA 메서드가 붙은 상태로 돌려줌 |
| `findElement(e, sel)` | 이벤트 요소에서 위로 올라가며 선택자에 맞는 요소 |
| `getPosition(e)` | 마우스 / 터치 좌표 |
| `whichButton(e)` | `0` 왼쪽, `1` 가운데, `2` 오른쪽 |
| `whichKey(e)` | `'ctrl+s'`, `'esc'` 같은 문자열 |
| `wheelDelta(e)` | 휠 방향 |
| `dispatchEvent(el, type, props)` | 진짜 브라우저 이벤트를 만들어 발생 |
| `onDomReady(fn)` | 문서 준비 후 실행 |

### UWA 가 따로 만드는 이벤트

| 이벤트 | 내용 |
| --- | --- |
| `mouseenter` / `mouseleave` | mouseover / mouseout 으로 흉내. 핸들러가 받는 것은 `{ target, type }` 만 있는 객체 |
| `resize` (요소) | 200ms 마다 크기를 확인하는 방식 |
| `update` | 자식 요소 변경 (MutationObserver) |
| `mousewheel` | 휠 방향을 `e.wheel` 로 맞춰 줌 |

브라우저 기본 이벤트를 받으려면 세 번째 인자에 `true` 를 줍니다 (`addEvent('mouseenter', fn, true)`).

::: warning 요소 resize 이벤트는 꼭 해제합니다
요소 `resize` 는 타이머로 크기를 계속 확인합니다. `destroy()` 나 `removeEvent('resize')` 없이 화면에서만 떼면 타이머가 계속 돌고 메모리도 남습니다. 화면을 닫을 때는 `remove()` 대신 `destroy()` 를 씁니다.
:::

## 다른 방법으로 얻은 요소

`document.querySelector`, `e.target` 으로 얻은 요소에는 UWA 메서드가 없습니다. 메서드가 필요하면 붙입니다.

```js
var el = UWA.extendElement(document.getElementById('grid'));
el.addClassName('ready');
```

메서드를 붙이지 않고 한 번만 쓰려면 `UWA.Element.addClassName.call(node, 'ready')` 처럼 부를 수도 있습니다.
