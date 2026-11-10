# PlatformAPI <Badge type="info" text="원본 분석" />

`DS/PlatformAPI/PlatformAPI` 는 3DDashboard 가 가진 정보(로그인 사용자, 현재 테넌트, 대시보드 설정)를 위젯에 전달하고, 위젯 사이 메시지(publish / subscribe)를 보내는 모듈입니다. 모듈 이름 사용 746 건 / 314 파일.

::: info 근거
PlatformAPI/PlatformAPI.js 전체 (297 줄), MessageBus/MessageBus.js, Tenant/Tenant.js. 호출부 집계(`PlatformAPI.xxx(` 형태): `publish` 34, `getUser` 31, `subscribe` 16, `getTenant` 12, `getApplicationConfiguration` 9, `getWidgetTenant` 9, `unsubscribe` 5. 2026 PlatformAPI.js 와 비교함
:::

## 동작 방식

대부분의 함수는 **대시보드 최상위 창** 에 이미 로드된 `DS/UWPClientCode/PublicAPI` 를 동기 `require` 로 꺼내 그 결과를 복사(`UWA.clone`)해 돌려줍니다.

| 상황 | 결과 |
| --- | --- |
| 3DDashboard 안 위젯 | 대시보드 정보가 나옴 |
| 단독 실행, 다른 도메인 iframe | 최상위 창에 PublicAPI 가 없어 `undefined`. 콘솔에 RequireJS `notloaded` 로그가 남을 수 있음 |

- 결과는 복사본이라 바꿔도 대시보드에 영향이 없습니다.
- 동기 함수라 콜백이 없습니다. 값이 없으면 `undefined` 입니다. 늘 `if (user)` 처럼 확인합니다.

## 함수

| 함수 | 결과 | 출처 |
| --- | --- | --- |
| `getUser()` | 로그인 사용자 객체. `login`, `firstName`, `lastName` 등 | PublicAPI |
| `getUserProperty(name)` | 사용자 속성 하나 | PublicAPI |
| `getUserTrigram()` <Badge type="warning" text="2026" /> | `user.trigram` &#124;&#124; `user.login` &#124;&#124; `user.id` &#124;&#124; `''` | `getUser()` |
| `getTenant()` | 대시보드의 현재 테넌트(플랫폼 id) | `DS/Tenant/Tenant` 값, 없으면 `window.dsTenantId` |
| `getWidgetTenant()` | `widget.getValue('x3dPlatformId')`. 위젯이 속한 플랫폼 | 위젯 값 |
| `setTenant(id)` | 대시보드 테넌트 값 바꾸기 | `DS/Tenant/Tenant` |
| `getApplicationConfiguration(key)` | 대시보드 설정 값 하나 (아래 표) | PublicAPI |
| `getApplicationConfigurationBoolean(key)` <Badge type="warning" text="2026" /> | 위 값이 문자열 `'true'` 면 `true` | PublicAPI |
| `getAllApplicationConfigurations()` | 설정 전체 | PublicAPI |
| `getContextRoles(...)` / `setContextRoles(...)` | 컨텍스트 역할 | PublicAPI |
| `getUserDashboardTemplates()` <Badge type="warning" text="2026" /> | 사용자 대시보드 템플릿 | PublicAPI |
| `getContextShareInfo()` <Badge type="warning" text="2026" /> | 공유 컨텍스트 정보 | PublicAPI |
| `publish(topic, data, targets?)` | 위젯 사이 메시지 보내기 | MessageBus |
| `subscribe(topic, callback)` | 메시지 받기. `Subscription` 을 돌려줌 | MessageBus |
| `unsubscribe(subscription 또는 topic)` | 받기 해제 | MessageBus |
| `patchWidgetData({ widget, patches })` | 위젯 값을 JSON Patch 형식으로 바꾸고 대시보드에 알림. Promise | 위젯 환경 |

```js
require(['DS/PlatformAPI/PlatformAPI'], function (PlatformAPI) {
  var user = PlatformAPI.getUser();
  var login = user ? user.login : null;
  var tenant = PlatformAPI.getTenant();
  var platformId = PlatformAPI.getWidgetTenant() || tenant;
});
```

