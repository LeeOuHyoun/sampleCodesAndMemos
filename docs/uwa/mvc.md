# Model, Collection, View <Badge type="info" text="원본 분석" />

`UWA/Class/Model`, `Collection`, `View` 는 Backbone 과 비슷한 구조입니다. 데이터(Model)가 바뀌면 이벤트가 나고, 화면(View)이 그 이벤트를 듣고 다시 그립니다. 다만 이벤트 이름과 메서드 이름이 Backbone 과 다릅니다.

샘플: [03_mvc.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UWASample/03_mvc.html)

::: info 근거
UWA2/js/Class/Model.js, Collection.js, View.js, Controls/Abstract.js. 호출부: View 1,281 건 / 240 파일, Model 496 건, Collection 253 건. 예: RTUserPresenceAPI, ENOXRelatedItem ENOXCard, Bookmark
:::

## Backbone 과 다른 이름

| Backbone | UWA |
| --- | --- |
| `initialize` | `setup` (`init` 은 실제 생성자) |
| `on` / `off` / `trigger` | `addEvent` / `removeEvent` / `dispatchEvent` |
| `change`, `change:title` | `onChange`, `onChange:title` |
| `invalid` | `onValidationFailure` |
| `add`, `remove`, `reset`, `sort`, `sync`, `error`, `request`, `destroy` | `onAdd`, `onRemove`, `onReset`, `onSort`, `onSync`, `onError`, `onRequest`, `onDestroy` |
| `success` / `error` 콜백 | `onComplete` / `onFailure` |
| `el`, `$el` | `container` (UWA Element) |
| View `events` | View `domEvents` |
| `this.$(sel)` | `this.getElement(sel)` / `getElements(sel)` |

## Model

```js
var Part = Model.extend({
  idAttribute: 'id',
  defaults: { title: '', state: 'WIP', qty: 0 },

  setup: function () {
    this.addEvent('onChange:state', function (model, value) {
      console.log('상태 변경', value);
    });
  },

  validate: function (attrs) {
    if (attrs.qty < 0) {
      return '수량은 0 이상';
    }
  }
});

var part = new Part({ id: 'PRT-0001', title: '브라켓' });
part.set('state', 'RELEASED');
part.get('title');
part.set({ qty: -1 }, { validate: true });
```

| 메서드 | 설명 |
| --- | --- |
| `get(key)` / `set(key, value, opts)` / `set(obj, opts)` | 읽기 / 쓰기. `set` 은 성공 여부(boolean)를 돌려줌 |
| `has(key)` | 값이 있는지. `null`, `undefined`, `NaN` 이면 false |
| `unset(key)` / `clear()` | 지우기 |
| `toJSON()` | 속성 복사본 |
| `hasChanged(key?)` / `previous(key)` / `changedAttributes()` | 바로 전 `set` 에서 바뀐 것 |
| `isNew()` | id 가 없는지 |
| `fetch` / `save` / `destroy` | 서버 연동 (아래) |

- 초기화 코드는 `setup` 에 씁니다. Model 에는 `this.options` 가 없습니다.
- `set` 할 때 바뀐 속성마다 `onChange:속성` (`[model, value, opts]`), 마지막에 `onChange` (`[model, opts]`) 가 발생합니다. 값 비교는 깊은 비교라서 같은 내용의 새 객체를 넣으면 이벤트가 나지 않습니다.
- `{ silent: true }` 면 이벤트가 나지 않습니다.
- `validate` 는 `set(..., { validate: true })` 또는 `save` 때만 실행됩니다. 실패하면 `set` 이 false 를 돌려주고 `onValidationFailure` 가 발생합니다.

::: warning defaults
- 넘긴 값이 `null` 이어도 defaults 값으로 바뀝니다. (Backbone 은 `undefined` 만)
- 객체형 기본값은 복사되지 않고 모든 인스턴스가 같은 객체를 씁니다. 인스턴스마다 다른 객체가 필요하면 `defaults: function () { return { tags: [] }; }` 처럼 함수로 씁니다.
:::

### 서버 연동

기본 전송은 `UWA.Data.request` 이므로 3DSpace 를 부를 때는 `sync` 를 바꿔 `WAFData.authenticatedRequest` 를 쓰게 합니다. 실제 코드(Bookmark 등)가 쓰는 방식입니다.

```js
var Document = Model.extend({
  urlRoot: spaceUrl + '/resources/v1/modeler/documents',

  sync: function (method, model, options) {
    options = options || {};
    options.ajax = WAFData.authenticatedRequest;
    options.headers = Object.assign({
      'Content-Type': 'application/json',
      SecurityContext: securityContext
    }, options.headers);
    return this._parent(method, model, options);
  },

  parse: function (resp) {
    return resp.data[0];
  }
});

new Document({ id: 'ABC123' }).fetch({
  onComplete: function (model, resp) { console.log(model.get('title')); },
  onFailure: function (model, err) { console.error(err); }
});
```

