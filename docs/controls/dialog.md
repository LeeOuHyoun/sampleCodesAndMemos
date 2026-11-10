# 다이얼로그 (Windows) <Badge type="info" text="원본 분석" />

`DS/Windows/Dialog` 로 제목, 내용, 아래쪽 버튼이 있는 창을 띄웁니다. `modalFlag: true` 면 뒤 화면을 어둡게 가리고 막습니다. 같은 모듈 묶음에 패널(`Panel`)과 창을 담는 틀(`ImmersiveFrame`)이 있습니다.

샘플: [02_dialog.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/ControlsSample/02_dialog.html)

::: info 근거
Windows.js 의 Window (publishedProperties, _applyButtons, getDefaultButtonLabel, close, keydown / keyup 처리), Dialog (_applyButtons, _applyCustomButtonsDefinition, _applyCheckboxInfos, _applyModalFlag, _getDefaultPosition), Panel, ImmersiveFrame. CoreBase.js 의 WUXStandardButtonEnum, WUXStandardButtonRoleEnum, WUXCustomButtonRoleEnum. Windows_ko.js 의 번역. 호출부: AuthGenericCommands (AuthGenericDlgProgressbar), DELWebCommonControls (FormV2), CAT3DAnnotationBaseCmds. `e.dsModel.dialog.close()` 111 건
:::

## 모달 다이얼로그 열기

```js
require(['UWA/Core', 'DS/Windows/Dialog', 'DS/Controls/Button'], function (UWA, Dialog, Button) {
  var body = UWA.createElement('div', { styles: { padding: 12 }, text: '선택한 부품 3건을 승인합니다.' });

  var dlg = new Dialog({
    title: '승인',
    content: body,
    modalFlag: true,
    width: 400,
    buttons: {
      Ok: new Button({
        onClick: function (e) {
          console.log('승인 처리');
          e.dsModel.dialog.close();
        }
      }),
      Cancel: new Button({
        onClick: function (e) { e.dsModel.dialog.close(); }
      })
    }
  });

  dlg.addEventListener('close', function () { console.log('닫힘'); });
});
```

- **만들면 바로 보입니다.** `inject` 를 부르지 않아도 `document.body` 에 붙습니다 (`immersiveFrame` 을 주면 그 안에 붙음).
- 위치를 주지 않으면 화면(또는 ImmersiveFrame) 가운데에 놓입니다.
- `content` 는 요소, WebUX 컨트롤의 화면 요소, 문자열을 받습니다. 문자열은 HTML 로 해석되므로 사용자 입력은 요소의 `text` 로 넣습니다.

## 버튼 (buttons)

`buttons` 객체의 **키 이름이 버튼 종류** 입니다. 값에는 `DS/Controls/Button` 을 넣습니다.

| 키 | 기본 글자 (ko) | 역할 | Enter / Esc |
| --- | --- | --- | --- |
| `Ok` | 확인 | Accept | Enter |
| `Open` | 열기 | Accept | Enter |
| `Save` | 저장 | Accept | Enter |
| `SaveAll` | 모두 저장 | Accept | Enter |
| `Retry` | 재시도 | Accept | Enter |
| `Ignore` | 무시 | Accept | Enter |
| `Yes` / `YesToAll` | 예 / 모두 예 | Yes | Enter |
| `No` / `NoToAll` | 아니요 / 모두 아니요 | No | Esc |
| `Cancel` | 취소 | Reject | Esc |
| `Abort` | 중단 | Reject | Esc |
| `Close` | 닫기 | Reject | Esc |
| `Apply` | 적용 | Apply | - |
| `Reset` / `RestoreDefaults` | 재설정 / 기본값 복원 | Reset | - |
| `Discard` | 취소 | Destructive | - |
| `Help` | 도움말 | Help | - |

- 버튼에 `label` 이 없으면 위 글자가 들어갑니다. 원하는 글자는 `new Button({ label: '승인' })` 처럼 줍니다.
- Dialog 가 `emphasize` 를 정합니다. Accept / Yes 역할은 `primary`, 나머지는 `secondary` 입니다. 버튼에 준 `emphasize` 는 덮어써집니다.
- 표시 순서는 넣은 순서가 아니라 위 열거형 값 순서입니다 (`Ok` 가 항상 `Cancel` 앞).
- 역할별 첫 버튼이 Enter / Esc 키에 연결됩니다. 키를 누르면 그 버튼을 클릭한 것과 같습니다.
- 버튼마다 `dialog` 속성이 붙습니다. 핸들러에서 `e.dsModel.dialog` 로 다이얼로그를 얻습니다.
- 목록에 없는 키(`Delete` 등)는 `Error in Window : "Delete" is not a valid standard button` 을 콘솔에 찍고 무시됩니다.

