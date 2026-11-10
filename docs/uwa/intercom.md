# 위젯 간 통신 (InterCom) <Badge type="info" text="원본 분석" />

`UWA/Utils/InterCom` 은 서로 다른 창(iframe, 위젯)끼리 이벤트를 주고받는 모듈입니다. 한쪽이 **Server** 를 열고, 다른 쪽이 **Socket** 으로 붙어서 이벤트 이름 + 데이터를 보냅니다. 내부는 `postMessage` 입니다.

::: info 근거
UWA2/js/Utils/InterCom.js. 호출부: Foundation (bps.intercom.server), ENOAEFStructureBrowser bpsUWAInterCom
:::

## 구조

```
상위 창 (예: 대시보드)                     iframe / 위젯
┌──────────────────────────┐              ┌──────────────────────────┐
│ new InterCom.Server(id)  │ ◀─ subscribe ─│ new InterCom.Socket()    │
│ server.addListener(...)  │ ◀─ dispatch ──│ socket.dispatchEvent(...) │
│ server.dispatchEvent(...) │ ── dispatch ─▶│ socket.addListener(...)   │
└──────────────────────────┘              └──────────────────────────┘
```

## Server 열기

```js
require(['UWA/Utils/InterCom'], function (InterCom) {
  var server = new InterCom.Server('my.intercom.server');

  server.addListener('onPartSelected', function (data, info) {
    console.log('선택된 부품', data.id);
  });
});
```

- 같은 id 로 Server 를 다시 만들면 기존 Server 는 연결이 끊깁니다.
- `server.dispatchEvent(이름, 데이터)` 로 붙어 있는 Socket 들에게 보냅니다.

## Socket 으로 붙기

```js
require(['UWA/Utils/InterCom'], function (InterCom) {
  var socket = new InterCom.Socket('my.widget.socket');
  socket.subscribeServer('my.intercom.server', window.parent, targetOrigin);

  socket.addListener('onRefresh', function (data) {
    console.log('새로고침 요청', data);
  });

  socket.dispatchEvent('onPartSelected', { id: 'PRT-0001' });
});
```

| 메서드 | 설명 |
| --- | --- |
| `new InterCom.Socket(id?)` | 소켓 생성. id 는 특정 소켓에게만 보낼 때 대상 이름 |
| `subscribeServer(serverId, targetWindow?, origin?)` | Server 에 붙음. 기본 `window.parent`, 현재 origin |
| `dispatchEvent(event, data, targetSockets?, servers?)` | 이벤트 보내기 |
| `addListener(event, fn(data, info))` / `removeListener` | 이벤트 받기 |
| `disconnect()` | 연결 해제 |

- Server 의 연결 응답이 오기 전에 보낸 이벤트는 쌓아 두었다가 연결되면 보냅니다. `subscribeServer` 직후 바로 `dispatchEvent` 해도 됩니다.
- 데이터는 JSON 으로 바뀌어 전달되므로 함수, DOM 요소, 순환 참조는 보낼 수 없습니다.
- 다른 도메인 창이면 `subscribeServer` 의 세 번째 인자에 상대 origin 을 넣습니다.

::: tip isPublic
일부 코드는 `new InterCom.Server(id, { isPublic: true })` 를 쓰지만, 2025 InterCom 코드에서는 `isPublic` 을 읽는 곳이 없습니다. 넣어도 효과가 없는 것으로 보입니다. <Badge type="danger" text="검증 필요" />
:::
