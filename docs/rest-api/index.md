# 3DSpace REST API 공통 규칙 <Badge type="info" text="원본 분석" />

3DSpace 서버는 `/resources/...` 아래에 REST 서비스를 제공합니다. ENOVIA 화면 코드는 대부분 이것을 `WAFData.authenticatedRequest` 로 부릅니다. 이 페이지는 **화면 코드가 실제로 보내는 헤더, 파라미터, 본문, 응답 모양**을 정리합니다. 호출 함수 자체는 [서버 호출 (WAFData)](/uwa/request) 을 봅니다.

| 페이지 | 내용 |
| --- | --- |
| 이 페이지 | URL, 헤더, 응답 형식, 쓰기 본문, 오류 |
| [보안 컨텍스트](/rest-api/security-context) | `SecurityContext` 값 얻기 |
| [엔드포인트 목록](/rest-api/catalog) | 소스에서 찾은 엔드포인트 표 |
| [문서 (documents)](/rest-api/documents) | 가장 많이 쓰는 `modeler/documents` 상세 |

::: info 근거
Foundation2/Foundation2.js (`applyUpdates`, `__generateUpdateWidget`, `__copyModifiedObject`, `__postprocessServerFailureMessage`), Foundation/Foundation.js `ajaxRequest`, DocumentManagement (`DocumentFoundationAjax`, `IndependentServiceBase`), VCXWebPlatform `runRequest` / `WSInformation`, IssueServices (dslib 호출), CAT3DWebStoreyComponents (dscstr 호출), DELWKOModelServices, DELPPWWebServices `getHeaders`
:::

샘플: [WidgetSample.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/WidgetSample/WidgetSample.js) (WAFData.authenticatedRequest 감싸기), [02_drag_drop.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/EventsSample/02_drag_drop.html) (SecurityContext 헤더로 REST 호출)

## URL 구성

```
<3DSpace 주소>/resources/v1/modeler/<서비스>/<경로>?tenant=<플랫폼 id>&<파라미터>
```

| 부분 | 얻는 곳 |
| --- | --- |
| 3DSpace 주소 | 위젯: `i3DXCompassPlatformServices.getServiceURL('3DSpace', platformId)`. 3DSpace 안의 페이지: 현재 주소에서 `/webapps/` 앞부분 |
| 플랫폼 id | `widget.getValue('x3dPlatformId')`. 온프레미스는 `'OnPremise'` 를 기본값으로 쓰는 코드가 많음 |
| `tenant=` | 많은 코드가 붙입니다. 온프레미스에서는 생략해도 되는 것으로 보입니다 |

## 두 가지 계열

`resources/v1/modeler/` 아래 서비스는 응답 모양이 두 가지로 나뉩니다.

| 계열 | 서비스 예 | 응답 | 쓰기 CSRF |
| --- | --- | --- | --- |
| **A. 업무 객체 (Foundation 형식)** | `documents`, `tasks`, `routes`, `meetings`, `subscriptions`, `projects`, `workspaces`, `e6w/service/*` | `{ success, csrf, data: [{ id, type, dataelements, relateddata }] }` | 본문의 `csrf` 또는 헤더 |
| **B. ds 접두어 서비스** | `dseng`, `dslib`, `dsprcs`, `dspfl`, `dsmfg`, `dswo`, `dscstr` ... | `{ totalItems, member: [...] }` | 헤더 `ENO_CSRF_TOKEN` |

B 계열은 경로가 `dslib/dslib:Class/{id}` 처럼 `서비스/서비스:리소스` 모양이고, 기능 호출은 `서비스/invoke/서비스:함수` 모양입니다.

## 헤더

| 헤더 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| `SecurityContext` | 대부분 O | `ctx::역할.조직.협업공간` | [보안 컨텍스트](/rest-api/security-context) |
| `ENO_CSRF_TOKEN` | 쓰기 O | CSRF 토큰 값 | POST, PUT, PATCH, DELETE. A 계열은 본문으로 대신할 수 있음 |
| `Content-Type` | 본문 있을 때 | `application/json` | `$ids=` 같은 form 본문은 `application/x-www-form-urlencoded`. 일부 코드는 `application/ds-json` |
| `Accept` | - | `application/json` | |
| `Accept-Language` | - | `widget.lang` | `typeNLS`, `stateNLS` 같은 번역 값의 언어 |
| `DS-Change-Authoring-Context` | 상황 | `pid:<변경 조치 id>` | 변경 조치(Change Action) 아래에서 작업할 때 (Work Under) |
| `DS-Configuration-Authoring-Context` | 상황 | 구성 컨텍스트 | 구성(Configuration) 편집 화면 |
| `DS-API-Version` | - | 부 버전 문자열 | DELPPWWebServices 가 선택적으로 붙임 |

