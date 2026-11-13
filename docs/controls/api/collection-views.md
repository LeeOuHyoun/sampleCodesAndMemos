---
title: 목록, 트리, 타일 뷰 API
---

# 목록, 트리, 타일 뷰 API <Badge type="info" text="원본 분석" />

카드 컨트롤(`Responsive*View`), 트리(`TreeBase`, `TreeNodeBase`, `Tree`, `TreeNode`), `Tile`, 옛 `ThumbnailView` / `TileView` 의 옵션, 속성, 메서드, 이벤트입니다. 사용법은 [목록, 트리, 타일 뷰](/controls/collection-views) 에 있습니다.

```js
var tile = new ResponsiveTileView({ title: 'PRT-0001', statusbarIcons: ['trash'] }).inject(el);
tile.subtitle = '브라켓';
tile.addEventListener('StatusbarIconPointerDown', function (e) { console.log(e.options.iconIndex); });

var tree = new TreeBase({ roots: [{ label: 'A', children: [{ label: 'B' }] }] }).inject(el2);
tree.onNodeClick(function (node) { console.log(node.getLabel()); });
```

::: info 근거
Controls.js 의 ResponsiveViewAdaptor, ResponsiveTileView, ResponsiveThumbnailView, ResponsiveTextualTileView 의 `publishedProperties` 와 `_apply...` 함수, `fire("StatusbarIconPointerDown")`. ViewBase, ThumbnailView, TileView, TileCellView, ThumbnailCellView, Tile, TreeBase, TreeNodeBase, TreeNode, Tree 의 `defaultOptions`, prototype 메서드, `_modelEvents.publish` 호출. CollectionView.js 의 ResponsiveCollectionView, ResponsiveTilesCollectionView, ResponsiveLargeTilesCollectionView, ResponsiveLargeTextualTilesCollectionView, ResponsiveThumbnailsCollectionView, TreeDocument 모델 제공자 getPropertyValue. Tree.js 의 ThumbnailGridView. 2026 은 enovia2026_webapps 의 같은 파일
:::

