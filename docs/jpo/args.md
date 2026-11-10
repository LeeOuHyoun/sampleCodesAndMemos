# 호출 종류별 인자 구조 <Badge type="info" text="원본 분석" />

JPO 메서드는 모두 `(Context context, String[] args)` 를 받습니다. `args` 안에 무엇이 들어 있는지는 **누가 불렀는지** 에 따라 다릅니다. 이 페이지는 호출 종류마다 `JPO.unpackArgs(args)` 로 꺼낸 Map 의 모양과 돌려줘야 하는 값을 정리합니다.

::: info 근거
JPO 쪽 키 사용 횟수 (jpo 폴더 전체): `programMap.get("objectList")` 1,032, `programMap.get("objectId")` 814, `paramMap.get("objectId")` 805, `programMap.get("requestMap")` 752, `programMap.get("paramMap")` 667, `programMap.get("paramList")` 603, `paramMap.get("New Value")` 276, `programMap.get("columnMap")` 101, `programMap.get("fieldMap")` 69. 프레임워크 쪽: framework.jar `UITableCommon`, `UIFormCommon`, `UITableIndented` 의 문자열 상수, common/emxFormRefresh.jsp, emxFreezePaneGetData.jsp, emxCreateProcess.jsp, emxFormEditProcess.jsp, emxAEFSubmitJPO.jsp
:::

샘플: [XX_MyPartUI_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartUI_mxJPO.java) (table 열, 구조 펼치기, range, update 메서드의 인자), [XX_MyPartAction_mxJPO.java](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/JPOSample/XX_MyPartAction_mxJPO.java) (unpackArgs 로 objectId 등 꺼내기)

## 공통

```java
Map programMap = (Map) JPO.unpackArgs(args);
Map paramMap = (Map) programMap.get("paramMap");
Map requestMap = (Map) programMap.get("requestMap");
```

- 꺼낸 값은 `HashMap` 입니다. OOTB 는 `(HashMap)` 으로 캐스팅하지만 `(Map)` 으로 받아도 됩니다.
- 값은 대부분 `String` 입니다. URL 파라미터를 그대로 담기 때문에 없는 키는 `null` 입니다. `"null"` 문자열이 들어오는 경우도 있어 OOTB 는 `UIUtil.isNullOrEmpty` 와 `"null".equals` 를 함께 씁니다.
- `RequestValuesMap` 이 있으면 값이 `String[]` 입니다 (`((String[]) map.get("objectId"))[0]`).

## 한눈에 보기

| 호출 | 설정 위치 | `programMap` 최상위 키 | 반환 |
| --- | --- | --- | --- |
| 표 program | href `program=` | 요청 파라미터가 바로 들어 있음 (`objectId`, `parentOID`, `languageStr` ...) | `MapList` (행마다 `id`) |
| 구조 펼치기 | href `program=` / `expandProgram=` | 위 + `expandLevel` | `MapList` (`id`, `id[connection]`, `level`) |
| 표 열 function | 열 `program` + `function` | `objectList`, `paramList`, `columnMap` | `Vector` / `StringList` (행 수만큼) |
| 셀 편집 가능 | 열 `Edit Access Program` / `Function` | `objectList`, `requestMap` | `StringList` (`"true"` / `"false"` 행 수만큼) |
| 셀 스타일 | 열 `Style Program` / `Function` | `objectList` ... | `StringList` (CSS 클래스 이름 행 수만큼) |
| 폼 필드 function | 필드 `program` + `function` | `paramMap`, `requestMap`, `fieldMap` | `String` (값 또는 HTML) |
| 범위 | `Range Program` / `Function` | `paramMap`, `requestMap`, `fieldMap` / `columnMap` | `Map` (`field_choices`, `field_display_choices`) |
| 다시 읽기 (폼) | `Reload Program` / `Function` | `fieldValues`, `fieldMap`, `requestMap`, `Event` | `Map` (`SelectedValues` ...) |
| 다시 읽기 (표) | 위와 같음 | `columnValues`, `rowValues`, `columnMap`, `requestMap`, `Event` | `Map` (`RangeValues`, `RangeDisplayValue` ...) |
| 저장 | `Update Program` / `Function` | `paramMap` (`New Value` ...), `requestMap`, `fieldMap` / `columnMap` | 아무거나 (`Boolean.TRUE` 관례) |
| 접근 | `Access Program` / `Function` | 요청 파라미터 + `SETTINGS` | `Boolean` |
| 생성 폼 createJPO | href `createJPO=` | 요청 파라미터 + 필드 값 | `Map` (`id`) |
| 생성 / 편집 후처리 | href `postProcessJPO=` | `paramMap`, `requestMap`, `formMap` | `Map` (`Action`, `Message`) 또는 없음 |
| 검색 포함 / 제외 | href `includeOIDprogram=` / `excludeOIDprogram=` | 요청 파라미터 | `StringList` (object id) |
| 트리거 | 트리거 객체 | 위치 인자 `args[0]`, `args[1]` ... (unpack 안 함) | `int` ([트리거](/trigger/)) |

