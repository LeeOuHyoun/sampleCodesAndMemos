# MQL 문법과 조회

MQL (Matrix Query Language) 은 3DSpace 의 명령 언어입니다. 스키마 정의(`add type` ...)도, 데이터 조작(`add bus` ...)도, 조회(`print`, `temp query`, `expand`)도 모두 MQL 입니다. 프로젝트의 `.mql` 파일과 JPO 의 `MqlUtil.mqlCommand(...)` 가 같은 문법을 씁니다.

::: info 근거
`mql/` 아래 전체 `.mql` 파일의 명령 빈도(`connect bus` 약 3,600, `mod bus` 약 3,500, `add bus` 약 1,300, `add property` 약 1,200, `add attribute` 약 400 ...), `mql/98.migration/*/*.mql`, `mql/97.prod-mql/*/*.mql`, `mql/03.policy/` 설계 메모의 `list` / `print` 문법. JPO 의 `MqlUtil.mqlCommand` 호출 빈도(`print bus` 약 440, `temp query bus` 약 140, `print connection` 약 110, `expand bus` 약 40). 예: `jpo/emxClassificationBase_mxJPO.java`, `jpo/emxCommonInitiateRouteBase_mxJPO.java`, `jpo/com/dassault_systemes/enovia/geographyconfiguration/ui/DocumentBase_mxJPO.java`
:::

## 기본 규칙

| 규칙 | 설명 |
| --- | --- |
| 끝 | 명령 하나는 `;` 로 끝남. 그 전까지는 여러 줄로 나눠 써도 됨 |
| 따옴표 | 이름은 `'...'` 또는 `"..."`. 공백이 있는 이름(`'EC Part'`)은 반드시 감쌈 |
| 주석 | 줄 맨 앞 `#` |
| 줄임말 | `mod` = `modify`, `del` = `delete`, `rel` / `relation` = `relationship`, `bus` = `businessobject` |
| 대소문자 | 키워드는 섞어 써도 동작하는 것으로 보입니다 (`add Trigger Delete Check`, `type String`). 이름은 구별함 |
| 한글 | 명령 안에는 쓰지 않음 (인코딩 문제). 주석에는 씀 |

## 명령 형태

```text
동사 객체종류 '이름' [절 ...];
```

| 동사 | 용도 | 예 |
| --- | --- | --- |
| `add` | 만들기 | `add type 'MyPart' derived 'Part';` |
| `modify` (`mod`) | 고치기. `add` / `remove` 로 목록 항목을 넣고 뺌 | `mod type 'MyPart' add attribute 'MyColor';` |
| `copy` | 복사. OOTB 백업에 씀 | `copy policy 'EC Part' 'EC Part_OOTB';` |
| `delete` (`del`) | 삭제 | `del attribute 'MyColor';` |
| `list` | 이름 목록 | `list type 'XX*';` |
| `print` | 정의 전체 또는 select 한 값 | <code>print type 'MyPart' select attribute dump &#124;;</code> |

객체 종류는 `attribute`, `type`, `policy`, `relationship`, `role`, `rule`, `command`, `menu`, `table`, `form`, `channel`, `portal`, `program`, `person` 등입니다.

### property

스키마 객체에 이름 / 값 쌍을 붙입니다. 버전 정보, 심볼릭 이름 등록에 씁니다.

```text
add property type_MyPart on program eServiceSchemaVariableMapping.tcl to type 'MyPart';
mod type 'MyPart' property version value 'R2025x';
```

## list 와 print

```text
list type 'XX*';
list role '*_PRJ';
list role 'XXMy*' select name description dump |;

print type 'MyPart';
print attribute 'MyColor' select range dump |;
print attribute 'MyColor' select property[installer].value dump;
print policy 'MyPartPolicy' select state dump |;
print person 'userA' select assignment dump |;
```

