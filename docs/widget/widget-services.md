# WidgetServices

`DS/WidgetServices/WidgetServices` 는 ENOVIA 앱들이 같이 쓰는 위젯 도우미입니다. 위젯 값 읽기, 플랫폼 id, 언어, 3DSpace 주소를 "대시보드 안이든 밖이든 일단 답을 주는" 방식으로 감싸 둡니다. 같은 묶음의 `SecurityContextServices` 는 SecurityContext 를 구해 줍니다. 모듈 이름 사용 263 건 / 78 파일.

::: info 근거
WidgetServices/WidgetServices.js 의 `DS/WidgetServices/WidgetServices` (도우미 객체), `DS/WidgetServices/securityContextServices/SecurityContextServices` (싱글톤 클래스), `assets/nls/SecurityContextNls`. `SecurityContextServices` 사용 48 건 / 27 파일 (EditPropWidget, AccessRightWidget, DMUReadPersistence 등). 2026 은 함수 목록이 같음
:::

## 함수

```js
require(['DS/WidgetServices/WidgetServices'], function (WidgetServices) {
  var platformId = WidgetServices.getTenantID();
  var lang = WidgetServices.getLanguage();
  WidgetServices.get3DSpaceUrlAsync({
    platformId: platformId,
    onComplete: function (spaceUrl) { ... }
  });
});
```

| 함수 | 설명 |
| --- | --- |
| `getWidgetObject()` | 전역 `widget`. **없으면 빈 UWA 위젯을 만들어 `window.widget` 에 넣음** (단독 웹앱용) |
| `getWidgetValue(name)` / `setWidgetValue(name, v)` / `deleteWidgetValue(name)` | `widget.getValue` 등. 위젯이 없을 때는 자체 메모리에 보관 |
| `addWidgetPreference(p)`, `setWidgetPreferences(arr)`, `getWidgetPreference(name)`, `getWidgetPreferenceValue(name)` | 설정 정의 |
| `getWidgetId()` | `widget.id`. 위젯이 없으면 `'0'` |
| `getWidgetBody()` | `widget.body`. 없으면 `document.body` |
| `addWidgetResizeEvent(fn)` / `removeWidgetResizeEvent(fn)` | `onResize` |
| `getTenantID(default?)` | `widget.getValue('x3dPlatformId')` → 서버가 넣은 `enoviaServerCAWidget.tenant` → `default` |
| `setTenantID(id)` | `x3dPlatformId` 저장 |
| `getLanguage()` | `COMPASS_CONFIG.lang` → `widget.lang` → `widget.getValue('lang')` → 최상위 창 `dsLang` → `'en'` |
| `get3DSpaceUrlAsync(opts)` | 3DSpace 주소 (아래) |
| `get3DSwymUrlAsync(opts)`, `get3DSearchUrlAsync(opts)`, `getCompassUrlAsync(opts)` | 각 서비스 주소. 실패하면 `''` |
| `getSourceUrlAsync({ source: '서비스이름', ... })` | 임의 서비스 주소 |
| `getServicesUrl({ platformId, onComplete })` | 그 플랫폼의 서비스 주소 객체. 실패하면 `{}` |
| `getTenants(callback)` | 플랫폼 id 배열. `x3dPlatformId` 가 비어 있으면 첫 번째로 채움 |
| `getGrantedRoles(callback, platformId?)` | 역할 `id` 배열 |
| `getUrlParameter(name)` | 최상위 창과 현재 창 주소의 쿼리 값 |
| `isWebInWinEnvironment()`, `isCatiaV5Environment()`, `isSolidworksEnvironment()` | 주소의 `addinmode` 값으로 판단 |
| `getFullUrl()`, `getServerUrl()`, `get3DSpaceUrl()` | 현재 페이지 기준 주소 계산 (아래 주의) |

## get3DSpaceUrlAsync

```js
var request = WidgetServices.get3DSpaceUrlAsync({
  platformId: widget.getValue('x3dPlatformId'),
  onComplete: function (spaceUrl) {
    console.log(spaceUrl);
  }
});
```

