# 끌어 놓기 (DataDragAndDrop, 3DXContent) <Badge type="info" text="원본 분석" />

3DEXPERIENCE 에서 객체를 다른 위젯으로 넘기는 표준 방법은 **HTML5 끌어 놓기 + `text` 형식의 JSON 문자열** 입니다. 이 JSON 의 약속을 **3DXContent** 라고 부릅니다. 위젯이 서로 다른 iframe 에 있어도 브라우저가 데이터를 넘겨 줍니다.

| 할 일 | 쓸 것 |
| --- | --- |
| 요소를 끌 수 있게 / 놓을 수 있게 | `DS/DataDragAndDrop/DataDragAndDrop` |
| 넘길 데이터 모양 | 3DXContent JSON (`protocol: '3DXContent'`) |

::: info 근거
DataDragAndDrop/DataDragAndDrop.js, 3DXContentChecker/3DXContentChecker.js (JSON 스키마 1~130행, `check` 1176행). 놓기 처리: ENOChangeActionUX `makeDroppable`, ENOChgServices `checkTenantInforamation` / `filterBasedOnServiceId`, CfgConfigurationRevisionUX `makeDroppable`. 끌기: CfgAuthoringContextUX `makeDraggable`, EditPropWidget (여러 개 끌기), ENORIPE_Relations (`text/searchitems`)
:::

샘플: [02_drag_drop.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/EventsSample/02_drag_drop.html) (3DXContent 끌기 / 놓기, 놓인 객체 정보 조회)

## DataDragAndDrop API

```js
require(['DS/DataDragAndDrop/DataDragAndDrop'], function (DnD) {
  DnD.draggable(cardEl, { data: JSON.stringify(content) });

  DnD.droppable(dropEl, {
    enter: function (el, e) { el.classList.add('drop-over'); },
    leave: function (el, e) { el.classList.remove('drop-over'); },
    drop: function (text, el, e) {
      el.classList.remove('drop-over');
      console.log(text);
    }
  });
});
```

| 함수 | 설명 |
| --- | --- |
| `draggable(el, options)` | `draggable="true"` 를 붙이고 `dragstart`, `dragend` 를 등록 |
| `droppable(el, options)` | `dragenter`, `dragover`, `dragleave`, `drop` 을 등록 |
| `clean(el, kind)` | 등록 해제. `kind` 는 `'drag'`, `'drop'`, 빼면 둘 다 |
| `on(dragEls, dropEls, options)` | 여러 요소에 한꺼번에 `draggable`, `droppable` |
| `off(dragEls, dropEls)` | 여러 요소 `clean` |

### draggable 옵션

| 키 | 설명 |
| --- | --- |
| `data` | 넘길 **문자열**. `dataTransfer.setData('text', data)`. 없으면 요소의 `innerHTML` 을 넘김 |
| `start(el, e)` | `dragstart` 때 호출. 여기서 `e.dataTransfer.setData('text', ...)` 를 다시 불러 데이터를 바꿀 수 있음 |
| `stop(el, e)` | `dragend` 때 호출 |

- 끄는 동안 요소에 `dragging` 클래스가 붙고 텍스트 선택이 꺼집니다.
- `effectAllowed` 는 `'all'` 로 고정입니다.

### droppable 옵션

| 키 | 설명 |
| --- | --- |
| `enter(el, e)` | 들어올 때 |
| `over(el, e)` | 위에 있는 동안 계속. **`false` 를 돌려주면 놓기를 거부** (그 외에는 허용) |
| `leave(el, e)` | 나갈 때 |
| `drop(text, el, e)` | 놓았을 때. `text` 는 `dataTransfer.getData('text')` 결과 문자열 |

`drop` 이벤트는 모듈이 먼저 `stopPropagation()`, `preventDefault()` 를 부릅니다. 바깥 요소의 drop 핸들러는 실행되지 않습니다.

