# 트리거 등록

등록은 두 단계입니다. **설정 객체** (`eService Trigger Program Parameters`) 를 만들어 Active 로 올리고, admin 의 이벤트에 `emxTriggerManager` 와 설정 객체 이름을 붙입니다.

샘플: [01_trigger_register.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TriggerSample/01_trigger_register.mql)

::: info 근거
`mql/12.trigger/Trigger_Sample.mql` 와 프로젝트 트리거 정의 파일, `mql/03.policy/Policy_Sample.mql`, OOTB policy 수정 파일(`Product.mql`, `Classification.mql`)의 `print policy` 결과. 코드 쪽: `jpo/emxTriggerManagerBase_mxJPO.java` (생성자의 속성 목록, `mxMain`, `resetCache`), `jpo/emxUtilBase_mxJPO.java` (`getStateNamesFromProperties`), `jpo/emxTriggerValidationBase_mxJPO.java`, `jpo/emxDomainObjectBase_mxJPO.java` (생성자)
:::

## 1. 설정 객체 만들기

```text
add bus 'eService Trigger Program Parameters' 'TypeMyPartDeleteCheck' 'checkDelete'
    policy 'eService Trigger Program Policy'
    vault  'eService Administration'
    owner  'creator'
    'eService Program Name'       'MyPartTrigger'
    'eService Method Name'        'checkDelete'
    'eService Sequence Number'    '100'
    'eService Error Type'         'Error'
    'eService Program Argument 1' '${OBJECTID}'
    'eService Program Argument 2' '${TYPE}'
;
promote bus 'eService Trigger Program Parameters' 'TypeMyPartDeleteCheck' 'checkDelete';
```

### 속성

