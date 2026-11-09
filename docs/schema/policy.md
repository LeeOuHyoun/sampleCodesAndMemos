# Policy (상태와 권한)

policy 는 객체의 **생애 주기** 를 정합니다. 어떤 state 를 어떤 순서로 거치는지, revision 이름을 어떻게 붙이는지, state 마다 누가 무엇을 할 수 있는지를 한 곳에 적습니다. 객체는 만들 때 policy 하나를 고르고, 이후 권한 검사는 모두 그 policy 의 **현재 state** 기준입니다.

샘플: [02_policy.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/SchemaSample/02_policy.mql)

::: info 근거
`mql/03.policy/Policy_Sample.mql`, 커스텀 policy 정의 파일(state 1 ~ 4 개, 권한 블록이 있는 파일 포함), OOTB policy 수정 파일(`Product.mql`, `Classification.mql`, `Project_Space.mql`), `mql/03.policy/` 의 policy 설계 메모(MQL 문법 전문, `AccessUtil` 권한 묶음), `mql/20.rule/*.mql`, `mql/12.trigger/Trigger_Sample.mql` 와 trigger 정의 파일. 코드 쪽: `jpo/emxAEFFullSearchBase_mxJPO.java` (`print policy ... state[...]`), `jpo/com/dassault_systemes/enovia/geographyconfiguration/ui/CountryBase_mxJPO.java` (state 심볼릭 조회)
:::

## 정의

```text
add policy 'MyPartPolicy'
    description 'My Part lifecycle'
    store 'STORE'
    type 'MyPart','MyAssembly'
    sequence '1,2,3,...'
    format 'generic'
    state 'In Work'
        revision  true
        version   false
        promote   true
        checkouthistory  false
        public   all
    state 'Release'
        revision  true
        version   false
        promote   true
        checkouthistory  false
        public   all
    property state_InWork value 'In Work'
    property state_Release value 'Release'
    property version value 'R2025x'
    property application value 'Framework'
    property installer value 'XX'
    property 'original name' value 'MyPartPolicy'
    property 'installed date' value '01-01-2025'
;
add property policy_MyPartPolicy on program 'eServiceSchemaVariableMapping.tcl' to policy 'MyPartPolicy';
```

