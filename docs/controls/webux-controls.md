# WebUX 컨트롤

`DS/Controls/*` 컨트롤을 만들고, 값을 읽고 쓰고, 이벤트를 받는 방법입니다. 모든 컨트롤이 같은 규칙(`Abstract` 상속)을 따르므로 공통 사용법을 먼저 익히면 나머지는 속성 이름만 다릅니다.

샘플: [01_webux_form.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/ControlsSample/01_webux_form.html)

::: info 근거
Controls.js 의 Abstract (publishedProperties, fire, addEventListener), Button, Toggle, ButtonGroup, AbstractEditor, LineEditor, Editor, ComboBoxBase, ComboBox, Label, Expander, Popup, ProgressBar, Loader, ModalLoader, ModalContainer. Core.js 의 BaseComponent (init, setProperties, inject), Core.js 의 TooltipModel. Utilities.js 의 WUXUWAUtils.generatePropertiesSettersAndGetters, Dom.generateIcon. 호출부: AuthGenericCommands, DELWebCommonControls, CAT3DAnnotationBaseCmds
:::

## 공통 사용법

```js
require(['DS/Controls/Button', 'DS/Controls/LineEditor'], function (Button, LineEditor) {
  var partNo = new LineEditor({ placeholder: 'PRT-0000', requiredFlag: true })
    .inject(document.getElementById('partNo'));

  var save = new Button({ label: '저장', emphasize: 'primary' })
    .inject(document.getElementById('buttons'));

  save.addEventListener('buttonclick', function (e) {
    console.log('품번', partNo.value);
  });
});
```

### 만들기, 붙이기, 정리

| 할 일 | 코드 | 설명 |
| --- | --- | --- |
| 만들기 | `new Button({ ... })` | 옵션은 그 컨트롤의 `publishedProperties` 키만 반영. 나머지는 무시 |
| 붙이기 | `ctrl.inject(parent, where?)` | 자기 자신 반환. `where`: `'bottom'` (기본), `'top'`, `'before'`, `'after'` |
| 화면 요소 | `ctrl.getContent()` | `div.wux-controls-...`. 요소의 `dsModel` 이 컨트롤 |
| 떼기 | `ctrl.remove()` | 화면에서만 뗌 |
| 정리 | `ctrl.destroy()` | 이벤트, 단축키, 크기 감시를 지우고 정리 |

`parent` 는 DOM 요소입니다. UWA 요소(`widget.body`, `UWA.createElement` 결과)도 그대로 됩니다. 일반 DOM 요소에 `appendChild(ctrl.getContent())` 로 붙여도 됩니다.

### 속성 읽기와 쓰기

생성자 옵션과 같은 이름의 속성으로 읽고 씁니다. `getXxx()` / `setXxx()` 메서드는 없습니다.

```js
console.log(save.label);                       // 읽기
save.label = '수정';                            // 쓰기 (바로 화면에 반영)
save.setProperties({ label: '수정', disabled: true });  // 여러 개
```