::: warning 자주 틀리는 것
- **옵션 객체를 꼭 넘깁니다.** `draggable(el)` 처럼 빼면 `dragstart` 에서 `start` 를 읽다가 오류가 납니다. 필요 없으면 `{}` 라도 넘깁니다.
- **같은 요소에 두 번 부르면 두 번째는 무시됩니다.** 데이터를 바꾸려면 `clean(el, 'drag')` 후 다시 `draggable` 을 부르거나, `start` 에서 `setData` 합니다.
- **`over` 에서는 데이터를 읽을 수 없습니다.** 브라우저가 `dragover` 중에는 `getData` 를 빈 값으로 줍니다. 허용 여부는 `drop` 에서 판단합니다.
- `data` 는 문자열입니다. 객체를 넣으면 `[object Object]` 가 갑니다. `JSON.stringify` 합니다.
:::

## 3DXContent 형식

```json
{
  "protocol": "3DXContent",
  "version": "2.0",
  "source": "<앱 id>",
  "widgetId": "<위젯 id>",
  "data": {
    "items": [
      {
        "envId": "<플랫폼 id>",
        "serviceId": "3DSpace",
        "contextId": "ctx::<역할>.<조직>.<협업공간>",
        "objectId": "<physicalid>",
        "objectType": "VPMReference",
        "displayName": "브라켓"
      }
    ]
  }
}
```

### 최상위

| 키 | 필수 | 설명 |
| --- | --- | --- |
| `protocol` | O | 항상 `'3DXContent'` |
| `version` | O | `'1.0'`, `'1.1'`, `'2.0'`, `'2.1'` 중 하나 |
| `source` | O | 보낸 앱 id. `widget.getValue('appId')` 나 앱 코드(`'ENOLCMT_AP'` 등) |
| `data` | O | `{ items: [...] }` |
| `widgetId` | - | 보낸 위젯 id |

### items[] 항목

| 키 | 1.x / 2.0 필수 | 2.1 필수 | 설명 |
| --- | --- | --- | --- |
| `objectId` | O | O | 객체 id. 3DSpace 는 대부분 **physicalid** (32자리 16진수) |
| `objectType` | O | O | 타입 이름 (`'Document'`, `'VPMReference'`, `'Change Action'` ...) |
| `serviceId` | O | O | 객체가 있는 서비스. `'3DSpace'`, `'3DDrive'` ... |
| `envId` | O | O | 플랫폼(테넌트) id. 위젯의 `widget.getValue('x3dPlatformId')`. 온프레미스는 `'OnPremise'` 가 흔함 |
| `contextId` | - | - | 보안 컨텍스트 `ctx::역할.조직.협업공간`. 빈 문자열도 보임 |
| `displayName` | - | - | 화면 표시 이름 |
| `displayPreview`, `displayIcon` | - | - | 이미지 URL |
| `path` | - | - | 구조 경로. `[{ resourceid, type }]` (2.1 은 `i3dx` 도 필수) |
| `objectState` | 없음 | - | 상태. 2.1 에서 추가 |
| `i3dx` | 없음 | O | 2.1 에서 추가. `'i3dx:<서비스>!<id>'` 형태 또는 빈 문자열 |

스키마 파일은 정의되지 않은 키를 허용하지 않지만(`additionalProperties: false`), 실제 코드는 `image`, `objectData`, `filterSpec`, `displayType` 같은 키를 더 붙여 보냅니다. 검사 함수 `DS/3DXContentChecker/3DXContentChecker_v2.1` 의 `check()` 를 부르는 곳은 없어서, 실제로는 **필수 키만 지키면 통하는 것으로 보입니다.**

### 버전별 사용 횟수

`version: "..."` 문자열 기준 (enovia2025 webapps).

| 버전 | 횟수 |
| --- | --- |
| `1.0` | 261 |
| `1.1` | 211 |
| `2.0` | 68 |
| `2.1` | 20 |

받는 쪽은 버전을 따지지 않고 `data.items[]` 의 `objectId`, `objectType`, `serviceId`, `envId` 만 읽는 코드가 대부분입니다.

## 다른 위젯에서 놓은 3DSpace 객체 받기

ENOChangeActionUX, ENOChgServices 가 하는 검사를 정리하면 다음 순서입니다.

