# 데이터 모델 개요 <Badge type="info" text="원본 분석" />

3DSpace 의 데이터는 두 층으로 나뉩니다. **스키마(admin 객체)** 는 "어떤 종류의 데이터가 어떤 칸을 갖고, 어떤 상태를 거치며, 누가 무엇을 할 수 있는가" 를 정합니다. **데이터(business object, connection)** 는 그 스키마에 맞춰 실제로 만들어진 객체와 연결입니다. 스키마는 MQL 로 정의하고, 프로젝트에서는 `mql/` 폴더에 객체 하나당 파일 하나로 관리합니다.

::: info 근거
`mql/01.attribute/*.mql`, `mql/02.type/*.mql`, `mql/03.policy/*.mql`, `mql/04.relationship/*.mql`, `mql/05.role/*.mql`, `mql/20.rule/*.mql`, `mql/13.generator/*.mql`, 각 폴더의 `*_Sample.mql` 템플릿. 코드 쪽: `jpo/emxChangeBase_mxJPO.java`, `jpo/emxECOBase_mxJPO.java`, `jpo/com/dassault_systemes/enovia/geographyconfiguration/ui/CountryBase_mxJPO.java` 의 `PropertyUtil.getSchemaProperty`, `properties/emxFrameworkStringResource_ko.properties`
:::

## 두 층

| 층 | 무엇 | 예 | 만드는 명령 |
| --- | --- | --- | --- |
| 스키마 (admin) | 데이터의 틀 | type `Part`, attribute `Originator`, policy `EC Part`, relationship `EBOM` | `add type`, `add attribute`, `add policy` ... |
| 데이터 (business object) | 틀에 맞춘 실제 객체 | `Part` `P-0001` `A` | `add bus`, `mod bus` |
| 데이터 (connection) | 두 객체 사이의 연결 | `EBOM` 연결 하나 | `connect bus`, `mod connection` |

## admin 객체 한눈에