## 표 program

표 (`emxIndentedTable.jsp`, `emxTable.jsp`) 를 열 때 행 목록을 만드는 메서드입니다. href 에 `program=JPO:method` 로 지정합니다. 쉼표로 여러 개를 주면 필터 목록이 됩니다 (`programLabel` 과 짝).

```
../common/emxIndentedTable.jsp?program=XX_MyPartUI:getRelatedDocuments&table=XX_MyDocTable&objectId=...
```

### 받는 값

`programMap` 에 요청 파라미터가 **바로** 들어 있습니다. `paramMap` 같은 하위 Map 이 없습니다.

| 키 | 내용 |
| --- | --- |
| `objectId` | 화면의 기준 객체 id (트리 / 탭에서 열린 경우) |
| `parentOID`, `relId` | 상위 객체, 관계 id (있을 때) |
| `languageStr`, `timeZone` | 언어 (`ko`, `en` ...), 시간대 |
| `table`, `selectedTable`, `selectedProgram` | 현재 표 이름, 선택된 필터 program |
| 그 밖의 URL 파라미터 | 그대로 (`mode`, `type` ...) |

### 돌려줄 값

`MapList` 입니다. 행마다 Map 하나이고 `id` 는 꼭 있어야 합니다.

| 키 | 필요할 때 |
| --- | --- |
| `id` | 항상. 객체 id |
| `id[connection]` | 관계 열 (`relationship` 표현식), 관계 속성 편집, 연결 끊기 |
| `level` | 구조 표 (Structure Browser) |
| 그 밖의 select 값 | 열 function 에서 다시 쓰려고 미리 담아 둠 |
| `disableSelection` | `"true"` 면 그 행의 체크박스 비활성 |
| `RowEditable` | `"readonly"` 면 그 행 편집 불가, `"show"` 면 표시 |
| `styleRows` | 행 CSS 클래스 이름 |
| `hasChildren` | `"false"` 면 펼치기 아이콘 숨김 |

`getRelatedObjects` 결과가 이미 `id`, `id[connection]`, `level`, `relationship` 을 가지고 있어서 보통 그대로 돌려줍니다.

```java
@com.matrixone.apps.framework.ui.ProgramCallable
public MapList getRelatedDocuments(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    String objectId = (String) programMap.get("objectId");
    DomainObject part = DomainObject.newInstance(context, objectId);
    return part.getRelatedObjects(context,
            PropertyUtil.getSchemaProperty(context, "relationship_MyPartDocument"), "*",
            new StringList(DomainConstants.SELECT_ID), new StringList(DomainConstants.SELECT_RELATIONSHIP_ID),
            false, true, (short) 1, null, null, 0);
}
```

::: info 근거
emxCommonDocumentUIBase_mxJPO.java:80-169 (getDocuments), 184 (getRevisions), emxDomainAccessBase_mxJPO.java:1100-1137 (`disableSelection`), framework.jar `UITable.getObjectList` 가 `JPO.invoke(context, program, new String[0], method, JPO.packArgs(requestMap), MapList.class)` 로 부름. 행 키 사용 횟수: `put("disableSelection"` 96, `put("RowEditable"` 86, `put("hasChildren"` 66, `put("styleRows"` 8
:::

## 구조 펼치기 program

Structure Browser 는 같은 program 을 **루트 목록과 노드를 펼칠 때마다** 다시 부릅니다. 펼칠 때 `objectId` 는 펼치는 노드의 id 입니다.

| 키 | 내용 |
| --- | --- |
| `objectId` | 펼치는 노드 id (처음에는 화면 기준 객체) |
| `expandLevel` | `"1"`, `"2"` ... 또는 `"All"`. 없으면 1 로 처리 |
| 그 밖 | 표 program 과 같음 |

