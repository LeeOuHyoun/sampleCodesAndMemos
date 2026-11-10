# WebappsUtils <Badge type="info" text="원본 분석" />

`DS/WebappsUtils/WebappsUtils` 는 webapps 폴더 주소와 자산(이미지, 아이콘) 주소를 만들어 주는 작은 모듈입니다. 이미지 경로를 직접 조합하지 않고 이것을 씁니다.

| 함수 | 사용 횟수 (enovia2025 webapps) |
| --- | --- |
| `getWebappsAssetUrl(` | 1,214 건 / 201 파일 |
| `getWebappsBaseUrl(` | 374 건 / 110 파일 |
| `getProxifiedWebappsBaseUrl(` | 15 건 / 8 파일 |

모듈 이름 `"DS/WebappsUtils/WebappsUtils"` 는 667 건 / 279 파일에서 의존성으로 쓰입니다.

::: info 근거
WebappsUtils/WebappsUtils.js 의 `define("DS/WebappsUtils/WebappsUtils")` 와 그 앞의 초기화 코드, `DS/WebappsUtils/Utils`. 호출부: FolderEditor, 3DPlay, CAT3DAnnotation 계열. 2026 도 이 세 함수는 같음
:::

샘플: [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) (getWebappsBaseUrl 로 3DSpace 주소 대체값 만들기)

## 함수

```js
require(['DS/WebappsUtils/WebappsUtils'], function (WebappsUtils) {
  WebappsUtils.getWebappsBaseUrl();
  WebappsUtils.getWebappsAssetUrl('MyWidget', 'icons/part.png');
});
```

| 함수 | 돌려주는 값 |
| --- | --- |
| `getWebappsBaseUrl()` | webapps 주소. **끝에 `/` 가 붙음**. 예: `<3DSpace>/webapps/` |
| `getWebappsAssetUrl(폴더, 파일)` | `<webapps>/폴더/assets/파일`. 조건이 맞으면 `?v=버전` 이 붙음 |
| `getProxifiedWebappsBaseUrl()` | `window.dsProxifiedWebappsBaseUrl` 이 있을 때만 그 값 + `/`. 없으면 `null` |

- `getWebappsAssetUrl` 의 두 번째 인자는 `assets/` **뒤** 경로입니다. `assets/` 를 또 쓰지 않습니다.
- 파일 이름에 `.` 이 있고 전역 `dsVersion` 이 있으면 캐시 무효화용 `?v=dsVersion` (이미 `?` 가 있으면 `&v=`) 를 붙입니다. 주소에 이미 `resources/버전/` 이 들어 있으면 붙이지 않습니다.
- 폴더 끝을 `/` 로 넘기면 아이콘 폴더 주소를 얻습니다. ENOVIA 코드는 `getWebappsAssetUrl('3DPlay', 'icons/32/')` 뒤에 파일 이름을 붙여 씁니다.

```js
var iconUrl = WebappsUtils.getWebappsAssetUrl('MyWidget', 'icons/part.png');
var workerUrl = WebappsUtils.getWebappsBaseUrl() + 'MyWidget/worker.js';
```

## 로드될 때 하는 일

이 모듈이 처음 로드되면 webapps 주소를 정하고 로더 설정을 바꿉니다.

| 순서 | 동작 |
| --- | --- |
| 1 | `window.dsDefaultWebappsBaseUrl` 이 있으면 그것, 없으면 현재 페이지 경로 + `../` 를 webapps 주소로 정함 |
| 2 | 끝에 `/` 를 붙여 `window.dsDefaultWebappsBaseUrl` 에 다시 저장 |
| 3 | `require.config({ baseUrl: webapps주소, paths: { DS: '.', UWA: 'UWA2/js', vendors: 'vendors' } })` |

AmdLoader.js 가 먼저 `dsDefaultWebappsBaseUrl` 을 정해 두므로 보통은 AmdLoader 가 찾은 주소와 같습니다 ([webapps 주소를 정하는 순서](/amd/#webapps-주소를-정하는-순서)).

::: warning 3DDashboard 안에서의 webapps 주소
3DDashboard 위젯 프레임에서는 AmdLoader 를 프레임이 먼저 읽으므로 webapps 주소도 프레임이 정하는 것으로 보입니다. 위젯 HTML 이 놓인 3DSpace 의 webapps 와 같다고 가정하지 말고, 3DSpace 서버 주소가 필요하면 [3DSpace 주소와 SecurityContext](/widget/space-url) 의 방법을 씁니다. webapps 주소는 "같은 서버의 정적 파일" 을 가리킬 때만 씁니다.
:::

## 같은 파일의 다른 모듈

WebappsUtils.js 묶음에는 아래 모듈도 들어 있습니다. 필요한 것만 의존성으로 부릅니다.

| 모듈 | 내용 |
| --- | --- |
| `DS/WebappsUtils/Utils` | `uuid()` / `getUUID()`, `getCookie`, `setCookie(이름, 값, 도메인, 분)`, `removeCookie`, `debounce(fn, ms, 즉시?)`, `throttle`, `sha256(문자열)`, `copy(입력요소)`, `clientEngine`, `clientPlatform` |
| `DS/WebappsUtils/Emitter` | `on`, `off`, `trigger`, `invoke` 를 가진 간단한 이벤트 객체 |
| `DS/WebappsUtils/Inherit` | `clone`, `inherit` |
| `DS/WebappsUtils/Promise` | 오래된 브라우저용 Promise |
| `DS/WebappsUtils/Map` | 간단한 Map |
| `DS/WebappsUtils/Console`, `DS/WebappsUtils/Performance` | 로그, 성능 측정 |
| `DS/WebappsUtils/BetaOptions` | 사용자 설정(Me preferences) 읽기. 3DDashboard 최상위 창의 모듈을 부름 |

`DS/WebappsUtils` 와 `WebappsUtils/WebappsUtils` 도 같은 객체를 돌려주는 별칭입니다.

## require.toUrl 과 비교

| 방법 | 결과 | 쓰는 곳 |
| --- | --- | --- |
| `WebappsUtils.getWebappsAssetUrl('MyWidget', 'a.png')` | `<webapps>/MyWidget/assets/a.png?v=...` | 이미지, 아이콘 (ENOVIA 관례) |
| `require.toUrl('DS/MyWidget/assets/a.png')` | `<webapps>/MyWidget/assets/a.png` (+ `urlArgs`) | 모듈 이름 기준 경로 (360 건) |
| `'../MyWidget/assets/a.png'` | 페이지 위치 기준 | 쓰지 않음. 3DDashboard 에서는 페이지 위치가 다름 |
