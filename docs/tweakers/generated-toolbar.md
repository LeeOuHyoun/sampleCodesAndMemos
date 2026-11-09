# GeneratedToolbar

JSON 으로 툴바를 만드는 모듈입니다. `grid.setToolbar` 도 내부에서 이것을 씁니다. 여기서는 그리드와 상관없이 직접 만드는 방법과, 만든 뒤 항목을 바꾸는 방법을 다룹니다.

샘플: [03_generatedToolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/03_generatedToolbar.html)

::: info 근거
Tweakers.js 의 GeneratedToolbar, TweakerFunction. Utilities.js 의 attachSimpleCallback. 호출부: DataGridView setToolbar, CompareWidget2, ENONewWidget, MapDemoWidget, ControlsEx, ENXSBToolbarClient
:::

## 만들기

엔트리 JSON 을 바로 넘기지 않고, `createTreeDocument` 로 데이터(TreeDocument)를 만든 뒤 `items` 로 넘깁니다.

```js
require(['DS/Tweakers/GeneratedToolbar'], function (GeneratedToolbar) {
  var items = GeneratedToolbar.prototype.createTreeDocument({
    entries: [
      {
        id: 'keyword',
        dataElements: { typeRepresentation: 'string', placeholder: '검색어', value: '' },
        onNodeUpdate: function (nodeModel) {
          console.log('검색', nodeModel.getAttributeValue('data'));
        }
      },
      {
        id: 'save',
        position: 'far',
        dataElements: {
          typeRepresentation: 'functionIcon',
          label: '저장',
          icon: { iconName: 'floppy', fontIconFamily: 1 },
          value: function (e) {
            console.log('저장', e.context.executionContext);
          }
        }
      }
    ]
  });

  var toolbar = new GeneratedToolbar({
    items: items,
    executionContext: myView,
    overflowManagement: 'dropdown'
  }).inject(document.getElementById('toolbar'));
});
```

