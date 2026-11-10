# table (목록, 구조 브라우저) <Badge type="info" text="원본 분석" />

**table** 은 목록 화면의 열(column) 정의입니다. 행(어떤 객체를 보여 줄지)은 table 이 아니라 **URL 의 `program` / `expandProgram` JPO** 가 정합니다. 둘을 이어 붙여 화면을 그리는 것이 `emxIndentedTable.jsp` (구조 브라우저, Structure Browser, 줄여서 SB) 입니다.

샘플: [02_table.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UIComponentSample/02_table.mql)

::: info 근거
`mql/08.table/Table_Sample.mql`, 프로젝트 table 96 파일 (column 837 개), `mql/08.table/ENCRevisionSummary.mql`, `APPWhereUsedHierarchial.mql`. 화면: `3dspace/common/emxIndentedTable.jsp`, `emxTable.jsp`, `GetValidations.jsp`, `scripts/emxUIFreezePane.js` (`getSetting("Validate")`, `"On Change Handler"`, `"Reload Function"`). 키 목록: `framework.jar` 의 `UITableCommon.class`, `UITableIndented.class`, `UITable.class` 문자열 상수. JPO 예: `jpo/emxTaskBase_mxJPO.java` 의 `isSummaryTaskCellEditable`, `getPercentageRangeValues`
:::

## table 정의

```text
add table 'XX_MyPartSummary' system
    column
        name 'Name'
        label 'emxFramework.Basic.Name'
        businessobject 'name'
        href '${COMMON_DIR}/emxTree.jsp'
        setting 'Registered Suite' 'Framework'
        setting 'Show Type Icon'   'true'
        setting 'Target Location'  'popup'
    column
        name 'Title'
        label 'emxFramework.Attribute.Title'
        businessobject '$<attribute[attribute_Title].value>'
        setting 'Field Type' 'attribute'
        setting 'Admin Type' 'attribute_Title'
        setting 'Editable'   'true'
    column
        name 'State'
        label 'emxFramework.Basic.State'
        businessobject 'current'
        setting 'Admin Type' 'State'
        setting 'Field Type' 'basic'
;
add property table_XX_MyPartSummary on program eServiceSchemaVariableMapping.tcl to table XX_MyPartSummary system;
```

- table 은 `system` 을 붙여 만듭니다 (`add table 이름 system`). 붙이지 않으면 사용자 개인 table 로 보입니다. 다른 명령(`del`, `print`, `add property ... to table`)에도 `system` 을 붙입니다.
- `column` 다음에 오는 절이 그 열의 정의입니다. 다음 `column` 이 나오면 새 열입니다. 적은 순서가 화면 순서입니다.

### column 절

| 절 | 의미 |
| --- | --- |
| `name` | 열 이름. URL 의 `sortColumnName`, `freezePane` 과 열 이름을 받는 JPO 가 이 값을 씀 |
| `label` | 열 제목 (문자열 리소스 키) |
| `businessobject` (`bus`) | 행 객체에서 읽을 select 식. `name`, `current`, `owner`, `$<attribute[attribute_X].value>` |
| `relationship` (`rel`) | 행의 **연결**에서 읽을 select 식. BOM 의 수량처럼 연결 attribute 를 보일 때 |
| `href` | 칸을 링크로 만듦. 행의 `objectId` 가 자동으로 붙음 |
| `range` | 편집 칸 옆 선택 버튼이 열 URL (검색 / 선택 화면) |
| `update` | 프로젝트에서는 거의 빈 값. 저장은 `Update Program` / `Function` setting 으로 함 |
| `sorttype` | `none`, `numeric`, `other` ... 프로젝트는 대부분 `none` 이고, 정렬 방식은 `Sort Type` setting 을 씀 |
| `alt` | 제목 툴팁 |
| `user` | 이 열을 보는 사람 (`'all'`) |
| `setting` | 아래 표 |

`businessobject` 와 `relationship` 을 모두 비우고 `Column Type` 을 `program` 류로 주면 값은 JPO 가 만듭니다.

## 열 종류: Column Type, Field Type

| setting | 값 | 의미 | 프로젝트 사용 |
| --- | --- | --- | --- |
| `Column Type` | (없음) | `businessobject` / `relationship` select 결과를 그대로 보임 | - |
| | `program` | `program` + `function` JPO 가 칸 값(글자)을 돌려줌 | 44 |
| | `programHTMLOutput` | JPO 가 HTML 을 돌려줌. 링크, 아이콘, 색 표시 | 157 |
| | `icon` | 아이콘 하나만 있는 열. `Column Icon` 에 그림, 누르면 `href` | 19 |
| | `Image` | 객체의 이미지(썸네일) | 2 |
| | `separator` | 열 사이 구분선 | 4 |
| | `Dynamic` | 열 여러 개를 실행 시점에 만듦 (`Dynamic Column Program` / `Function`) | 9 |
| `Field Type` | `attribute` | attribute 값. 편집, 필터, 정렬에 attribute 정보를 씀. `Admin Type` 에 심볼릭 이름 | 304 |
| | `basic` | `name`, `current`, `owner`, `type` 같은 기본 속성 | 101 (+ `Basic` 7) |
| `Admin Type` | `attribute_X`, `State`, `Type`, `owner` ... | 값을 번역할 때 쓰는 스키마 이름. `State` 면 상태 이름을 화면 글자로 바꿈 | 419 |

