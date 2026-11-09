# 서버 호출 (WAFData)

3DSpace, 플랫폼 서비스 같은 서버 호출에는 `UWA.Data.request` 가 아니라 **`DS/WAFData/WAFData` 의 `authenticatedRequest`** 를 씁니다. UWA 모듈은 아니지만 UWA 위에서 동작하며, ENOVIA 코드의 서버 호출 대부분이 이것입니다.

| 방법 | 사용 횟수 (enovia2025 webapps) |
| --- | --- |
| `WAFData.authenticatedRequest(` | 1,526 건 / 326 파일 |
| `WAFData.proxifiedRequest(` | 18 건 |
| `UWA.Data.request(` | 34 건 (대부분 라이브러리 주석) |

::: info 근거
WAFData/WAFData.js, UWA2/js/Data.js. 호출부: ENOCharacteristicsApp RequestUtil, XSRCommonComponents RequestUtil, DELPXPFoundations PXPWAFData, 3DPlayApp
:::

## 기본 호출

```js
require(['DS/WAFData/WAFData'], function (WAFData) {
  WAFData.authenticatedRequest(spaceUrl + '/resources/v1/modeler/documents', {
    method: 'GET',
    type: 'json',
    headers: { SecurityContext: 'ctx::<역할>.<조직>.<협업공간>' },
    onComplete: function (data, headers, xhr) {
      console.log(data);
    },
    onFailure: function (error, data, headers) {
      console.error(error.message, data);
    }
  });
});
```

- `spaceUrl` 은 3DSpace 주소입니다. 위젯에서는 `i3DXCompassPlatformServices.getServiceUrl({ serviceName: '3DSpace', platformId: platformId, onComplete: function (url) { ... } })` 로 얻습니다. 자세한 순서는 [3DSpace 주소와 SecurityContext](/widget/space-url) 에 있습니다.
- 로그인 세션(Passport)을 자동으로 붙여 보냅니다. ticket 이 만료되면(`invalid_grant`) 새 ticket 을 받아 **자동으로 다시 보냅니다**.

## 옵션

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `method` | `'GET'` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| `type` | - | `'json'` 이면 응답을 JSON 으로 해석. `'text'`, `'xml'` 도 가능. 없으면 문자열 |
| `data` | - | 객체면 `a=1&b=2` 로 변환. GET 이면 URL 에 붙음 |
| `headers` | `{}` | 요청 헤더 |
| `timeout` | `25000` | ms |
| `cache` | - | `false` 면 URL 에 `_=시각` 을 붙여 캐시 회피 |
| `responseType` | - | XHR responseType 직접 지정 (`'blob'`, `'arraybuffer'` ...) |
| `withCredentials`, `mimeType` | - | XHR 설정 |
| `onComplete(data, headers, xhr)` | - | 성공 |
| `onFailure(error, data, headers)` | 오류를 던짐 | 실패 |
| `onTimeout(error)` | `onFailure` | 시간 초과 |
| `onCancel` | - | `cancel()` 호출 시 |
| `onProgress`, `onUploadProgress` | - | 진행률 |
| `onPassportError` | `WAFData.setErrorHandler(fn)` 로 등록한 함수 | 로그인 세션 만료 (아래 주의 참고) |

돌려받는 객체의 `cancel()` 로 요청을 취소합니다.

## JSON 보내기

`data` 에 객체를 넣으면 form 형식(`application/x-www-form-urlencoded`)으로 바뀝니다. JSON 으로 보내려면 직접 문자열로 만들고 Content-Type 을 지정합니다.

```js
WAFData.authenticatedRequest(url, {
  method: 'POST',
  type: 'json',
  headers: { 'Content-Type': 'application/json', SecurityContext: securityContext, ENO_CSRF_TOKEN: csrfToken },
  data: JSON.stringify({ title: '브라켓' }),
  onComplete: function (data) { ... },
  onFailure: function (error, data) { ... }
});
```

## CSRF 토큰 (3DSpace 쓰기 요청)

