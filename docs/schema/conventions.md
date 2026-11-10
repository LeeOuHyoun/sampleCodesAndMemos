# mql 폴더 작성 규칙 <Badge type="info" text="원본 분석" />

프로젝트는 스키마와 UI 정의를 `mql/` 폴더에 **객체 하나당 파일 하나** 로 둡니다. 폴더 번호는 실행 순서이고, 파일마다 같은 헤더 템플릿과 팀 규칙이 들어 있습니다. 이 페이지는 그 구조와 규칙을 정리합니다. 이름과 값은 일반 예(`XX` 접두어)로 바꿨습니다.

::: info 근거
`mql/` 폴더 구조와 파일 수, 각 폴더의 템플릿(`Attribute_Sample.mql`, `Type_Sample.mql`, `Policy_Sample.mql`, `RelationshipSample.mql`, `Trigger_Sample.mql`), 정의 파일의 헤더와 property 블록, `mql/97.prod-mql/template-date.mql` 와 월별 폴더, `mql/98.migration/dev`, `mql/98.migration/prd`, `mql/13.generator/*.mql`, `mql/99.config/*.xml`
:::

## 폴더 구조

| 폴더 | 내용 | 파일 수 |
| --- | --- | --- |
| `01.attribute` | attribute | 약 370 |
| `02.type` | type | 약 40 |
| `03.policy` | policy, 권한 설계 메모 | 약 20 |
| `04.relationship` | relationship, OOTB 관계 확장 | 약 55 |
| `05.role` | 커스텀 role | 9 |
| `06.command` ~ `11.portal` | 화면: command, menu, table, webform, channel, portal | 수십 ~ 수백 |
| `12.trigger` | trigger 설정 객체 + `mod type / policy ... add trigger` | 약 20 |
| `13.generator` | 채번기 객체 | 약 60 |
| `14.tcl` | 채번용 OOTB tcl 프로그램 사본으로 보입니다 <Badge type="danger" text="검증 필요" /> | 4 |
| `19.program`, `20.rule`, `21.page` | program, rule, page | 몇 개 |
| `15.inquiry` ~ `18.dimension`, `22.interface` ~ `25.object` | 자리만 있고 비어 있음 | 0 |
| `97.prod-mql` | 운영 반영용 묶음 스크립트 (월별) | |
| `98.migration` | 데이터 이관 스크립트 (dev / prd) | |
| `99.config` | 검색 인덱서 설정 XML (dev / prod) | 3 |

::: tip 번호 = 실행 순서
attribute 가 있어야 type 에 붙이고, type 이 있어야 policy 와 relationship 에 적을 수 있습니다. 운영 반영 스크립트도 `01` → `02` → `03` ... 순서로 파일을 실행합니다.
:::

## 파일 이름

| 대상 | 파일 이름 | 예 |
| --- | --- | --- |
| 커스텀 객체 | 객체 이름 그대로 | `XXMyColor.mql`, `XXRelMyPartToMyDoc.mql` |
| OOTB 수정 | OOTB 이름. 공백은 `_` 로 바꾸거나 그대로 | `Object_Route.mql`, `Project_Space.mql`, `Virtual Intermediate.mql` |
| 템플릿 | `종류_Sample.mql` | `Policy_Sample.mql` |
| 채번기 | `eService_Object_Generator_타입.mql`, `eService_Number_Generator_타입.mql`, 또는 둘을 합친 `type_타입.mql` | `type_XXMyPart.mql` |

채번기 파일 이름은 `Generator` / `generator` 대소문자가 섞여 있습니다. 새로 만들 때는 한 가지로 맞춥니다.

## 객체 이름

| 종류 | 규칙 (소스에서 보이는 형태) | 예 |
| --- | --- | --- |
| 공통 | 프로젝트 접두어 + 낙타 표기. 공백 없음 | `XXMyPart` |
| attribute | 접두어 + 업무 + 항목. Y/N 값은 `YN` 으로 끝냄 | `XXSampleName`, `XXUrgentYN` |
| relationship | 접두어 + `Rel` + From + `To` + To | `XXRelMyPartToMyDoc` |
| policy | 접두어 + 이름 + `Policy` | `XXMyPartPolicy` |
| role | 접두어 + 업무 + `Engineer` | `XXMyEngineer` |
| trigger 객체 | 접두어 + 대상 + 시점 | `XXPolicyMyPartInWorkPromoteCheck` |

