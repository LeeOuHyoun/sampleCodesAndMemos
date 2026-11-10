# Core 유틸 <Badge type="info" text="원본 분석" />

`UWA/Core` 는 객체 합치기, 복사, 타입 검사 같은 기본 함수를 제공합니다. 이름은 jQuery, lodash 와 비슷하지만 **동작이 다른 것이 많아서** 그대로 옮겨 쓰면 잘못되기 쉽습니다.

샘플: [02_class.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/02_class.html) (merge / extend / clone / is 비교)

::: info 근거
UWA2/js/Core.js, Utils.js, String.js, Array.js, Json.js, Utils/Client.js. Core.js 를 node 에서 직접 실행해 결과를 확인함. 호출 횟수(근사): `is` 약 24,000, `createElement` 약 6,300, `clone` 약 1,800, `extend` 약 1,300, `merge` 약 1,000
:::

## 한눈에

| 함수 | 비슷한 것 | 다른 점 |
| --- | --- | --- |
| `extend(target, src, deep?)` | `Object.assign`, `$.extend` | 소스는 **1 개만**. 세 번째 인자는 deep 여부 |
| `merge(target, defaults)` | `_.defaults` | 비어 있는(`undefined`, **`null`**) 키만 채움. 얕게 |
| `clone(value, deep = true)` | `_.cloneDeep` | **기본이 깊은 복사**. Map, 클래스 인스턴스는 일반 객체가 됨 |
| `is(value)` | `value != null` | `0`, `''`, `false` 도 true. `NaN` 만 false |
| `is(value, type)` | `typeof` | `'array'`, `'element'`, `'plain'` 등 세분화. 대소문자 구분 |

## extend

```js
UWA.extend(target, source);
UWA.extend(target, source, true);
```

- `source` 의 키를 `target` 에 **덮어씁니다**. 값이 `undefined` 여도 덮어씁니다. `target` 이 바뀌고 그것을 돌려줍니다.
- 세 번째 인자가 `true` 면 일반 객체끼리만 깊게 합칩니다. 배열, Date, 클래스 인스턴스는 깊게여도 **참조째 바꿔 넣습니다**.

```js
UWA.extend({ o: { x: 1, y: 1 } }, { o: { x: 9 } });        // { o: { x: 9 } }
UWA.extend({ o: { x: 1, y: 1 } }, { o: { x: 9 } }, true);  // { o: { x: 9, y: 1 } }
```

::: warning 소스를 여러 개 넣으면
`UWA.extend(target, a, b)` 는 `b` 를 deep 플래그로 읽고 합치지 않습니다. jQuery `$.extend(true, target, a, b)` 와 순서도 다릅니다. 여러 개는 `UWA.extend(UWA.extend(target, a), b)` 처럼 나눠 부릅니다.
:::

## merge

```js
var options = UWA.merge(userOptions || {}, { pageSize: 50, sort: 'name' });
```

- `target` 에 **없는 키만** 채웁니다. 이미 값이 있으면 그대로 둡니다. 이름과 달리 덮어쓰지 않습니다.
- `null` 도 없는 것으로 봅니다. `0`, `''`, `false` 는 값이 있는 것으로 봅니다.
- 얕게 동작합니다. 중첩 객체 안의 키는 채우지 않습니다.

```js
UWA.merge({ a: 1, b: null, d: 0, o: { x: 1 } }, { a: 2, b: 2, d: 2, g: 2, o: { y: 2 } });
// { a: 1, b: 2, d: 0, o: { x: 1 }, g: 2 }
```

ENOVIA 코드의 관용 형태는 "옵션을 얕게 복사 → 기본값 채우기" 입니다.

```js
var opts = UWA.clone(options || {}, false);
UWA.merge(opts, defaults);
```

## clone

```js
UWA.clone(value);         // 깊은 복사
UWA.clone(value, false);  // 얕은 복사
```

