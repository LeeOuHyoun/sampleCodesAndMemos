# 이벤트, 선택, 끌어 놓기 개요 <Badge type="info" text="원본 분석" />

화면 코드끼리 신호를 주고받는 방법은 여러 가지입니다. 범위(같은 모듈 안, 같은 창 안, 다른 위젯)에 따라 쓰는 모듈이 다릅니다.

| 모듈 | 참조 횟수 (enovia2025 webapps) | 범위 | 문서 |
| --- | --- | --- | --- |
| `DS/CoreEvents/Events` | 749 건 / 219 파일 | 같은 창(window) 전체에 하나 | [PubSub](/events/pubsub) |
| `DS/CoreEvents/ModelEvents` | 431 건 / 194 파일 | `new` 로 만든 객체마다 따로 | [PubSub](/events/pubsub#modelevents) |
| `DS/Selection/CSOManager` | 267 건 / 98 파일 | 같은 창 안의 "현재 선택" 목록 | [선택](/events/selection) |
| `DS/Selection/HSOManager` | 151 건 / 68 파일 | 같은 창 안의 강조 목록 | [선택](/events/selection) |
| `DS/Selection/PSOManager` | 76 건 / 46 파일 | 같은 창 안의 미리 선택(hover) 목록 | [선택](/events/selection) |
| `DS/DataDragAndDrop/DataDragAndDrop` | 48 건 / 34 파일 | HTML5 끌어 놓기. 위젯(iframe) 사이도 됨 | [끌어 놓기](/events/drag-and-drop) |

참조 횟수는 의존성 문자열 `"DS/..."` 기준입니다.

::: info 근거
CoreEvents/CoreEvents.js, Selection/Selection.js, DataDragAndDrop/DataDragAndDrop.js, 3DXContentChecker/3DXContentChecker.js
:::

## 어떤 것을 쓰나

| 하고 싶은 것 | 쓸 것 |
| --- | --- |
| 내 위젯 안의 화면 조각끼리 알림 | `ModelEvents` 객체를 하나 만들어 공유 |
| 같은 창의 다른 모듈(남이 만든 코드 포함)에 알림 | `Events` (전역) |
| 3D 뷰어 등에서 "선택된 객체" 를 공유 | `CSOManager` |
| 다른 위젯에 객체를 넘기기 (사용자가 직접) | 끌어 놓기 + 3DXContent JSON |
| 다른 위젯에 코드로 신호 보내기 | [PlatformAPI](/widget/platform-api) 또는 [InterCom](/uwa/intercom) |

::: warning 위젯끼리는 Events 로 통하지 않습니다
`Events`, `CSOManager` 는 그 **창(window) 안에서만** 하나입니다. 대시보드의 위젯은 보통 각자 iframe 에서 돌기 때문에, 위젯 A 에서 `Events.publish` 해도 위젯 B 의 `Events.subscribe` 는 받지 못하는 것으로 보입니다. <Badge type="danger" text="검증 필요" /> 위젯 사이는 PlatformAPI, InterCom, 끌어 놓기를 씁니다.
:::

## 원본 위치

| 파일 | 들어 있는 모듈 |
| --- | --- |
| `webapps/CoreEvents/CoreEvents.js` | `DS/CoreEvents/ModelEvents`, `DS/CoreEvents/Events` |
| `webapps/Selection/Selection.js` | `DS/Selection/XSO` (공통 바탕), `CSOManager`, `HSOManager`, `PSOManager` |
| `webapps/DataDragAndDrop/DataDragAndDrop.js` | `DS/DataDragAndDrop/DataDragAndDrop` |
| `webapps/3DXContentChecker/3DXContentChecker.js` | 끌어 놓기 데이터(3DXContent) JSON 스키마와 검사 함수 |

## 2026 변경

| 항목 | 내용 |
| --- | --- |
| `Events` <Badge type="warning" text="2026" /> | 클래스의 static 메서드로 바뀜. 사용법은 같음. `useFullInfos` 옵션 없어짐. 인자가 틀리면 콘솔 경고 |
| `ModelEvents` <Badge type="warning" text="2026" /> | ES class 로 바뀜. 메서드 이름과 동작은 같음 |
| `XSO.getLength()` <Badge type="warning" text="2026" /> | 선택 개수. 새로 추가 |
| `XSO.isInUniqueTransaction()` <Badge type="warning" text="2026" /> | `unique()` 처리 중인지. 새로 추가 |
| `DataDragAndDrop` | 사실상 변경 없음 |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [PubSub (Events, ModelEvents)](/events/pubsub) | 전역 `Events` 와 객체별 `ModelEvents` 의 publish / subscribe |
| [선택 (CSOManager, HSOManager, PSOManager)](/events/selection) | 창 안에서 공유하는 선택, 강조, 미리 선택 목록 |
| [끌어 놓기 (DataDragAndDrop, 3DXContent)](/events/drag-and-drop) | 위젯 사이로 객체 넘기기, 3DXContent JSON |

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [01_pubsub.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/EventsSample/01_pubsub.html) | Events 와 ModelEvents 의 이름 정규화, 호출 순서, 부모 전파 | [PubSub](/events/pubsub) |
| [02_drag_drop.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/EventsSample/02_drag_drop.html) | 3DXContent 끌기 / 놓기, 놓인 객체 정보 조회 | [끌어 놓기](/events/drag-and-drop) |

::: warning
샘플은 `<3DSpace>/webapps/EventsSample/` 에 두고 ENOVIA 서버 주소로 열어야 동작합니다. 원본 소스 분석으로 작성했고, 서버에서 동작 확인을 아직 하지 않았습니다. 다르게 동작하면 원본 쪽이 맞습니다.
:::