공백이 없으면 심볼릭 이름(`type_XXMyPart`)과 실제 이름이 같아져서 찾기 쉽습니다.

## 헤더 템플릿

모든 정의 파일은 이 헤더로 시작합니다.

```text
################################################################################################
# Created : [생성 날짜]
# Admin Type : [attribute | type | policy | relationship | role ...]
# Name : [객체 이름]
# Create by [작성자]
# Description : [설명]
################################################################################################
```

템플릿(`*_Sample.mql`)에는 그 아래에 팀 규칙이 붙어 있습니다.

| 번호 | 규칙 |
| --- | --- |
| 1 | OOTB 를 고칠 때는 반드시 먼저 `copy` 하고 나서 바꾼다 |
| 2 | 예: `copy [종류] '[OOTB 이름]' '[OOTB 이름]_OOTB';` |
| 3 | OOTB 는 지우고 다시 만들지 않고 `mod` 로 고친다. 지우고 다시 만들어도 문제없는 것은 table, webform 뿐 |
| 4 | MQL 구문에는 한글, 특수기호를 쓰지 않는다 (글자 깨짐, 인코딩 문제) |

템플릿 파일은 모든 줄이 `#` 로 주석 처리되어 있어 실수로 실행해도 아무 일이 없습니다. 복사해서 주석을 풀어 씁니다.

## 본문 순서

```text
#del type 'XXMyPart';
add type 'XXMyPart'
    description 'My Part'
    derived 'Part'
    attribute 'XXMyColor'
    property version value 'R2025x'
    property application value 'Framework'
    property installer value 'XX'
    property 'original name' value 'XXMyPart'
    property 'installed date' value '01-01-2025'
;
add property type_XXMyPart on program eServiceSchemaVariableMapping.tcl to type XXMyPart;

# [날짜] [요청 번호] [변경 내용]
mod type 'XXMyPart'
    add attribute 'XXMyNewAttr'
;
```

1. `#del ...` : 다시 만들 때 쓰는 삭제문. **주석으로 둔다.**
2. `add ...` : 정의. 템플릿의 절 순서를 따름.
3. property 블록 : 아래 표.
4. `add property ... on program eServiceSchemaVariableMapping.tcl` : 심볼릭 이름 등록.
5. 나중 변경 : 처음 `add` 문을 고치지 않고, 파일 끝에 `mod ...` 를 날짜와 요청 번호 주석과 함께 덧붙이는 방식입니다. 운영에 이미 반영된 객체는 `mod` 만 다시 실행하면 되기 때문으로 보입니다. <Badge type="danger" text="검증 필요" />

::: warning #del 주석
`#del` 의 주석을 풀고 파일 전체를 다시 실행하면 객체를 지우고 다시 만듭니다. 정의를 지우면 그 attribute 값이나 연결이 함께 사라지는 것으로 보입니다. <Badge type="danger" text="검증 필요" /> 운영 데이터가 있는 객체는 `mod` 로만 고칩니다.
:::

### property 블록

| property | 값 | 비고 |
| --- | --- | --- |
| `version` | `R2025x` | 최근 파일은 `R427` (R2025x 의 내부 릴리스 번호로 보입니다 <Badge type="danger" text="검증 필요" />) |
| `application` | `Framework` | 일부 policy 는 `ProductLine` |
| `installer` | 프로젝트 코드 (`XX`) | 템플릿의 예시 값은 실제 파일과 다름. 실제 파일 값을 따름 |
| `original name` | 객체 이름 그대로 | |
| `installed date` | 날짜 | 형식이 `DD-MM-YYYY`, `MM-DD-YYYY`, `YYYY-MM-DD` 로 섞여 있음. 한 가지로 정해 씀 |

policy 는 여기에 `property state_XX value '상태이름'` 이 state 수만큼 더 붙습니다.

## OOTB 수정 규칙

```text
copy policy 'Product' 'Product_OOTB';
mod policy 'Product' allstate add revoke public key MyRevoke read,show filter "...";

copy relationship 'Classified Item' 'Classified Item_OOTB';
mod relationship 'Classified Item' to add type 'XXMyPart';
```