```java
String expandLevel = (String) programMap.get("expandLevel");
short level = 1;
if ("All".equalsIgnoreCase(expandLevel)) {
    level = 0;
} else if (UIUtil.isNotNullAndNotEmpty(expandLevel)) {
    level = Short.parseShort(expandLevel);
}
MapList children = node.getRelatedObjects(context, rel, type, objSel, relSel, false, true, level, null, null, 0);
Map marker = new HashMap();
marker.put("expandMultiLevelsJPO", "true");
children.add(marker);
return children;
```

- `getRelatedObjects` 의 단계 `0` 이 "끝까지" 입니다.
- 여러 단계를 한 번에 돌려줄 때 OOTB 는 마지막에 `expandMultiLevelsJPO = "true"` 만 든 Map 을 붙입니다. JPO 가 단계를 직접 처리했다는 표시로 보입니다. 목록 개수를 셀 때는 이 Map 을 빼야 합니다 (ENOQuestionUIBase 가 그렇게 함).
- href 에 `expandProgram=` 을 따로 주면 루트 목록은 `program`, 펼치기는 `expandProgram` 이 맡는 것으로 보입니다.

::: info 근거
emxCommonPartBase_mxJPO.java:700-790 (`expandLevel`, `expandMultiLevelsJPO`), 1021-1038 (`getExpandLevel`: `"All"` → 0), ENOQuestionUIBase_mxJPO.java:216, 248-258
:::

## 표 열 function

열 설정에 `setting "program"` 과 `setting "function"` 이 있으면 표를 그릴 때 **한 번** 불립니다. 화면의 모든 행을 한꺼번에 받습니다.

| 키 | 형 | 내용 |
| --- | --- | --- |
| `objectList` | `MapList` | 행 목록. 표 program 이 돌려준 Map 그대로 (`id`, `id[connection]`, `level`, 직접 넣은 키) |
| `paramList` | `Map` | 요청 파라미터 (`objectId`, `parentOID`, `languageStr`, `timeZone`, `reportFormat`, `exportFormat`, `jsTreeID` ...) |
| `columnMap` | `Map` | 열 정의. `name`, `label`, `settings` (설정 Map) |

돌려줄 값은 `Vector` 또는 `StringList` 이고 **`objectList` 와 같은 길이, 같은 순서** 여야 합니다.

```java
public Vector getStatusColumn(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    MapList objectList = (MapList) programMap.get("objectList");
    Map paramList = (Map) programMap.get("paramList");
    String language = (String) paramList.get("languageStr");
    Vector result = new Vector(objectList.size());
    if (objectList.isEmpty()) {
        return result;
    }
    String[] ids = new String[objectList.size()];
    for (int i = 0; i < ids.length; i++) {
        ids[i] = (String) ((Map) objectList.get(i)).get(DomainConstants.SELECT_ID);
    }
    String attr = PropertyUtil.getSchemaProperty(context, "attribute_MyStatus");
    String select = DomainObject.getAttributeSelect(attr);
    MapList infoList = DomainObject.getInfo(context, ids, new StringList(select));
    for (Object o : infoList) {
        String value = (String) ((Map) o).get(select);
        result.add(EnoviaResourceBundle.getRangeI18NString(context, attr, value, language));
    }
    return result;
}
```

::: warning 행마다 조회하지 않습니다
`objectList` 를 돌면서 `DomainObject.newInstance(...).getInfo(...)` 를 행마다 부르면 행 수만큼 서버를 왕복합니다. id 배열로 `DomainObject.getInfo(context, String[], StringList)` 를 한 번 부릅니다 (OOTB 383 건).
:::

::: warning 내보내기, 인쇄
`paramList` 의 `reportFormat` 또는 `exportFormat` 이 비어 있지 않으면 인쇄 / CSV 내보내기 중입니다. HTML (`<a>`, `<img>`) 을 넣지 말고 글자만 돌려줍니다. OOTB 는 `paramList.get("reportFormat") != null` 로 나눕니다 (186 건).
:::

- 결과를 HTML 로 그리려면 열에 `setting "Column Type" "programHTMLOutput"` 을 줍니다. `"program"` 이면 글자로 나옵니다. 설정은 [UI 설정](/ui-components/settings) 참고.
- `objectList` 의 Map 에는 표 program 이 넣은 키가 그대로 있습니다. 표 program 에서 select 로 미리 담아 두면 열 function 에서 다시 조회하지 않아도 됩니다.

