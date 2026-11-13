# 목록, 트리, 타일 뷰 <Badge type="info" text="원본 분석" />

객체 하나를 카드(그림, 제목, 부제, 설명, 상태 아이콘)로 보여 주는 `DS/Controls/Responsive*View`, 라벨 트리 `DS/Controls/TreeBase` / `TreeNodeBase`, 앞뒤로 뒤집는 `Tile`, 옛 `ThumbnailView` / `TileView` 를 다룹니다. 여러 객체를 타일로 늘어놓는 목록은 `DS/CollectionView/Responsive*CollectionView` 가 이 카드 컨트롤을 셀로 써서 그립니다.

::: info 근거
Controls.js 의 ResponsiveViewAdaptor (publishedProperties, `_applyPicture`, `_displayAllStatusBarIcons`, `_applyOnContextMenuBuildCallback`, `_setCtxMenuCB`, `_applyViewWidth`, handleEvents), ResponsiveTileView, ResponsiveThumbnailView (`_applyProgressValueData`), ResponsiveTextualTileView, ViewBase, ThumbnailView, TileView, TileCellView, ThumbnailCellView, Tile, TreeBase (`_loadModel`, on* 구독 함수), TreeNodeBase (addChild, expand, collapse, `_bindBehaviors`, search), TreeNode, Tree. CollectionView.js 의 ResponsiveCollectionView (getLabel 등 getter), ResponsiveTilesCollectionView (onCellRequest), ResponsiveThumbnailsCollectionView, TreeDocument 모델 제공자의 getPropertyValue. Core.js 의 BaseComponent.setProperties. UWA2 의 Class.js, Class/Options.js. 호출부: CfgAuthoringContextUX, CompareCommon, ENOXIDCard, ENOXModelListView, ENXMeetingMgmt, ENXDataGrid, ENORouteMgmt, 3DPlayApp, VCXWebGUI, WebUtils, SceneGraphTree
:::

## 무엇을 쓸까

| 하고 싶은 일 | 모듈 | 앱 사용 파일 |
| --- | --- | --- |
| 객체 하나를 가로형 카드로 | `DS/Controls/ResponsiveTileView` | 9 |
| 객체 하나를 그림이 큰 세로형 카드로 | `DS/Controls/ResponsiveThumbnailView` | 5 |
| 글자 위주 넓은 카드 | `DS/Controls/ResponsiveTextualTileView` | 3 |
| 위 카드들을 바탕으로 나만의 카드 만들기 | `DS/Controls/ResponsiveViewAdaptor` 상속 | 1 (ENORouteMgmt) |
| TreeDocument 의 행들을 타일 / 썸네일 목록으로 | `DS/CollectionView/ResponsiveTilesCollectionView`, `ResponsiveThumbnailsCollectionView`, `ResponsiveLargeTilesCollectionView` | 33, 14, 17 |
| 데이터 모델 없이 간단한 라벨 트리 | `DS/Controls/TreeBase` + `TreeNodeBase` | 5 |
| 3D 장면 경로(PathElement)와 연결된 트리 | `DS/Controls/Tree` + `TreeNode` | 2 |
| 앞면 / 뒷면을 뒤집는 카드 | `DS/Controls/Tile` | 1 |
| 옛 방식 썸네일 / 타일 | `DS/Controls/ThumbnailView`, `TileView` | 3 / 1 |

