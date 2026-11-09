# 선택 (CSOManager, HSOManager, PSOManager)

`DS/Selection` 의 세 매니저는 "지금 선택된 것들" 목록을 창(window) 하나에서 공유합니다. 셋 다 같은 바탕 클래스 `DS/Selection/XSO` 로 만든 싱글톤이고, 이벤트 채널 이름만 다릅니다.

| 모듈 | 전역 이름 | 채널 | 뜻 |
| --- | --- | --- | --- |
| `DS/Selection/CSOManager` | `WUX.Selection.CSOManager` | `CSO/` | Current Selected Objects. 현재 선택 |
| `DS/Selection/HSOManager` | `WUX.Selection.HSOManager` | `HSO/` | 강조(highlight) 목록으로 보입니다 |
| `DS/Selection/PSOManager` | `WUX.Selection.PSOManager` | `PSO/` | 미리 선택(마우스 올림) 목록으로 보입니다 |

::: info 근거
Selection/Selection.js (XSO 1~470행, 각 매니저 473행~). 호출부: SPYUI (`CSOManager.onAdd`, `unique`), CSIViewModelWebInterfaces (`CSOManager.add({ pathElement })`), 3DPlayExperienceModule, VCXWebKernel, VCXWebComposer (`PSOManager.empty`)
:::

::: warning 위젯 사이 공유가 아닙니다
같은 창 안에서만 하나입니다. 다른 위젯의 선택을 받으려면 [PlatformAPI](/widget/platform-api) 나 [InterCom](/uwa/intercom) 을 씁니다. ENOVIA 코드에서 CSOManager 는 주로 3D 뷰어(`pathElement`) 선택에 쓰입니다.
:::

## 기본 사용

```js
require(['DS/Selection/CSOManager'], function (CSOManager) {
  var token = CSOManager.onPostAdd(function (added) {
    console.log('추가됨', added);
  });

  CSOManager.add({ id: 'PRT-0001' });
  CSOManager.add([{ id: 'PRT-0002' }, { id: 'PRT-0003' }]);
  console.log(CSOManager.get().length);

  CSOManager.unique({ id: 'PRT-0002' });
  CSOManager.remove({ id: 'PRT-0002' });
  CSOManager.empty();

  CSOManager.unsubscribe(token);
});
```

모듈이 돌려주는 값이 이미 인스턴스입니다. `new` 하지 않습니다.

## 메서드

| 메서드 | 설명 |
| --- | --- |
| `add(item 또는 배열)` | 추가. 이미 있는 항목은 건너뜀 |
| `remove(item 또는 배열)` | 제거 |
| `empty()` | 전부 제거 |
| `unique(item)` | 그 항목 하나만 선택된 상태로 만듦 (비우고 추가). 이미 그 하나만 있으면 아무것도 안 함 |
| `get()` | 선택 배열. **내부 배열을 그대로** 돌려줌 |
| `isIn(item)` | 들어 있는지 |
| `isEmpty()` | 비었는지 |
| `isBeingEmptied()` | `empty()` 처리 중인지 |
| `unsubscribe(token)` | 구독 해제 |
| `getLength()` <Badge type="warning" text="2026" /> | 개수 |
| `isInUniqueTransaction()` <Badge type="warning" text="2026" /> | `unique()` 처리 중인지 |

::: warning get() 을 고치지 않습니다
`get()` 은 복사본이 아닙니다. 돌려받은 배열에 `push`, `splice` 하면 매니저 내부가 바뀌고 이벤트는 나가지 않습니다. 필요하면 `get().slice()` 로 복사해서 씁니다.
:::

## 같은 항목 판단

| 항목 모양 | 비교 방법 |
| --- | --- |
| `{ pathElement: ... }` | `pathElement.isEqual()`. 3D 뷰어 경로 객체 |
| 그 밖의 객체 | 키와 값을 끝까지 비교 (깊은 비교) |

그래서 `{ id: 'A' }` 를 두 번 `add` 해도 하나만 남습니다. `{ id: 'A', title: 'x' }` 와 `{ id: 'A' }` 는 다른 항목입니다. 같은 객체로 보려면 항상 같은 모양(예: `{ id }` 만)으로 넣습니다.

## 이벤트

구독 메서드는 모두 토큰을 돌려줍니다. 구독 함수의 `this` 는 `window` 입니다.