::: info 근거
emxCommonDocumentUIBase_mxJPO.java:303-383 (getNameOrTitle: `objectList`, `paramList.reportFormat`, `jsTreeID`), emxDomainAccessBase_mxJPO.java:1956-1980 (표 program 이 넣은 `org`, `project` 키를 열에서 읽음). framework.jar `UITableCommon` 상수 `objectList`, `paramList`, `columnMap`, `programHTMLOutput`
:::

### 셀 편집 가능 (Edit Access Function)

열이 편집 가능 (`Editable`) 할 때 행마다 편집을 막을지 정합니다.

| 받는 키 | 돌려줄 값 |
| --- | --- |
| `objectList`, `requestMap` | `StringList`. 행마다 `"true"` (편집 가능) / `"false"` |

::: info 근거
emxDomainAccessBase_mxJPO.java:1933-1985 (getCellLevelEditAccess). 표 설정: `setting "Edit Access Program" "emxDomainAccess"`, `"Edit Access Function" "getCellLevelEditAccess"`
:::

### 셀 스타일 (Style Function)

`StringList` 로 행마다 CSS 클래스 이름을 돌려줍니다. 클래스는 OOTB 스타일 시트에 있는 이름 (예: `ResourcePlanningRedBackGroundColor`) 을 씁니다. 열 설정에 붙으므로 그 열의 셀에 적용되는 것으로 보입니다. 행 전체 스타일은 표 program 에서 행 Map 에 `styleRows` 를 넣는 방법이 있습니다 (emxProjectSpaceBase_mxJPO.java:5500).

## 폼 필드 function

폼 (`emxForm.jsp`) 필드에 `setting "program"`, `setting "function"` 이 있으면 필드 값을 그릴 때 불립니다.

| 키 | 내용 |
| --- | --- |
| `paramMap` | `objectId`, `relId`, `languageStr` 등 |
| `requestMap` | 요청 파라미터 (`objectId`, `mode` (`view` / `edit`), `parentOID` ...) |
| `fieldMap` | 필드 정의. `name`, `label`, `settings` |

돌려줄 값은 `String` 입니다. 필드에 `setting "Field Type" "programHTMLOutput"` 이면 HTML 로 그립니다.

```java
public String getOwnerDisplay(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    Map requestMap = (Map) programMap.get("requestMap");
    Map fieldMap = (Map) programMap.get("fieldMap");
    String objectId = (String) requestMap.get("objectId");
    String fieldName = (String) fieldMap.get("name");
    return DomainObject.newInstance(context, objectId).getInfo(context, DomainConstants.SELECT_OWNER);
}
```

`fieldMap.get("name")` 으로 어느 필드가 불렀는지 알 수 있어서, 메서드 하나를 여러 필드에서 나눠 씁니다.

::: info 근거
emxECPartBase_mxJPO.java:10430-10436 (getCompareType: `fieldMap.name`), 10497-10502, 10818-10831 (getPartNameDisplay: `requestMap.objectId`). framework.jar `UIFormCommon` 상수 `paramMap`, `requestMap`, `fieldMap`
:::

## 범위 (Range Function)

선택 목록 (콤보박스) 의 항목을 만듭니다. 폼 필드와 표 열 모두 씁니다.

| 받는 키 | 내용 |
| --- | --- |
| `paramMap` | `languageStr` 등 |
| `requestMap` | 요청 파라미터 |
| `fieldMap` (폼) / `columnMap` (표) | 정의. 표에서는 `columnMap` 이 오는 것으로 보입니다 |

| 돌려줄 키 | 형 | 내용 |
| --- | --- | --- |
| `field_choices` | `StringList` | 실제 저장 값 |
| `field_display_choices` | `StringList` | 화면 표시 값 (같은 길이) |

```java
public HashMap getStatusRange(Context context, String[] args) throws Exception {
    String attr = PropertyUtil.getSchemaProperty(context, "attribute_MyStatus");
    StringList choices = FrameworkUtil.getRanges(context, attr);
    StringList display = EnoviaResourceBundle.getAttrRangeI18NStringList(context, attr, choices,
            context.getSession().getLanguage());
    HashMap rangeMap = new HashMap();
    rangeMap.put("field_choices", choices);
    rangeMap.put("field_display_choices", display);
    return rangeMap;
}
```

