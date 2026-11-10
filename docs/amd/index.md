# AMD 로딩 <Badge type="info" text="원본 분석" />

ENOVIA webapps 의 JavaScript 는 모두 AMD 모듈(`define` / `require`)입니다. 로더는 `AmdLoader/AmdLoader.js` 하나이고, RequireJS 2.1.11 에 DS 전용 규칙(묶음 파일 먼저 읽기, `i18n!` / `css!` / `text!` 플러그인)을 덧붙인 것입니다.

이 페이지는 "모듈 이름이 어느 파일이 되는지" 와 "묶음 파일" 을 설명합니다. 플러그인은 [플러그인](/amd/plugins), 경로 함수는 [WebappsUtils](/amd/webapps-utils) 에 있습니다.

::: info 근거
AmdLoader/AmdLoader.js (RequireJS `version = "2.1.11"`, DS 래퍼, `pluginDS` / `i18n` / `css` / `text` 플러그인), WebappsUtils/WebappsUtils.js, 각 폴더의 `.<폴더>.index.mk` 빌드 기록. 폴더 통계: enovia2025 webapps 1,659 폴더 중 `<폴더>/<폴더>.js` 가 있는 폴더 1,493 개 (그 파일 하나뿐인 폴더 1,387 개). 2026 의 AmdLoader.js 는 2025 와 같음
:::

## 모듈 이름과 파일

| 모듈 이름 | 읽는 파일 | 설정 |
| --- | --- | --- |
| `DS/폴더/모듈` | `<webapps>/폴더/모듈.js` | `paths.DS` |
| `DS/폴더/하위/모듈` | `<webapps>/폴더/하위/모듈.js` | `paths.DS` |
| `UWA/Core`, `UWA/Class/View` | `<webapps>/UWA2/js/Core.js`, `.../UWA2/js/Class/View.js` | `paths.UWA` |
| `vendors/...` | `<webapps>/vendors/...js` | `paths.vendors` |
| `DS/` 없는 이름 (`TopBar/TopBar.css` 등) | `baseUrl` 기준 상대경로 | `baseUrl` |

- 두 번째 칸 `폴더` 가 webapps 바로 아래 폴더 이름입니다. ENOVIA 의 모듈 이름은 거의 모두 `DS/` 로 시작합니다.
- `DSPARTNERS/폴더/모듈` 도 DS 규칙(묶음 파일 먼저 읽기)의 대상이지만 기본 경로 설정은 없습니다.

### webapps 주소를 정하는 순서

AmdLoader.js 가 처음 실행될 때 아래 순서로 찾습니다.

| 순서 | 출처 |
| --- | --- |
| 1 | 전역 변수 `window.dsDefaultWebappsBaseUrl` |
| 2 | `<link rel="webappsBaseUrl" href="...">` |
| 3 | `AmdLoader/AmdLoader.js` 를 읽은 `<script src>` 에서 `/AmdLoader/AmdLoader.js` 앞부분 |
| 4 | 현재 페이지 경로 + `..` |

그래서 `<3DSpace>/webapps/내폴더/index.html` 에서 `../AmdLoader/AmdLoader.js` 를 읽으면 webapps 주소가 `<3DSpace>/webapps` 가 됩니다. UWA 샘플이 이 방식입니다.

`DS/WebappsUtils/WebappsUtils` 가 로드되면 `require.config({ baseUrl: <webapps>/, paths: { DS: '.', UWA: 'UWA2/js', vendors: 'vendors' } })` 를 다시 부릅니다. 이때부터 `DS/` 없는 이름도 webapps 기준이 됩니다.

::: tip
내 모듈 이름은 항상 `DS/내폴더/...` 로 짓습니다. `DS/` 없는 이름은 WebappsUtils 가 로드되기 전에는 페이지 위치 기준으로 풀려서, 같은 코드가 상황에 따라 다른 주소를 읽을 수 있습니다.
:::

## 묶음 파일 (concatenated module)

배포된 webapps 폴더에는 보통 개별 모듈 파일이 없고 `폴더/폴더.js` 하나만 있습니다. 이 파일 안에 그 폴더의 모듈이 모두 이름 붙은 `define` 으로 들어 있습니다.

