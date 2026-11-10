# 화면 컨트롤 개요 <Badge type="info" text="원본 분석" />

버튼, 입력칸, 다이얼로그, 로딩 표시, 알림 메시지처럼 화면을 이루는 부품입니다. ENOVIA 에는 같은 일을 하는 부품이 **두 계열** 있습니다.

| 계열 | 모듈 | 모양 | 만드는 방식 |
| --- | --- | --- | --- |
| WebUX | `DS/Controls/*`, `DS/Windows/*`, `DS/Notifications/*` | `wux-` 로 시작하는 클래스 | `new Button({ label })` 후 `btn.label = ...` 처럼 속성으로 다룸 |
| UIKIT | `DS/UIKIT/*` | Bootstrap 과 비슷한 클래스 (`btn`, `form-control`, `modal`) | `new Button({ value })` 후 `btn.setValue(...)` 처럼 메서드로 다룸 |

샘플: [ControlsSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/ControlsSample)

::: info 근거
Controls.js (Abstract, Button ...), Windows.js (Window, Dialog), UIKIT.js (Input, Modal, Mask ...), Notifications.js, Core.js 의 BaseComponent, UWA2/js/Controls/Abstract.js. 참조 파일 수: `DS/Controls/` 469, `DS/UIKIT/` 400, `DS/Windows/` 207, `DS/Notifications/` 119 (두 계열을 함께 쓰는 파일 175). DataGridView.js, Tweakers.js 는 `DS/Controls/*` 만 씁니다.
:::

## 무엇을 쓸까

