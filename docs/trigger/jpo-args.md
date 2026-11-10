# 트리거 JPO 와 인자 <Badge type="info" text="원본 분석" />

`emxTriggerManager` 가 부르는 JPO 메서드의 형태, 인자가 채워지는 규칙, 이벤트를 막고 메시지를 보여 주는 방법입니다. JPO 기본(생성자, 컴파일, 배포)은 [JPO](/jpo/) 를 봅니다.

샘플: [MyPartTrigger_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TriggerSample/MyPartTrigger_mxJPO.java)

::: info 근거
`jpo/emxTriggerManagerBase_mxJPO.java` (`mxMain`, `subEnvironmentVars`), `jpo/emxTriggerValidationResultsBase_mxJPO.java` (검증 실행 때 설정하는 환경 변수 목록), `jpo/emxContextUtilBase_mxJPO.java` (`mqlNotice`), `jpo/emxRouteBase_mxJPO.java` (`checkAssigneeForTask`), `jpo/emxCommonTaskBase_mxJPO.java`, `jpo/emxCommonPartFamilyBase_mxJPO.java`, `jpo/emxRTEUtilBase_mxJPO.java`, `jpo/emxECOBase_mxJPO.java` (RPE 플래그), `3dspace/common/emxLifecycleProcess.jsp`, 프로젝트 트리거 JPO
:::

## 메서드 형태

```java
public int checkDelete(Context context, String[] args) throws Exception {
    String objectId = args[0];
    String type = args[1];
    return 0;
}
```

| 항목 | 내용 |
| --- | --- |
| 이름 | 설정 객체의 `eService Method Name`. 비우면 `mxMain` |
| `args` 길이 | **항상 15**. 안 쓴 칸은 빈 문자열. 트리거 검증 화면에서 부를 때만 16 (`args[15]` = `"validate"`) |
| `args` 순서 | `eService Program Argument 1` 이 `args[0]` |
| 반환 | `0` 통과, `1` 실패. 다른 숫자는 실패로 보지 않음 |
| 생성자 | `(Context, String[])`. `eService Constructor Arguments` 값이 들어옴 (비면 길이 1, 값 `null`) |

OOTB 에는 `void` 메서드도 있습니다 (`emxCommonTask.triggerPromoteAction`). 이때 실패는 예외로만 알립니다.

## macro 치환

설정 객체의 인자에 `${이름}` 을 적으면, 실행 직전에 `get env 이름` 의 값으로 바뀝니다. 이벤트가 일어날 때 core 가 넣어 둔 RPE (runtime program environment) 변수입니다.

| 규칙 | 예 | 결과 |
| --- | --- | --- |
| 인자 **전체** 가 값으로 바뀜 | `id=${OBJECTID}` | `1234.5678...` (앞의 `id=` 사라짐) |
| 인자 하나에 macro 하나 | `${TYPE}/${NAME}` | `TYPE` 값만 |
| `${` 가 없으면 그대로 | `delete` | `delete` |
| 없는 변수 | `${NOTHING}` | 빈 값으로 보입니다 |

값을 이어 붙여야 하면 인자를 나눠 받고 JPO 에서 합칩니다. 고정 문자열을 넣어 같은 메서드를 상황별로 나눠 쓰는 것도 흔합니다 (예: 3 번째 인자에 `create` / `delete`).

## 이벤트별 값

| macro | 뜻 | 이벤트 |
| --- | --- | --- |
| `${OBJECTID}` | 대상 객체 id | business object 이벤트 전부 |
| `${TYPE}`, `${NAME}`, `${REVISION}` | 대상 객체 type / name / revision | 〃 |
| `${POLICY}`, `${VAULT}`, `${OWNER}` | policy / vault / owner | 〃 |
| `${USER}` | 실행한 사용자 | 〃 |
| `${EVENT}` | `Promote`, `Demote`, `Create` ... | 〃 |
| `${INVOCATION}` | 트리거 종류. `emxTriggerManager` 는 `action` 인지만 비교 | 〃 |
| `${CURRENTSTATE}`, `${STATENAME}` | 현재 state (전이 전) | Promote / Demote |
| `${NEXTSTATE}` | 갈 state | Promote / Demote |
| `${AUTOPROMOTE}` | 자동 promote 인지 | Promote |
| `${FROMOBJECTID}`, `${TOOBJECTID}` | 관계 양 끝 객체 id | relationship 이벤트 |
| `${RELID}` | 관계 id | relationship 이벤트 |
| `${ATTRNAME}`, `${NEWATTRVALUE}` | 바뀌는 속성 이름, 새 값 | ModifyAttribute |
| `${PARENTEVENT}`, `${NEWRELID}` | 상위 이벤트(revise, clone), 복사된 관계 id | 관계가 따라 복사될 때 |
| `${TRANSHISTORY}` | 트랜잭션 동안의 이력 | Transaction |

- `CURRENTSTATE`, `STATENAME`, `NEXTSTATE`, `EVENT`, `AUTOPROMOTE` 는 OOTB 트리거 검증 화면이 promote 를 흉내 낼 때 직접 넣는 변수 목록에서 확인됩니다.
- 관계, 속성 쪽 이름은 OOTB JPO 주석(`emxCommonPartFamily.updateCount`, `emxRTEUtil`)과 프로젝트 정의 파일 기준입니다.

