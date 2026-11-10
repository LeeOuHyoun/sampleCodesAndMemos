# widget 객체 <Badge type="info" text="원본 분석" />

위젯 코드에서 쓰는 전역 `widget` 은 `UWA/Widget` 클래스의 인스턴스입니다. 화면 영역, 제목, 설정 값, 이벤트를 모두 이 객체로 다룹니다. 설정 정의와 값은 [위젯 설정](/widget/preferences) 에 따로 정리했습니다.

::: info 근거
UWA2/js/Widget.js, Environment.js (`onRefresh`, `onEdit`, `onViewRequest`, `registerMenus`), Environments/Frame.js (`sendRemote` 로 대시보드에 보내는 이벤트 목록). 2026 의 Widget.js 는 변수 이름만 다르고 동작은 같음. 사용 횟수는 enovia2025 webapps 의 `widget.xxx(` 문자열 기준 (다른 변수 이름으로 부른 것은 빠짐)
:::

샘플: [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) (widget 이벤트, setBody, getValue / setValue)

## 속성

| 속성 | 설명 | 사용 |
| --- | --- | --- |
| `widget.id` | 위젯 인스턴스 id. 같은 대시보드에 같은 위젯을 두 번 올려도 다름. DOM id, 저장 키 접두어로 씀. 단독 실행에서는 `null` | 1,458 |
| `widget.body` | 내용 영역 요소. UWA 메서드(`setContent`, `getElement`, `addEvent` ...)가 붙어 있음 ([DOM](/uwa/element)) | 1,222 |
| `widget.lang` | 언어 2 글자 (`'ko'`, `'en'`). 기본값은 브라우저 언어 앞부분 | 700 |
| `widget.locale` | 국가 (`'kr'`, `'us'`) | 7 |
| `widget.dir` | `'ltr'` 또는 `'rtl'` | |
| `widget.environment` | 실행 환경. `environment.name` 이 `'frame'` (3DDashboard) 또는 `'uwa'` (단독 실행) | 136 |
| `widget.metas` | `<meta>` 값 객체 | |
| `widget.preferences` | 설정 정의 배열. 값은 들어 있지 않음. 값은 `getValue` 로 | 63 |
| `widget.elements` | `wrapper`, `header`, `body`, `edit`, `footer` 등 틀 요소 | 50 |
| `widget.uwaUrl` | 대시보드가 읽은 위젯 HTML 주소 (`getUrl()` 이 이 값을 돌려줌) | 29 |
| `widget.launched`, `widget.readOnly`, `widget.isEdit` | 시작됨 / 읽기 전용 / 설정 창 열림 | |

::: warning widget.data 를 직접 쓰지 않습니다
`widget.data` 는 `getValue` 의 캐시입니다. 직접 바꾸면 저장되지 않고, `onRefresh` 때 비워집니다. 값은 `setValue` 로 씁니다.
:::

## 메서드

### 화면

| 메서드 | 설명 | 사용 |
| --- | --- | --- |
| `setTitle(text, url?)` | 위젯 제목. 대시보드 제목줄에 반영 | 133 |
| `getTitle()` | 태그를 뺀 제목 | 18 |
| `setIcon(url, proxify?)` | 아이콘 | 25 |
| `setBody(content)` | `widget.body.setContent(content)` 와 같음. 등록 전이면 `Widget.body is not yet available` 오류 | 66 |
| `addBody(content)` | 내용 추가 | |
| `getElement(sel)` / `getElements(sel)` | `widget.body` 안에서 찾기 | 63 / 12 |
| `setCounter(n, type?)` | 제목 옆 숫자 | 5 |
| `getViewportDimensions()` | 머리글, 바닥글을 뺀 내용 영역 `{ width, height }` | 32 |

```js
widget.setTitle(nls.get('title'));
widget.setBody(UWA.createElement('div', { 'class': 'my-page', text: nls.get('loading') }));
```

::: warning 제목은 HTML 로 들어갑니다
`setTitle` 값은 단독 실행에서 `setHTML` 로 그려집니다. 객체 이름처럼 사용자 데이터를 넣을 때는 `<`, `&` 를 이스케이프합니다.
:::

### 값

| 메서드 | 설명 | 사용 |
| --- | --- | --- |
| `getValue(name)` | 설정 값. 저장값 → `defaultValue` 순 | 3,177 |
| `setValue(name, value)` | 저장. `undefined` / `null` 이면 지움. 바뀌면 `onUpdateValue` | 1,207 |
| `deleteValue(name)` | `setValue(name)` 과 같음 | 130 |
| `getInt(name)` | 정수. 숫자가 아니면 `0`, `true` 는 `1` | 3 |
| `getBool(name)` | `1`, `'1'`, `'true'`, `true` 면 `true` | 64 |
| `setValues(obj)` | 여러 개 | 9 |

설정 정의(`addPreference` 등)는 [위젯 설정](/widget/preferences) 에 있습니다.

### 이벤트

| 메서드 | 설명 | 사용 |
| --- | --- | --- |
| `addEvent(name, fn)` | 등록. `onLoad` 가 이미 끝났으면 `fn` 을 바로 한 번 실행 | 324 |
| `addEvents({ name: fn, ... })` | 여러 개 | 32 |
| `addEventOnce(name, fn)` | 한 번만 | 10 |
| `removeEvent(name, fn?)` | 해제. `fn` 이 없으면 그 이름 전부 | 50 |
| `dispatchEvent(name, args?)` | 이벤트 보내기. 사용자 이름 이벤트도 됨 | 178 |