- 행 데이터를 트리로 보여 주고 편집까지 하려면 그리드 트리가 맞습니다 ([트리 구조](/datagridview/tree)). `DS/Controls/TreeBase` 는 TreeDocument 를 쓰지 않는 별도의 DOM 트리입니다.
- `TileCellView`, `ThumbnailCellView`, `ViewBase` 는 다른 모듈 안에서 쓰는 부품입니다. 직접 만들지 않습니다 ([셀 전용 부품](#셀-전용-부품-tilecellview-thumbnailcellview-viewbase)).
- 앱 사용 파일 수는 webapps 2025 에서 그 모듈을 `define` 의존성으로 부르는 파일 수입니다 (컨트롤 자신의 패키지 제외).

## DataGridView, TreeDocument 와의 관계

[사용자 뷰와 화면 상태 저장](/datagridview/custom-views) 의 "사용자 뷰" 는 컬럼 너비, 순서, 정렬을 이름 붙여 저장하는 기능입니다. 타일 / 썸네일 보기와는 관계가 없습니다.

DataGridView 자체에는 타일 / 썸네일 보기가 없습니다 (DataGridView.js 에 `Responsive*` 컨트롤이나 `thumbnail` 참조가 없음). 앱은 그리드와 **같은 TreeDocument** 를 타일 목록에 넘겨 화면을 바꿔 보여 줍니다.

```js
require([
  'DS/DataGridView/DataGridView',
  'DS/CollectionView/ResponsiveTilesCollectionView',
  'DS/TreeModel/TreeDocument',
  'DS/TreeModel/TreeNodeModel'
], function (DataGridView, ResponsiveTilesCollectionView, TreeDocument, TreeNodeModel) {
  var doc = new TreeDocument();
  doc.addRoot(new TreeNodeModel({
    label: 'PRT-0001',
    icons: ['../assets/part-icon.png'],
    grid: { title: '브라켓', subLabel: '브라켓', description: '설명', thumbnail: '../assets/part.png' }
  }));

  var grid = new DataGridView({ treeDocument: doc, columns: [{ text: '품번', dataIndex: 'tree' }, { text: '품명', dataIndex: 'title' }] });
  var tiles = new ResponsiveTilesCollectionView({
    model: doc,
    displayedOptionalCellProperties: ['description', 'contextualMenu']
  }).inject(el);
});
```

| 층 | 모듈 | 역할 |
| --- | --- | --- |
| 데이터 | `TreeDocument`, `TreeNodeModel` | 행 묶음과 행 하나 ([데이터 (TreeDocument)](/datagridview/api/data#treenodemodel)) |
| 목록 | `ResponsiveTilesCollectionView` 등 | 보이는 행마다 셀을 만들고, 행 값을 셀 컨트롤 속성으로 옮김 |
| 셀 | `ResponsiveTileView` 등 | 이 문서의 카드 컨트롤 |

타일 목록이 행에서 읽는 키입니다. `nodeModel.options[키]` 가 있으면 그것을, 없으면 `nodeModel.options.grid[키]` 를 씁니다.

| 카드 속성 | 행에서 읽는 값 |
| --- | --- |
| `title` | `label` |
| `subtitle` | `subLabel` |
| `picture` | `options.thumbnail`, 없으면 `options.grid.thumbnail` |
| `icon` | `options.icons[0]` (없으면 `null`) |
| `badges` | `nodeModel.getBadges()` 의 `topRight`, `bottomRight` |
| 그 밖 | 같은 이름: `description`, `propertiesList`, `statusbarIcons`, `statusbarIconsTooltips`, `contextualMenu`, `color`, `activeFlag`, `customTooltip`, `clickableTitle`, `multipleTitleLineNumber`, `disabled` |

- 목록 옵션 `displayedOptionalCellProperties` (기본 `['All']`) 로 선택 항목을 고릅니다. `['None']` 이면 제목, 부제, 그림, 아이콘, 색만 그립니다. 그 밖에는 `description`, `propertiesList`, `activeFlag`, `contextualMenu`, `statusbarIcons` 중 넣은 것만 그립니다.
- 키 이름을 바꾸고 싶으면 목록의 getter (`getLabel(nodeModel)`, `getSubLabel`, `getThumbnail` 등)를 덮어씁니다. ENOXModelListView, ENXDataGrid 가 이렇게 `options.grid` 의 다른 컬럼을 제목으로 씁니다.
- 목록과 셀 컨트롤 대응은 [API](/controls/api/collection-views#타일-목록-collectionview) 에 있습니다.

::: tip 옛 썸네일 그리드
`DS/Tree/ThumbnailGridView`, `DS/Tree/TileGridView` 는 `ThumbnailCellView`, `TileCellView` 를 셀로 쓰는 옛 목록입니다 (앱 2개 파일). ENXDataGrid 는 주석으로 남긴 `ThumbnailGridView` 대신 `ResponsiveThumbnailsCollectionView` 를 씁니다. 새로 만들 때는 CollectionView 쪽을 씁니다.
:::

## 카드 공통 (ResponsiveViewAdaptor)

`ResponsiveTileView`, `ResponsiveThumbnailView`, `ResponsiveTextualTileView` 의 부모입니다. 속성 대부분이 여기에 있습니다. WebUX 컨트롤이므로 [공통 사용법](/controls/webux-controls#공통-사용법) (만들기, 속성 쓰기, `addEventListener`) 을 그대로 따릅니다.

```js
require(['DS/Controls/ResponsiveTileView'], function (ResponsiveTileView) {
  var tile = new ResponsiveTileView({
    picture: '../assets/part.png',
    title: 'PRT-0001',
    subtitle: '브라켓',
    description: '알루미늄, 2개 구멍',
    allowUnsafeHTMLContent: false,
    statusbarIcons: ['pencil', 'trash'],
    statusbarIconsTooltips: ['수정', '삭제'],
    contextualMenu: ['열기', '삭제'],
    onContextMenuBuildCallback: function (labels) {
      return labels.map(function (label, i) {
        return { type: 'PushItem', title: label, action: { callback: function () { console.log('메뉴', i); } } };
      });
    }
  }).inject(el);

  tile.getContent().setStyle('width', '100%');
  tile.addEventListener('StatusbarIconPointerDown', function (e) {
    console.log(e.options.iconIndex, e.options.icon);
  });
  tile.subtitle = '브라켓 (개정 B)';
});
```

### 그리는 내용

| 키 | 화면 |
| --- | --- |
| `picture` | 그림 URL (CSS 배경). HTML 요소나 컨트롤도 됨 (`allowUnsafeHTMLContent` 가 `true` 일 때만) |
| `icon` | 제목 앞 작은 아이콘 ([아이콘](/controls/webux-controls#아이콘) 규칙) |
| `title` / `subtitle` / `description` | 제목 한 줄 (`multipleTitleLineNumber: true` 면 두 줄), 부제, 설명 두 줄. 넘치면 말줄임 |
| `propertiesList` | 글자 배열. 설명이 비어 있을 때만 두 열로 표시 |
| `color` | 가장자리 색 띠. `''`, `'initial'` 이면 없음 |
| `badges` / `statusbarIcons` | 아래 상태 막대 |
| `contextualMenu` | 비어 있지 않으면 메뉴 버튼(점 세 개)이 생김 |

`title` 은 툴팁으로도 쓰입니다. 다른 툴팁을 원하면 `customTooltip` 에 글자나 `DS/Core/TooltipModel` 객체를 줍니다. 전체 키와 메서드는 [API](/controls/api/collection-views#responsiveviewadaptor) 에 있습니다.

::: warning 기본은 HTML 로 해석합니다
`allowUnsafeHTMLContent` 기본값이 `true` 입니다. `title`, `subtitle`, `description`, `propertiesList`, `customTooltip` 에 사용자가 입력한 글자(객체 이름, 설명)를 넣으면 태그가 그대로 해석됩니다. ENOXIDCard, CompareCommon 은 `allowUnsafeHTMLContent: false` 를 줍니다. 항목별로 정하려면 `shouldCellAllowUnsafeHTMLContentFor: function (origin) { return origin === 'description'; }` 처럼 씁니다 (`origin` 은 `'picture'`, `'title'`, `'subtitle'`, `'description'`, `'propertiesList'`, `'customTooltip'`).
:::

::: warning 그림이 없으면 안내 글자가 나옵니다
`picture` 를 비우면 그림 자리에 `PLACE YOUR PNG PICTURE HERE` 가 표시됩니다 (서버 측 데이터 목록 셀일 때만 빈 칸). 그림이 없는 객체에는 기본 이미지 URL 을 넣습니다. ENXDataGrid 는 `icon64x64ImageNotFound.png` 를 넣습니다. `ResponsiveTextualTileView` 는 그림 유무와 관계없이 이 글자 요소를 만듭니다.
:::

### 상태 막대 (statusbarIcons)

카드 아래 줄에 아이콘을 최대 8개 놓습니다. 9번째부터는 잘라 버립니다.

| 형태 | 예 |
| --- | --- |
| 아이콘 이름 | `'trash'` |
| 객체 | `{ icon: 'trash', label: '2', emphasize: 'error', tooltip: { shortHelp: '삭제' } }` |

- `statusbarIconsTooltips[i]` 는 i번째 아이콘 툴팁입니다. 글자면 `shortHelp` 로 바뀝니다.
- `badges` 배열의 아이콘은 상태 아이콘 **뒤에** 이어서 놓입니다.
- 아이콘을 누르면 `StatusbarIconPointerDown` 이벤트가 납니다. `e.options` 는 `{ iconIndex, icon, text }` 입니다. 생성 옵션 `onStatusbarIconPointerDown: function (e) { ... }` 도 같은 이벤트 리스너로 등록됩니다.
- 상태 막대에 아무것도 없으면 줄이 숨습니다. 빈 줄을 남기려면 `emptyStatusbarVisibleFlag: true` 입니다.

::: warning 단독 카드에서는 아이콘 객체의 callback 이 불리지 않습니다
`{ icon, callback }` 의 `callback` 은 카드가 타일 목록의 셀일 때만 불립니다 (`cellInfos`, `clickedIconIndex` 를 넣어 호출). 단독 카드에서는 `StatusbarIconPointerDown` 으로 받습니다. 배지를 눌러도 같은 이벤트가 나고 `iconIndex` 가 상태 아이콘 개수 이상이 됩니다. CfgAuthoringContextUX 는 `iconIndex < statusbarIcons.length` 로 거릅니다.
:::

::: warning 배열은 새로 만들어 넣습니다
속성은 이전 값과 `!==` 로 비교해서 다를 때만 다시 그립니다. `tile.statusbarIcons.push('x')` 후 같은 배열을 다시 넣으면 아무 일도 없습니다. CfgAuthoringContextUX 도 배열을 복사해 `setProperties({ statusbarIcons: 새배열, statusbarIconsTooltips: 새배열 })` 로 넣습니다.
:::

`statusbarLabelsWidthRatios` 는 받아 두기만 하고 화면에 쓰지 않습니다 (2025 는 효과 없는 식, 2026 은 빈 함수).

### 메뉴 (contextualMenu)

`contextualMenu` 에 글자 배열을 주면 메뉴 버튼이 생깁니다. 버튼을 누르거나 카드를 우클릭하면 메뉴가 열립니다. 메뉴 항목은 `onContextMenuBuildCallback(labels)` 가 돌려준 배열입니다. 항목 형식은 [메뉴 항목](/datagridview/context-menu#메뉴-항목) 과 같습니다.

::: warning onContextMenuBuildCallback 이 없으면 메뉴가 동작하지 않습니다
콜백 없이 `contextualMenu` 만 주면 글자 그대로 항목이 생기지만, 누르면 콘솔에 `No action implemented on this context menu entry!` 오류만 찍힙니다.
:::

### 선택 표시와 크기

- 단독 카드는 선택 상태를 스스로 바꾸지 않습니다. 체크 상자 모양도 목록 셀일 때만 다중 선택에 쓰입니다. `highlight()` / `unhighlight()` / `isHighlighted()` 로 직접 표시합니다. CompareCommon 은 만들자마자 `highlight()` 를 부릅니다. `disabled` 면 `highlight()` 가 무시됩니다.
- `activate()` / `deactivate()` 는 활성(현재 항목) 표시, `activeFlag: true` 는 활성 모드 모양입니다.
- 너비는 `tileWidth` / `thumbnailWidth` (px) 입니다. 허용 범위를 벗어난 값은 화면에 반영되지 않습니다. 부모에 맞추려면 앱처럼 `getContent().setStyle('width', '100%')` 로 둡니다.

| 컨트롤 | 너비 키 | 기본 | 허용 |
| --- | --- | --- | --- |
| ResponsiveTileView | `tileWidth` | 260 | 260 ~ 540 |
| ResponsiveThumbnailView | `thumbnailWidth` | 200 | 150 ~ 420 |

### 직접 카드 만들기

ENORouteMgmt 의 TaskCustomTileView 처럼 `ResponsiveViewAdaptor.inherit({ name: '...', buildView: function () { ... } })` 로 자기 카드를 만들 수 있습니다. `buildView` 에서 `this.elements` 의 `picture`, `title`, `subtitle`, `description`, `propertiesList`, `menu`, `statusbar`, `checkbox`, `highlightBorder` 등 부모가 쓰는 요소를 모두 만들어야 합니다. 세 하위 컨트롤의 `buildView` 가 예입니다. 일반적인 상속 규칙은 [컨트롤 직접 만들기](/controls/webux-controls#컨트롤-직접-만들기) 에 있습니다.

## ResponsiveTileView

가로형 카드입니다. 왼쪽에 그림, 오른쪽에 제목, 부제, 설명(또는 속성 목록), 아래에 상태 막대가 있습니다. 자기 속성은 `tileWidth` 하나입니다. 나머지는 [카드 공통](#카드-공통-responsiveviewadaptor) 입니다.

CfgAuthoringContextUX 는 `picture`, `icon`, `customTooltip`, `title`, `multipleTitleLineNumber: false`, `subtitle`, `description`, `statusbarIcons`, `statusbarIconsTooltips`, `contextualMenu: []`, `onStatusbarIconPointerDown` 조합으로 세션 카드를 만듭니다. CompareCommon 은 여기에 `allowUnsafeHTMLContent: false`, `contextualMenu` + `onContextMenuBuildCallback` 을 더합니다.

## ResponsiveThumbnailView

그림이 위에 크게 놓이는 세로형 카드입니다. 자기 속성은 `thumbnailWidth`, `progressValueData` 입니다.

```js
require(['DS/Controls/ResponsiveThumbnailView'], function (ResponsiveThumbnailView) {
  var card = new ResponsiveThumbnailView({
    picture: '../assets/part.png',
    title: 'PRT-0001 A.1',
    subtitle: '재질: 알루미늄',
    description: '설명',
    allowUnsafeHTMLContent: false,
    progressValueData: { progressValue: 40, emphasize: 'info', tooltipInfos: { shortHelp: '40%' } }
  }).inject(el);
  card.progressValueData = { progressValue: 80 };
});
```

- `progressValueData` 를 주면 그림 아래에 [ProgressBar](/controls/webux-controls#progressbar) 가 나옵니다. `progressValue` 는 0 이상의 숫자여야 합니다. 아니면 콘솔 경고만 찍고 막대를 바꾸지 않습니다.
- 타일 목록 안에서는 목록 옵션 `useProgressBar: true` 일 때만 막대를 그립니다.
- ENOXIDCard 는 객체 카드의 그림 부분을 이 컨트롤로 만듭니다 (`picture`, `icon`, `title`, `multipleTitleLineNumber: false`, `allowUnsafeHTMLContent: false`, `subtitle`, `description`).

::: warning 제목 두 줄을 다시 한 줄로 되돌릴 수 없습니다
ResponsiveThumbnailView 의 `multipleTitleLineNumber` 는 `true` 로 바꿀 때만 반영됩니다. 이후 `false` 로 바꿔도 두 줄 그대로입니다. 처음 만들 때 정합니다.
:::

## ResponsiveTextualTileView

`ResponsiveTileView` 를 상속한 글자 위주 카드입니다. 제목 줄 높이(28px)와 설명 줄 높이(19px)가 크고, `multipleTitleLineNumber` 를 무시하고 항상 한 줄입니다. 자기 속성은 없습니다. 주로 `ResponsiveLargeTextualTilesCollectionView` 의 셀로 쓰입니다.

## 트리 (TreeBase, TreeNodeBase)

`TreeBase` 는 트리 상자, `TreeNodeBase` 는 노드입니다. UWA 방식 컨트롤이라 옵션은 생성자에서만 받고(`defaultOptions` 와 깊게 합쳐짐), 속성 대입 대신 메서드를 씁니다. 이벤트는 `tree.onNodeClick(fn)` 같은 구독 함수로 받습니다.

```js
require(['DS/Controls/TreeBase', 'DS/Controls/TreeNodeBase'], function (TreeBase, TreeNodeBase) {
  var tree = new TreeBase({
    roots: [
      { label: '조립품 A', children: [{ label: '부품 A-1' }, { label: '부품 A-2' }] }
    ]
  }).inject(el);

  var root = tree.getNthRoot(0);
  root.addChild(new TreeNodeBase({ label: '부품 A-3', data: { id: 'p3' } }));
  root.expand();

  tree.onNodeClick(function (node) {
    console.log(node.getLabel(), node.options.data);
  });
  tree.onPostExpand(function (info) {
    console.log('펼침', info.node.getLabel());
  });
});
```

### 노드 만들기

| 방법 | 하위 노드 |
| --- | --- |
| 생성자 `roots: [{ label, children: [...] }]` | `children` 의 옵션 객체를 따라 끝까지 노드를 만듦 |
| `tree.addRoot({ label })` | 루트 노드 하나를 만들고 돌려줌 |
| `node.addChild(new TreeNodeBase({ ... }), index?)` | 노드 하나를 붙임. `index` 를 주면 그 자리에 끼움 |

::: warning addRoot 에 준 children 은 노드가 되지 않습니다
옵션 객체의 `children` 을 노드로 바꾸는 것은 생성자의 `roots` 처리뿐입니다. `tree.addRoot({ label: 'A', children: [{ label: 'B' }] })` 는 펼침 단추만 있고 펼쳐도 비어 있는 루트를 만듭니다. 나중에 붙일 때는 `addRoot` 로 루트를 받은 뒤 `addChild(new TreeNodeBase(...))` 로 붙입니다 (WebUtils, 3DPlayApp 의 통계 트리가 이 방식).
:::

::: warning addChildren 은 쓰지 않습니다
`node.addChildren(nodes)` 는 넘긴 배열이 아니라 `this.children` (없음)을 돌다가 `TypeError` 가 납니다. 2026 도 같습니다. `addChild` 를 반복해서 부릅니다.
:::

- `children: []` (빈 배열) 을 준 노드는 하위가 없어도 펼침 단추가 생깁니다. SceneGraphTree 는 `'__dummy__'` 노드 하나를 붙여 두고, `node.onPreExpand(fn)` 에서 지우고 실제 하위 노드를 붙이는 지연 로딩을 씁니다.
- `label` 은 HTML 로 들어갑니다 (`html: label`). 사용자 입력은 이스케이프해서 넣습니다.
- `icons: ['url', ...]` 는 라벨 앞 그림입니다. 바꿀 때는 `node.setIcon({ picture: 'url', iconID: 0 })` 입니다.

### 이벤트

트리의 구독 함수에 콜백을 넘깁니다. 대부분 구독 토큰을 돌려주지만 트리에는 해제 함수가 없습니다.

| 함수 | 시점 | 콜백 인자 |
| --- | --- | --- |
| `onNodeClick` / `onNodeDblClick` | 라벨 클릭 / 더블 클릭 | 노드 |
| `onPreExpand` / `onExpand` / `onPostExpand` | 펼치기 전 / 중 / 후 | `{ node }` |
| `onPreCollapse` / `onCollapse` / `onPostCollapse` | 접기 전 / 중 / 후 | `{ node }` |
| `onLabelChange` | `node.setLabel(text)` | 새 라벨 |
| `onNodeDragStart` / `onNodeDragOver` / `onNodeDragLeave` | 노드 끌기 | 노드 |
| `onNodePreDrop` / `onNodePostDrop` | 놓기 전 / 후 | 놓기 정보 (`info.from` 이 끌어 온 노드) |
| `onNodeDrop(fn)` | 놓을 때 기본 이동 대신 실행 | `this` 는 놓은 곳 노드, 인자는 놓기 정보 |

전체 함수와 호출 순서는 [API](/controls/api/collection-views#treebase) 에 있습니다. 노드에도 `node.onPreExpand(fn)`, `onPostExpand`, `onPreCollapse`, `onPostCollapse` 가 있습니다. 이것은 구독이 아니라 **덮어쓰기** 입니다 (노드당 하나, `this` 가 노드, 인자 없음).

::: warning 트리 옵션 onClick 은 인자를 받지 못합니다
`new TreeBase({ onClick: fn })` 도 라벨 클릭에 불리지만 `fn.apply(node, node, data)` 형태로 불러 인자가 비어 있습니다. `this` 만 노드입니다. `onNodeClick` 을 씁니다.
:::

### 끌어 놓기와 라벨 편집

트리 옵션 `isEditable` 에 객체를 주면 켜집니다.

```js
var tree = new TreeBase({
  isEditable: { nodesAreDraggable: true, autoExpandAtDrag: true, autoExpandAtDragDelay: 800 }
}).inject(el);
```

- 노드 위쪽 1/3 에 놓으면 앞, 가운데면 하위, 아래쪽이면 뒤로 옮깁니다. 가운데에 머무르면 `autoExpandAtDragDelay` (기본 1000ms) 뒤 펼칩니다.
- `onNodeDrop(fn)` 을 등록하면 기본 이동을 하지 않습니다. 서버에 먼저 반영하고 직접 `addChild` 할 때 씁니다.
- 라벨 편집은 `isEditable.switchToWriteView` / `switchToReadView` 에 `{ view: function (node) { return 요소; }, event: '이벤트 이름', callback }` 을 둘 다 줄 때만 켜집니다. 자세한 키는 [API](/controls/api/collection-views#treenodebase) 에 있습니다.

### 펼치기, 찾기

- `node.expand(n)` 은 n 단계까지 펼칩니다 (기본 1). `collapse()` 는 하위를 화면에서 떼어 냅니다.
- `node.expandAll()` 은 이름과 달리 두 단계까지만 펼치는 것으로 보입니다 <Badge type="danger" text="검증 필요" />. 끝까지 펼치려면 `expand(깊이)` 를 씁니다.
- `tree.search(text)` 는 라벨에 글자가 들어간 노드를 노랗게 표시하고 부모를 펼칩니다. 생성 옵션 `hasFilterBox: true` 면 위에 검색 칸이 생깁니다.

::: warning search 는 정규식으로 찾습니다
안에서 `label.search(text)` 를 써서 글자가 정규식으로 해석됩니다. `.` 은 아무 글자, `(` 처럼 짝이 안 맞는 괄호는 `SyntaxError` 가 납니다. 사용자 입력은 정규식 특수 문자를 이스케이프해서 넘깁니다.
:::

- `node.getPath()` 는 루트를 뺀 라벨을 `'A > B > '` 처럼 이어 붙입니다 (끝에 `' > '` 가 남음).
- 휠을 Shift 와 함께 돌리면 확대 / 축소됩니다 (`setZoomFactor`).

## Tree, TreeNode (3D 경로 트리)

`DS/Controls/Tree` 는 TreeBase 를 상속해 왼쪽 접이식 패널, 파란 선 테마, 3D 선택 연동을 더한 트리입니다. 노드는 `TreeNode` (TreeNodeBase + `pathElement` 옵션) 입니다. SceneGraphTree 가 3D 장면 구조를 보여 줄 때 씁니다.

- 노드를 클릭하면 `{ pathElement }` 를 전역 선택 관리자 `DS/Selection/CSOManager`, `HSOManager` 에 넣습니다 (Ctrl 클릭은 추가 / 제거). 3D 와 상관없는 트리에 쓰면 전역 선택에 빈 경로가 들어가므로 `TreeBase` 를 씁니다.
- `new Tree()` 처럼 옵션 없이 만들면 `TypeError` 가 납니다. `new Tree({})` 로 만듭니다.
- `slideIn()` / `slideOut()` 으로 패널을 열고 닫고, `onPanelSlideIn(fn)` / `onPanelSlideOut(fn)` 으로 받습니다.

## Tile

앞면(Primary)과 뒷면(Secondary)이 있는 카드입니다. ResponsiveTileView 와는 관계없습니다.

```js
require(['DS/Controls/Tile'], function (Tile) {
  var tile = new Tile({ effects: 'flip', button: true }).inject(el);
  tile.setPrimaryViewContent('<b>PRT-0001</b>');
  tile.setSecondaryViewContent('상세 정보');
  tile.toggleView();
});
```

- `effects` 는 `'flip'` (뒤집기), `'push-left:120px'`, `'push-right:50%'` (앞면을 밀어 뒷면을 보임) 입니다.
- `button: true` 면 `i` 단추가 생기고, 누르면 `effects` 동작을 합니다. 코드로는 `rotate()`, `toggleView()`, `displayPrimaryView()`, `displaySecondaryView()` 입니다.
- 내용은 HTML 로 들어갑니다. 메서드 전체는 [API](/controls/api/collection-views#tile) 에 있습니다.

::: warning setSecondaryViewContent 의 스타일은 앞면에 붙습니다
`setSecondaryViewContent(html, styles)` 의 두 번째 인자는 뒷면이 아니라 앞면 요소에 적용됩니다 (2025, 2026 같음). 뒷면 스타일은 `tile.getSecondaryView().setStyles(...)` 로 줍니다.
:::

## 옛 썸네일, 타일 (ThumbnailView, TileView)

`ViewBase` 를 상속한 UWA 방식 카드입니다. 옵션은 `size` (`'small'`, `'big'`), `menu`, `icon`, `color` 정도이고 내용은 `setTitle()`, `setSubtitle()`, `setDescription()`, `setPicture()` 로 넣습니다. 새 화면에는 [ResponsiveTileView](#responsivetileview) 계열을 씁니다.

```js
require(['DS/Controls/ThumbnailView'], function (ThumbnailView) {
  var thumb = new ThumbnailView({ size: 'small' }).inject(el);
  thumb.setTitle('최근 파일');
  thumb.setSubtitle('');
  thumb.setPicture('../assets/preview.png');
  thumb.onClick(function () {
    console.log('열기');
  });
});
```

- 클릭은 `onClick`, `onPictureClick`, `onTitleClick`, `onSubtitleClick`, `onDescriptionClick`, `onCartoucheClick` 에 콜백을 넘겨 받습니다. 콜백 인자에는 쓸 만한 값이 없으므로 대상은 클로저로 잡습니다 (3DPlayApp 의 최근 파일 목록).
- 그림 안의 체크 상자를 누르면 `highlight()` / `unhighlight()` 가 바뀝니다.
- `setTitle` 등은 단독으로 쓰면 HTML 로 넣습니다.
- 옵션과 메서드: [ThumbnailView API](/controls/api/collection-views#thumbnailview), [TileView API](/controls/api/collection-views#tileview).

::: warning 처음부터 견본 글자가 들어 있습니다
부제에는 `Sous-titre`, TileView 설명에는 영문 견본 문장이 미리 들어 있습니다. 쓰지 않는 칸도 `setSubtitle('')`, `setDescription('')` 로 비웁니다. VCXWebGUI 는 `elements.subtitle.innerHTML = ''` 로 지웁니다.
:::

::: warning TileView 는 옵션 객체가 꼭 필요합니다
`new TileView()` 는 안에서 `options.gridEngine` 을 읽다가 `TypeError` 가 납니다. `new TileView({})` 로 만듭니다. ThumbnailView 는 괜찮습니다.
:::

## 셀 전용 부품 (TileCellView, ThumbnailCellView, ViewBase)

- `TileCellView`, `ThumbnailCellView` 는 `DS/Layouts/GridEngineCellAbstract` 를 상속한 셀입니다. 안에 TileView / ThumbnailView 를 만들고 그리드 엔진의 선택, 우클릭 메뉴(`onContextualEvent`, `onContextualMenuReady`)와 연결합니다. `DS/Tree/TileGridView`, `ThumbnailGridView` 가 행의 `label`, `subLabel`, `thumbnail`, `color`, `description`, `icons[0]`, 배지를 이 셀에 넣습니다.
- `ViewBase` 는 ThumbnailView, TileView 의 공통 부모입니다. 클릭 이벤트를 연결하는 코드가 하위 클래스에 있어 단독으로는 클릭을 받지 못합니다.

## 2025 와 2026 차이

| 모듈 | 차이 |
| --- | --- |
| ResponsiveViewAdaptor, ResponsiveTileView, ResponsiveThumbnailView, ResponsiveTextualTileView | 2026 에서 ES class 로 다시 작성. 속성 이름, 기본값, 너비 범위, 이벤트는 같음 |
| Tile | id 를 `DS/Utilities/UUID` 로 만듦. 사용법은 같음 |
| TreeBase, TreeNodeBase, TreeNode, Tree | 같음 (`addChildren`, `search`, `onClick` 문제도 그대로) |
| ViewBase, ThumbnailView, TileView, 셀 | 같음 |

## 같이 보기

- [목록, 트리, 타일 뷰 API](/controls/api/collection-views)
- [WebUX 컨트롤](/controls/webux-controls)
- [트리 구조 (DataGridView)](/datagridview/tree)
- [데이터 (TreeDocument / TreeNodeModel)](/datagridview/api/data)
