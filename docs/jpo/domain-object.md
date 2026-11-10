# DomainObject 와 select <Badge type="info" text="원본 분석" />

JPO 에서 객체를 읽고 쓰는 일은 거의 `DomainObject` 와 `DomainRelationship` 으로 합니다. 무엇을 읽을지는 **select 문자열** (`name`, `attribute[Title]`, `from[EBOM].to.id` ...) 로 정합니다.

::: info 근거
jpo 폴더 호출 수: `DomainObject.newInstance(` 3,957, `.getInfo(` 3,707, `.getRelatedObjects(` 1,756, `.setAttributeValue(` 1,020, `DomainRelationship.connect(` 562, `DomainObject.findObjects(` 418, `DomainObject.getInfo(` (여러 id) 383, `.getInfoList(` 312. 시그니처는 xerinfra.jar 의 `DomainObject`, `DomainRelationship`, `MapList`, eMatrixServletRMI.jar 의 `StringList` class 파일 기준
:::

## 클래스 관계

| 클래스 | 패키지 | 상속 | 쓰임 |
| --- | --- | --- | --- |
| `DomainObject` | `com.matrixone.apps.domain` | `matrix.db.BusinessObject` | 객체 하나 |
| `DomainRelationship` | `com.matrixone.apps.domain` | `matrix.db.Relationship` | 관계 (연결) 하나 |
| `DomainConstants` | `com.matrixone.apps.domain` | | `SELECT_*`, `TYPE_*`, `RELATIONSHIP_*` 상수 |
| `MapList` | `com.matrixone.apps.domain.util` | `java.util.ArrayList` | 조회 결과. 요소는 `Map` (보통 `Hashtable` / `HashMap`) |
| `StringList` | `matrix.util` | `matrix.util.List` | select 목록, 값 목록 |
| `BusinessObject` | `matrix.db` | | 핵심 API. `open` / `close` 가 필요해 직접 쓰는 일은 적음 |

## 객체 얻기

```java
DomainObject obj = DomainObject.newInstance(context, objectId);
DomainObject empty = DomainObject.newInstance(context);
DomainObject plain = new DomainObject(objectId);
```

| 방법 | 설명 |
| --- | --- |
| `DomainObject.newInstance(context, id)` | id 로 타입을 조회해 알맞은 하위 클래스 (`Part`, `Document` ...) 로 만들어 주는 것으로 보입니다. 가장 많이 씀 |
| `DomainObject.newInstance(context, type, app)` | 타입을 알 때. `newInstance(context, TYPE_TASK, PROGRAM)` 뒤에 `setId(id)` |
| `DomainObject.newInstance(context)` | 빈 객체. `createObject` 전에 씀 |
| `new DomainObject(id)` | 타입 조회 없이 바로 |
| `obj.setId(id)` | 같은 인스턴스를 다른 id 로 재사용 (1,216 건) |

## 정보 읽기

| 메서드 | 반환 | 용도 |
| --- | --- | --- |
| `getInfo(context, String select)` | `String` | 값 하나 |
| `getInfo(context, StringList selects)` | `Map` | 값 여러 개. 키는 select 문자열 그대로 |
| `getInfo(context, StringList selects, StringList multiSelects)` | `Map` | 여러 값 select 를 항상 `StringList` 로 받음 |
| `getInfoList(context, String select)` | `StringList` | 여러 값 select 하나 (`from[X].to.id` 등) |
| `DomainObject.getInfo(context, String[] ids, StringList selects)` | `MapList` | 여러 객체를 한 번에. 열 function 에서 씀 |
| `getAttributeValue(context, attrName)` | `String` | 속성 하나 |
| `getAttributeMap(context)` | `Map` | 모든 속성 |
| `isKindOf(context, type)` | `boolean` | 타입 (하위 포함) 확인 |

```java
StringList selects = new StringList();
selects.add(DomainConstants.SELECT_NAME);
selects.add(DomainConstants.SELECT_CURRENT);
selects.add(DomainObject.getAttributeSelect(attrStatus));
Map info = obj.getInfo(context, selects);
String name = (String) info.get(DomainConstants.SELECT_NAME);
String status = (String) info.get("attribute[" + attrStatus + "]");
```

### 여러 값 select

`from[X].to.id` 처럼 값이 여러 개일 수 있는 select 는 결과 형이 섞입니다.

