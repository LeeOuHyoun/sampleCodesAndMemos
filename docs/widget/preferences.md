# 위젯 설정 (preferences) <Badge type="info" text="원본 분석" />

위젯 설정은 사용자가 위젯마다 바꾸는 값입니다 (페이지 크기, 보기 방식, 자격 증명 ...). 정의는 HTML 의 `<widget:preferences>` 나 `widget.addPreference` 로 하고, 값은 `widget.getValue` / `setValue` 로 읽고 씁니다. 화면에 보이지 않는 `hidden` 항목은 위젯 상태 저장용으로 많이 씁니다.

샘플: [WidgetSample.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.html) (hidden, range, boolean, list), [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) (`addPreference` 로 목록 추가)

::: info 근거
UWA2/js/Widget.js (`addPreference`, `getValue`, `setValue`, `getPreferences`, 값 변환 함수), Environments/Standalone.js (`loadPreferencesXML`), Environment.js (`convertSourceToJson`, `onEdit`), Controls/Form.js (`onchange`). 호출부: DELPPWServices (Credentials 목록), ENORouteMgmt/ENOROUTApp.html, EditPropWidget.html. 사용 횟수: `widget.addPreference(` 262, `widget.getPreference(` 325, `widget.getValue(` 3,177, `widget.setValue(` 1,207
:::

## 정의하기

### HTML 로

```html
<widget:preferences>
  <widget:preference name="x3dPlatformId" type="hidden" defaultValue=""></widget:preference>
  <widget:preference name="pageSize" type="range" label="prefPageSize" defaultValue="20" min="10" max="100" step="10"></widget:preference>
  <widget:preference name="showState" type="boolean" label="prefShowState" defaultValue="true"></widget:preference>
  <widget:preference name="viewMode" type="list" label="prefViewMode" defaultValue="list">
    <widget:option value="list" label="viewModeList"></widget:option>
    <widget:option value="tile" label="viewModeTile"></widget:option>
  </widget:preference>
</widget:preferences>
```

### 코드로

```js
widget.addPreference({
  name: 'securityContext',
  type: 'list',
  label: 'prefSecurityContext',
  options: [
    { value: 'ctx::<역할>.<조직>.<협업공간1>', label: '협업공간1 / 역할' },
    { value: 'ctx::<역할>.<조직>.<협업공간2>', label: '협업공간2 / 역할' }
  ],
  defaultValue: 'ctx::<역할>.<조직>.<협업공간1>',
  onchange: 'onChangeSC'
});
```

- 같은 `name` 이 이미 있으면 **교체** 합니다. HTML 에 `hidden` 으로 두었다가, 서버에서 목록을 받은 뒤 `list` 로 바꾸는 방식이 흔합니다 (DELPPWServices 의 Credentials).
- `onLoad` 뒤에 추가하면 `onUpdatePreferences` 가 나가고 대시보드 설정 창에 반영됩니다.
- `setPreferences(배열)` 은 전체를 비우고 다시 넣습니다. `mergePreferences(배열)` 은 없는 이름만 추가합니다.

### 항목 키