| 값 | 결과 |
| --- | --- |
| 배열, 일반 객체 | 복사 (깊게 / 얕게) |
| Date | 새 Date |
| DOM 요소 | `cloneNode` |
| RegExp, 함수, 기본값 | 같은 것을 그대로 |
| Map, Set, 클래스 인스턴스 | **일반 객체 `{}` 로 바뀜** (내용과 prototype 손실) |

## is, typeOf

```js
UWA.is(value);                       // undefined, null, NaN 이 아니면 true
UWA.is(value, 'string');
UWA.is(value, ['string', 'number']); // 둘 중 하나
```

| type | 참이 되는 값 |
| --- | --- |
| `'string'`, `'number'`, `'boolean'`, `'function'`, `'array'`, `'date'`, `'regexp'`, `'error'` | 해당 타입. `NaN` 은 `'number'` 가 아님 |
| `'object'` | 위 어느 것도 아닌 객체. **배열, Date, 함수, null 은 false** |
| `'plain'` | `{}` 리터럴로 만든 객체 |
| `'element'` | DOM 요소 (`nodeType` 이 숫자인 객체) |
| `'class'` | `UWA.Class.extend` 로 만든 클래스. ES6 `class` 는 `'function'` |
| `'finite'` | 전역 `isFinite` 기준. `null`, `''`, `'12'` 도 true |
| `'event'`, `'nodelist'`, `'document'`, `'window'`, `'blob'`, `'file'`, `'formdata'`, `'arraybuffer'`, `'typedarray'` | 해당 타입 |

`UWA.typeOf(value)` 는 위 이름을 문자열로 돌려줍니다. `null`, `undefined`, `NaN` 은 `false` 를 돌려줍니다. Map, Set, Promise 는 `'object'` 입니다.

::: warning type 이름 오타는 항상 false
type 문자열은 검사하지 않고 그대로 비교합니다. `'Boolean'` (대문자), `'stringad'` 처럼 틀리면 오류 없이 항상 false 입니다. 실제 ENOVIA 코드에도 이런 오타가 있습니다.
:::

## 그 밖의 Core 함수

| 함수 | 설명 |
| --- | --- |
| `equals(a, b)` | 깊은 비교. `NaN` 끼리 true. Map / Set 은 내용이 달라도 true 이므로 쓰지 않음 |
| `owns(obj, key)` | own 속성인지. `obj` 가 null 이어도 안전 |
| `result(obj, key, default?)` | 값이 함수면 호출한 결과. `undefined` 일 때만 default |
| `namespace(path, value, parent?, mode?)` | `'A/B/C'` 경로에 값 등록 (아래) |
| `log(msg)` | 콘솔 출력. 인자는 하나만 출력됨 |
| `i18n(key)` / `i18n(dict, lang?)` | 번역 / 사전 등록. 번역이 없으면 key 를 그대로 돌려줌 |
| `getGlobal()` | 전역 객체 (`window`) |
| `version`, `debug`, `hosts`, `paths` | 설정값 |

### namespace

```js
UWA.namespace('MyApp/Utils', { format: function () {} });
```

- `parent` 를 생략하면 **전역(`window`)** 에 만듭니다. 위 코드는 `window.MyApp.Utils` 를 만듭니다.
- 같은 경로가 이미 있으면 기본으로 `Duplicate NameSpace` 오류가 납니다. 네 번째 인자로 바꿉니다.

| mode | 동작 |
| --- | --- |
| 없음 | 오류 |
| `'extend'` | 기존 것에 새 값을 덮어씀 |
| `true` | 기존 객체를 유지하면서 깊게 합침 |
| `'replace'` | 새 객체를 쓰지만 겹치는 키는 **기존 값이 남음** (이름과 반대) |

## UWA.Utils

`UWA/Utils` 를 불러오면 생깁니다.