| 절 | 뜻 |
| --- | --- |
| `type 'A','B'` | 이 policy 로 만들 수 있는 type. 쉼표로 여러 개 |
| `store 'STORE'` | 체크인 파일을 저장할 store |
| `format 'generic'` | 체크인 파일 형식. 파일을 붙이는 객체에서 씀. 템플릿 기본값 `generic` |
| `sequence '...'` | revision 이름 규칙. 아래 표 |
| `state '이름'` | state 하나. **적은 순서가 promote 순서** |
| `property state_X value '이름'` | state 심볼릭 이름 등록 |
| `allstate ...` | 모든 state 에 공통으로 붙는 권한. [allstate](#allstate) |

### sequence

| 값 | revision |
| --- | --- |
| `'1,2,3,...'` | 1, 2, 3 ... (프로젝트 커스텀 policy 대부분) |
| `'A,B,C,...'` | A, B, C ... (템플릿 예) |
| `'-'` | revision 을 쓰지 않음 (템플릿 설명) |

### state 안의 플래그

| 플래그 | `true` 일 때 |
| --- | --- |
| `revision` | 이 state 에서 revise (새 revision 만들기) 가능 |
| `version` | 이 state 에서 파일 버전 올리기 가능 |
| `promote` | 승인 조건을 다 채우면 다음 state 로 자동 promote |
| `checkouthistory` | 파일 체크아웃 이력을 남김 |
| `public all` | 모든 사용자에게 모든 권한. 아래 경고 참고 |

state 가 하나뿐인 policy(존재만 하는 데이터)는 템플릿이 `promote false`, `revision false` 로 둡니다.

## state 이름과 심볼릭 이름

state 는 policy 안의 property 로 심볼릭 이름을 붙입니다. 공백은 뺍니다.

```text
property state_InWork  value 'In Work'
property state_Release value 'Release'
```

코드에서는 policy 이름과 함께 찾습니다.

```java
String sRelease = PropertyUtil.getSchemaProperty(context, "policy", policyName, "state_Release");
String sComplete = FrameworkUtil.lookupStateName(context, policyName, "state_Complete");
```

::: warning 같은 뜻, 다른 이름
같은 프로젝트 안에서도 policy 에 따라 state 이름이 `'In Work'` 이기도 하고 `'InWork'` 이기도 합니다. 심볼릭 이름은 둘 다 `state_InWork` 입니다. 코드에 `"In Work"` 를 직접 쓰면 어떤 policy 에서는 맞지 않으므로 심볼릭 이름으로 찾습니다. 번역 키도 실제 이름 기준입니다 (`emxFramework.State.정책.In_Work`).
:::

## 권한 (access)

state 마다 **owner**, **public** 두 규칙이 기본으로 있고, 여기에 **user** 규칙(특정 role 이나 사용자)을 더합니다.

```text
mod policy 'MyPartPolicy' state 'In Work'
    add user VPLMCreator key MyPartCreatorInWorkOwner01
        read,show,checkout,checkin,modify,lock,unlock,fromconnect,toconnect,fromdisconnect,todisconnect,delete,promote
        single organization single project context owner
        filter "(type == 'MyPart')"
;
```

한 규칙은 **대상 + key + 권한 목록 + 조건** 입니다.

### 대상

| 형태 | 대상 |
| --- | --- |
| `owner 권한` | 객체 소유자 |
| `public 권한` | 모든 사용자 |
| `user 역할이나사용자 key 이름 권한` | 그 role 을 가진 사용자. 대부분 OOTB role (`VPLMCreator`, `VPLMProjectLeader`) |
| `revoke public key 이름 권한` | 권한을 **빼앗는** 규칙. `owner`, `user` 앞에도 붙일 수 있음 |
| `login user ...` | 현재 로그인 컨텍스트의 role 만 봄 (문법상 존재, 프로젝트에서는 안 씀) |

`key` 는 같은 role 에 규칙을 여러 개 둘 때 구별하는 이름입니다. 프로젝트에서는 `타입 + 역할 + state + 대상그룹 + Access + 번호` 형태로 길게 짓습니다.

### 권한 목록

쉼표로 이어 씁니다. 자주 쓰는 것만 추렸습니다.

| 권한 | 할 수 있는 것 |
| --- | --- |
| `read`, `show` | 속성 읽기, 목록 / 검색에 보이기. 보통 `checkout,show,read` 를 함께 줌 |
| `modify` | 속성 수정 |
| `checkin`, `checkout`, `lock`, `unlock` | 파일 올리기 / 받기 / 잠금 |
| `create`, `delete` | 생성, 삭제 |
| `revise` | 새 revision |
| `promote`, `demote` | 다음 / 이전 state 로 이동 |
| `fromconnect`, `toconnect` | 이 객체를 from / to 로 연결 만들기 |
| `fromdisconnect`, `todisconnect` | 연결 끊기 |
| `changeowner`, `changepolicy`, `changetype` | 소유자 / policy / type 변경 |
| `grant`, `revoke` | 다른 사람에게 권한 위임 / 회수 |
| `addinterface`, `removeinterface` | interface 붙이기 / 떼기 |
| `all`, `none` | 전부 / 없음 |

권한 앞에 `not` 이나 `!` 를 붙이면 그 권한만 명시적으로 뺍니다 (`!modify`). 전체 목록은 설계 메모의 `ACCESS_ITEM` 에 있습니다.

::: tip 권한 묶음 이름
화면 코드(`AccessUtil`)는 권한을 묶음 이름으로 다룹니다. policy 를 짤 때 이 묶음을 기준으로 생각하면 편합니다.

| 묶음 | 권한 |
| --- | --- |
| Read | `checkout,show,read` |
| Read Write | Read + `checkin,modify,lock,unlock,revise` |
| Add | Read Write + `fromconnect,toconnect` |
| Remove | Read Write + `fromdisconnect,todisconnect,delete` |
| AddRemove | Add + Remove |
| WorkspaceLeadAccess | AddRemove + `promote,demote,grant,revoke` |
:::

### 조건

권한 목록 뒤에 붙여 "언제 이 규칙이 적용되는가" 를 좁힙니다.

| 조건 | 적용되는 경우 |
| --- | --- |
| `single organization` | 객체의 조직과 사용자 로그인 컨텍스트의 조직이 같을 때로 보입니다 |
| `single project` | 객체의 협업공간(project)과 로그인 컨텍스트의 협업공간이 같을 때로 보입니다 |
| `ancestor` / `descendant organization` | 상위 / 하위 조직까지 포함 |
| `context owner` | 로그인한 사용자가 객체의 owner 일 때 |
| `filter "식"` | 식이 참일 때. 객체의 select 값을 쓸 수 있음 |

`filter` 에서 자주 쓰는 식입니다.

| 식 | 뜻 |
| --- | --- |
| `type == 'MyPart'` | policy 하나를 여러 type 이 쓸 때 type 별로 규칙을 나눔 |
| `owner != context.user` | 소유자가 아닐 때 |
| `context.user matchlist 'userA,userB' ','` | 로그인 사용자가 목록에 있을 때 |
| `program[MyAccessJPO -method isTeamLeader ${OBJECTID}] == 'true'` | JPO 메서드를 불러 결과로 판단 |

::: warning filter 안의 JPO 호출
`program[...]` 조건은 권한을 검사할 때마다 JPO 를 부릅니다. 목록 화면에서는 객체마다 불리므로 메서드는 가볍게 만듭니다. `${OBJECTID}` 는 검사 대상 객체의 id 로 바뀝니다.
:::

### 템플릿 기본값 `public all`

템플릿은 state 마다 `public all` 을 둡니다. 그대로 쓰면 **모든 사용자가 모든 권한** 을 가집니다. 권한 설계를 할 때는 먼저 기본 규칙을 비우고 필요한 user 규칙을 더합니다.

```text
mod policy 'MyPartPolicy' add allstate public 'none' owner 'none';
mod policy 'MyPartPolicy' state 'In Work' public 'none' owner 'none';
mod policy 'MyPartPolicy' state 'Release' public 'none' owner 'none';
```

owner / public 기본 규칙은 지울 수 없고 `none` 으로 비활성화합니다.

### allstate

`allstate` 는 모든 state 에 **더해지는** 공통 규칙입니다. 관리자 전체 권한, 어느 state 에서나 읽기 같은 규칙을 둡니다.

```text
mod policy 'MyPartPolicy' allstate
    add rule 'XXAdminFullAccessRule' all
    add user VPLMCreator key MyPartAllStateRead01
        checkout,show,read single organization single project filter "(type == 'MyPart')"
;
```

설계 메모의 정리입니다.

- allstate 규칙은 state 규칙을 대체하지 않고 합쳐집니다.
- revoke 규칙을 grant 보다 먼저 평가합니다. 같은 조건이면 revoke 가 이깁니다.
- allstate 에서 owner 를 적지 않으면 기본값 `all` 입니다.

### revoke

OOTB policy 에 "특정 조건이면 못 보게" 를 더할 때 씁니다. OOTB state 규칙을 건드리지 않고 allstate 에 revoke 를 하나 넣는 방식입니다.

```text
copy policy 'Product' 'Product_OOTB';
mod policy 'Product'
    allstate
        add revoke public key MyRevokeRead checkout,read,show single organization single project
            filter "type != 'MyProduct' && owner != context.user"
;
```

소스 메모에는 "revoke 로 권한이 제거되더라도 object ownership 을 주면 권한을 줄 수 있음" 이라고 적혀 있습니다.

## rule

여러 policy 에서 똑같은 권한 규칙을 쓰려면 rule 로 만들고 policy 에서 참조합니다.

```text
add rule 'XXAdminFullAccessRule'
    description 'Admin full access'
    public none
    owner none
    user "VPLMProjectLeader" key "XXAdminUserList" "all" filter "(context.user matchlist 'adminA,adminB' ',')"
property "application"    value "Framework"
property "installer"      value "XX"
property "original name"  value "XXAdminFullAccessRule"
property "version"        value "R427"
;
add property "rule_XXAdminFullAccessRule" on program 'eServiceSchemaVariableMapping.tcl' to rule "XXAdminFullAccessRule";

mod policy 'MyPartPolicy' allstate add rule 'XXAdminFullAccessRule' all;
```

`all` 은 rule 의 규칙을 전부 가져온다는 뜻입니다. 일부만 가져오는 `ruleuser ... rulekey ...` 문법도 있습니다.

::: tip 사용자 ID 를 식에 쓰지 않기
소스에는 `matchlist` 나 `context.user == '...'` 로 사용자 ID 를 직접 쓴 식이 policy, rule, command 에 흩어져 있습니다. 사람이 바뀌면 여러 파일을 고쳐야 합니다. 꼭 필요하면 rule 한 곳에 모으고, 가능하면 role 로 판단합니다.
:::

## 권한 규칙 고치기

같은 규칙을 지울 때는 `add` 를 `remove` 로 바꿔 같은 내용으로 다시 실행합니다. 그래서 프로젝트 파일은 블록마다 `add` 바로 아래에 `#remove` 를 적어 두고 필요할 때 주석을 바꿔 씁니다.

```text
mod policy 'MyPartPolicy' state 'In Work'
    add
    #remove
        user VPLMCreator key MyPartCreatorInWorkOwner01
            checkout,show,read single organization single project context owner
;
```

| 바꾸려는 것 | 명령 |
| --- | --- |
| state 추가 | `mod policy P add state 'S' before 'Release' ...` |
| state 삭제 | `mod policy P remove state 'S'` |
| allstate 전체 삭제 | `mod policy P remove allstate` |
| 기본 규칙 | `mod policy P state 'S' public 'none' owner 'all'` |
| type 추가 | `mod policy P add type 'MyNewType'` |

## trigger

state 이벤트에 프로그램을 붙입니다. 프로젝트는 모두 `emxTriggerManager` 를 거치고, `input` 에는 trigger 설정 객체(`eService Trigger Program Parameters`)의 이름을 적습니다. 여러 개는 공백으로 구분합니다.

```text
mod policy 'MyPartPolicy' state 'In Work'
    add trigger Promote Check "emxTriggerManager" input "MyPolicyInWorkPromoteCheck";
mod policy 'MyPartPolicy' state 'In Work'
    add trigger Promote Action "emxTriggerManager" input "MyPolicyInWorkPromoteAction MyNotifyAction";
```

| 종류 | 실행 시점 |
| --- | --- |
| `Check` | 이벤트 전. 실패하면 이벤트를 막음 |
| `Action` | 이벤트 후 |
| `Override` | 이벤트의 기본 동작 대신 실행되는 것으로 보입니다 (예: type 의 `Delete override`) |

이벤트는 `promote`, `demote`, `approve`, `reject` 등이 있습니다. type 에도 같은 방식으로 `Create`, `Delete`, `ModifyAttribute` 등의 trigger 를 붙입니다 (`mod type ... add trigger ...`).

`input` 에 적은 이름은 실제로 실행할 JPO 를 가리키는 business object 입니다 (`mql/12.trigger/`).

```text
add bus 'eService Trigger Program Parameters' 'MyPolicyInWorkPromoteCheck' 'checkRequired'
    policy 'eService Trigger Program Policy'
    vault  'eService Administration'
    'eService Program Name'       'MyPartTrigger'
    'eService Method Name'        'checkRequired'
    'eService Program Argument 1' '${OBJECTID}'
    'eService Sequence Number'    '0'
    'eService Error Type'         'Error'
;
```

| 템플릿 규칙 | 내용 |
| --- | --- |
| name | `접두어 + 대상 이름 + 적용 시점`. 예: `MyPolicyInWorkPromoteCheck` |
| revision | 실행할 메서드 이름 |
| `eService Program Name` / `eService Method Name` | JPO 클래스와 메서드 |
| state | `Active` 여야 실행되는 것으로 보입니다. 템플릿은 만든 뒤 `promote bus` 로 활성화하고, 끌 때 `demote bus` 를 씀 |

## 확인하기

```text
print policy 'MyPartPolicy';
print policy 'MyPartPolicy' select state dump |;
print policy 'MyPartPolicy' select state[In Work].name dump;
print bus 'MyPart' 'MP-0000001' '1' select current current.access dump |;
```

- `print policy` 만 실행하면 모든 state 와 권한 규칙이 나옵니다. 반영 후 이 결과로 확인합니다.
- `current.access` 는 **지금 로그인한 사용자** 가 그 객체에 가진 권한 목록입니다. 권한 문제를 볼 때 해당 사용자로 로그인해서 확인합니다.

## 문법에는 있지만 프로젝트에서 안 쓰는 것

| 절 | 내용 |
| --- | --- |
| `signature` | state 승인 서명 (approve / reject / ignore) |
| `notify`, `route` | state 진입 시 알림, 소유권 이전 |
| `block`, `unblock` | state 숨기기 |
| `action`, `check` (state 절) | 예전 방식. trigger 로 대체 |
| `minorsequence`, `majorsequence` | 리비전을 두 단계로 나눌 때 |

프로젝트의 결재는 이 기능 대신 Route(`Object Route` 관계)와 trigger 로 처리하는 것으로 보입니다. 결재 대상 type 마다 `Object Route` 의 from 쪽에 type 을 추가해 둔 것이 그 흔적입니다.