JPO 안에서 직접 읽을 수도 있습니다.

```java
String event = MqlUtil.mqlCommand(context, "get env $1", "EVENT");
String relId = PropertyUtil.getRPEValue(context, "RELID", false);
```

## 트리거끼리 값 넘기기

RPE 에 값을 넣어 두면 같은 트랜잭션 안의 다른 트리거가 읽을 수 있습니다. OOTB 는 "이번에는 검사하지 말라" 는 신호로 씁니다.

```java
PropertyUtil.setRPEValue(context, "MX_SKIP_PART_PROMOTE_CHECK", "true", false);
```

```java
String skip = PropertyUtil.getRPEValue(context, "MX_SKIP_PART_PROMOTE_CHECK", false);
if ("true".equals(skip)) {
    return 0;
}
```

`emxSystem.properties` 의 `emxFramework.RestoreRPE=FALSE` 라서 `emxTriggerManager` 가 트리거 실행 후 RPE 를 되돌리지 않습니다. 한 번 넣은 값은 남는 것으로 보이므로 이름을 구체적으로 짓습니다.

## 막기와 메시지

### Check: notice 를 올리고 1

OOTB 의 관용 방식입니다.

```java
public int checkDelete(Context context, String[] args) throws Exception {
    if (canDelete(context, args[0])) {
        return 0;
    }
    String msg = EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource",
            context.getLocale(), "emxFramework.MyPart.Msg.CannotDelete");
    emxContextUtil_mxJPO.mqlNotice(context, msg);
    return 1;
}
```

`emxContextUtil_mxJPO.mqlNotice` 는 `MqlUtil.mqlCommand(context, "notice $1", msg)` 한 줄입니다. 같은 클래스에 `mqlWarning` (`warning $1`), `mqlError` (`error $1`) 도 있습니다. 문구는 [문자열 리소스](/properties/string-resource) 에서 읽습니다.

### 예외 던지기

```java
throw new FrameworkException("Spec document is required.");
```

Check 에서 예외를 던지면 core 가 `System Error: #5000001:` 뒤에 메시지를 붙여 돌려줍니다.

### 화면에 보이는 것

OOTB 라이프사이클 화면(`emxLifecycleProcess.jsp`)은 promote 실패를 이렇게 처리합니다.

| 순서 | 조건 | 보이는 메시지 |
| --- | --- | --- |
| 1 | notice 가 있음 (`MqlNoticeUtil.checkIfClientTaskMessageExists`) | 트리거가 올린 notice |
| 2 | 오류 코드 `5000001` | 예외 메시지 (`#5000001:` 뒤) |
| 3 | 그 밖 | 공통 문구 "Promotion failed" 계열 |

Action 에서 1 을 돌려주면 `emxTriggerManager` 가 `emxFramework.Trigger.emxTriggerManagerBase.TriggerFail` ("트리거 프로그램 실패") 로 예외를 던집니다. 원인을 보여 주려면 Action 에서는 1 대신 **직접 메시지를 담아 예외** 를 던집니다.

::: warning 화면이 아니라 트리거에서 막습니다
같은 promote 라도 라이프사이클 화면, 작업 완료, Route 완료, 위젯, MQL 등 들어오는 길이 여럿입니다. 한 화면에서만 막으면 다른 길로 통과합니다. 상태 규칙은 Check 트리거에 둡니다.
:::

## 권한과 재귀

### 권한 올리기

사용자가 직접 권한이 없는 객체를 바꿔야 하면 `pushContext` 후 반드시 `finally` 에서 `popContext` 합니다. [JPO](/jpo/)

```java
ContextUtil.pushContext(context);
try {
    child.setState(context, nextState);
} finally {
    ContextUtil.popContext(context);
}
```

### 같은 트리거가 다시 실행될 때

트리거 안에서 다른 객체를 바꾸면 그 객체의 트리거가 또 실행됩니다. 같은 policy 를 쓰는 하위 객체의 state 를 맞추는 Action 이라면 **같은 트리거가 하위 객체에 대해 다시** 실행됩니다.

| 막는 방법 | 예 |
| --- | --- |
| `${TYPE}` 확인 | 상위 type 이 아니면 바로 `return 0` |
| RPE 플래그 | 위 `MX_SKIP_PART_PROMOTE_CHECK` 방식 |
| 이미 목표 상태면 건너뜀 | `setState` 전에 `current` 비교 |
| 필드 플래그 | OOTB `emxCommonProjectManagement.triggerDeleteOverride` 의 `doNotRecurse` |

### 트리거 끄기

```java
MqlUtil.mqlCommand(context, "trigger $1", true, "off");
try {
    ...
} finally {
    MqlUtil.mqlCommand(context, "trigger $1", true, "on");
}
```

`trigger off` 는 **모든** 트리거를 끕니다. OOTB 는 마이그레이션, 일괄 처리 같은 곳에서만 씁니다. 업무 화면 코드에서는 위의 재귀 방지 방법을 씁니다.