| 할 일 | 방법 |
| --- | --- |
| 원본 보관 | `copy 종류 '원본' '원본_OOTB'`. `_OOTB` 사본이 원래 정의의 기록 |
| 고치기 | `mod` 로 필요한 부분만. OOTB state 를 지우고 다시 만드는 블록은 주석으로만 남아 있음 |
| 새로 만들기 | OOTB command 를 `copy command 'OOTB' 'XXNew'` 로 복사해 새 것을 만드는 경우도 있음 |

이미 사본을 만든 파일에서는 `copy` 줄이 주석 처리되어 있기도 합니다. 같은 이름의 사본이 있으면 `copy` 가 실패하기 때문으로 보입니다. <Badge type="danger" text="검증 필요" />

## 권한 블록 표기

policy 파일의 권한 규칙은 블록마다 다음 형태입니다. [Policy](/schema/policy#권한-규칙-고치기)

```text
    ##########################
    #### XXMyPart [B] ###
    # In Work : 작성자만 편집
    # Release : 모두 읽기
    ##########################
mod policy 'XXMyPartPolicy' state 'In Work'
    add
    #remove
        user VPLMCreator key XXMyPartVPLMCreatorInWorkOwnerAccess01
            checkout,show,read,modify single organization single project context owner filter "( type == 'XXMyPart' )"
;
    ##########################
    #### XXMyPart [E] ###
    ##########################
```

- `[B]` / `[E]` 로 블록의 시작과 끝을 표시합니다. type 별, 단계(Phase)별로 나눕니다.
- 블록 머리 주석에 state 별 의도를 한글로 적습니다 (주석이라 한글 허용).
- `add` 아래 `#remove` 는 같은 규칙을 지울 때 주석을 바꿔 쓰기 위한 자리입니다.

## 채번기 (13.generator)

새 type 의 name 을 `접두어 + 일련번호` 로 자동으로 붙이려면 type 마다 채번기 객체 두 개를 만들고 연결합니다.

```text
add bus 'eService Object Generator' 'type_XXMyPart' ''
    policy 'eService Object Generator'
    vault  'eService Administration'
    'eService Name Prefix'           'MP-'
    'eService Name Suffix'           ''
    'eService Processing Time Limit' '60'
    'eService Retry Count'           '5'
    'eService Retry Delay'           '60'
    'eService Safety Policy'         'policy_XXMyPartPolicy'
    'eService Safety Vault'          'vault_eServiceAdministration'
;
add bus 'eService Number Generator' 'type_XXMyPart' ''
    policy 'eService Object Generator'
    vault  'eService Administration'
    'eService Next Number' '0000000001'
;
connect bus 'eService Object Generator' 'type_XXMyPart' ''
    relationship 'eService Number Generator'
    to 'eService Number Generator' 'type_XXMyPart' ''
;
```

| 값 | 뜻 |
| --- | --- |
| name `type_XXMyPart` | 대상 type 의 **심볼릭 이름** |
| revision `''` | 비움 |
| `eService Name Prefix` | 이름 앞 글자 |
| `eService Next Number` | 다음 번호. 자릿수가 그대로 이름 자릿수 |
| `eService Safety Policy` / `Safety Vault` | 만들 객체의 policy / vault 심볼릭 이름 |

연결은 `connect bus` 로 하거나 `add connection 'eService Number Generator' from ... to ...` 로 합니다. 두 형태가 모두 쓰입니다.

## 운영 반영 (97.prod-mql)

개발 서버에서 만든 정의를 운영에 옮길 때 쓰는 묶음 스크립트입니다.

```text
97.prod-mql/
├─ template-date.mql      01.attribute ~ 99.config 제목만 있는 빈 틀
├─ YYMM/                  반영 월
│  ├─ DD.mql              그 날 반영할 명령
│  └─ DD-기능-v1.mql       기능 단위 묶음
└─ YYMM.zip               지난 달 묶음
```

두 가지 쓰는 방식이 있습니다.

| 방식 | 내용 |
| --- | --- |
| 명령을 직접 적기 | `template-date.mql` 을 복사해 `# 01.attribute` 아래에 `mod attribute ...`, `# 02.type` 아래에 `mod type ...` 처럼 순서대로 적음 |
| 정의 파일 `run` | `run [작업폴더]\mql\01.attribute\XXMyColor.mql;` 줄을 폴더 번호 순서로 나열. 빌드 서버 작업 폴더 경로를 씀 |

::: tip 반영 순서
`run` 방식 파일을 보면 attribute 8 개 → type 2 개 → policy → relationship 5 개 → command → menu → table → webform → channel → portal → trigger → 채번기 순서로 적혀 있습니다. 새 기능 하나를 옮길 때 이 순서를 그대로 따릅니다.
:::

## 데이터 이관 (98.migration)

```text
98.migration/
├─ dev/YYMM/DD.mql     개발 서버용
└─ prd/YYMM/DD.mql     운영 서버용 (같은 이름)
```

파일 형태는 같습니다.

```text
verb on;
set context user 'adminUser' role 'ctx::VPLMProjectLeader.Company Name.MySpace';
trace type mql filename 'YYYYMMDD_dev_mig_1.mql.log';
add bus 'XXMyPart' 'MP-0000001' '1' policy 'XXMyPartPolicy' vault 'eService Production' description 'Migration data' XXMyColor 'RED';
mod bus 'XXMyPart' 'MP-0000001' '1' XXMyColor 'BLUE';
connect bus 'XXMyPart' 'MP-0000001' '1' relationship 'XXRelMyPartToMyDoc' to 'XXMyDoc' 'MD-0000001' '1';
trace off;
```

- 엑셀 같은 원본에서 한 줄 = 명령 하나로 만들어 낸 것으로 보입니다. <Badge type="danger" text="검증 필요" />
- 이관 데이터의 name 은 채번기를 거치지 않고 직접 적습니다. 이관한 번호와 채번기의 `eService Next Number` 가 겹치지 않도록 번호 구간을 나누거나 다음 번호를 맞춰 두어야 하는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

::: warning
이관 파일에는 `set context ... password` 가 평문으로 들어 있는 것이 있습니다. 비밀번호는 파일에 남기지 않습니다. 이관 데이터의 한글 값은 명령 안에 들어가므로 파일 인코딩을 서버와 맞춥니다.
:::

## 검색 설정 (99.config)

`config.xml`, `dev-config.xml`, `prod-config.xml` 은 전문 검색 인덱서 설정입니다. 커스텀 type 과 attribute 를 검색 화면에서 찾으려면 여기에 항목을 더합니다.

```xml
<BOTYPE name="XXMyPart" includes="basic,XXMyPartField"/>
<FIELD name="XXMyPart.XXMyColor" customized="true" fts="true" searchable="true"
       select="attribute[XXMyColor]" sixw="ds6wg:XXMyPart.XXMyColor" type="STRING"/>
```

서버별 파일이 따로 있고 서버 주소 등 내용이 서로 다르므로, 항목을 더할 때는 쓰는 파일 모두에 같이 반영합니다.

## 새 type 추가 체크리스트

| 순서 | 할 일 | 폴더 |
| --- | --- | --- |
| 1 | attribute 파일. 등록 줄 포함 | `01.attribute` |
| 2 | type 파일. `derived`, attribute 목록, 등록 줄 | `02.type` |
| 3 | policy 를 새로 만들거나 기존 policy 의 `type` 에 추가. state 심볼릭 property 포함 | `03.policy` |
| 4 | 권한 블록. 기본 `public all` 을 그대로 둘지 결정 | `03.policy` |
| 5 | relationship 파일, 또는 OOTB 관계(`Object Route` 등)에 type 추가 | `04.relationship` |
| 6 | trigger 가 필요하면 trigger 객체 + `mod type / policy ... add trigger` | `12.trigger` |
| 7 | 채번기 | `13.generator` |
| 8 | 화면 글자: `emxFramework.Type.`, `Attribute.`, `Range.`, `State.` 키 | `properties/` |
| 9 | 검색이 필요하면 인덱서 설정 | `99.config` |
| 10 | 운영 반영 묶음에 같은 순서로 추가 | `97.prod-mql/YYMM/` |
