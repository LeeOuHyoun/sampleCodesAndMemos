# Compass 서비스 (i3DXCompassPlatformServices) <Badge type="info" text="원본 분석" />

`DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices` 는 플랫폼의 서비스 주소(3DSpace, 3DSwym, 3DSearch ...), 사용자에게 부여된 역할, 앱 정보를 알려 주는 모듈입니다. 위젯에서 **3DSpace 주소를 얻는 표준 방법** 이 이 모듈의 `getServiceUrl` 입니다. 모듈 이름 사용 366 건 / 216 파일.

::: info 근거
i3DXCompassPlatformServices/i3DXCompassPlatformServices.js (위임 껍데기, `i3DXCompassRegistryClient`, `OpenWith`, `i3DXCompassPlatformAgreement`), i3DXCompass/i3DXCompass.js 의 실제 구현 `DS/i3DXCompass/i3DXCompassServices`, `ServiceApi/GrantedRolesApi`, `ServiceApi/UserServiceApi`. 호출부 집계(`i3DXCompassPlatformServices.xxx(` 형태): `getServiceUrl` 19, `getPlatformServices` 10, `getAppInfo` 7, `getGrantedRoles` 4. `serviceName:` 값은 `"3DSpace"` 123 건, `"3DSwym"` 39, `"3DSearch"` 32, `"3DDashboard"` 21, `"3DCompass"` 19, `"3DDrive"` 17
:::

## 동작 방식

이 모듈 자체에는 구현이 거의 없습니다. 호출하면 **최상위 창(top)** 의 `require` 로 Compass 모듈을 불러 그쪽 함수에 넘깁니다.

| 함수 | 실제로 부르는 모듈 |
| --- | --- |
| `getServiceUrl`, `getPlatformServices`, `getPlatformConfig`, `getUser` | `DS/i3DXCompass/i3DXCompassServices` |
| `getAppInfo`, `getAppsInfo`, `getBusinessMethodApps`, `getBusinessExperiences`, `searchApplication` | `DS/i3DXCompass/i3DXCompass` |
| `getGrantedRoles` | `DS/i3DXCompass/ServiceApi/GrantedRolesApi` |
| `getPortfolioRole` | `DS/i3DXCompass/ServiceApi/PortfolioApi` |

- 3DDashboard 안에서는 대시보드가 이미 Compass 를 초기화해 두었으므로 바로 응답합니다.
- Compass 는 My Apps 서비스 주소(`app.urls.myapps`)를 알아야 동작합니다. 단독 실행에서는 이 주소가 없어 **콜백이 영영 오지 않을 수 있습니다** (주소가 정해질 때까지 기다림). 단독 실행도 고려하면 시간 제한을 둡니다 ([3DSpace 주소와 SecurityContext](/widget/space-url)).
- 2026 에서는 최상위 창을 찾을 때 `window.dsDashboardWindow.top` 이 있으면 그것을 먼저 씁니다.

## getServiceUrl

```js
require(['DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices'], function (CompassServices) {
  CompassServices.getServiceUrl({
    serviceName: '3DSpace',
    platformId: widget.getValue('x3dPlatformId'),
    onComplete: function (url) {
      console.log(url);
    },
    onFailure: function () {
      console.error('no service');
    }
  });
});
```

| 옵션 | 설명 |
| --- | --- |
| `serviceName` | 필수. `'3DSpace'`, `'3DSwym'`, `'3DSearch'`, `'3DDashboard'`, `'3DCompass'`, `'3DDrive'`, `'3DPassport'` ... |
| `onComplete` | 필수. 없으면 아무것도 하지 않음 |
| `platformId` | 플랫폼 id. 보통 `widget.getValue('x3dPlatformId')` |
| `onFailure` | Compass 목록 요청 실패 |
| `public` | 공개 플랫폼 목록에서 찾음 |
| `role` | 역할 기준 목록 |
| `caa` | `true` 면 공개(`public`) 서비스만 |
| `config` | `{ myAppsBaseUrl, userId, lang }`. Compass 가 초기화되지 않은 곳에서 직접 알려 줄 때 |

`onComplete` 로 오는 값은 `platformId` 유무에 따라 다릅니다.

| `platformId` | `onComplete(값)` |
| --- | --- |
| 있음 | 주소 문자열. 그 플랫폼이나 서비스가 없으면 `undefined` |
| 없음 | 배열 `[{ platformId, url }, ...]`. 서비스가 없는 플랫폼은 `url` 이 없음 |

::: warning
- 함수 이름은 `getServiceUrl` 입니다 (`URL` 이 아님). `getServiceURL(name, platformId)` 형태는 ENOCharacteristicsApp 같은 앱이 결과를 보관해 두고 만든 자기 함수입니다.
- 서비스가 없어도 `onFailure` 가 아니라 `onComplete(undefined)` 입니다. 값을 꼭 확인합니다.
- 플랫폼 목록은 `platformId` 가 있으면 5 분, 없으면 6 시간 캐시합니다.
:::

## getPlatformServices

플랫폼별 서비스 주소를 한꺼번에 받습니다.

```js
CompassServices.getPlatformServices({
  platformId: widget.getValue('x3dPlatformId'),
  onComplete: function (platform) {
    var spaceUrl = platform['3DSpace'];
    var swymUrl = platform['3DSwym'];
  },
  onFailure: function () { ... }
});
```

| `platformId` | `onComplete(값)` |
| --- | --- |
| 있음 | 객체 하나 (없으면 `undefined`) |
| 없음 | 배열 |

