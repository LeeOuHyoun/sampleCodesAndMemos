# 보안 컨텍스트 (SecurityContext) <Badge type="info" text="원본 분석" />

3DSpace REST 를 부를 때 헤더 `SecurityContext` 에 "어떤 역할로, 어느 조직, 어느 협업공간에서" 일하는지를 넣습니다. 같은 사용자라도 이 값에 따라 보이는 객체와 할 수 있는 일이 달라집니다.

::: info 근거
DELWeb3DUtils `getSecurityContextPromise`, DELPPWServices (보안 컨텍스트 목록과 선호값 선택), ENOPartMgt/scripts/PartUtility.js `retrieveSecurityContext`, DocumentManagement `_prepareService`, Foundation/Foundation.js `ajaxRequest`, ENOCharacteristicsApp/utils/RequestUtil.js
:::

## 형식

```
ctx::<역할>.<조직>.<협업공간>
```

| 부분 | 값 | 예 |
| --- | --- | --- |
| 접두어 | 항상 `ctx::` | `ctx::` |
| 역할 | 역할의 **내부 이름** (`role.name`) | `VPLMProjectLeader` |
| 조직 | 조직의 **내부 이름** (`organization.name`) | `MyOrg` |
| 협업공간 | 협업공간의 **내부 이름** (`collabspace.name`) | `MyCollabSpace` |

예: `ctx::VPLMProjectLeader.MyOrg.MyCollabSpace`

::: warning 표시 이름(title)을 쓰지 않습니다
응답에는 `name` 과 `title`(또는 `nls`) 이 같이 옵니다. 컨텍스트 문자열에는 `name` 을 씁니다. 화면에 보여 줄 때만 `title`, `nls` 를 씁니다.
:::

## 얻는 방법

### 1. 사용자 정보에서 만들기 (가장 많이 씀)

```
GET <3DSpace>/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces
```

`select=` 를 여러 번 붙여 필요한 묶음만 받습니다. 소스에서 본 값은 `preferredcredentials`, `collabspaces`, `firstname`, `lastname`, `role` 입니다.

응답에서 쓰는 부분:

```json
{
  "preferredcredentials": {
    "role": { "name": "VPLMProjectLeader" },
    "organization": { "name": "MyOrg" },
    "collabspace": { "name": "MyCollabSpace" }
  },
  "collabspaces": [
    {
      "name": "MyCollabSpace",
      "title": "내 협업공간",
      "couples": [
        {
          "organization": { "name": "MyOrg", "title": "내 조직" },
          "role": { "name": "VPLMProjectLeader", "nls": "프로젝트 리더" }
        }
      ]
    }
  ]
}
```

| 키 | 설명 |
| --- | --- |
| `preferredcredentials` | 사용자가 설정한 기본 컨텍스트. 설정이 없으면 빈 객체일 수 있음 |
| `collabspaces[]` | 쓸 수 있는 협업공간 목록 |
| `collabspaces[].couples[]` | 그 협업공간에서 가능한 조직 + 역할 조합. 조합 하나가 컨텍스트 하나 |

```js
function getPreferredSecurityContext(spaceUrl) {
  return new Promise(function (resolve, reject) {
    WAFData.authenticatedRequest(spaceUrl + '/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces', {
      type: 'json',
      headers: { Accept: 'application/json' },
      onComplete: function (res) {
        var pc = res && res.preferredcredentials;
        if (pc && pc.role && pc.organization && pc.collabspace) {
          resolve('ctx::' + pc.role.name + '.' + pc.organization.name + '.' + pc.collabspace.name);
        } else {
          reject(new Error('선호 컨텍스트 없음'));
        }
      },
      onFailure: reject,
      onPassportError: reject
    });
  });
}
```

### 2. 서버가 정해 주는 값

```
GET <3DSpace>/resources/pno/person/getsecuritycontext
```

응답 `{ "SecurityContext": "ctx::..." }` 의 값을 그대로 씁니다. `?tenant=<플랫폼 id>` 를 붙이는 코드도 많습니다 (38 건 중 약 절반).

### 3. 위젯 설정에 저장된 값

ENOVIA 위젯은 사용자가 고른 컨텍스트를 위젯 설정에 저장해 둡니다. 키 이름은 앱마다 다릅니다.

| 키 | 쓰는 곳 | 값 |
| --- | --- | --- |
| `Credentials` | DELPPWServices 계열 | `ctx::` 를 포함한 전체 |
| `Current_security_credentials` | ENOCharacteristicsApp | `ctx::` 없이 `역할.조직.협업공간` |

내 위젯은 내 키를 정해서 쓰면 됩니다.

## 고르는 순서

DELPPWServices 는 다음 순서로 고릅니다. 직접 만들 때도 같은 순서를 권장합니다.

1. 위젯 설정에 저장된 값이 있고, 지금 사용자의 `collabspaces` 목록에 있으면 그것
2. 아니면 `preferredcredentials` 로 만든 값이 목록에 있으면 그것
3. 둘 다 없으면 목록의 첫 번째

고른 값은 다시 위젯 설정에 저장합니다.

## 헤더에 넣기

| 방식 | 쓰는 곳 |
| --- | --- |
| `SecurityContext: 'ctx::...'` 그대로 | IssueServices, ENOCharacteristicsApp, DELPPWServices 등 대부분 |
| `SecurityContext: encodeURIComponent('ctx::...')` | Foundation, DocumentManagement, VCXWebPlatform |

이름에 공백이나 `+` 같은 문자가 있을 수 있어 Foundation 쪽은 인코딩해서 보냅니다. 두 방식이 모두 동작하는 것으로 보입니다.

::: tip ctx:: 를 빼먹지 않습니다
일부 코드는 내부에 `역할.조직.협업공간` 만 보관하고 헤더를 만들 때 `'ctx::' +` 를 붙입니다. DocumentManagement 는 넘겨받은 값이 `ctx::` 로 시작하지 않으면 붙여 줍니다. 헤더에는 항상 `ctx::` 로 시작하는 값을 넣습니다.
:::

## 협업공간 목록만 필요할 때

| 엔드포인트 | 응답 |
| --- | --- |
| `GET /resources/bps/cspaces` | `{ cspaces: [...] }` |
| `GET /resources/enocsmrest/collabspaces?tenant=<플랫폼 id>` | 협업공간 목록 (W3DSpace 계열) |

컨텍스트 문자열을 만들려면 조직과 역할도 필요하므로 보통 1번(`pno/person`)을 씁니다.