| 객체 | 역할 | 프로젝트 폴더 | 심볼릭 이름 접두어 | 문서 |
| --- | --- | --- | --- | --- |
| attribute | 값 하나를 담는 칸. 자료형, 기본값, 선택지(range) | `01.attribute` | `attribute_` | [Attribute, Type ...](/schema/admin#attribute) |
| type | 객체의 종류. attribute 묶음. 상속(`derived`) 가능 | `02.type` | `type_` | [Attribute, Type ...](/schema/admin#type) |
| policy | 상태(state) 흐름, 리비전 규칙, 상태별 권한 | `03.policy` | `policy_`, 상태는 `state_` | [Policy](/schema/policy) |
| relationship | 두 type 을 잇는 연결의 종류. 연결에도 attribute 가능 | `04.relationship` | `relationship_` | [Attribute, Type ...](/schema/admin#relationship) |
| role | 사용자 역할. 권한 규칙과 화면 노출 조건에서 씀 | `05.role` | `role_` | [Attribute, Type ...](/schema/admin#role) |
| rule | 여러 policy 에서 다시 쓰는 권한 묶음 | `20.rule` | `rule_` | [Policy](/schema/policy#rule) |
| trigger | type / policy 이벤트에 붙는 프로그램 | `12.trigger` | - | [Policy](/schema/policy#trigger) |
| vault, store, format | 객체 저장 구역, 파일 저장소, 파일 형식 | 프로젝트에서는 OOTB 것만 씀 | `vault_` | - |

`06.command` 부터 `11.portal`, `21.page` 까지는 화면(UI) 정의입니다. 이 섹션에서는 다루지 않습니다.

## 관계 그림

```text
              ┌─────────────┐
              │  attribute  │  값 칸 (string, integer, real, date)
              └──────┬──────┘
          attribute  │  attribute
       ┌─────────────┴──────────────┐
       ▼                            ▼
┌─────────────┐   from / to   ┌──────────────┐
│    type     │◀──────────────│ relationship │
│  (derived)  │               └──────────────┘
└──────┬──────┘
       │ type 절 (이 policy 를 쓸 수 있는 type)
       ▼
┌─────────────┐  state 마다   ┌──────────────────────────┐
│   policy    │──────────────▶│ 권한: owner / public /    │
│ state 목록   │               │ user(role) / rule        │
└─────────────┘               └────────────┬─────────────┘
                                           │ user ROLE
                                     ┌─────▼─────┐
                                     │   role    │
                                     └───────────┘
```

- attribute 는 혼자서는 쓰이지 않습니다. type 이나 relationship 에 붙어야 값을 가질 수 있습니다.
- type 과 policy 는 서로 독립입니다. policy 의 `type` 절에 이름을 적어야 그 type 의 객체를 그 policy 로 만들 수 있습니다.
- relationship 은 `from` 쪽과 `to` 쪽에 올 수 있는 type 을 적습니다. `'All'` 이면 아무 type 이나 됩니다.
- 권한은 policy 의 state 안에 적습니다. 대상은 owner, public, 특정 role(`user 역할이름`) 입니다.

::: tip 정의 순서
위 그림의 화살표 방향대로 먼저 있어야 합니다. 그래서 폴더 번호가 `01.attribute` → `02.type` → `03.policy` → `04.relationship` 순서이고, 운영 반영 스크립트도 이 순서로 실행합니다. [작성 규칙](/schema/conventions#운영-반영-97-prod-mql)
:::

## business object 식별

business object 는 **type + name + revision** 세 값으로 구별합니다 (흔히 TNR). 같은 type 안에서 name 과 revision 이 같은 객체는 둘일 수 없습니다.

```text
add bus 'MyPart' 'MP-0000001' '1'
    policy 'MyPartPolicy'
    vault  'eService Production'
    MyAttr 'value';
```

| 값 | 설명 |
| --- | --- |
| type, name, revision | 식별자. revision 은 policy 의 `sequence` 규칙으로 정해짐 |
| policy | 만들 때 정함. 이후 상태(`current`) 와 권한이 이 policy 를 따름 |
| vault | 저장 구역. 업무 데이터는 `eService Production`, 채번기 같은 관리 객체는 `eService Administration` |
| owner | 소유자. 권한 규칙의 `owner` 와 `context owner` 가 이 값을 봄 |
| current | 현재 state 이름 |
| id | 시스템이 붙이는 고유 id. 화면과 코드는 보통 이 값으로 객체를 찾음 |

name 은 보통 채번기(`eService Object Generator` / `eService Number Generator`)가 접두어 + 일련번호로 만듭니다. [작성 규칙](/schema/conventions#채번기-13-generator)

## 심볼릭 이름

코드에서는 실제 이름 대신 **심볼릭 이름**(`type_Part`, `policy_ECPart` ...)으로 스키마를 찾습니다. 실제 이름이 바뀌어도 코드를 고치지 않기 위해서입니다.

스키마를 만든 뒤 아래 한 줄로 등록합니다. 이름에 공백이 있으면 심볼릭 이름에서는 공백을 뺍니다 (`EC Part` → `policy_ECPart`).

```text
add property type_MyPart on program eServiceSchemaVariableMapping.tcl to type 'MyPart';
```

Java 에서는 이렇게 읽습니다.

```java
String TYPE_PART   = PropertyUtil.getSchemaProperty(context, "type_Part");
String POLICY_PART = PropertyUtil.getSchemaProperty(context, "policy_ECPart");
String REL_EBOM    = PropertyUtil.getSchemaProperty(context, "relationship_EBOM");

String stateActive = PropertyUtil.getSchemaProperty(context, "policy", policyName, "state_Active");
```

- state 는 policy 안의 property(`property state_InWork value 'In Work'`) 로 등록합니다. 그래서 policy 이름과 함께 찾습니다.
- 프로젝트 코드는 상수 클래스 한 곳에 `getSchemaProperty` 결과를 모아 두고 씁니다.

::: warning 등록을 빠뜨리면
`getSchemaProperty` 는 `eServiceSchemaVariableMapping.tcl` 에 붙은 property 를 보고 실제 이름을 찾는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> (템플릿의 심볼릭 이름과 코드의 인자가 같은 형식). 등록이 없으면 코드가 실제 이름을 얻지 못하므로, 새 스키마를 만들면 `add property ... on program eServiceSchemaVariableMapping.tcl` 를 꼭 함께 실행합니다. 프로젝트의 모든 템플릿(`*_Sample.mql`)이 이 줄로 끝납니다.
:::

## 화면에 보이는 이름

스키마 이름은 영어 그대로 저장되고, 화면 글자는 `emxFrameworkStringResource_ko.properties` 같은 문자열 파일에서 가져옵니다. 키 안의 공백은 `_` 로 바꿉니다.

| 대상 | 키 형식 | 예 |
| --- | --- | --- |
| type | `emxFramework.Type.타입` | `emxFramework.Type.Part` |
| attribute | `emxFramework.Attribute.속성` | `emxFramework.Attribute.Unit_of_Measure` |
| range 값 | `emxFramework.Range.속성.값` | `emxFramework.Range.MyAttr.Y` |
| policy | `emxFramework.Policy.정책` | `emxFramework.Policy.EC_Part` |
| state | `emxFramework.State.정책.상태` | `emxFramework.State.EC_Part.Release` |
| relationship | `emxFramework.Relationship.관계` | - |
| role | `emxFramework.Role.역할`, `emxFramework.RoleDescription.역할` | - |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [Attribute, Type, Relationship, Role](/schema/admin) | 각 객체를 만드는 MQL 과 절(clause) |
| [Policy (상태와 권한)](/schema/policy) | state, 리비전, 권한 문법, rule, trigger |
| [MQL 문법과 조회](/schema/mql) | 명령 형식, print / list / temp query / expand, 데이터 명령 |
| [mql 폴더 작성 규칙](/schema/conventions) | 폴더 구조, 헤더 템플릿, OOTB 수정 규칙, 운영 반영 |
