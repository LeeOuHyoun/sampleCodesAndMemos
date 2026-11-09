# 트리거 개요

트리거는 **객체가 만들어지거나, 속성이 바뀌거나, state 가 바뀔 때** 서버 코드를 실행하는 장치입니다. 화면이 아니라 데이터 쪽에 붙기 때문에 어느 화면, 어느 API 로 들어와도 반드시 지나갑니다.

OOTB 와 프로젝트 모두 트리거 프로그램을 직접 붙이지 않고, 공용 JPO `emxTriggerManager` 하나를 붙인 뒤 **설정 객체** 로 실제 JPO 메서드를 고릅니다.

샘플: [01_trigger_register.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TriggerSample/01_trigger_register.mql), [MyPartTrigger_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TriggerSample/MyPartTrigger_mxJPO.java)

::: info 근거
`mql/12.trigger/*.mql` (21 개, `Trigger_Sample.mql` 템플릿 포함), `mql/03.policy/Policy_Sample.mql`, OOTB policy / type 수정 파일 안의 `print` 결과. 코드 쪽: `jpo/emxTriggerManagerBase_mxJPO.java`, `jpo/emxTriggerValidationBase_mxJPO.java`, `jpo/emxTriggerValidationResultsBase_mxJPO.java`, OOTB 트리거 JPO 의 주석에 적힌 트리거 이름
:::

## 세 층 구조

```text
admin (type / relationship / attribute / policy 의 state)
 └ trigger Delete Check  →  emxTriggerManager   input "TypeMyPartDeleteCheck"
      └ business object  'eService Trigger Program Parameters'  'TypeMyPartDeleteCheck'  'checkDelete'
           ├ eService Program Name          MyPartTrigger
           ├ eService Method Name           checkDelete
           └ eService Program Argument 1    ${OBJECTID}
                └ MyPartTrigger_mxJPO.checkDelete(context, args)
```

| 층 | 정하는 것 | 바꾸는 방법 |
| --- | --- | --- |
| admin 의 trigger | 어느 이벤트에 어떤 설정 객체 이름들을 실행할지 | `mod type ... add trigger ...` |
| 설정 객체 | 어떤 JPO 의 어떤 메서드를, 어떤 인자로, 어떤 순서로. 켜기 / 끄기 | `add bus` / `modify bus` / `promote bus` / `demote bus` |
| JPO | 실제 로직 | JPO 수정 후 컴파일 |

인자, 순서, 켜기 / 끄기는 설정 객체만 고치면 되고 admin 은 다시 건드리지 않아도 됩니다. [등록 방법](/trigger/register)

## 이벤트

| 붙이는 곳 | 이벤트 (예) | 근거 |
| --- | --- | --- |
| type | `Create`, `Modify`, `ModifyAttribute`, `Delete`, `Revision`, `Checkin`, `Checkout`, `Connect`, `Disconnect`, `Copy`, `ChangeOwner`, `ChangePolicy`, `Transaction` | 프로젝트 템플릿, OOTB 이름 `TypePartChangeOwnerAction`, `TypeChangeActionChangePolicyAction`, type 의 `Transaction action`, `Copy action` |
| relationship | `Create`, `Delete`, `ModifyAttribute` | `RelationshipEBOMCreateCheck`, `RelationshipEBOMModifyAttributeAction`, 프로젝트 관계 트리거 |
| attribute | `Modify` | `AttributeAllModifyAction` |
| policy 의 state | `Promote`, `Demote` (문법상 `Approve`, `Reject`, `Ignore`, `Override`, `Schedule`, `Enable`, `Disable`, `Unsign` 도 있음) | 프로젝트 / OOTB policy |

- type 의 Connect / Disconnect 는 그 type 객체에 관계가 연결 / 해제될 때 실행되는 것으로 보입니다. 관계 쪽 규칙은 relationship 의 Create / Delete 에 거는 편이 분명합니다.
- policy 트리거는 **떠나는 state** 에 붙입니다. `In Work` 의 Promote Action 은 `In Work` 에서 다음 state 로 올라간 직후에 실행됩니다. [라이프사이클](/trigger/lifecycle)

## Check, Action, Override

| 종류 | 실행 시점 | JPO 가 1 을 돌려주면 |
| --- | --- | --- |
| `Check` | 이벤트 직전 | 이벤트가 취소됨. 남은 트리거도 실행 안 됨 |
| `Action` | 이벤트 직후 (같은 트랜잭션) | `emxTriggerManager` 가 예외 "Trigger program failed" 를 던짐. 이벤트도 실패로 끝남 |
| `Override` | 이벤트의 기본 동작 대신 실행되는 것으로 보입니다 | Check 와 같이 1 을 그대로 돌려줌 |

검사는 Check, 후처리(다른 객체 갱신, 알림, 인터페이스 호출)는 Action 에 둡니다. Override 는 OOTB 의 `TypeMessageDeleteOverride`, `RelationshipEBOMDeleteOverride` 같은 삭제 처리에서 보이고 프로젝트에서는 쓰지 않습니다.

## emxTriggerManager 가 하는 일

1. `input` 의 이름마다 같은 이름의 설정 객체들을 캐시에서 꺼냅니다. revision 만 다른 객체가 여러 개면 모두 실행합니다.
2. `eService Target States` 가 있으면, Promote / Demote 이벤트일 때 다음 state 와 비교해서 다르면 건너뜁니다.
3. 인자 15 개의 `${...}` 를 현재 이벤트 값으로 바꿉니다.
4. 프로그램이 JPO 면 `JPO.invoke` 로 메서드를 부르고, 아니면 `execute program` 으로 실행합니다.
5. `eService Run In Background` 가 `true` 면 Job 으로 넘기고 결과를 보지 않습니다.
6. 반환값이 1 이면 위 표대로 처리하고 멈춥니다.

::: tip 설정 객체는 Active 상태여야 실행됩니다
`add bus` 만 하고 `promote bus` 를 빠뜨리면 아무 일도 일어나지 않습니다. OOTB 의 트리거 검증 화면도 `current == Active` 인 설정 객체만 찾습니다.
:::

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [트리거 등록](/trigger/register) | 설정 객체 속성, 이름 규칙, admin 에 붙이기, 끄기, 캐시 |
| [JPO 와 인자](/trigger/jpo-args) | 메서드 형태, `${...}` 치환 규칙, 이벤트별 값, 막기와 메시지 |
| [라이프사이클](/trigger/lifecycle) | promote / demote 순서, 코드에서 state 바꾸기, Route 와의 관계 |
| [채번기](/trigger/generator) | `eService Object Generator` 로 이름 자동 생성 |

JPO 자체(생성자, 컴파일, `pushContext`)는 [JPO](/jpo/), policy 문법은 [Policy](/schema/policy) 에 있습니다.
