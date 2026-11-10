# Promise <Badge type="info" text="원본 분석" />

`UWA/Promise` 는 브라우저 기본 Promise 를 감싼 클래스입니다. `then` / `catch` / `await` 는 기본 Promise 와 같고, deferred 같은 몇 가지 기능이 더 있습니다.

::: info 근거
UWA2/js/Promise.js, UWA2/js/Internal/Polyfill/Promise.js. 호출부: `"UWA/Promise"` 의존성 622 건 / 252 파일, `Promise.deferred(` 149 건
:::

## 만들기

```js
require(['UWA/Promise'], function (Promise) {
  function loadPart(id) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () { resolve({ id: id, title: '브라켓' }); }, 100);
    });
  }

  loadPart('PRT-0001').then(function (part) {
    console.log(part.title);
  }).catch(function (err) {
    console.error(err);
  });
});
```

- `instanceof Promise` 가 true 이므로 `await` 와 기본 Promise 함수에 그대로 넘길 수 있습니다.
- 폴리필은 브라우저에 Promise 가 없을 때만 설치되므로 요즘 브라우저에서는 기본 Promise 위에서 동작합니다.

## deferred

콜백 방식 API 를 Promise 로 바꿀 때 많이 씁니다. `resolve`, `reject` 를 밖으로 꺼내 쓸 수 있습니다.

```js
function request(url) {
  var deferred = Promise.deferred();
  WAFData.authenticatedRequest(url, {
    type: 'json',
    onComplete: function (data) { deferred.resolve(data); },
    onFailure: function (err) { deferred.reject(err); }
  });
  return deferred.promise;
}
```

`Promise.deferred()` 는 `{ promise, resolve, reject }` 를 돌려줍니다.

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `then`, `catch`, `finally` | 기본 Promise 와 같음 |
| `fail`, `fin` | `catch`, `finally` 의 다른 이름 |
| `done(onOk?, onFail?)` | 체인 끝. 처리되지 않은 오류를 다시 던져 콘솔에 보이게 함 |
| `spread(fn)` | 결과가 배열이면 펼쳐서 `fn(a, b, c)` 로 호출. `Promise.all` 다음에 씀 |
| `Promise.all / race / resolve / reject` | 기본 Promise 와 같음 (아래 주의 참고) |
| `Promise.allSettled` | 모든 결과를 모음 (아래 주의 참고) |
| `Promise.cast(value)` | 값을 Promise 로 감쌈 |
| `Promise.deferred()` | `{ promise, resolve, reject }` |

```js
Promise.all([loadPart('A'), loadPart('B')]).spread(function (a, b) {
  console.log(a.title, b.title);
});
```

::: warning 기본 Promise 와 다른 점
- `Promise.allSettled` 결과는 `{ state: 'fullfilled' | 'rejected', ... }` 입니다. 키가 `status` 가 아니라 `state` 이고, 값도 `'fulfilled'` 가 아니라 철자가 틀린 `'fullfilled'` 입니다.
- `Promise.all` 은 `length` 가 있는 배열만 받습니다. `Set` 을 넘기면 reject 됩니다.
:::

`UWA/Class/Promise` 는 예전 이름이며 사용 중지 안내(deprecated)가 나옵니다. `UWA/Promise` 를 씁니다.