| 값 개수 | `getInfo(StringList)`, `getRelatedObjects` 결과 |
| --- | --- |
| 0 | `null` 또는 키 없음 |
| 1 | `String` |
| 2 이상 | `StringList`. 구분자로 이어 붙인 `String` 으로 오는 경우도 있는 것으로 보입니다 (OOTB 에 `"\\a"` 로 자르는 코드가 있음) |

```java
Object value = map.get(select);
StringList ids = value instanceof StringList ? (StringList) value
        : value == null ? new StringList() : new StringList((String) value);
```

- 값 하나만 필요하면 `getInfoList` 를 씁니다. 항상 `StringList` 입니다.
- `getInfo(context, selects, multiSelects)` 의 세 번째 인자에 넣은 select 는 항상 `StringList` 로 옵니다.

::: warning DomainObject.MULTI_VALUE_LIST 는 쓰지 않습니다
예전 코드는 static 목록 `DomainObject.MULTI_VALUE_LIST` 에 select 를 넣었다 뺐습니다 (130 건). 서버 전체가 함께 쓰는 목록이라 동시에 실행되는 다른 요청에 영향을 줍니다. 지금 OOTB 코드도 이 줄을 주석으로 막고 `multiValueSelects` 인자를 씁니다.
:::

::: info 근거
`instanceof StringList` 180 건 (예: emxECPartBase_mxJPO.java 의 `SELECT_FORMAT_HASFILE` 처리). `MULTI_VALUE_LIST` 주석 처리 후 `SelectList multiValueSelects` 사용 사례: emxECPartBase_mxJPO.java (`relationship[...].from.current`)
:::

## 관계 따라가기 (getRelatedObjects)

가장 많이 쓰는 형태는 11 개 인자입니다.

```java
MapList list = obj.getRelatedObjects(context,
        relPattern,
        typePattern,
        objectSelects,
        relSelects,
        getTo,
        getFrom,
        (short) 1,
        objectWhere,
        relWhere,
        0);
```

| 순서 | 인자 | 형 | 설명 |
| --- | --- | --- | --- |
| 1 | `context` | `Context` | |
| 2 | 관계 패턴 | `String` | 관계 이름. 여러 개는 쉼표 (`"EBOM,Alternate"`). 전부는 `"*"` |
| 3 | 타입 패턴 | `String` | 타입 이름. 쉼표, `"*"` |
| 4 | 객체 select | `StringList` | 결과 Map 에 담을 객체 값 |
| 5 | 관계 select | `StringList` | 결과 Map 에 담을 관계 값 (`id[connection]` ...) |
| 6 | `getTo` | `boolean` | `true` 면 이 객체가 **to** 쪽인 관계를 따라감 → from 쪽 객체 (부모) |
| 7 | `getFrom` | `boolean` | `true` 면 이 객체가 **from** 쪽인 관계를 따라감 → to 쪽 객체 (자식) |
| 8 | 단계 | `short` | `1` 바로 아래, `0` 끝까지 |
| 9 | 객체 where | `String` | `"current==Release"` 같은 식. 없으면 `null` / `""` |
| 10 | 관계 where | `String` | 관계 조건 |
| 11 | 개수 제한 | `int` | `0` 이면 제한 없음 |

결과는 `MapList` 이고 Map 마다 아래 키가 있습니다.

| 키 | 내용 |
| --- | --- |
| 객체 select, 관계 select | 넣은 select 문자열 그대로 |
| `level` | 시작 객체로부터의 단계 (`"1"`, `"2"` ...) |
| `relationship` | 관계 이름 |

- 10 개 인자 (개수 제한 없음), 13 / 14 개 인자 (`Pattern` 으로 결과를 한 번 더 거르는 형태) 도 있습니다.
- 자식 목록 (예: BOM 아래 부품) 은 `getTo=false, getFrom=true` 입니다. 상위 목록 (Where Used) 은 반대입니다.

