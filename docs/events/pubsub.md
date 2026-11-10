# PubSub (Events, ModelEvents) <Badge type="info" text="원본 분석" />

`DS/CoreEvents` 에는 이벤트 버스가 두 개 있습니다.

| 모듈 | 형태 | 범위 | 언제 |
| --- | --- | --- | --- |
| `DS/CoreEvents/Events` | 싱글톤 (전역 `WUX.Events` 와 같은 객체) | 창(window) 하나에 하나 | 같은 창의 다른 모듈에 알릴 때 |
| `DS/CoreEvents/ModelEvents` | 클래스. `new` 로 만듦 | 만든 객체마다 따로 | 내 화면 안에서만 쓰는 버스 |

둘 다 **동기 호출**입니다. `publish` 가 끝나기 전에 구독 함수가 모두 실행됩니다.

::: info 근거
CoreEvents/CoreEvents.js (ModelEvents 1~220행, Events 223행~). 호출부: 3DPlayExperienceModule (`WUX.Events.subscribe`), CfgConfigurationRevisionUX (`cfgRevActionEvents.publish`), Selection/Selection.js (XSO 가 내부에서 ModelEvents 사용)
:::

## Events (전역)

```js
require(['DS/CoreEvents/Events'], function (Events) {
  var token = Events.subscribe({ event: 'myapp/part-saved' }, function (data) {
    console.log('저장됨', data.id);
  });

  Events.publish({ event: 'myapp/part-saved', data: { id: 'PRT-0001' } });

  Events.unsubscribe(token);
});
```

| 메서드 | 설명 |
| --- | --- |
| `publish({ event, data })` | 구독 함수에 `data` 하나만 넘김 |
| `publish({ event, data, useFullInfos: true })` | 구독 함수에 `{ event, data, useFullInfos }` 객체 전체를 넘김 (2025 만) |
| `subscribe({ event }, fn)` | 토큰 문자열(`'0'`, `'1'` ...)을 돌려줌 |
| `subscribeOnce({ event }, fn)` | 한 번 받으면 스스로 해제. 토큰을 돌려줌 |
| `unsubscribe(token)` | 토큰으로 해제 |

`unsubscribeAll` 은 **없습니다**. 받은 토큰을 모아 두었다가 직접 해제합니다.

### 이벤트 이름

이름은 앞뒤에 `/` 를 붙이고 연속된 `/` 를 하나로 줄여서 저장합니다.

| 쓴 이름 | 실제 키 |
| --- | --- |
| `'onReady'` | `/onReady/` |
| `'/onReady'` | `/onReady/` |
| `'myapp//saved/'` | `/myapp/saved/` |

그래서 `'onReady'` 로 구독하고 `'/onReady/'` 로 발행해도 받습니다. 와일드카드는 없습니다. `'/myapp/'` 를 구독해도 `'/myapp/saved/'` 는 받지 않습니다.

::: tip 이름 붙이기
전역 버스라서 이름이 겹치면 남의 이벤트를 받습니다. ENOVIA 코드도 `'/' + 위젯id + '3DPLAY/RIGHTPANEL/OPEN'` 처럼 앞에 고유 값을 붙입니다. 내 코드는 `'회사약어/앱/동작'` 형태를 권장합니다.
:::

### 자주 보이는 전역 이벤트

`.publish({ event: '...' })`, `.subscribe({ event: '...' })` 문자열 기준 상위 항목입니다. Events 와 ModelEvents 호출이 섞여 있습니다.

