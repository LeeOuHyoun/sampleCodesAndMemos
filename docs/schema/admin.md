# Attribute, Type, Relationship, Role <Badge type="info" text="원본 분석" />

스키마 객체 네 가지를 만드는 MQL 과 자주 쓰는 절(clause)을 정리합니다. Policy 는 내용이 많아 [따로](/schema/policy) 둡니다. 모든 정의 끝에는 심볼릭 이름 등록 한 줄이 붙습니다. [심볼릭 이름](/schema/#심볼릭-이름)

샘플: [01_attribute_type.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/SchemaSample/01_attribute_type.mql), [03_relationship_role.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/SchemaSample/03_relationship_role.mql)

::: info 근거
`mql/01.attribute/Attribute_Sample.mql` 와 정의 파일 약 370 개, `mql/02.type/Type_Sample.mql` 와 정의 파일 약 40 개, `mql/04.relationship/RelationshipSample.mql` 와 OOTB 관계 수정 파일(`Classified_Item.mql`, `Object_Route.mql`), `mql/05.role/*.mql`, `mql/12.trigger/*.mql`, `mql/97.prod-mql/*/*.mql`. 코드 쪽: `jpo/emxCommonIssueBase_mxJPO.java` (`print type ... kindof`), 사용자 관리 JPO 의 `mod person ... assign role`
:::

## attribute

```text
add attribute 'MyColor'
    type string
    description 'Color code'
    default ''
    range = 'RED'
    range = 'BLUE'
    notmultiline
    nothidden
    property version value 'R2025x'
    property application value 'Framework'
    property installer value 'XX'
    property 'original name' value 'MyColor'
    property 'installed date' value '01-01-2025'
    ;
add property attribute_MyColor on program eServiceSchemaVariableMapping.tcl to attribute MyColor;
```

### 자료형

| `type` | 값 | 기본값 예 | 비고 |
| --- | --- | --- | --- |
| `string` | 글자 | `''` | 프로젝트에서 가장 많이 씀 (약 280 개) |
| `real` | 실수 | `0` | 함량, 비율 등 |
| `integer` | 정수 | `0` | |
| `date` | 날짜 | `''` | 값 형식은 서버 설정을 따름. 예: `'12/31/9999'` |

`type String` 처럼 대문자로 쓴 파일도 있습니다. 키워드는 대소문자를 가리지 않는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

### 절

| 절 | 뜻 |
| --- | --- |
| `description '...'` | 설명 |
| `default '...'` | 새 객체의 초기값 |
| `range = '값'` | 선택지 하나. 여러 줄 쓰면 목록이 됨. 화면에서는 콤보로 나옴 |
| `multiline` / `notmultiline` | 여러 줄 입력 허용 여부. 긴 글은 `multiline` |
| `multivalue` | 값 여러 개 저장 (다중 선택) |
| `resetonclone` | 복사(clone) 한 객체에서는 기본값으로 되돌림 |
| `resetonrevision` | 새 리비전에서는 기본값으로 되돌림 |
| `nothidden` / `hidden` | 관리 도구에서 숨김 여부 |

range 는 파일에 따라 `range = 'Y'`, `range equal 'Y'` 두 가지로 씁니다. 나중에 고칠 때는 `mod attribute` 에 `add range` / `remove range` 를 씁니다.

```text
mod attribute 'MyColor' add range = 'GREEN';
mod attribute 'MyColor' remove range = 'RED';
mod attribute 'MyColor' default 'BLUE';
mod attribute 'MyDesc' multiline;
mod attribute 'MyDate' resetonclone resetonrevision;
```

::: tip 선택지 표시 이름
range 값은 저장되는 코드값입니다. 화면 글자는 `emxFramework.Range.속성.값` 키로 번역합니다. 그래서 range 값은 `Y`, `00`, `KR` 처럼 짧은 영문 코드로 두는 편이 많습니다.
:::

## type

```text
add type 'MyPart'
    description 'My Part'
    derived 'Part'
    attribute 'MyColor'
    attribute 'MyWeight'
    property version value 'R2025x'
    property application value 'Framework'
    property installer value 'XX'
    property 'original name' value 'MyPart'
    property 'installed date' value '01-01-2025'
;
add property type_MyPart on program eServiceSchemaVariableMapping.tcl to type MyPart;
```

| 절 | 뜻 |
| --- | --- |
| `derived 'OOTB타입'` | 부모 type. 부모의 attribute 를 물려받음. 템플릿 설명은 "보통 OOTB type 을 상속" |
| `abstract 'FALSE'` | `TRUE` 면 직접 객체를 만들 수 없는 분류용 type |
| `attribute '이름'` | 붙일 attribute. 줄마다 하나 |
| `!hidden` / `nothidden` | 숨김 여부 |
| `trigger 이벤트 종류 프로그램 input '...'` | 이벤트 trigger. 보통 나중에 `mod type` 으로 붙임 |

`derived` 를 쓰지 않은 type 도 있습니다. 이 경우 최상위 type 이 됩니다.

### 나중에 고치기

```text
mod type 'MyPart' add attribute 'MyNewAttr';
mod type 'MyPart' remove attribute 'MyOldAttr';
mod type 'MyPart' add trigger Delete Check emxTriggerManager input 'MyTypeDeleteCheck';
```

::: warning attribute 가 먼저 있어야 합니다
`mod type ... add attribute` 는 attribute 가 이미 있어야 성공합니다. 소스에도 "attribute 가 먼저 있어야 한다" 는 메모가 있습니다. 새 attribute 와 type 변경을 함께 반영할 때는 `01.attribute` 파일을 먼저 실행합니다.
:::

::: warning remove attribute
`mod type ... remove attribute` 를 하면 그 type 의 기존 객체에 있던 값도 사라지는 것으로 보입니다. <Badge type="danger" text="검증 필요" /> 운영 데이터가 있는 type 에서는 값을 먼저 옮겨 두고 실행합니다.
:::

### 상속 확인

상속 관계는 코드에서도 자주 확인합니다.

```text
print type 'MyPart' select derived dump;
print type 'MyPart' select kindof dump |;
print type 'Part' select derivative dump |;
```

| select | 결과 |
| --- | --- |
| `derived` | 바로 위 부모 |
| `kindof` | 자신과 모든 조상 |
| `derivative` | 모든 자식 type |

객체 조회식에서는 `type.kindof[Part]` 로 "Part 이거나 그 자식인가" 를 씁니다. [MQL 조회](/schema/mql#select-표현식)

## relationship

```text
add relation 'XXRelMyPartToMyDoc'
    description 'MyPart to MyDoc'
    attribute 'MySeq'
    nothidden
    from
        type        'MyPart'
        cardinality 'many'
        revision    'none'
        clone       'none'
    to
        type        'MyDoc','Document'
        cardinality 'many'
        revision    'none'
        clone       'none'
    property version value 'R2025x'
    property application value 'Framework'
    property installer value 'XX'
    property 'original name' value 'XXRelMyPartToMyDoc'
    property 'installed date' value '01-01-2025'
    ;
add property relationship_XXRelMyPartToMyDoc on program eServiceSchemaVariableMapping.tcl to relationship 'XXRelMyPartToMyDoc';
```

`add relation`, `add relationship`, `mod rel` 모두 씁니다 (줄임말).

| 절 | 뜻 |
| --- | --- |
| `attribute '이름'` | 연결에 붙는 값. 예: 순번, 함량 |
| `from` / `to` | 방향. 아래 절을 각각 적음 |
| `type 'A','B'` | 그 쪽에 올 수 있는 type. 쉼표로 여러 개. `'All'` 이면 전부 |
| `cardinality 'many'` / `'one'` | 그 쪽에 연결이 여러 개 가능한지 |
| `revision` | 그 쪽 객체가 revise 될 때 연결 처리 |
| `clone` | 그 쪽 객체가 복사될 때 연결 처리. 값은 `revision` 과 같음 |

정의 확인은 `print relationship 'XXRelMyPartToMyDoc' select fromtype totype dump` 로 합니다.

### revision / clone 값

| 값 | 템플릿 설명 |
| --- | --- |
| `none` | 새 객체로 연결을 가져가지 않음 |
| `float` | 연결이 새 객체로 옮겨감. 이전 객체와의 연결은 끊김 |
| `replicate` | 이전 객체 연결은 그대로 두고 새 객체에도 연결을 만듦 |

### OOTB relationship 에 type 추가

OOTB 관계(`Object Route`, `Classified Item` ...)를 새 type 에서도 쓰려면 관계를 새로 만들지 않고 `from` / `to` 쪽에 type 을 추가합니다.

```text
copy relationship 'Object Route' 'Object Route_OOTB';
mod relationship 'Object Route' from add type 'MyPart';
mod relationship 'Classified Item' to add type 'MyPart';
```

결재(Route) 를 붙이는 `Object Route`, 분류에 넣는 `Classified Item` 이 이런 식으로 확장되어 있습니다. `copy` 로 원본을 백업하는 규칙은 [작성 규칙](/schema/conventions#ootb-수정-규칙) 을 봅니다.

## role

```text
add role 'XXMyEngineer'
    description 'My data create, edit'
property 'application'    value 'Framework'
property 'installed date' value '2025-01-01'
property 'installer'      value 'XX'
property 'original name'  value 'XXMyEngineer'
property 'version'        value 'R427'
;
add property 'role_XXMyEngineer' on program eServiceSchemaVariableMapping.tcl to role 'XXMyEngineer';
```

role 은 정의 자체는 짧고, **쓰는 곳** 이 여러 군데입니다.

| 쓰는 곳 | 형태 | 예 |
| --- | --- | --- |
| 사용자에게 부여 | `mod person 로그인 assign role 역할` / `remove assign role` | 사용자 관리 JPO |
| 부여 확인 | `print person 로그인 select assignment dump` | |
| 화면 노출 조건 | command 의 `Access Expression` 설정 | `context.user.isassigned[XXMyEngineer]` |
| policy 권한 | `user 역할 key ... 권한목록` | [Policy 권한](/schema/policy#권한-access) |
| 로그인 컨텍스트 | `ctx::역할.조직.협업공간` | `set context ... role 'ctx::VPLMProjectLeader.Company Name.MySpace'` |

### OOTB role

프로젝트 policy 의 권한은 대부분 OOTB 3DEXPERIENCE role 로 적습니다.

| role | 코드에서 본 쓰임 |
| --- | --- |
| `VPLMCreator` | 일반 작성자. policy 권한의 기본 대상 |
| `VPLMProjectLeader` | 팀장급. 승인, 소유자 변경 같은 넓은 권한 |
| `VPLMAdmin`, `VPLMProjectAdministrator` | 관리자 |
| `VPLMViewer` | 조회 전용 |

::: tip 커스텀 role 과 OOTB role
이 프로젝트에서 커스텀 role(`XX...Engineer`) 은 command 의 노출 조건(`isassigned`)에만 쓰이고, policy 에는 나오지 않습니다. policy 의 `user` 대상은 `VPLMCreator`, `VPLMProjectLeader` 가 대부분(각각 약 450 곳)입니다. 객체 권한은 OOTB role + 조직 / 협업공간 조건으로 거는 방식입니다. role 이름에 따른 화면 글자는 `emxFramework.Role.역할` 키에 둡니다.
:::
