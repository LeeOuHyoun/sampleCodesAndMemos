# GeneratedToolbar <Badge type="tip" text="로컬 실행 확인" />

JSON 으로 툴바를 만드는 모듈입니다. `grid.setToolbar` 도 내부에서 이것을 씁니다. 앱 파일 76개 중 48개가 쓰는, Tweakers 에서 가장 많이 쓰이는 모듈입니다. 여기서는 그리드와 상관없이 직접 만드는 방법과, 만든 뒤 항목을 바꾸는 방법을 다룹니다.

샘플: [03_generatedToolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/03_generatedToolbar.html), [ToolbarActions.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/ToolbarActions.js)

::: info 근거
Tweakers.js 의 GeneratedToolbar, TweakerFunction, TypeEnums. Utilities.js 의 attachSimpleCallback. 호출부: DataGridView setToolbar, ENOXCollectionToolBar (ENOXGeneratedToolBar), DocumentFiles, E6WCommonUI, CompareWidget2, ENONewWidget, MapDemoWidget, ControlsEx, ENXSBToolbarClient. 샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 만들기

엔트리 JSON 을 바로 넘기지 않고, `createTreeDocument` 로 데이터(TreeDocument)를 만든 뒤 `items` 로 넘깁니다.

<<< @/../TweakersSample/03_generatedToolbar.html#create{js}

