# 레이아웃 컨트롤 <Badge type="info" text="원본 분석" />

화면을 나누고 묶는 `DS/Controls/*` 컨트롤입니다. 접는 영역(Accordeon), 탭(Tab, TabBar), 툴바, 경로 줄, 단계 표시 등을 다룹니다. 만들기, 속성, 이벤트 규칙은 [WebUX 컨트롤](/controls/webux-controls#공통-사용법) 과 같습니다. 전체 키는 [레이아웃 컨트롤 API](/controls/api/layout) 에 있습니다.

::: info 근거
Controls.js (2025, 2026) 의 Accordeon (`_addItem`, `handleEvents`), Tab (`add`, `_applyValue`, `_handleEvents`), TabBar (`add`, `_closeListener`, `_hasButtonAChevron`, `_pinTab`, `removeTab`), Toolbar (`add`, `_onResize`), Breadcrumb, GroupBox, Flyout, BadgesContainer, Scroller, Stack, LayerSet, Deck, 2026 의 Stepper, DropdownButton, ModeChooser. Core.js 의 BaseComponent (setter, `setProperties`). Core/wux.css. 호출부: ClassificationProp, CADExportConfig, ENXESignature, ENORouteMgmt, MePreferencesDialog, CfgBaseUX, ENOXCADTemplate, Layouts(GridEngine)
:::

## 무엇을 쓸까

| 모듈 | 쓰는 곳 | 앱 사용 모듈 수 (2025) | API |
| --- | --- | --- | --- |
| [Accordeon](#accordeon) | 제목을 눌러 펼치는 구역 여러 개 (속성 패널) | 39 | [Accordeon](/controls/api/layout#accordeon) |
| [Tab](#tab) | 탭 줄 + 탭 내용. 내용 전환까지 맡김 | 37 | [Tab](/controls/api/layout#tab) |
| [TabBar](#tabbar) | 탭 줄만. 내용은 직접 바꿈 | 23 | [TabBar](/controls/api/layout#tabbar) |
| [Toolbar](#toolbar) | 왼쪽 / 가운데 / 오른쪽 칸이 있는 툴바 | 8 | [Toolbar](/controls/api/layout#toolbar) |
| [Breadcrumb](#breadcrumb) | 이동 경로 | 5 | [Breadcrumb](/controls/api/layout#breadcrumb) |
| [Scroller](#scroller) | 스크롤 시작 / 끝 알림이 필요한 영역 | 4 | [Scroller](/controls/api/layout#scroller) |
| [LayerSet](#layerset) | 같은 자리에 층 겹치기 | 4 | [LayerSet](/controls/api/layout#layerset) |
| [GroupBox](#groupbox) | 제목 있는 묶음 상자 | 0 | [GroupBox](/controls/api/layout#groupbox) |
| [Flyout](#flyout) | 펼침 영역이 붙은 아이콘 버튼 | 0 (Tweakers 내부) | [Flyout](/controls/api/layout#flyout) |
| [BadgesContainer](#badgescontainer) | 배지 줄 | 0 | [BadgesContainer](/controls/api/layout#badgescontainer) |
| [Stack](#stack) | 칸 쌓기 | 0 | [Stack](/controls/api/layout#stack) |
| [Deck](#deck) | 애니메이션 도우미 | 0 | [Deck](/controls/api/layout#deck) |
| [Stepper](#stepper) <Badge type="warning" text="2026" /> | 단계 표시 | - | [Stepper](/controls/api/layout#stepper) |
| [DropdownButton](#dropdownbutton) <Badge type="warning" text="2026" /> | 분할 버튼 | - | [DropdownButton](/controls/api/layout#dropdownbutton) |
| [ModeChooser](#modechooser) <Badge type="warning" text="2026" /> | 모드 선택 | - | [ModeChooser](/controls/api/layout#modechooser) |

Scroller, Stack, LayerSet, Deck 은 `UWA/Controls/Abstract` 계열이라 `publishedProperties` 가 없고 생성 옵션만 받습니다. 나머지는 `DS/Controls/Abstract` 를 상속합니다.

## Accordeon

제목을 눌러 펼치고 접는 구역을 세로로 쌓습니다. 항목마다 [Expander](/controls/webux-controls#expander) 가 하나씩 만들어집니다.

```js
require(['DS/Controls/Accordeon'], function (Accordeon) {
  var general = UWA.createElement('div', { text: '일반 속성 ...' });
  var history = UWA.createElement('div', { text: '이력 ...' });

  var acc = new Accordeon({
    exclusive: false,
    style: 'simple',
    items: [
      { header: '일반', content: general, expandedFlag: true },
      { header: '이력', content: history }
    ]
  }).inject(el);

  var id = acc.addItem({ header: '첨부', content: UWA.createElement('div', { text: '첨부 ...' }) });
  acc.expandItem(acc.getIndexFromId(id));

  acc.addEventListener('expand', function (e) {
    console.log('펼침', e.options.expanderIndex, e.options.expanderTarget.header);
  });
});
```

### 항목

항목은 `{ header, content, expandedFlag }` 가 기본입니다. `content` 대신 `body` 도 됩니다. 그 밖에 Expander 의 키(`icon`, `customHeader`, `interactiveFlag` 등)를 그대로 넣을 수 있습니다. `style` 은 Accordeon 의 값으로 덮어씁니다.

| 할 일 | 코드 |
| --- | --- |
| 추가 | `acc.addItem(item)` (id 반환), 2026 은 `acc.addItems([...])` 도 |
| 순번 찾기 | `acc.getIndexFromId(id)`, `acc.getIndexFrom({ header: '이력' })` |
| 펼치기 / 닫기 | `acc.expandItem(i)`, `acc.closeItem(i)` |
| 바꾸기 | `acc.updateItem(i, { header: '새 제목' })` |
| 삭제 | `acc.deleteItem(i)`, `acc.clear()` |
| Expander 직접 다루기 | `acc.getExpanderFromIndex(i)` (예: `.domId`, `.header` 대입) |

앱 호출부(ClassificationProp)는 `exclusive: false`, `style: 'simple'` 로 만들고 `addItem` 뒤 `acc.items.indexOf(item)` 으로 순번을 찾아 `getExpanderFromIndex` 로 Expander 를 고칩니다. `addItem` 은 넘긴 객체를 `items` 배열에 그대로 넣기 때문에 이 방법이 됩니다.

### 이벤트

`expand`, `collapse` 를 받습니다. `e.options.expanderIndex` 가 순번, `e.options.expanderTarget` 이 그 Expander 입니다. 안쪽 Expander 가 낸 이벤트는 Accordeon 에서 멈추고 Accordeon 이 다시 냅니다. 그래서 Accordeon 에 건 리스너에서 `e.dsModel` 은 Accordeon 입니다.

::: warning 기본값은 하나만 펼침입니다
`exclusive` 기본값이 `true` 라서 한 항목을 펼치면 나머지가 닫힙니다. 여러 구역을 함께 펼치려면 `exclusive: false` 를 줍니다. 앱 호출부(ClassificationProp 등)도 `false` 로 씁니다.
:::

::: warning collapsibleFlag: false 는 생성 옵션으로 주면 첫 항목을 열지 않습니다
`collapsibleFlag` 와 `exclusive` 는 생성 때 적용 함수가 돌지 않습니다 (`_applyProperties` 가 `items`, `style`, `stretchableChildrenFlag` 만 처리). `collapsibleFlag: false` 를 생성 옵션으로 주면 모두 닫힌 채 시작합니다. 생성 후 `acc.collapsibleFlag = false` 로 넣으면 펼친 항목이 없을 때 첫 항목을 펼칩니다. 두 경우 모두 마지막으로 펼쳐진 항목은 사용자가 접을 수 없습니다.
:::

::: warning items 를 새 배열로 바꾸면 모두 다시 만듭니다
`acc.items = [...]` 는 Expander 를 전부 지우고 새로 만듭니다. 펼침 상태도 처음으로 돌아갑니다. 항목 하나를 더하거나 뺄 때는 `addItem` / `deleteItem` 을 씁니다. `updateItem` 은 `header`, `body`, `icon`, `customHeader`, `customHeaderPosition` 만 바꾸고, 빈 문자열이나 `null` 은 무시합니다 (`||` 로 이전 값 유지).
:::

`stretchableChildrenFlag: true` 면 펼친 항목이 Accordeon 의 남은 높이를 나눠 가집니다. 비율은 항목의 `weight` (기본 `1`)입니다. Accordeon 에 높이가 있어야 효과가 있습니다.

## Tab

탭 줄([TabBar](#tabbar))과 탭 내용 영역을 함께 만듭니다. 탭을 고르면 그 탭의 내용만 보이고 나머지는 숨깁니다.

```js
require(['DS/Controls/Tab'], function (Tab) {
  var tab = new Tab({ displayStyle: 'strip' }).inject(el);
  tab.tabBar.centeredFlag = false;
  tab.tabBar.pinFlag = false;

  tab.add({ label: '속성', value: 'props', content: UWA.createElement('div', { text: '속성 ...' }), isSelected: true });
  tab.add({ label: '이력', value: 'history', content: UWA.createElement('div', { text: '이력 ...' }) });

  tab.addEventListener('change', function (e) {
    console.log('선택', e.dsModel.value[0]);
  });

  tab.value = ['history'];
});
```

### 탭 값과 선택

- 탭마다 `value` 를 줍니다. 안 주면 순번(0, 1, ...)이 값이 됩니다. 지우고 다시 넣으면 순번과 값이 어긋나므로 문자열 값을 권장합니다.
- `tab.value` 는 **배열** 입니다. 읽을 때 `tab.value[0]`, 바꿀 때 `tab.value = ['history']`.
- `change` 는 클릭, 코드 대입, 선택된 탭 삭제 때 모두 옵니다. `e.options` 는 없습니다. 새 값은 `e.dsModel.value` 로 읽습니다.
- 이미 선택된 탭을 다시 눌러도 알고 싶으면 `activateTab` 을 씁니다. `e.options` 가 TabBar 의 이벤트 객체라 값은 `e.options.options.value` 에 있습니다.
- 내용 요소는 `tab.getPageContentFromValue('props')` 로 찾고, `tab.setPageContentFromValue('props', el)` 로 바꿉니다.

::: warning 선택된 탭이 없으면 내용이 모두 숨겨집니다
`add` 는 `isSelected: true` 가 아닌 탭의 내용을 숨깁니다. 첫 탭을 자동으로 고르지 않으므로 하나에 `isSelected: true` 를 주거나, 다 넣은 뒤 `tab.value = ['props']` 로 고릅니다.
:::

::: warning 더블 클릭하면 탭이 고정됩니다
TabBar 의 `pinFlag` 기본값이 `true` 입니다. 탭을 더블 클릭하면 고정되고, 고정된 탭의 내용은 다른 탭을 골라도 계속 보입니다 (내용 두 개가 함께 보임). 필요 없으면 `tab.tabBar.pinFlag = false` 로 끕니다. `editableFlag: true` 면 더블 클릭이 고정 대신 이름 바꾸기가 됩니다.
:::

### TabBar 속성 바꾸기

Tab 은 TabBar 속성 일부(`displayStyle`, `multiSelFlag`, `reorderFlag`, `showComboBoxFlag`, `autoCloseFlag`, `position` 등)만 받아 넘깁니다. `closeButtonFlag`, `pinFlag`, `editableFlag`, `centeredFlag`, `closeAllButtonFlag` 는 Tab 의 키가 아니라서 생성 옵션에 넣으면 무시됩니다. `tab.tabBar.키 = 값` 으로 넣습니다. 앱 호출부도 `tab.tabBar.centeredFlag = false`, `tab.tabBar.pinFlag = false` 로 씁니다.

### 닫기

```js
tab.tabBar.closeButtonFlag = true;
tab.add({ label: '결과', value: 'result', content: resultDiv, allowContextualMenuFlag: false });
tab.addEventListener('close', function (e) {
  console.log('닫힘', e.options.value);
});
```

::: warning 닫기 버튼을 눌러도 바로 닫히지 않을 수 있습니다
`closeButtonFlag` 만 켜면 탭의 닫기 버튼은 **메뉴** ("닫기") 를 엽니다. 탭별 `allowContextualMenuFlag` 가 지정되지 않으면 메뉴 쪽으로 판단하기 때문입니다. 누르자마자 닫으려면 `add` 에 `allowContextualMenuFlag: false` 를 줍니다. `closeAllButtonFlag` 를 켜면 모든 탭이 메뉴 방식이 됩니다. 마우스 가운데 버튼 클릭은 어느 경우든 바로 닫습니다.
:::

- `autoCloseFlag` (기본 `true`)면 탭과 내용을 지우고 `close` 를 냅니다. `false` 면 `close` 만 내므로 저장 확인 뒤 직접 `tab.removeTabContent(e.options.value)` 를 부릅니다.
- 선택된 탭을 지우면 그 전에 골랐던 탭이 선택됩니다.

::: warning removeTab 은 내용 요소를 받습니다
`tab.removeTab(x)` 의 `x` 는 순번이나 값이 아니라 **내용 요소** 입니다. 값으로 지울 때는 `tab.removeTabContent('result')` 를 씁니다. 같은 이름의 `tab.tabBar.removeTab(value)` 는 값을 받지만 탭 버튼만 지우고 내용 요소는 남깁니다.
:::

### 모양

`displayStyle` 은 문자열에 단어가 들어 있는지로 판단합니다.

| 값 | 모양 |
| --- | --- |
| `'normal'` (기본) | 기본 탭 |
| `'strip'` | 얇은 줄 모양. 앱에서 가장 많이 씀. `newTabButtonFlag` 는 이 모양에서만 Tab 이 넘김 |
| `'panel'` | 패널형 |
| `'vertical'` | 탭을 왼쪽 세로로. 탭 글자를 숨기므로 아이콘을 줌. 2026 은 `showButtonLabelFlag: true` 로 글자를 보일 수 있음 |

- `hideTabBarWhenOnlyOnePageFlag: true` 면 보이는 탭이 1 개 이하일 때 탭 줄을 숨깁니다. 탭을 더하거나 뺄 때 판단하므로, 생성 후 이 값만 바꾸면 다음 추가 / 삭제 때 반영됩니다.
- `position` (`top`, `bottom`, `left`, `right`)은 `displayStyle` 이 정확히 `'dockingStyle'` 일 때만 반영됩니다.

## TabBar

탭 줄만 만듭니다. 고른 탭에 맞춰 내용을 바꾸는 일은 직접 합니다. ENORouteMgmt, ENXESignature 처럼 탭마다 다른 뷰 모듈을 불러 그리는 화면이 이 방식입니다.

```js
require(['DS/Controls/TabBar'], function (TabBar) {
  var bar = new TabBar({ displayStyle: 'strip', centeredFlag: false, pinFlag: false }).inject(el);
  bar.add({ label: '속성', value: 'props' });
  bar.add({ label: '작업', value: 'tasks' });

  bar.addEventListener('change', function (e) {
    console.log('선택', e.dsModel.value[0]);
  });
  bar.addEventListener('tabButtonClick', function (e) {
    console.log('클릭', e.options.value);
  });

  bar.value = ['props'];
});
```

| 이벤트 | 받는 값 |
| --- | --- |
| `change` | `e.options` 없음. `e.dsModel.value[0]` |
| `tabButtonClick` | `e.options.value` (이미 선택된 탭도) |
| `removeTab` | `e.options.value`, `e.options.index` (닫기 조작) |
| `endEdit` | `e.options.button.label` (새 이름), `e.options.previousLabel` |
| `pinStateChange` | `e.options.value`, `e.options.pinnedFlag` |

- 탭 버튼은 `Button` 입니다. `bar.getButtonFromValue('props')` 로 받아 `label`, `icon` 을 바꾸거나 `bar.updateTab('props', { label: '새 이름' })` 을 씁니다.
- `add` 는 같은 문자열 값이 이미 있으면 `console.error` 를 찍고 추가하지 않습니다 (반환 `undefined`). 숫자 값이면 1 씩 올려 빈 값을 찾습니다.
- 넘치면 좌우 이동 버튼이 나옵니다. `showComboBoxFlag: true` 면 이동 버튼 대신 탭 목록 콤보가 나옵니다 (`strip` 은 둘 다).

::: warning reindexFlag 는 없는 키입니다
앱 코드에 `new TabBar({ ..., reindexFlag: true })` 가 보이지만 2025, 2026 TabBar 모두 이 키가 없어 무시됩니다.
:::

::: tip Tab 안의 TabBar
Tab 을 쓰면 `tab.tabBar` 가 이 TabBar 입니다. 이벤트는 Tab 쪽(`change`, `close`)으로 받는 것이 편합니다. TabBar 의 `change` 는 Tab 이 화면에 보이는 동안 Tab 바깥으로 올라가지 않습니다.
:::

## Toolbar

`near`, `center`, `far` 세 칸에 요소를 넣는 툴바입니다. Tweakers 의 [GeneratedToolbar](/tweakers/generated-toolbar) (모델로 버튼을 만드는 툴바)와는 다른 모듈입니다.

```js
require(['DS/Controls/Toolbar', 'DS/Controls/Button'], function (Toolbar, Button) {
  var bar = new Toolbar({ overflowManagement: 'dropdown' }).inject(el);
  var add = new Button({ label: '추가', icon: { iconName: 'plus', fontIconFamily: WUXManagedFontIcons.Font3DS } });
  var del = new Button({ label: '삭제', icon: { iconName: 'trash', fontIconFamily: WUXManagedFontIcons.Font3DS } });

  bar.add('element', { element: add.getContent(), position: 'near', priority: 10 });
  bar.add('separator', { position: 'near' });
  bar.add('element', { element: del.getContent(), position: 'near' });
});
```

- `element` 는 DOM 요소입니다. 컨트롤은 `getContent()` 를 넣습니다.
- `overflowManagement: 'dropdown'` 이면 폭이 모자랄 때 `priority` 가 낮은 요소부터 드롭다운 버튼 안으로 옮깁니다. 기본 `'scroll'` 은 옮기지 않고 스크롤합니다.
- 넘침 계산은 툴바가 화면에 붙은 뒤에 합니다. 붙기 전이면 문서에 들어오는 것을 감시하다가 그때 계산합니다.
- 지우기: `bar.removeItem('element', { element: del.getContent() })`, 한 칸 비우기: `bar.clearPosition('near')`.

## Breadcrumb

이동 경로 줄입니다. 항목은 문자열 또는 `{ label, icon, value }` 입니다.

```js
require(['DS/Controls/Breadcrumb'], function (Breadcrumb) {
  var crumb = new Breadcrumb({ value: ['전체', '조립품', 'PRT-0001'], mode: Breadcrumb.MODE.NAVIGATION }).inject(el);
  crumb.addEventListener('change', function (e) {
    console.log('경로', e.dsModel.value);
  });
  crumb.push({ label: '도면', value: 'DWG-01' });
});
```

- `mode` 기본값은 `NAVIGATION` 입니다. 앞 항목을 누르면 **그 뒤 항목이 모두 지워지고** `change` 와 `selectionChange` 가 옵니다. 지우지 않고 고르기만 하려면 `EXCLUSIVE_SELECTION` 또는 `MULTIPLE_SELECTION` 을 씁니다.
- `push(item)`, `pop()` 으로 끝에 넣고 뺍니다. 둘 다 `change` 가 옵니다.
- `displayStyle` 기본 `LITE` 는 `\` 구분자를 쓰고, 넘친 항목을 메뉴 아이콘 안으로 넣습니다. `expandableSeparatorFlag: true` 면 구분자가 화살표가 되고 누르면 `separatorClick` (`e.options.index`) 이 옵니다.

## GroupBox

제목이 있는 테두리 상자(`fieldset` + `legend`)입니다.

```js
require(['DS/Controls/GroupBox'], function (GroupBox) {
  var box = new GroupBox({ label: '기본 정보', content: UWA.createElement('div', { text: '...' }) }).inject(el);
  box.iconDimension = 20;
  box.icon = { iconName: 'attributes', fontIconFamily: WUXManagedFontIcons.Font3DS };
});
```

- `content` 를 바꾸면 이전 요소를 떼고 새 요소를 넣습니다. 여러 개를 넣을 때는 `box.appendChild(el)` 을 씁니다.
- `iconDimension` 은 숫자(px)로 줍니다. 2025 는 생성 옵션으로 준 값이 반영되지 않으므로 생성 후 대입합니다 ([API](/controls/api/layout#groupbox)).

## Flyout

아이콘 버튼 옆에 펼침 영역을 붙인 컨트롤입니다. 앱에서 직접 쓰는 곳은 없고 Tweakers 안에서 씁니다.

```js
require(['DS/Controls/Flyout'], function (Flyout) {
  var fly = new Flyout({
    icon: 'cog',
    onClick: function () { console.log('기본 동작'); },
    extendedView: { menuModel: [{ type: 'PushItem', title: '설정', action: { callback: function () { console.log('설정'); } } }] }
  }).inject(el);
});
```

- 기본 `displayMode` (`Flyout.DISPLAY_MODE.EXPANDER`)는 버튼을 누르면 `onClick`, 옆 펼침 영역을 누르면 `extendedView` 를 엽니다. `BUTTON` 이면 버튼이 펼침을 열고 닫습니다.
- `extendedView` 가 요소면 Popup 으로, `{ menuModel: [...] }` 이면 메뉴로 엽니다. 메뉴 항목 형식은 [메뉴 항목](/datagridview/context-menu#메뉴-항목) 과 같습니다.
- 이벤트를 내지 않습니다. `type: Flyout.TYPE.CHECK` 에서 사용자가 버튼을 눌러 바뀐 눌림 상태를 `fly.checkFlag` 로 되돌려 주는 코드도 없습니다.

## BadgesContainer

[Label](/controls/webux-controls#label) 칩(배지)을 한 줄로 늘어놓습니다. 폭이 모자라면 뒤쪽 배지를 숨기고 `...` 버튼 메뉴로 보여 줍니다.

```js
require(['DS/Controls/BadgesContainer'], function (BadgesContainer) {
  var approved = { text: '승인', emphasize: 'success' };
  var badges = new BadgesContainer({
    value: [approved, { text: 'v2', callback: function (info) { console.log('누름', info.text); } }]
  }).inject(el);

  approved.text = '반려';
  approved.emphasize = 'error';
  badges.refreshBadge(approved);
});
```

- `removeBadge(def)`, `refreshBadge(def)` 는 `value` 안의 **같은 객체** 를 찾습니다. 같은 내용의 새 객체를 넘기면 아무 일도 없습니다.
- 배지는 처음에 숨긴 채 만들고 컨테이너 폭을 잰 뒤 보입니다. 폭이 0 인 동안(숨긴 부모 안)은 보이지 않다가 크기가 생기면 나타납니다.
- 클릭은 포인터를 누를 때(`pointerdown`) 처리합니다. `callback` 과 `badgeClick` 이벤트가 함께 옵니다.

## Scroller

대상 요소를 스크롤 영역으로 감싸고 스크롤 시작 / 중 / 끝을 알려 줍니다. Layouts(GridEngine) 가 그리드 스크롤에 씁니다.

```js
require(['DS/Controls/Scroller'], function (Scroller) {
  var scroller = new Scroller(listEl, { scrollEndTimeout: 300 }).inject(parentEl);
  scroller.onScrollEnd(function () {
    var pos = this.getPosition();
    console.log('멈춤', pos.x, pos.y);
  });
});
```

- 생성자 첫 인자가 감쌀 요소, 둘째가 옵션입니다.
- 감싸는 `div.wux-scroller` 는 `position: absolute` 에 상하좌우 `0` 입니다. 부모에 위치(`position: relative` 등)와 높이가 있어야 합니다.
- 구독 함수 안의 `this` 가 Scroller 입니다. 해제는 `scroller.unsubscribe(token)`.

::: warning 휠 스크롤을 직접 처리합니다
Scroller 는 Ctrl, Shift 없이 굴린 휠을 막고(`preventDefault`) 세로로 50px 단위씩 직접 움직입니다. 끝에 닿았을 때만 브라우저에 넘깁니다. 그래서 Shift 없이 하는 가로 휠(트랙패드 가로 밀기)은 움직이지 않습니다. 가로는 Shift + 휠로 움직입니다.
:::

## Stack

`ul` 안에 `li` 칸을 가로 또는 세로로 쌓습니다. 앱 사용은 없습니다.

```js
require(['DS/Controls/Stack'], function (Stack) {
  var stack = new Stack({ orientation: 'vertical' });
  stack.append('위 칸', { weight: 1 });
  stack.append('아래 칸', { weight: 3 });
  stack.inject(el);
});
```

- `weight` 는 `inject` 할 때 한 번만 %로 계산합니다. 붙인 뒤 `append` 한 칸은 다시 나누지 않으므로 칸을 다 넣고 붙입니다.
- `toggleOrientation()` 은 빈 함수입니다. 방향은 생성 옵션으로만 정합니다.

## LayerSet

같은 영역에 여러 층을 `position: absolute` 로 겹칩니다. ApplicationFrame, WAfrContainerAsWidget 같은 플랫폼 프레임이 씁니다.

```js
require(['DS/Controls/LayerSet'], function (LayerSet) {
  var layers = new LayerSet({ styles: { position: 'relative', height: '300px' } }).inject(el);
  layers.addLayer(UWA.createElement('div', { text: '바닥' }));
  layers.addLayer(UWA.createElement('div', { text: '오른쪽 위' }), { top: 0, right: 0 });
});
```

- `addLayer(el, styles)` 의 `el` 은 `inject` 메서드가 있어야 합니다 (UWA 요소 또는 컨트롤). 일반 DOM 요소는 `UWA.extendElement` 로 감쌉니다.

## Deck

요소 여러 개에 CSS 변형을 단계별로 거는 애니메이션 도우미입니다. 앱 사용은 없고, `webkitTransform` / `webkitTransition` 만 씁니다.

```js
require(['DS/Controls/Deck'], function (Deck) {
  new Deck({
    selector: '.card',
    duration: 300,
    ease: 'ease-out',
    distributions: [
      { opacity: '1', left: function (i) { return i * 40 + 'px'; } }
    ]
  });
});
```

- 만들자마자 첫 단계를 실행하고, `duration` 이 지나면 다음 단계로 넘어갑니다.
- `selector` 는 문자열이어야 합니다. 요소를 넘기면 생성 중에 오류가 납니다.

## Stepper

<Badge type="warning" text="2026" /> 작성 → 검토 → 승인 같은 단계를 보여 줍니다.

```js
require(['DS/Controls/Stepper'], function (Stepper) {
  var stepper = new Stepper({
    steps: [
      { title: '작성', description: '기본 정보 입력' },
      { title: '검토' },
      { title: '승인' }
    ],
    activeStep: 0,
    clickableFlag: true
  }).inject(el);

  stepper.addEventListener('activeStepChange', function (e) {
    console.log('단계', e.dsModel.activeStep);
  });

  stepper.steps[0].status = 'done';
  stepper.activeStep = 1;
});
```

- `steps` 는 넣는 순간 Proxy 로 바뀝니다. `stepper.steps[0].status = 'done'` 처럼 고치면 화면이 바로 바뀌고 `stepStatusChange` 가 옵니다.
- `status` 는 `default`, `done`, `error` 입니다.
- `activeStepChange` 는 단계를 눌러 바꿨을 때만 옵니다. 코드로 `activeStep` 을 바꾸면 오지 않습니다.

::: warning 뒤 단계는 눌러지지 않습니다
`disableStepsAfterActive` 기본값이 `true` 라서 현재 단계 뒤에 있고 `status` 가 `default` 인 단계는 비활성입니다. `clickableFlag: true` 여도 앞 단계로만 돌아갈 수 있습니다. 뒤 단계도 누르게 하려면 `disableStepsAfterActive: false` 를 주거나 그 단계의 `status` 를 바꿉니다.
:::

## DropdownButton

<Badge type="warning" text="2026" /> 주 버튼 + 펼침 버튼으로 된 분할 버튼입니다. 펼침 버튼은 메뉴를 엽니다.

```js
require(['DS/Controls/DropdownButton'], function (DropdownButton) {
  new DropdownButton({
    emphasize: 'primary',
    mainAction: { label: '저장', onClick: function () { console.log('저장'); } },
    secondaryActions: [
      { label: '다른 이름으로 저장', onClick: function () { console.log('다른 이름'); } },
      { label: '초안으로 저장', disabled: true }
    ]
  }).inject(el);
});
```

- `secondaryActions` 에 함수를 주면 메뉴를 열 때마다 불러 배열을 받습니다. 상태에 따라 항목을 바꿀 때 씁니다.
- `mainAction` 은 객체를 통째로 바꿔야 반영됩니다 (`btn.mainAction = { label: '수정', onClick: fn }`).

## ModeChooser

<Badge type="warning" text="2026" /> 여러 모드 중 하나를 고릅니다. 폭에 따라 버튼 → 아이콘 → 콤보 순으로 모양을 줄입니다.

```js
require(['DS/Controls/ModeChooser'], function (ModeChooser) {
  var chooser = new ModeChooser({
    type: 'buttons',
    modesList: [
      { label: '목록', icon: 'view-list', value: 'list' },
      { label: '타일', icon: 'view-small-tile', value: 'tile' }
    ],
    value: 'list'
  }).inject(el);

  chooser.addEventListener('change', function (e) {
    console.log('모드', e.dsModel.value, e.dsModel.computedType);
  });
});
```

- 모드에는 `label`, `icon`, `value` 세 키가 모두 있어야 합니다. 하나라도 없거나 값이 겹치면 경고를 찍고 그 모드를 버립니다. 유효한 모드가 2 개 미만이면 목록이 비워집니다.
- `value` 에 목록에 없는 값을 넣으면 이전 값, 없으면 첫 모드가 됩니다. 목록이 있으면 선택이 비는 일이 없습니다.
- `icon` 문자열은 3DS 글꼴 이름입니다. Button 처럼 FontAwesome 으로 해석하지 않습니다.
- 기본 `type` 은 `'comboBox'` 입니다. 실제 모양은 읽기 전용 `computedType` 으로 확인합니다.

## 2025 와 2026 차이

| 모듈 | 변경 |
| --- | --- |
| Accordeon | `addItems`, `getExpanderCount`, `destroy` 추가. `items` 교체 때 이전 Expander 를 `destroy`, `deleteItem` 이 `weight` 목록도 정리 |
| Tab, TabBar | `tabButtonDirection`, `showButtonLabelFlag`, `responsiveFlag` 추가 (Tab 은 `usePaddingFlag` 도). `vertical` 내용 영역 너비를 px 계산 대신 `auto` + 크기 감시로 |
| Toolbar | `popupClass` (읽기 전용) 추가 |
| GroupBox | `iconDimension` 기본값 `'16px'` → `16`, 생성 옵션 반영 버그 수정. `icon` 기본값 `''` → `undefined` |
| Flyout | `labelPosition` 추가 |
| Stepper, DropdownButton, ModeChooser | 새 모듈 |