| 절 | 뜻 |
| --- | --- |
| 이름 패턴 | `*` 와일드카드 |
| `where '식'` | 조건 |
| `select 항목 ...` | 뽑을 값. 없으면 정의 전체를 사람이 읽는 형태로 출력 |
| `dump 구분자` | select 결과를 이름표 없이 한 줄로. 코드에서 split 하기 쉬움 |
| `recordseparator 구분자` | 여러 건일 때 건 사이 구분자 (`recordsep`) |
| `output 파일` | 결과를 파일로 |

## business object 명령

데이터를 다루는 명령입니다. 이관(migration) 파일은 대부분 이 세 가지로 이루어집니다.

```text
add bus 'MyPart' 'MP-0000001' '1'
    policy 'MyPartPolicy'
    vault  'eService Production'
    description 'Migration data'
    MyColor 'RED'
    MyWeight '1.5';

mod bus 'MyPart' 'MP-0000001' '1' MyColor 'BLUE';

connect bus 'MyPart' 'MP-0000001' '1'
    relationship 'XXRelMyPartToMyDoc'
    to 'MyDoc' 'MD-0000001' '1'
    MySeq '1';
```

| 명령 | 설명 |
| --- | --- |
| `add bus T N R policy P vault V 속성 값 ...` | 생성. attribute 는 `이름 값` 을 이어 씀 |
| `mod bus T N R 속성 값 ...` | attribute 수정. id 를 알면 `mod bus 객체id ...` |
| `mod bus ... owner 사용자`, `type 새타입`, `name N revision R` | 소유자 / type / 이름 변경 |
| `mod bus ... add interface I` / `remove interface I` | interface 붙이기 / 떼기 |
| `mod bus ... add history 'event' comment '...'` | 이력 남기기 |
| `connect bus T N R relationship REL to T2 N2 R2 [속성 값 ...]` | 연결. `from` 을 쓰면 방향 반대 |
| `mod connection 연결id 속성 값` | 연결 attribute 수정 |
| `disconnect bus ... relationship REL to ...` | 연결 끊기 |
| `del bus T N R` | 삭제 |
| `promote bus id` / `demote bus id` | state 이동 |

::: tip preserve
JPO 에는 `connect bus $1 preserve relationship ...` 처럼 `preserve` 를 붙인 호출이 있습니다. 대상 객체의 수정 일시를 바꾸지 않는 옵션으로 보입니다.
:::

## 조회

### print bus

객체 하나의 값을 읽습니다. 코드에서 가장 많이 쓰는 MQL 입니다.

```text
print bus 'MyPart' 'MP-0000001' '1' select id current owner attribute[MyColor] dump |;
print bus 12345.67890.12345.67890 select from[XXRelMyPartToMyDoc].to.name dump |;
```

### temp query bus

조건에 맞는 객체를 찾습니다. type, name, revision 자리에 `*` 를 쓸 수 있습니다.

```text
temp query bus 'MyPart' '*' '*'
    vault 'eService Production'
    where "current == 'Release' && attribute[MyColor] == 'RED'"
    limit 100
    select id name attribute[MyWeight]
    dump | recordsep ,;
```

| 절 | 뜻 |
| --- | --- |
| `T N R` | type, name, revision 패턴. type 의 자식 type 도 함께 찾는 것으로 보입니다 |
| `vault V` | vault 로 좁히기 |
| `where "식"` | 조건 |
| `limit n` | 최대 건수 |
| `select ...` / `dump` / `recordsep` | `print` 와 같음 |

### expand bus

연결을 따라 펼칩니다. BOM 이나 하위 분류처럼 트리를 읽을 때 씁니다.

```text
expand bus 'MyPart' 'MP-0000001' '1'
    from relationship 'XXRelMyPartToMyDoc'
    recurse to 1
    select bus id name
    select rel attribute[MySeq]
    where "current == 'Release'"
    dump |;
```