- `Responsive*View` 는 WebUX 컨트롤입니다. 표의 키는 생성자 옵션이자 속성이고 [Abstract](/controls/api/webux-controls#abstract) 의 속성, 메서드를 모두 가집니다.
- 나머지(트리, Tile, ThumbnailView, TileView)는 UWA 방식입니다. 옵션은 생성자에서 `defaultOptions` 와 깊게 합쳐져 `this.options` 에 들어가고, 바꿀 때는 메서드를 씁니다. 모두 `inject(el)`, `getContent()`, `destroy()` 가 있습니다.
- 2026 에서 새로 생긴 키는 없습니다.

## ResponsiveViewAdaptor

`DS/Controls/ResponsiveViewAdaptor` (부모 `DS/Controls/Abstract`). 아래 세 카드의 공통 부모이며 직접 만들지 않고 상속해서 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>picture</code> | <code>string</code> | <code>''</code> | 그림 URL (CSS 배경). HTML 요소, 컨트롤도 됨 (HTML 허용일 때). 비우면 <code>PLACE YOUR PNG PICTURE HERE</code> 표시 |
| <code>icon</code> | <code>string</code> | <code>''</code> | 제목 앞 아이콘. <code>Dom.generateIcon</code> 규칙 |
| <code>title</code> | <code>string</code> | <code>''</code> | 제목. <code>customTooltip</code> 이 없으면 툴팁으로도 씀 |
| <code>multipleTitleLineNumber</code> | <code>boolean</code> | <code>false</code> | <code>true</code> 면 제목 두 줄. 속성 목록이 있으면 적용 안 됨 |
| <code>subtitle</code> | <code>string</code> | <code>''</code> | 부제 |
| <code>description</code> | <code>string</code> | <code>''</code> | 설명 (두 줄, 넘치면 말줄임) |
| <code>propertiesList</code> | <code>array</code> | <code>[]</code> | 글자 배열. 설명이 비어 있을 때만 두 열로 표시 |
| <code>displayPropertiesTooltip</code> | <code>boolean</code> | <code>true</code> | 속성 목록 항목마다 툴팁 |
| <code>contextualMenu</code> | <code>array</code> | <code>[]</code> | 메뉴 항목 글자 배열. 비어 있지 않으면 메뉴 버튼 표시 |
| <code>onContextMenuBuildCallback</code> | <code>function</code> | - | <code>function (labels) → 메뉴 항목 배열</code>. 없으면 항목을 눌러도 콘솔 오류만 |
| <code>emptyStatusbarVisibleFlag</code> | <code>boolean</code> | <code>false</code> | 상태 막대가 비어도 줄 표시 |
| <code>statusbarIcons</code> | <code>array</code> | <code>[]</code> | 상태 아이콘 (최대 8개). 이름 글자 또는 <code>{ icon, label, emphasize, tooltip, callback }</code> |
| <code>statusbarLabelsWidthRatios</code> | <code>array</code> | <code>[]</code> | 받기만 하고 쓰지 않음 (2025, 2026) |
| <code>statusbarIconsTooltips</code> | <code>array</code> | <code>[]</code> | i번째 아이콘 툴팁. 글자는 <code>shortHelp</code> 로 바뀜 |
| <code>onStatusbarIconPointerDown</code> | <code>function</code> | - | <code>StatusbarIconPointerDown</code> 리스너로 등록 |
| <code>activeFlag</code> | <code>boolean</code> | <code>false</code> | 활성 모드 모양 (<code>active-mode</code> 속성) |
| <code>color</code> | <code>string</code> | <code>''</code> | 색 띠. <code>''</code>, <code>'initial'</code> 은 없음 |
| <code>customTooltip</code> | <code>object</code> | <code>''</code> | 제목 대신 쓸 툴팁. 글자(<code>shortHelp</code>) 또는 <code>DS/Core/TooltipModel</code> |
| <code>badges</code> | <code>array</code> | <code>[]</code> | 아이콘 배열. 상태 아이콘 뒤에 이어서 표시 |
| <code>clickableTitle</code> | <code>boolean</code> | <code>false</code> | 제목에 클릭 모양 클래스. 클릭 처리는 타일 목록 셀일 때만 (<code>onCellTitleClick</code>) |
| <code>allowUnsafeHTMLContent</code> | <code>boolean</code> | <code>true</code> | 글자를 HTML 로 해석 |
| <code>shouldCellAllowUnsafeHTMLContentFor</code> | <code>function</code> | <code>allowUnsafeHTMLContent</code> 반환 | <code>function (origin) → boolean</code>. origin: <code>picture</code>, <code>title</code>, <code>subtitle</code>, <code>description</code>, <code>propertiesList</code>, <code>customTooltip</code> |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>StatusbarIconPointerDown</code> | 상태 아이콘, 배지 클릭 | <code>{ iconIndex, icon, text }</code>. 배지는 <code>iconIndex</code> 가 상태 아이콘 개수 이상 |

| 메서드 | 설명 |
| --- | --- |
| <code>highlight()</code> / <code>unhighlight()</code> / <code>isHighlighted()</code> | 선택 표시. <code>disabled</code> 면 <code>highlight()</code> 무시 |
| <code>prehighlight()</code> / <code>unPrehighlight()</code> | 마우스 올림 표시 (마우스 들어오고 나갈 때 자동) |
| <code>activate()</code> / <code>deactivate()</code> | 현재 항목 표시 (<code>wux-ui-state-activated</code>) |
| <code>setPictureBackgroundSize(value)</code> | 그림 <code>background-size</code> (예: <code>'contain'</code>) |

- 상태 아이콘 객체의 `callback` 은 타일 목록 셀일 때만 `{ cellInfos, clickedIconIndex, icon, text }` 로 불립니다.
- 속성은 이전 값과 `!==` 로 비교합니다. 배열을 고친 뒤 같은 배열을 다시 넣으면 반영되지 않습니다.
- 우클릭 / 메뉴 버튼 메뉴는 `DS/Menu/ContextualMenu` 입니다. 타일 목록 셀일 때는 목록의 `onContextualEvent` 가 있으면 그것이 우선합니다.

## ResponsiveTileView

`DS/Controls/ResponsiveTileView` (부모 ResponsiveViewAdaptor). 가로형 카드. CSS 클래스 `wux-controls-responsivetileview`.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>tileWidth</code> | <code>integer</code> | <code>260</code> | 너비 px. 260 ~ 540 만 반영 (큰 타일 목록 셀이면 최대 없음) |

## ResponsiveThumbnailView

`DS/Controls/ResponsiveThumbnailView` (부모 ResponsiveViewAdaptor). 그림이 위에 큰 세로형 카드. 안에 [ProgressBar](/controls/api/webux-controls#progressbar) 를 가집니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>thumbnailWidth</code> | <code>integer</code> | <code>200</code> | 너비 px. 150 ~ 420 만 반영 |
| <code>progressValueData</code> | <code>object</code> | - | <code>{ progressValue, emphasize, displayStyle, tooltipInfos: { shortHelp, longHelp, shortHelpImage } }</code>. <code>progressValue</code> 는 0 이상 숫자 (아니면 경고만) |

- `displayStyle: 'lite'` 면 얇은 막대 모양입니다.
- 타일 목록 셀일 때는 목록의 `useProgressBar: true` 가 있어야 막대를 그립니다.
- `multipleTitleLineNumber` 는 `true` 로 바꿀 때만 반영됩니다 (`false` 로 되돌려도 두 줄 유지).
- 설명은 두 줄입니다.

## ResponsiveTextualTileView

`DS/Controls/ResponsiveTextualTileView` (부모 ResponsiveTileView). 자기 속성은 없습니다.

- 제목 줄 높이 28px, 설명 줄 높이 19px.
- `multipleTitleLineNumber` 를 무시하고 제목은 항상 한 줄입니다.
- 그림 자리에 `PLACE YOUR PNG PICTURE HERE` 요소를 항상 만듭니다.

## 타일 목록 (CollectionView)

`DS/CollectionView/*` 의 목록이 행마다 위 카드를 셀로 만듭니다. 목록 옵션 전체는 이 문서 범위 밖이며, 카드와 관련된 것만 적습니다.

| 목록 | 셀 컨트롤 | 셀 너비 |
| --- | --- | --- |
| <code>ResponsiveTilesCollectionView</code> | ResponsiveTileView | 열 최대 540, 셀 최소 260 |
| <code>ResponsiveLargeTilesCollectionView</code> | ResponsiveTileView (Tiles 상속) | 열 100% |
| <code>ResponsiveLargeTextualTilesCollectionView</code> | ResponsiveTextualTileView | 열 100% |
| <code>ResponsiveThumbnailsCollectionView</code> | ResponsiveThumbnailView | 열 최대 <code>{ 0: 320, 420: 240 }</code> |

| 목록 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>model</code> | <code>[]</code> | TreeDocument. DataGridView 와 같은 객체를 넘겨도 됨 |
| <code>displayedOptionalCellProperties</code> | <code>['All']</code> | <code>['All']</code>, <code>['None']</code>, 또는 <code>description</code>, <code>propertiesList</code>, <code>activeFlag</code>, <code>contextualMenu</code>, <code>statusbarIcons</code> 중 고른 배열 |
| <code>displayTitleTooltip</code> / <code>displayPropertiesTooltip</code> / <code>displayStatusbarTooltip</code> | <code>true</code> | 셀 툴팁 |
| <code>useDragAndDrop</code> | <code>false</code> | 셀 끌기 (<code>draggable</code>) |
| <code>allowLargeItems</code> | <code>false</code> | Tiles 만. 큰 셀 허용 |
| <code>useProgressBar</code> | <code>false</code> | Thumbnails 만. 셀에 <code>progressValueData</code> 막대 |
| <code>descriptionLinesNumber</code> | <code>7</code> | Thumbnails 만 |

셀 속성은 행(`TreeNodeModel`)에서 `modelProvider.getPropertyValue(nodeModel, 키)` 로 읽습니다. 값은 `options[키]`, 없으면 `options.grid[키]` 입니다.

| 셀 속성 | 목록 getter | 읽는 값 |
| --- | --- | --- |
| <code>title</code> | <code>getLabel</code> | <code>label</code> |
| <code>subtitle</code> | <code>getSubLabel</code> | <code>subLabel</code> |
| <code>picture</code> | <code>getThumbnail</code> | <code>options.thumbnail</code>, 없으면 <code>options.grid.thumbnail</code> |
| <code>icon</code> | <code>getIcon</code> | <code>options.icons[0]</code> |
| <code>badges</code> | <code>getBadges</code> | <code>nodeModel.getBadges()</code> 의 <code>topRight</code>, <code>bottomRight</code> |
| <code>description</code>, <code>propertiesList</code>, <code>statusbarIcons</code>, <code>statusbarIconsTooltips</code>, <code>statusbarLabelsWidthRatios</code>, <code>contextualMenu</code>, <code>color</code>, <code>activeFlag</code>, <code>emptyStatusbarVisibleFlag</code>, <code>customTooltip</code>, <code>clickableTitle</code>, <code>multipleTitleLineNumber</code>, <code>disabled</code> | <code>getDescription</code> 등 같은 이름 | 같은 이름 |

- 배열 값(`propertiesList`, `statusbarIcons`, `contextualMenu` 등, `progressValueData`)은 복사해서 셀에 넣습니다.
- getter 를 덮어쓰면 다른 키를 쓸 수 있습니다 (예: `tiles.getLabel = function (nodeModel) { return nodeModel.options.grid.name; }`).
- 행 데이터 자체는 [데이터 (TreeDocument / TreeNodeModel)](/datagridview/api/data#treenodemodel) 에 있습니다.

## TreeBase

`DS/Controls/TreeBase` (부모 `UWA/Controls/Abstract`). 전역 이름 `WUX.Controls.TreeBase`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>roots</code> | <code>[]</code> | 노드 옵션 배열. 각 항목의 <code>children</code> 을 따라 끝까지 노드를 만듦 |
| <code>nodeClass</code> | TreeNodeBase | 노드 클래스 |
| <code>isEditable</code> | <code>false</code> | 끌어 놓기 / 라벨 편집 설정 객체 ([TreeNodeBase](#treenodebase)) |
| <code>isScrollable</code> | <code>true</code> | 세로 스크롤 (<code>UWA/Controls/Scroller</code>) |
| <code>hasFilterBox</code> | <code>false</code> | 위에 검색 칸. 입력하면 <code>search()</code> |
| <code>zoomFactor</code> | <code>100</code> | CSS <code>zoom</code> (%) |
| <code>UI</code> | <code>TreeBase.themes.default</code> | 펼침 단추, 선, 라벨 스타일 |
| <code>onClick</code> | - | 라벨 클릭 시 <code>this</code> = 노드로 불림. 인자는 비어 있음 |
| <code>expandAllAtInit</code> | <code>false</code> | 트리 코드가 읽지 않음. 처음부터 펼치려면 만든 뒤 <code>expand(깊이)</code> |

| 메서드 | 반환 | 설명 |
| --- | --- | --- |
| <code>addRoot(options)</code> | 노드 | 루트 추가. <code>options.children</code> 은 노드로 바뀌지 않음 |
| <code>getRoots()</code> / <code>getNthRoot(i)</code> | 노드 배열 / 노드 | |
| <code>removeRoot(node)</code> / <code>removeAllRoots()</code> / <code>empty()</code> | - | 루트 제거 |
| <code>processNodes(fn)</code> | - | 모든 노드에 <code>fn.call(node, node)</code> |
| <code>search(text)</code> | - | 라벨에 글자가 든 노드 표시, 부모 펼침. 글자는 정규식으로 해석 |
| <code>setZoomFactor(value)</code> | - | 확대 비율. Shift + 휠로도 바뀜 |
| <code>dump(level?)</code> | 객체 | <code>{ label, icons, children: [...] }</code>. <code>level</code> 2 는 JSON 글자 |
| <code>toggle()</code> | - | 트리 보이기 / 숨기기 |

| 구독 함수 | 시점 | 콜백 인자 |
| --- | --- | --- |
| <code>onNodeClick(fn)</code> / <code>onNodeDblClick(fn)</code> | 라벨 클릭 / 더블 클릭 | 노드 |
| <code>onPreExpand</code> / <code>onExpand</code> / <code>onPostExpand</code> | 펼침 | <code>{ node }</code> |
| <code>onPreCollapse</code> / <code>onCollapse</code> / <code>onPostCollapse</code> | 접음 | <code>{ node }</code> |
| <code>onLabelChange(fn)</code> | <code>setLabel</code> | 새 라벨. 토큰을 돌려주지 않음 |
| <code>onNodeDragStart</code> / <code>onNodeDragOver</code> / <code>onNodeDragLeave</code> | 끌기 | 노드 |
| <code>onNodePreDrop</code> / <code>onNodePostDrop</code> | 놓기 전 / 후 | 놓기 정보 (<code>from</code> = 끌어 온 노드) |
| <code>onNodeDrop(fn)</code> | 놓기 | 기본 이동을 대신함. 하나만 (덮어씀). <code>this</code> = 놓은 곳 노드 |

- 구독 함수는 대부분 토큰을 돌려주지만 트리에 해제 함수는 없습니다.
- 펼침 순서: 트리 `preExpand` → 노드 `onPreExpand` → 하위 표시 → 트리 `expand` → 노드 `onPostExpand` → 트리 `postExpand`. 접음은 노드 `onPreCollapse` → 트리 `preCollapse` → 트리 `collapse` → 노드 `onPostCollapse` → 트리 `postCollapse` 입니다.
- 정적: `TreeBase.themes.default` (기본 `UI`).
- `delegateEvents()` 는 빈 함수입니다.

## TreeNodeBase

`DS/Controls/TreeNodeBase` (부모 `UWA/Controls/Abstract`). 전역 이름 `WUX.Controls.TreeNodeBase`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>label</code> | - | 라벨. HTML 로 들어감 |
| <code>icons</code> | - | 그림 URL 배열. 라벨 앞에 차례로 |
| <code>children</code> | - | 배열이면 하위가 있는 노드 (빈 배열이어도 펼침 단추) |
| <code>data</code> | <code>null</code> | 아무 값 |
| <code>backgroundColor</code> | - | 라벨 배경색 |
| <code>isEditable</code> | <code>undefined</code> | 비우면 트리의 <code>isEditable</code> 을 물려받음 |
| <code>isDraggable</code> | <code>undefined</code> | 비우면 트리 <code>isEditable.nodesAreDraggable</code> |
| <code>animateOnExpand</code> | <code>false</code> | 펼칠 때 하위 노드 등장 효과 |
| <code>onPreExpand</code> / <code>onPostExpand</code> / <code>onPreCollapse</code> / <code>onPostCollapse</code> | <code>null</code> | 노드 콜백 (<code>this</code> = 노드, 인자 없음) |
| <code>renderSaver</code> | <code>100</code> | 선, 단추 다시 그리기 지연 ms. <code>0</code> 이면 바로 |
| <code>expandAtInit</code> / <code>allowTextCopy</code> | <code>false</code> | 선언만 있고 코드가 읽지 않음 |

`isEditable` (트리 옵션 또는 노드 옵션):

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>nodesAreDraggable</code> | - | 노드 끌기 |
| <code>autoExpandAtDrag</code> | <code>true</code> | 노드 가운데에 머무르면 펼침 |
| <code>autoExpandAtDragDelay</code> | <code>1000</code> | 펼치기까지 ms |
| <code>switchToWriteView</code> | - | <code>{ view: function (node) → 입력 요소, event: '읽기 화면에서 편집으로 넘어갈 이벤트', callback }</code> |
| <code>switchToReadView</code> | - | <code>{ view: function (node) → 읽기 요소, event: '입력 요소에서 끝낼 이벤트 (공백 구분)', callback }</code>. 끝나면 입력 요소의 마지막 <code>change</code> 값으로 <code>setLabel</code> |

두 view 를 모두 줄 때만 라벨 편집이 켜집니다.

| 메서드 | 설명 |
| --- | --- |
| <code>addChild(node, index?)</code> | 하위 추가 / 같은 부모 안에서 자리 이동. 자기 자손에 붙이면 경고만 |
| <code>addChildren(nodes)</code> | 사용 금지. <code>this.children</code> 을 읽어 <code>TypeError</code> (2025, 2026) |
| <code>removeChild(node)</code> / <code>remove()</code> / <code>removeChildren()</code> | 제거. 마지막 하위를 지우면 펼침 단추도 없어짐 |
| <code>expand(depth?)</code> | <code>depth</code> 단계 펼침 (기본 1) |
| <code>expandAll()</code> | 하위 펼침. 두 단계까지만 펼쳐지는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> |
| <code>collapse()</code> | 접음. 하위 노드 화면 요소를 지움 |
| <code>isExpanded()</code> / <code>isRoot()</code> / <code>isDrawn()</code> / <code>hasChildren()</code> | 상태 |
| <code>getParent()</code> / <code>getRoot()</code> / <code>getTree()</code> | 부모 / 루트 노드 / 트리 |
| <code>getChildren()</code> / <code>getNthChild(i)</code> / <code>getLastChild()</code> / <code>getChildIndex()</code> | 하위. 없으면 <code>getChildren()</code> 은 <code>null</code> |
| <code>getPrevBrotherNode()</code> / <code>getNextBrotherNode()</code> / <code>getNextBrothersNodes()</code> | 형제 |
| <code>getAllDescendants()</code> | 모든 자손 배열 |
| <code>isAscendantOf(node)</code> | 조상 여부 |
| <code>getLabel()</code> / <code>setLabel(text, notify?)</code> | 라벨. <code>notify</code> 기본 <code>true</code> 면 트리 <code>onLabelChange</code> 발생 |
| <code>setIcon({ picture, iconID })</code> | <code>iconID</code> 번째 그림 교체 |
| <code>getPath()</code> | 루트를 뺀 라벨을 <code>'A &gt; B &gt; '</code> 로 이음 |
| <code>search(text)</code> | 이 노드 아래에서 찾기 (정규식) |
| <code>processChildren(fn)</code> | 자손마다 <code>fn.call(node, node)</code> |
| <code>highlight(styles?)</code> / <code>unhighlight()</code> | 라벨 강조 (<code>wux-datagrid-cell-highlighted</code>) 또는 스타일 |
| <code>flash(color?)</code> | 라벨 배경 깜빡임 (기본 <code>'#F1960C'</code>) |
| <code>switchToWriteView()</code> / <code>switchToReadView()</code> / <code>isInWriteMode()</code> | 라벨 편집 화면 전환 |
| <code>onPreExpand(fn)</code> / <code>onPostExpand(fn)</code> / <code>onPreCollapse(fn)</code> / <code>onPostCollapse(fn)</code> | 노드 콜백 덮어쓰기 |
| <code>dump(level?)</code> | 이 노드 아래 구조 |
| <code>updateExpanderState()</code> | 펼침 단추 다시 그림 |

`collapseNode()` (→ `collapse`), `delegateEvents()` 는 폐기 경고만 냅니다.

## TreeNode

`DS/Controls/TreeNode` (부모 TreeNodeBase). 전역 이름 `WUX.Controls.TreeNode`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>pathElement</code> | <code>null</code> | 3D 경로 (<code>DS/Visualization/PathElement</code>) |

메서드: <code>getPathElement()</code>

## Tree

`DS/Controls/Tree` (부모 TreeBase). 전역 이름 `WUX.Controls.Tree`. CSS 클래스 `wux-controls-tree`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>nodeClass</code> | TreeNode | |
| <code>isEditable</code> | <code>false</code> | TreeBase 와 같음 |
| <code>UI</code> | 파란 선 테마 | 넘겨도 무시하고 고정 테마로 덮어씀 |

- 옵션 객체가 꼭 필요합니다 (`new Tree()` 는 `TypeError`).
- 노드 클릭은 `{ pathElement }` 를 `CSOManager`, `HSOManager` 에 넣습니다 (보통 클릭은 하나만, Ctrl 클릭은 추가 / 제거). CSO 에 든 경로의 노드는 라벨이 강조됩니다 (펼침, 접음, CSO 추가 / 제거 때 다시 계산).
- 트리는 왼쪽 `DS/Panels/SidePanel` 안에 들어갑니다.

| 메서드 | 설명 |
| --- | --- |
| <code>slideIn()</code> / <code>slideOut()</code> | 패널 열기 / 닫기 |
| <code>onPanelSlideIn(fn)</code> / <code>onPanelSlideOut(fn)</code> | 패널 열림 / 닫힘 구독. 콜백 인자는 트리 |

TreeBase 의 메서드, 구독 함수도 모두 가집니다.

## Tile

`DS/Controls/Tile` (부모 `UWA/Controls/Abstract`). 전역 이름 `WUX.Controls.Tile`. CSS 클래스 `WUXTile`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>effects</code> | <code>'flip'</code> | <code>flip</code>, <code>push-left:값단위</code>, <code>push-right:값단위</code> (예: <code>'push-left:120px'</code>) |
| <code>button</code> | <code>false</code> | <code>i</code> 단추 표시. 누르면 <code>effects</code> 동작 |
| <code>color</code> | <code>false</code> | <code>true</code> 면 앞면 배경을 무작위 색으로 |
| <code>rows</code> / <code>container</code> | <code>2</code> / <code>window</code> | 코드가 읽지 않음 |

| 메서드 | 설명 |
| --- | --- |
| <code>setPrimaryViewContent(html, styles?)</code> | 앞면 내용 (HTML), 앞면 스타일 |
| <code>setSecondaryViewContent(html, styles?)</code> | 뒷면 내용. <code>styles</code> 는 앞면에 적용됨 (원본 동작) |
| <code>getPrimaryView()</code> / <code>getSecondaryView()</code> | 앞면 / 뒷면 요소 |
| <code>displayPrimaryView(html?, styles?)</code> / <code>displaySecondaryView(html?, styles?)</code> | 그 면 보이기 (<code>Flip</code> 클래스) |
| <code>toggleView(html?, styles?)</code> | 반대 면 보이기 |
| <code>setAlternativeViewContent(html, styles?)</code> | 지금 안 보이는 면에 내용을 넣고 그 면 보이기 |
| <code>rotate()</code> | <code>Flip</code> 클래스 전환 |
| <code>pushLeft()</code> / <code>pushRight()</code> | 앞면 밀기 (<code>effects</code> 의 값만큼) |
| <code>buildSkeleton()</code> | 화면 요소를 다시 만듦 (생성자에서 부름) |

`displayAlternativeView()` 는 폐기 경고 뒤 `toggleView()` 를 부릅니다.

## ViewBase

`DS/Controls/ViewBase` (부모 `UWA/Controls/Abstract`). ThumbnailView, TileView 의 부모입니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>size</code> | <code>'small'</code> | <code>small</code>, <code>big</code> (<code>wux-ui-size-*</code>) |
| <code>view</code> | <code>'thumbnail'</code> | CSS 클래스 앞부분 (<code>wux-controls-{view}-*</code>) |
| <code>menu</code> | <code>[]</code> | 메뉴 |
| <code>icon</code> | <code>''</code> | 아이콘 |
| <code>color</code> | <code>null</code> | 색 |

| 메서드 | 설명 |
| --- | --- |
| <code>setTitle(html)</code> / <code>setSubtitle(html)</code> / <code>setDescription(html)</code> | 글자. 단독이면 HTML, 그리드 셀이면 그리드의 HTML 허용 설정을 따름 |
| <code>setPicture(url)</code> | 그림 (CSS 배경) |
| <code>setColor(color)</code> | 색 띠. 비우면 숨김 |
| <code>onClick(fn)</code> / <code>onPictureClick(fn)</code> / <code>onTitleClick(fn)</code> / <code>onSubtitleClick(fn)</code> / <code>onDescriptionClick(fn)</code> / <code>onCartoucheClick(fn)</code> | 그 부분을 누르고 뗄 때 구독. 콜백 인자는 <code>null</code> |

부제에는 처음부터 `Sous-titre` 가 들어 있습니다. 클릭 연결은 하위 클래스가 하므로 ViewBase 단독으로는 클릭을 받지 못합니다.

## ThumbnailView

`DS/Controls/ThumbnailView` (부모 ViewBase). CSS 클래스 `wux-controls-thumbnail`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>size</code> / <code>view</code> / <code>menu</code> | <code>'small'</code> / <code>'thumbnail'</code> / <code>[]</code> | ViewBase 와 같음 |
| <code>onContextualEvent</code> | - | <code>{ callback: function (params) → 메뉴 항목, this }</code>. 우클릭, 메뉴 단추. <code>params</code>: <code>{ context, infos, data }</code> |
| <code>gridEngine</code> | - | 셀 안에서만 (있으면 <code>onContextualEvent</code> 를 쓰지 않음) |

| 메서드 | 설명 |
| --- | --- |
| <code>setIcon(icon)</code> | 아이콘 (<code>Dom.generateIcon</code>). 비우면 지움 |
| <code>highlight()</code> / <code>unhighlight()</code> / <code>isHighlighted()</code> | 선택 표시. 그림 위 체크 상자(Toggle)와 같이 바뀜 |
| <code>activate()</code> / <code>deactivate()</code> | 현재 항목 표시 |

`icon`, `color` 옵션은 생성 때 적용하지 않습니다. `setIcon()`, `setColor()` 를 부릅니다. 요소: `elements.picture`, `title`, `subtitle`, `description`, `icon`, `menu`, `checkbox`, `badgeTopRight`, `badgeBottomRight`.

## TileView

`DS/Controls/TileView` (부모 ViewBase). CSS 클래스 `wux-controls-tileview`.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>size</code> | <code>'small'</code> | <code>small</code>, <code>big</code> |
| <code>view</code> | <code>'tile'</code> | |
| <code>picture</code> | <code>{ size: 'cover', width: null, position: 'center center' }</code> | 그림 <code>background-size</code>, 그림 칸 너비, <code>background-position</code>. 일부 키만 줘도 나머지는 기본값 |
| <code>menu</code> | <code>[]</code> | <code>DS/UIBehaviors/SwipeableMenu</code> 의 메뉴 |
| <code>icon</code> / <code>color</code> | <code>''</code> / <code>null</code> | 생성 때 <code>setIcon</code>, <code>setColor</code> 로 적용 |
| <code>gridEngine</code> | - | 셀 안에서만. <code>gridEngine.options.useSwipableMenu === false</code> 면 밀기 메뉴 없음 |

메서드: ThumbnailView 와 같은 `setIcon()`, `highlight()`, `unhighlight()`, `isHighlighted()`, `activate()`, `deactivate()` 와 ViewBase 메서드.

- 생성자에 옵션 객체가 꼭 필요합니다 (`new TileView()` 는 `TypeError`).
- 설명에 영문 견본 문장, 부제에 `Sous-titre` 가 처음부터 들어 있습니다.

## TileCellView, ThumbnailCellView

`DS/Controls/TileCellView`, `DS/Controls/ThumbnailCellView` (부모 `DS/Layouts/GridEngineCellAbstract`). 안에 TileView / ThumbnailView 를 하나 만들어 그리드 엔진 셀로 씁니다. `DS/Tree/TileGridView`, `DS/Tree/ThumbnailGridView` 의 `cellClass` 입니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>size</code> | <code>'small'</code> | 안쪽 뷰 크기 |
| <code>menu</code> | <code>[]</code> | <code>setupContextualMenu(menu)</code> 로 넘김 |

| 메서드 | 설명 |
| --- | --- |
| <code>setTitle</code> / <code>setSubtitle</code> / <code>setDescription</code> / <code>setPicture</code> / <code>setColor</code> / <code>setIcon</code> | 안쪽 뷰로 전달. <code>setTitle</code> 은 그리드가 툴팁을 허용하면 <code>title</code> 속성도 채움 |
| <code>setBadges({ topRight, bottomRight })</code> / <code>unsetBadges()</code> | 모서리 배지 |
| <code>highlight</code> / <code>unhighlight</code> / <code>activate</code> / <code>deactivate</code> | 안쪽 뷰로 전달 |
| <code>getCellInfos()</code> | 셀 정보 + <code>nodeModel</code> |
| <code>setPictureBackgroundSize(value)</code> | 그림 <code>background-size</code> |
| <code>setupContextualMenu(menu)</code> | 그리드 <code>onContextualEvent</code> 가 있으면 그것, 없으면 <code>onContextualMenuReady</code> 로 메뉴 연결 |
| <code>updateInternalParameters()</code> | 셀 재사용 전 글자, 색, 선택, 배지를 비움 |

- 체크 상자를 누르면 행(`cellModel`)을 선택 / 해제합니다. 그리드 `selection.canMultiSelect` 가 아니면 먼저 선택을 비웁니다.
- ThumbnailGridView 는 행의 `options.label`, `subLabel`, `thumbnail`, `color`, `description`, `icons[0]`, `getBadges()` 를 이 셀에 넣습니다.