| 단계 | 동작 |
| --- | --- |
| 1 | `platformId` 가 없으면 주소의 `?tenant=`, 그다음 `getTenantID()` |
| 2 | 같은 서비스 + 플랫폼 결과가 캐시에 있으면 바로 `onComplete` |
| 3 | [i3DXCompassPlatformServices.getServiceUrl](/widget/compass-services#getserviceurl) 호출 |
| 4 | 10 초 안에 답이 없거나 실패하면 `get3DSpaceUrl()` 값으로 `onComplete` (`withoutTimeout: true` 면 기다림) |

- `onFailure` 는 없습니다. 항상 `onComplete` 로 무언가 옵니다.
- 돌려받는 객체의 `cancel()` 로 취소할 수 있습니다.
- 3DSwym 등 다른 서비스는 실패 시 `''` 입니다.

::: warning get3DSpaceUrl() 의 계산값
실패 시 쓰는 `get3DSpaceUrl()` 은 `location.protocol + '//' + location.hostname + '/3DSpace'` 입니다. **포트가 빠지고 경로는 항상 `/3DSpace`** 입니다. 3DSpace 가 다른 포트나 다른 경로(`/3dspace` 등)에 있으면 틀린 주소가 됩니다. 이 값이 오면 실제로는 Compass 응답이 없었던 것입니다.
:::

## SecurityContextServices

```js
require(['DS/WidgetServices/securityContextServices/SecurityContextServices'], function (SCServices) {
  SCServices.getInstance({ tenant: widget.getValue('x3dPlatformId') }).getSecurityContext({
    onSuccess: function (result) {
      console.log(result.SecurityContext);
    },
    onFailure: function (error) {
      console.error(error.code, error.message);
    }
  });
});
```

| 메서드 | 서버 호출 | 결과 |
| --- | --- | --- |
| `getInstance(options)` | - | 싱글톤에 옵션을 넣고 자신을 돌려줌 |
| `getSecurityContext({ onSuccess, onFailure })` | `GET <3DSpace>/resources/pno/person/getsecuritycontext?tenant=...` | 사용자 기본 SecurityContext. `{ SecurityContext: 'ctx::...' }` |
| `getValidSecurityContext({ onSuccess, onFailure })` | `GET <3DSpace>/resources/modeler/pno/person?current=true&select=collabspaces&tenant=...` | `options.context` 의 값이 사용자에게 실제 부여된 것인지 확인. 아니면 첫 번째 부여값 |

| 옵션 | 설명 |
| --- | --- |
| `tenant` | 플랫폼 id. 없으면 `getTenantID()` |
| `source` | 서비스 이름. 기본 `'3DSpace'` |
| `context` | `getSecurityContext()` 함수를 가진 객체. 있으면 서버 대신 이 값을 씀 |
| `alwaysUpdate` | `true` 면 매번 서버에 다시 물음 |
| `widgetIsPinned` | `true` 면 `getValidSecurityContext` 가 `context` 를 무시 |

- 결과 문자열에 `ctx::` 가 없으면 붙여 줍니다. 헤더에는 그대로 `SecurityContext: result.SecurityContext` 로 넣습니다.
- 한 번 받은 값은 싱글톤 안에 보관합니다. **페이지 안의 모든 코드가 같은 객체** 를 쓰므로 `getInstance` 옵션이 서로 덮어씁니다.
- `getValidSecurityContext` 에 `context` 가 없으면 기본값이 아니라 **목록의 첫 번째** 를 줍니다. 사용자 기본값이 필요하면 `getSecurityContext` 를 씁니다.
- `getValidSecurityContext` 는 요청이 실패하면 한 번 더 시도합니다. 오류 객체는 `{ code: 'ERROR' 또는 'TO', message }` 이고 메시지는 `SecurityContextNls` 에서 번역됩니다.

::: tip 직접 구할 수도 있습니다
같은 두 REST 를 [WAFData](/uwa/request) 로 직접 불러도 됩니다. 응답 형식과 목록 만드는 방법은 [3DSpace 주소와 SecurityContext](/widget/space-url#securitycontext) 에 정리했습니다.
:::