::: tip 패턴은 실제 이름으로
관계 / 타입 패턴에는 화면 표시 이름이 아니라 **스키마 이름** 을 넣습니다. 하드코딩하지 말고 `PropertyUtil.getSchemaProperty(context, "relationship_EBOM")` 이나 `DomainConstants.RELATIONSHIP_EBOM` 으로 얻습니다 ([심볼릭 이름](#심볼릭-이름)).
:::

::: info 근거
xerinfra.jar `DomainObject.getRelatedObjects` 오버로드 9 개. 인자 개수별 호출 (한 줄 호출 기준): 11 개 148, 10 개 96, 13 개 16. emxCommonDocumentUIBase_mxJPO.java:142-160 (Reference Document: `false, true`), emxCommonPartBase_mxJPO.java:988-999 (인자별 주석). `DomainConstants.KEY_LEVEL = "level"`, `KEY_RELATIONSHIP = "relationship"`
:::

## 쓰기

| 메서드 | 설명 |
| --- | --- |
| `setAttributeValue(context, attr, value)` | 속성 하나 |
| `setAttributeValues(context, Map)` | 속성 여러 개 한 번에 (속성 이름 → 값) |
| `setDescription(context, text)`, `setOwner(context, user)` | 기본 항목 |
| `setState(context, state)` | 상태를 바로 지정 |
| `promote(context)`, `demote(context)` | 다음 / 이전 상태 |
| `createObject(context, type, name, rev, policy, vault)` | 생성 |
| `deleteObject(context)`, `DomainObject.deleteObjects(context, String[])` | 삭제 |
| `DomainRelationship.setAttributeValue(context, relId, attr, value)` | 관계 속성 (static) |

```java
Map attrs = new HashMap();
attrs.put(attrStatus, "Approved");
attrs.put(attrComment, comment);
obj.setAttributeValues(context, attrs);
```

### createObject

```java
DomainObject doc = DomainObject.newInstance(context);
doc.createObject(context, type, null, null, null, null);
String newId = doc.getId(context);
```

| 인자 | `null` / `""` 이면 |
| --- | --- |
| name | `getUniqueName` 으로 고유 이름 생성 |
| revision | 정책의 첫 리비전 |
| policy | 타입의 기본 정책 |
| vault | 기본 vault |

`createObject` 는 안에서 트랜잭션을 열고 닫습니다. 바깥에 이미 트랜잭션이 있으면 그 안에 묶입니다 ([트랜잭션](/jpo/transaction-context#트랜잭션)).

::: info 근거
xerinfra.jar `DomainObject.createObject(Context, String, String, String, String, String)` 바이트코드: 이름이 비면 `getDefaultName` → `getUniqueName`, `getDefaultPolicy`, `getDefaultRevision` (`Policy.getFirstInSequence`), `getDefaultVault` 뒤 `BusinessObject.create`
:::

### 연결, 끊기

| 메서드 | 설명 |
| --- | --- |
| `DomainRelationship.connect(context, fromObj, relName, toObj)` | `DomainRelationship` 을 돌려줌 |
| `DomainRelationship.connect(context, fromId, relName, toId, preserve)` | id 로 연결. `preserve=true` 면 MQL `connect ... preserve` 로 실행 (수정 일자를 바꾸지 않는 옵션으로 보입니다) |
| `obj.connectTo(context, relName, toObj)` / `connectFrom(...)` | 이 객체 기준 |
| `obj.addToObject(context, new RelationshipType(rel), id)` / `addFromObject(...)` | 생성 화면 프레임워크가 쓰는 형태 |
| `DomainRelationship.disconnect(context, relId)` | 관계 id 로 끊기. 여러 개는 `String[]` |
| `DomainRelationship.modifyTo(context, relId, newToObj)` | 관계의 to 쪽 바꾸기 |

```java
DomainRelationship rel = DomainRelationship.connect(context, part, relName, doc);
rel.setAttributeValue(context, attrQty, "2");
```

::: info 근거
xerinfra.jar `DomainRelationship.connect(Context, String, String, String, boolean)` 바이트코드: `"connect businessobject $1 relationship $2 to $3"`, `preserve` 이면 `"connect businessobject $1 preserve relationship $2 to $3"` 를 `MqlUtil.mqlCommand` 로 실행. 호출: emxProgramCentral 쪽 `DomainRelationship.connect(context, PALId, ..., assessmentId, true)`, common/emxCreateProcess.jsp:208-217 (`addToObject` / `addFromObject`)
:::

## 검색 (findObjects)

`temp query` 와 같습니다. 이름이나 조건으로 객체를 찾습니다.

```java
MapList found = DomainObject.findObjects(context, type, "*", whereExpr, new StringList(DomainConstants.SELECT_ID));
```

| 인자 (5 개 형태) | 설명 |
| --- | --- |
| type | 타입 패턴 |
| vault | `"*"` 또는 vault 이름 |
| where | 조건식 |
| selects | 결과 select |

이름 / 리비전 / 소유자까지 받는 9 ~ 12 개 인자 형태도 있습니다. 결과가 많을 수 있으므로 where 를 꼭 좁힙니다.

## select 문법

select 는 MQL `print bus ... select` 와 같은 문법입니다.

### 객체

| select | 값 | 상수 |
| --- | --- | --- |
| `id`, `physicalid` | 객체 id | `SELECT_ID`, `SELECT_PHYSICAL_ID` |
| `type`, `name`, `revision` | TNR | `SELECT_TYPE`, `SELECT_NAME`, `SELECT_REVISION` |
| `current` | 현재 상태 이름 | `SELECT_CURRENT` |
| `policy`, `owner`, `vault` | 정책, 소유자, vault | `SELECT_POLICY`, `SELECT_OWNER`, `SELECT_VAULT` |
| `originated`, `modified` | 생성 / 수정 일시 | `SELECT_ORIGINATED`, `SELECT_MODIFIED` |
| `description` | 설명 | `SELECT_DESCRIPTION` |
| `state` | 정책의 상태 목록 (여러 값) | `SELECT_STATES` |
| `attribute[Title]` | 속성 값 | `DomainObject.getAttributeSelect(name)` |
| `attribute[Title].value` | 위와 같음 | |
| `type.kindof[Part]` | `TRUE` / `FALSE` | |
| `current.access[modify]` | 현재 사용자 권한 `TRUE` / `FALSE` | |
| `last.id`, `previous.id`, `next.id` | 최신 / 이전 / 다음 리비전 | `SELECT_LAST_ID` |
| `revisions` | 모든 리비전 (여러 값) | |
| `evaluate[revision==last]` | 식 계산 결과 | |
| `interface` | 붙은 interface (여러 값) | |
| `policy.property[PolicyClassification].value` | 정책 속성 | |

### 관계를 따라가는 select

`from[관계]` 는 이 객체가 from 쪽인 관계, `to[관계]` 는 to 쪽인 관계입니다.

| select | 값 |
| --- | --- |
| `from[EBOM].to.id` | 자식 객체 id (여러 값) |
| `to[EBOM].from.name` | 부모 객체 이름 |
| `from[EBOM].attribute[Quantity]` | 관계 속성 |
| `from[EBOM].id` | 관계 id |
| `from[EBOM]` | 연결 여부 `True` / `False` |
| <code>from[EBOM&#124;to.id==ID].attribute[Quantity]</code> | 조건으로 고른 관계의 값 |
| `from[Part Specification].to.from[X].to.name` | 여러 단계 |

### 관계

`DomainRelationship.getInfo(context, String[] relIds, StringList)` 나 `getRelatedObjects` 의 관계 select 에 씁니다.

| select | 값 | 상수 |
| --- | --- | --- |
| `id[connection]` | 관계 id (`getRelatedObjects` 안에서) | `SELECT_RELATIONSHIP_ID` |
| `name[connection]` | 관계 이름 | `SELECT_RELATIONSHIP_NAME` |
| `from.id`, `to.id`, `from.name`, `to.name` | 양 끝 객체 | `SELECT_FROM_ID`, `SELECT_TO_ID` ... |
| `attribute[Quantity]` | 관계 속성 | |

::: warning 속성 이름 오타는 잘 드러나지 않습니다
`attribute[없는이름]` 처럼 이름을 틀리면 예외 없이 `null` / 빈 값이 오는 것으로 보입니다. 값이 계속 비어 있으면 MQL 로 `print bus 타입 이름 리비전 select 그select dump;` 를 먼저 확인합니다.
:::

### `$<...>` 는 JPO 가 아니라 UI 정의에서

표 / 폼 / 메뉴 정의 (MQL) 에서는 `businessobject "$<attribute[attribute_Title].value>"` 처럼 `$<...>` 로 감싸 **심볼릭 이름을 그 자리에서 실제 이름으로 바꿉니다**. JPO 의 select 에는 이 문법을 쓰지 않고, `PropertyUtil` 로 얻은 실제 이름을 넣습니다.

::: info 근거
mql/08.table, 09.webform, 07.menu 의 `$<...>` 사용 (`$<attribute[attribute_X].value>` 717 건, `$<owner>` 40 건). jpo 쪽 `$<` 는 PDF 워터마크 문자열 1 곳뿐. select 사용 수: `type.kindof[` 214, `current.access[` 196, `physicalid` 108, `last.id` 41, `previous.id` 24, `from[EBOM|to.id==` (emxECPart 계열). `DomainConstants` 상수 값은 xerinfra.jar class 파일의 ConstantValue 기준
:::

## 심볼릭 이름

스키마 이름 (`Part`, `EBOM`, `Title`) 은 바뀔 수 있어서 코드에는 **심볼릭 이름** (`type_Part`, `relationship_EBOM`, `attribute_Title`) 을 쓰고 실행할 때 실제 이름으로 바꿉니다.

```java
String typePart = PropertyUtil.getSchemaProperty(context, "type_Part");
String relEbom = PropertyUtil.getSchemaProperty(context, "relationship_EBOM");
String stateRelease = PropertyUtil.getSchemaProperty(context, "policy", policyName, "state_Release");
```

| 접두어 | 건수 | 예 |
| --- | --- | --- |
| `attribute_` | 762 | `attribute_Title` |
| `type_` | 674 | `type_Part` |
| `relationship_` | 617 | `relationship_EBOM` |
| `role_`, `person_` | 195, 166 | `person_UserAgent` |
| `policy_` | 139 | `policy_ECPart` |
| `format_`, `interface_`, `vault_` | 28, 24, 7 | |
| 상태 | | `getSchemaProperty(context, "policy", 정책이름, "state_Release")` |

- 등록: 관리 객체에 `eServiceSchemaVariableMapping.tcl` 프로그램 기준 property 를 붙입니다.

```
add property attribute_MyStatus on program eServiceSchemaVariableMapping.tcl to attribute "My Status";
```

- 등록하지 않은 심볼릭 이름은 빈 문자열이 옵니다. 그 값으로 `getRelatedObjects` 를 부르면 아무것도 안 나와서 원인을 찾기 어렵습니다.
- OOTB 상수 (`DomainConstants.TYPE_PART`, `RELATIONSHIP_EBOM`, `ATTRIBUTE_TITLE` ...) 도 클래스가 처음 로드될 때 같은 방법으로 채워집니다. 사용자 정의 스키마는 상수 클래스를 따로 만들어 같은 방식으로 둡니다.

::: info 근거
jpo 폴더 `getSchemaProperty(context, "접두어_` 사용 수 (위 표). mql 폴더의 `add property ... on program eServiceSchemaVariableMapping.tcl to attribute|type|relationship|policy ...` (attribute 342, relationship 44, type 38, policy 17 건). xerinfra.jar `DomainConstants` 정적 초기화에서 `PropertyUtil.getSchemaProperty` 865 회 (`"type_Part"` → `TYPE_PART` 등). `emxProgramCentral` 쪽 `getSchemaProperty(context, "policy", ..., "state_Active")`
:::

## MapList, StringList

```java
MapList list = new MapList();
for (Object o : list) {
    Map row = (Map) o;
    String id = (String) row.get(DomainConstants.SELECT_ID);
}
list.sort(DomainConstants.SELECT_NAME, "ascending", "String");
```

| 메서드 | 설명 |
| --- | --- |
| `MapList.sort(key, "ascending" / "descending", "String" / "integer" / "date")` | 정렬 |
| `addSortKey(key, dir, type)` 여러 번 + `sort()` | 여러 키로 정렬 |
| `sortStructure("level", "ascending", "String")` | 구조 (level 있는 목록) 정렬 |
| `new StringList(String)`, `new StringList(String[])`, `new StringList(List)` | 만들기 |
| `StringList.add`, `contains`, `get`, `size` | `java.util.List` 처럼 씀 |

::: info 근거
xerinfra.jar `MapList` (`sort(String, String, String)`, `addSortKey`, `sortStructure`), eMatrixServletRMI.jar `StringList` 생성자 7 개. 사용 예: `.addSortKey(SELECT_NAME,"ascending", "String")` 26 건, `.sort("modified", "descending", "date")` 7 건
:::
