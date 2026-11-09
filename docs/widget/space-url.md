# 3DSpace 주소와 SecurityContext

3DSpace REST 를 부르려면 세 가지가 필요합니다. 위젯이 속한 **플랫폼 id**, 그 플랫폼의 **3DSpace 주소**, 요청 헤더에 넣을 **SecurityContext** 입니다. 이 페이지는 그 순서를 정리합니다. 호출 자체는 [서버 호출 (WAFData)](/uwa/request) 에 있습니다.

샘플: [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) 의 `getSpaceUrl`, `loadSecurityContexts`

::: info 근거
i3DXCompass/i3DXCompass.js 의 `DS/i3DXCompass/i3DXCompassServices` (`getServiceUrl`), WidgetServices/WidgetServices.js (`__getServiceUrlAsync`, `SecurityContextServices`), BksStandalone, DELPPWServices (pno/person 응답 처리), ENOCharacteristicsApp/utils (RequestUtil, PlatformDataProvider). 호출 횟수: `x3dPlatformId` 1,060 건 / 291 파일, `pno/person?current=true` 41 건, `pno/person/getsecuritycontext` 38 건
:::

## 한눈에

```js
var platformId = widget.getValue('x3dPlatformId');

getSpaceUrl(platformId)
  .then(function (spaceUrl) { return getSecurityContext(spaceUrl, platformId); })
  .then(function (ctx) {
    WAFData.authenticatedRequest(ctx.spaceUrl + '/resources/v1/modeler/documents', {
      type: 'json',
      headers: { SecurityContext: ctx.securityContext },
      onComplete: function (data) { ... }
    });
  });
```

| 단계 | 얻는 것 | 방법 |
| --- | --- | --- |
| 1 | 플랫폼 id | `widget.getValue('x3dPlatformId')` |
| 2 | 3DSpace 주소 | `i3DXCompassPlatformServices.getServiceUrl({ serviceName: '3DSpace', platformId })` |
| 3 | SecurityContext 목록과 기본값 | `GET <3DSpace>/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces` |
| 4 | 사용할 SecurityContext | 위젯 설정에 저장한 값 → 사용자 기본값 → 첫 번째 |

## 플랫폼 id

| 방법 | 값 |
| --- | --- |
| `widget.getValue('x3dPlatformId')` | 이 위젯이 속한 플랫폼. 대시보드가 넣어 줌 |
| `PlatformAPI.getWidgetTenant()` | 위와 같음 |
| `PlatformAPI.getTenant()` | 대시보드 전체의 현재 테넌트 |
| `WidgetServices.getTenantID()` | `x3dPlatformId` → 서버가 넣은 값 → 인자 |

- 온프레미스 환경의 플랫폼 id 는 `OnPremise` 로 보입니다. ENOVIA 위젯 일부는 `x3dPlatformId` 를 `defaultValue="OnPremise"` 로 선언하고, ENOCharacteristicsApp 은 값이 없으면 `'OnPremise'` 를 씁니다.
- 값이 없으면 `getServiceUrl` 에 `platformId` 를 넣지 않습니다. 그러면 모든 플랫폼 목록이 배열로 옵니다.

## 서버 주소 (3DSpace)

```js
function getSpaceUrl(platformId) {
  var fallback = WebappsUtils.getWebappsBaseUrl().replace(/webapps\/?$/, '');
  return new Promise(function (resolve) {
    var done = false;
    function finish(url) {
      if (!done) {
        done = true;
        resolve(String(url).replace(/\/$/, ''));
      }
    }
    setTimeout(function () { finish(fallback); }, 5000);
    CompassServices.getServiceUrl({
      serviceName: '3DSpace',
      platformId: platformId || undefined,
      onComplete: function (result) {
        var url = Array.isArray(result) ? (result[0] && result[0].url) : result;
        finish(url || fallback);
      },
      onFailure: function () { finish(fallback); }
    });
  });
}
```