| 이름 | 횟수 | 쓰는 곳 |
| --- | --- | --- |
| `/VISU/` | 91 | 3D 시각화 |
| `onRootAdded`, `onRootRemoved` | 51, 38 | 3D 트리 / 뷰어 |
| `webinwin:web:notification` | 22 | 알림 |
| `triptych-show-panel`, `triptych-hide-panel` | 18, 18 | 좌우 패널 열기 / 닫기 |
| `information-panel-close` | 18 | 정보 패널 |
| `license:error` | - | WAFData 가 라이선스 오류 시 발행 ([서버 호출](/uwa/request#promise-로-감싸기)) |

## ModelEvents

`new ModelEvents(options)` 로 버스를 만들고 여러 화면 조각에 같은 객체를 넘겨 씁니다. 다른 모듈과 이름이 겹칠 걱정이 없습니다.

```js
require(['DS/CoreEvents/ModelEvents'], function (ModelEvents) {
  var bus = new ModelEvents();

  var token = bus.subscribe({ event: 'row-selected' }, function (data, token) {
    console.log(data.id);
  });

  bus.publish({ event: 'row-selected', data: { id: 'PRT-0001' } });
  bus.unsubscribe(token);
  bus.destroy();
});
```

### 생성 옵션

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `parent` | `null` | 부모 ModelEvents (또는 배열). 발행한 이벤트가 부모에게도 전파됨 |
| `target` | `null` | 이 값이 있으면 구독 함수가 받는 값이 포장 객체로 바뀜 (아래 표) |
| `callMode` | `'desc'` | `'desc'` 는 나중에 구독한 함수부터 호출. `'asc'` 는 먼저 구독한 순서 |
| `asyncPropagation` | `false` | `true` 면 부모 전파를 `setTimeout(0)` 으로 |
| `debug.delay` | `0` | ms 를 주면 발행을 그만큼 늦춤 (target 이 있을 때만) |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| `publish({ event, data, context, target, propagate })` | `context` 는 구독 함수의 `this`. `propagate: false` 면 부모로 전파 안 함 |
| `subscribe({ event }, fn)` | 토큰 반환. `fn(data, token)` |
| `addEventListener(name, fn)` | `subscribe({ event: name }, fn)` 과 같음 |
| `subscribeOnce({ event }, fn)` | 한 번만 |
| `unsubscribe(token)` | 해제 |
| `unsubscribeAll({ event })` | 그 이름의 구독 전부 해제. 인자를 빼면 모든 이름 |
| `disableEvents()` / `enableEvents()` | 발행을 잠시 막음. 호출 횟수를 세므로 짝을 맞춰 부름 |
| `destroy()` | 구독 전부 해제하고 내부 정리 |

### 구독 함수가 받는 값

| 상황 | 첫 번째 인자 |
| --- | --- |
| `target` 이 없음 (기본) | `data` 그대로 |
| `target` 이 있음 | `{ event, formattedEvent, parent, target, data, options, propagate, stopPropagation() }` |

### 부모 전파

```js
var root = new ModelEvents({ target: 'root' });
var child = new ModelEvents({ target: 'child', parent: root });

root.subscribe({ event: 'changed' }, function (e) {
  console.log(e.target, e.data);
});
child.subscribe({ event: 'changed' }, function (e) {
  if (e.data.local) { e.stopPropagation(); }
});

child.publish({ event: 'changed', data: { local: false } });
```

- 위 예에서 `root` 쪽 함수는 `e.target === 'child'` 로 받습니다. 발행한 쪽의 target 이 그대로 갑니다.
- 전파는 `target` 이 있을 때만 일어납니다.
- `disableEvents()` 는 그 객체의 발행만 막습니다. 부모를 막아도 자식은 발행되고, 부모로 전파된 이벤트만 부모에서 멈춥니다.

## 주의

- **구독 함수에서 예외가 나면 나머지 함수는 호출되지 않습니다.** try/catch 가 없습니다. 구독 함수 안에서 직접 잡습니다.
- 기본(`desc`)은 **나중에 구독한 함수가 먼저** 불립니다. 순서에 기대는 코드를 만들지 않습니다.
- `Events.subscribe` 의 세 번째 인자는 받지만 쓰지 않습니다.
- 위젯이 닫혀도 `Events` 구독은 남습니다. 위젯 `onUnload` 에서 토큰을 해제합니다.

## 2026

| 항목 | 내용 |
| --- | --- |
| `Events` <Badge type="warning" text="2026" /> | `class` 의 static 메서드. `new Events()` 하면 오류 |
| `useFullInfos` <Badge type="warning" text="2026" /> | 없어짐. 항상 `data` 만 넘김 |
| 인자 검사 <Badge type="warning" text="2026" /> | `event` 가 빈 문자열이거나 구독 함수가 함수가 아니면 콘솔 경고 후 무시 |

## 관련 문서

- 다른 위젯과 통신: [InterCom](/uwa/intercom), [PlatformAPI](/widget/platform-api)
- UWA 클래스 이벤트(`addEvent`, `dispatchEvent`): [클래스](/uwa/class)