::: info 근거
emxECPartBase_mxJPO.java:15450-15468 (getRevisions), 10553-10554. `put("field_choices"` 202 건, `put("field_display_choices"` 203 건. framework.jar `UIFormCommon` 상수
:::

## 다시 읽기 (Reload Function)

다른 필드 값이 바뀌었을 때 이 필드의 값 / 목록을 다시 만듭니다.

### 폼

| 받는 키 | 내용 |
| --- | --- |
| `fieldValues` | 폼의 현재 필드 값. 필드 이름 → 값 |
| `fieldMap` | 다시 읽는 필드 정의 |
| `requestMap` | 요청 파라미터 + `languageStr`, `RefreshingField` |
| `Event` | `Type`, `Target` |

| 돌려줄 키 | 형 |
| --- | --- |
| `SelectedValues` / `SelectedDisplayValues` | `String`. 선택 값 / 표시 값 |
| `RangeValues` / `RangeDisplayValues` | `StringList`. 목록을 바꿀 때 |

### 표 (Structure Browser)

| 받는 키 | 내용 |
| --- | --- |
| `columnValues` | 같은 행의 열 값. 열 이름 → 값 |
| `rowValues` | 행 정보 (`objectId`, `type` ...) |
| `columnMap`, `requestMap`, `Event`, `ColumnNames` | 정의, 요청, 이벤트, 열 이름 목록 |

돌려줄 키는 `RangeValues`, `RangeDisplayValue` (s 없음), `SelectedValues`, `SelectedDisplayValues`, `Input Type` 입니다.

::: warning 폼과 표의 표시 목록 키가 다릅니다
폼 (`emxFormRefresh.jsp`) 은 `RangeDisplayValues`, 표 (`UITableIndentedUtil`) 는 `RangeDisplayValue` 를 읽습니다. OOTB 에도 두 가지가 섞여 있습니다 (`put("RangeDisplayValue"` 26 건, `put("RangeDisplayValues"` 22 건).
:::

::: info 근거
common/emxFormRefresh.jsp:53-142, common/emxFreezePaneGetData.jsp:396-451, emxDomainAccessBase_mxJPO.java:1370-1438 (getAccessRange: `columnValues`, `rowValues`), ENOGLSFormulationTypeUIBase_mxJPO.java:124-147
:::

## 저장 (Update Function)