모든 컨트롤에 있는 속성입니다 (`Abstract`).

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>disabled</code> | <code>false</code> | 비활성. 요소에 <code>disabled</code> 속성이 붙음 |
| <code>visibleFlag</code> | <code>true</code> | 표시 여부. <code>show()</code> / <code>hide()</code> 도 이 값을 바꿈 |
| <code>tooltipInfos</code> | - | 툴팁. 아래 [툴팁](#툴팁) |
| <code>domId</code> | <code>null</code> | 화면 요소의 <code>id</code> |
| <code>touchMode</code> | - | 터치용 큰 모양. 비우면 기기 설정을 따름 |
| <code>fireOnlyFromUIInteractionFlag</code> | <code>false</code> | <code>true</code> 면 사용자 조작으로 생긴 이벤트만 발생 |
| <code>animation</code> | <code>null</code> | <code>{ show: '이름', hide: '이름' }</code>. <code>wux-ui-animation-이름-in/out</code> 클래스를 붙임 |

::: warning 읽기 전용 속성에는 대입하지 않습니다
`readOnly` 로 표시된 속성(`LineEditor.validFlag`, `ComboBox.label` 등)은 getter 만 있습니다. 대입하면 조용히 무시되고, `'use strict'` 코드에서는 `TypeError` 가 납니다. 생성자 옵션으로는 넣을 수 있습니다.
:::

### 이벤트

`addEventListener(이름, fn)` 으로 받습니다. 컨트롤의 화면 요소에서 발생하는 **브라우저 DOM 이벤트** 입니다.

| 값 | 내용 |
| --- | --- |
| `e.dsModel` | 이벤트를 낸 컨트롤 |
| `e.options` | 추가 정보 (이벤트마다 다름) |
| `e.target` | 이벤트를 낸 컨트롤의 화면 요소 |

```js
save.addEventListener('buttonclick', function (e) {
  console.log(e.dsModel.label, e.options.ctrlKey);
});
```

::: warning 이벤트는 위로 전파됩니다
WebUX 이벤트는 `bubbles: true` 로 만들어집니다. 부모 요소(다이얼로그 내용, 폼 영역)에 `change` 를 걸면 **안에 있는 모든 컨트롤의 change** 가 올라옵니다. 부모에서 받을 때는 `e.dsModel` 로 어떤 컨트롤인지 확인합니다.
:::

::: warning 코드로 값을 바꿔도 change 가 발생합니다
`toggle.checkFlag = true`, `editor.value = 'A'`, `group.value = ['x']` 처럼 코드에서 바꿔도 `change` 가 납니다. 초기값을 넣을 때 저장 로직이 돌지 않게 하려면 생성 옵션에 `fireOnlyFromUIInteractionFlag: true` 를 줍니다. Tweakers 와 같은 규칙입니다 ([편집기 단독 사용](/tweakers/standalone#이벤트)).
:::

이 문서에서 다루는 컨트롤 중 `onClick` 옵션이 있는 것은 Button 뿐입니다 (Dialog 버튼도 Button). 다른 컨트롤은 `addEventListener` 를 씁니다. 이름에 `on` 을 붙이지 않습니다 (`'change'`, `'onChange'` 아님).

### 툴팁

모든 컨트롤의 `tooltipInfos` 에 일반 객체를 넘기면 `DS/Core/TooltipModel` 로 바뀝니다.

```js
new Button({
  label: '저장',
  tooltipInfos: { title: '저장', shortHelp: '변경 내용을 저장합니다', position: 'bottom' }
}).inject(el);
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>title</code> | <code>''</code> | 굵은 제목 |
| <code>shortHelp</code> | <code>''</code> | 먼저 보이는 짧은 설명 |
| <code>longHelp</code> | <code>''</code> | 조금 더 올려 두면 보이는 긴 설명 |
| <code>position</code> | <code>'bottom'</code> | 위치 |
| <code>initialDelay</code> | <code>1000</code> | 표시까지 대기 (ms) |
| <code>shortToLongDelay</code> | <code>2000</code> | 짧은 설명에서 긴 설명까지 (ms) |

나머지 키는 [API](/controls/api/webux-controls#tooltipmodel) 에 있습니다. `DS/Controls/TooltipModel` 은 폐기 예정이므로 불러오지 않습니다 ([개요](/controls/#모듈별-참조-수)).

### 아이콘

`Button.icon` 에 문자열을 주면 **FontAwesome** 글꼴로 해석됩니다. 3DEXPERIENCE 아이콘(`wux-ui-3ds-*`)은 객체로 줍니다. 실제 호출부도 대부분 `Font3DS` 를 씁니다 (`fontIconFamily: WUXManagedFontIcons.Font3DS` 729 건).

```js
new Button({ icon: { iconName: 'floppy', fontIconFamily: WUXManagedFontIcons.Font3DS }, label: '저장' });
new Button({ icon: 'check', label: '확인' });                // FontAwesome 의 check
new Button({ icon: '../assets/icons/part.png', label: '부품' });  // 이미지 경로
```

| 형태 | 결과 |
| --- | --- |
| `'check'` | `wux-ui-fa-check` (FontAwesome) |
| `{ iconName: 'check', fontIconFamily: WUXManagedFontIcons.Font3DS }` | `wux-ui-3ds-check` |
| `{ iconName: 'check' }` | Button 은 FontAwesome 로 채움 |
| `{ iconName: 'check', fontIconSize: '2x' }` | 크기 클래스 추가 |
| 점(`.`)이 들어간 문자열 (`part.png`, `data:image...`) | 이미지 |

::: warning 아이콘 이름은 글꼴마다 다릅니다
`'floppy'` 는 3DS 글꼴에만 있고 FontAwesome 에는 `'floppy-o'` 로 있습니다. 문자열로 `icon: 'floppy'` 를 주면 빈 아이콘이 됩니다. 이름은 `Core/wux-3ds-fonticons.css` 의 `.wux-ui-3ds-이름` / `.wux-ui-fa-이름` 에서 확인합니다.
:::

`WUXManagedFontIcons` 는 `DS/Controls/*` 를 불러오면 전역(`window`)에 생깁니다.

## Button

```js
var del = new Button({
  label: '삭제',
  emphasize: 'error',
  icon: { iconName: 'trash', fontIconFamily: WUXManagedFontIcons.Font3DS },
  onClick: function (e) { console.log('삭제', e.dsModel.value); },
  value: 'DELETE'
}).inject(el);
```

| 키 | 기본값 | 값 |
| --- | --- | --- |
| <code>label</code> | <code>''</code> | 글자 |
| <code>emphasize</code> | <code>'secondary'</code> | <code>primary</code>, <code>secondary</code>, <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code>, <code>medium-attention</code>, <code>high-attention</code> |
| <code>displayStyle</code> | <code>'normal'</code> | <code>normal</code>, <code>lite</code> (테두리 없음), <code>icon</code>, <code>lite-borders</code>, <code>flyout</code> |
| <code>type</code> | <code>'standard'</code> | <code>standard</code>, <code>check</code> (누를 때마다 <code>checkFlag</code> 토글), <code>radio</code> (같은 부모 안에서 하나만) |
| <code>checkFlag</code> | <code>false</code> | <code>check</code> / <code>radio</code> 의 눌림 상태 |
| <code>onClick</code> | - | 클릭 핸들러. 내부적으로 <code>buttonclick</code> 리스너로 등록 |
| <code>value</code> | - | 아무 값. 버튼 구분용 |
| <code>showLabelFlag</code> | <code>true</code> | <code>false</code> 면 아이콘만 |

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>buttonclick</code> | 클릭, Enter, Space | <code>{ ctrlKey, shiftKey, altKey }</code> |
| <code>buttonDblClick</code> | 더블 클릭 | - |
| <code>change</code> | <code>checkFlag</code> 가 바뀜 (<code>check</code>, <code>radio</code>) | - |

`click` 이 아니라 **`buttonclick`** 입니다. `disabled` 일 때는 발생하지 않습니다. 브라우저 `click` 을 직접 걸면 비활성 상태에서도 불릴 수 있습니다.

호출부 전체에서 `displayStyle: 'lite'` 가 274 건, `'icon'` 이 105 건 나옵니다. 툴바처럼 테두리 없는 버튼에 많이 씁니다.

## Toggle

체크박스, 라디오, 스위치를 하나의 클래스로 만듭니다.

```js
var useFlag = new Toggle({ type: 'switch', label: '사용', checkFlag: true }).inject(el);
useFlag.addEventListener('change', function (e) {
  console.log('사용 여부', e.dsModel.checkFlag);
});
```

| 키 | 기본값 | 값 |
| --- | --- | --- |
| <code>type</code> | <code>'checkbox'</code> | <code>checkbox</code>, <code>radio</code>, <code>switch</code>, <code>toggleIcon</code> |
| <code>checkFlag</code> | <code>false</code> | 켜짐 여부. 값은 <code>value</code> 가 아니라 이것으로 읽음 |
| <code>mixedState</code> | <code>false</code> | 일부 선택 (–) 표시 |
| <code>label</code> | <code>''</code> | 글자 |
| <code>internalLabelsFlag</code> | <code>false</code> | <code>switch</code> 안에 켜짐 / 꺼짐 글자 표시 |
| <code>value</code> | - | 아무 값. ButtonGroup 에서 구분용 |

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | <code>checkFlag</code> 가 바뀜 (코드로 바꿔도) |
| <code>buttonclick</code> | 클릭, Space |

`toggle()` 메서드는 `checkFlag` 를 뒤집습니다.

## ButtonGroup

버튼이나 토글 여러 개를 묶어 값 하나(배열)로 다룹니다.

```js
var group = new ButtonGroup({ type: 'radio' }).inject(el);
group.addChild(new Button({ label: '작업중', value: 'WIP' }));
group.addChild(new Button({ label: '승인', value: 'RELEASED' }));
group.value = ['WIP'];

group.addEventListener('change', function (e) {
  console.log(e.dsModel.value);   // ['RELEASED']
});
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>type</code> | <code>'radio'</code> | <code>radio</code>, <code>checkbox</code>, <code>switch</code>. 자식의 <code>type</code> 을 맞춰 바꿈 |
| <code>value</code> | - | 눌린 자식들의 <code>value</code> 배열 |
| <code>multiSelFlag</code> | <code>false</code> | Ctrl 클릭으로 여러 개 선택 |
| <code>allowResetToUndefinedByUIFlag</code> | <code>true</code> | <code>false</code> 면 마지막 하나는 해제 못 함 |
| <code>direction</code> <Badge type="warning" text="2026" /> | <code>'vertical'</code> | 배치 방향 |

메서드: `addChild(btn, index?)`, `removeChild(btn)`, `getButton(index)`, `getButtonFromValue(v)`, `selectValue(v)`, `selectIndex(i)`, `getButtonCount()`.

## LineEditor, Editor

`LineEditor` 는 한 줄, `Editor` 는 여러 줄 입력칸입니다. 둘 다 `AbstractEditor` 를 상속해 이벤트가 같습니다.

```js
var title = new LineEditor({ placeholder: '품명', requiredFlag: true, displayClearFieldButtonFlag: true }).inject(el);
var memo = new Editor({ nbRows: 4, placeholder: '비고' }).inject(el2);

title.addEventListener('change', function (e) { console.log('확정', e.dsModel.value); });
title.addEventListener('uncommittedChange', function (e) { console.log('입력 중', e.options.uncommittedValue); });
```

값은 두 단계로 관리됩니다.

| 속성 | 뜻 |
| --- | --- |
| <code>value</code> | 확정된 값. 이 값이 바뀌면 <code>change</code> |
| <code>valueToCommit</code> | 타이핑 중인 값. 바뀌면 <code>uncommittedChange</code> |

확정은 Enter(LineEditor), 포커스 이동(blur), `commitCurrentEntry()` 호출 때 일어납니다. `autoCommitFlag: true` 면 타이핑할 때마다 확정합니다.

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| <code>change</code> | <code>value</code> 변경 (코드로 바꿔도) | - |
| <code>uncommittedChange</code> | 타이핑 | <code>{ uncommittedValue }</code> |
| <code>validFlagChange</code> | <code>validFlag</code> 변경 (<code>requiredFlag</code>, <code>pattern</code>) | - |
| <code>focus</code> / <code>blur</code> | 포커스 | - |
| <code>clear</code> | 지우기 버튼 (LineEditor) | - |

주요 옵션 (전체는 [API](/controls/api/webux-controls#lineeditor)):

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>placeholder</code> | <code>''</code> | 안내 글자 |
| <code>requiredFlag</code> | <code>false</code> | 필수. 비면 <code>validFlag</code> 가 <code>false</code> |
| <code>pattern</code> | <code>''</code> | HTML <code>pattern</code> 속성 (LineEditor) |
| <code>displayStyle</code> | <code>'text'</code> | <code>text</code>, <code>password</code>, <code>lite</code> (LineEditor) |
| <code>maxLength</code> | <code>-1</code> | 최대 글자 수 |
| <code>nbRows</code> | <code>2</code> | 줄 수 (Editor) |
| <code>newLineMode</code> | <code>'shiftEnter'</code> | 줄바꿈 키 (Editor) |
| <code>readOnlyFlag</code> <Badge type="warning" text="2026" /> | <code>false</code> | 읽기 전용 |

## ComboBox

```js
var state = new ComboBox({
  elementsList: [
    { label: '작업중', value: 'WIP' },
    { label: '검토중', value: 'REVIEW' },
    { label: '승인', value: 'RELEASED', icon: 'check' }
  ],
  placeholder: '상태 선택',
  enableSearchFlag: false
}).inject(el);

state.addEventListener('change', function (e) {
  console.log(e.dsModel.value, e.dsModel.selectedIndex);   // 'REVIEW', 1
});
state.value = 'RELEASED';
```

`elementsList` 의 각 항목은 아래 중 하나로 씁니다. 첫 항목 형태로 전체를 판단하므로 섞지 않습니다.

| 형태 | 값 (<code>value</code>) |
| --- | --- |
| `'작업중'` (문자열) | 글자 그대로 |
| `{ label, value, icon, description }` | `value` |
| `{ labelItem, valueItem, iconItem }` | `valueItem` (예전 형식) |

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | - | 선택 값. <code>multiSelFlag</code> 면 배열 |
| <code>selectedIndex</code> | <code>-1</code> | 선택 위치 |
| <code>multiSelFlag</code> | <code>false</code> | 여러 개 선택 (<code>selectedIndexes</code>) |
| <code>enableSearchFlag</code> | <code>true</code> | 입력해서 목록 거르기 |
| <code>placeholder</code> | <code>''</code> | 안내 글자 |
| <code>label</code> | <code>''</code> | 선택된 글자 (읽기 전용) |

| 이벤트 | 시점 |
| --- | --- |
| <code>change</code> | 선택 변경 |
| <code>preselectionChange</code> | 목록에서 키보드 / 마우스로 지나갈 때 |
| <code>show</code> / <code>hide</code> | 목록 열림 / 닫힘 |
| <code>uncommittedChange</code> | 검색 입력 중 |

`icon` 에 점(`.`)이 없는 문자열을 주면 `{ iconName: ... }` 로 바뀝니다.

## Label

상태 표시용 칩입니다.

```js
var chip = new Label({ value: '승인', emphasize: 'success', appearance: 'closeable-chip' }).inject(el);
chip.addEventListener('close', function () { chip.destroy(); });
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | <code>''</code> | 글자 |
| <code>emphasize</code> | <code>'secondary'</code> | 색 |
| <code>appearance</code> | <code>'chip'</code> | <code>chip</code>, <code>closeable-chip</code> (닫기 아이콘, <code>close</code> 이벤트) |
| <code>maxDisplayLength</code> | <code>50</code> | 넘으면 <code>...</code> 로 자름 |
| <code>icon</code> | <code>''</code> | 아이콘 |

## Expander

제목을 눌러 펼치고 접는 영역입니다.

```js
var body = UWA.createElement('div', { text: '상세 속성 ...' });
var exp = new Expander({ header: '상세', body: body, expandedFlag: true }).inject(el);
exp.addEventListener('collapse', function () { console.log('접힘'); });
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>header</code> | <code>''</code> | 제목 글자 |
| <code>body</code> | - | 내용 요소 |
| <code>expandedFlag</code> | <code>false</code> | 펼침 여부 |
| <code>style</code> | <code>'filled-separate'</code> | CSS 에 있는 값: <code>filled-separate</code>, <code>filled-group</code>, <code>simple</code> |
| <code>interactiveFlag</code> | <code>true</code> | <code>false</code> 면 눌러도 안 접힘 |

메서드: `expand()`, `close()`, `toggle()`. 이벤트: `expand`, `collapse`.

## Popup

다른 요소 옆에 띄우는 떠 있는 상자입니다. 드롭다운 패널, 간단한 설정 창에 씁니다.

```js
var btn = new Button({ label: '필터' }).inject(el);
var box = UWA.createElement('div', { text: '필터 내용', styles: { padding: 8 } });

var popup = new Popup({ target: btn.getContent(), trigger: 'click', position: 'bottom' });
popup.setBody(box);
popup.addEventListener('hide', function () { console.log('닫힘'); });
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>target</code> | <code>null</code> | 기준 요소 |
| <code>trigger</code> | <code>''</code> | 여는 조작. 공백으로 여러 개: <code>click</code>, <code>hover</code>, <code>focus</code>, <code>mousePress</code> |
| <code>position</code> | <code>'right'</code> | <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code> |
| <code>autoHide</code> | <code>true</code> | 바깥을 누르면 닫힘 |
| <code>visibleFlag</code> | <code>false</code> | 표시 여부 |

메서드: `setBody(el)`, `getBody()`, `show()`, `hide()`, `toggle()`. 이벤트: `show`, `hide`.

## ProgressBar

```js
var bar = new ProgressBar({ value: 0, emphasize: 'success' }).inject(el);
bar.value = 40;
bar.infiniteFlag = true;   // 끝을 모를 때
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>value</code> | <code>0</code> | 0 ~ 100 |
| <code>shape</code> | <code>'linear'</code> | <code>linear</code>, <code>circular</code> |
| <code>emphasize</code> | <code>'info'</code> | 색 |
| <code>statusFlag</code> | <code>true</code> | 퍼센트 글자 표시 |
| <code>infiniteFlag</code> | <code>false</code> | 끝없이 움직이는 막대 |

## Loader, ModalLoader

영역을 가리고 "불러오는 중" 을 띄웁니다. 직접 `Loader` 를 쓰기보다 `ModalLoader` 의 함수 두 개를 씁니다.

```js
require(['DS/Controls/ModalLoader'], function (ModalLoader) {
  var area = document.getElementById('grid');   // position 이 static 이면 안 됨

  ModalLoader.displayModalLoader(area, '저장 중...');
  save().then(function () {
    ModalLoader.removeModalLoader(area, '저장 중...');
  });
});
```

| 함수 | 설명 |
| --- | --- |
| `displayModalLoader(el, text?, callback?)` | 가리개 표시. `text` 생략 시 번역된 "Loading". 여러 번 부르면 횟수를 셈 |
| `removeModalLoader(el, text?)` | 하나 줄임. 0 이 되면 가리개 제거 |

::: warning 같은 글자로 지웁니다
`removeModalLoader` 는 `displayModalLoader` 에 준 **같은 글자** 를 찾아서 하나 줄입니다. 글자가 다르면 아무것도 하지 않아 가리개가 남습니다. `display(el, '저장 중')` → `remove(el)` 처럼 한쪽만 생략해도 남습니다.
:::

::: warning 위치가 정해진 요소에만 붙습니다
`ModalContainer.createModal` 이 `position: static` 요소에 대해 `The given container is not positionned...` 예외를 던집니다. 대상 요소에 `position: relative` 를 줍니다.
:::

`Loader` 를 직접 쓸 때는 `new Loader({ text })` 로 만들고 `on(text)` / `off(text)` 로 켜고 끕니다. `update(40)` 을 부르면 진행률 막대가 나옵니다. 전체 화면을 가리는 다른 방법은 [UIKIT Mask](/controls/uikit#mask) 입니다.

## 컨트롤 직접 만들기

`Abstract.inherit` 으로 같은 규칙(속성, 이벤트)을 따르는 컨트롤을 만듭니다. 실제 코드(DELWebCommonControls 의 FormV2)도 이 방식입니다.

```js
require(['UWA/Core', 'DS/Controls/Abstract'], function (UWA, Abstract) {
  var PartBadge = Abstract.inherit({
    name: 'partBadge',
    publishedProperties: {
      partNo: { defaultValue: '', type: 'string' },
      state: { defaultValue: 'WIP', type: 'string' }
    },
    buildView: function () {
      this._parent();
      this.elements.text = UWA.createElement('span').inject(this.elements.container);
    },
    _applyProperties: function (oldValues) {
      this._parent(oldValues);
      if (this.isDirty('partNo') || this.isDirty('state')) {
        this.elements.text.setText(this.partNo + ' (' + this.state + ')');
      }
    }
  });

  var badge = new PartBadge({ partNo: 'PRT-0001' }).inject(document.body);
  badge.state = 'RELEASED';
  badge.fire('change');
});
```

- `publishedProperties` 키마다 속성 getter / setter 가 생깁니다. 값을 넣으면 `_apply키이름(old, new)` 이 있으면 그것을, 없으면 `_applyProperties({ 키: old })` 를 부릅니다.
- 처음 만들 때는 모든 키가 `isDirty` 상태로 `_applyProperties` 가 한 번 불립니다.
- `this.elements.container` 는 `Abstract` 가 만들어 둔 `div.wux-controls-abstract` 입니다.
- 이벤트는 `this.fire('이름', options)` 로 냅니다. 받는 쪽은 `addEventListener` 입니다.
