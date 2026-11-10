# 클래스 (UWA/Class) <Badge type="info" text="원본 분석" />

ENOVIA 화면 코드 대부분이 `UWA/Class` 로 클래스를 만듭니다. `extend` 로 상속하고, `init` 이 생성자, `this._parent()` 가 부모 메서드 호출입니다. 옵션, 이벤트, 타이머 같은 기능은 mixin 으로 섞어 넣습니다.

샘플: [02_class.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/02_class.html)

::: info 근거
UWA2/js/Class.js, Class/Options.js, Class/Events.js, Class/Listener.js, Class/Timed.js, Class/Debug.js, Dispatcher.js. 호출부: `"UWA/Class"` 2,970 건 / 757 파일, `this._parent(` 7,701 건
:::

## 만들기

```js
require(['UWA/Class', 'UWA/Class/Options', 'UWA/Class/Events'], function (Class, Options, Events) {
  var PartLoader = Class.extend(Options, Events, {
    name: 'part-loader',
    defaultOptions: { pageSize: 50, filter: { state: 'WIP' } },

    init: function (options) {
      this.setOptions(options);
      this.items = [];
    },

    load: function () {
      this.items = ['PRT-0001', 'PRT-0002'];
      this.dispatchEvent('onLoad', [this.items]);
    }
  });

  var loader = new PartLoader({ filter: { owner: 'me' } });
  loader.addEvent('onLoad', function (items) { console.log(items); });
  loader.load();
});
```

- `extend(mixin1, mixin2, ..., 정의)` 순서입니다. 뒤에 오는 것이 앞의 같은 이름을 덮어씁니다.
- `init` 이 생성자입니다. `new` 할 때 받은 인자가 그대로 들어옵니다.
- `name` 은 디버그 이름이며, View 와 컨트롤에서는 CSS 클래스 이름(`getClassNames()`)에도 쓰입니다.
- mixin 은 메서드를 복사해 넣는 방식이라 `loader instanceof Events` 는 false 입니다. 부모 클래스에 대한 `instanceof` 는 true 입니다.

## 상속과 _parent

```js
var ReleasedPartLoader = PartLoader.extend({
  defaultOptions: { filter: { state: 'RELEASED' } },

  init: function (options) {
    this._parent(options);
    this.released = true;
  },

  load: function () {
    this._parent();
    console.log('released only');
  }
});
```

- `this._parent(...)` 는 부모 클래스의 **같은 이름 메서드** 를 부릅니다. `init` 을 다시 정의하면 `this._parent(...)` 를 꼭 불러야 부모 초기화가 실행됩니다.
- `defaultOptions` 처럼 일반 객체 속성은 상속할 때 부모 것과 **깊게 합쳐집니다**. 위 예의 `filter` 는 `{ state: 'RELEASED' }` 가 되고 `pageSize: 50` 은 그대로 남습니다. 배열은 합쳐지지 않고 바뀝니다.

::: warning _parent 는 바로 그 자리에서만
`_parent` 는 메서드가 실행되는 동안만 잠깐 부모 메서드로 바뀌어 있습니다. 콜백이나 `setTimeout` 안에서 부르면 다른 함수가 불립니다. 비동기에서 쓰려면 먼저 변수에 담아 둡니다.

```js
load: function () {
  var parentLoad = this._parent;
  var self = this;
  setTimeout(function () { parentLoad.call(self); }, 100);
}
```

- 메서드 안에서 예외가 나면 `_parent` 가 원래대로 돌아오지 않습니다.
- 소스 코드에 `_parent` 라는 단어가 있는 메서드만 이렇게 감싸집니다.
:::

## 기타

| 기능 | 방법 |
| --- | --- |
| 기존 클래스에 메서드 추가 | `PartLoader.implement({ newMethod: function () {} })` |
| 부모 클래스 | `ReleasedPartLoader.parent === PartLoader` |
| static 멤버 | `extend` 로는 정의할 수 없음. `PartLoader.create = function () {}` 처럼 직접 대입. 자식에게 상속되지 않음 |
| 싱글턴 | `Class.singleton({ ... })` → 클래스가 아니라 **인스턴스** 를 돌려줌. 메서드를 처음 부를 때 `init()` 이 자동 실행됨 |

## mixin

| mixin | 넣으면 생기는 것 |
| --- | --- |
| `UWA/Class/Options` | `setOptions`, `setOption`, `getOption`, `defaultOptions` |
| `UWA/Class/Events` | `addEvent`, `addEventOnce`, `addEvents`, `removeEvent`, `dispatchEvent`, `hasEvent` |
| `UWA/Class/Listener` | `listenTo`, `listenToOnce`, `stopListening` |
| `UWA/Class/Timed` | `setDelayed`, `setPeriodical`, `setAnimate`, `clearAllTimed` ... |
| `UWA/Class/Debug` | `setDebugMode`, `log` |

### Options

```js
this.setOptions({ pageSize: 20, events: { onLoad: function (items) { ... } } });
this.getOption('pageSize', 10);
```

- 처음 `setOptions` 할 때 `defaultOptions` 를 깊은 복사한 뒤, 넘긴 값을 **깊게 합칩니다**.
- `events` 키에 넣은 함수들은 `addEvents` 로 등록됩니다. 생성자 옵션에 `onLoad: function` 처럼 바로 넣는 방식은 지원하지 않습니다.
- `getOption(키, 기본값)` 은 값이 `undefined` 일 때만 기본값을 돌려줍니다. `null` 은 그대로 돌려줍니다.

### Events

```js
loader.addEvent('onLoad', function (items) { ... });
loader.dispatchEvent('onLoad', [items]);
loader.removeEvent('onLoad', handler);
```

- `dispatchEvent(이름, [인자들])` 의 배열이 펼쳐져 리스너에 전달됩니다.
- 이벤트 이름은 관례상 `on` 으로 시작합니다 (`onLoad`, `onChange`).
- 리스너가 `false` 를 돌려주면 뒤의 리스너는 실행되지 않습니다.
- `addEvent(이름, fn, context, priority)` 의 priority 가 큰 것부터 실행됩니다.
- `onAnyEvent` 리스너는 모든 이벤트를 `(이벤트이름, ...인자)` 로 받습니다.

::: warning 이벤트 이름과 같은 메서드는 자동으로 불립니다
클래스에 `onLoad` 라는 메서드가 있으면 `dispatchEvent('onLoad')` 때마다 그 메서드가 다른 리스너보다 먼저 자동으로 실행됩니다. 일반 메서드 이름을 `onXxx` 로 지으면 뜻하지 않게 불릴 수 있습니다.
:::

### Listener

다른 객체의 이벤트를 듣고, 정리할 때 한 번에 해제합니다.

```js
this.listenTo(this.model, 'onChange:title', this.render);
this.listenTo(this.model, { onChange: this.render, onDestroy: this.close });
this.stopListening();
```

- 콜백의 `this` 는 항상 `listenTo` 를 부른 객체입니다.
- 메서드 이름 문자열(`'render'`)은 받지 않습니다. 함수를 넘깁니다.

### Timed

```js
this.setDelayed('save', this.save, 500);
this.setPeriodical('poll', this.refresh, 10000);
this.clearDelayed('save');
this.clearAllTimed();
```

- 같은 이름으로 다시 걸면 이전 타이머를 먼저 취소합니다. 입력 중 저장을 미루는 처리(debounce)에 씁니다.
- 컨트롤과 View 의 `destroy()` 는 `clearAllTimed()` 를 자동으로 부릅니다.