```js
{
  platformId: '<플랫폼 id>',
  displayName: '<플랫폼 이름>',
  type: '...',                         // 온프레미스에서는 없음
  '3DSpace': 'https://<3DSpace 서버>/3dspace',
  '3DSwym': 'https://<3DSwym 서버>',
  '3DSearch': 'https://<3DSearch 서버>',
  '3DDashboard': '...'
}
```

`getPlatformConfig({ platformId, key?, onComplete })` 는 같은 목록의 `config` 부분(플랫폼 설정 값)을 돌려줍니다.

## getUser

```js
CompassServices.getUser({
  platformId: widget.getValue('x3dPlatformId'),
  onComplete: function (user) { ... },
  onFailure: function () { ... }
});
```

- Compass 의 `api/pull/self` 결과입니다. 1 시간 캐시합니다.
- `platformId` 를 주면 `platforms` 대신 그 플랫폼의 `platform` 과 `admin` (`platform.role === 'admin'`) 이 들어갑니다. 사용자가 그 플랫폼에 없으면 `onFailure` 입니다.
- 로그인 이름만 필요하면 동기 함수 [PlatformAPI.getUser()](/widget/platform-api) 가 간단합니다.

## getGrantedRoles

```js
CompassServices.getGrantedRoles(function (roles) {
  roles.forEach(function (role) {
    console.log(role.id, role.name, role.platforms);
  });
});
```

- 인자는 **콜백 함수 하나** 입니다. `{ onComplete }` 객체를 넘기면 아무 일도 일어나지 않습니다.
- 결과는 부여된 역할 배열 `[{ id, name, platforms }]` 입니다. `id` 는 역할 코드, `platforms` 는 그 역할이 부여된 플랫폼 id 목록입니다.
- 역할이 하나도 없으면 Compass 로드 완료를 기다립니다. 실패 콜백은 없습니다.
- [WidgetServices.getGrantedRoles(callback, platformId)](/widget/widget-services#함수) 는 이것을 감싸 플랫폼으로 거른 `id` 배열만 줍니다.

## getAppInfo

```js
CompassServices.getAppInfo({
  appId: widget.getValue('x3dAppId'),
  onComplete: function (app) {
    if (!app) { return; }
    console.log(app.icon, app.platforms, app.launchInfos);
  }
});
```

Compass 를 찾지 못하면 `onComplete()` 가 인자 없이 불립니다. `getAppsInfo`, `searchApplication` 도 같은 방식입니다.

## OpenWith

`DS/i3DXCompassPlatformServices/OpenWith` 는 객체를 "다른 앱으로 열기" 메뉴 항목을 만들어 줍니다. 사용 66 건 / 47 파일.

```js
require(['DS/i3DXCompassPlatformServices/OpenWith'], function (OpenWith) {
  var content = {
    protocol: '3DXContent',
    version: '0.1',
    source: widget.getValue('x3dAppId'),
    widgetId: widget.id,
    data: {
      items: [{
        envId: widget.getValue('x3dPlatformId'),
        serviceId: '3DSpace',
        contextId: securityContext,
        objectId: '<physicalid>',
        objectType: 'VPMReference',
        displayName: 'PRT-0001'
      }]
    }
  };

  var openWith = new OpenWith();
  openWith.set3DXContent(content);
  openWith.retrieveCompatibleApps(function (items) {
    items.forEach(function (item) {
      console.log(item.name, item.text);
    });
  });
});
```

| 메서드 | 설명 |
| --- | --- |
| `set3DXContent(content, typesMode?)` | 열 객체 지정 (`3DXContent` 형식). 이어 쓰기 가능 |
| `retrieveCompatibleApps(callback)` | 이 객체 타입을 열 수 있는 앱 메뉴 항목 배열. 최대 4 개 + "다른 앱" |
| `render(dropdown)` | `addItem` / `getItem` / `removeItem` 을 가진 드롭다운 메뉴에 "연결 프로그램" 하위 메뉴로 넣음. 드롭다운에 `openWith.DROPDOWN_CONF` 항목(이름 `open-with...`)을 먼저 넣어 두어야 함 |
| `setIndex(n)` | 드롭다운 안 위치 |

- 항목은 `{ name: 앱id, text: 앱이름, icon 또는 fonticon, handler }` 입니다. `handler()` 를 부르면 Compass 로 앱 실행을 요청합니다 (`launchApp` 메시지, `origin: 'openWith'`).
- 호환 판단은 `objectTaxonomies` (배열)가 있으면 그것, 없으면 `objectType` 으로 합니다. `objectType` 에 배열을 넣는 것은 콘솔에 deprecated 경고가 나옵니다.
- 앱 목록은 대시보드 Compass 가 가진 것을 씁니다. 단독 실행에서는 앱 목록이 없어 동작하지 않습니다.
- 3DXContent 항목에서 많이 쓰는 키: `envId` 115, `objectId` 112, `serviceId` 102, `objectType` 96, `contextId` 84, `displayName` 73, `displayType` 36 (ENOVIA 코드 집계).
- 열리는 앱은 이 `content` 를 위젯 값 `X3DContentId` (JSON 문자열)로 받는 것으로 보입니다 ([위젯 설정](/widget/preferences#플랫폼이-넣어-주는-값)).

## 2026 변경

| 항목 | 내용 |
| --- | --- |
| 최상위 창 찾기 | `window.dsDashboardWindow.top` 을 먼저 봄 (2025 는 `top` 만) |
| 함수 목록 | 같음 |