CSRF 토큰 받는 법은 [서버 호출 - CSRF 토큰](/uwa/request#csrf-토큰-3dspace-쓰기-요청) 을 봅니다. 응답 `csrf` 는 `{ name: 'ENO_CSRF_TOKEN', value: '...' }` 모양이라 `headers[res.csrf.name] = res.csrf.value` 로 넣는 코드도 있습니다.

::: tip A 계열은 본문에 csrf 를 넣습니다
Foundation, DocumentManagement 는 헤더 대신 **요청 본문 최상위에 `csrf` 객체**를 넣습니다. 응답에도 새 `csrf` 가 오고, 받을 때마다 보관 값을 갈아 끼웁니다.

```json
{ "csrf": { "name": "ENO_CSRF_TOKEN", "value": "<토큰>" }, "data": [ ... ] }
```
:::

## 응답 형식 A (업무 객체)

```json
{
  "success": true,
  "csrf": { "name": "ENO_CSRF_TOKEN", "value": "<토큰>" },
  "data": [
    {
      "id": "<physicalid>",
      "type": "Document",
      "cestamp": "<변경 스탬프>",
      "dataelements": {
        "name": "DOC-0001",
        "title": "도면 설명서",
        "revision": "A",
        "state": "IN_WORK",
        "stateNLS": "작업 중",
        "typeNLS": "문서",
        "policy": "Document Release",
        "modified": "...",
        "originated": "..."
      },
      "relateddata": {
        "files": [ { "id": "<file id>", "dataelements": { "title": "a.pdf" } } ],
        "ownerInfo": [ { "dataelements": { "name": "<로그인>", "firstname": "...", "lastname": "..." } } ]
      }
    }
  ],
  "definitions": [ ... ]
}
```

| 키 | 설명 |
| --- | --- |
| `success` | 성공 여부. **HTTP 200 이어도 `false` 일 수 있음** |
| `csrf` | 다음 쓰기 요청에 쓸 토큰 |
| `data[]` | 객체 배열. 한 개를 요청해도 배열 |
| `data[].id` | 객체 id (physicalid) |
| `data[].dataelements` | 속성. 키 이름은 서비스마다 다름 |
| `data[].relateddata` | 관계 객체. `{ 관계이름: [ 같은 모양의 객체 ] }`. `$include=` 로 고름 |
| `data[].cestamp` | 동시 수정 검사용 값 |
| `definitions` | `$definition=true` 일 때 필드 정의 |
| `error` | 실패 때 메시지 |

소스에서 많이 읽는 `relateddata` 키: `files` (192), `lockerInfo` (40), `ownerInfo` (37), `referenceDetails` (29), `originatorInfo` (18), `route`, `tasks`, `assignees`, `versions`, `parents`, `attendees`, `coowners`.

## 응답 형식 B (ds 서비스)

```json
{
  "totalItems": 1,
  "member": [
    { "id": "<physicalid>", "type": "VPMReference", "name": "...", "title": "...", "revision": "A", "cestamp": "..." }
  ]
}
```

- 항목 키는 `$mask` 에 따라 달라집니다.
- 단건 조회도 `member[0]` 으로 읽습니다.

## 쿼리 파라미터

| 파라미터 | 계열 | 예 | 설명 |
| --- | --- | --- | --- |
| `$fields` | A, B | `$fields=none,title`, `$fields=all,!image` | 받을 속성. `none` 은 기본 속성 빼고, `!이름` 은 제외 |
| `$include` | A | `$include=versions`, `$include=none,files,ownerInfo` | 같이 받을 `relateddata` |
| `$mask` | B | `$mask=dslib:LibraryDetailsMask` | 미리 정의된 속성 묶음 |
| `$ids` | A | 본문 `$ids=id1,id2` | 여러 개 조회. URL 길이 때문에 **POST + form 본문**으로 보냄 |
| `$top`, `$skip` | B | `$top=1000` | 페이지 |
| `$searchStr` | B | `.../search?$searchStr=브라켓` | 검색 엔드포인트 |
| `$depth` | B | `$depth=20` | 구조 펼치기 깊이 |
| `$filter` | - | `$filter=dimensionName+eq+Length` | 조건 |
| `$definition` | A | `$definition=true` | 필드 정의 같이 받기 |
| `$terse` | A | `$terse=true` | 응답 줄이기로 보입니다 |
| `e6w-lang`, `e6w-timezone` | A | `e6w-lang=ko` | 언어, 시간대. Foundation2 는 `$language`, `$timezone` 로 바꿔 보냄 |

## 쓰기 본문 A

```json
{
  "csrf": { "name": "ENO_CSRF_TOKEN", "value": "<토큰>" },
  "data": [
    {
      "id": "<기존 객체 id>",
      "updateAction": "MODIFY",
      "dataelements": { "title": "새 제목" },
      "relateddata": {
        "parents": [ { "id": "<부모 id>", "updateAction": "CONNECT" } ]
      }
    }
  ]
}
```

| `updateAction` | 뜻 |
| --- | --- |
| `CREATE` | 새로 만들기. `id` 대신 `tempId` (`'temp_' + 시각 + 난수`) 를 넣고 `type` 을 줌 |
| `MODIFY` | 바뀐 `dataelements` 만 보냄 |
| `DELETE` | 삭제 |
| `CONNECT` | 기존 객체를 관계로 연결 |
| `DISCONNECT` | 관계 끊기 (객체는 남음) |
| `REVISE` | 파일 새 버전 (documents 의 `files`) |
| `NONE` | 그 객체는 바꾸지 않음. 하위 `relateddata` 만 바꿀 때 부모에 씀 |

- 메서드: Foundation2 는 객체 하나를 고칠 때 `PUT <서비스>/{id}`, 여러 개거나 생성이면 `POST <서비스>` 로 보냅니다.
- 삭제는 `DELETE <서비스>/{id}` 에 본문 `{ "csrf": ... }` 를 넣습니다.

## 쓰기 본문 B

ds 서비스는 `items` 배열과 **참조 객체**를 씁니다.

```json
{
  "items": [
    {
      "title": "...",
      "dsmfg:MfgItem": {
        "source": "<3DSpace 주소>",
        "type": "...",
        "identifier": "<physicalid>",
        "relativePath": "/resources/v1/modeler/dsmfg/dsmfg:MfgItem/<physicalid>"
      }
    }
  ]
}
```

- 참조 객체 `{ source, type, identifier, relativePath }` 는 다른 객체를 가리킬 때 씁니다. TerminologySelector 는 `source` 에 3DSpace 주소를 넣고, DELWKOModelServices 는 주소에서 `'3DSpace'` 글자를 뺀 값을 넣습니다.
- 수정은 `PATCH <리소스>/{id}` 로 보내고, 본문에 조회 때 받은 `cestamp` 를 넣습니다 (IssueServices `setClassificationAttributes`).
- 헤더에 `ENO_CSRF_TOKEN` 을 넣습니다.

## 오류

| 상황 | 받는 곳 | 모양 |
| --- | --- | --- |
| HTTP 오류 (4xx, 5xx) | `onFailure(error, data)` | 상태 코드는 `error.message` 문자열 안에만 있음 ([서버 호출 - 주의](/uwa/request#주의)). `data` 는 응답 본문 (JSON 이면 `error` 키가 있는 경우가 많음) |
| A 계열 업무 오류 | `onComplete(res)` | `res.success === false`, `res.error` 메시지. `res.error.errorCode` 가 있는 경우도 있음 (`'nameNotUnique'` 등) |
| A 계열 항목별 오류 | `onComplete(res)` | `res.data[i].updateMessage`, `res.data[i].updateSuccessful` |
| 로그인 만료, 라이선스 | `onPassportError` | [서버 호출](/uwa/request#promise-로-감싸기) |

::: warning onComplete 에서도 success 를 확인합니다
A 계열은 실패해도 HTTP 200 으로 오는 경우가 있습니다. Foundation 은 "JSON 이고 `success == false` 이고 `error` 문자열이 있으면 서버 오류" 로 처리합니다. `onComplete` 안에서 `res.success` 를 먼저 봅니다.
:::

## 공통 호출 함수 예

```js
function spaceRequest(spaceUrl, path, options) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    var headers = Object.assign({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      SecurityContext: options.securityContext
    }, options.headers);
    if (options.csrf) { headers.ENO_CSRF_TOKEN = options.csrf; }
    WAFData.authenticatedRequest(spaceUrl + path, {
      method: options.method || 'GET',
      type: 'json',
      headers: headers,
      data: options.body ? JSON.stringify(options.body) : undefined,
      onComplete: function (res) {
        if (res && res.success === false) { reject(res); return; }
        resolve(res);
      },
      onFailure: function (error, data) { reject({ error: error, data: data }); },
      onPassportError: function (error) { reject({ error: error }); }
    });
  });
}
```