- `createTreeDocument` 는 prototype 에서 바로 부릅니다. JSON 문자열도 받습니다.
- 엔트리 키(`id`, `position`, `dataElements` ...)는 [툴바 (setToolbar)](/datagridview/api/toolbar) 와 같습니다.
- `executionContext` 에 넣은 객체가 모든 콜백의 `e.context.executionContext` 로 전달됩니다. `grid.setToolbar` 는 여기에 그리드를 넣습니다.
- 생성자 옵션은 [GeneratedToolbar API](/tweakers/api/generated-toolbar#생성자-옵션) 에 있습니다. 목록에 없는 키(`context`, `minHeight`, `className` 등)는 무시됩니다.

## 버튼 콜백

버튼 동작은 두 방식으로 연결합니다.

| 방식 | 쓰는 곳 | 인자 |
| --- | --- | --- |
| 함수 | `dataElements.value: function (e) {}` | `e.context`, `e.dsModel` (버튼 편집기) |
| 모듈 + 함수 이름 | `dataElements.action: { module, func, argument }` | `argument` 의 키 + `e.context`, `e.dsModel` |

`e.context` 는 두 방식 모두 같습니다.

| 키 | 내용 |
| --- | --- |
| `e.context.executionContext` | 생성자의 `executionContext` |
| `e.context.toolbar` | 툴바 |
| `e.context.nodeModel` | 클릭된 항목 |
| `e.context.value` | 항목의 현재 값 |

```js
{
  id: 'zoomIn',
  dataElements: {
    typeRepresentation: 'functionIcon',
    icon: { iconName: 'zoom-in', fontIconFamily: 1 },
    action: { module: 'DS/MyModule/ToolbarActions', func: 'zoom', argument: { step: 10 } }
  }
}
```

```js
zoom: function (e) {
  console.log(e.step);
  e.context.toolbar.updateNodeModel('zoomRate', { grid: { data: 110 } });
}
```

::: warning action 에 함수를 넣으면 동작하지 않습니다
`action` 은 안의 키(`module`, `func`, `argument`)를 복사해서 쓰므로 `action: function () {}` 은 아무것도 연결되지 않습니다. 함수는 `value` 에 넣습니다. (2025, 2026 동일)
:::

## 값이 바뀔 때

| 엔트리 키 | 시점 | 함수일 때 인자 |
| --- | --- | --- |
| `onNodeUpdate` | 값 확정 (Enter, 콤보 선택). 코드로 값을 바꿔도 호출 | `(nodeModel, 바뀐 속성)`, `this` 는 툴바 |
| `onNodeLiveUpdate` | 입력 중 | `(nodeModel, 입력값)` |
| `onViewFocus` / `onViewBlur` | 항목 포커스 / 해제 | `(nodeModel)` |

값은 `nodeModel.getAttributeValue('data')` 로 읽습니다. 모듈 형태(`{ module, func }`)로 넣으면 버튼 콜백과 같은 `e.context` 를 받습니다.

::: warning onNodeLiveUpdate 는 함수로
2025 버전은 `onNodeLiveUpdate` 를 모듈 형태로 넣으면 내부 오류(ReferenceError)가 납니다. 2026 에서 고쳐졌습니다.
:::

툴바 전체 단위로 받으려면 `modelUpdated` 이벤트를 씁니다. 모든 항목이 만들어지면 `onReady` 가 발생합니다.

```js
toolbar.addEventListener('modelUpdated', function () { ... });
toolbar.addEventListener('onReady', function () { ... });
```

## 항목 바꾸기

### 상태와 값

`updateNodeModel(id, 바꿀 옵션)` 하나로 바꿉니다. 실제 호출부에서 가장 많이 쓰는 메서드입니다.

```js
toolbar.updateNodeModel('save', { disabled: true });
toolbar.updateNodeModel('save', { visibleFlag: false });
toolbar.updateNodeModel('save', { label: '저장 중', tooltip: { title: '저장 중입니다' } });
toolbar.updateNodeModel('save', { grid: { semantics: { icon: { iconName: 'check', fontIconFamily: 1 } } } });
toolbar.updateNodeModel('keyword', { grid: { data: 'PRT-0001' } });
```

| 바꿀 것 | 옵션 |
| --- | --- |
| 비활성 / 숨김 | `{ disabled: true }` / `{ visibleFlag: false }` |
| 라벨 / 툴팁 / 목록 | `{ label }` / `{ tooltip: { title } }` / `{ possibleValues }` |
| 아이콘 | `{ grid: { semantics: { icon } } }` |
| 값 | `{ grid: { data: 값 } }` |

- `grid` 안은 키 단위로 합쳐지므로 `{ grid: { data } }` 만 넘겨도 타입이 유지됩니다.
- 값은 `dataElements.value` 가 `grid.data` 로 옮겨져 저장됩니다. 2025 에서 `{ value: 값 }` 은 반영되지 않습니다. 2026 부터는 `{ value }`, `{ icon }`, `{ typeRepresentation }` 도 자동으로 `grid` 아래로 옮겨집니다.
- 여러 항목을 바꿀 때 `prepareUpdateView()` 와 `pushUpdateView()` 로 감싸면 한 번만 다시 그립니다.

```js
toolbar.prepareUpdateView();
toolbar.updateNodeModel('save', { disabled: !dirty });
toolbar.updateNodeModel('undo', { disabled: !dirty });
toolbar.pushUpdateView();
```

### 읽기

```js
var node = toolbar.getNodeModelByID('keyword');
node.getAttributeValue('data');       // 값
node._associatedView;                 // 항목의 편집기 (onReady 뒤)
```

`getNodeModelByID` 는 최상위 항목만 찾습니다. 하위 메뉴(`children`) 항목은 찾지 못합니다.

### 추가와 삭제

`addEntry` 같은 메서드는 없습니다. 전체를 다시 만들거나 `items` 를 직접 고칩니다. 어느 쪽이든 툴바가 자동으로 다시 그립니다.

```js
toolbar.updateModel({ entries: newEntries });
toolbar.items.removeRoot(toolbar.getNodeModelByID('save'));
```

## 사용자 타입 쓰기

툴바 JSON 의 최상위 `enums`, `typeRepresentations` 는 `GeneratedToolbar` 를 직접 만들 때 **무시됩니다**. `grid.setToolbar` 가 대신 등록해 주는 것뿐입니다. 직접 만들 때는 먼저 등록합니다.

```js
var factory = new TypeRepresentationFactory();
factory.registerEnum('viewMode', ['목록', '썸네일']);

var toolbar = new GeneratedToolbar({
  items: GeneratedToolbar.prototype.createTreeDocument({
    entries: [{ id: 'mode', dataElements: { typeRepresentation: 'viewMode', value: '목록' } }]
  }),
  typeRepresentationFactory: factory
});
```

등록 방법은 [사용자 타입 등록](/tweakers/custom-type) 을 보세요.

## 2026 버전 차이

- 넘친 항목 팝업(`popupDisplayStyle`) 기본값이 `'TreeListView'` 에서 `'DataGridView'` 로 바뀌었습니다.
- 생성자 옵션 `displayLabel` (툴바 전체 라벨 표시), `contextualMenu` (`{ displayLabel: true }` 면 우클릭으로 라벨 보이기/숨기기) 가 추가되었습니다.
- 엔트리 키 `alwaysInOverflow: true` 로 항상 넘침 팝업에만 두는 항목을 만들 수 있습니다.
- `updateNodeModel` 이 찾았는지 여부(`true` / `false`)를 돌려줍니다.
