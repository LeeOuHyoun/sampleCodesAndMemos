# 알림 메시지 (Notifications) <Badge type="info" text="원본 분석" />

"저장했습니다", "권한이 없습니다" 처럼 화면 오른쪽 위에 잠깐 떴다 사라지는 알림입니다. 메시지를 **보관하는 쪽** 과 **화면에 그리는 쪽** 이 나뉘어 있어서 둘을 한 번 연결해야 보입니다.

샘플: [03_feedback.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/ControlsSample/03_feedback.html)

::: info 근거
Notifications.js 의 NotificationsManagerAbstract (addNotif, modifyNotif, 이력 200 건), NotificationsManagerMessages (_completeOptions), NotificationsManagerUXMessages, NotificationsManagerViewOnScreenInstance (setNotificationManager, 표시 / 사라짐 타이머, 쌓기), NotificationsManagerViewOnScreen. CoreBase.js 의 WUXNotificationsOnScreenFadeOutPolicy. Core/wux.css 의 `.wux-notification-screen`. 호출부: CAT3DWInfraUI, CfgBaseUX. `level: "error"` 767 건, `"success"` 177 건, `"info"` 140 건, `"warning"` 136 건
:::

## 기본 사용

```js
require([
  'DS/Notifications/NotificationsManagerUXMessages',
  'DS/Notifications/NotificationsManagerViewOnScreen'
], function (UXMessages, ViewOnScreen) {
  ViewOnScreen.setNotificationManager(UXMessages);

  UXMessages.addNotif({ level: 'success', message: '저장했습니다.' });
  UXMessages.addNotif({ level: 'error', title: '저장 실패', message: '권한이 없습니다.' });
});
```

| 모듈 | 하는 일 |
| --- | --- |
| `NotificationsManagerUXMessages` | 메시지 보관 (싱글턴). `addNotif` 로 넣음 |
| `NotificationsManagerViewOnScreen` | 화면에 그림 (싱글턴). `document.body` 에 `ul.wux-notification-screen` 을 붙여 둠 |

::: warning setNotificationManager 를 부르지 않으면 아무것도 안 보입니다
`ViewOnScreen` 은 처음에 연결된 관리자가 없습니다. `addNotif` 만 부르면 이력에만 쌓이고 화면에는 나오지 않습니다. 앱 시작 때 `ViewOnScreen.setNotificationManager(UXMessages)` 를 한 번 부릅니다. 같은 관리자로 다시 불러도 문제없습니다.
:::

두 모듈 모두 모듈 안에서 객체를 하나만 만들어 돌려줍니다. 같은 페이지(프레임)에서 다른 코드가 이미 연결하고 `setFadeOutPolicy` 등을 바꿔 두었으면 그 설정을 함께 씁니다.

## addNotif 옵션

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>level</code> | <code>'info'</code> | <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code> |
| <code>title</code> | <code>''</code> | 굵은 제목 |
| <code>subtitle</code> | <code>''</code> | 부제목 |
| <code>message</code> | <code>''</code> | 본문 |
| <code>sticky</code> | <code>false</code> | <code>true</code> 면 자동으로 사라지지 않음 |
| <code>category</code> | <code>''</code> | 분류. 거르기, 일괄 삭제에 씀 |
| <code>action</code> | - | <code>{ label, callback }</code>. 알림 안에 버튼 |
| <code>allowUnsafeHTML</code> | <code>true</code> | <code>title</code> / <code>subtitle</code> / <code>message</code> 를 HTML 로 해석 |
| <code>helpResources</code> | <code>{}</code> | 도움말 링크 정보 |

`addNotif` 는 알림 번호(1 부터 늘어나는 숫자)를 돌려줍니다.

| level | 아이콘 | 사라지는 방식 |
| --- | --- | --- |
| `info` | `wux-ui-3ds-info` | 일정 시간 뒤 사라짐 |
| `success` | `wux-ui-3ds-check` | 일정 시간 뒤 사라짐 |
| `warning` | `wux-ui-3ds-attention` | 일정 시간 뒤 흐려짐 (`ghost`). 화면에는 남음 |
| `error` | `wux-ui-3ds-error` | 사라지지 않음. 알림을 눌러야 닫힘 |

`level` 은 위 네 가지만 씁니다. 호출부에 `'warn'`, `'fatal'` 같은 값도 있지만 아이콘과 사라짐 처리가 없습니다.

::: danger 기본값이 HTML 해석입니다
`allowUnsafeHTML` 을 빼면 `true` 로 채워집니다. 서버 오류 메시지나 사용자가 입력한 품명을 그대로 넣으면 HTML 로 들어갑니다. 바깥에서 온 글자는 `allowUnsafeHTML: false` 를 함께 줍니다.

```js
UXMessages.addNotif({ level: 'error', title: '저장 실패', message: serverMessage, allowUnsafeHTML: false });
```
:::

