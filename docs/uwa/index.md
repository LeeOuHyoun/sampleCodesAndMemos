# UWA 개요 <Badge type="info" text="원본 분석" />

UWA (Universal Widget API) 는 3DEXPERIENCE 화면 코드의 기반 라이브러리입니다. 유틸 함수, DOM 다루기, 클래스 / 이벤트, Model / View, Promise 를 제공합니다. enovia2025 webapps 의 모듈 폴더 1,659 개 중 1,116 개가 `UWA/Core` 또는 `UWA/Class` 를 씁니다.

::: tip 공식 문서와의 관계
UWA 는 3DS 위젯 개발 문서에 일부 공개된 API 입니다. 이 문서는 ENOVIA 원본 코드 기준의 **실제 동작과 함정**, ENOVIA 코드에서 쓰는 패턴을 중심으로 정리합니다.
:::

::: info 근거
webapps/UWA2/js/ 의 모듈별 소스 (Core.js, Element.js, Class.js, Class/*.js, Promise.js). 모듈 폴더 수와 참조 횟수는 enovia2025 webapps 전체 소스의 의존성 문자열 `"UWA/..."` 를 센 값.
:::

## 원본 위치

| 경로 | 내용 |
| --- | --- |
| `webapps/UWA2/js/` | 모듈별로 나뉜 소스 (`Core.js`, `Element.js`, `Class/Model.js` ...). 분석은 이 폴더 기준 |
| `webapps/c/UWA/js/` | 묶음 파일. `UWA_Frame_Alone.js` (모듈 49 개), 대시보드용 `UWA_WPlatform_Alone_full.js` (123 개) 등 |
| `webapps/UWAUtils/` | `DS/UWAUtils/...` 보조 모듈 |

## 많이 쓰는 모듈

| 묶음 | 모듈 (참조 횟수) | 문서 |
| --- | --- | --- |
| 기반 | `UWA/Core` (6,684), `UWA/Utils` (363), `UWA/String` (204), `UWA/Json` (90) | [Core 유틸](/uwa/core) |
| DOM | `UWA/Element` (206), `UWA/Event` (219), `UWA.createElement` 호출 5,288 회 | [DOM](/uwa/element) |
| 클래스 | `UWA/Class` (2,533), `Class/Options`, `Class/Events`, `Class/Listener`, `Class/Timed` | [클래스](/uwa/class) |
| MVC | `Class/View` (1,269), `Class/Model` (475), `Class/Collection` (241) | [Model, Collection, View](/uwa/mvc) |
| 비동기 | `UWA/Promise` (521), `UWA/Class/Promise` (402, 예전 이름) | [Promise](/uwa/promise) |
| 통신 | `UWA/Data` (64). 서버 호출은 실제로 `DS/WAFData/WAFData` 를 씀 | [서버 호출](/uwa/request) |
| 위젯 / 환경 | `UWA/Utils/InterCom` (117), `UWA/Utils/Client` (141) | [위젯 간 통신](/uwa/intercom), [Core 유틸](/uwa/core#환경-정보-utils-client) |

참조 횟수는 의존성 문자열 `"UWA/..."` 기준입니다. minify 된 코드는 `UWA/Core` 를 짧은 변수로 받아 쓰므로 함수 호출 횟수는 실제보다 적게 잡힙니다.

## 불러오기

```js
require([
  'UWA/Core',
  'UWA/Element',
  'UWA/Class/View',
  'UWA/Promise'
], function (UWA, Element, View, Promise) {
  UWA.createElement('div', { text: 'hello' }).inject(document.body);
});
```

- `UWA/Core` 가 돌려주는 객체가 전역 `UWA` 와 같습니다. 다른 모듈을 불러오면 `UWA.Element`, `UWA.Class` 처럼 그 아래에 등록됩니다.
- `UWA.createElement` 는 `UWA/Element` 가 등록합니다. Core 만 불러서는 생기지 않습니다.

## 자주 틀리는 것

| 틀린 생각 | 실제 | 문서 |
| --- | --- | --- |
| `UWA.merge` 는 덮어쓰기 | 비어 있는 키만 채움 | [Core 유틸](/uwa/core) |
| `UWA.extend` 는 깊은 복사 | 세 번째 인자 `true` 일 때만 깊게 | [Core 유틸](/uwa/core) |
| `createElement('div', { className })` | `'class'` 를 써야 함. `style` 도 무시되고 `styles` 를 써야 함 | [DOM](/uwa/element#옵션-키) |
| `el.addEvent('onClick')` | 요소는 `'click'`. `onClick` 은 컨트롤 / 클래스 이벤트 | [DOM](/uwa/element#이벤트) |
| `this._parent()` 를 콜백에서 호출 | 메서드 실행 중에만 유효. 먼저 변수에 담아야 함 | [클래스](/uwa/class#상속과-parent) |
| View 는 render 를 자동 호출 | 직접 `render()` 를 불러야 함 | [Model, Collection, View](/uwa/mvc#view) |
| WAFData `onFailure(response)` | `(error, data, headers)`. 상태 코드는 `error.message` 안에만 있음 | [서버 호출](/uwa/request#주의) |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [Core 유틸](/uwa/core) | 객체 합치기, 복사, 타입 검사, 환경 정보 |
| [DOM (Element, Event)](/uwa/element) | `createElement`, 요소 메서드, 이벤트 |
| [클래스 (UWA/Class)](/uwa/class) | `extend`, `init`, `_parent`, Options / Events mixin |
| [Model, Collection, View](/uwa/mvc) | 데이터 변경 이벤트로 화면을 갱신하는 구조 |
| [Promise](/uwa/promise) | `UWA/Promise`, deferred, 예전 `UWA/Class/Promise` |
| [서버 호출 (WAFData)](/uwa/request) | `authenticatedRequest`, CSRF 토큰 |
| [위젯 간 통신 (InterCom)](/uwa/intercom) | 창(iframe, 위젯) 사이 Server / Socket 메시지 |

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [01_element.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/01_element.html) | createElement, 요소 메서드, 이벤트 위임, 잘못된 키 비교 | [DOM](/uwa/element) |
| [02_class.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/02_class.html) | Class.extend, _parent, Options / Events mixin, merge / extend 비교 | [클래스](/uwa/class), [Core 유틸](/uwa/core) |
| [03_mvc.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/03_mvc.html) | Model, Collection, View 로 만든 목록 화면 | [Model, Collection, View](/uwa/mvc) |

::: warning
샘플은 `<3DSpace>/webapps/UWASample/` 에 두고 ENOVIA 서버 주소로 열어야 동작합니다. UWA 샘플은 원본 소스 분석으로 작성했고, 서버에서 동작 확인을 아직 하지 않았습니다. 다르게 동작하면 원본 쪽이 맞습니다.
:::