| 하고 싶은 일 | 권장 | 대안 (UIKIT) | 문서 |
| --- | --- | --- | --- |
| 버튼 | `DS/Controls/Button` | `DS/UIKIT/Input/Button` | [WebUX 컨트롤](/controls/webux-controls#button) |
| 체크박스, 스위치, 라디오 | `DS/Controls/Toggle` | `DS/UIKIT/Input/Toggle` | [WebUX 컨트롤](/controls/webux-controls#toggle) |
| 한 줄 / 여러 줄 입력 | `DS/Controls/LineEditor`, `Editor` | `DS/UIKIT/Input/Text` | [WebUX 컨트롤](/controls/webux-controls#lineeditor-editor) |
| 선택 목록 | `DS/Controls/ComboBox` | `DS/UIKIT/Input/Select` | [WebUX 컨트롤](/controls/webux-controls#combobox) |
| 모달 다이얼로그 | `DS/Windows/Dialog` | `DS/UIKIT/Modal`, `SuperModal` | [다이얼로그](/controls/dialog) |
| 확인 / 취소 묻기 | `DS/Windows/Dialog` + 버튼 2개 | `SuperModal.confirm` | [다이얼로그](/controls/dialog#확인-취소-묻기) |
| 로딩 가리개 | `DS/Controls/ModalLoader` | `DS/UIKIT/Mask` | [WebUX 컨트롤](/controls/webux-controls#loader-modalloader), [UIKIT](/controls/uikit#mask) |
| 저장 완료 같은 짧은 알림 | `DS/Notifications/*` | `DS/UIKIT/Alert` | [알림 메시지](/controls/notifications) |
| 툴팁 | 컨트롤의 `tooltipInfos` | `DS/UIKIT/Tooltip` | [WebUX 컨트롤](/controls/webux-controls#툴팁) |
| 값을 편집하는 입력칸 (그리드와 같은 모양) | Tweakers | - | [편집기 단독 사용](/tweakers/standalone) |

정리하면 아래와 같습니다.

- **새로 만드는 화면은 WebUX 를 씁니다.** DataGridView, Tweakers, Dialog 가 모두 WebUX 컨트롤로 만들어져 있어 모양과 동작(포커스, 터치 모드, 툴팁)이 맞습니다.
- UIKIT 은 UWA 컨트롤(`UWA/Controls/Abstract`) 위에 만든 예전 계열로 보입니다. <Badge type="danger" text="검증 필요" /> 2026 에서도 남아 있지만 바뀐 것은 `rounded` 옵션, `Input/IconButton` 추가 정도입니다. WebUX 쪽은 2026 에서 코드가 ES 클래스로 다시 빌드되었고 속성도 늘었습니다.
- UIKIT 의 `Mask` 와 `Alert` 는 한 줄로 끝나서 지금도 많이 쓰입니다 (`Mask` 참조 668). 기존 코드를 고칠 때는 그 화면이 쓰는 계열을 따릅니다.

::: tip Tweakers 와의 관계
Tweakers(`TweakerString` ...)는 `LineEditor`, `ComboBox`, `Toggle` 같은 WebUX 컨트롤을 감싸서 "값 타입별 편집기" 로 만든 것입니다. 값 타입(문자열, 숫자, 날짜, 목록)이 정해진 입력칸이면 Tweakers 가 더 편합니다. 버튼, 다이얼로그, 자유로운 화면 조립은 이 문서의 컨트롤을 씁니다.
:::

## 두 계열의 차이

같은 "버튼" 이라도 쓰는 법이 다릅니다. 섞어 쓰면 가장 많이 틀리는 부분입니다.

| | WebUX (`DS/Controls/Button`) | UIKIT (`DS/UIKIT/Input/Button`) |
| --- | --- | --- |
| 글자 | `label: '저장'` | `value: '저장'` |
| 강조 | `emphasize: 'primary'` | `className: 'primary'` (`btn-primary` 로 바뀜) |
| 아이콘 | `icon: { iconName: 'floppy', fontIconFamily: WUXManagedFontIcons.Font3DS }` | `icon: 'floppy'` (`fonticon-floppy` 로 바뀜) |
| 클릭 | `onClick: fn` 또는 `addEventListener('buttonclick', fn)` | `events: { onClick: fn }` 또는 `addEvent('onClick', fn)` |
| 핸들러 인자 | 브라우저 이벤트. `e.dsModel` 이 버튼 | 브라우저 이벤트 |
| 값 바꾸기 | `btn.label = '수정'` | `btn.setValue('수정')` |
| 비활성 | `btn.disabled = true` | `btn.setDisabled(true)` / `btn.disable()` |
| 붙이기 / 정리 | `inject(el)` / `destroy()` | `inject(el)` / `destroy()` |

```js
require(['DS/Controls/Button', 'DS/UIKIT/Input/Button'], function (WUXButton, UIKITButton) {
  /* WebUX */
  new WUXButton({ label: '저장', emphasize: 'primary', onClick: function (e) { console.log(e.dsModel.label); } })
    .inject(document.getElementById('a'));

  /* UIKIT */
  new UIKITButton({ value: '저장', className: 'primary', events: { onClick: function () { console.log('click'); } } })
    .inject(document.getElementById('b'));
});
```

::: warning 모르는 키는 오류 없이 무시됩니다
- WebUX: 생성자 옵션 중 `publishedProperties` 에 있는 키만 반영됩니다. 대소문자도 맞아야 합니다. 실제 코드에도 `new ProgressBar({ visibleflag: true, statusflag: true })` 처럼 소문자로 써서 효과가 없는 사례가 있습니다.
- UIKIT: 옵션은 `this.options` 에 그대로 들어가므로 오타도 저장만 되고 아무 일도 일어나지 않습니다.

넣을 수 있는 키는 [WebUX 컨트롤 API](/controls/api/webux-controls), [UIKIT API](/controls/api/uikit) 에 있습니다.
:::

## 불러오기와 CSS

| 계열 | CSS |
| --- | --- |
| WebUX (`DS/Controls`, `DS/Windows`, `DS/Notifications`) | `DS/Core/Core`, `DS/Controls/ModalContainer` 가 `css!DS/Core/wux.css` 를 불러옵니다. 어떤 모듈을 불렀는지에 따라 늦게 붙거나 빠질 수 있으므로 단독 HTML 에서는 `Core/wux.css` 를 직접 겁니다. Windows, Notifications 의 모양도 이 파일에 있습니다. |
| UIKIT | 스스로 CSS 를 불러오지 않습니다. 위젯 밖 단독 HTML 에서는 `UIKIT/UIKIT.css` 를 직접 겁니다. |

```html
<link rel="stylesheet" type="text/css" href="../Core/wux.css" />
<link rel="stylesheet" type="text/css" href="../UIKIT/UIKIT.css" />
<script type="text/javascript" src="../AmdLoader/AmdLoader.js"></script>
```

## 모듈별 참조 수

webapps 2025 전체에서 모듈 이름이 나오는 횟수입니다. 많이 쓰는 것부터 익히면 기존 코드를 읽기 쉽습니다.

| WebUX | 참조 | UIKIT | 참조 |
| --- | --- | --- | --- |
| `DS/Controls/Button` | 706 | `DS/UIKIT/Mask` | 668 |
| `DS/Windows/Dialog` | 347 | `DS/UIKIT/Input/Button` | 566 |
| `DS/Windows/ImmersiveFrame` | 294 | `DS/UIKIT/Tooltip` | 358 |
| `DS/Controls/Toggle` | 281 | `DS/UIKIT/Alert` | 273 |
| `DS/Controls/TooltipModel` | 281 | `DS/UIKIT/Modal` | 217 |
| `DS/Controls/ComboBox` | 226 | `DS/UIKIT/Input/Text` | 207 |
| `DS/Controls/LineEditor` | 202 | `DS/UIKIT/Input/Toggle` | 196 |
| `DS/Notifications/NotificationsManagerUXMessages` | 163 | `DS/UIKIT/Spinner` | 193 |
| `DS/Notifications/NotificationsManagerViewOnScreen` | 160 | `DS/UIKIT/Scroller` | 180 |
| `DS/Controls/Loader` | 152 | `DS/UIKIT/DropdownMenu` | 165 |
| `DS/Controls/Abstract` | 150 | `DS/UIKIT/SuperModal` | 145 |
| `DS/Controls/ButtonGroup` | 112 | `DS/UIKIT/Input/Select` | 125 |
| `DS/Windows/Panel` | 85 | `DS/UIKIT/Form` | 89 |
| `DS/Controls/ModalContainer` | 80 | `DS/UIKIT/Iconbar` | 77 |
| `DS/Controls/ProgressBar` | 76 | `DS/UIKIT/Popover` | 74 |
| `DS/Controls/Editor` | 75 | | |
| `DS/Controls/Label`, `Popup`, `Expander` | 69, 68, 66 | | |

::: warning DS/Controls/TooltipModel 은 쓰지 않습니다
`DS/Controls/TooltipModel` 은 불러올 때마다 콘솔에 `'DS/Controls/TooltipModel' is deprecated, use 'DS/Core/TooltipModel' instead.` 오류를 찍고 `DS/Core/TooltipModel` 을 그대로 돌려줍니다 (2025, 2026 동일). 새 코드는 `DS/Core/TooltipModel` 을 쓰거나, 아예 `tooltipInfos: { shortHelp: '...' }` 처럼 일반 객체를 넘깁니다.
:::

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [WebUX 컨트롤](/controls/webux-controls) | 공통 사용법, Button, Toggle, ButtonGroup, LineEditor, Editor, ComboBox, Label, Expander, Popup, ProgressBar, Loader |
| [다이얼로그](/controls/dialog) | Dialog 열기 / 닫기, 표준 버튼, ImmersiveFrame, Panel |
| [UIKIT](/controls/uikit) | Mask, Button, Text, Toggle, Select, Alert, Modal, SuperModal, Tooltip, Popover, Spinner, Scroller, DropdownMenu, Iconbar, Form |
| [알림 메시지](/controls/notifications) | 화면 오른쪽 위에 뜨는 알림 (Notifications) |
| [WebUX 컨트롤 API](/controls/api/webux-controls) | 컨트롤별 속성, 기본값, 이벤트 |
| [Windows API](/controls/api/windows) | Window, Dialog, Panel, ImmersiveFrame 속성, 메서드, 이벤트, 열거형 |
| [UIKIT API](/controls/api/uikit) | UIKIT 모듈별 옵션, 메서드, 이벤트 |