### 버튼이 있는 알림

```js
UXMessages.addNotif({
  level: 'info',
  message: '새 버전이 있습니다.',
  sticky: true,
  action: { label: '새로고침', callback: function () { location.reload(); } }
});
```

## 사라지는 시간

`ViewOnScreen.setFadeOutPolicy(값)` 으로 바꿉니다. 모든 알림에 함께 적용됩니다.

| 값 | 시간 |
| --- | --- |
| `WUXNotificationsOnScreenFadeOutPolicy.Fast` | 2.5 초 |
| `WUXNotificationsOnScreenFadeOutPolicy.Medium` (기본) | 5 초 |
| `WUXNotificationsOnScreenFadeOutPolicy.Slow` | 10 초 |

`WUXNotificationsOnScreenFadeOutPolicy` 는 전역(`window`)에 있습니다.

- 알림 위에 마우스를 올리면 타이머가 멈추고, 내리면 위 시간의 절반 뒤에 사라집니다.
- 알림을 누르면(닫기 버튼이 아니어도) 바로 사라집니다. `error` 도 이렇게 닫습니다.

## 지우기, 바꾸기

```js
var id = UXMessages.addNotif({ level: 'info', message: '업로드 중... 0%', sticky: true });
UXMessages.modifyNotif(id, { level: 'info', message: '업로드 중... 60%', sticky: true });
UXMessages.modifyNotif(id, { level: 'success', message: '업로드 완료' });

ViewOnScreen.removeNotification(id);
ViewOnScreen.removeNotifications('upload');          // category 로
ViewOnScreen.removeNotifications(null, 'error');     // level 로
ViewOnScreen.removeNotifications();                  // 전부
```

| 함수 | 설명 |
| --- | --- |
| `UXMessages.modifyNotif(id, options)` | 내용 바꾸기. `options` 는 빠진 키가 기본값으로 채워지므로 필요한 키를 모두 넣음 |
| `ViewOnScreen.removeNotification(id)` | 하나 지우기 |
| `ViewOnScreen.removeNotifications(category?, level?)` | 조건으로 지우기. 인자가 없으면 전부 |
| `ViewOnScreen.removeLastNotificationDisplayed()` | 마지막 것 지우기 |

## 화면 설정 (ViewOnScreen)

| 함수 | 설명 |
| --- | --- |
| `setNotificationManager(mgr)` | 연결 |
| `inject(el)` | 알림 영역을 다른 요소 안으로 옮김 (기본 `document.body`) |
| `setFadeOutPolicy(v)` / `getFadeOutPolicy()` | 사라지는 시간 |
| `setFilterDisplayedNotification(category)` | 이 `category` 만 표시. `''` 이면 전부 |
| `setStackingPolicy(bits)` | 같은 알림 묶어 쌓기. 1 `level`, 2 `category`, 4 `title`, 8 `subtitle` 이 같으면 묶음 (예: 9 = level + subtitle). 0 (기본) 은 묶지 않음 |
| `setRemoveStackOnFirstTimeoutFlag(b)` | 묶음 전체를 첫 시간 초과 때 지움 |
| `slide({ right })` / `restorePosition()` | 알림 영역을 옆으로 밀기 / 되돌리기 |

알림 영역은 `.wux-notification-screen { position: absolute; top: 10px; right: 10px; z-index: 1000 }` 입니다. 모달 가리개(`z-index: 40000`) 아래에 깔리므로 모달 다이얼로그가 열려 있으면 가려집니다.

## 이력

`UXMessages` 는 최근 200 건을 `TreeDocument` 로 보관합니다.

| 함수 | 설명 |
| --- | --- |
| `getHistory()` | 이력 `TreeDocument` |
| `getNotifOptions(id)` | 그 알림의 마지막 옵션 |
| `getLastNthNotificationAdded(n)` | 뒤에서 n 번째 |
| `setLengthHistory(n)` / `getLengthHistory()` | 보관 수 |
| `suscribeToNotificationAdded(fn)` / `unsuscribeToNotificationAdded(token)` | 추가될 때 알림받기 (철자가 `suscribe`) |
| `suscribeToNotificationModified(fn)` / `unsuscribeToNotificationModified(token)` | 바뀔 때 |

## UIKIT Alert 와 비교

| | Notifications | UIKIT Alert |
| --- | --- | --- |
| 위치 | 화면 오른쪽 위 (body) | 붙인 요소 위쪽 |
| 준비 | `setNotificationManager` 한 번 | `new Alert({ visible: true }).inject(el)` |
| 종류 | `level` | `className` |
| 사라짐 | level 별 자동 (error 는 남음) | `autoHide` 옵션, 모두 같은 시간 |
| 이력 | 있음 | 없음 |

위젯 영역 안에만 띄워야 하면 UIKIT [Alert](/controls/uikit#alert) 가, 앱 전체의 알림이면 Notifications 가 맞습니다.
