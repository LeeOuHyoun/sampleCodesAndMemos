---
title: 확장 컨트롤 (ControlsEx)
---

# 확장 컨트롤 (ControlsEx) <Badge type="info" text="원본 분석" />

`DS/ControlsEx/*` 는 `DS/Controls/*` 위에 만든 조합형 컨트롤입니다. 카드, 객체 머리글(IDCard), 진행 표시 패널, 코드 편집기, 트리 경로 탐색기가 있고 2026 에는 단계 마법사(Wizard)와 단위 입력칸(MagnitudeEditor)이 더해졌습니다. 모두 `Abstract` 를 상속하므로 만들기, 속성 읽기와 쓰기, 이벤트 받기는 [WebUX 컨트롤 공통 사용법](/controls/webux-controls#공통-사용법) 과 같습니다.

::: info 근거
ControlsEx.js (2025, 2026) 의 PathExplorer, IDCard, Card, LoadingPanel, CodeMirror, Wizard, MagnitudeEditor (`publishedProperties`, `_apply...`, `fire("...")`, prototype / class 메서드). Controls.js 의 Abstract.fire, BadgesContainer (addBadge, clickOnBadge), BaseCard (mainAction), Stepper (`_convertStepsToProxy`, `_updateStepViews`), ModalContainer.createModal. Utilities.js 의 Utils.createToolbarItemsModelFromCommands, saveDataInLocalPreferences. TreeModel.js 의 computeNodeFromLabels. KnowledgeWebCore.js 의 KnowledgeMagnitudeServices (setUnitToDisplay, getUnitToDisplay, show). Core/wux.css. 호출부: TweakersEx (TweakerPath, TweakerCode, ControlsExViewModules), ENOProjectMgmtCommonComponents, ENOCollabRouteTask, VCXWebKernel, WebInfraUI, DELWebUXControls, IssueManagement (2026), CfgEffectivityCommands (2026), WindowsEx WizardDialog (2026)
:::

## 한눈에 보기

| 모듈 | 용도 | 부모 | 앱에서 쓰는 곳 |
| --- | --- | --- | --- |
| `DS/ControlsEx/Card` | 그림 + 제목 + 배지 + 명령 카드 | 2025 `Abstract`, 2026 `DS/Controls/BaseCard` | TweakersEx (URL 객체 카드 보기) |
| `DS/ControlsEx/IDCard` | 객체 머리글 (배너, 그림, 제목, 상태 콤보, 명령, 접기) | `Abstract` | ENOProjectMgmtCommonComponents. ENONextGenFilterUX 는 불러오기만 함 |
| `DS/ControlsEx/LoadingPanel` | 진행 막대 + 글자 + 일시정지 / 중지 버튼 패널 | `Abstract` | ENOCollabRouteTask, VCXWebKernel, WebInfraUI, DELWebUXControls, ModelLoader_3dwb. 2026 에 IssueManagement, CfgEffectivityCommands, DELReactControls 추가 |
| `DS/ControlsEx/CodeMirror` | CodeMirror 5.47 코드 편집기 | `Abstract` | TweakersEx (TweakerCode) |
| `DS/ControlsEx/PathExplorer` | TreeDocument 노드 경로 (Breadcrumb + 트리 팝업) | `Abstract` | TweakersEx (TweakerPath) |
| `DS/ControlsEx/Wizard` | 단계 표시(Stepper) + 단계별 내용 | `Abstract` | 2026 WindowsEx (WizardDialog) |
| `DS/ControlsEx/MagnitudeEditor` | 단위 붙은 숫자 입력 (`12 mm`) | `Abstract` | 2026, 앱 사용 없음 |

이 문서의 이벤트 표에서는 크기가 바뀔 때 내부용으로 나는 `dimensionsChanged` 를 뺐습니다.

## 불러오기와 CSS

ControlsEx 폴더에는 CSS 파일이 없습니다. 모양은 모두 `Core/wux.css` 에 들어 있습니다 (`.wux-controls-card`, `.wux-controls-idcard`, `.wux-idcard-*`, `.wux-controls-loading-panel-*`, `.wux-controls-pathexplorer-*`, `.wux-controls-codemirror`, 2026 의 `.wux-controls-wizard-*`, `.wux-controls-magnitudeEditor`).

| 필요한 것 | 불러오는 방법 |
| --- | --- |
| `Core/wux.css` | 각 모듈이 `DS/Controls/Abstract` 를 부르고, 그 안의 `DS/Core/Core` 가 `css!DS/Core/wux.css` 를 불러옵니다. 단독 HTML 에서는 [다른 WebUX 컨트롤](/controls/#불러오기와-css) 처럼 직접 겁니다 |
| `ControlsEx/assets/nls/translation_*.json` | IDCard (정보, 홈, 펼치기, 접기 툴팁), Wizard, MagnitudeEditor 가 `i18n!` 으로 불러옵니다. 따로 할 일은 없습니다 |
| `CodeMirrorV5.47/` | CodeMirror 컨트롤이 만들어질 때 `WebappsUtils.getWebappsBaseUrl()` 아래의 js, css 를 스스로 불러옵니다 |

## Card

`DS/ControlsEx/Card` 는 그림, 제목, 부제, 설명, 배지, 명령 아이콘을 한 장에 담습니다. 값을 준 부분만 화면 요소가 생기고, `undefined` 로 돌리면 그 요소가 빠집니다. 배지는 `DS/Controls/BadgesContainer`, 명령은 [GeneratedToolbar](/tweakers/generated-toolbar) 로 그립니다.

```js
require(['DS/ControlsEx/Card'], function (Card) {
  var card = new Card({
    picture: '../assets/images/part.png',
    titleIcon: { iconName: 'folder', fontIconFamily: WUXManagedFontIcons.Font3DS },
    titleText: 'PRT-0001',
    subtitle: '브라켓',
    description: '알루미늄 브라켓. 고정 구멍 2개',
    descriptionHeight: 2,
    badges: [{ text: 'RELEASED', emphasize: 'success' }],
    actions: [
      { label: '수정', icon: { iconName: 'pencil', fontIconFamily: WUXManagedFontIcons.Font3DS }, value: function () { console.log('수정'); } },
      { label: '삭제', icon: { iconName: 'trash', fontIconFamily: WUXManagedFontIcons.Font3DS }, value: function () { console.log('삭제'); } }
    ],
    mainAction: { url: 'https://example.com/part/PRT-0001', target: '_blank' }
  }).inject(document.getElementById('cards'));

  card.addEventListener('onActionsReady', function () { console.log('명령 툴바 준비'); });
  card.description = '설명 변경';
});
```

### 제목 누르기 (mainAction)

`mainAction` 은 **제목 줄을 누를 때만** 실행됩니다. 제목 줄은 `titleText` 나 `titleIcon` 이 있을 때 생깁니다. 실행되면 제목에 `visited` 속성이 붙습니다.

| 형태 | 동작 |
| --- | --- |
| `function () {}` | 인자 없이 부름 |
| `{ func: fn, argument: {...} }` | `fn(argument 복사본)` |
| `{ module: 'DS/앱/모듈', func: '함수이름', argument: {...} }` | 모듈을 `require` 해서 그 함수를 부름 |
| `'https://...'` | 새 창(`_blank`)으로 열기 |
| `{ url, target, parameters }` | `url + parameters` 를 `target` 에 열기. `_blank` (기본), `_self`, `_parent`, `_top`, 프레임 이름 |

TweakersEx 의 카드 보기는 URL 객체 값의 `func` / `module` / `argument` 또는 `url` / `target` / `parameters` 를 그대로 `mainAction` 으로 옮깁니다.

### 배지와 명령 형식

`badges` 항목 (BadgesContainer 의 `value` 로 그대로 전달):

| 키 | 설명 |
| --- | --- |
| `text` | 글자. `null` 이면 아이콘만 |
| `icon` | 아이콘 |
| `emphasize` | 색 ([Label](/controls/webux-controls#label) 과 같은 값) |
| `tooltip` | 툴팁 객체 |
| `callback(info)` | 누를 때 부름. `info` 는 `{ index, icon, text }` |

`actions` 항목 (`Utils.createToolbarItemsModelFromCommands` 가 툴바 항목으로 바꿈):

| 키 | 설명 |
| --- | --- |
| `label` | 툴팁 글자 |
| `icon` | 아이콘 |
| `value` | 누를 때 부를 함수 (또는 GeneratedToolbar 의 [버튼 콜백](/tweakers/generated-toolbar#버튼-콜백) 값) |
| `disabled` | 비활성 |
| `children` | 하위 명령 배열. 있으면 메뉴 버튼이 됨 |

### 선택 표시

| | 2025 | 2026 |
| --- | --- | --- |
| 선택 가능 표시 키 | `selectableFlag` | `selectionFeedbackFlag` |
| 체크 아이콘 | `picture` + `selectableFlag` 일 때 | `picture` + `selectionFeedbackFlag` 일 때 |
| 누르면 | `selectedFlag` 가 뒤집힘 | `selectFromUserInteractionFlag` 가 `true` (기본) 면 뒤집힘 |
| `selected` 속성 | `selectableFlag` 와 `selectedFlag` 둘 다 `true` 일 때 | `selectedFlag` 가 `true` 면 |

::: warning 선택이 바뀌어도 이벤트가 없습니다
카드를 눌러 `selectedFlag` 가 바뀌어도 Card 는 아무 이벤트도 내지 않습니다 (`fire` 는 `onActionsReady` 하나뿐). 선택 상태는 `card.selectedFlag` 로 읽습니다. 2025 는 누름(pointerup) 처리가 `selectableFlag` 와 상관없이 붙어 있어서, `selectableFlag: false` 인 카드도 누르면 `selectedFlag` 가 `true` 가 됩니다 (화면 표시만 없음).
:::

::: warning 2026 에서 selectableFlag 가 없어졌습니다
2026 의 Card 는 `selectableFlag` 를 `selectionFeedbackFlag` 로 바꿨습니다. 2025 코드의 `selectableFlag: true` 는 2026 에서 무시됩니다. 또 2026 은 누를 때마다 기본으로 `selectedFlag` 가 바뀌므로, 선택이 필요 없는 카드는 `selectFromUserInteractionFlag: false` 를 줍니다.
:::

- 2025 는 `subtitle` 이 제목(`titleText` 또는 `titleIcon`)이 있을 때만 보입니다. 2026 은 제목 없이도 보입니다.
- `descriptionHeight` 는 설명 줄 수입니다 (CSS 변수 `--description-lines`). 0 ~ 10 이 아닌 값은 받지 않고 이전 값을 유지합니다.
- `picture` 는 CSS `background-image: url(...)` 로 들어갑니다.

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>activeFlag</code> | <code>boolean</code> | <code>false</code> | 요소에 <code>active</code> 속성 (강조 모양) |
| <code>selectableFlag</code> | <code>boolean</code> | <code>false</code> | 2025 만. 선택 가능 표시 |
| <code>selectionFeedbackFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>false</code> | 체크 아이콘과 누르는 동안 강조 |
| <code>selectedFlag</code> | <code>boolean</code> | <code>false</code> | 선택 상태 |
| <code>selectFromUserInteractionFlag</code> <Badge type="warning" text="2026" /> | <code>boolean</code> | <code>true</code> | 눌러서 <code>selectedFlag</code> 를 바꿀지 |
| <code>orientation</code> | <code>string</code> | <code>'portrait'</code> | <code>portrait</code>, <code>landscape</code>. 다른 값은 portrait |
| <code>picture</code> | <code>string</code> | - | 그림 주소 |
| <code>titleIcon</code> | <code>object</code> | - | 제목 앞 아이콘 (<code>Dom.generateIcon</code> 형식) |
| <code>titleText</code> | <code>string</code> | - | 제목 |
| <code>subtitle</code> | <code>string</code> | - | 부제 |
| <code>description</code> | <code>string</code> | - | 설명 |
| <code>descriptionHeight</code> | <code>integer</code> | <code>1</code> | 설명 줄 수 0 ~ 10 |
| <code>badges</code> | <code>object[]</code> | - | 배지 목록 |
| <code>actions</code> | <code>Array&lt;WUX.CommandDefinitionModel&gt;</code> | - | 명령 아이콘 목록 |
| <code>mainAction</code> | <code>WUX.LinkDefinition &#124; WUX.FunctionDefinition</code> | - | 제목 누를 때 동작. 2026 은 BaseCard 에 있음 |
| <code>highlightModel</code> <Badge type="warning" text="2026" /> | <code>object</code> | - | BaseCard 속성. 있으면 제목, 부제, 설명을 <code>Utils.highlightContent</code> 로 그림 |

### 이벤트

| 이벤트 | 시점 |
| --- | --- |
| <code>onActionsReady</code> | 명령 툴바(<code>actions</code>)가 처음 그려졌을 때 |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>addBadge(badge, index?)</code> | 배지 추가. <code>badges</code> 가 없으면 빈 배열을 먼저 만듦 |
| <code>refreshBadge(badge)</code> | 같은 객체를 찾아 다시 그림 (내용을 고친 뒤 부름) |
| <code>removeBadge(badge)</code> | 같은 객체를 찾아 지움 |
| <code>show()</code> / <code>hide()</code> | 2026 은 명령 툴바도 같이 숨김 / 표시 |

## IDCard

`DS/ControlsEx/IDCard` 는 객체 화면 맨 위의 머리글입니다. 배너, 그림, 제목, 부제, 설명, 배지, 그리고 오른쪽 툴바(상태 콤보, 사용자 명령, 정보 / 접기 / 홈 버튼)로 되어 있습니다. 툴바는 [GeneratedToolbar](/tweakers/generated-toolbar) 입니다.

```js
require(['DS/ControlsEx/IDCard'], function (IDCard) {
  var idCard = new IDCard({
    identifier: 'partHeader',
    titleIcon: { iconName: 'folder', fontIconFamily: WUXManagedFontIcons.Font3DS },
    titleText: 'PRT-0001 브라켓',
    subTitle: 'Rev A',
    description: '알루미늄 브라켓',
    pictureSrc: '../assets/images/part.png',
    status: [
      { label: '작업중', value: 'IN_WORK', isSelected: true },
      { label: '검토중', value: 'REVIEW' }
    ],
    toolbarCommands: [
      { label: '수정', icon: { iconName: 'pencil', fontIconFamily: WUXManagedFontIcons.Font3DS }, value: function () { console.log('수정'); } }
    ],
    homeVisibleFlag: true
  }).inject(document.getElementById('header'));

  idCard.addEventListener('statusChange', function (e) { console.log('상태', e.options.value); });
  idCard.addEventListener('infoClicked', function (e) { console.log('정보 패널', e.dsModel.infoActivatedFlag); });
  idCard.addEventListener('foldClicked', function (e) { console.log('접힘', e.dsModel.isFoldedFlag); });
  idCard.addEventListener('homeClicked', function () { console.log('홈'); });
});
```

ENOProjectMgmtCommonComponents 는 `new IDCard({ isFoldedFlag: true, infoVisibleFlag: true, identifier: '...' })` 로 만든 뒤 `titleText`, `titleIcon`, `pictureSrc`, `subTitle` 을 데이터가 오면 채우고, `infoClicked` 로 오른쪽 속성 패널을 엽니다.

### 툴바 버튼과 접기

| 버튼 | 보이는 조건 | 누르면 |
| --- | --- | --- |
| 상태 콤보 | `status` 가 비어 있지 않을 때 | `setSelectedStatus(value)` 후 `statusChange` |
| 사용자 명령 | `toolbarCommands` 항목마다 | 항목의 `value` 함수 |
| 정보 (`info`) | `infoVisibleFlag` (기본 `true`) | `infoActivatedFlag` 를 뒤집고 `infoClicked` |
| 접기 (`up-down-reduced` / `up-down-constrained`) | `isFoldableFlag` (기본 `true`) | `isFoldedFlag` 를 뒤집고 `foldClicked` |
| 홈 (`home`) | `homeVisibleFlag` (기본 `false`) | `homeClicked` |

- 접으면(`isFoldedFlag: true`) 배너, 설명, 배지가 숨고 부제가 제목 옆으로 올라갑니다. 요소에 `folded` 속성이 붙습니다.
- `status` 항목은 `{ label, value, isSelected }` 입니다. 콤보는 [TweakerString 콤보](/tweakers/editors#콤보) 로 그려집니다. `isSelected` 가 없으면 첫 항목이 선택으로 보입니다.
- `toolbarCommands` 항목 형식은 Card 의 [`actions`](#배지와-명령-형식) 와 같습니다.
- 카드 너비가 529px 이하면 그림을 숨기고 툴바를 아이콘 하나 너비로 줄입니다. 넓을 때는 사용자 명령 아이콘 전체 너비가 머리글 절반보다 크면 명령을 메뉴(chevron) 하나로 묶습니다.
- 제목이 세 줄 이상이 되거나 부제 / 설명이 잘리면 그 글자가 툴팁으로 나옵니다.
- `titleIcon` 은 크기를 16px 로 덧붙여 `Dom.generateIcon` 으로 그립니다. 앱(ENOProjectMgmtCommonComponents)은 아이콘 주소 문자열을 그대로 넣지만, 소스가 이 값에 `Object.assign` 으로 크기 옵션을 덧붙이므로 `{ iconPath: '주소' }` 객체로 주는 편이 안전한 것으로 보입니다 <Badge type="danger" text="검증 필요" />.

::: warning setSelectedStatus 는 isSelected 가 있는 항목이 있어야 움직입니다
`setSelectedStatus(value)` 는 "지금 `isSelected` 인 항목" 과 "새 항목" 을 둘 다 찾았을 때만 표시를 바꿉니다. 처음 `status` 에 `isSelected: true` 인 항목이 하나도 없으면 코드로 불러도 아무 일도 일어나지 않고, `getSelectedStatus()` 는 계속 첫 항목을 돌려줍니다. 처음부터 한 항목에 `isSelected: true` 를 줍니다.
:::

::: warning identifier 를 주면 접힘 / 정보 상태가 저장됩니다
`identifier` 가 빈 문자열이 아니면, 사용자가 접기 / 정보 버튼을 누를 때 그 상태를 `localStorage` 키 `wux-controlsex-idcard` 에 저장합니다. 다음에 같은 `identifier` 로 만들면 저장된 값이 생성 옵션의 `isFoldedFlag`, `infoActivatedFlag` 를 덮어씁니다. 매번 같은 상태로 열려야 하면 `identifier` 를 주지 않거나 만든 뒤에 값을 다시 넣습니다. 코드로 바꾼 값은 저장하지 않습니다.
:::

### 끌어 놓기

`draggableFlag: true` 면 카드를 끌 수 있습니다 (툴바에서 시작한 끌기는 막음). 끌기 이벤트마다 `onDragStart` / `onDrag` / `onDragEnd` 를 먼저 부르고, 그 함수가 **참 값을 돌려줄 때만** 기본 동작 `onDragStartDefault` 등을 이어서 부릅니다.

기본 `onDragStartDefault(e)` 는 `dataTransfer` 의 `Text` 에 아래 JSON 을 넣고(이미 `Text` 에 JSON 이 있으면 그 키가 우선), `effectAllowed` 를 `copyMove` 로, `DragAndDropManager.storeGlobalData({ sourceIDCardUUID, titleText, subTitle, timestamp })` 를 부릅니다.

```js
{
  source: { uuid: idCard.identifier, amd: 'DS/ControlsEx/IDCard' },
  data: {
    'dswebux/x-controlsex.idcard.title+json': idCard.titleText,
    'dswebux/x-controlsex.idcard.subtitle+json': idCard.subTitle
  }
}
```

::: warning onDragStart 가 아무것도 돌려주지 않으면 기본 동작이 빠집니다
`onDragStart: function (e) { ... }` 처럼 값을 돌려주지 않으면 `undefined` 라서 `onDragStartDefault` 가 불리지 않고 `dataTransfer` 가 비어 있게 됩니다. 기본 데이터도 넣으려면 `return true;` 를 씁니다.
:::

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>titleIcon</code> | <code>object</code> | <code>null</code> | 제목 앞 아이콘 (16px). 비우면 숨김 |
| <code>titleText</code> | <code>string</code> | <code>''</code> | 제목 |
| <code>bannerSrc</code> | <code>string</code> | <code>''</code> | 맨 위 배너 그림 주소. 접으면 숨김 |
| <code>pictureSrc</code> | <code>string</code> | <code>''</code> | 왼쪽 그림 주소 (4:3) |
| <code>subTitle</code> | <code>string</code> | <code>''</code> | 부제 (Card 와 달리 대문자 T) |
| <code>description</code> | <code>string</code> | <code>''</code> | 설명. 접으면 숨김 |
| <code>badges</code> | <code>object[]</code> | <code>[]</code> | 배지 ([Card 배지 형식](#배지와-명령-형식)). 접으면 숨김 |
| <code>status</code> | <code>object[]</code> | <code>[]</code> | 상태 콤보 항목 <code>{ label, value, isSelected }</code> |
| <code>toolbarCommands</code> | <code>object[]</code> | <code>[]</code> | 사용자 명령 |
| <code>isFoldedFlag</code> | <code>boolean</code> | <code>false</code> | 접힘 |
| <code>isFoldableFlag</code> | <code>boolean</code> | <code>true</code> | 접기 버튼 표시 |
| <code>identifier</code> | <code>string</code> | <code>''</code> | 읽기 전용 (생성 옵션으로만). 상태 저장 키, 끌기 데이터 <code>uuid</code> |
| <code>infoVisibleFlag</code> | <code>boolean</code> | <code>true</code> | 정보 버튼 표시 |
| <code>homeVisibleFlag</code> | <code>boolean</code> | <code>false</code> | 홈 버튼 표시 |
| <code>infoActivatedFlag</code> | <code>boolean</code> | <code>false</code> | 정보 버튼 눌림 표시 (<code>highlightInfo</code> 클래스) |
| <code>draggableFlag</code> | <code>boolean</code> | <code>false</code> | 끌기 허용 |
| <code>onDragStart</code> / <code>onDrag</code> / <code>onDragEnd</code> | <code>function</code> | - | 끌기 콜백. 참 값을 돌려주면 기본 동작도 실행 |
| <code>allowUnsafeHTML</code> <Badge type="warning" text="2026" /> | <code>object</code> | - | <code>{ title, subTitle, description }</code> 중 <code>true</code> 인 칸은 HTML 로 넣음 (기본은 <code>innerText</code>) |

### 이벤트

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>onReady</code> | 툴바가 그려지고 크기 맞춤이 끝났을 때. <code>toolbarCommands</code> 를 바꾼 뒤에도 | - |
| <code>statusChange</code> | 사용자가 상태 콤보를 바꿈 | <code>{ value }</code> |
| <code>infoClicked</code> | 정보 버튼 (<code>infoActivatedFlag</code> 는 이미 바뀐 뒤) | - |
| <code>foldClicked</code> | 접기 버튼 (<code>isFoldedFlag</code> 는 이미 바뀐 뒤) | - |
| <code>homeClicked</code> | 홈 버튼 | - |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>getSelectedStatus()</code> | <code>isSelected</code> 항목의 <code>value</code>. 없으면 첫 항목의 <code>value</code> |
| <code>setSelectedStatus(value)</code> | 선택 항목 변경. 위 함정 참고. 이벤트 없음 |
| <code>onDragStartDefault(e)</code> | 기본 끌기 시작 동작 (위 JSON). <code>onDragDefault</code>, <code>onDragEndDefault</code> 는 빈 함수 |
| <code>show()</code> / <code>hide()</code> | 2026 은 툴바도 같이 숨김 / 표시 |
| <code>destroy()</code> | 크기 감시 해제 후 정리 |

## LoadingPanel

`DS/ControlsEx/LoadingPanel` 은 진행 막대([ProgressBar](/controls/webux-controls#progressbar)), 안내 글자, 일시정지 / 재생 / 중지 버튼을 묶은 패널입니다. ControlsEx 에서 앱이 가장 많이 쓰는 모듈입니다. 처음에는 숨겨져 있고 `on()` 으로 1초 동안 나타나며 `off()` 로 1초 동안 사라집니다 (`UWA/Fx` 투명도 애니메이션).

```js
require(['DS/ControlsEx/LoadingPanel'], function (LoadingPanel) {
  var panel = new LoadingPanel({
    shape: 'linear',
    width: '300px',
    info: '부품 목록을 불러오는 중...',
    showButtonsFlag: 'closeButtonOnly',
    modalFlag: true
  }).inject(widget.body);

  panel.on();
  panel.addEventListener('stop', function () { console.log('사용자가 중지'); });

  loadParts().then(function () {
    panel.value = 100;
    panel.off();
  });
});
```

위 조합(`linear` + `closeButtonOnly` + `modalFlag: true` + `info` 글자, `widget.body` 에 붙이기)이 IssueManagement (2026) 의 목록 불러오기와 같은 조합입니다. ENOCollabRouteTask 는 `shape: 'circular'`, `modalFlag: true` 로 만들어 `value = undefined` (끝없는 막대) 후 `on()` 합니다.

### 켜고 끄기

| 호출 | 동작 |
| --- | --- |
| `on()` | 횟수 +1. 처음(0 → 1)일 때만 표시하고 나타나기 시작. 다 나타나면 `loadingPanelOn` |
| `off()` | 횟수 -1 (0 아래로 안 내려감). 0 이 되면 사라지기 시작. 다 사라진 뒤에도 0 이면 숨기고 `loadingPanelOff` |
| 중지 버튼 | 횟수를 1 로 만들고 `stop` 발생. `autoCloseFlag` (기본 `true`) 면 이어서 `off()` |

`on()` 을 두 번 부른 작업은 `off()` 도 두 번 불러야 사라집니다. 중지 버튼은 횟수와 상관없이 한 번에 닫습니다.

### 진행률과 글자

| 값 | 화면 |
| --- | --- |
| `value` 가 0 ~ 100 숫자 | 그 비율 막대 + 퍼센트 |
| `value` 가 `undefined` 나 범위 밖 | 끝없이 움직이는 막대 (`infiniteFlag`), 퍼센트 숨김 |
| `info` 문자열 | 막대 아래 글자. `shape: 'spinner'` 면 글자 뒤에 `(40%)` 를 붙임 |
| `info` 에 TreeDocument | 막대 아래에 트리(DataGridView, 헤더 없음)로 여러 줄 표시 |

`shape` 는 `linear`, `circular`, `spinner` 입니다. `width` 는 `linear` 일 때만 패널 너비로 들어가고 `circular` 에서는 무시됩니다.

### 버튼

`showButtonsFlag` 는 타입이 `boolean` 이지만 문자열 `'closeButtonOnly'` 도 받습니다.

| 값 | 버튼 |
| --- | --- |
| `false` (기본) | 없음 |
| `true` | 일시정지(재생) + 중지 |
| `'closeButtonOnly'` | 중지만 |

일시정지를 누르면 막대 색이 `pause` 로 바뀌고 `playPause` (`isPaused: true`), 재생을 누르면 원래 `emphasize` 로 돌아오고 `playPause` (`isPaused: false`) 가 납니다. 실제 작업을 멈추고 다시 시작하는 것은 앱이 이 이벤트를 받아서 합니다.

::: warning 버튼의 buttonclick 은 패널 밖으로 올라오지 않습니다
패널 안 버튼은 `buttonclick` 의 전파를 막고 패널에서 `playPause` / `stop` 을 냅니다. 부모 요소에서 `buttonclick` 을 기다리지 말고 패널에 `stop` 을 겁니다. WebInfraUI 처럼 `panel.elements._stopButton` 에 직접 거는 코드는 내부 이름에 기대는 방식입니다.
:::

::: warning 없는 옵션은 무시됩니다
VCXWebKernel 은 `statusFlag: false` 를 넘기지만 LoadingPanel 의 속성이 아니라서 아무 효과가 없습니다. 퍼센트 표시는 `value` 로만 정해집니다 (위 표).
:::

### 상속해서 쓰기

DELWebUXControls 의 DELProgressBar 는 `LoadingPanel.inherit({ publishedProperties: { steps, stepValue, ... } })` 로 단계 진행 막대를 만듭니다. `stepValue` 가 바뀌면 `info = '2 / 5 | 단계 이름'`, `value = 앞 단계 weight 합` 을 넣는 방식입니다. 직접 만들 때도 [컨트롤 직접 만들기](/controls/webux-controls#컨트롤-직접-만들기) 와 같은 규칙입니다.

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>shape</code> | <code>string</code> | <code>'linear'</code> | <code>linear</code>, <code>circular</code>, <code>spinner</code> |
| <code>displayStyle</code> | <code>string</code> | <code>'normal'</code> | 안 ProgressBar 의 <code>displayStyle</code> |
| <code>width</code> | <code>string</code> | <code>'100%'</code> | 패널 너비 (<code>linear</code> 만) |
| <code>emphasize</code> | <code>string</code> | <code>'info'</code> | 막대 색 (ProgressBar 와 같은 값) |
| <code>value</code> | <code>number</code> | - | 0 ~ 100. 그 밖은 끝없는 막대 |
| <code>info</code> | <code>object</code> | <code>''</code> | 문자열 또는 TreeDocument |
| <code>showButtonsFlag</code> | <code>boolean</code> | <code>false</code> | <code>true</code>, <code>false</code>, <code>'closeButtonOnly'</code> |
| <code>modalFlag</code> | <code>boolean</code> | <code>false</code> | LoadingPanel 요소를 부모 크기(100%)로 늘리고 가리개(<code>ModalContainer.createModal</code>)를 씌운 위에 패널을 올림 |
| <code>autoCloseFlag</code> | <code>boolean</code> | <code>true</code> | 중지 버튼을 누르면 <code>off()</code> |

### 이벤트

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>loadingPanelOn</code> | <code>on()</code> 후 다 나타났을 때 (1초 뒤) | - |
| <code>loadingPanelOff</code> | 마지막 <code>off()</code> 후 다 사라졌을 때 (1초 뒤) | - |
| <code>playPause</code> | 일시정지 / 재생 버튼 | <code>{ isPaused }</code> |
| <code>stop</code> | 중지 버튼 | - |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>on()</code> | 켜기 (횟수 +1) |
| <code>off()</code> | 끄기 (횟수 -1, 0 이면 사라짐) |

## CodeMirror

`DS/ControlsEx/CodeMirror` 는 webapps 의 `CodeMirrorV5.47` 을 감싼 코드 편집기입니다. 만들 때 `mode` 에 맞는 CodeMirror 스크립트(`CodeMirrorV5.47/mode/<mode>/<mode>.js`)와 기본 addon(괄호 닫기, 찾기, 주석, 자동완성), CSS 를 **비동기로** 불러온 뒤 편집기를 만듭니다. TweakersEx 의 TweakerCode 가 이 컨트롤을 씁니다.

```js
require(['DS/ControlsEx/CodeMirror'], function (CodeMirror) {
  var editor = new CodeMirror({
    mode: 'javascript',
    value: 'var a = 1;',
    CMOptions: { theme: 'eclipse', lineNumbers: true },
    resizableFlag: true
  }).inject(document.getElementById('code'));

  editor.setHeight(300);
  editor.addEventListener('ready', function () { console.log('편집기 준비'); });
  editor.addEventListener('change', function (e) { console.log(e.dsModel.value.length); });
});
```

- `mode` 는 `CodeMirrorV5.47/mode/` 아래 폴더 이름입니다 (`javascript`, `xml`, `css`, `sql`, `python` 등). `{ name: 'javascript', json: true }` 처럼 객체도 되며 이때 파일은 `name` 으로 찾습니다. `mode` 가 없으면 콘솔에 `You must provide a value for mode property` 를 찍고 편집기를 만들지 않습니다.
- `CMOptions` 는 아래 기본값 위에 덮어써서 `CodeMirror.fromTextArea` 에 넘깁니다. 만든 뒤 바꾸면 키마다 `setOption` 합니다. `theme` 을 바꾸면 `CodeMirrorV5.47/theme/<이름>.css` 를 불러옵니다.
- `disabled: true` 면 CodeMirror 의 `readOnly` 가 됩니다.

| CodeMirror 기본 옵션 | 값 |
| --- | --- |
| `lineNumbers` | `true` |
| `theme` | `'monokai'` |
| `autoCloseBrackets` | `true` |
| `tabSize` / `indentUnit` | `2` |
| `indentWithTabs` | `true` |
| `matchBrackets` | `true` |
| `matchTags` | `{ bothTags: true }` |

::: warning ready 전에는 편집기가 없습니다
스크립트를 불러오는 동안은 내부 CodeMirror 객체가 없습니다. 이때 `value` 를 바꾸면 값만 저장되고(편집기를 만들 때 반영) `change` 는 나지 않습니다. 2026 의 `getSelectedText()` 는 이때 부르면 `TypeError` 가 납니다. 편집기를 직접 다루는 코드는 `ready` 뒤에 둡니다.
:::

::: warning change 는 글자 하나마다, 코드로 바꿔도 납니다
사용자가 칠 때마다 `value` 가 바뀌고 `change` 가 납니다. 편집기가 만들어진 뒤에는 코드로 `editor.value = '...'` 를 넣어도 `change` 가 납니다. 저장 같은 무거운 처리는 버튼이나 포커스 이동에 겁니다.
:::

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>mode</code> | <code>string</code> | - | 언어 모드. 필수. 읽기 전용 (생성 옵션으로만) |
| <code>value</code> | <code>string</code> | - | 편집 내용 |
| <code>CMOptions</code> | <code>object</code> | - | CodeMirror 옵션 (위 기본값 위에 덮어씀) |
| <code>resizableFlag</code> | <code>boolean</code> | <code>false</code> | 요소에 <code>resize="both"</code> 속성 (끌어서 크기 조절) |

### 이벤트

| 이벤트 | 시점 |
| --- | --- |
| <code>ready</code> | 편집기가 만들어지고 처음 화면에 그려졌을 때 (한 번) |
| <code>change</code> | <code>value</code> 변경 (입력, 코드 모두) |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>setHeight(h)</code> | 편집기 높이 (<code>setSize(null, h)</code>). 만들어지기 전에 부르면 기억했다가 적용 |
| <code>refresh()</code> | CodeMirror <code>refresh()</code>. 숨겨져 있다가 보일 때 부름 |
| <code>setCMOption(key, value)</code> | 옵션 하나 변경 |
| <code>getSelectedText()</code> <Badge type="warning" text="2026" /> | 선택한 글자 |

## PathExplorer

`DS/ControlsEx/PathExplorer` 는 TreeDocument 안 노드 하나를 `홈 아이콘 > 상위 > ... > 노드` 경로로 보여 주고 고르게 합니다. 안에서 `DS/Controls/Breadcrumb`, [Popup](/controls/webux-controls#popup), `DS/Menu/Menu`, DataGridView 를 씁니다. TweakersEx 의 TweakerPath 가 이 컨트롤을 씁니다.

| 누르는 곳 | 동작 |
| --- | --- |
| 경로의 항목 | 그 노드가 `value` 가 됨 |
| 항목 사이 구분자(`>`) | 그 노드의 자식 목록 메뉴. 고르면 `value` 가 됨 |
| 왼쪽 홈 아이콘 | `onBurgerClick` 실행. 기본은 모델 전체 트리를 팝업으로 엶 |

```js
require(['DS/ControlsEx/PathExplorer', 'DS/TreeModel/TreeDocument', 'DS/TreeModel/TreeNodeModel'], function (PathExplorer, TreeDocument, TreeNodeModel) {
  var doc = new TreeDocument();
  var root = new TreeNodeModel({ label: '제품' });
  var asm = new TreeNodeModel({ label: '조립품 A' });
  var part = new TreeNodeModel({ label: '브라켓' });
  asm.addChild(part);
  root.addChild(asm);
  doc.addRoot(root);

  var path = new PathExplorer({ model: doc, value: part }).inject(document.getElementById('path'));
  path.addEventListener('change', function (e) {
    console.log(path.computeStringsFromValue(e.dsModel.value));
  });

  path.value = path.computeValueFromStrings(['제품', '조립품 A']);
});
```

TreeDocument, TreeNodeModel 만들기는 [데이터 (TreeDocument)](/datagridview/api/data) 에 있습니다.

::: warning value 는 model 안의 노드여야 합니다
`value` 에 `model` 에 없는 노드를 넣거나 `model` 없이 노드를 넣으면 `value` 가 `null` 이 됩니다. 모델에서 그 노드가 지워져도 `null` 이 됩니다. `model` 과 `value` 를 같이 주거나 `model` 을 먼저 넣습니다.
:::

::: warning useModelSelectionFlag 는 모델 선택과 묶입니다
기본값 `true` 면 `value` 를 바꿀 때 그 노드를 모델 선택(XSO)으로 만들고, 모델 선택이 바뀌면 `value` 를 따라 바꿉니다. 같은 TreeDocument 를 그리드에도 쓰면 그리드 선택과 경로가 서로 바뀝니다. 반대로 `false` 면 이 연결이 없어서 홈 팝업 트리에서 행을 골라도 `value` 가 바뀌지 않습니다 (TweakerPath 는 `false` 로 만듦). 이 값은 `model` 을 넣을 때 한 번 읽으므로 생성 옵션으로 줍니다.
:::

- 기본 홈 동작(`defaultOnBurgerClick`)은 팝업을 열기 전에 **모델 전체를 접고**(`collapseAll`) `value` 의 상위만 펼칩니다. 같은 모델을 쓰는 그리드의 펼침 상태도 바뀝니다. 바꾸고 싶지 않으면 `onBurgerClick` 에 다른 함수를 줍니다.
- `change` 는 `value` 가 실제로 다른 노드로 바뀔 때 납니다. 코드로 바꿔도 납니다.
- `computeValueFromStrings` 는 루트부터 글자(label)로 따라 내려가다 **찾은 데까지의 마지막 노드** 를 돌려줍니다. 중간 이름이 틀려도 `null` 이 아니라 그 위 노드가 나옵니다.
- 자식이 없는 노드를 가리키면 요소에 `is-displaying-leaf` 속성이 붙습니다.
- 2026 은 TreeDocument 옵션 `shouldBeSelected(node)` 가 `false` 인 노드를 경로에서 비활성으로 그립니다.

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>model</code> | <code>DS/TreeModel/TreeDocument</code> | <code>null</code> | 경로를 찾을 트리 |
| <code>value</code> | <code>DS/TreeModel/TreeNodeModel</code> | <code>null</code> | 지금 노드 |
| <code>useModelSelectionFlag</code> | <code>boolean</code> | <code>true</code> | 모델 선택(XSO)과 <code>value</code> 를 묶음 |
| <code>onBurgerClick</code> | <code>function</code> | <code>defaultOnBurgerClick()</code> 호출 | 홈 아이콘 누를 때. <code>this</code> 는 컨트롤 |

### 이벤트

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>value</code> 가 다른 노드로 바뀜 (경로, 메뉴, 팝업, 코드) |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>computeValueFromStrings(labels)</code> | label 배열 → 노드 (<code>model.computeNodeFromLabels</code>) |
| <code>computeStringsFromValue(node)</code> | 노드 → 루트부터의 label 배열. 노드가 없으면 <code>[]</code> |
| <code>defaultOnBurgerClick()</code> | 기본 홈 동작 (모델 접고 상위 펼친 뒤 트리 팝업 준비) |
| <code>displayHierarchicalModel()</code> | 트리 팝업을 바로 엶 |
| <code>destroy()</code> | 팝업 그리드, 모델 / 노드 리스너 정리 |

## Wizard

<Badge type="warning" text="2026" /> 2026 에만 있습니다. `DS/ControlsEx/Wizard` 는 단계 표시줄(`DS/Controls/Stepper`)과 지금 단계의 설명 / 내용 영역을 `DS/Windows/DockingElement` 로 나눠 담습니다. 다음 / 이전 버튼은 없습니다. 버튼이 있는 대화상자는 아래 [WizardDialog](#wizarddialog-로-감싸기) 를 씁니다.

```js
require(['UWA/Core', 'DS/ControlsEx/Wizard'], function (UWA, Wizard) {
  var pages = [
    UWA.createElement('div', { text: '기본 정보 입력' }),
    UWA.createElement('div', { text: '첨부 파일 선택' }),
    UWA.createElement('div', { text: '확인' })
  ];

  var wizard = new Wizard({
    steps: [
      { title: '기본 정보', description: '이름, 설명' },
      { title: '첨부' },
      { title: '확인' }
    ],
    activeStep: 0,
    getStepContentAndDescription: function (index) {
      return { description: (index + 1) + ' / 3 단계', content: pages[index] };
    }
  }).inject(document.getElementById('wizard'));

  wizard.addEventListener('activeStepChange', function (e) { console.log('단계', e.dsModel.activeStep); });

  wizard.updateStep(0, { status: 'done' });
  wizard.activeStep = 1;
});
```

### 단계 (steps)

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `title` | `''` | 단계 이름 |
| `description` | `''` | 이름 아래 작은 글자 |
| `status` | `'default'` | `default`, `done`, `error`. 번호 아이콘 모양이 바뀜 |
| `tooltipInfos` | - | 툴팁. 없으면 `title` |

- `activeStep` 은 0 부터 셉니다. 단계를 바꾸면 `getStepContentAndDescription(activeStep)` 을 불러 `description`, `content` 를 채웁니다. 문자열은 `innerText`, 요소는 비우고 `appendChild` 합니다.
- `disableStepsAfterActive` (기본 `true`) 면 지금보다 뒤 단계 중 `status` 가 `'default'` 인 단계는 누를 수 없습니다. `done` 으로 바꾼 단계는 앞질러 누를 수 있습니다.
- `orientation: 'vertical'` 이면 단계 표시줄이 왼쪽에 서고(너비 300px) 접기 버튼이 생깁니다.

::: warning 빈 설명 / 내용을 돌려주면 이전 것이 남습니다
`getStepContentAndDescription` 이 `''` 나 `undefined` 를 돌려주면 그 영역을 건드리지 않습니다. 이전 단계의 글자나 요소가 그대로 보입니다. 비우려면 빈 요소(`document.createElement('div')`)를 돌려줍니다.
:::

::: warning activeStepChange 는 단계를 눌렀을 때만 납니다
`wizard.activeStep = 2` 처럼 코드로 바꾸면 화면은 바뀌지만 `activeStepChange` 는 나지 않습니다. 사용자가 단계 표시줄의 단계를 누를 때만 납니다 (`clickableSteps` 가 `true` 이고 그 단계가 비활성이 아닐 때).
:::

::: warning stepStatusChange 는 상태가 아닌 값이 바뀌어도 납니다
`steps` 는 안에서 Proxy 로 감싸져 있어 단계 객체의 어떤 키든 바뀌면 `stepStatusChange` 가 납니다. `updateStep(0, { title: '새 이름' })` 도 `{ stepIndex: 0, statusOldValue: '이전 이름', statusNewValue: '새 이름' }` 으로 옵니다. 상태 변경만 처리하려면 `getStep(e.options.stepIndex).status` 를 다시 확인합니다.
:::

### WizardDialog 로 감싸기

2026 WindowsEx 의 `DS/WindowsEx/WizardDialog` 는 [Dialog](/controls/dialog) 를 상속해 `content` 의 Wizard 에 맞춰 아래 버튼을 만듭니다. 첫 단계는 다음 + 취소, 중간은 이전 + 다음 + 취소, 마지막은 이전 + 확인(Validate) + 취소입니다.

```js
require(['DS/WindowsEx/WizardDialog'], function (WizardDialog) {
  var dlg = new WizardDialog({
    title: '부품 등록',
    content: wizard,
    modalFlag: true,
    getFooterButtonsLabel: function () { return { next: '다음', previous: '이전', validate: '등록', cancel: '취소' }; }
  });
  dlg.addEventListener('validate', function () { console.log('등록'); dlg.close(); });
});
```

| 항목 | 설명 |
| --- | --- |
| `content` | **Wizard 객체 자체**. `wizard.getContent()` 나 다른 요소는 받지 않음 |
| `getFooterButtonsLabel()` | `{ next, previous, validate, cancel }` 버튼 글자. 비우면 번역 글자 |
| `getFooterButtonsDisabledState()` | `{ isNextDisabled, isValidateDisabled }`. 버튼을 다시 만들 때마다 부름 |
| `minDimensionToFitStepper` | 기본 `true`. 단계 수에 맞춰 대화상자 최소 크기 지정 |
| `enableNextButton(flag)` / `enableValidateButton(flag)` | 다음 / 확인 버튼 켜고 끄기 |
| 이벤트 | `goToNextStep`, `goToPreviousStep` (activeStep 을 바꾸기 전), `validate` (닫지 않음), `close` |

다음 버튼은 검사 없이 `wizard.activeStep++` 합니다. 입력 검사는 `enableNextButton(false)` 로 막아 두고 조건이 맞을 때 켭니다.

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>steps</code> | <code>WUX.Step[]</code> | <code>[]</code> | 단계 목록 (위 표) |
| <code>activeStep</code> | <code>number</code> | <code>0</code> | 지금 단계 (0 부터) |
| <code>clickableSteps</code> | <code>boolean</code> | <code>true</code> | 단계를 눌러 이동 |
| <code>orientation</code> | <code>string</code> | <code>'horizontal'</code> | <code>horizontal</code>, <code>vertical</code> |
| <code>disableStepsAfterActive</code> | <code>boolean</code> | <code>true</code> | 뒤 단계 중 <code>default</code> 상태는 비활성 |
| <code>getStepContentAndDescription</code> | <code>function</code> | <code>{ description: '', content: '' }</code> 반환 | <code>(index)</code> → <code>{ description, content }</code>. 문자열 또는 요소 |

### 이벤트

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>activeStepChange</code> | 사용자가 단계를 누름 | - |
| <code>stepStatusChange</code> | 단계 객체의 값이 바뀜 (<code>updateStep</code> 포함) | <code>{ stepIndex, statusOldValue, statusNewValue }</code> |
| <code>orientationChange</code> | <code>orientation</code> 변경 후 (DockingElement 를 다시 만듦) | - |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>getStep(index)</code> | 단계 복사본 (JSON 복제). 범위 밖이면 <code>undefined</code> |
| <code>isStepDisabled(index)</code> | 그 단계가 비활성인지 |
| <code>updateStep(index, { title, description, status, tooltipInfos })</code> | 준 키만 바꿔 다시 그림 |

## MagnitudeEditor

<Badge type="warning" text="2026" /> 2026 에만 있습니다. `DS/ControlsEx/MagnitudeEditor` 는 `12 mm`, `3.5 in` 처럼 단위를 붙여 치는 숫자 입력칸입니다. 안은 `DS/Controls/SpinBox` 이고, 단위 목록과 환산은 `DS/KnowledgeWebCore/KnowledgeMagnitudeServices` (`KnowledgeWebCore/assets/catrsc/KnowledgeMagnitudes.json`, 물리량 414 개)를 씁니다.

```js
require(['DS/ControlsEx/MagnitudeEditor'], function (MagnitudeEditor) {
  var len = new MagnitudeEditor({
    magnitudeID: 'LENGTH',
    displayUnit: 'MM',
    value: 0.012,
    minValue: 0,
    requiredFlag: true
  }).inject(document.getElementById('length'));

  len.addEventListener('change', function (e) {
    console.log('미터', e.dsModel.value, '화면', e.dsModel.formatValueAsString(e.dsModel.value));
  });
});
```

### 값과 단위

| 항목 | 내용 |
| --- | --- |
| `value` | **MKS 단위** 숫자. `LENGTH` 는 미터, `ANGLE` 은 라디안, `MASS` 는 킬로그램, `TIME` 은 초 |
| 화면 입력 | `숫자 [단위]`. 단위는 label(`mm`) 이나 NLS 이름으로 찾음. 단위를 빼면 `displayUnit` 으로 봄 |
| 모르는 단위, 숫자 아님 | 받지 않고 이전 값 유지 |
| 포커스 없을 때 글자 | `KnowledgeMagnitudeServices.show(value, magnitudeID, ' ')` (표시 단위 + 자릿수) |
| 단위 목록 | 단위를 치기 시작하거나 `Ctrl+Space` 를 누르면 팝업. 위아래 화살표로 고르고 Enter / Tab |
| 증감 | 위 / 아래 화살표는 `stepValue`, PageUp / PageDown 은 `pageStepValue` 만큼. **입력한 단위 기준** (`12 mm` 에서 위 → `12.1 mm`) |
| `minValue` / `maxValue` | MKS 값 기준 |

`LENGTH` 의 단위 이름(`displayUnit` 에 넣는 값)은 `MM`, `METER`, `CM`, `KM`, `INCH`, `FOOT` 등입니다. 없는 이름을 넣으면 `undefined` 가 되어 MKS 단위(`METER`)로 보입니다. 없는 `magnitudeID` 는 받지 않고 이전 값을 유지합니다.

::: warning displayUnit 은 같은 물리량 전체의 표시 단위를 바꿉니다
`displayUnit` 을 넣거나 입력에서 단위가 바뀌면 `KnowledgeMagnitudeServices.setUnitToDisplay` 가 `localStorage` 의 `KnowledgeMagnitude_<magnitudeID>` 에 저장하고 `unitChanged` 를 알립니다. 같은 브라우저의 다른 MagnitudeEditor, 다른 화면의 같은 물리량 표시도 이 단위를 따릅니다. 또 위젯 안에서는 `widget.getPreference('LengthUnit')` 같은 환경설정 값이 있으면 그것이 `localStorage` 보다 먼저입니다.
:::

::: warning 코드로 value 를 넣어도 change 가 납니다
`_applyValue` 가 매번 `change` 를 냅니다. 처음 만들 때 넣은 `value` 는 리스너를 걸기 전이라 받지 못합니다. 초기값을 넣을 때 저장 로직이 돌지 않게 하려면 [공통 규칙](/controls/webux-controls#이벤트) 대로 `fireOnlyFromUIInteractionFlag: true` 를 줍니다.
:::

### 속성

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>magnitudeID</code> | <code>string</code> | <code>'LENGTH'</code> | 물리량 이름 (<code>LENGTH</code>, <code>ANGLE</code>, <code>MASS</code>, <code>TIME</code> ...) |
| <code>value</code> | <code>number</code> | - | MKS 값 |
| <code>displayUnit</code> | <code>string</code> | - | 표시 단위 이름 (<code>MM</code> 등). 비우면 MKS 단위 |
| <code>autoFormatFlag</code> | <code>boolean</code> | <code>true</code> | 읽기 전용. 포커스가 없을 때 표시 단위로 다시 씀 |
| <code>minValue</code> / <code>maxValue</code> | <code>number</code> | - | 범위 (MKS) |
| <code>stepValue</code> | <code>number</code> | <code>0.1</code> | 화살표 증감 폭 |
| <code>pageStepValue</code> | <code>number</code> | <code>10</code> | PageUp / PageDown 증감 폭 |
| <code>invalidFlag</code> | <code>boolean</code> | <code>false</code> | 잘못된 값 표시 (안 SpinBox 의 <code>validFlag</code> 반대) |
| <code>requiredFlag</code> | <code>boolean</code> | <code>false</code> | 필수 |

읽기 전용 getter: `invalidState` (`invalidFlag` 이거나, `requiredFlag` 인데 값이 없음), `currentUnit` (지금 쓰는 단위 객체 `{ Name, label, NLSName, value }`).

### 이벤트

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>value</code> 변경 (입력, 코드 모두) |
| <code>displayUnitChange</code> | <code>displayUnit</code> 변경 |
| <code>magnitudeChange</code> | <code>magnitudeID</code> 변경 (단위 목록을 다시 만듦) |

### 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>increment(n?)</code> / <code>decrement(n?)</code> | 안 SpinBox 의 증감 |
| <code>inputText(text)</code> | 사용자가 친 것처럼 <code>'25 mm'</code> 를 해석해 <code>value</code> 에 넣음. 넣은 값을 돌려주는 Promise |
| <code>formatValueAsString(value)</code> | MKS 값 → 표시 글자 (<code>'12 mm'</code>) |
| <code>focus()</code> | 입력칸 포커스 |
| <code>hide()</code> | 단위 팝업도 닫고 숨김 |
| <code>destroy()</code> | 팝업, 그리드, 안 SpinBox 정리 |

## 2026 버전 차이

| 모듈 | 차이 |
| --- | --- |
| Card | 부모가 `DS/Controls/BaseCard` 로 바뀜. `selectableFlag` 삭제, `selectionFeedbackFlag`, `selectFromUserInteractionFlag` 추가. `mainAction` 은 BaseCard 로 이동, `highlightModel` 추가. 제목 없이도 부제 표시 |
| IDCard | `allowUnsafeHTML` 추가. `show()` / `hide()` 가 툴바도 같이 처리 |
| CodeMirror | `getSelectedText()` 추가 |
| PathExplorer | `shouldBeSelected` 가 `false` 인 노드를 경로에서 비활성 |
| LoadingPanel | 동작 같음 (ES 클래스 문법으로만 바뀜) |
| Wizard, MagnitudeEditor | 새 모듈. Wizard 는 WindowsEx 의 WizardDialog 가 씀 |
