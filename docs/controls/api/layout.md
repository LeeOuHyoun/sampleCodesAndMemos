---
title: 레이아웃 컨트롤 API
---

# 레이아웃 컨트롤 API <Badge type="info" text="원본 분석" />

화면을 나누고 묶는 `DS/Controls/*` 컨트롤의 공개 속성, 이벤트, 메서드입니다. 사용법은 [레이아웃 컨트롤](/controls/layout) 에 있습니다.

```js
var tab = new Tab({ displayStyle: 'strip' }).inject(el);
tab.add({ label: '속성', value: 'props', content: propsDiv, isSelected: true });
tab.addEventListener('change', function (e) { console.log(e.dsModel.value[0]); });
```

::: info 근거
Controls.js (2025, 2026) 의 Accordeon, Tab, TabBar, Toolbar, Breadcrumb, GroupBox, Flyout, BadgesContainer, Scroller, Stack, LayerSet, Deck 과 2026 의 Stepper, DropdownButton, ModeChooser. 각 모듈의 `publishedProperties`, `_apply...` 함수, `fire("...")` 호출, prototype 메서드. CoreBase.js 의 `TOOLBAR_POSITIONS`. Core.js 의 BaseComponent (setter, setProperties). Core/wux.css 의 클래스. 호출부: ClassificationProp, CADExportConfig, ENXESignature, ENORouteMgmt, MePreferencesDialog, CfgBaseUX, ENOXCADTemplate, Layouts(GridEngine)
:::

