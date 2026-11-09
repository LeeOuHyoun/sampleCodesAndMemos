---
title: Windows API
---

# Windows API

`DS/Windows/*` 의 Window, Dialog, Panel, ImmersiveFrame 속성, 메서드, 이벤트와 열거형입니다. 사용법은 [다이얼로그](/controls/dialog) 에 있습니다.

```js
var dlg = new Dialog({ title: '승인', content: el, modalFlag: true, buttons: { Ok: new Button({ onClick: function (e) { e.dsModel.dialog.close(); } }) } });
dlg.addEventListener('close', function () { console.log('닫힘'); });
```

::: info 근거
Windows.js 의 Window, Dialog, Panel, ImmersiveFrame publishedProperties / prototype / `fire("...")`. CoreBase.js 의 WebUXGlobalEnums (WUXStandardButtonEnum, WUXStandardButtonRoleEnum, WUXCustomButtonRoleEnum, WUXDockAreaEnum). 2026 은 enovia2026_webapps 의 같은 파일
:::

상속 관계는 `Abstract` → `Window` → `Dialog` / `Panel` 입니다. `ImmersiveFrame` 은 `Abstract` 를 바로 상속합니다. 모든 클래스는 [Abstract](/controls/api/webux-controls#abstract) 의 속성(`disabled`, `visibleFlag` ...)도 가집니다.

## Window

Dialog 와 Panel 이 물려받는 속성입니다. `Window` 를 직접 만드는 일은 드뭅니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>title</code> | <code>string</code> | <code>''</code> | 제목 |
| <code>icon</code> | <code>object</code> | <code>''</code> | 제목 아이콘 |
| <code>header</code> | <code>object</code> | <code>null</code> | 제목줄 아래 요소 |
| <code>content</code> | <code>object</code> | <code>null</code> | 내용 (요소 / 문자열은 HTML) |
| <code>immersiveFrame</code> | <code>object</code> | <code>null</code> | 담을 ImmersiveFrame |
| <code>position</code> | <code>object</code> | - | <code>{ my, at, of, offsetX, offsetY, collision }</code> |
| <code>activeFlag</code> | <code>boolean</code> | <code>true</code> | 앞에 있는 창 |
| <code>movableFlag</code> | <code>boolean</code> | <code>true</code> | 끌어서 이동 |
| <code>closeButtonFlag</code> | <code>boolean</code> | <code>true</code> | X 버튼 |
| <code>expandedFlag</code> | <code>boolean</code> | <code>true</code> | 펼침 |
| <code>allowedDockAreas</code> | <code>integer</code> | - | 붙일 수 있는 위치 (비트 합) |
| <code>currentDockArea</code> | <code>integer</code> | - | 붙어 있는 위치 |
| <code>windowGroup</code> | <code>object</code> | <code>null</code> | 묶음 |
| <code>activeSnapArea</code> | <code>integer</code> | - | 스냅 위치 |
| <code>resizableFlag</code> | <code>boolean</code> | <code>false</code> | 크기 조절 |
| <code>width</code> | <code>integer</code> | <code>-1</code> | 너비 px (<code>-1</code> 자동) |
| <code>height</code> | <code>integer</code> | <code>-1</code> | 높이 px (<code>-1</code> 자동) |
| <code>minWidth</code> | <code>integer</code> | <code>150</code> | 최소 너비 |
| <code>minHeight</code> | <code>integer</code> | <code>0</code> | 최소 높이 |
| <code>maximizedFlag</code> | <code>boolean</code> | <code>false</code> | 최대화 상태 |
| <code>allowMaximizeFlag</code> | <code>boolean</code> | <code>true</code> | 최대화 허용 |
| <code>maximizeButtonFlag</code> | <code>boolean</code> | <code>false</code> | 최대화 버튼 |
| <code>horizontallyStretchableFlag</code> | <code>boolean</code> | <code>false</code> | 가로로 늘림 |
| <code>verticallyStretchableFlag</code> | <code>boolean</code> | <code>false</code> | 세로로 늘림 |
| <code>autoCloseFlag</code> | <code>boolean</code> | <code>true</code> | <code>close()</code> 때 <code>destroy()</code> |
| <code>titleBarVisibleFlag</code> | <code>boolean</code> | <code>true</code> | 제목줄 표시 |
| <code>usePaddingFlag</code> | <code>boolean</code> | <code>true</code> | 안쪽 여백 |
| <code>ensureHeightDefinitionOnHierarchy</code> | <code>boolean</code> | <code>false</code> | 탭 묶음 안에서 창 높이를 100% 로 (CSS 속성 선택자) |
| <code>activateButtonsIfActionPerformed</code> | <code>boolean</code> | <code>true</code> | Enter / Esc 가 이미 처리된 경우에도 버튼 실행 |
| <code>buttons</code> | <code>object</code> | <code>{}</code> | 표준 버튼 <code>{ Ok: Button, ... }</code> |
| <code>onContextualEvent</code> | <code>function</code> | 함수 | 제목줄 오른쪽 클릭 메뉴 |
| <code>getDefaultFocusableElement</code> | <code>function</code> | - | 처음 포커스 받을 요소를 돌려주는 함수 |
| <code>titleBarButtons</code> <Badge type="warning" text="2026" /> | <code>Window.TitleBarButtonsEnum</code> | <code>Close</code> (1) | 제목줄 버튼 (TitleBarButtonsEnum 비트 합) |
| <code>informationData</code> <Badge type="warning" text="2026" /> | <code>object</code> | - | 정보 버튼 내용 |
| <code>settingsData</code> <Badge type="warning" text="2026" /> | <code>object</code> | - | 설정 버튼 내용 |
| <code>helpData</code> <Badge type="warning" text="2026" /> | <code>function</code> | - | 도움말 버튼 함수 |

| 메서드 | 설명 |
| --- | --- |
| <code>close()</code> | <code>close</code> 이벤트 후 <code>autoCloseFlag</code> 면 <code>destroy()</code> |
| <code>isBeingClosed()</code> | 닫히는 중인지 |
| <code>destroy()</code> | 정리 (이벤트 없음) |
| <code>bringToFront()</code> | 맨 앞으로 |
| <code>ensureVisible()</code> | 화면 안으로 옮김 |
| <code>getAbsolutePosition()</code> / <code>setAbsolutePosition(pos)</code> | 화면 기준 위치 |
| <code>getTitleBar()</code> | 제목줄 요소 |
| <code>getDefaultButtonLabel(name)</code> | 표준 버튼의 번역된 글자 |
| <code>getBoundingClientRect()</code> | 크기, 위치 |
| <code>getDockedFlag()</code> | 붙어 있는지 |

| 이벤트 | 시점 |
| --- | --- |
| <code>close</code> | <code>close()</code> 또는 X 버튼 |
| <code>visibleStateChange</code> | 표시 상태 변경 |
| <code>contentVisibleStateChange</code> | 내용 표시 상태 변경 |
| <code>activate</code> / <code>deactivate</code> | 앞으로 옴 / 뒤로 감 |
| <code>move</code> | 위치 변경 |
| <code>expand</code> / <code>collapse</code> | 펼침 / 접힘 |
| <code>prePlaceChange</code> / <code>placeChange</code> | 붙는 위치 변경 전 / 후 |
| <code>startWindowDrag</code> / <code>windowDrag</code> / <code>stopWindowDrag</code> | 끌기 |
| <code>settingsStateChange</code> <Badge type="warning" text="2026" /> | 설정 버튼 |
| <code>informationStateChange</code> <Badge type="warning" text="2026" /> | 정보 버튼 |
| <code>helpTrigger</code> <Badge type="warning" text="2026" /> | 도움말 버튼 |

## Dialog

`DS/Windows/Dialog`. Window 속성에 아래가 더해집니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>modalFlag</code> | <code>boolean</code> | <code>false</code> | 뒤를 가리고 막음 |
| <code>checkboxInfos</code> | <code>object</code> | - | 아래쪽 체크박스 <code>{ label, checkFlag }</code> |
| <code>customButtonsDefinition</code> | <code>object</code> | - | Button 옵션 배열 (<code>role</code> 포함) |

| 메서드 | 설명 |
| --- | --- |
| <code>getCustomButtons()</code> | <code>customButtonsDefinition</code> 로 만든 Button 배열 |

- `customButtonsDefinition` 은 `buttons` 가 비어 있을 때만 씁니다. 항목은 Button 옵션에 `role` (`'validate'` / `'escape'`) 을 더한 것입니다.
- `checkboxInfos` 는 `{ label, checkFlag, tooltipInfos }` 입니다. 사용자가 체크하면 `checkFlag` 가 바뀝니다.
- `immersiveFrame` 이 없으면 `document.body` 에 붙고 가운데에 놓입니다.

## Panel

`DS/Windows/Panel`. Window 속성에 아래가 더해집니다.

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>collapsibleFlag</code> | <code>boolean</code> | <code>true</code> | 접기 버튼 |
| <code>snappableFlag</code> | <code>boolean</code> | <code>true</code> | 가장자리에 붙이기 |
| <code>floatableFlag</code> | <code>boolean</code> | <code>true</code> | 떼어서 띄우기 |
| <code>headerPopupContent</code> | <code>Object</code> | - | 제목줄 팝업 내용 |
| <code>pinnedFlag</code> | <code>boolean</code> | <code>false</code> | 고정 |
| <code>showTitleFlag</code> | <code>boolean</code> | <code>true</code> | 제목 표시 |

## ImmersiveFrame

`DS/Windows/ImmersiveFrame`

| 키 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <code>dockingElementsPriority</code> | <code>Array</code> | <code>[null,null,null,null]</code> | 붙는 영역 우선순위. 읽기 전용 |
| <code>reactToPointerEventsFlag</code> | <code>boolean</code> | <code>true</code> | 포인터 이벤트 받음 |
| <code>dockingElementsAutoExpandFlag</code> | <code>boolean</code> | <code>true</code> | 붙는 영역 자동 펼침 |

| 메서드 | 설명 |
| --- | --- |
| <code>addWindow(win)</code> / <code>removeWindow(win)</code> / <code>containsWindow(win)</code> | 창 관리 |
| <code>dockWindow(win, area)</code> / <code>undockWindow(win)</code> | 붙이기 / 떼기 |
| <code>getDockingElement(area)</code> | 붙는 영역 |
| <code>getWindowsInDockingElement(area)</code> | 그 영역의 창 |
| <code>getFreeZone()</code> | 가운데 남는 영역 요소 |
| <code>setContentInBackgroundLayer(el)</code> | 배경 층 내용 |
| <code>destroyAllWindows()</code> / <code>destroyWindows(list)</code> | 창 정리 |
| <code>destroy()</code> | 틀과 안의 창 모두 정리 |

이벤트: <code>addWindow</code>, <code>removeWindow</code>, <code>freeZoneResize</code>

## 열거형

`DS/Windows/*` 또는 `DS/Controls/*` 를 불러오면 전역(`window`)에 생깁니다.

### WUXStandardButtonEnum

`buttons` 의 키 이름입니다. `value` 순서로 표시됩니다.

| 이름 | value | role |
| --- | --- | --- |
| <code>Ok</code> | 1 | AcceptRole |
| <code>Open</code> | 2 | AcceptRole |
| <code>Save</code> | 4 | AcceptRole |
| <code>Apply</code> | 8 | ApplyRole |
| <code>Reset</code> | 16 | ResetRole |
| <code>RestoreDefaults</code> | 32 | ResetRole |
| <code>Help</code> | 64 | HelpRole |
| <code>SaveAll</code> | 128 | AcceptRole |
| <code>Yes</code> | 256 | YesRole |
| <code>YesToAll</code> | 512 | YesRole |
| <code>No</code> | 1024 | NoRole |
| <code>NoToAll</code> | 2048 | NoRole |
| <code>Abort</code> | 4096 | RejectRole |
| <code>Retry</code> | 8192 | AcceptRole |
| <code>Ignore</code> | 16384 | AcceptRole |
| <code>Discard</code> | 32768 | DestructiveRole |
| <code>Cancel</code> | 65536 | RejectRole |
| <code>Close</code> | 131072 | RejectRole |

### WUXStandardButtonRoleEnum

| 역할 | 값 | Dialog 동작 |
| --- | --- | --- |
| <code>AcceptRole</code> | 1 | <code>emphasize: 'primary'</code>, 첫 버튼이 Enter |
| <code>YesRole</code> | 5 | <code>emphasize: 'primary'</code>, 첫 버튼이 Enter |
| <code>RejectRole</code> | 2 | 첫 버튼이 Esc |
| <code>NoRole</code> | 6 | 첫 버튼이 Esc |
| <code>DestructiveRole</code>, <code>HelpRole</code>, <code>ApplyRole</code>, <code>ResetRole</code> | 3, 4, 7, 8 | 키 연결 없음 |

### WUXCustomButtonRoleEnum

| 이름 | 값 |
| --- | --- |
| <code>Validate</code> | <code>'validate'</code> |
| <code>Escape</code> | <code>'escape'</code> |

### WUXDockAreaEnum

| 이름 | 값 |
| --- | --- |
| <code>NoneDockArea</code> | 0 |
| <code>TopDockArea</code> | 1 |
| <code>BottomDockArea</code> | 2 |
| <code>LeftDockArea</code> | 4 |
| <code>RightDockArea</code> | 8 |

### TitleBarButtonsEnum <Badge type="warning" text="2026" />

2026 의 `titleBarButtons` 값입니다 (비트 합). 전역이 아니라 `DS/Windows/Window` 클래스의 `Window.TitleBarButtonsEnum` 에 있습니다.

| 이름 | 값 |
| --- | --- |
| <code>None</code> | 0 |
| <code>Close</code> | 1 |
| <code>Maximize</code> | 2 |
| <code>Settings</code> | 8 |
| <code>Information</code> | 16 |
| <code>Help</code> | 32 |