| 구독 메서드 | 발생 시점 | 받는 값 |
| --- | --- | --- |
| `onPreAdd(fn)` | `add` 시작 | `add` 에 넘긴 값 그대로 (항목 또는 배열) |
| `onAdd(fn)` | 항목 하나 추가될 때마다 | 항목 하나 |
| `onPostAdd(fn)` | `add` 끝 | 실제로 추가된 항목 배열 (중복은 빠짐) |
| `onPreRemove(fn)` | `remove`, `empty` 시작 | 항목 배열 |
| `onRemove(fn)` | 항목 하나 제거될 때마다 | 항목 하나 |
| `onPostRemove(fn)` | `remove`, `empty` 끝 | 제거된 항목 배열 |
| `onPreEmpty(fn)` | `empty` 시작 | 현재 항목 배열 |
| `onEmpty(fn)` | `empty` 끝 | `null` |
| `onChange(fn)` | 항목 하나 추가 / 제거될 때마다 | 항목 하나 |
| `onUpdate(fn)` | `onEmpty` + `onRemove` + `onAdd` 를 한 번에 등록 | 위 각각 |

::: warning onUpdate 는 토큰을 돌려주지 않습니다
`onUpdate` 는 내부에서 구독 세 개를 만들지만 반환값이 없어서 해제할 수 없습니다. 해제가 필요하면 `onAdd`, `onRemove`, `onEmpty` 를 따로 등록하고 토큰을 보관합니다.
:::

`empty()` 를 부르면 `PRE_REMOVE` → `PRE_EMPTY` → 항목마다 `REMOVE` → `POST_REMOVE` → `EMPTY` 순서로 나갑니다. `unique()` 는 비우기 이벤트 뒤에 `add` 이벤트가 이어서 나갑니다. 이때 CSO / HSO / PSO 매니저(`useUniqueID: false`)는 `PRE_EMPTY`, `EMPTY` 를 내보내지 않습니다. `onEmpty` 만 보고 있으면 `unique()` 를 놓칩니다.

## 내부 이벤트 이름

매니저는 전역 `Events` 가 아니라 **자기 ModelEvents** 로 발행합니다. 전역 `Events.subscribe` 로는 받지 못합니다.

| 이름 | 구독 메서드 |
| --- | --- |
| `/WEBAPP/CSO/PRE_ADD` | `onPreAdd` |
| `/WEBAPP/CSO/ADD` | `onAdd` |
| `/WEBAPP/CSO/POST_ADD` | `onPostAdd` |
| `/WEBAPP/CSO/PRE_REMOVE`, `REMOVE`, `POST_REMOVE` | `onPreRemove`, `onRemove`, `onPostRemove` |
| `/WEBAPP/CSO/PRE_EMPTY`, `EMPTY` | `onPreEmpty`, `onEmpty` |
| `/WEBAPP/CSO/UPDATE` | `onChange` |

## 직접 XSO 만들기

내 화면 전용 선택 목록이 필요하면 `DS/Selection/XSO` 를 `new` 합니다. 전역 매니저와 섞이지 않습니다.

```js
require(['DS/Selection/XSO'], function (XSO) {
  var mySelection = new XSO({
    eventChannel: 'MYAPP/',
    useUniqueID: true,
    getElementID: function (item) { return item.id; }
  });
  mySelection.onPostAdd(function (items) { console.log(items); });
  mySelection.add({ id: 'PRT-0001', title: '브라켓' });
});
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `eventChannel` | - | 이벤트 이름 가운데 부분. `'MYAPP/'` 처럼 `/` 로 끝냄 |
| `useUniqueID` | `false` | `true` 면 id 로 보관. 비교가 빠름 |
| `getElementID(item)` | - | `useUniqueID` 일 때 id 를 돌려주는 함수. `null` 을 돌려주면 예외 |
| `areEquals(a, b)` | 깊은 비교 | `useUniqueID` 가 아닐 때 비교 함수 |
| `publishOnlyPrePostEvents` | `false` | `true` 면 항목마다 나가는 `ADD`, `REMOVE`, `UPDATE` 를 생략 |

`useUniqueID: true` 에 `getElementID` 가 없으면 항목 객체에 `__xso__` 속성을 붙여서 구분합니다. 항목 객체가 바뀌는 것이 싫으면 `getElementID` 를 줍니다.
