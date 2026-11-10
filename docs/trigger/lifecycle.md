# 라이프사이클과 promote <Badge type="info" text="원본 분석" />

객체의 state 가 바뀔 때 어떤 순서로 무엇이 실행되는지, 코드에서 state 를 바꾸는 방법입니다. policy 정의(state, 권한, 플래그)는 [Policy](/schema/policy) 에 있습니다.

::: info 근거
프로젝트 policy 트리거 정의 파일(Promote Check / Action, Demote Action, Target States), OOTB policy 수정 파일의 `print policy` 결과. 코드 쪽: `jpo/emxTriggerManagerBase_mxJPO.java`, `jpo/emxCommonCompleteTaskBase_mxJPO.java` (Route 완료 처리), `jpo/emxRouteBase_mxJPO.java`, `jpo/emxCommonEngineeringChangeBase_mxJPO.java` (`trigger off`), `3dspace/common/emxLifecycleProcess.jsp`. `DomainObject.promote` 99 건, `setState` 72 건, `demote` 13 건 (jpo 폴더)
:::

## promote 한 번에 일어나는 일

`In Work` → `Review` → `Release` 인 policy 에서 `In Work` 객체를 promote 하면:

| 순서 | 내용 | 실패하면 |
| --- | --- | --- |
| 1 | `In Work` 의 **Promote Check** 트리거들 | 이벤트 취소. 메시지 표시 |
| 2 | promote 조건 확인 (권한, 서명 등) | 이벤트 취소 |
| 3 | state 가 `Review` 로 바뀜 | |
| 4 | `In Work` 의 **Promote Action** 트리거들 | 예외. promote 도 실패로 끝남 |

- 트리거는 **떠나는 state** 기준입니다. `Review` 진입 시 할 일은 `In Work` 의 Promote Action 에 둡니다.
- demote 도 같습니다. `Review` → `In Work` 반려 처리는 `Review` 의 Demote Check / Action 에 둡니다.
- Check 와 Action 은 같은 트랜잭션 안에서 돕니다. Action 이 예외를 던지면 state 변경도 남지 않는 것으로 보입니다.

::: tip 진입 후 처리와 Target States
한 state 에서 promote 하면 다음 state 는 하나뿐이므로 Target States 는 대부분 필요 없습니다. OOTB 의 `PolicyAllStateAllTransitionControlCheck` 처럼 **같은 설정 객체를 여러 state 에 붙여 두고** 특정 전이에서만 실행할 때 씁니다. [Target States](/trigger/register#target-states)
:::

## 코드에서 state 바꾸기

| 방법 | 동작 |
| --- | --- |
| `obj.promote(context)` | 다음 state 로. 트리거 실행 |
| `obj.demote(context)` | 이전 state 로. 트리거 실행 |
| `obj.setState(context, "Release")` | 목표 state 로 바로. 거치는 전이마다 트리거가 실행되는 것으로 보입니다 |
| `promoteWithBL` / `demoteWithBL` | OOTB 라이프사이클 화면이 on-premise 에서 쓰는 것 |
| `MqlUtil.mqlCommand(context, "promote bus $1", id)` | MQL 로 promote |
| `override bus $1` | 다음 promote 의 서명 요건을 건너뜀 (OOTB 는 Route 객체에 사용) |

```java
DomainObject obj = DomainObject.newInstance(context, objectId);
obj.promote(context);
```

state 이름은 policy 마다 다를 수 있으므로 심볼릭 이름으로 찾습니다.

```java
String release = PropertyUtil.getSchemaProperty(context, "policy", policyName, "state_Release");
obj.setState(context, release);
```

## Route 로 결재하고 promote

프로젝트 결재는 policy 의 서명 대신 Route 로 처리합니다.

1. 결재 대상 객체를 Route 의 content 로 연결합니다 (`Object Route` 관계).
2. Route 의 완료 동작이 `Promote Connected Object` 면, 마지막 작업이 끝날 때 OOTB 가 content 객체를 promote 합니다.
3. 이때도 대상 객체의 Promote Check / Action 이 그대로 실행됩니다.

그래서 "결재 완료 시 처리" 는 Route 쪽이 아니라 **대상 객체 policy 의 Promote Action** 에 둡니다. Route content 로 연결하지 않은 하위 객체는 promote 되지 않으므로, 하위 객체 state 를 맞춰야 하면 상위 객체의 Promote Action 에서 직접 바꿉니다 (아래).

## 같은 policy 를 상위 / 하위 객체가 함께 쓸 때

상위(헤더)와 하위(항목)를 같은 policy 로 두고 상위 전이 때 하위를 따라 올리는 경우가 많습니다.

```text
mod policy 'MyRequestPolicy' state 'In Work'
    add trigger Promote Action emxTriggerManager input 'PolicyMyRequestStateInWorkPromoteAction';
mod policy 'MyRequestPolicy' state 'Review'
    add trigger Demote Action emxTriggerManager input 'PolicyMyRequestStateReviewDemoteAction';
```

| 주의 | 이유 |
| --- | --- |
| 재진입 막기 | 하위 객체 state 를 바꾸면 **같은 트리거** 가 하위 객체로 다시 실행됨. `${TYPE}` 이 상위 type 이 아니면 바로 끝냄 |
| 권한 올리기 | 요청자가 하위 객체에 promote 권한이 없거나, 반려가 Route owner 로 들어옴. `pushContext` 필요 |
| 이미 같은 state 면 건너뛰기 | `setState` 가 하위 트리거를 다시 깨우므로 불필요한 호출을 줄임 |
| 실패 시 예외 | 하위만 못 따라가면 상위와 하위 state 가 어긋남. 상위 전이도 실패시키는 편이 안전 |

샘플 JPO 의 `syncChildState` 가 이 형태입니다. [MyPartTrigger_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TriggerSample/MyPartTrigger_mxJPO.java)

## 서명과 자동 promote

| 기능 | 내용 |
| --- | --- |
| state 의 `promote true` | 조건을 다 채우면 다음 state 로 자동 promote |
| `signature` | state 승인 서명 (approve / reject / ignore). 프로젝트는 쓰지 않음 |
| `${AUTOPROMOTE}` | 트리거 안에서 자동 promote 인지 구분하는 RPE 변수로 보입니다 |

자세한 문법은 [Policy](/schema/policy#문법에는-있지만-프로젝트에서-안-쓰는-것) 를 봅니다.

## 트리거 없이 state 바꾸기

데이터 보정, 마이그레이션처럼 트리거를 건너뛰어야 할 때만 씁니다.

```java
MqlUtil.mqlCommand(context, "trigger $1", true, "off");
try {
    obj.setState(context, release);
} finally {
    MqlUtil.mqlCommand(context, "trigger $1", true, "on");
}
```

::: danger trigger off 는 전부 끕니다
내 트리거뿐 아니라 OOTB 트리거(알림, 이력, 하위 객체 갱신)도 모두 건너뜁니다. 업무 기능에서는 RPE 플래그나 `${TYPE}` 검사로 필요한 트리거만 피합니다. [재귀 막기](/trigger/jpo-args#같은-트리거가-다시-실행될-때)
:::