- `fetch` → GET, `save` → 새 모델이면 POST, 아니면 PUT (`{ patch: true }` 면 PATCH), `destroy` → DELETE.
- 주소는 `urlRoot` (또는 Collection 의 `url`) + `/` + id 입니다.
- 저장할 때 `toJSON()` 을 JSON 문자열로 보냅니다. 쓰기 요청이면 [CSRF 토큰](/uwa/request#csrf-토큰-3dspace-쓰기-요청) 헤더도 넣어야 합니다.

::: warning headers 를 넘기면 Content-Type 이 사라집니다
`sync` 는 내부 기본값 `{ headers: { 'Content-Type': 'application/json' } }` 에 넘긴 옵션을 **얕게** 덮어씁니다. `options.headers` 를 주면 기본 headers 객체가 통째로 바뀌므로, 위 예처럼 `'Content-Type': 'application/json'` 을 직접 넣어야 합니다. 빠지면 WAFData 가 form 형식 Content-Type 을 붙여 서버가 본문을 읽지 못합니다.
:::
- 돌려받는 것은 Promise 가 아니라 요청 객체입니다. 결과는 `onComplete` / `onFailure` 로 받습니다.
- `fetch`, `save` 는 응답을 `parse` 에 통과시킵니다.

## Collection

```js
var Parts = Collection.extend({
  model: Part,
  comparator: 'title'
});

var parts = new Parts([{ id: 'P1', title: '샤프트' }, { id: 'P2', title: '브라켓' }]);
parts.addEvent('onAdd', function (model) { ... });
parts.addEvent('onChange:state', function (model, value) { ... });

parts.add({ id: 'P3', title: '커버' });
parts.get('P1');
parts.where({ state: 'WIP' });
parts.pluck('title');
```

| 메서드 | 설명 |
| --- | --- |
| `add` / `remove` / `reset` / `set` | 추가 / 삭제 / 전체 교체 / 합치기 |
| `get(id 또는 cid)` / `at(index)` / `first` / `last` | 찾기 |
| `where(attrs)` / `findWhere(attrs)` | 속성이 같은(`===`) 모델 |
| `pluck(key)` / `toJSON()` / `size()` | 값 모으기 |
| `forEach`, `map`, `filter`, `find`, `sortBy`, `groupBy` ... | 배열 함수 |
| `sort()` | `comparator` 로 정렬. comparator 가 없으면 오류 |
| `fetch` / `create(attrs)` | 서버에서 목록 받기 / 만들고 저장 |

- 안의 모델 이벤트(`onChange:state` 등)가 Collection 에서도 그대로 발생합니다.
- 모델이 `destroy` 되면 Collection 에서 자동으로 빠집니다.
- `comparator` 는 속성 이름, 인자 1개 함수(정렬 기준 값), 인자 2개 함수(`Array.sort` 방식) 중 하나입니다.
- `comparator` 가 있으면 `add` 할 때 자동으로 정렬되고 `onAdd` 다음에 `onSort` 도 발생합니다. `add` 뒤에 `sort()` 를 또 부를 필요가 없습니다.

## View

```js
var PartCard = View.extend({
  name: 'part-card',
  tagName: 'div',
  className: 'part-card',

  domEvents: {
    'click .title': 'onTitleClick',
    'click .btn-release': function (e) { this.model.set('state', 'RELEASED'); }
  },

  setup: function () {
    this.listenTo(this.model, 'onChange', this.render);
  },

  render: function () {
    this.container.setContent([
      { tag: 'span', 'class': 'title', text: this.model.get('title') },
      { tag: 'span', text: ' (' + this.model.get('state') + ') ' },
      { tag: 'button', 'class': 'btn-release', text: '승인' }
    ]);
    return this;
  },

  onTitleClick: function (e) {
    console.log('클릭', this.model.id);
  },

  destroy: function () {
    this.stopListening();
    return this._parent();
  }
});

new PartCard({ model: part }).render().inject(document.body);
```

- 생성자 옵션 중 `model`, `collection`, `container`, `id`, `attributes`, `className`, `tagName`, `domEvents` 는 `this` 에 바로 들어가고, 나머지는 `this.options` 로 갑니다.
- `container` 를 주지 않으면 `tagName` (기본 `div`) 으로 새로 만듭니다. `className` 등은 함수로도 줄 수 있습니다.
- 생성 순서는 container 생성 → `setup` → `domEvents` 연결입니다. **`render` 는 자동으로 불리지 않습니다.**
- `domEvents` 키는 `'이벤트 선택자'` 입니다. 이벤트 이름은 `click` 처럼 `on` 없이 씁니다. 값은 메서드 이름 또는 함수이고 `this` 는 View 입니다. 없는 메서드 이름이면 오류가 납니다.
- `inject`, `show`, `hide`, `remove`, `destroy`, `getElement(s)` 를 씁니다.

::: warning View 를 정리할 때
- `destroy()` 는 `stopListening()` 을 부르지 않습니다. `listenTo` 를 썼다면 위 예처럼 `destroy` 에서 직접 부릅니다. 안 하면 Model 이 바뀔 때 사라진 View 의 `render` 가 계속 불립니다.
- 생성자 옵션의 `events` 는 DOM 이벤트가 아니라 UWA 이벤트 리스너로 등록됩니다. DOM 이벤트는 `domEvents` 에 씁니다.
- `domEvents` 를 다시 연결할 때 container 의 이벤트를 모두 지웁니다. container 에 직접 `addEvent` 한 이벤트도 함께 사라집니다.
:::

`UWA/Class/Store` (브라우저 저장소에 Model 저장)는 생성할 때 "EXPERIMENTAL ... DO NOT USE THIS IN PRODUCTION" 로그를 남기는 실험 기능입니다.