::: warning 버튼을 눌러도 저절로 닫히지 않습니다
`Ok`, `Cancel` 을 포함해 모든 버튼은 클릭 이벤트만 냅니다. 닫으려면 핸들러에서 `e.dsModel.dialog.close()` 를 부릅니다. 버튼에 `onClick` 이 없으면 Esc 로 `Cancel` 을 눌러도 아무 일이 없습니다. 오른쪽 위 X 버튼만 스스로 `close()` 를 부릅니다.
:::

비활성으로 만들려면 `dlg.buttons.Ok.disabled = true` 처럼 버튼 속성을 바꿉니다.

### 표준 이름이 아닌 버튼

`buttons` 를 비우고 `customButtonsDefinition` 에 Button 옵션 배열을 줍니다. `role` 로 Enter / Esc 를 정합니다.

```js
var dlg = new Dialog({
  title: '변경 확인',
  content: body,
  modalFlag: true,
  customButtonsDefinition: [
    { label: '저장 후 닫기', emphasize: 'primary', role: 'validate', onClick: function (e) { saveAndClose(e.dsModel.dialog); } },
    { label: '저장 안 함', onClick: function (e) { e.dsModel.dialog.close(); } },
    { label: '돌아가기', role: 'escape', onClick: function (e) { e.dsModel.dialog.close(); } }
  ]
});
```

| `role` | 뜻 |
| --- | --- |
| `'validate'` (`WUXCustomButtonRoleEnum.Validate`) | Enter 키 |
| `'escape'` (`WUXCustomButtonRoleEnum.Escape`) | Esc 키 |

이 방식은 Dialog 가 `emphasize` 를 덮어쓰지 않습니다. 만들어진 버튼은 `dlg.getCustomButtons()` 로 얻습니다.

### 아래쪽 체크박스

```js
var dlg = new Dialog({
  title: '삭제',
  content: '선택한 문서를 삭제합니다.',
  modalFlag: true,
  checkboxInfos: { label: '다시 묻지 않음', checkFlag: false },
  buttons: { Ok: new Button({ onClick: onOk }), Cancel: new Button({ onClick: onCancel }) }
});

function onOk(e) {
  console.log('다시 묻지 않음', dlg.checkboxInfos.checkFlag);
  e.dsModel.dialog.close();
}
```

체크하면 `checkboxInfos.checkFlag` 가 바뀝니다.

## 닫기와 다시 열기

| 방법 | 결과 |
| --- | --- |
| `dlg.close()` | `close` 이벤트 → `autoCloseFlag` 가 `true` (기본) 면 `destroy()` |
| X 버튼 | `close()` 와 같음. `closeButtonFlag: false` 로 숨김 |
| `dlg.visibleFlag = false` | 숨기기만 함. `true` 로 다시 보임 |
| `dlg.destroy()` | `close` 이벤트 없이 정리 |

::: warning 닫은 다이얼로그는 다시 쓰지 않습니다
기본 설정에서는 `close()` 하면 `destroy()` 까지 되어 객체를 다시 쓸 수 없습니다. 같은 창을 여러 번 열려면 열 때마다 새로 만들거나, `autoCloseFlag: false` 로 만들고 `visibleFlag` 로 숨기고 보입니다.
:::

## 자주 쓰는 옵션

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>title</code> | <code>''</code> | 제목 |
| <code>content</code> | <code>null</code> | 내용 |
| <code>modalFlag</code> | <code>false</code> | 뒤 화면을 가리고 막음 |
| <code>buttons</code> | <code>{}</code> | 표준 버튼 |
| <code>width</code> / <code>height</code> | <code>-1</code> | 크기 (px). <code>-1</code> 이면 내용에 맞춤 |
| <code>minWidth</code> / <code>minHeight</code> | <code>150</code> / <code>0</code> | 최소 크기 |
| <code>resizableFlag</code> | <code>false</code> | 오른쪽 아래 끌어서 크기 조절 |
| <code>movableFlag</code> | <code>true</code> | 제목줄을 끌어서 이동 |
| <code>closeButtonFlag</code> | <code>true</code> | X 버튼 |
| <code>maximizeButtonFlag</code> | <code>false</code> | 최대화 버튼 |
| <code>autoCloseFlag</code> | <code>true</code> | <code>close()</code> 때 <code>destroy()</code> |
| <code>immersiveFrame</code> | <code>null</code> | 담을 ImmersiveFrame |
| <code>position</code> | - | <code>{ my: 'center', at: 'center', of: 요소, offsetX: 0, offsetY: 0 }</code> |
| <code>header</code> | <code>null</code> | 제목줄 아래 내용 위에 놓을 요소 |
| <code>titleBarButtons</code> <Badge type="warning" text="2026" /> | <code>Close</code> | 제목줄 버튼 (Close, Maximize, Settings, Information, Help 비트 조합) |

전체 목록은 [Windows API](/controls/api/windows) 에 있습니다.

::: warning className 은 없습니다
실제 코드에 `new Dialog({ className: 'progressBar_dialog', ... })` 가 있지만 Dialog / Window 에 `className` 속성이 없어 무시됩니다. 클래스는 `dlg.getContent().addClassName('...')` 로 붙입니다.
:::