### 보기, 메뉴, 기타

| 메서드 | 설명 | 사용 |
| --- | --- | --- |
| `requestView({ type })` / `requestView('maximized')` | 보기 전환 요청. `'windowed'`, `'maximized'`, `'fullscreen'` | 13 |
| `getView()` | 현재 보기. 기본 `{ type: 'windowed' }` | 32 |
| `getUrl()` | 위젯 HTML 주소. 대시보드에서는 프레임 주소가 아니라 원래 위젯 주소 | 64 |
| `setAutoRefresh(분)` | 주기적으로 `onRefresh`. `0` 이면 끔. `<meta name="autoRefresh">` 와 같음 | 5 |
| `setMenu({ name, label, icon, onExecute })` | 위젯 메뉴 항목. `name` 은 `'options/myItem'` 처럼 한 단계 하위까지. `onExecute` 는 보낼 이벤트 이름 | 26 |
| `getMenu(name)` / `removeMenu(name)` | 메뉴 찾기 / 지우기 | 36 |
| `toggleEdit()` | 설정 창 열기 / 닫기 (`onEdit` / `endEdit`) | |

```js
widget.setMenu({ name: 'options/export', label: nls.get('export'), icon: 'export', onExecute: 'onExport' });
widget.addEvent('onExport', function () { ... });
```

## 이벤트

| 이벤트 | 언제 | 인자 | 등록 수 |
| --- | --- | --- | --- |
| `onLoad` | 시작. 설정 값이 준비된 뒤 | - | 35 |
| `onRefresh` | 새로고침 메뉴, `autoRefresh` 주기, 설정 변경 후 | - | 46 |
| `endEdit` | 설정 창을 닫음 | - | 47 |
| `onEdit` | 설정 창을 엶 | - | 5 |
| `onResize` | 위젯 크기 변경 | - | 35 |
| `onViewChange` | 보기 전환이 끝남 | `{ type, previous }` | 7 |
| `onSearch` | 대시보드 검색창에서 "이 위젯에서 검색" 으로 보입니다 | 검색어 문자열 | 37 |
| `onResetSearch` | 위 검색을 지움 | - | 17 |
| `onUpdateValue` | `setValue` 로 값이 바뀜 | `(name, value)` | 2 |
| `onUpdatePreferences` | 설정 정의가 바뀜 | `(preferences)` | |
| `onKeyboardAction` | 위젯 안 keydown | `(keyCode, event)` | |
| `beforeLoad` / `afterLoad` | `onLoad` 직전 / 직후 | - | |
| `onDestroy` | UWA 에는 없는 이벤트. 앱 코드나 대시보드가 보내는 것으로 보입니다 (`dispatchEvent("onDestroy"` 28 건) | - | 12 |

등록 수는 `widget.addEvent("이름"` 형태만 센 것입니다. `widget.addEvents({ ... })` 안의 것은 빠졌습니다.

### onLoad

```js
widget.addEvent('onLoad', function () {
  widget.setTitle(nls.get('title'));
  render();
});
```

- `onLoad` 전에는 설정 값이 준비되지 않았을 수 있습니다. 값을 읽는 코드는 `onLoad` 안에서 시작합니다.
- 다시 열었을 때 이어서 보여 줄 화면 상태(선택한 객체, 탭)는 `setValue` 로 저장해 둡니다. ENOVIA 코드도 `propWidgetOpen`, `currentView` 같은 값을 이렇게 저장합니다.

### onRefresh

::: warning onRefresh 를 달지 않으면 onLoad 가 다시 불립니다
환경의 기본 `onRefresh` 는 값 캐시(`widget.data`)를 비우고, 위젯에 `onRefresh` 핸들러가 **없으면 `onLoad` 를 다시 보냅니다**. `onLoad` 에서 이벤트 등록이나 DOM 생성을 하면 새로고침할 때마다 겹칩니다. `onRefresh` 를 따로 달거나, `onLoad` 를 여러 번 불러도 안전하게 만듭니다.
:::

### endEdit

```js
widget.addEvent('endEdit', function () {
  render();
});
```

- 단독 실행의 설정 창은 "완료" 를 누르면 값을 모두 `setValue` 한 뒤 `endEdit` 를 보내고, **값이 하나라도 바뀌었으면 이어서 `onRefresh`** 를 보냅니다. 두 이벤트에 같은 처리를 달면 두 번 실행됩니다.
- 3DDashboard 의 설정 창은 대시보드가 그리는 것으로 보입니다. 프레임은 대시보드에서 온 `onUpdateValue` 를 받아 `widget.setValue` 하고, `endEdit` 도 같은 통로로 받습니다.

### onViewChange

```js
widget.addEvent('onViewChange', function (view) {
  if (view.type === 'maximized' || view.type === 'fullscreen') {
    showDetail();
  }
});
```

### 사용자 이벤트

`dispatchEvent` 로 아무 이름이나 보낼 수 있습니다. 설정 항목의 `onchange` 값, 메뉴의 `onExecute` 값도 이 이름으로 옵니다.

```js
widget.addEvent('onPartSelected', function (id) { ... });
widget.dispatchEvent('onPartSelected', ['PRT-0001']);
```

인자는 배열로 넘깁니다. 위젯 사이 메시지는 [PlatformAPI publish / subscribe](/widget/platform-api#publish-subscribe) 를 씁니다.