::: warning Column Type 에 attribute 를 적은 경우
프로젝트에 `Column Type` `attribute` 18 건, `basic` 2 건이 있습니다. 이 둘은 `Field Type` 쪽 값으로 보입니다. attribute 열은 `Field Type` `attribute` + `Admin Type` `attribute_X` 로 적습니다.
:::

### JPO 열 (program, programHTMLOutput)

```text
column
    name 'XX_Status'
    label 'emxXXMyApp.Label.Status'
    setting 'Column Type' 'programHTMLOutput'
    setting 'program'     'XX_MyPartUI'
    setting 'function'    'getStatusColumn'
    setting 'Sortable'    'false'
    setting 'Export'      'true'
```

- `program` 은 JPO 이름, `function` 은 메서드 이름입니다. 소문자 키입니다.
- 메서드는 화면에 그릴 행 전체(`objectList`)를 한 번에 받아 행 순서대로 값 목록(`Vector`)을 돌려줍니다. [JPO](/jpo/)
- JPO 열은 select 식이 없어서 정렬 / 필터가 어렵습니다. 프로젝트는 `Sortable` `false` 를 많이 줍니다 (119 건).

## 표시 setting

| setting | 값 | 설명 |
| --- | --- | --- |
| `Width` | 숫자 (px) | 열 너비. 100, 150, 200 순으로 많이 씀 |
| `Show Type Icon` | `true` | 이름 앞에 타입 아이콘 |
| `format` | `date`, `user`, `numeric`, `real` | 값 형식. `user` 는 사용자 id 를 이름으로 보임 |
| `Display Time` | `true` | 날짜에 시간까지 |
| `IgnoreTimeZone` | `true` | 시간대 변환 안 함 |
| `Sortable` | `true` / `false` | 제목 클릭 정렬 |
| `Sort Type` | `date`, `integer`, `other` ... | 정렬 비교 방식 |
| `Sort Program` | JPO 이름 | 정렬 비교를 JPO 로 (`emxSortHTMLAlphaNumericBase` 등) |
| `Auto Filter` | `true` / `false` | 열 머리의 값 필터 |
| `Export` | `true` / `false` | 엑셀 내보내기에 포함 |
| `Printer Friendly` | `true` / `false` | 인쇄 화면에 포함 |
| `Group Header` | 문자열 리소스 키 | 이웃한 열들 위에 묶음 제목. 같은 키를 연달아 준 열끼리 합쳐짐 |
| `Style Program` / `Style Function` | JPO | 칸마다 CSS 클래스를 정함 (색 표시) |
| `Alternate OID expression` | select 식 | 링크를 누를 때 행 객체 대신 이 식의 객체를 엶 |
| `Alternate Type expression` | select 식 | 타입 아이콘을 이 식의 타입으로 |
| `Show Alternate Icon` | `true` | 위 타입 아이콘을 표시 |
| `Column Icon` | 이미지 경로 | `icon` 열의 그림 |
| `Hide Mode` | `desktop,Cloud`, `mobile` ... | 환경별 숨김 |