| 방법 | 대시보드 안 | 단독 실행 | 비고 |
| --- | --- | --- | --- |
| `CompassServices.getServiceUrl` | 주소 | 콜백이 안 올 수 있음 | 표준. [Compass 서비스](/widget/compass-services#getserviceurl) |
| `CompassServices.getPlatformServices` | 서비스 주소 객체 | 위와 같음 | 3DSwym 등도 같이 필요할 때 |
| `WidgetServices.get3DSpaceUrlAsync` | 주소 | 10 초 뒤 `<protocol>//<hostname>/3DSpace` | 계산값은 포트가 빠짐. [WidgetServices](/widget/widget-services#get3dspaceurlasync) |
| webapps 주소에서 계산 | 대시보드 webapps 일 수 있음 | 위젯이 3DSpace webapps 에 있으면 정확 | 위 코드의 `fallback` |

::: warning 단독 실행에서 getServiceUrl
Compass 는 My Apps 주소를 알아야 플랫폼 목록을 요청합니다. 대시보드 밖에서는 이 주소가 없어서 `onComplete` 도 `onFailure` 도 불리지 않고 계속 기다립니다. 위 코드처럼 시간 제한과 대체값을 둡니다. ENOVIA 의 WidgetServices 도 10 초 제한을 둡니다.
:::

## SecurityContext

SecurityContext 는 `ctx::<역할>.<조직>.<협업공간>` 형식의 문자열입니다. 3DSpace REST 요청 헤더 `SecurityContext` 에 넣습니다.

### 목록과 기본값 받기

```js
WAFData.authenticatedRequest(spaceUrl + '/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces' + (platformId ? '&tenant=' + encodeURIComponent(platformId) : ''), {
  type: 'json',
  headers: { Accept: 'application/json' },
  onComplete: function (person) { ... },
  onFailure: function (error) { ... },
  onPassportError: function (error) { ... }
});
```

응답 모양입니다.

```json
{
  "name": "<로그인 이름>",
  "preferredcredentials": {
    "role": { "name": "<역할>" },
    "organization": { "name": "<조직>" },
    "collabspace": { "name": "<협업공간>" }
  },
  "collabspaces": [
    {
      "name": "<협업공간>",
      "title": "<협업공간 표시 이름>",
      "couples": [
        { "organization": { "name": "<조직>", "title": "<조직 표시 이름>" }, "role": { "name": "<역할>", "nls": "<역할 표시 이름>" } }
      ]
    }
  ]
}
```

```js
function toContext(role, org, cs) {
  return 'ctx::' + role + '.' + org + '.' + cs;
}

var list = [];
person.collabspaces.forEach(function (cs) {
  cs.couples.forEach(function (c) {
    list.push(toContext(c.role.name, c.organization.name, cs.name));
  });
});
var p = person.preferredcredentials;
var preferred = p && p.role ? toContext(p.role.name, p.organization.name, p.collabspace.name) : null;
```

- 목록은 협업공간 × (조직, 역할) 조합입니다. 화면 표시에는 `title`, `role.nls` 를 씁니다.
- `select` 는 필요한 것만 넣습니다. ENOVIA 코드에는 `select=preferredcredentials` 만 (8 건), `select=collabspaces` 만 (6 건), 둘 다 (22 건) 쓰는 형태가 모두 있습니다.
- `preferredcredentials` 는 비어 있는 객체일 수 있습니다. ENOVIA 코드도 `Object.keys(...).length > 0` 를 확인합니다.
- `tenant` 파라미터는 WidgetServices 가 플랫폼 id 가 있을 때 붙입니다. 3DSpace 가 여러 플랫폼을 서비스하는 환경에서 필요한 것으로 보입니다.

### 기본값만 받기

```js
WAFData.authenticatedRequest(spaceUrl + '/resources/pno/person/getsecuritycontext', {
  type: 'json',
  onComplete: function (res) {
    var sc = res.SecurityContext;
    if (sc && sc.indexOf('ctx::') !== 0) { sc = 'ctx::' + sc; }
  }
});
```

`{ SecurityContext: '...' }` 를 돌려줍니다. `ctx::` 가 없는 경우도 있다고 보고 WidgetServices 는 없으면 붙입니다. 이 방법은 [SecurityContextServices.getSecurityContext](/widget/widget-services#securitycontextservices) 가 쓰는 것입니다.

### 어떤 값을 쓸지

| 순서 | 값 | 이유 |
| --- | --- | --- |
| 1 | 위젯 설정에 저장한 값 (목록에 있을 때만) | 사용자가 위젯마다 고른 값 |
| 2 | `preferredcredentials` (목록에 있을 때만) | 사용자 기본값 |
| 3 | 목록의 첫 번째 | ENOVIA 코드의 마지막 선택 |

DELPPWServices 등 ENOVIA 앱은 이 목록을 `list` 설정 항목으로 만들어 사용자가 고르게 합니다. 이름은 앱마다 다릅니다 (`Credentials`, `xPref_CREDENTIAL`, `securityContext`, `pad_security_ctx` ...). 내 위젯은 하나를 정해 씁니다.

```js
widget.addPreference({
  name: 'securityContext',
  type: 'list',
  label: 'prefSecurityContext',
  options: list.map(function (v) { return { value: v, label: v }; }),
  defaultValue: chosen
});
```

::: warning 저장된 값이 목록에 있는지 확인합니다
사용자의 역할이 바뀌거나 다른 플랫폼에서 위젯을 복사하면 저장된 SecurityContext 가 더 이상 유효하지 않을 수 있습니다. 목록에 없으면 버리고 기본값으로 돌아갑니다. ENOVIA 의 `getValidSecurityContext` 도 같은 확인을 합니다.
:::

## 요청에 쓰기

```js
WAFData.authenticatedRequest(spaceUrl + '/resources/v1/modeler/documents/<id>', {
  type: 'json',
  headers: { SecurityContext: securityContext },
  onComplete: function (data) { ... },
  onFailure: function (error, data) { ... }
});
```

- 쓰기 요청(POST / PUT / DELETE)에는 CSRF 토큰도 필요합니다 ([CSRF 토큰](/uwa/request#csrf-토큰-3dspace-쓰기-요청)).
- Promise 로 감쌀 때 `onPassportError` 를 넣지 않으면 로그인 만료 때 끝나지 않습니다 ([Promise 로 감싸기](/uwa/request#promise-로-감싸기)).