| 키 | 설명 |
| --- | --- |
| `name` | 값 이름. 필수 |
| `type` | 아래 7 가지 중 하나. 필수 |
| `label` | 설정 창 글자. 없으면 `name`. NLS 키를 쓰면 번역됨 ([라벨 번역](#라벨-번역)) |
| `defaultValue` | 저장값이 없을 때 값. HTML 에서는 `defaultValue` (브라우저가 `defaultvalue` 로 바꿔도 읽힘) |
| `options` | `list`, `checklist` 의 선택지 `[{ value, label }]`. HTML 에서는 `<widget:option>` |
| `min`, `max`, `step` | `range` 의 범위 |
| `multiple` | `list` 다중 선택. `true` 또는 `'true'` |
| `onchange` | 설정 창에서 값이 바뀔 때 보낼 이벤트 이름. `widget.addEvent('onChangeSC', fn)` 으로 받음. 인자 `(name, value)` |

::: warning onchange 는 코드로 넣습니다
단독 실행은 HTML 속성을 모두 읽지만, UWA 의 위젯 읽기 코드(`convertSourceToJson`)는 `name`, `defaultValue`, `type`, `label`, `step`, `min`, `max` 만 남깁니다. `onchange`, `multiple` 이 필요하면 `addPreference` 로 정의합니다. 단독 실행은 `checklist` 의 `<widget:option>` 도 읽지 않습니다.
:::

### type

| type | 설정 창 | 값의 형태 |
| --- | --- | --- |
| `hidden` | 안 보임. 상태 저장용 | 문자열 |
| `text` | 입력칸 | 문자열 |
| `password` | 비밀번호 입력칸 | 문자열 |
| `list` | 드롭다운 | 문자열. `multiple` 이면 배열 |
| `checklist` | 체크 목록 | 배열 |
| `range` | 슬라이더 | 문자열 (`'20'`) |
| `boolean` | 체크박스 | `true` / `false` |

::: danger 7 가지 외의 type 은 조용히 무시됩니다
`type: 'number'`, `type: 'select'` 처럼 쓰면 오류 없이 **항목이 만들어지지 않습니다**. `getValue` 는 `defaultValue` 도 모른 채 `undefined` 를 돌려줍니다. `name` 이 빠져도 같습니다.
:::

`hidden` 이 아닌 항목이 하나도 없거나 `readOnly` 위젯이면 `hasPreferences()` 가 `false` 이고, 단독 실행의 설정 창에 입력 폼이 그려지지 않습니다.

## 값 읽기, 쓰기

```js
var size = widget.getInt('pageSize');
var showState = widget.getBool('showState');
var mode = widget.getValue('viewMode');

widget.setValue('viewMode', 'tile');
widget.setValue('lastPartId', 'PRT-0001');
widget.deleteValue('lastPartId');
```

### getValue 가 값을 찾는 순서

| 순서 | 출처 |
| --- | --- |
| 1 | `widget.data` 캐시 |
| 2 | 환경의 저장값 (대시보드가 위젯마다 저장한 값, 단독 실행은 메모리) |
| 3 | 정의의 `defaultValue` |
| 4 | `undefined` |

- `setValue` 는 정의가 없는 이름도 저장합니다. ENOVIA 코드는 `propWidgetOpen`, `currentView`, `isOpened` 처럼 화면 상태를 정의 없이 저장해 씁니다. 대시보드에서는 프레임이 값을 대시보드로 보내 위젯마다 저장하는 것으로 보입니다.
- 값이 같으면 `setValue` 는 아무것도 하지 않습니다 (`onUpdateValue` 도 안 나감).
- `setValue(name, null)`, `setValue(name, undefined)`, `deleteValue(name)` 는 저장값을 지웁니다. 그 뒤 `getValue` 는 `defaultValue` 를 돌려줍니다.

::: warning 한 번 읽은 defaultValue 는 캐시됩니다
`getValue` 는 찾은 값을 `defaultValue` 까지 포함해 `widget.data` 에 캐시합니다. 그래서 `getValue('securityContext')` 를 한 번 부른 뒤 `addPreference` 로 `defaultValue` 를 바꿔도 **이전 값이 계속 나옵니다**. 캐시는 `onRefresh` 때 비워집니다. 나중에 기본값을 정하는 항목은 HTML 에서 `defaultValue` 를 빼 두거나, 정한 값을 `setValue` 로 직접 저장합니다 (샘플의 `[5]`).
:::

### 값의 형태

| 정의 | `getValue` 결과 | 저장 형태 |
| --- | --- | --- |
| `boolean` | `true` / `false`. 문자열 `'false'` 와 `''` 는 `false`, 나머지 문자열은 `true` | 그대로 |
| `checklist`, `multiple: true` | 문자열 배열 | JSON 문자열 (`'["a","b"]'`) |
| 그 밖 (`range`, `text`, `list`, `hidden`) | 저장된 그대로. 보통 문자열 | 그대로 |
| 정의 없음 | 저장된 그대로 | 그대로 |

::: warning 숫자는 getInt 로
`range` 와 `text` 는 문자열입니다. `widget.getValue('pageSize') + 10` 은 `'2010'` 이 됩니다. `widget.getInt('pageSize')` 를 쓰거나 `parseInt` 합니다. `getBool` 은 `1`, `'1'`, `'true'`, `true` 만 `true` 입니다.
:::

::: warning 객체는 문자열로 저장합니다
`checklist` / `multiple` 이 아닌 값에 객체를 넣으면 환경에 따라 그대로 저장되지 않을 수 있습니다. ENOVIA 코드는 `JSON.stringify` 해서 넣고 `JSON.parse` 로 읽습니다 (`X3DContentId`, `currentConfig` 등).
:::

### 설정 정의 읽기

| 메서드 | 결과 |
| --- | --- |
| `getPreference(name)` | 정의 복사본 + `value` (현재 값). 없으면 `undefined` |
| `getPreferences()` | 전체 정의 복사본. `label` 과 선택지 `label` 이 번역된 상태 |
| `hasPreference(name)` | 정의가 있는지 |
| `widget.preferences` | 정의 원본 배열 (값 없음) |

## 플랫폼이 넣어 주는 값

3DDashboard 와 다른 앱이 위젯 값으로 넣어 주는 것으로 보이는 이름입니다. ENOVIA 위젯은 이 이름들을 `hidden` 항목으로 선언해 두는 경우가 많습니다 (`x3dPlatformId` 를 `defaultValue="OnPremise"` 로 두는 위젯도 있음).

| 이름 | 내용 | `getValue` 사용 |
| --- | --- | --- |
| `x3dPlatformId` | 위젯이 속한 플랫폼(테넌트) id. 서비스 주소를 찾을 때 씀 | 607 |
| `appId` / `x3dAppId` | 앱 id (`..._AP` 형식) | 265 / 125 |
| `X3DContentId` | 다른 앱이 이 위젯을 열면서 넘긴 객체 정보. JSON 문자열 (아래) | 94 |
| `lang` | 언어. `widget.lang` 이 없을 때 대신 읽음 | 79 |
| `x3dSharedId` | 공유 위젯 id | 49 |

`X3DContentId` 는 `3DXContent` 형식입니다.

```js
var content = JSON.parse(widget.getValue('X3DContentId'));
// {
//   protocol: '3DXContent', version: '0.1', source: '<보낸 앱 id>',
//   data: { items: [ { envId: '<플랫폼 id>', serviceId: '3DSpace', objectId: '<physicalid>', objectType: '<타입>', contextId: '<SecurityContext>' } ] }
// }
```

같은 형식이 "다른 앱으로 열기" 와 끌어다 놓기에서도 쓰입니다 ([OpenWith](/widget/compass-services#openwith)).

## 라벨 번역

`getPreferences()` 는 `label` 마다 `UWA.i18n(label)` 을 부릅니다. `i18n!` 로 읽은 NLS 는 `UWA.i18n` 사전에 합쳐지므로, 라벨에 NLS 키를 쓰면 번역된 글자가 나옵니다 ([i18n!](/amd/plugins#uwa-i18n-과-위젯-설정-라벨)).

```html
<widget:preference name="pageSize" type="range" label="prefPageSize" ...></widget:preference>
```

```json
{ "prefPageSize": "페이지 크기" }
```

- 해당 NLS 를 읽기 전에는 키(`prefPageSize`)가 그대로 보입니다. 3DDashboard 프레임에서는 NLS 를 읽을 때마다 설정 목록을 다시 보내므로 곧 번역된 글자로 바뀝니다.
- 키가 다른 NLS 와 겹치면 나중에 읽은 값이 이깁니다. 위젯 고유 접두어(`prefXxx`, `myWidget.xxx`)를 붙입니다.

## 설정 창 흐름

| 순서 | 단독 실행 | 3DDashboard |
| --- | --- | --- |
| 1 | 머리글 메뉴 → 설정 → `onEdit` | 대시보드 위젯 메뉴의 설정 |
| 2 | UWA 폼이 `getPreferences()` 로 그려짐 | 대시보드가 `getPreferences()` 결과로 그리는 것으로 보임 |
| 3 | 값이 바뀌면 `onchange` 이벤트 | `onchange` 이벤트 |
| 4 | 완료 → 값 저장 → `endEdit` → 바뀐 값이 있으면 `onRefresh` | 값이 `onUpdateValue` 로 들어오고 `endEdit` |

`endEdit` 와 `onRefresh` 를 둘 다 받으면 한 번 설정을 바꿀 때 두 번 그릴 수 있습니다. [widget 객체 - endEdit](/widget/widget-api#endedit) 참고.