WAFData 는 CSRF 토큰을 자동으로 붙이지 않습니다. 3DSpace REST 에 POST / PUT / DELETE 하는 코드는 토큰을 먼저 받아 헤더 `ENO_CSRF_TOKEN` 에 넣습니다.

```js
WAFData.authenticatedRequest(spaceUrl + '/resources/v1/application/CSRF', {
  type: 'json',
  onComplete: function (res) {
    var csrfToken = res.csrf.value;
    WAFData.authenticatedRequest(spaceUrl + '/resources/v1/modeler/documents', {
      method: 'POST',
      type: 'json',
      headers: { 'Content-Type': 'application/json', SecurityContext: securityContext, ENO_CSRF_TOKEN: csrfToken },
      data: JSON.stringify(body),
      onComplete: function (data) { ... }
    });
  }
});
```

- 실제 코드는 토큰을 한 번 받아 보관해 두고 재사용합니다.
- 일부 코드는 `resources/v1/application/E6WFoundation/CSRF` 를 씁니다. 응답 형식(`csrf.value`)은 같습니다.

::: tip 2026: 플랫폼 서비스용 CSRF
2026 버전에 `WAFData.getCompassCSRFToken(baseUrl)` 가 추가되었습니다. `GET <baseUrl>/security/csrf` 로 받은 값을 헤더 `X-DS-CSRFTOKEN` 에 넣는 Compass(플랫폼 서비스)용이며, 3DSpace 의 `ENO_CSRF_TOKEN` 과는 다릅니다. 실패해도 `''` 로 resolve 됩니다.
:::

## Promise 로 감싸기

```js
function request(url, options) {
  return new Promise(function (resolve, reject) {
    WAFData.authenticatedRequest(url, Object.assign({}, options, {
      onComplete: function (data, headers) { resolve({ data: data, headers: headers }); },
      onFailure: function (error, data) { reject(error || data); },
      onPassportError: function (error) { reject(error); }
    }));
  });
}
```

::: warning onPassportError 를 꼭 넣습니다
로그인 세션 만료(CASTGC), 프록시 세션 만료, 라이선스 오류(403 `license_error`) 일 때는 `onFailure` 가 **호출되지 않습니다**. `onPassportError` 가 없으면 위 Promise 는 영원히 끝나지 않습니다. 라이선스 오류는 `onPassportError` 도 부르지 않으므로 화면 전체 처리가 필요하면 PubSub 이벤트 `license:error` 를 받습니다.
:::

## 주의

- **onFailure 인자 순서는 `(error, data, headers)`** 입니다. HTTP 상태 코드는 따로 오지 않고 `error.message` 문자열 안에만 있습니다 (`NetworkError: URL "..." return ResponseCode with value "404".`). 상태별 처리는 `error.message.indexOf('404')` 처럼 합니다.
- **onFailure 를 생략하면 오류를 던집니다.** 처리하지 않은 예외로 콘솔에 남습니다.
- **onTimeout 을 생략하면 onFailure 가 대신 호출** 되고, 이때 인자는 `error` 하나뿐입니다.
- `type: 'json'` 인데 응답이 비어 있으면 `null`, JSON 이 아니면 `onFailure` 로 갑니다.

## UWA.Data.request

`UWA/Data` 의 `UWA.Data.request(url, options)` 도 옵션 형식이 거의 같습니다 (`method`, `type`, `data`, `headers`, `timeout`, `onComplete(data, headers)`, `onFailure`, `onTimeout`, `onCancel`).

::: warning 3DSpace 호출에 직접 쓰지 않습니다
- 다른 도메인 주소를 부르면 자동으로 프록시(`ajax`) 경유로 바뀝니다. 기본 프록시 주소가 netvibes 계열이라 ENOVIA 환경에서는 의도와 다르게 동작할 수 있습니다.
- 같은 GET 요청이 동시에 여러 번 나가면 하나로 합쳐집니다(`useMergeRequest`). 이때 한쪽에서 `cancel` 하면 다른 쪽도 취소될 수 있습니다.
- WAFData 가 내부에서 프록시 경로가 필요할 때만 이것을 씁니다.
:::