| 묶음 | 함수 |
| --- | --- |
| URL | `parseUrl(url)`, `composeUrl(parts)`, `buildUrl(base, rel)`, `matchUrl(a, b)` (같은 출처인지), `isAbsoluteUrl`, `isValidUrl`, `encodeUrl` |
| 쿼리 문자열 | `parseQuery(str)`, `toQueryString(obj)`, `getQueryString(url, name, default)` |
| 배열 | `toArray(x)`, `splat(x)` (배열이 아니면 배열로 감쌈, null 이면 `[]`) |
| ID | `getUUID()`, `getUniqueId(prefix)`, `getCRC32(str)`, `getCheckSum(str)` |
| 인코딩 | `base64Encode`, `base64Decode` (UTF-8 안전) |
| 함수 | `attempt(fn, onError, ctx, ...args)`, `memoize(fn, keyFn)`, `setImmediate` / `clearImmediate` |
| XML / HTML | `loadXml`, `loadHtml`, `xmlToString`, `setCss(id, css, scope)` |
| 기타 | `random(min, max)` (양 끝 포함) |

## UWA.String, UWA.Array, UWA.Json

| 모듈 | 함수 |
| --- | --- |
| `UWA.String` | `format('{0} {1}', a, b)`, `truncate(s, len, suffix)`, `cut`, `escapeHTML`, `unescapeHTML`, `stripTags`, `capitalize`, `camelCase`, `unCamelCase`, `isEmail`, `contains`, `rgbToHex`, `hexToRgb`, `parseRelativeTime` |
| `UWA.Array` | `detect(arr, fn)` (= find), `invoke(arr, method, ...args)`, `erase(arr, item)` (원본에서 모두 제거) |
| `UWA.Json` | `encode` / `decode` (= JSON), `prune(value)` (직렬화할 수 있는 복사본), `isJson(str)`, `path(obj, jsonPath)`, `xmlToJson(xml)` |

::: warning 기본 prototype 에 메서드가 추가됩니다
`UWA/String`, `UWA/Array` 를 불러오면 `String.prototype`, `Array.prototype` 에도 같은 이름의 메서드가 붙습니다 (`'abc'.truncate()`). 다른 라이브러리와 이름이 겹칠 수 있습니다. `UWA.String.stripScripts(s, true)` 는 스크립트를 eval 하므로 쓰지 않습니다.
:::

## 환경 정보 (Utils/Client)

`UWA/Utils/Client` 는 브라우저, OS, 기능 지원 여부를 알려 줍니다.

```js
require(['UWA/Utils/Client'], function (Client) {
  Client.Locale.lang;      // 'ko'
  Client.Engine.name;      // 'chrome'
  Client.Platform.name;    // 'win64'
  Client.Features.touch;   // true / false
});
```

| 속성 | 내용 |
| --- | --- |
| `Engine` | `{ name, version, ... }`. `Engine.chrome`, `Engine.edge` 처럼 이름으로도 확인 |
| `Platform` | `{ name, ipad, tablet, windows }`. 터치가 되는 Mac 은 `ios` 로 판정 |
| `Features` | `touch`, `touchEvents`, `pointerEvents`, `cors`, `fullscreen`, `dragAndDrop`, `flexboxCSS` ... |
| `Locale` | `{ lang, locale, dir }` |
| 함수 | `getSize()`, `getScrolls()`, `getScrollbarWidth()`, `getOrientation()`, `isOnline()` |

불러오면 `<html>` 요소에 `chrome chrome120 win64` 같은 클래스가 붙습니다. CSS 에서 브라우저별 처리에 쓸 수 있습니다.

## 2026 버전 차이

- `UWA.hosts` 기본값이 `{ uwa: '', exposition: '' }` 로 바뀌었습니다. `UWA.hosts.netvibes` 에 의존하는 코드는 2026 에서 `undefined` 가 됩니다.
- `UWA.driver` 가 항상 `'Alone'` 입니다.
- `c/UWA/js` 묶음 파일이 16 개에서 6 개로 줄었습니다 (`UWA_Frame_Alone`, `UWA_Frame_Alone_Full`, `UWA_Standalone_Alone`, `UWA_Swym_Alone_Full`, `UWA_W3C_Alone`, `UWA_WPlatform_Alone_full`).
- extend, merge, clone, is, Utils, String, Array, Json, Promise 의 동작은 같습니다.