::: tip getTenant 와 getWidgetTenant
`getTenant()` 는 대시보드 전체의 현재 테넌트이고, `getWidgetTenant()` 는 이 위젯 값 `x3dPlatformId` 입니다. 여러 플랫폼을 쓰는 환경에서는 위젯마다 다를 수 있으므로 서버 주소를 찾을 때는 `x3dPlatformId` 를 먼저 씁니다. 2026 에서는 `getTenant()` 가 마지막으로 주소의 `?tenant=` 값도 봅니다.
:::

::: warning getWidgetConstant 는 없습니다
`getWidgetConstant(` 호출(5 건)은 Foundation, CollaborativeTasks 앱이 자기 객체에 만든 함수입니다. PlatformAPI 에는 없습니다.
:::

### getApplicationConfiguration 키

ENOVIA 코드에서 많이 읽는 키입니다.

| 키 | 사용 | 내용 |
| --- | --- | --- |
| `app.urls.myapps` | 33 | Compass(My Apps) 서비스 주소. Compass 서비스들이 내부에서 씀 |
| `app.urls.registry` | 27 | 플랫폼 레지스트리 주소 |
| `app.urls.passport` | 13 | 3DPassport 주소 |
| `app.build.isCloud` | 11 | 클라우드 여부 (문자열) |
| `app.mp.tenant` | 5 | |
| `app.build.name` | 3 | 빌드 이름 |

3DSpace 주소는 여기에 없습니다. [Compass 서비스](/widget/compass-services#getserviceurl) 로 얻습니다.

## publish / subscribe

```js
var sub = PlatformAPI.subscribe('myapp.part.selected', function (data, message) {
  console.log(data.id, message.topic);
});

PlatformAPI.publish('myapp.part.selected', { id: 'PRT-0001' });

sub.unsubscribe();
```

| 항목 | 동작 |
| --- | --- |
| 채널 | 모두 `'Widgets'` 채널 |
| 범위 | 같은 창 + 모든 하위 iframe + 부모 창으로 전달 (`crossFrame`). 받은 창이 다시 이웃 창에 전달해서 대시보드 전체에 퍼짐 |
| 자기 자신 | 보낸 위젯 안의 구독자도 받음 |
| 데이터 | `JSON.stringify` 했다가 받는 쪽에서 `JSON.parse`. 함수, DOM, 순환 객체는 못 보냄. `undefined` 는 `{}` 로 감 |
| 콜백 인자 | `(data, message)`. `message` 는 `{ channel, topic, timestamp, data(문자열) }` |
| 호출 시점 | 비동기 (`setTimeout 0`). 콜백 안 오류는 따로 던져져 다른 구독자에 영향 없음 |
| 와일드카드 | 점(`.`)으로 나눈 topic 에서 `*` 는 한 칸, `#` 은 여러 칸. `'myapp.*'`, `'myapp.#'` |
| 신뢰 출처 | 플랫폼 서비스 주소(`getPlatformServices` 결과의 `http...` 값)와 같은 origin 의 창 메시지만 받음 |
| `targets` | 기본 `['web']`. `'web-in-win'` 을 넣으면 원래 topic 대신 `webinwin:web:notification` (원래 topic 은 `message.originalTopic`) 으로도 보냄. 데스크톱 앱 안 위젯(Web-in-Win)용으로 보입니다 |

::: warning unsubscribe 에 topic 문자열을 넘기면
`PlatformAPI.unsubscribe('myapp.part.selected')` 는 이 프레임의 `Widgets` 채널에서 그 topic 에 맞는 **모든** 구독을 지웁니다. 같은 프레임의 다른 모듈 구독도 사라집니다. `subscribe` 가 돌려준 객체로 해제합니다.
:::

ENOVIA 코드의 topic 예: `common.3DNotification.topic` (알림, 6 건), `im.ds.com` (메신저). 같은 위젯 안 이벤트는 [widget.dispatchEvent](/widget/widget-api#사용자-이벤트) 가 더 간단합니다.

## 2026 변경

| 항목 | 2025 | 2026 |
| --- | --- | --- |
| `getUserTrigram`, `getApplicationConfigurationBoolean`, `getUserDashboardTemplates`, `getContextShareInfo` | 없음 | 추가 |
| `getTenant()` 값이 없을 때 | `window.dsTenantId` | `window.dsTenantId` → 주소의 `?tenant=` |
| `setTenant()` | 값만 바꿈 | `DS/PubSub/PubSub` 로 `PlatformAPI:setTenant` 도 보냄 |