1. `JSON.parse` (실패하면 3DXContent 가 아님)
2. `protocol === '3DXContent'` 확인
3. 항목마다 `envId` 가 비었는지, 내 플랫폼과 같은지 확인
4. `serviceId`, `objectType` 이 없는 항목은 버림
5. 중복 `objectId` 제거
6. 남은 `objectId` 로 3DSpace REST 호출

```js
require(['DS/DataDragAndDrop/DataDragAndDrop'], function (DnD) {
  var myPlatformId = widget.getValue('x3dPlatformId') || 'OnPremise';

  function parse3DXContent(text) {
    var content;
    try { content = JSON.parse(text); } catch (e) { return null; }
    if (!content || content.protocol !== '3DXContent' || !content.data) return null;
    var seen = {};
    return (content.data.items || []).filter(function (item) {
      var ok = item.serviceId === '3DSpace' && item.objectId && item.objectType &&
        (!item.envId || item.envId === myPlatformId) && !seen[item.objectId];
      seen[item.objectId] = true;
      return ok;
    });
  }

  DnD.droppable(dropEl, {
    drop: function (text, el, e) {
      var items = parse3DXContent(text);
      if (!items || items.length === 0) {
        console.warn('3DSpace 객체가 아닙니다');
        return;
      }
      items.forEach(function (item) {
        console.log(item.objectId, item.objectType, item.displayName);
      });
    }
  });
});
```

놓인 객체의 이름, 리비전, 상태 같은 기본 정보는 타입에 상관없이 `GET /resources/v2/e6w/service/ObjectInfo/{objectId}` 로 받을 수 있습니다. 자세한 것은 [3DSpace REST 목록](/rest-api/catalog#e6w-서비스) 을 봅니다.

::: tip envId 가 다른 경우
ENOChgServices 는 `envId` 가 비어 있으면 "플랫폼 정보 없음", 다르면 "플랫폼 불일치" 오류를 띄우고 놓기를 취소합니다. 다른 플랫폼의 id 로 내 3DSpace 를 부르면 찾지 못하기 때문입니다.
:::

## 내 객체를 끌 수 있게 하기

```js
function make3DXContent(objects) {
  return {
    protocol: '3DXContent',
    version: '2.0',
    source: widget.getValue('appId') || 'MYAPP',
    widgetId: widget.id,
    data: {
      items: objects.map(function (o) {
        return {
          envId: widget.getValue('x3dPlatformId') || 'OnPremise',
          serviceId: '3DSpace',
          contextId: securityContext,
          objectId: o.physicalId,
          objectType: o.type,
          displayName: o.title
        };
      })
    }
  };
}

DnD.draggable(cardEl, { data: JSON.stringify(make3DXContent([part])) });
```

여러 개를 선택해서 끌게 하려면 `data` 대신 `start` 에서 그때 선택된 항목으로 만듭니다 (EditPropWidget 방식).

```js
DnD.draggable(rowEl, {
  start: function (el, e) {
    e.dataTransfer.setData('text', JSON.stringify(make3DXContent(getSelectedParts())));
  }
});
```

- 검색 결과 같은 일부 화면은 같은 JSON 을 `text/searchitems` 형식으로도 한 번 더 넣습니다. 받는 쪽은 `text` 만 읽으면 됩니다.
- `contextId` 형식은 [보안 컨텍스트](/rest-api/security-context) 를 봅니다.

## 끌기 말고 쓰이는 곳

3DXContent JSON 은 끌어 놓기 말고도 씁니다.

| 쓰는 곳 | 형태 |
| --- | --- |
| Compass 로 앱 실행 | InterCom 소켓으로 `'com.ds.compass'` 서버에 `onSetX3DContent` 이벤트와 함께 보냄 |
| 대시보드 링크 | `<3DDashboard 주소>#app:<앱id>/content:X3DContentId=<JSON 을 encodeURIComponent>` |

실행 방법은 [PlatformAPI](/widget/platform-api), [InterCom](/uwa/intercom) 을 봅니다.
