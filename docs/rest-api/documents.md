# 문서 (modeler/documents)

`/resources/v1/modeler/documents` 는 소스에서 가장 많이 쓰는 3DSpace REST 입니다 (80 건, 20 개 모듈). 문서 객체와 그 안의 파일을 만들고, 읽고, 고치고, 내려받습니다. 응답은 [A 계열 (Foundation 형식)](/rest-api/#응답-형식-a-업무-객체) 입니다.

::: info 근거
DocumentManagement/DocumentManagement.js (`DocumentFoundationAjax` 1~186행, `IndependentServiceBase` 187~388행, 문서 서비스 678행~), VCXWebPlatform `WSInformation` (엔드포인트 표), `runRequest`, `updateDocument`, `createDocument`, `checkinTicket`. ENOXAttachmentsUX (부모 기준 조회), DocumentCommonInfra (`$definition=true`)
:::

## 엔드포인트

`{docId}` 는 문서 id, `{fileId}` 는 파일 id, `{versionId}` 는 파일 버전 id 입니다. 앞에는 `/resources/v1/modeler/documents` 가 붙습니다.

| 하는 일 | 메서드 | 경로 |
| --- | --- | --- |
| 문서 하나 조회 | GET | `/{docId}` |
| 여러 문서 조회 | POST | `/` 본문 `$ids=id1,id2` (form) |
| 부모에 붙은 문서 조회 | GET | `/parentId/{parentId}?parentRelName=...&parentDirection=from` |
| 검색 | GET | `/search?searchStr=...` |
| 만들기 | POST | `/` |
| 속성 고치기 | PUT | `/{docId}` 또는 `/` (본문에 id) |
| 삭제 | DELETE | `/{docId}` |
| 파일 목록 | GET | `/{docId}/files` |
| 파일 추가 | POST | `/{docId}/files` |
| 파일 수정 / 삭제 | PUT / DELETE | `/{docId}/files/{fileId}` |
| 파일 버전 목록 | GET | `/{docId}/files/{fileId}/versions` |
| 파일 버전 삭제 | DELETE | `/{docId}/files/{fileId}/versions/{versionId}` |
| 업로드 ticket | PUT | `/files/CheckinTicket`, `/{docId}/files/CheckinTicket` |
| 다운로드 ticket | PUT | `/DownloadTicket` (여러 문서), `/{docId}/files/DownloadTicket`, `/{docId}/files/{fileId}/DownloadTicket`, `.../versions/{versionId}/DownloadTicket` |
| 체크아웃(잠금 + 다운로드) ticket | PUT | `/CheckoutTicket`, `/{docId}/files/CheckoutTicket`, `/{docId}/files/{fileId}/CheckoutTicket` |
| 잠금 / 잠금 해제 | PUT | `/{docId}/reserve`, `/{docId}/unreserve` |
| 필드 정의 | POST | `/` 본문 `$definition=true` (form) |

그 밖에 소스에 보이는 보조 경로: `typeDerivatives`, `IsDocumentType/`, `WorkUnder/`, `typeInfo/`, `getMasterObjectInfo/`, `manageExternalURL`, `generateFileThumbnail`, `checkURLDeleteAccess`, `commentAsMandatory/`, `IsOnlineWebEditorSessionActive?documentId=`, `SendNotificationOnRequestToUnlock?lockerName=`.

## 조회

```js
spaceRequest(spaceUrl, '/resources/v1/modeler/documents/' + docId + '?$include=versions', {
  securityContext: securityContext
}).then(function (res) {
  var doc = res.data[0];
  console.log(doc.dataelements.title, doc.dataelements.revision);
  (doc.relateddata.files || []).forEach(function (f) {
    console.log(f.id, f.dataelements.title);
  });
});
```

`spaceRequest` 는 [공통 호출 함수 예](/rest-api/#공통-호출-함수-예) 입니다.

여러 문서는 POST 로 읽습니다. DocumentManagement `getDocuments` 가 이 방식입니다.

```js
WAFData.authenticatedRequest(spaceUrl + '/resources/v1/modeler/documents/?$include=versions', {
  method: 'POST',
  type: 'json',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', SecurityContext: securityContext },
  data: '$ids=' + ids.join(','),
  onComplete: function (res) { console.log(res.data.length); }
});
```

### 많이 읽는 키

| 위치 | 키 |
| --- | --- |
| `dataelements` | `title` (138), `name` (92), `locker` (37), `typeNLS` (28), `policy` (28), `type`, `secondaryTitle`, `modified`, `revision`, `owner`, `state`, `stateNLS`, `isDocumentType`, `typeicon`, `originated`, `image`, `hasModifyAccess`, `reservedby`, `description` |
| `relateddata` | `files`, `ownerInfo`, `lockerInfo`, `originatorInfo`, `versions`, `parents` |
| `relateddata.files[].dataelements` | `title`, `locker`, `comments`, `format`, `modified`, `fileSize`, `fileExtension` |
| `relateddata.ownerInfo[0].dataelements` | `name`, `firstname`, `lastname`, `fullname` |

괄호 안은 문서 관련 모듈의 소스에서 그 키를 읽은 횟수입니다.

| 파라미터 | 예 | 쓰는 곳 |
| --- | --- | --- |
| `$include` | `versions`, `none,files,ownerInfo,lockerInfo` | 파일 버전, 소유자 정보 |
| `$fields` | `indexedImage,indexedTypeicon,isDocumentType,organizationTitle,isLatestRevision,!parentId` | ENOXAttachmentsUX |
| `parentRelName`, `parentDirection` | `Reference%20Document`, `from` | 부모 기준 조회 / 연결 |

## 만들기 (파일 없이)

```js
var body = {
  csrf: csrf,
  data: [{
    type: 'Document',
    tempId: 'temp_' + Date.now(),
    dataelements: { title: '시험 문서', description: '설명', policy: 'Document Release' }
  }]
};
spaceRequest(spaceUrl, '/resources/v1/modeler/documents', { method: 'POST', body: body, securityContext: securityContext })
  .then(function (res) { console.log('새 id', res.data[0].id); });
```

`dataelements` 에서 소스가 보내는 키: `title`, `name`, `description`, `policy`, `state`, `collabspace`, `deriveCollabspace`. 만들면서 부모에 붙이려면 `parentId`, `parentRelName`, `parentDirection` 도 넣습니다.

::: tip csrf 객체
본문의 `csrf` 는 `{ name: 'ENO_CSRF_TOKEN', value: '<토큰>' }` 입니다. CSRF 엔드포인트 응답의 `res.csrf` 를 그대로 넣으면 됩니다. 응답에 새 `csrf` 가 오면 바꿔 둡니다.
:::

## 파일 올리기 (3 단계)

파일 본문은 3DSpace 가 아니라 **파일 서버(FCS)** 로 갑니다.

| 단계 | 요청 | 결과 |
| --- | --- | --- |
| 1. ticket 받기 | `PUT documents/files/CheckinTicket` 본문 `{ csrf }` | `data[0].dataelements` 의 `ticketURL`, `ticketparamname`, `ticket` |
| 2. 파일 보내기 | `POST <ticketURL>` multipart: `<ticketparamname>=<ticket>`, `file_0=<파일>` | 응답 본문 문자열 = **receipt** |
| 3. 문서에 연결 | 새 문서면 `POST documents`, 기존 문서면 `PUT documents` | 파일이 붙은 문서 |

```js
function checkinFile(ticket, file) {
  return new Promise(function (resolve, reject) {
    var form = new FormData();
    form.append(ticket.ticketparamname, ticket.ticket);
    form.append('file_0', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ticket.ticketURL, true);
    xhr.onload = function () { xhr.status === 200 ? resolve(xhr.responseText) : reject(xhr); };
    xhr.onerror = reject;
    xhr.send(form);
  });
}
```

3 단계 본문 (기존 문서에 파일 추가):

```json
{
  "csrf": { "name": "ENO_CSRF_TOKEN", "value": "<토큰>" },
  "data": [{
    "id": "<docId>",
    "updateAction": "NONE",
    "relateddata": {
      "files": [{
        "updateAction": "CREATE",
        "dataelements": { "title": "a.pdf", "receipt": "<2단계 응답>" }
      }]
    }
  }]
}
```

| `files[].updateAction` | 뜻 |
| --- | --- |
| `CREATE` | 새 파일 추가. `id` 없음 |
| `REVISE` | 기존 파일의 새 버전. `id` 에 `{fileId}`. DocumentManagement 는 이때 `?$include=versions` 를 붙임 |

새 문서와 파일을 한 번에 만들려면 `data[0]` 에 `type`, `tempId`, `dataelements` 를 넣고 `relateddata.files` 를 같이 보냅니다. `dataelements.title` 이 없으면 DocumentManagement 는 파일 이름에서 확장자를 뺀 값을 넣습니다.

## 내려받기

```js
spaceRequest(spaceUrl, '/resources/v1/modeler/documents/' + docId + '/files/DownloadTicket', {
  method: 'PUT',
  securityContext: securityContext,
  body: { csrf: csrf, data: [{ id: fileId }] }
}).then(function (res) {
  var ticketURL = res.data[0].dataelements.ticketURL;
  console.log(ticketURL);
});
```

- `data` 를 빼면 문서의 파일 전체입니다.
- DocumentManagement 는 URL 에 `useObjectNameForZip`, `lightweight` 를 붙입니다. 받은 ticketURL 은 쿼리 문자열을 hidden input 으로 옮긴 **form POST** 로 열고, 이때 `__fcs__attachment=true` 를 더해 첨부 파일로 받게 합니다 (`downloadWithPost`).
- 여러 문서는 `PUT documents/DownloadTicket` 본문 `{ csrf, data: [{ id: docId }, ...] }`, 하나로 묶으려면 `?zipFiles=true`. 결과 `data[i].dataelements` 에 `ticketURL`, `fileName`(또는 `fileNames`), 실패면 `data[i].updateMessage`.

## 부모 객체에 연결 / 해제

```json
{
  "csrf": { "name": "ENO_CSRF_TOKEN", "value": "<토큰>" },
  "data": [{
    "id": "<docId>",
    "updateAction": "NONE",
    "relateddata": { "parents": [ { "id": "<parentId>", "updateAction": "CONNECT" } ] }
  }]
}
```

`POST documents?parentRelName=Reference%20Document&parentDirection=from` 로 보냅니다. 해제는 `CONNECT` 대신 `DISCONNECT` 입니다.

## 삭제

| 대상 | 요청 |
| --- | --- |
| 문서 | `DELETE documents/{docId}` 본문 `{ csrf }` |
| 파일 | `DELETE documents/{docId}/files/{fileId}` 본문 `{ csrf }` |
| 파일 버전 | `DELETE documents/{docId}/files/{fileId}/versions/{versionId}` 본문 `{ csrf }` |

## 주의

- **조회도 POST 인 경우가 있습니다.** 여러 건 조회와 필드 정의는 form 본문(`$ids=`, `$definition=true`)으로 POST 합니다. GET 만 허용하는 프록시나 권한 설정이면 막힐 수 있습니다.
- **성공 판단은 `res.success`** 입니다. DocumentManagement 는 `success` 가 아니면 `onFailure` 로 보냅니다.
- DocumentManagement 는 실패 응답의 `error.errorCode === 'nameNotUnique'` 를 따로 번역해 보여 줍니다. 이름 중복은 이 코드로 옵니다.
- DocumentManagement 의 요청은 `tenant`, `e6w-lang`, `e6w-timezone` 파라미터와 `Accept-Language` 헤더를 자동으로 붙입니다. 직접 부를 때는 필요하면 넣습니다.