| 절 | 뜻 |
| --- | --- |
| `from` / `to` | 방향. 이 객체가 from 쪽인 연결만 / to 쪽인 연결만. 없으면 양쪽 |
| `relationship R1,R2` | 따라갈 관계 |
| `type T` | 반대편 객체의 type |
| `recurse to n` / `recurse to all` | 몇 단계까지 |
| `select bus ...` / `select rel ...` | 반대편 객체 값 / 연결 값 |
| `where "식"` | 반대편 객체 조건 |
| `terse` | type / name / revision 대신 id 위주로 짧게 출력하는 것으로 보입니다 |
| `limit n` | 최대 건수 |

출력은 한 줄에 연결 하나이고, 단계, 관계, 방향, 반대편 type / name / revision, select 값이 차례로 나오는 것으로 보입니다. 코드에서는 `dump` 구분자로 잘라 씁니다. JPO 에서는 MQL `expand` (약 40 곳) 보다 같은 일을 하는 `getRelatedObjects` (약 1,800 곳) 를 훨씬 많이 씁니다. `temp query` 도 `findObjects` (약 450 곳) 로 대신하는 경우가 많습니다.

### select 표현식

`print`, `temp query`, `expand`, policy `filter` 에서 같이 씁니다.

| 식 | 값 |
| --- | --- |
| `id`, `type`, `name`, `revision` | 기본 정보 |
| `policy`, `current`, `owner`, `vault` | policy, 현재 state, 소유자, vault |
| `attribute[MyColor]` | attribute 값 |
| `type.kindof[Part]` | Part 이거나 그 자식이면 `TRUE` |
| `from[REL].to.name` | 이 객체가 from 인 REL 연결의 반대편 이름 |
| `to[REL].from.id` | 이 객체가 to 인 REL 연결의 반대편 id |
| `to[REL].from.current` | 반대편 객체의 state |
| `current.access` | 로그인 사용자가 이 객체에 가진 권한 |
| `state[Release].actual` | 그 state 에 들어간 날짜 |

## 실행 환경

파일로 실행할 때 앞에 붙이는 명령입니다.

```text
verb on;
set context user 'adminUser' password '********' role 'ctx::VPLMProjectLeader.Company Name.MySpace';
trace type mql filename 'my_migration.log';
run 'C:\work\mql\01.attribute\MyColor.mql';
trace off;
```

| 명령 | 설명 |
| --- | --- |
| `verb on` | 실행하는 명령을 화면에 함께 출력 |
| `set context user ... role 'ctx::역할.조직.협업공간'` | 실행 사용자와 보안 컨텍스트. 권한 검사와 객체의 조직 / 협업공간에 영향을 주는 것으로 보입니다 |
| `trace type mql filename ...` / `trace off` | 실행 기록을 파일로 |
| `run 파일` | 다른 `.mql` 파일을 이어서 실행 |

::: warning 비밀번호를 파일에 남기지 않기
이관 파일 중에는 `set context ... password` 를 평문으로 적은 것이 있습니다. 저장소에 올리는 파일에는 비밀번호를 쓰지 말고, 실행할 때 직접 컨텍스트를 잡습니다.
:::

## Java 에서 MQL 부르기

```java
String result = MqlUtil.mqlCommand(context,
        "temp query bus $1 $2 $3 where $4 select $5 dump $6",
        typeName, "*", "*", "current == 'Release'", "id", "|");

String states = MqlUtil.mqlCommand(context,
        "print policy $1 select $2 dump $3", policyName, "state", "|");
```

- `$1`, `$2` ... 자리에 인자가 차례로 들어갑니다. 공백이 있는 이름도 따옴표 없이 그대로 넘기는 것으로 보아 따옴표 처리를 대신해 주는 것으로 보입니다.
- 사용자가 입력한 값을 문자열 이어 붙이기로 명령에 넣지 않습니다. 값이 명령으로 해석될 수 있습니다.
- type, policy, state 이름은 `PropertyUtil.getSchemaProperty` 로 얻은 값을 넘깁니다. [심볼릭 이름](/schema/#심볼릭-이름)