편집 화면에서 값을 저장할 때 필드 / 셀마다 불립니다. 폼 편집은 이미 트랜잭션 안에서 부르므로 JPO 에서 따로 열지 않아도 됩니다 ([트랜잭션](/jpo/transaction-context#ui-가-열어-주는-트랜잭션)).

| `paramMap` 키 | 내용 |
| --- | --- |
| `objectId` | 편집 중인 객체 id. 표에서는 그 행의 id |
| `relId` | 그 행의 관계 id (표, 관계 속성) |
| `New Value` | 새 값 |
| `Old value` | 이전 값 (소문자 v) |
| `New OID` / `Old OID` | 검색으로 고른 객체 id (chooser 필드) |
| `New Values` | 다중 선택 값 |
| `languageStr` | 언어 |

그 밖에 `requestMap`, 그리고 폼은 `fieldMap`, 표는 `columnMap` 이 같이 옵니다.

```java
public Boolean updateStatus(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    Map paramMap = (Map) programMap.get("paramMap");
    String objectId = (String) paramMap.get("objectId");
    String newValue = (String) paramMap.get("New Value");
    DomainObject.newInstance(context, objectId).setAttributeValue(context,
            PropertyUtil.getSchemaProperty(context, "attribute_MyStatus"), newValue);
    return Boolean.TRUE;
}
```

관계 속성 (표의 수량 열 등) 은 `relId` 로 저장합니다.

```java
DomainRelationship.setAttributeValue(context, relId, attrName, newValue);
```

::: warning 키 이름 대소문자
`"Old value"` 는 `v` 가 소문자입니다 (19 건). `"Old Value"` 로 쓴 코드 (2 건) 는 `null` 을 받습니다. chooser 필드는 `New OID` 가 비어 있으면 `New Value` 에 id 가 오는 경우가 있어 OOTB 는 둘 다 확인합니다.
:::

::: info 근거
emxECPartBase_mxJPO.java:9354-9364 (updateFindNumber: `relId`, `New Value`), 4600-4618 (updateManufacturer: `New OID` 없으면 `New Value`), emxDomainAccessBase_mxJPO.java:1447-1455 (표: `requestMap.objectId` 는 화면 객체, `paramMap.objectId` 는 행). framework.jar `UIFormCommon` 상수 `New Value`, `Old value`, `New OID`, `Old OID`, `New Values`
:::

## 접근 (Access Function)

명령, 메뉴, 표 열, 폼 필드를 보일지 정합니다. `true` 면 보이고 `false` 면 숨깁니다.

### 받는 값

| 키 | 내용 |
| --- | --- |
| 요청 파라미터 | `objectId`, `parentOID`, `mode` ... 가 `programMap` 에 바로 있음 |
| `SETTINGS` | 그 컴포넌트의 설정 Map (`settings.get("Required")` 처럼 씀) |
| `RequestValuesMap` | 값이 `String[]` 인 요청 Map (일부 호출) |

```java
public Boolean canEditMyPart(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    String objectId = (String) programMap.get("objectId");
    if (UIUtil.isNullOrEmpty(objectId)) {
        return Boolean.FALSE;
    }
    String access = DomainObject.newInstance(context, objectId).getInfo(context, "current.access[modify]");
    return Boolean.valueOf("TRUE".equalsIgnoreCase(access));
}
```

### 검사 순서

`UINavigatorUtil.checkAccessForSettings` 가 설정을 아래 순서로 봅니다. 앞에서 막히면 JPO 는 불리지 않습니다.

| 순서 | 설정 |
| --- | --- |
| 1 | `Licensed Product` (라이선스) |
| 2 | `Access Mask` (`read`, `modify` 같은 권한) |
| 3 | `Access Expression` (`type==Part` 같은 식) |
| 4 | `Access Program` + `Access Function` (JPO) |

- JPO 는 `JPO.invoke(..., Boolean.class)` 로 불립니다. `public boolean` 으로 선언해도 됩니다 (`boolean` 989 건, `Boolean` 313 건).
- `setting "Access Behavior" "disable"` 이면 숨기지 않고 회색으로 비활성 처리하는 것으로 보입니다 (`GrayOut` 값을 넣음).

::: warning null 을 돌려주지 않습니다
`null` 을 돌려주면 "JPO Access Program Returns NULL" 메시지로 `FrameworkException` 이 납니다. 판단할 수 없을 때는 `false` 를 돌려줍니다.
:::

::: tip 가벼운 검사는 식으로
`Access Expression` 은 JPO 를 부르지 않아 빠릅니다. 사람 / 역할 / 상태처럼 식으로 쓸 수 있는 조건은 식으로 두고, 관계를 따라가야 하는 조건만 JPO 로 씁니다. 명령마다 접근 JPO 가 붙어 있으면 메뉴를 열 때마다 그 수만큼 불립니다.
:::

::: info 근거
xerinfra.jar `UINavigatorUtil.checkAccessForSettings` (설정 이름 `Access Mask`, `Access Expression`, `Access Program`, `Access Function`, `SETTINGS`, `Access Behavior`, 문자열 "JPO Access Program Returns NULL"), emxECPartBase_mxJPO.java:4630-4637 (isMepPart), emxProjectSpaceBase_mxJPO.java:8014-8027 (isFromProgram), emxCompanyBase_mxJPO.java:1536-1556 (`SETTINGS`), emxECPartBase_mxJPO.java:10291 (`RequestValuesMap`)
:::

## 생성 폼 (createJPO, postProcessJPO)

생성 화면 (`emxCreate.jsp`) 은 `emxCreateProcess.jsp` 가 처리합니다. 흐름은 아래와 같고 **전체가 한 트랜잭션** 입니다.

```
startTransaction
  ├─ createJPO (있으면)  → 새 객체 id
  │   없으면 프레임워크가 type / name / policy 로 생성
  ├─ URL 에 relationship= 가 있으면 objectId 와 연결 (direction=to / from)
  ├─ postProcessURL (있으면)
  ├─ postProcessJPO (있으면)
commit (Action 이 continue / success) 또는 abort
```

### createJPO

`programMap` 에 요청 파라미터와 필드 값 (`TypeActual`, `Name`, `Policy`, `Vault`, `AutoNameSeries`, `autoNameCheck` ...) 이 바로 들어 있습니다. 새 객체 id 를 `id` 키에 담아 돌려줍니다.

```java
@com.matrixone.apps.framework.ui.CreateProcessCallable
public Map createMyPart(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    String type = (String) programMap.get("TypeActual");
    DomainObject obj = DomainObject.newInstance(context);
    obj.createObject(context, type, null, null, null, null);
    Map result = new HashMap();
    result.put("id", obj.getId(context));
    return result;
}
```

### postProcessJPO

| 키 | 내용 |
| --- | --- |
| `paramMap` | `objectId` = **새 객체**, `newObjectId`, `relId`, `languageStr` |
| `requestMap` | 요청 파라미터. `objectId` = **화면 기준 (부모) 객체**, `parentOID` |
| `formMap` | 폼 정의 |

| 돌려줄 키 | 내용 |
| --- | --- |
| `Action` | `"continue"` 면 commit, 그 밖이면 abort |
| `Message` | 알림 문구. 문자열 리소스 키면 번역해서 보여 줌 |

편집 폼 (`emxFormEditProcess.jsp`) 의 `postProcessJPO` 도 같은 모양입니다. 다만 `paramMap` 에 요청 파라미터 전체와 `EditAction=done` 이 들어 있고, `requestValuesMap` 이 추가됩니다.

::: warning Message 만 돌려주면 저장이 취소됩니다
`Action` 기본값은 `"CONTINUE"` 지만, 돌려준 Map 이 비어 있지 않으면 `Action` 을 Map 에서 다시 읽습니다. `Message` 만 넣고 `Action` 을 빼면 `null` 이 되어 **abort** 됩니다. 경고만 보여 주고 저장하려면 `Action` 에 `"continue"` 를 같이 넣습니다. 편집 폼은 `"continue"` 만 commit 하고 `"success"` 는 abort 합니다.
:::

::: warning objectId 가 두 개입니다
생성 후처리에서 `paramMap.objectId` 는 새로 만든 객체, `requestMap.objectId` 는 생성 화면을 연 부모 객체입니다. 바꿔 쓰면 엉뚱한 객체를 수정합니다.
:::

- 반환형을 `void` 나 `int` 로 해도 됩니다. 프레임워크가 `ClassCastException` 을 무시합니다.
- 예외를 던지면 생성 전체가 abort 되고 예외 문구가 화면에 나옵니다.

::: info 근거
common/emxCreateProcess.jsp:78 (`action = "CONTINUE"`), 172-191, 299-336, 365-378, common/emxFormEditProcess.jsp:54, 161, 210-233, 268-279, emxECPartBase_mxJPO.java:17093-17142 (createPartJPO: `TypeActual`, `put("id")`), 12938-12946 (performPostProcessActions)
:::

## 검색 포함 / 제외 program

전체 검색 (`emxFullSearch.jsp`) URL 에 `includeOIDprogram=JPO:method` 또는 `excludeOIDprogram=JPO:method` 를 주면 검색 결과를 그 id 들로 제한하거나 뺍니다.

| 받는 값 | 돌려줄 값 |
| --- | --- |
| 요청 파라미터 (`objectId` ...) 가 바로 있음 | `StringList`. object id 목록 |

```java
@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
public StringList includeProjectMembers(Context context, String[] args) throws Exception {
    Map programMap = (Map) JPO.unpackArgs(args);
    String objectId = (String) programMap.get("objectId");
    return DomainObject.newInstance(context, objectId).getInfoList(context, "from[Member].to.id");
}
```

::: info 근거
emxTaskBase_mxJPO.java:17180-17201 (includeMembersToAddAsAssignee). 명령 href: `includeOIDprogram=emxTask:includeMembersToAddAsAssignee`
:::

## 트리거

트리거 JPO 는 `JPO.unpackArgs` 를 쓰지 않습니다. 트리거 정의의 `eService Program Argument 1`, `2` ... 에 적은 매크로 (`${OBJECTID}`, `${TYPE}` ...) 가 풀려서 `args[0]`, `args[1]` ... 로 들어옵니다. 반환은 `int` 이고 `0` 이면 통과입니다. 자세한 내용은 [트리거](/trigger/) 에 있습니다.

```java
public int checkSomething(Context context, String[] args) throws Exception {
    String objectId = args[0];
    return 0;
}
```

::: info 근거
mql/12.trigger 의 `eService Trigger Program Parameters` 객체 (`eService Program Name`, `eService Method Name`, `eService Program Argument 1` = `${OBJECTID}`)
:::