링크 열의 `Target Location`, `Window Width`, `Popup Size` 등은 command 와 같습니다. [command, menu](/ui-components/command-menu#어디에-열까-target-location)

## 편집 가능한 열

`emxIndentedTable.jsp` 를 편집 모드로 열면(`mode=edit` 또는 툴바의 편집 버튼) `Editable` 인 열을 고칠 수 있습니다.

```text
column
    name 'XX_Grade'
    label 'emxXXMyApp.Label.Grade'
    businessobject '$<attribute[attribute_XX_Grade].value>'
    setting 'Field Type'      'attribute'
    setting 'Admin Type'      'attribute_XX_Grade'
    setting 'Editable'        'true'
    setting 'Input Type'      'combobox'
    setting 'Range Program'   'XX_MyPartUI'
    setting 'Range Function'  'getGradeRange'
    setting 'Update Program'  'XX_MyPartUI'
    setting 'Update Function' 'updateGrade'
    setting 'Edit Access Program'  'XX_MyPartUI'
    setting 'Edit Access Function' 'isGradeEditable'
```

| setting | 값 | 설명 |
| --- | --- | --- |
| `Editable` | `true` / `false` | 편집 가능 여부. 프로젝트는 `false` 327, `true` 163 |
| `Input Type` | `textbox`, `textarea`, `combobox`, `listbox` | 편집 칸 모양 |
| `Range Program` / `Range Function` | JPO | 선택지 목록. `field_choices` (저장 값), `field_display_choices` (보일 글자) 를 담은 Map 을 돌려줌 |
| `Update Program` / `Update Function` | JPO | 저장. 지정하면 기본 저장 대신 이 메서드를 부름 |
| `Edit Access Program` / `Edit Access Function` | JPO | 행마다 편집 가능 여부. 행 순서대로 `"true"` / `"false"` 목록(`StringList`)을 돌려줌 |
| `Validate` | JS 함수 이름 | 값 확인. `(값, 행상태)` 로 불리고 `true` / `false` 를 돌려줌 |
| `On Change Handler` | JS 함수 이름 (`:` 로 여러 개) | 값이 바뀐 뒤 실행 |
| `OnFocus Handler` | JS 함수 이름 | 칸에 들어갈 때 실행 |
| `Reload Program` / `Reload Function` | JPO | 다른 칸이 바뀌면 이 칸의 선택지를 다시 받음 |
| `Lookup Input Type` | `textbox` | 검색으로 고르는 칸 |
| `Data Type` | `numeric` | 숫자 확인 |

`Field Type` `attribute` 열은 `Update ...` 가 없어도 attribute 에 바로 저장되는 것으로 보입니다. JPO 열이나 연결 / 다른 객체 값은 `Update ...` 가 있어야 저장됩니다.

::: tip Validate 함수는 어디에 두나
`Validate` 에 적은 함수는 `eServiceSuite이름.UIFreezePane.ValidationFile` 에 등록한 JS 파일에서 찾습니다 (`GetValidations.jsp` 가 읽음). `Registered Suite` 에 맞는 suite 의 파일에 함수를 넣고, properties 에 파일 이름을 추가합니다.
:::

## emxIndentedTable.jsp

table 정의를 화면으로 만드는 JSP 입니다. 행을 얻는 방법에 따라 두 가지로 씁니다.

| 방식 | URL | 행 |
| --- | --- | --- |
| 평면 목록 | `emxIndentedTable.jsp?table=T&program=JPO:method` | `program` 이 돌려준 MapList (한 단계) |
| 구조 (BOM 등) | `emxIndentedTable.jsp?table=T&expandProgram=JPO:method&objectId=...` | 행을 펼칠 때마다 `expandProgram` 을 불러 자식을 받음 |
| 구조 (관계로) | `emxIndentedTable.jsp?table=T&relationship=relationship_X&direction=from&objectId=...` | JPO 없이 관계로 펼침 |

```text
${COMMON_DIR}/emxIndentedTable.jsp?table=XX_MyPartSummary
    &program=XX_MyPartUI:getMyPartList
    &toolbar=XX_MyPartListToolbar
    &selection=multiple
    &header=emxXXMyApp.Header.MyPartList
    &sortColumnName=Name&sortDirection=ascending
    &freezePane=Name
    &suiteKey=XXMyApp
```

(보기 좋게 줄을 나눴지만 실제 `href` 는 한 줄입니다.)

| 파라미터 | 값 | 설명 |
| --- | --- | --- |
| `table` | table 이름 | 열 정의 |
| `program` | <code>JPO:method</code> | 행 목록. 쉼표로 여러 개 주고 `programLabel` 에 같은 개수의 label 키를 주면 툴바에 목록 필터(전체 / 진행중 ...)가 생김 |
| `expandProgram` | <code>JPO:method</code> | 구조 펼침 |
| `toolbar` | menu 이름 (쉼표로 여러 개) | 위 툴바 |
| `selection` | `multiple`, `single`, `none` | 행 체크박스 종류 |
| `header` | 문자열 리소스 키 | 화면 제목 |
| `freezePane` | 열 이름 (쉼표로 여러 개) | 가로 스크롤해도 왼쪽에 고정할 열 |
| `sortColumnName`, `sortDirection` | 열 이름, `ascending` / `descending` | 처음 정렬 |
| `editLink` | `true` | 편집 버튼 표시 |
| `mode` | `edit` | 편집 모드로 열기 |
| `portalMode` | `true` | 포털 칸 안에 열 때 (포털이 붙여 줌) |

전체 목록: [URL 파라미터](/ui-components/url-parameters#emxindentedtable-jsp)

`program` 메서드는 `id` (객체 id) 를 담은 Map 들의 MapList 를 돌려줍니다. 구조 화면이면 연결 id(`id[connection]`), 단계(`level`)도 담습니다. 자세한 인자와 반환 형식은 [JPO](/jpo/) 를 봅니다.

::: warning emxTable.jsp
`emxTable.jsp` 는 예전 평면 목록 JSP 입니다. `tableType=new` 를 주거나 `emxFramework.Table.Type` 이 `new` 면 `emxIndentedTable.jsp` 로 넘깁니다. 이 환경은 `classic` 입니다. 프로젝트 정의는 모두 `emxIndentedTable.jsp` 를 씁니다 (59 건, `emxTable.jsp` 0 건).
:::

::: tip 같은 table 을 여러 화면에서
table 은 열 정의만 갖기 때문에 다른 `program` 과 묶어 여러 command 에서 다시 쓸 수 있습니다. OOTB `ENCRevisionSummary` 같은 table 을 프로젝트 JPO 와 묶어 쓰는 경우도 많습니다.
:::
