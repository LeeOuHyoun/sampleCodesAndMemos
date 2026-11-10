# 플러그인 (i18n!, css!, text!) <Badge type="info" text="원본 분석" />

의존성 이름 앞에 `플러그인!` 을 붙이면 JS 모듈이 아닌 자원을 읽습니다. 세 플러그인 모두 AmdLoader.js 안에 들어 있어서 따로 불러올 필요가 없습니다.

| 플러그인 | 사용 횟수 (enovia2025 webapps) | 돌려주는 값 |
| --- | --- | --- |
| `i18n!` | 5,481 건 / 920 파일 | 번역 문자열 객체 |
| `css!` | 2,023 건 / 662 파일 | 쓸 값 없음 (`<link>` 추가. 실제로는 load 이벤트 객체) |
| `text!` | 1,027 건 / 319 파일 | 파일 내용 문자열 |

샘플: [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) (`i18n!`, `css!`)

::: info 근거
AmdLoader/AmdLoader.js 의 `define("i18n", ...)`, `define("css", ...)`, `define("text", ...)`, `define("pluginDS", ...)`. 각 폴더의 `폴더_ko.js` 와 `assets/nls/*_ko.json` (예: WidgetServices, i3DXCompassPlatformServices). UWA2/js/Core.js 의 `UWA.i18n`. [언어를 찾는 순서](#언어를-찾는-순서)와 "영어 묶음만 있으면 한국어 JSON 을 안 읽음" 은 jsdom 에서 enovia2025 AmdLoader 로 요청 순서를 찍어 확인함. 2026 의 AmdLoader.js 는 2025 와 같음
:::

## i18n!

```js
define('DS/MyWidget/PartList', [
  'i18n!DS/MyWidget/assets/nls/PartList'
], function (nls) {
  nls.title;                               // 'Part list' 또는 '부품 목록'
  nls.get('count', { n: 3 });              // '{n} 건' → '3 건'
  nls.get('noSuchKey');                    // 키가 없으면 'noSuchKey' 그대로
});
```

### 파일 배치

`i18n!DS/폴더/assets/nls/이름` 하나에 아래 파일이 대응합니다. 개발할 때는 JSON 만 있어도 되고, 배포된 ENOVIA 폴더는 묶음 JS 를 씁니다.

| 형태 | 파일 | 내용 |
| --- | --- | --- |
| 언어별 묶음 | `폴더/폴더_ko.js`, `폴더/폴더_en.js` ... | 그 폴더의 모든 NLS 를 `define("DS/폴더/assets/nls/이름", { ... })` 로 담음 |
| JSON | `폴더/assets/nls/이름_ko.json`, `이름_en.json` ... | `{ "키": "문자열" }` |

배포된 묶음의 실제 모양입니다.

```js
define("DS/WidgetServices/WidgetServices_ko", {});
define("DS/WidgetServices/assets/nls/SecurityContextNls", {
  ErrorSecurityContextEmpty: "사용자의 자격증명을 찾을 수 없습니다. ...",
  ErrorTimeOut: "..."
});
```

- 첫 줄 `define("DS/폴더/폴더_ko", {})` 는 묶음 자신의 이름입니다. 이것이 있어야 로더가 "이 언어 묶음은 읽었다" 고 판단합니다.
- `assets/nls/` 뒤에 하위 폴더를 둘 수도 있습니다 (`assets/nls/feature/core/user/view/이름`). 5,481 건 중 5,039 건은 `assets/nls/이름` 바로 아래입니다.
- `.json` 을 붙여 써도 같은 것으로 봅니다 (`i18n!DS/x/assets/nls/a.json` = `i18n!DS/x/assets/nls/a`).

### 언어를 찾는 순서

현재 언어가 `ko` 일 때 `i18n!DS/MyWidget/assets/nls/PartList` 는 아래 순서로 찾습니다.

| 순서 | 읽는 것 | 실패하면 |
| --- | --- | --- |
| 1 | 모듈 `DS/MyWidget/MyWidget_ko` (`MyWidget/MyWidget_ko.js`) | 콘솔 `Concatenated module ... not found, now attempting to load the english nls bundle` |
| 2 | 모듈 `DS/MyWidget/MyWidget_en` | 다음 |
| 3 | `MyWidget/assets/nls/PartList_ko.json` | 다음 |
| 4 | `MyWidget/assets/nls/PartList_en.json` | `Failed to load i18n!...` 오류 |

1 또는 2 의 묶음을 읽은 뒤에는 그 안에 정의된 `DS/MyWidget/assets/nls/PartList` 를 씁니다.

::: warning 묶음과 JSON 을 섞지 않습니다
- `폴더_en.js` 만 있고 `폴더_ko.js` 가 없으면 한국어 JSON 이 있어도 **영어 묶음을 씁니다** (2 에서 끝남).
- `폴더_en.js` 는 있는데 그 안에 해당 NLS 가 정의되어 있지 않으면 JSON 으로 넘어가지 않고 로드 오류가 납니다.
- 내 위젯은 "JSON 만" 또는 "언어별 묶음 JS 만" 중 하나로 통일합니다. JSON 만 쓰면 1, 2 단계에서 404 가 두 건 생기지만 정상입니다.
:::

### 언어 정하기

| 순서 | 출처 |
| --- | --- |
| 1 | `require.config({ config: { i18n: { locale: 'ko' } } })` |
| 2 | 브라우저 `navigator.languages` 를 앞에서부터 지원 언어에 맞춰 봄 (`ko-KR` → `ko`, `zh-TW` / `zh-HK` → `zh-TW`) |
| 3 | `en` |

- 지원 언어: `en`, `fr`, `de`, `es`, `cs`, `it`, `ja`, `ko`, `pl`, `pt-BR`, `ru`, `zh`, `zh-TW`, `tr`.
- 한 번 정한 언어는 **페이지가 끝날 때까지 고정** 됩니다. 설정은 첫 `i18n!` 로드 전에 해야 합니다.
- 위젯 언어에 맞추려면 ENOVIA 코드처럼 먼저 설정합니다 (3DPlaySyndication.html 등).

```js
require.config({ config: { i18n: { locale: widget.lang } } });
```

::: tip 번역 키 확인용 언어
`locale` 을 `devkey` 로 두면 모든 값이 키 이름으로, `devtrace` 면 `모듈.키` 로, `devsymbol` 이면 `¤¤¤` 로 바뀝니다. 화면의 어느 글자가 어느 키인지 찾을 때 씁니다. 영어 묶음(`폴더_en.js`)이 있는 폴더에서만 바뀝니다.
:::

### 돌려받는 객체

| 키 | 설명 |
| --- | --- |
| `nls.키` | 문자열. 없으면 `undefined` |
| `nls.get(키, params?)` | 없으면 키를 그대로 돌려줌. `params` 가 있으면 `{이름}` 을 바꿈. 없는 이름은 `''` |
| `nls.replace(문자열, params)` | `{이름}` 바꾸기만 |
| `nls._lang` | 읽은 언어. 묶음으로 읽었을 때만 값이 있음 |

`get`, `replace`, `_lang` 은 열거되지 않는 속성이라 `Object.keys(nls)` 에는 나오지 않습니다.

::: tip 자리표시자 형식
`get` 이 바꾸는 것은 `{이름}` (영문, 숫자, `_`, `-`) 입니다. ENOVIA NLS 에 많은 `{0}` 형식은 배열로 넘기면 됩니다. `nls.get('msg', ['PRT-0001'])` 은 `{0}` 을 `'PRT-0001'` 로 바꿉니다. `params` 가 빈 객체면 바꾸지 않고 원문을 돌려줍니다.
:::

### UWA.i18n 과 위젯 설정 라벨

`i18n!` 로 읽은 객체는 `UWA.i18n` 사전에도 합쳐집니다. 위젯 설정 라벨은 `UWA.i18n(label)` 로 번역되므로 **라벨에 NLS 키를 쓰면 번역되어 보입니다**. 3DDashboard 프레임에서는 NLS 를 읽을 때마다 설정 목록을 다시 보냅니다 (`onUpdatePreferences`). 자세한 내용은 [위젯 설정](/widget/preferences#라벨-번역).

## css!

```js
define('DS/MyWidget/PartList', [
  'UWA/Core',
  'css!DS/MyWidget/MyWidget.css'
], function (UWA) { ... });
```

- `<head>` 에 `<link rel="stylesheet" href=".../MyWidget/MyWidget.css">` 를 넣고, 로드가 끝나면 다음으로 넘어갑니다.
- `.css` 는 생략해도 됩니다 (`css!DS/3DPlay/3DPlay`). 로더가 떼었다가 다시 붙입니다.
- 같은 이름은 한 번만 넣습니다 (RequireJS 가 이름으로 기억).
- 묶음 파일 규칙은 적용되지 않습니다. 쓴 경로 그대로 읽습니다.
- ENOVIA 코드는 폴더 전체 CSS `css!DS/폴더/폴더.css` 를 가장 많이 씁니다. UIKIT 처럼 다른 폴더 CSS 를 쓰는 경우도 많습니다.

::: warning CSS 가 없으면 화면 전체가 멈춥니다
CSS 파일이 404 면 `styleerror` 로 그 `require` 전체가 실패합니다. 모듈은 정상이어도 콜백이 불리지 않습니다. 오타가 의심되면 네트워크 탭에서 `.css` 요청을 먼저 봅니다.
:::

## text!

```js
define('DS/MyWidget/Config', [
  'text!DS/MyWidget/assets/config.json',
  'text!DS/MyWidget/assets/row.html'
], function (configText, rowHtml) {
  var config = JSON.parse(configText);
});
```

- XHR GET 으로 읽어 **문자열** 을 돌려줍니다. JSON 도 직접 `JSON.parse` 해야 합니다.
- 확장자를 자동으로 붙이지 않습니다. 파일 이름 전체를 씁니다.
- HTTP 400 이상 또는 상태 0 이면 오류입니다. 시간 제한은 `waitSeconds` (기본 30 초) 입니다.
- ENOVIA 코드의 확장자: `.json` 631 건, `.html` 255 건, `.handlebars` 60 건 순.
- 로그인 정보(WAFData)를 붙이지 않는 일반 요청입니다. 3DSpace REST 같은 서버 API 는 [WAFData](/uwa/request) 로 부릅니다.

## 플러그인 비교

| | `i18n!` | `css!` | `text!` |
| --- | --- | --- | --- |
| 확장자 | `.json` 생략 | `.css` 생략 가능 | 직접 씀 |
| 묶음 파일 | `폴더_언어.js` 먼저 | 없음 | 없음 |
| 실패 시 | 영어 → JSON 순으로 재시도 후 오류 | 즉시 오류 | 즉시 오류 |
| 캐시 무효화 | `urlArgs` 에 `debug` 가 있으면 JSON 에 `bust=난수` | `urlArgs` | `urlArgs` |