- `createTreeDocument` 는 prototype 에서 바로 부릅니다. JSON 문자열도 받습니다.
- 엔트리 키(`id`, `position`, `dataElements` ...)는 [툴바 (setToolbar)](/datagridview/api/toolbar) 와 같습니다.
- `executionContext` 에 넣은 객체가 모든 콜백의 `e.context.executionContext` 로 전달됩니다. `grid.setToolbar` 는 여기에 그리드를 넣습니다.
- 생성자 옵션은 [GeneratedToolbar API](/tweakers/api/generated-toolbar#생성자-옵션) 에 있습니다. 목록에 없는 키(`context`, `minHeight`, `className` 등)는 무시됩니다.

::: warning 넘긴 JSON 은 변환되면서 바뀝니다
`createTreeDocument` 는 엔트리 객체를 그 자리에서 고칩니다 (`dataElements` 를 지우고 `grid` 를 붙임). 같은 객체로 다시 부르면 `Missing dataElements` 오류가 납니다. 다시 만들 때(`updateModel` 포함)는 샘플의 `buildEntries()` 처럼 매번 새 객체를 만듭니다.
:::

## 버튼 콜백

버튼 동작은 두 방식으로 연결합니다. 샘플에서 둘 다 실제로 불리는 것을 확인했습니다.

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
| `e.context.value` | 항목의 현재 값. 함수 버튼이면 `value` 에 넣은 함수 자신 |

### 함수 버튼

<<< @/../TweakersSample/03_generatedToolbar.html#function-buttons{js}

### 모듈 버튼

<<< @/../TweakersSample/03_generatedToolbar.html#action-buttons{js}

`action.module` 의 모듈은 클릭할 때 불러옵니다. 함수는 `argument` 의 키를 그대로 받습니다.

<<< @/../TweakersSample/ToolbarActions.js#zoom{js}

::: warning action 에 함수를 넣으면 동작하지 않습니다
`action` 은 안의 키(`module`, `func`, `argument`)를 복사해서 쓰므로 `action: function () {}` 은 아무것도 연결되지 않습니다. 함수는 `value` 에 넣습니다. (2025, 2026 동일)
:::

## 메뉴형 버튼과 보기 전환

<<< @/../TweakersSample/03_generatedToolbar.html#menu{js}

### 메뉴형 버튼

`typeRepresentation: 'functionMenuIcon'` 에 `value: { menu: [...] }` 를 넣으면 누를 때 목록이 펼쳐집니다. 앱 호출부에서 가장 흔한 모양입니다 (ENOXCollectionToolBar, DocumentFiles 정렬 메뉴 등).

| 메뉴 항목 키 | 내용 |
| --- | --- |
| `type` | `'PushItem'` (누르는 항목), `'RadioItem'` (하나만 고르는 항목) 등 |
| `title` | 글자 |
| `icon` | `{ iconName, fontIconFamily: 1 }` |
| `action.callback` | 누르면 호출 |

- 메뉴 항목을 눌러도 엔트리의 `onNodeUpdate` 는 불리지 않습니다. 동작은 각 항목의 `action.callback` 에 넣습니다.
- 엔트리에 `children: [{ id, dataElements: { typeRepresentation: 'PushItem', label, action } }]` 로 넣어도 같은 메뉴가 됩니다. 변환할 때 `label` 은 `title`, `typeRepresentation` 은 `type` 으로 바뀌어 `grid.data.menu` 에 들어갑니다.
- 메뉴 목록 전체를 바꿀 때는 `toolbar.updateNodeModel(id, { grid: { data: { menu: newMenu } } })` 를 씁니다 (ENOXCollectionToolBar 방식).
- 하위 항목 하나는 `toolbar.updateNodeModel('하위 id', { title: '새 글자' })` 처럼 메뉴 항목 키로 바꿉니다. 바뀐 내용은 다음에 메뉴를 열 때 보입니다.

### 보기 전환 (layout, TypeEnums)

`typeRepresentation: 'layout'` 은 목록 / 타일 같은 보기 전환 버튼입니다. 값과 `possibleValues` 가 `{ value, label, icon }` 객체이고, `DS/Tweakers/TypeEnums` 의 `Layout` 에 이 객체가 미리 만들어져 있습니다 (앱 파일 76개 중 8개가 사용, 모두 이 용도).

| `TypeEnums.Layout` 키 | `value` | 아이콘 |
| --- | --- | --- |
| `DataGridView` | `'datagridview'` | `view-list` |
| `SmallTile` / `BigTile` | `'smalltile'` / `'bigtile'` | `view-small-tile` / `view-big-tile` |
| `SmallThumbnail` / `BigThumbnail` | `'smallthumbnail'` / `'bigthumbnail'` | `view-small-thb` / `view-big-thb` |
| 그 밖 | `TagCloud`, `ImageWallThumbnail`, `TextualTile`, `Mixed`, `Large`, `GraphList`, `List`, `Kanban`, `Graph`, `Gantt`, `Map` | |

- `label` 은 언어 파일에서 옵니다 (한국어 화면에서 `테이블`, `타일`, `큰 타일`).
- 버튼에는 지금 값의 아이콘이 보이고, 누르면 `possibleValues` 가 메뉴로 펼쳐집니다. 고르면 `onNodeUpdate` 가 불립니다.
- 객체는 `Object.freeze` 되어 있으니 고치지 말고 그대로 넣습니다.

::: warning 고른 뒤의 값 모양이 2025 / 2026 에서 다릅니다
2025 는 고른 뒤에도 `getAttributeValue('data')` 가 `{ value, label, icon }` 객체이지만, 2026 은 `'bigtile'` 같은 `value` 문자열이 됩니다. 앱 호출부의 `getAttributeValue('data').value` 는 2026 에서 `undefined` 가 됩니다. 샘플처럼 `data.value || data` 로 읽으면 두 버전 모두 동작합니다.
:::

## 값이 바뀔 때

<<< @/../TweakersSample/03_generatedToolbar.html#search{js}

| 엔트리 키 | 시점 | 함수일 때 인자 |
| --- | --- | --- |
| `onNodeUpdate` | 값 확정 (Enter, 콤보 선택). `updateNodeModel` 로 항목을 바꿀 때도 매번 (값뿐 아니라 `visibleFlag`, `possibleValues` 등도) | `(nodeModel, 바뀐 속성)`, `this` 는 툴바 |
| `onNodeLiveUpdate` | 타이핑할 때마다 | `(nodeModel, 입력값)` |
| `onViewFocus` / `onViewBlur` | 항목 포커스 / 해제 | `(nodeModel)` |

값은 `nodeModel.getAttributeValue('data')` 로 읽습니다. 모듈 형태(`{ module, func }`)로 넣으면 버튼 콜백과 같은 `e.context` 를 받습니다.

::: warning onNodeUpdate 는 값이 바뀔 때만 오지 않습니다
샘플에서 검색창을 숨기면(`visibleFlag: false`) 값은 그대로인데 `onNodeUpdate keyword = ab` 가 다시 옵니다. `onNodeUpdate` 에서 검색을 실행하는 코드라면 이전 값과 비교해서 같으면 건너뜁니다.
:::

::: warning onNodeLiveUpdate 는 함수로
2025 버전은 `onNodeLiveUpdate` 를 모듈 형태로 넣으면 내부 오류(ReferenceError)가 납니다. 2026 에서 고쳐졌습니다.
:::

### 툴바 이벤트

`toolbar.addEventListener(이름, fn)` 으로 받습니다.

| 이벤트 | 시점 |
| --- | --- |
| `modelUpdated` | 항목 하나가 바뀔 때마다. `onNodeUpdate` 바로 다음. `updateNodeModel` 로 상태(`disabled`, `label`)만 바꿔도 발생 |
| `onReady` | 툴바 전체를 그릴 때마다. 처음 한 번, `pushUpdateView()` 때마다, `updateModel` 때는 항목 수만큼 여러 번, `items.addRoot` / `removeRoot` 때 |

`onReady` 는 한 번만 오지 않습니다. 여기서 `updateNodeModel` 을 `prepareUpdateView` / `pushUpdateView` 로 감싸 부르면 다시 `onReady` 가 와서 끝없이 돕니다. 첫 상태는 엔트리 JSON 에 넣고(샘플의 `disabled: !view.dirty`), `onReady` 에서는 상태를 바꾸지 않습니다. 모든 항목이 만들어졌는지만 알고 싶으면 `toolbar.isReady()` 를 씁니다.

## 항목 바꾸기

### 상태와 값

`updateNodeModel(id, 바꿀 옵션)` 하나로 바꿉니다. 실제 호출부에서 가장 많이 쓰는 메서드입니다. 그 항목만 바로 바뀌고 툴바 전체를 다시 그리지 않습니다.

<<< @/../TweakersSample/03_generatedToolbar.html#update{js}

```js
toolbar.updateNodeModel('save', { disabled: true });
toolbar.updateNodeModel('save', { visibleFlag: false });
toolbar.updateNodeModel('save', { tooltip: '저장 중입니다' });
toolbar.updateNodeModel('save', { icon: { iconName: 'check', fontIconFamily: 1 } });
toolbar.updateNodeModel('viewMode', { possibleValues: ['목록', '썸네일', '상세', '표'] });
toolbar.updateNodeModel('keyword', { grid: { data: 'PRT-0001' } });
```

| 바꿀 것 | 옵션 | 바로 보이는지 |
| --- | --- | --- |
| 비활성 / 숨김 | `{ disabled: true }` / `{ visibleFlag: false }` | 예 |
| 툴팁 / 콤보 목록 | `{ tooltip }` / `{ possibleValues }` | 예 |
| 아이콘 | `{ icon }` 또는 `{ grid: { semantics: { icon } } }` | 예 |
| 값 | `{ grid: { data: 값 } }` | 예 |
| 라벨 글자 (`displayLabel: true`) | `{ label }` | 아니요. 툴바를 다시 그릴 때 반영 |

- `grid` 안은 키 단위로 합쳐지므로 `{ grid: { data } }` 만 넘겨도 타입이 유지됩니다.
- 값은 `dataElements.value` 가 `grid.data` 로 옮겨져 저장됩니다. 2025 에서 `{ value: 값 }` 은 반영되지 않습니다. 2026 부터는 `{ value }` 도 `grid` 아래로 옮겨져 반영됩니다.
- `{ icon }` 은 2025 에서도 버튼 아이콘에 바로 반영됩니다 (편집기 속성으로 그대로 넘어감). ENOXCollectionToolBar 는 선택 표시를 위해 `{ grid: { semantics: { icon: { iconName, fontIconFamily, className } } } }` 로 `className` 을 바꿉니다.
- `displayLabel: true` 로 보이는 라벨은 처음 그릴 때 만든 글자가 남습니다. 라벨을 바꿀 때는 샘플의 `setDirty` 처럼 `prepareUpdateView()` / `pushUpdateView()` 로 감싸 툴바를 다시 그립니다. (2026 도 같음)

### prepareUpdateView / pushUpdateView

```js
toolbar.prepareUpdateView();
toolbar.updateNodeModel('save', { disabled: !dirty });
toolbar.updateNodeModel('edit', { label: dirty ? '편집 중' : '편집' });
toolbar.pushUpdateView();
```

- 사이의 `updateNodeModel` 도 각 항목에 바로 적용되고 `onNodeUpdate`, `modelUpdated` 도 그때그때 옵니다. 모아 두었다가 한 번에 적용하는 것이 아닙니다.
- `pushUpdateView()` 는 **툴바 전체를 지우고 모든 항목 편집기를 다시 만듭니다** (`onReady` 가 다시 옴). 상태와 값만 바꿀 때는 감싸지 않는 편이 가볍습니다. 라벨 글자처럼 다시 그려야 보이는 것을 바꿀 때 씁니다.

### 읽기

<<< @/../TweakersSample/03_generatedToolbar.html#read{js}

```js
var node = toolbar.getNodeModelByID('keyword');
node.getAttributeValue('data');       // 값
node._associatedView;                 // 항목의 편집기 (onReady 뒤)
```

- `getNodeModelByID` 는 최상위 항목만 찾고, 없으면 `undefined` 입니다. 하위 메뉴(`children`) 항목은 찾지 못합니다. 샘플처럼 `updateModel` 로 항목을 뺀 뒤 그대로 `.getAttributeValue` 를 부르면 오류가 나므로 확인하고 씁니다.
- `updateNodeModel` 은 최상위에 없으면 하위 메뉴에서 같은 `id` 를 찾아 고칩니다. 2025 는 최상위에서 찾았을 때만 `true` 를 돌려주고 나머지는 `undefined` 입니다.

### 추가와 삭제

`addEntry` 같은 메서드는 없습니다. 전체를 다시 만들거나 `items` 를 직접 고칩니다. 어느 쪽이든 툴바가 자동으로 다시 그립니다.

<<< @/../TweakersSample/03_generatedToolbar.html#replace{js}

```js
toolbar.items.removeRoot(toolbar.getNodeModelByID('save'));
```

- `updateModel` 은 모든 항목을 새로 만들므로 사용자가 입력한 값, `updateNodeModel` 로 바꾼 상태는 사라지고 JSON 의 값으로 돌아갑니다.
- `items.removeRoot` 는 그 항목만 빠지고 툴바를 한 번 다시 그립니다.

## 사용자 타입 쓰기

툴바 JSON 의 최상위 `enums`, `typeRepresentations` 는 `GeneratedToolbar` 를 직접 만들 때 **무시됩니다**. `grid.setToolbar` 가 대신 등록해 주는 것뿐입니다. 직접 만들 때는 먼저 등록하고, 그 Factory 를 생성자의 `typeRepresentationFactory` 로 넘깁니다 (위 "만들기" 예제).

<<< @/../TweakersSample/03_generatedToolbar.html#register{js}

등록 방법은 [사용자 타입 등록](/tweakers/custom-type) 을 보세요.

## 2026 버전 차이

- 넘친 항목 팝업(`popupDisplayStyle`) 기본값이 `'TreeListView'` 에서 `'DataGridView'` 로 바뀌었습니다.
- 생성자 옵션 `displayLabel` (툴바 전체 라벨 표시), `contextualMenu` (`{ displayLabel: true }` 면 우클릭으로 라벨 보이기/숨기기) 가 추가되었습니다.
- 엔트리 키 `alwaysInOverflow: true` 로 항상 넘침 팝업에만 두는 항목을 만들 수 있습니다.
- `updateNodeModel` 이 찾았는지 여부(`true` / `false`)를 돌려줍니다. 하위 메뉴 항목을 찾았을 때도 `true` 입니다.
- `updateNodeModel(id, { value })` 가 값에 반영됩니다.
- `layout` 항목에서 고른 뒤의 값이 객체가 아니라 `value` 문자열입니다 (위 경고).