- 표의 키는 생성자 옵션과 속성 이름입니다. `ctrl.키 = 값` 또는 `ctrl.setProperties({ ... })` 로 바꿉니다.
- `Abstract` 를 상속하는 컨트롤은 [Abstract](/controls/api/webux-controls#abstract) 의 속성(`disabled`, `visibleFlag`, `tooltipInfos` 등)도 모두 가집니다.
- Scroller, Stack, LayerSet, Deck 은 `UWA/Controls/Abstract` 계열입니다. 속성 표가 없고 생성 옵션(`options`)만 있습니다.
- `dimensionsChanged` 는 크기가 바뀔 때 내부용으로 나는 이벤트라 표에서 뺐습니다.

## Accordeon

`DS/Controls/Accordeon`. 부모 `Abstract`. 항목마다 [Expander](/controls/api/webux-controls#expander) 를 하나씩 만들어 세로로 쌓습니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>items</code> | <code>array</code> | <code>[]</code> | 항목 배열. 항목 키는 아래 표. 새 배열을 넣으면 Expander 를 모두 다시 만듦 |
| <code>exclusive</code> | <code>boolean</code> | <code>true</code> | 하나만 펼침. 다른 항목을 펼치면 나머지를 닫음 |
| <code>collapsibleFlag</code> | <code>boolean</code> | <code>true</code> | <code>false</code> 면 마지막으로 펼쳐진 항목은 닫을 수 없음 |
| <code>style</code> | <code>string</code> | <code>'filled-separate'</code> | 모든 Expander 의 <code>style</code>. CSS 에 있는 값: <code>filled-separate</code>, <code>filled-group</code>, <code>simple</code>, <code>divided</code>, <code>styled</code>, <code>mode-selector</code> |
| <code>stretchableChildrenFlag</code> | <code>boolean</code> | <code>false</code> | 펼친 항목이 남은 높이를 <code>weight</code> 비율로 나눠 가짐 |

항목(`items[i]`, `addItem(item)`) 키입니다.

| 키 | 설명 |
| --- | --- |
| <code>header</code> | 제목 |
| <code>body</code> / <code>content</code> | 내용 요소. 둘 중 하나 |
| <code>expandedFlag</code> | 처음부터 펼침 |
| <code>weight</code> | <code>stretchableChildrenFlag</code> 일 때 높이 비율. 없으면 <code>1</code>, <code>0</code> 이하면 늘리지 않음 |
| 그 밖의 Expander 키 | <code>icon</code>, <code>customHeader</code>, <code>customHeaderPosition</code>, <code>interactiveFlag</code>, <code>headerTooltipInfos</code> 등. Expander 의 <code>publishedProperties</code> 에 있는 키만 전달 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>expand</code> | 항목이 펼쳐짐 (코드로 펼쳐도) | <code>{ expanderIndex, expanderTarget }</code> |
| <code>collapse</code> | 항목이 닫힘 | <code>{ expanderIndex, expanderTarget }</code> |

`expanderTarget` 은 그 항목의 Expander 컨트롤입니다. 안쪽 Expander 가 낸 원래 이벤트는 Accordeon 에서 멈추고, Accordeon 이 같은 이름으로 다시 냅니다.

| 메서드 | 설명 |
| --- | --- |
| <code>addItem(item)</code> | 끝에 추가. <code>items</code> 배열에도 넣음. 항목 id(숫자) 반환 |
| <code>addItems(list)</code> <Badge type="warning" text="2026" /> | 여러 개 추가. id 배열 반환 |
| <code>deleteItem(index)</code> | 삭제. <code>items</code> 에서도 뺌 |
| <code>updateItem(index, { header, body, icon, customHeader, customHeaderPosition })</code> | 다섯 키만 바꿈. 빈 값(<code>''</code>, <code>null</code>)은 무시 |
| <code>expandItem(index)</code> / <code>closeItem(index)</code> | 펼치기 / 닫기. <code>exclusive</code> 면 펼칠 때 나머지를 닫음 |
| <code>clear()</code> | 모두 삭제 |
| <code>getIndexFromId(id)</code> | <code>addItem</code> 이 준 id 로 순번 찾기. 없으면 <code>-1</code> |
| <code>getIndexFrom({ id })</code> / <code>({ header })</code> / <code>({ body })</code> | id, 제목, 내용 요소로 순번 찾기 |
| <code>getExpanderFromIndex(index)</code> | 그 순번의 Expander |
| <code>getExpanderCount()</code> <Badge type="warning" text="2026" /> | 항목 수 |
| <code>destroy()</code> | 2026 은 항목을 모두 지운 뒤 정리 |

- id 는 지금 쓰지 않는 가장 작은 숫자입니다. 지운 항목의 id 는 다시 쓰입니다.
- 2025 의 `deleteItem` 은 `weight` 목록을 줄이지 않고, `items` 를 새로 넣을 때 이전 Expander 를 `destroy` 하지 않고 떼기만 합니다. 2026 에서 고쳐졌습니다.

## Tab

`DS/Controls/Tab`. 부모 `Abstract`. 위에 [TabBar](#tabbar) 를, 아래에 탭 내용 영역을 둡니다. 탭 내용은 선택될 때 보이고 나머지는 숨깁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>array</code> | <code>undefined</code> | 선택된 탭 값 배열 (<code>['props']</code>). 바꾸면 내용을 바꾸고 <code>change</code> 발생 |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | TabBar 로 전달. 글자 포함 여부로 판단: <code>normal</code>, <code>strip</code>, <code>panel</code>, <code>vertical</code>, <code>strip-box</code>, <code>wide</code> |
| <code>multiSelFlag</code> | <code>boolean</code> | <code>false</code> | 여러 탭 동시 선택. 선택된 내용이 모두 보임 |
| <code>multiSelLayout</code> | <code>string</code> | <code>'vertical'</code> | 여러 내용 배치: <code>vertical</code>, <code>horizontal</code> |
| <code>reorderFlag</code> | <code>boolean</code> | <code>false</code> | 탭 끌어서 순서 바꾸기. 내용 순서도 따라 바뀜 |
| <code>showComboBoxFlag</code> | <code>boolean</code> | <code>false</code> | 탭이 넘치면 탭 목록 콤보 표시 |
| <code>autoCloseFlag</code> | <code>boolean</code> | <code>true</code> | 닫기 조작 때 탭과 내용을 자동으로 지움. <code>false</code> 면 <code>close</code> 만 발생 |
| <code>autoNewTabFlag</code> | <code>boolean</code> | <code>true</code> | 새 탭 버튼을 누르면 빈 <code>div</code> 내용을 가진 탭을 자동으로 만듦 |
| <code>newTabButtonFlag</code> | <code>boolean</code> | <code>false</code> | 새 탭(+) 버튼. <code>displayStyle</code> 에 <code>strip</code> 이 있을 때만 TabBar 로 전달 |
| <code>hideTabBarWhenOnlyOnePageFlag</code> | <code>boolean</code> | <code>false</code> | 보이는 탭이 1 개 이하면 TabBar 숨김. 탭을 더하거나 뺄 때 판단 |
| <code>position</code> | <code>string</code> | <code>'top'</code> | TabBar 로 전달 ([TabBar](#tabbar) 참고) |
| <code>allowUnsafeHTMLOnTabButton</code> | <code>boolean</code> | - | 탭 글자를 HTML 로 해석 |
| <code>tabBar</code> | <code>TabBar</code> | - | 쓸 TabBar. 비우면 새로 만듦. <code>tab.tabBar</code> 로 TabBar 속성을 바꿈 |
| <code>tabBarDOMContainer</code> | <code>object</code> | - | TabBar 를 넣을 요소. 비우면 Tab 안에 <code>div.tabBarContainer</code> 를 만듦 |
| <code>tabPanelContainer</code> | <code>object</code> | - | 내용을 넣을 요소. 비우면 Tab 안에 <code>div.tabContainer</code> 를 만듦 |
| <code>tabButtonDirection</code> <Badge type="warning" text="2026" /> | <code>string</code> | <code>'horizontal'</code> | 탭 버튼 안의 아이콘 / 글자 배치. <code>vertical</code> 은 <code>displayStyle</code> 에 <code>strip</code> 과 <code>vertical</code> 이 모두 있을 때만 |
| <code>showButtonLabelFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | - | 탭 글자 표시. 비우면 <code>vertical</code> 에서만 숨김 |
| <code>responsiveFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>true</code> | <code>false</code> 면 TabBar 영역에 <code>no-responsiveness</code> 속성. 폭이 모자라면 탭 글자를 숨기고 아이콘만 남기는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> |
| <code>usePaddingFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>false</code> | <code>false</code> 면 내용 영역에 <code>no-padding</code> 속성 |

`closeButtonFlag`, `pinFlag`, `editableFlag`, `centeredFlag` 같은 TabBar 전용 속성은 Tab 에 없습니다. `tab.tabBar.closeButtonFlag = true` 처럼 TabBar 에 넣습니다.

`add(page)` 의 키입니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>label</code> | - | 탭 글자 |
| <code>content</code> | - | 내용 요소. 일반 DOM 요소도 됨 |
| <code>value</code> | 순번 | 탭 값. 문자열을 권장. 같은 문자열이 이미 있으면 추가하지 않음 |
| <code>isSelected</code> | <code>false</code> | 추가하면서 선택 (<code>value</code> 를 <code>[이 값]</code> 으로 바꿈) |
| <code>index</code> | 끝 | 넣을 위치 |
| <code>icon</code> | - | 아이콘. <code>{ iconName }</code> 만 주면 FontAwesome |
| <code>allowClosableFlag</code> | <code>true</code> | 닫기 허용 (TabBar <code>closeButtonFlag</code> 가 켜졌을 때) |
| <code>allowContextualMenuFlag</code> | - | 닫기 버튼을 메뉴로 열지. <code>false</code> 면 바로 닫음 ([TabBar](#tabbar) 참고) |
| <code>showTitleFlag</code> | <code>true</code> | 글자 표시 |
| <code>tooltipInfos</code> | - | 탭 툴팁 |
| <code>visibleFlag</code> | <code>true</code> | <code>false</code> 면 숨긴 탭으로 추가 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경. 클릭, 코드 대입, 선택 탭 삭제 모두 | - |
| <code>onSelectTab</code> | TabBar 의 <code>change</code> 가 날 때마다 (탭 클릭, 코드 대입, 탭 고정 포함) | TabBar 의 <code>change</code> 이벤트 객체 |
| <code>activateTab</code> | 탭 버튼 클릭 (이미 선택된 탭 포함) | TabBar 의 <code>tabButtonClick</code> 이벤트 객체. 값은 <code>e.options.options.value</code> |
| <code>close</code> | 닫기 조작 | <code>{ index, value, tabBar }</code> |

| 메서드 | 설명 |
| --- | --- |
| <code>add(page)</code> | 탭 추가. <code>{ button, value }</code> 반환. 추가하지 못하면 <code>undefined</code> |
| <code>addTab(label, content, index, isSelected, value, icon, allowClosableFlag, showTitleFlag)</code> | <code>add</code> 의 인자 나열형 |
| <code>update(index, { content, label, icon, tooltipInfos, allowClosableFlag, showTitleFlag })</code> | 내용과 탭 버튼 바꾸기 |
| <code>removeTab(content, keepHidden?)</code> | **내용 요소** 로 탭 삭제. 지운 내용 요소 반환 |
| <code>removeTabContent(value, keepHidden?)</code> | 탭 값으로 삭제 |
| <code>clear()</code> | 모두 삭제 |
| <code>getPageCount()</code> / <code>getVisiblePageCount()</code> | 탭 수 / 보이는 탭 수 |
| <code>getPageContent(index)</code> / <code>getPageContentFromIndex(index)</code> | 순번으로 내용 요소 |
| <code>getPageContentFromValue(value)</code> | 값으로 내용 요소 |
| <code>setPageContentFromIndex(index, el)</code> / <code>setPageContentFromValue(value, el)</code> | 내용 요소 바꾸기 |
| <code>getPageIndexFromValue(value)</code> / <code>getPageValueFromIndex(index)</code> | 값 ↔ 순번 |
| <code>getIndexOf(content)</code> | 내용 요소의 순번. 없으면 <code>-1</code> |
| <code>getIndexesFromValues(values)</code> | 값 배열 → 순번 배열 |
| <code>containsContent(el)</code> | 내용 요소가 있는지 |
| <code>getOptionFromButton(key, value)</code> / <code>setOptionFromButton(key, val, value)</code> | 탭 버튼(Button) 속성 읽기 / 쓰기 |
| <code>isPinned(value)</code> | 고정된 탭인지 |
| <code>redrawTabBar()</code> | TabBar 넘침, 이동 버튼 다시 계산 |
| <code>destroy()</code> | TabBar 까지 정리 |

- 순번(index)은 지금 보이는 탭 순서입니다. 삭제, 순서 변경 때 다시 매깁니다. 값(value)은 바뀌지 않습니다.
- `removeTab` / `removeTabContent` 의 `keepHidden` 이 참이면 탭 버튼을 지우지 않고 숨겨서 `document.body` 로 옮깁니다.
- 2025 의 `displayStyle: 'vertical'` 은 그릴 때마다 내용 영역 너비를 px 로 계산해 넣습니다. 2026 은 `width: auto` 이고 크기 변화를 감시합니다.

## TabBar

`DS/Controls/TabBar`. 부모 `Abstract`. 안에 `ButtonGroup`(탭 버튼 = `Button` radio), 이름 바꾸기용 `LineEditor`, 목록용 `ComboBox`, 메뉴(`DS/Menu/Menu`)를 씁니다. 내용 영역 없이 탭 줄만 필요할 때 단독으로 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>array</code> | <code>undefined</code> | 선택된 탭 값 배열 |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | 글자 포함 여부로 판단: <code>normal</code>, <code>strip</code>, <code>panel</code>, <code>vertical</code>, <code>bullet</code>, <code>wide</code>, <code>dockingStyle</code>. 앱에서는 <code>strip</code> 이 가장 많음 |
| <code>centeredFlag</code> | <code>boolean</code> | <code>true</code> | 탭을 가운데 정렬. 왼쪽 정렬은 <code>false</code> |
| <code>pinFlag</code> | <code>boolean</code> | <code>true</code> | 탭 더블 클릭으로 고정. 고정된 탭의 내용은 다른 탭을 골라도 계속 보임 |
| <code>pinnedList</code> | <code>array</code> | - | 고정된 탭 값 목록 |
| <code>editableFlag</code> | <code>boolean</code> | <code>false</code> | 탭 더블 클릭으로 이름 바꾸기. 켜면 더블 클릭이 고정 대신 이름 바꾸기가 됨 |
| <code>closeButtonFlag</code> | <code>boolean</code> | <code>false</code> | 탭에 닫기 버튼. 가운데 버튼 클릭으로도 닫음 |
| <code>closeAllButtonFlag</code> | <code>boolean</code> | <code>false</code> | 탭 메뉴에 "모두 닫기" |
| <code>newTabButtonFlag</code> | <code>boolean</code> | <code>false</code> | 새 탭(+) 버튼 |
| <code>autoNewTabFlag</code> | <code>boolean</code> | <code>true</code> | + 를 누르면 "새 탭" 을 추가하고 이름 바꾸기 상태로 둠 |
| <code>autoCloseFlag</code> | <code>boolean</code> | <code>true</code> | 닫기 조작 때 탭을 자동으로 지움 |
| <code>multiSelFlag</code> | <code>boolean</code> | <code>false</code> | 여러 탭 선택 |
| <code>reorderFlag</code> | <code>boolean</code> | <code>false</code> | 끌어서 순서 바꾸기 |
| <code>showComboBoxFlag</code> | <code>boolean</code> | <code>false</code> | 탭이 넘치면 탭 목록 콤보 표시 |
| <code>minWidth</code> | <code>number</code> | <code>-1</code> | TabBar 너비를 이 값(px)으로 고정. <code>-1</code> 없음 |
| <code>slideStep</code> | <code>number</code> | <code>200</code> | 넘칠 때 좌우 이동 버튼 한 번에 움직이는 거리(px) |
| <code>position</code> | <code>string</code> | <code>'top'</code> | <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>. <code>displayStyle</code> 이 정확히 <code>'dockingStyle'</code> 일 때만 반영 |
| <code>allowUnsafeHTMLOnTabButton</code> | <code>boolean</code> | - | 탭 글자를 HTML 로 해석 |
| <code>tabButtonDirection</code> <Badge type="warning" text="2026" /> | <code>string</code> | <code>'horizontal'</code> | [Tab](#tab) 과 같음 |
| <code>showButtonLabelFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | - | [Tab](#tab) 과 같음 |
| <code>responsiveFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>true</code> | [Tab](#tab) 과 같음 |

`add(tab)` 의 키는 [Tab](#tab) 의 `add` 에서 `content` 를 뺀 것과 같습니다 (`label`, `value`, `index`, `isSelected`, `icon`, `allowClosableFlag`, `allowContextualMenuFlag`, `showTitleFlag`, `tooltipInfos`, `visibleFlag`).

닫기 버튼 동작은 탭마다 정해집니다.

| 조건 | 닫기 버튼을 누르면 |
| --- | --- |
| <code>allowContextualMenuFlag: true</code>, 또는 지정 없음 + <code>closeButtonFlag</code>, 또는 <code>closeAllButtonFlag</code> | 메뉴 표시 ("닫기", "모두 닫기", <code>editableFlag</code> 면 "이름 바꾸기") |
| <code>allowContextualMenuFlag: false</code> + <code>closeButtonFlag</code> + 닫기 허용 | 바로 닫음 |
| <code>allowClosableFlag: false</code> | 닫기 없음 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경 (코드로 바꿔도), 탭 고정 / 해제 | - |
| <code>tabButtonClick</code> | 탭 버튼 클릭 | <code>{ value }</code> |
| <code>removeTab</code> | 닫기 조작 (지우기 전) | <code>{ index, value, tabBar }</code> |
| <code>preAddTab</code> | + 버튼으로 탭이 추가됨 | <code>{ index, value }</code> |
| <code>addTab</code> | + 버튼 처리 끝 | <code>{ index }</code> |
| <code>edit</code> | 이름 바꾸기 시작 | <code>{ value }</code> |
| <code>endEdit</code> / <code>cancelEdit</code> | 이름 바꾸기 끝 (입력칸에서 포커스가 빠짐, 다른 탭 선택) / 취소 (Esc) | <code>{ button, previousLabel }</code> |
| <code>pinStateChange</code> | 고정 / 해제 | <code>{ value, pinnedFlag }</code> |
| <code>beginReorder</code> / <code>endReorder</code> | 끌기 시작 / 끝 | <code>{ value }</code> / - |

| 메서드 | 설명 |
| --- | --- |
| <code>add(tab)</code> | 탭 추가. 탭 버튼(Button) 반환. 같은 문자열 값이 있으면 <code>console.error</code> 후 <code>undefined</code> |
| <code>addTab(label, index, isSelected, value, icon, allowClosableFlag, showTitleFlag)</code> | 인자 나열형 (Tab 의 <code>addTab</code> 과 순서가 다름) |
| <code>removeTab(value, keepHidden?)</code> | 값으로 삭제. 선택된 탭이면 직전에 고른 탭을 선택 |
| <code>updateTab(value, { label, icon, tooltipInfos, allowClosableFlag, allowContextualMenuFlag, showTitleFlag })</code> | 탭 버튼 바꾸기 |
| <code>getButtonFromValue(value)</code> | 탭 버튼. 배열을 주면 배열 |
| <code>getValueByIndex(index)</code> / <code>getIndexesByValues(values)</code> | 순번 ↔ 값 |
| <code>getTabCount()</code> / <code>getVisibleTabCount()</code> | 탭 수 / 보이는 탭 수 |
| <code>pinTab(value)</code> | 고정 상태 뒤집기 (<code>pinFlag</code> 가 켜졌을 때) |
| <code>setAllowClosableFlagOnValue(value, flag)</code> | 탭별 닫기 허용 |
| <code>getOptionFromButton(key, value)</code> / <code>setOptionFromButton(key, val, value)</code> | 탭 버튼 속성 읽기 / 쓰기 |
| <code>redrawTabBar()</code> | 넘침, 이동 버튼 다시 계산 |
| <code>getWidthOfAllVisibleButtons()</code> / <code>getMinWidthWithoutScroll()</code> / <code>getWidthWithoutScroll()</code> / <code>getWidthOfButton(btn)</code> | 너비 계산 |
| <code>onSelectTab(fn)</code>, <code>onPinTab(fn)</code>, <code>onUnpinTab(fn)</code>, <code>onEditTab(fn)</code>, <code>onEndEditTab(fn)</code>, <code>onRemoveTabEvent(fn)</code>, <code>onPreNewTab(fn)</code>, <code>onNewTab(fn)</code>, <code>onBeginTabDrag(fn)</code>, <code>onEndTabDrag(fn)</code>, <code>onContextualMenuEvent(fn)</code> | 내부 ModelEvents 구독. Tab 이 이것으로 TabBar 와 연결됨. 화면 코드는 위 DOM 이벤트를 씀 |
| <code>changeLabel(index, label)</code> | 폐기 (호출하면 경고). <code>updateTab</code> 을 씀 |
| <code>destroy()</code> | 정리 |

- `buttonGroup` 속성으로 안쪽 ButtonGroup 을 읽을 수 있습니다 (`bar.buttonGroup.value`).
- 앱 코드에 `reindexFlag: true` 가 보이지만 2025, 2026 TabBar 모두 이 키가 없어 무시됩니다.

## Toolbar

`DS/Controls/Toolbar`. 부모 `Abstract`. 왼쪽(`near`), 가운데(`center`), 오른쪽(`far`) 세 칸에 요소를 넣는 툴바입니다. 넘친 요소를 넣는 드롭다운 버튼(`Button`)과 `Popup` 을 씁니다. Tweakers 의 [GeneratedToolbar](/tweakers/generated-toolbar) 와는 다른 모듈입니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>overflowManagement</code> | <code>string</code> | <code>'scroll'</code> | 넘칠 때: <code>scroll</code> (스크롤), <code>dropdown</code> (드롭다운 버튼 안으로 옮김), <code>custom</code> (dropdown 과 같고 옮기는 방법을 <code>enablePopupBehavior</code> 로 바꿈) |
| <code>direction</code> | <code>string</code> | <code>'horizontal'</code> | <code>horizontal</code>, <code>vertical</code> |
| <code>verticalAlign</code> | <code>string</code> | <code>'center'</code> | 요소 세로 정렬: <code>near</code>, <code>center</code>, <code>far</code> |
| <code>adaptSizeToParent</code> | <code>boolean</code> | <code>false</code> | 부모 크기에 맞춤 |
| <code>popupClass</code> <Badge type="warning" text="2026" /> | <code>string</code> | - | 드롭다운 팝업에 붙일 클래스. 읽기 전용이라 생성 옵션으로만 |

`add(type, item)` 의 `item` 키입니다.

| 키 | 설명 |
| --- | --- |
| <code>element</code> | 넣을 요소 (<code>type: 'element'</code>). 컨트롤은 <code>getContent()</code> 를 넣음. <code>type: 'separator'</code> 에서는 이 요소 앞에 구분선 |
| <code>position</code> | <code>near</code>, <code>center</code>, <code>far</code>. <code>element</code> 에 필수 |
| <code>index</code> | 칸 안의 위치 |
| <code>priority</code> | 넘칠 때 낮은 값부터 드롭다운으로 옮김. 기본 <code>0</code> |
| <code>category</code>, <code>data</code>, <code>id</code> | 항목에 붙여 두는 값. <code>id</code> 를 비우면 <code>'ID_숫자'</code> |
| <code>visibleFlag</code> | <code>false</code> 면 숨김 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>dropDownButtonClick</code> | 드롭다운 버튼 클릭 | - |
| <code>toolbarResized</code> | 넘침 계산 후 (<code>scroll</code> 이 아닐 때) | - |
| <code>itemRemoved</code> | 항목 삭제 | <code>{ item }</code> |

| 메서드 | 설명 |
| --- | --- |
| <code>add('element', item)</code> / <code>add('separator', item)</code> | 요소 / 구분선 추가 |
| <code>removeItem('element', { element })</code> / <code>removeItem('element', { position, index })</code> | 요소 삭제 |
| <code>removeItem('separator', { position, index })</code> | 구분선 삭제 |
| <code>clearPosition(position)</code> / <code>clear()</code> | 한 칸 / 전체 비우기 |
| <code>getItemFromElement(el)</code> / <code>getItemFromIndex(i)</code> / <code>getNumberOfItems()</code> | 항목 찾기 (항목은 <code>{ type, element, position, container, priority, ... }</code>) |
| <code>getPositionFromElement(el)</code> | <code>{ position, index, container: 'toolbar' 또는 'popup' }</code> |
| <code>getPopupContent()</code> / <code>showPopup()</code> | 드롭다운 내용 요소 / 열기 |
| <code>enablePopupBehavior({ showEverything, moveFromToolbarToPopup, moveFromPopupToToolbar, onPopupCreationFunction, popupBeforeDisplayCallback, popupPostOverlapCallback })</code> | <code>custom</code> 에서 옮기는 함수 바꾸기 |
| <code>modelModified()</code> | 요소 크기가 바뀐 뒤 다시 계산 |
| <code>getPreferredSize()</code> | 모두 펼쳤을 때 크기 |
| <code>destroy()</code> | 모두 지우고 감시 해제 |

## Breadcrumb

`DS/Controls/Breadcrumb`. 부모 `Abstract`. 경로(이동 경로)를 보여 주는 줄입니다. 넘친 항목과 우클릭은 `DS/Menu` 를 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>array</code> | <code>[]</code> | 항목 배열. 항목은 문자열 또는 <code>{ label, icon, value }</code>. <code>value</code> 를 비우면 <code>label</code> |
| <code>selectedValues</code> | <code>array</code> | <code>[]</code> | 선택된 항목 |
| <code>mode</code> | <code>enum</code> | <code>0</code> | <code>Breadcrumb.MODE</code>: <code>NAVIGATION</code>(0), <code>MULTIPLE_SELECTION</code>(1), <code>EXCLUSIVE_SELECTION</code>(2) |
| <code>displayStyle</code> | <code>enum</code> | <code>0</code> | <code>Breadcrumb.DISPLAY_STYLE</code>: <code>LITE</code>(0, <code>\</code> 구분자, 넘치면 메뉴 아이콘), <code>IMMERSIVE</code>(1, 항목 전체 클릭) |
| <code>displayIcons</code> / <code>displayLabels</code> | <code>enum</code> | <code>1</code> | <code>Breadcrumb.DISPLAY_ELEMENT</code>: <code>NONE</code>(0), <code>ALL</code>(1), <code>SELECTED</code>(2), <code>HOVERED</code>(3), <code>HOVERED_OR_SELECTED</code>(4) |
| <code>expandableSeparatorFlag</code> | <code>boolean</code> | <code>false</code> | 구분자를 눌 수 있는 화살표(<code>chevron-right</code>)로 |
| <code>onSeparatorClickEvent</code> | <code>function</code> | <code>null</code> | 구분자 클릭 처리 <code>fn({ index })</code>. 주면 <code>separatorClick</code> 이벤트 대신 호출 |
| <code>onContextualEvent</code> | <code>function</code> | <code>null</code> | 항목 우클릭 <code>fn({ infos, data, indexFound })</code>. 메뉴 항목 배열을 돌려줌 |
| <code>customContextMenuFlag</code> | <code>boolean</code> | <code>false</code> | <code>true</code> 면 <code>onContextualEvent</code> 반환값으로 메뉴를 열지 않음 |

모드별 클릭 동작입니다.

| mode | 항목 클릭 |
| --- | --- |
| <code>NAVIGATION</code> | 그 뒤 항목을 모두 지움 (<code>change</code>), 마지막 항목이 선택됨 (<code>selectionChange</code>) |
| <code>EXCLUSIVE_SELECTION</code> | 그 항목 하나 선택 |
| <code>MULTIPLE_SELECTION</code> | 선택 / 해제 전환 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 내용이 바뀜 (<code>push</code>, <code>pop</code>, 클릭으로 잘림, 다른 배열 대입) | - |
| <code>selectionChange</code> | <code>selectedValues</code> 변경 | - |
| <code>separatorClick</code> | 구분자 클릭 (<code>expandableSeparatorFlag</code>) | <code>{ index }</code> |
| <code>preSelection</code> | 마우스가 항목 위를 옮겨 다님 | <code>{ oldItem, newItem }</code> (순번, 없으면 <code>-1</code>) |

| 메서드 | 설명 |
| --- | --- |
| <code>push(item)</code> | 끝에 추가. <code>change</code> 발생 |
| <code>pop()</code> | 마지막 항목 삭제. 지운 항목 반환 |
| <code>destroy()</code> | 정리 |

## GroupBox

`DS/Controls/GroupBox`. 부모 `Abstract`. `fieldset` + `legend` 로 묶은 상자입니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>label</code> | <code>string</code> | <code>''</code> | 제목 (<code>legend</code>) |
| <code>icon</code> | <code>object</code> | <code>''</code> (2026: <code>undefined</code>) | 제목 앞 아이콘. 형식은 [아이콘](/controls/webux-controls#아이콘) |
| <code>iconDimension</code> | <code>string</code> | <code>'16px'</code> (2026: <code>16</code>) | 아이콘 크기. 숫자로 줌 (<code>px</code> 를 붙여 씀) |
| <code>content</code> | <code>object</code> | <code>null</code> | 안에 넣을 요소. 바꾸면 이전 요소를 뗌 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>icon</code> 변경 | - |

| 메서드 | 설명 |
| --- | --- |
| <code>appendChild(el)</code> | <code>fieldset</code> 에 요소 추가. 반환값(감싼 <code>div</code>)은 화면에 붙지 않으므로 쓰지 않음 |

- 2025 는 생성 옵션의 `iconDimension` 을 `icon` 값으로 잘못 계산해 반영하지 않습니다. 생성 후 `box.iconDimension = 20` 으로 넣으면 반영됩니다. 2026 에서 고쳐졌습니다.

## Flyout

`DS/Controls/Flyout`. 부모 `Abstract`. 아이콘 버튼(`Button`, `displayStyle: 'smartIcon'`) 옆에 펼침 영역을 붙인 컨트롤입니다. 펼친 내용은 `Popup` 또는 `DS/Menu` 로 엽니다. 앱 직접 사용은 없고 Tweakers 안에서 씁니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>label</code> | <code>string</code> | <code>''</code> | 버튼 글자 |
| <code>icon</code> | <code>string</code> | <code>null</code> | 버튼 아이콘 |
| <code>showLabelFlag</code> | <code>boolean</code> | <code>false</code> | 글자 표시 |
| <code>displayMode</code> | <code>Flyout.DISPLAY_MODE</code> | <code>EXPANDER</code>(0) | <code>EXPANDER</code>: 버튼은 <code>onClick</code>, 옆 펼침 영역이 내용을 엶. <code>BUTTON</code>(1): 버튼이 내용을 열고 닫음 |
| <code>onClick</code> | <code>function</code> | <code>null</code> | <code>EXPANDER</code> 에서 버튼 클릭 처리 |
| <code>type</code> | <code>Flyout.TYPE</code> | <code>STANDARD</code>(0) | <code>CHECK</code>(1) 면 버튼이 눌림 상태를 가짐 (<code>EXPANDER</code> 에서만) |
| <code>checkFlag</code> | <code>boolean</code> | <code>false</code> | 버튼 눌림 상태 (<code>CHECK</code>) |
| <code>mainElementDisabledFlag</code> | <code>boolean</code> | <code>false</code> | 버튼만 비활성. 펼침은 됨 (<code>EXPANDER</code>) |
| <code>extendedView</code> | <code>object</code> | <code>null</code> | 펼칠 내용. 요소면 Popup, <code>{ menuModel: [...] }</code> 이면 메뉴 |
| <code>getExtendedView</code> | <code>function</code> | <code>extendedView</code> 반환 | 열 때마다 내용을 돌려주는 함수 |
| <code>allowUnsafeHTMLLabel</code> | <code>boolean</code> | <code>false</code> | 글자를 HTML 로 |
| <code>labelPosition</code> <Badge type="warning" text="2026" /> | <code>string</code> | <code>'right'</code> | 아이콘 기준 글자 위치 |

| 메서드 | 설명 |
| --- | --- |
| <code>showExtendedView()</code> / <code>hideExtendedView()</code> | 펼친 내용 열기 / 닫기 |
| <code>isExtendedViewVisible()</code> | 열려 있는지 |
| <code>destroy()</code> | 닫고 정리 |

- 정적 값: `Flyout.DISPLAY_MODE = { EXPANDER: 0, BUTTON: 1 }`, `Flyout.TYPE = { STANDARD: 0, CHECK: 1 }`.
- 발생하는 이벤트가 없습니다. 안쪽 Button 의 `buttonclick` 은 Flyout 에서 멈춥니다.
- `menuModel` 항목 형식은 [메뉴 항목](/datagridview/context-menu#메뉴-항목) 과 같습니다. Flyout 이 `disabled` 면 모든 항목을 비활성으로 바꾼 복사본을 엽니다.

## BadgesContainer

`DS/Controls/BadgesContainer`. 부모 `Abstract`. [Label](/controls/webux-controls#label) 칩을 한 줄로 늘어놓고, 넘치면 `...` 버튼 메뉴로 보여 줍니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>value</code> | <code>BadgeDefinition[]</code> | <code>[]</code> | 배지 배열 |

배지(`BadgeDefinition`) 키입니다.

| 키 | 설명 |
| --- | --- |
| <code>text</code> | 글자. <code>null</code> 이면 아이콘만 |
| <code>icon</code> | 아이콘 |
| <code>emphasize</code> | 색 (Label 과 같음) |
| <code>tooltip</code> | 툴팁 객체 |
| <code>callback</code> | 눌렀을 때 <code>fn({ index, icon, text })</code>. 있으면 눌 수 있는 모양 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | 배지 추가, 삭제, 갱신, <code>value</code> 대입 | - |
| <code>badgeClick</code> | 배지를 누름 (포인터 down) | <code>{ index, icon, text }</code> |
| <code>onReady</code> | 화면에 처음 그려짐 | - |

| 메서드 | 설명 |
| --- | --- |
| <code>addBadge(def, index?)</code> | 추가. <code>index</code> 가 범위 밖이면 무시 |
| <code>removeBadge(def)</code> | 삭제. <code>value</code> 안의 **같은 객체** 를 넘김 |
| <code>refreshBadge(def)</code> | 객체를 고친 뒤 화면 갱신. 같은 객체를 넘김 |
| <code>clickOnBadge(event, def)</code> | 코드로 누르기 (<code>clickOnBadge(undefined, def)</code>) |

## Scroller

`DS/Controls/Scroller`. 부모 `UWA/Controls/Abstract`. 대상 요소를 `div.wux-scroller`(`position: absolute`, 상하좌우 0)로 감싸 스크롤 시작 / 중 / 끝을 알려 줍니다. Layouts(GridEngine), CollectionView 가 씁니다.

```js
var scroller = new Scroller(targetEl, { scrollEndTimeout: 300 }).inject(parentEl);
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>scrollDebounceTimeout</code> | <code>0</code> | 0 보다 크면 scroll 처리를 이 시간(ms)으로 debounce |
| <code>scrollEndTimeout</code> | <code>201</code> | 마지막 scroll 후 이 시간(ms)이 지나면 끝으로 봄 |
| <code>useRequestAnimationFrame</code> | <code>false</code> | 스크롤 중 알림을 프레임마다 |
| <code>eventPeriod</code> | <code>0</code> | 기본값만 있고 쓰는 곳이 없음 |

| 메서드 | 설명 |
| --- | --- |
| <code>onScrollBegin(fn)</code> / <code>onScroll(fn)</code> / <code>onScrollEnd(fn)</code> / <code>onInit(fn)</code> | 구독. 구독 토큰 반환. <code>fn</code> 안의 <code>this</code> 가 Scroller |
| <code>unsubscribe(token)</code> | 구독 해제 |
| <code>getPosition(fromDom?)</code> | <code>{ x, y }</code>. <code>true</code> 면 DOM 의 <code>scrollLeft</code> / <code>scrollTop</code> |
| <code>setPosition({ x, y }, mode?)</code> | <code>mode</code> 가 없으면 내부 위치만 기록. 아무 값이면 실제로 스크롤, <code>'immediate'</code> 면 스크롤하고 기록도 함 |
| <code>resetPosition()</code> | 맨 위, 맨 왼쪽으로 |
| <code>getDeltaScrollPosition()</code> / <code>getDeltaScrollPositionFromBeginning()</code> | 직전 / 스크롤 시작 대비 이동량 |
| <code>isInScrollTransaction()</code> | 스크롤 중인지 (끝 판정 전) |
| <code>areScrollbarsDisplayed(dir?)</code> | 스크롤 막대가 생겼는지. <code>'vertical'</code> / <code>'horizontal'</code> 또는 둘 다 객체로 |
| <code>showScrollingFeedbacks()</code> / <code>hideScrollingFeedbacks()</code> | 얇은 가상 스크롤 막대 표시 / 숨김 |

## Stack

`DS/Controls/Stack`. 부모 `UWA/Controls/Abstract`. `ul.Stack` 에 `li` 칸을 가로 또는 세로로 쌓습니다. 앱 사용은 없습니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>orientation</code> | <code>'horizontal'</code> | <code>horizontal</code> (칸이 <code>inline-block</code>), <code>vertical</code> (<code>block</code>) |
| <code>class</code> | <code>''</code> | <code>ul</code> 에 붙일 클래스 |
| <code>styles</code> | <code>{ margin: 0, padding: 0 }</code> | <code>ul</code> 스타일 |

| 메서드 | 설명 |
| --- | --- |
| <code>append(content, { weight, styles, class, events })</code> | 칸 추가. <code>content</code> 는 <code>li</code> 의 <code>html</code> 로 들어감. <code>{ container, options }</code> 반환 |
| <code>remove(cell)</code> | <code>append</code> 가 준 객체로 칸 삭제 |
| <code>getElements()</code> / <code>getElementsContainers()</code> | 칸 객체 배열 / <code>li</code> 배열 |
| <code>toggleOrientation()</code> | 빈 함수 (아무 동작 없음) |

- `weight` 는 `inject` 할 때 한 번 계산합니다. 가로면 `left`, `width` 를 %로, 세로면 `height` 를 %로 넣습니다. 그 뒤 추가, 삭제한 칸은 다시 계산하지 않습니다.

## LayerSet

`DS/Controls/LayerSet`. 부모 `UWA/Controls/Abstract`. 같은 영역에 여러 층을 `position: absolute` 로 겹칩니다. ApplicationFrame 등 플랫폼 프레임이 씁니다.

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| <code>styles</code> | <code>{}</code> | 바깥 <code>div.LayerSet</code> 스타일 |

| 메서드 | 설명 |
| --- | --- |
| <code>addLayer(el, styles?)</code> | 층 추가. <code>styles</code> 기본 <code>{ left: 0, right: 0, top: 0, bottom: 0 }</code>. 만든 층 <code>div</code> 반환. <code>el</code> 은 <code>inject</code> 가 있는 UWA 요소 또는 컨트롤 |

## Deck

`DS/Controls/Deck`. 부모 `UWA/Controls/Abstract`. 요소 여러 개에 CSS 변형을 차례로 거는 애니메이션 도우미입니다. 앱 사용은 없습니다.

| 옵션 | 설명 |
| --- | --- |
| <code>selector</code> | 대상 CSS 선택자 문자열 |
| <code>distributions</code> | 단계 배열. 단계는 <code>{ CSS속성: 값 또는 fn(index, el, items) }</code>. <code>translate3d</code>, <code>scale3d</code> 는 <code>{ x, y, z }</code>, <code>rotate3d</code> 는 <code>{ x, y, z, a }</code> 를 돌려줌 |
| <code>duration</code> | 단계 시간(ms) |
| <code>ease</code> | 전환 함수 이름 |
| <code>container</code> | 선택자. 찾기만 하고 쓰지 않음 |
| <code>onComplete</code> | 받기만 하고 호출하지 않음 |

| 메서드 | 설명 |
| --- | --- |
| <code>play(step?)</code> | 그 단계 실행. 생성할 때 <code>play(0)</code> 이 자동 호출되고 단계가 끝나면 다음 단계로 |
| <code>nextEffect()</code> | 다음 단계 |
| <code>initial()</code> | 변형 지우기 |

- `webkitTransition` / `webkitTransform` 만 씁니다.
- `selector` 가 문자열이 아니면 생성 중에 `TypeError` 가 납니다 (`this.items` 를 만들지 않고 `push`).

## Stepper

<Badge type="warning" text="2026" /> `DS/Controls/Stepper`. 부모 `Abstract`. 단계마다 안쪽 `StepView`(부모 `BaseCard`)를 만듭니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>steps</code> | <code>Step[]</code> | <code>[]</code> | 단계 배열. 넣으면 Proxy 로 바뀌어 <code>stepper.steps[i].status = 'done'</code> 처럼 고쳐도 화면에 반영 |
| <code>activeStep</code> | <code>number</code> | <code>0</code> | 현재 단계 (0 부터) |
| <code>clickableFlag</code> | <code>boolean</code> | <code>false</code> | 단계를 눌러 이동 |
| <code>orientation</code> | <code>string</code> | <code>'horizontal'</code> | <code>horizontal</code>, <code>vertical</code> |
| <code>detailsFlag</code> | <code>boolean</code> | <code>true</code> | 제목, 설명 표시 |
| <code>disableStepsAfterActive</code> | <code>boolean</code> | <code>true</code> | 현재 단계 뒤에서 <code>status</code> 가 <code>default</code> 인 단계를 비활성 |

단계(`Step`) 키입니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>title</code> | <code>''</code> | 제목 |
| <code>description</code> | <code>''</code> | 설명 |
| <code>status</code> | <code>'default'</code> | <code>default</code>, <code>done</code>, <code>error</code> (CSS 에 있는 값) |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>activeStepChange</code> | 단계를 눌러 <code>activeStep</code> 이 바뀜 (코드 대입은 없음) | - |
| <code>stepStatusChange</code> | <code>steps[i]</code> 의 키 값이 바뀜 (<code>status</code> 외 키도) | <code>{ stepIndex, statusOldValue, statusNewValue }</code> |
| <code>onReady</code> | 크기 계산 후 (크기가 바뀔 때마다) | - |

- 폭이 모자라면 모든 단계를 축소 모양(`reducedFlag`)으로 바꾸고 제목은 툴팁으로 보여 줍니다.
- 단계는 1 부터 번호가 붙습니다 (`number: index + 1`).

## DropdownButton

<Badge type="warning" text="2026" /> `DS/Controls/DropdownButton`. 부모 `Abstract`. 주 버튼과 펼침 버튼(`expand-down`) 두 개의 `Button` 이고, 펼침 버튼은 `DS/Menu` 를 엽니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>emphasize</code> | <code>string</code> | <code>'secondary'</code> | 두 버튼의 색 ([Button](/controls/api/webux-controls#button) 과 같은 값) |
| <code>mainAction</code> | <code>object</code> | - | 주 버튼 <code>{ label, icon, onClick, disabled }</code> |
| <code>secondaryActions</code> | <code>array</code> / <code>function</code> | - | 메뉴 항목 <code>[{ label, icon, onClick, disabled }]</code>. 함수면 열 때마다 호출해 배열을 받음 |

- 이벤트를 따로 내지 않습니다. `mainAction.onClick`, 항목 `onClick` 으로 받습니다.
- `disabled` 는 두 버튼 모두, `mainAction.disabled` 는 주 버튼만 비활성으로 만듭니다.

## ModeChooser

<Badge type="warning" text="2026" /> `DS/Controls/ModeChooser`. 부모 `Abstract`. 모드 하나를 고르는 컨트롤입니다. 폭에 따라 버튼(`Button` radio) / 아이콘 / 콤보(`ComboBox`, 비동기로 불러옴) 모양을 고릅니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>modesList</code> | <code>array</code> | <code>[]</code> | 모드 <code>{ label, icon, value, tooltip? }</code>. <code>label</code>, <code>icon</code>, <code>value</code> 세 키가 모두 있어야 하고, 같은 <code>value</code> 는 버림. 유효한 모드가 2 개 미만이면 빈 목록 |
| <code>value</code> | <code>string</code> | - | 고른 모드 값. 목록에 없는 값이면 이전 값, 그것도 없으면 첫 모드 |
| <code>type</code> | <code>string</code> | <code>'comboBox'</code> | 원하는 모양: <code>buttons</code> (아이콘 + 글자), <code>icons</code>, <code>comboBox</code>. 다른 값은 무시 |
| <code>computedType</code> | <code>string</code> | <code>'comboBox'</code> | 실제 모양. 읽기 전용. 폭이 모자라면 <code>buttons</code> → <code>icons</code> → <code>comboBox</code> 로 내려감 |
| <code>showLockButtonFlag</code> | <code>boolean</code> | <code>false</code> | 자물쇠 버튼 표시 |
| <code>lockButtonCheckFlag</code> | <code>boolean</code> | <code>false</code> | 자물쇠 잠김 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경 (코드로 바꿔도) | - |
| <code>lockChange</code> | <code>lockButtonCheckFlag</code> 변경 | - |

- `icon` 문자열은 3DS 글꼴로 해석합니다 (`{ iconName, fontIconFamily: Font3DS }`). Button 의 문자열 아이콘(FontAwesome)과 다릅니다.