```js
define("DS/WidgetServices/WidgetServices", ["UWA/Array", "UWA/Widget", ...], function (...) { ... });
define("DS/WidgetServices/commandProxy/CommandProxy", [...], function (...) { ... });
define("DS/WidgetServices/securityContextServices/SecurityContextServices", [...], function (...) { ... });
```

| 파일 | 내용 |
| --- | --- |
| `폴더/폴더.js` | 그 폴더의 JS 모듈 전부 |
| `폴더/폴더.css` | 그 폴더의 CSS 전부 |
| `폴더/폴더_ko.js`, `폴더_en.js` ... (14 개 언어) | 그 폴더의 NLS 문자열. [i18n!](/amd/plugins#i18n) 참고 |
| `폴더/.폴더.index.mk` | 빌드 기록. 어떤 `src/*.js` 를 합쳤는지 보임 |

### 로더가 묶음 파일을 찾는 방법

`DS/폴더/...` 모듈을 처음 요청하면 로더는 먼저 `DS/폴더/폴더` (묶음 파일)를 읽고, 그다음 원래 모듈을 찾습니다.

| 상황 | 동작 |
| --- | --- |
| 묶음 파일이 있음 | 묶음 안에 원래 모듈이 정의되어 있으므로 추가 요청 없음 |
| 묶음 파일이 없음 (404) | 콘솔에 `Concatenated module "DS/폴더/폴더" not found. Individual scripts will be required for the module` 를 남기고 `폴더/모듈.js` 를 따로 읽음. 폴더마다 한 번만 시도 |
| 요청한 모듈이 `DS/폴더/폴더` 자신 | 묶음 확인 없이 바로 읽음 |

이 규칙은 아래 두 곳에 걸립니다.

| 걸리는 곳 | 규칙 |
| --- | --- |
| 최상위 `require([...])` | `DS/` 로 시작하는 모든 의존성 |
| 이름 붙은 `define("DS/A/x", [...])` | **다른 폴더**의 `DS/` 의존성만. 같은 폴더(`DS/A/...`) 의존성은 묶음 안에 같이 있다고 보고 건너뜀 |

::: tip 내 위젯의 파일 구성
- 파일이 몇 개 안 되면 모듈 하나를 `DS/내폴더/내폴더` 로 만들어 `내폴더/내폴더.js` 에 둡니다. 묶음 확인 요청이 생기지 않습니다 ([위젯 샘플](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) 이 이 방식).
- 개별 파일로 나누면 폴더당 한 번 `내폴더/내폴더.js` 404 가 생기고 콘솔에 위 안내가 찍힙니다. 동작에는 문제가 없습니다.
- 여러 파일을 합칠 때는 각 `define` 에 이름(`'DS/내폴더/모듈'`)을 꼭 넣습니다. 이름 없는 `define` 을 한 파일에 둘 이상 넣으면 RequireJS 가 `Mismatched anonymous define()` 오류를 냅니다.
:::

## define / require 쓰는 법

```js
define('DS/MyWidget/PartList', [
  'UWA/Core',
  'UWA/Class/View',
  'DS/WAFData/WAFData',
  'DS/MyWidget/PartModel',
  'i18n!DS/MyWidget/assets/nls/MyWidget',
  'css!DS/MyWidget/MyWidget.css'
], function (UWA, View, WAFData, PartModel, nls) {
  'use strict';
  return View.extend({ ... });
});
```

```js
require(['DS/MyWidget/PartList'], function (PartList) {
  new PartList().render().inject(widget.body);
});
```

- `css!` 는 쓸 값을 돌려주지 않으므로 의존성 목록 맨 뒤에 둡니다. 함수 인자와 순서가 어긋나지 않습니다.
- `require('DS/폴더/모듈')` 처럼 문자열 하나로 부르면 **이미 로드된** 모듈만 바로 돌려줍니다. 아직 없으면 오류를 던집니다.
- `require.toUrl('DS/MyWidget/assets/a.png')` 로 모듈 이름을 주소로 바꿀 수 있습니다. 자산 주소는 [WebappsUtils](/amd/webapps-utils) 가 더 많이 쓰입니다.

## 로더 설정 값

| 설정 | 기본값 | 바꾸는 법 |
| --- | --- | --- |
| 모듈 로드 대기 시간 (`waitSeconds`) | 30 초 | `window.dsRequireWaitSeconds = 60` 또는 주소에 `?dsRequireWaitSeconds=60` |
| 묶음 파일 먼저 읽기 | 켜짐 | `window.dsDisableWebModuleLoading = true` 또는 주소에 `dsDisableWebModuleLoading` 를 넣으면 끔 |
| webapps 주소 | 위 순서 | `window.dsDefaultWebappsBaseUrl` |
| 경로 추가 | - | `require.config({ paths: { 'DS/MyLib': 'https://.../MyLib' } })` |

`require.config({ paths })` 는 ENOVIA 코드에서도 특정 폴더만 다른 위치로 돌릴 때 씁니다 (예: 3DPlayAppHybrid 의 `'DS/VENCKEditor'`).

## 오류 메시지

| 메시지 | 뜻 |
| --- | --- |
| `requireDs: Concatenated module "..." not found. Individual scripts will be required ...` | 묶음 파일이 없어서 개별 파일로 읽음. 정상 |
| `Concatenated module "DS/x/x_ko" not found, now attempting to load the english nls bundle` | 그 언어의 NLS 묶음이 없음. 영어 묶음 → JSON 순서로 다시 찾음 ([i18n!](/amd/plugins#언어를-찾는-순서)) |
| `RequireJS error type: "scripterror" for module(s): [...]` | 파일 404 또는 스크립트 실행 오류 |
| `RequireJS error type: "timeout" ...`, `Load timeout for modules` | 30 초 안에 파일을 다 읽지 못함 |
| `Mismatched anonymous define() module` | 이름 없는 `define` 이 있는 파일을 `<script>` 로 직접 넣었거나, 한 파일에 둘 이상 있음 |
| `Failed to load i18n!...` (`i18nerror`) | 언어별 묶음, 영어 묶음, `_ko.json`, `_en.json` 모두 없음 |
| `Failed to load css!....css` (`styleerror`) | CSS 파일 404. 이 오류로 **require 전체가 실패** 함 |

::: warning
`waitSeconds` 는 파일 하나가 아니라 아직 끝나지 않은 요청 전체에 걸립니다. 느린 서버에서 큰 앱을 처음 열 때 timeout 이 나면 `dsRequireWaitSeconds` 를 늘려 확인합니다.
:::

## 자주 틀리는 것

| 틀린 생각 | 실제 | 문서 |
| --- | --- | --- |
| `DS/폴더/모듈` 은 `폴더/모듈.js` 만 요청 | 먼저 `폴더/폴더.js` 를 요청함 | [묶음 파일](#로더가-묶음-파일을-찾는-방법) |
| 같은 폴더 모듈끼리도 묶음을 확인 | `define` 안의 같은 폴더 의존성은 확인 안 함 | [묶음 파일](#로더가-묶음-파일을-찾는-방법) |
| `css!` 실패는 무시됨 | 그 `require` 콜백이 아예 불리지 않음 | [css!](/amd/plugins#css) |
| `i18n!` 은 `_ko.json` 을 먼저 읽음 | `폴더_ko.js` 묶음 → `폴더_en.js` → `_ko.json` → `_en.json` | [i18n!](/amd/plugins#언어를-찾는-순서) |
| 언어는 위젯 `widget.lang` 를 따름 | 로더 설정 `i18n.locale` 또는 브라우저 언어를 따름 | [i18n!](/amd/plugins#언어-정하기) |
| 파일 안 `define` 이름이 틀리면 오류가 남 | 오류 없이 그 모듈 값이 `undefined` 로 들어옴 | [define / require](#define-require-쓰는-법) |
| UWA 모듈은 `UWA/js/Core.js` | `UWA2/js/Core.js` | [모듈 이름](#모듈-이름과-파일) |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [플러그인 (i18n!, css!, text!)](/amd/plugins) | 다국어, 스타일, 텍스트 파일 읽기. 언어를 찾는 순서 |
| [WebappsUtils](/amd/webapps-utils) | webapps 폴더 주소, 이미지 / 아이콘 주소 만들기 |