## 이벤트

| 이벤트 | 시점 |
| --- | --- |
| <code>close</code> | <code>close()</code> 또는 X 버튼 (정리 전) |
| <code>visibleStateChange</code> | <code>visibleFlag</code> 변경 |
| <code>activate</code> / <code>deactivate</code> | 맨 앞 창이 됨 / 다른 창이 앞으로 옴 |
| <code>move</code> | 위치 변경 |
| <code>startWindowDrag</code> / <code>windowDrag</code> / <code>stopWindowDrag</code> | 제목줄 끌기 |
| <code>expand</code> / <code>collapse</code> | 펼침 / 접힘 |
| <code>settingsStateChange</code> / <code>informationStateChange</code> / <code>helpTrigger</code> <Badge type="warning" text="2026" /> | 제목줄 설정 / 정보 / 도움말 버튼 |

## 확인 / 취소 묻기

결과를 콜백 하나로 받는 함수로 감싸 두면 편합니다.

```js
function confirmDialog(title, message, callback) {
  var answered = false;
  var dlg = new Dialog({
    title: title,
    content: UWA.createElement('div', { styles: { padding: 12 }, text: message }),
    modalFlag: true,
    buttons: {
      Yes: new Button({ onClick: function (e) { answered = true; e.dsModel.dialog.close(); callback(true); } }),
      No: new Button({ onClick: function (e) { answered = true; e.dsModel.dialog.close(); callback(false); } })
    }
  });
  dlg.addEventListener('close', function () {
    if (!answered) { callback(false); }
  });
}

confirmDialog('삭제', 'PRT-0001 을 삭제할까요?', function (ok) { console.log(ok); });
```

X 버튼으로 닫힌 경우도 `close` 에서 처리합니다. UIKIT 에는 같은 일을 하는 `SuperModal.confirm` 이 있습니다 ([UIKIT](/controls/uikit#supermodal)).

## ImmersiveFrame

다이얼로그와 패널을 담는 틀입니다. 위젯 영역 안에만 창이 뜨게 하거나, 패널을 좌우에 붙이려면 씁니다.

```js
require(['DS/Windows/ImmersiveFrame', 'DS/Windows/Dialog'], function (ImmersiveFrame, Dialog) {
  var frame = new ImmersiveFrame();
  frame.inject(widget.body);   // 부모는 position 이 있고 높이가 있어야 함

  new Dialog({ title: '속성', content: body, immersiveFrame: frame, modalFlag: true });
});
```

- 틀은 `position: absolute; top/left/right/bottom: 0` 으로 부모를 꽉 채웁니다. 부모에 `position: relative` 와 높이를 줍니다.
- `immersiveFrame` 을 준 다이얼로그는 틀의 가운데에 놓이고, 모달 가리개도 틀 안만 가립니다.
- 틀 뒤에 그리드 같은 본 화면을 깔려면 `frame.setContentInBackgroundLayer(el)` 을 씁니다.
- 화면을 닫을 때 `frame.destroy()` 하면 안에 있는 창도 정리됩니다 (`destroyAllWindows()` 는 창만 정리).

| 메서드 | 설명 |
| --- | --- |
| `setContentInBackgroundLayer(el)` | 배경 층에 내용 넣기 |
| `getFreeZone()` | 패널이 붙지 않은 가운데 영역 |
| `addWindow(win)` / `removeWindow(win)` | 창 넣기 / 빼기 (보통 `immersiveFrame` 옵션으로 자동) |
| `getDockingElement(area)` | 좌 / 우 / 위 / 아래 붙는 영역 |
| `destroyAllWindows()` | 안의 창 모두 정리 |

이벤트: `addWindow`, `removeWindow`, `freeZoneResize`.

## Panel

`Window` 를 상속한 패널입니다. ImmersiveFrame 의 좌우 / 아래에 붙이거나 떠 있게 둡니다.

```js
var panel = new Panel({
  title: '속성',
  content: propertyEl,
  immersiveFrame: frame,
  currentDockArea: WUXDockAreaEnum.RightDockArea,
  width: 320
});
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>currentDockArea</code> | - | 붙는 위치. <code>WUXDockAreaEnum</code> 의 <code>NoneDockArea</code> (떠 있음), <code>LeftDockArea</code>, <code>RightDockArea</code>, <code>TopDockArea</code>, <code>BottomDockArea</code> |
| <code>allowedDockAreas</code> | - | 끌어서 붙일 수 있는 위치 (비트 합) |
| <code>collapsibleFlag</code> | <code>true</code> | 접기 버튼 |
| <code>floatableFlag</code> | <code>true</code> | 떼어서 띄우기 |
| <code>pinnedFlag</code> | <code>false</code> | 고정 |
| <code>showTitleFlag</code> | <code>true</code> | 제목 표시 |

`WUXDockAreaEnum`, `WUXStandardButtonEnum` 같은 열거형은 `DS/Windows/*` 를 불러오면 전역(`window`)에 생깁니다.