| 속성 | 뜻 |
| --- | --- |
| `eService Program Name` | 실행할 프로그램. JPO 는 `_mxJPO` 를 뗀 이름 (`MyPartTrigger`) |
| `eService Method Name` | JPO 메서드. 비우면 `mxMain` |
| `eService Program Argument 1` ~ `15` | 메서드의 `args[0]` ~ `args[14]`. `${OBJECTID}` 같은 macro 나 고정 문자열. [치환 규칙](/trigger/jpo-args#macro-치환) |
| `eService Constructor Arguments` | JPO 생성자에 넘길 값. 공백으로 나누고 macro 도 치환함 |
| `eService Sequence Number` | 실행 순서로 쓰이는 것으로 보입니다. 프로젝트는 `0`, `1`, `3`, `100` 등 |
| `eService Target States` | Promote / Demote 때 **다음 state** 가 이 목록에 있을 때만 실행. state 심볼릭 이름, 쉼표 구분 |
| `eService Error Type` | `Error` / `Warning`. 아래 경고 참고 |
| `eService Run In Background` | `true` 면 Job 으로 따로 실행하고 결과를 보지 않음 |
| `eService Program Argument Desc 1` ... | 인자 설명. 템플릿에만 있고 실행에는 쓰지 않음 |

::: tip 생성자 인자로 객체 지정
`emxDomainObject` 를 상속한 OOTB JPO 는 생성자에서 `args[0]` 으로 `setId` 합니다. 그래서 OOTB 트리거는 `eService Constructor Arguments` 에 `${OBJECTID}` 를 넣고 메서드 안에서 `getId(context)` 를 쓰기도 합니다. 새로 만들 때는 메서드 인자로 받는 편이 읽기 쉽습니다.
:::

::: warning Error Type 은 Error 로
이 소스의 `emxTriggerManager` 는 `eService Error Type` 값을 읽기만 하고 실행 판단에는 쓰지 않습니다. 반환값 1 은 값과 상관없이 처리됩니다. 값을 보는 곳은 OOTB 트리거 검증 화면(`Warning` / `Fail` 표시)뿐입니다. 프로젝트 정의 파일은 모두 `Error` 이므로 그대로 따릅니다.
:::

### 이름과 revision

| 항목 | 규칙 | 예 |
| --- | --- | --- |
| name (OOTB) | `Type` + 타입 + 이벤트 + 종류 | `TypePartCreateAction`, `TypeProjectTemplateDeleteCheck` |
| | `Relationship` + 관계 + 이벤트 + 종류 | `RelationshipEBOMCreateCheck`, `RelationshipEBOMDeleteOverride` |
| | `Policy` + 정책 + `State` + state + 이벤트 + 종류 | `PolicyECPartStateReviewPromoteAction` |
| | `Attribute` + 속성 + 이벤트 + 종류 | `AttributeAllModifyAction` |
| name (프로젝트) | 접두어 + 대상 + 시점 | `MyTypeDeleteCheck`, `MyPolicyInWorkPromoteAction` |
| revision | 아무 값. 프로젝트 템플릿은 **메서드 이름** | `checkDelete` |

같은 name 에 revision 만 다른 설정 객체를 여러 개 두면, `input` 에 name 하나만 적어도 모두 실행됩니다. 한 이벤트에 여러 메서드를 걸 때 admin 을 고치지 않고 객체만 추가할 수 있습니다.

### 상태

| 상태 | 실행 |
| --- | --- |
| 만든 직후 (첫 state) | 안 함 |
| `Active` | 함 |

`add bus` 다음에 반드시 `promote bus` 합니다. `add bus` 안에 `current 'Active'` 를 적은 정의 파일도 있지만, 적용 후 `current` 를 확인하는 편이 안전합니다.

```text
print bus 'eService Trigger Program Parameters' 'TypeMyPartDeleteCheck' 'checkDelete' select current dump;
```

## 2. admin 에 붙이기

```text
mod type 'MyPart'
    add trigger Delete Check emxTriggerManager input 'TypeMyPartDeleteCheck';

mod relationship 'MyPartToSpec'
    add trigger ModifyAttribute Action emxTriggerManager input 'RelMyPartToSpecModifyAttributeAction';

mod attribute 'My Weight'
    add trigger Modify Action emxTriggerManager input 'AttributeMyWeightModifyAction';

mod policy 'MyPartPolicy' state 'In Work'
    add trigger Promote Check emxTriggerManager input 'PolicyMyPartStateInWorkPromoteCheck';
mod policy 'MyPartPolicy' state 'In Work'
    add trigger Promote Action emxTriggerManager input 'PolicyMyPartStateInWorkPromoteAction MyNotifyAction';
```

- `input` 에 이름 여러 개를 **공백** 으로 적습니다. `print policy` 결과도 `PromoteCheck:emxTriggerManager(A B)` 처럼 공백으로 나옵니다.
- 키워드 대소문자는 섞어 써도 됩니다 (`add Trigger`, `add trigger`).
- policy 트리거는 떠나는 state 에 붙입니다. [라이프사이클](/trigger/lifecycle)

::: warning 이미 트리거가 있는 이벤트
같은 이벤트, 같은 종류(예: `In Work` 의 Promote Check)에는 `emxTriggerManager(...)` 가 하나만 붙고, 그 안에 이름 목록이 들어갑니다. OOTB policy 에 내 트리거를 더할 때는 먼저 `print` 로 기존 목록을 보고 **기존 이름까지 함께** `input` 에 적습니다. 내 이름만 적으면 OOTB 트리거가 빠지는 것으로 보입니다.

```text
print policy 'Product' select state[Review].trigger dump;
```
:::

### Target States

```text
'eService Target States' 'state_Release'
'eService Target States' 'state_Review,state_Release'
```

| 규칙 | 설명 |
| --- | --- |
| 심볼릭 이름만 | `print policy 정책 select property[state_Release].value` 로 실제 이름을 찾아 비교합니다 |
| 실제 이름을 적으면 | `'Release'` 처럼 적으면 `property[Release]` 를 찾다가 빈 값이 되어 **항상 건너뜁니다**. 오류는 나지 않습니다 |
| Promote / Demote 만 | 다른 이벤트에서는 무시하고 항상 실행 |
| type 은 안 봄 | 같은 policy 를 쓰는 다른 type 에도 똑같이 실행됨. 필요하면 JPO 에서 `${TYPE}` 확인 |

한 설정 객체를 여러 state 에 붙여 두고 특정 전이에서만 실행하고 싶을 때 씁니다.

## 3. 다시 배포, 끄기, 지우기

| 하고 싶은 것 | 명령 |
| --- | --- |
| 인자 / 메서드만 바꾸기 | `modify bus 'eService Trigger Program Parameters' 'N' 'R' 'eService Method Name' 'newMethod';` |
| 정의 파일 다시 실행 | `del bus ... 'N' 'R';` 후 `add bus` (같은 객체가 있으면 `add` 는 오류) |
| 잠시 끄기 | `demote bus 'eService Trigger Program Parameters' 'N' 'R';` |
| 다시 켜기 | `promote bus ...` |
| admin 에서 떼기 | `mod type 'MyPart' remove trigger Delete Check;` |

프로젝트 템플릿은 `#del bus ...` 를 주석으로 두고, 다시 배포할 때만 주석을 풀어 실행합니다.

## 4. 캐시

`emxTriggerManager` 는 설정 객체 정보(`TRIGGEROBJECTS`)와 "프로그램이 JPO 인지"(`TRIGGERPROGRAM`)를 캐시에 둡니다. 설정 객체를 바꿨는데 반영되지 않으면 캐시를 비웁니다.

```text
execute program emxTriggerManager -method resetCache;
```

## 5. 확인하기

```text
print type 'MyPart' select trigger dump;
print policy 'MyPartPolicy' select state[In Work].trigger dump;

temp query bus 'eService Trigger Program Parameters' 'TypeMyPart*' *
    select current attribute[eService Program Name] attribute[eService Method Name] dump |;
```

::: tip 트리거 검증 화면
OOTB 에는 객체의 현재 state 에 붙은 Promote Check 를 미리 돌려 보는 기능(`emxTriggerValidation`)이 있습니다. 이때 JPO 는 **실제로** 실행되고, `args` 가 16 개이며 `args[15]` 가 `"validate"` 입니다. Check 트리거에는 데이터를 바꾸는 코드를 넣지 않습니다.
:::
