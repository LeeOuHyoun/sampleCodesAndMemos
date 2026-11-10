# webform (상세, 편집, 생성 화면) <Badge type="info" text="원본 분석" />

**webform** (MQL 이름은 `form`) 은 객체 하나의 필드(field) 목록입니다. 같은 form 을 `emxForm.jsp` 로 열면 **보기 / 편집** 화면, `emxCreate.jsp` 로 열면 **생성** 화면이 됩니다. 필드 정의는 table 의 column 과 거의 같고, 화면 배치용 필드 종류(섹션, 묶음)가 더 있습니다.

샘플: [03_webform_portal.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UIComponentSample/03_webform_portal.mql)

::: info 근거
`mql/09.webform/Form_Sample.mql`, 프로젝트 form 50 파일 (field 848 개), `PMCProjectTaskViewForm.mql`, `PMCProjectTaskCreateForm.mql`. 화면: `3dspace/common/emxForm.jsp` (`mode` 처리), `emxCreate.jsp`, `emxCreateProcess.jsp` (`submitAction`), `emxCreateBody.xsl` (`Group Name`), `scripts/emxUIFormHandler.js` (`FillProperties`). 키 목록: `framework.jar` 의 `UIFormCommon.class`, `UIForm.class` 문자열 상수. JPO 예: `jpo/emxProjectSpaceBase_mxJPO.java` 의 `getProjectPolicyRange`
:::

## form 정의

```text
add form 'type_XX_MyPart' web
    field
        name 'Name'
        label 'emxFramework.Basic.Name'
        businessobject '$<name>'
        setting 'Field Type' 'basic'
        setting 'Editable'   'false'
    field
        name 'Description'
        label 'emxFramework.Basic.Description'
        businessobject 'description'
        setting 'Field Type' 'basic'
        setting 'Input Type' 'textarea'
        setting 'Editable'   'true'
    field
        name 'XX_Grade'
        label 'emxXXMyApp.Label.Grade'
        businessobject '$<attribute[attribute_XX_Grade].value>'
        setting 'Field Type' 'attribute'
        setting 'Admin Type' 'attribute_XX_Grade'
        setting 'Input Type' 'combobox'
        setting 'Required'   'true'
        setting 'Editable'   'true'
;
add property form_XX_MyPart on program eServiceSchemaVariableMapping.tcl to form 'type_XX_MyPart';
```

- `web` 을 붙여 만듭니다 (`add form 이름 web`). `del form`, `print form` 에는 붙이지 않습니다.
- 상세 화면용 form 은 OOTB 처럼 `type_타입` 으로 이름 짓는 경우가 많습니다. 같은 이름의 `type_` menu (객체 트리) 와는 다른 객체입니다.
- field 절(`name`, `label`, `businessobject`, `relationship`, `range`, `update`, `href`, `alt`)의 뜻은 table column 과 같습니다. [column 절](/ui-components/table#column-절)

## 필드 종류: Field Type

| 값 | 의미 | 함께 쓰는 setting | 프로젝트 사용 |
| --- | --- | --- | --- |
| `attribute` | attribute 값. 편집 칸 종류와 선택지를 attribute 정의에서 가져옴 | `Admin Type` `attribute_X` | 454 |
| `basic` | `name`, `description`, `owner`, `type`, `policy`, `current` | `Admin Type` `Type` / `Policy` ... | 178 |
| `programHTMLOutput` | JPO 가 HTML 을 돌려줌 | `program`, `function` | 71 |
| `program` | JPO 가 글자를 돌려줌 | `program`, `function` | 19 |
| `Section Header` | 섹션 제목 줄 (필드 묶음 제목) | `Section Level` `1` | 44 |
| `Section Separator` | 구분선 | - | 1 |
| `Group Holder` | 다음 N 개 필드를 가로로 묶는 자리로 보임 | `Group Count` `2` | 5 |
| `Dynamic` | 필드 여러 개를 JPO 로 만듦 | `Dynamic Field Program` / `Function` | 4 |
| `Dynamic Attributes` | 타입의 attribute 를 자동으로 펼침 | `Create Exclude`, `Edit Exclude`, `View Exclude` | 2 |
| `ClassificationPaths` | 분류 경로 (라이브러리) | - | 2 |

JPO 필드의 메서드는 **현재 객체 하나** 기준으로 값을 돌려줍니다 (table 열처럼 행 목록을 받지 않음). [JPO](/jpo/)

## 편집 setting

| setting | 값 | 설명 | 프로젝트 사용 |
| --- | --- | --- | --- |
| `Editable` | `true` / `false` | 편집 모드에서 고칠 수 있는지 | 498 |
| `Required` | `true` | 필수 입력 (빨간 표시, 빈 값 저장 막음) | 185 |
| `Input Type` | `textbox`, `textarea`, `combobox`, `listbox`, `checkbox`, `radiobutton`, `listboxmanual` | 편집 칸 모양 | 351 |
| `Range Program` / `Range Function` | JPO | 선택지. `field_choices` / `field_display_choices` Map | 44 |
| `Update Program` / `Update Function` | JPO | 저장을 직접 처리 | 44 |
| `Edit Access Program` / `Edit Access Function` | JPO | 편집 가능 여부 | 1 |
| `Validate` | JS 함수 이름 | 값 확인. `eServiceSuite이름.UIForm.ValidationFile` 의 JS 에서 찾음 | 12 |
| `OnChange Handler` | JS 함수 이름 (`;` 로 여러 개) | 값이 바뀌면 실행 | 23 |
| `On Change Handler` | JS 함수 이름 (`:` 로 여러 개) | 위와 같음 (예전 이름) | 15 |
| `OnFocus Handler` | JS 함수 이름 | 칸에 들어갈 때 | - |
| `Reload Program` / `Reload Function` | JPO | 다른 필드가 바뀌면 이 필드 값 / 선택지를 다시 받음 | 29 |
| `Show Clear Button` | `true` | 선택 칸 옆 지우기 버튼 | 96 |
| `format` | `date`, `user`, `integer` | 값 형식. `date` 면 달력 | 60 |
| `Calendar Program` / `Calendar Function` | JPO | 달력의 휴일 표시 | 11 |
| `Allow Manual Edit` | `false` | 선택 칸에 직접 입력 금지 | 6 |
| `Hide Label` | `true` | 왼쪽 label 칸 숨김 | 7 |
| `Field Size` | 숫자 | textbox 글자 수 너비 | 4 |
| `Remove Range Blank` | `true` | combobox 의 빈 선택지 제거 | 1 |

::: warning OnChange Handler 와 On Change Handler
form 은 `OnChange Handler` (`;` 구분)를 먼저 읽고, 없을 때만 `On Change Handler` (`:` 구분)를 읽습니다 (`emxUIFormHandler.js` `FillProperties`). table 은 `On Change Handler` 만 읽습니다. 둘을 함께 적으면 form 에서는 `On Change Handler` 가 무시됩니다.
:::

### 선택 화면을 여는 필드 (range URL)

`range` 절에 URL 을 주면 칸 옆에 `...` 버튼이 생기고, 누르면 그 화면을 엽니다. 검색 결과에서 고른 값이 칸에 들어갑니다.

```text
field
    name 'XX_Supplier'
    label 'emxXXMyApp.Label.Supplier'
    range '${COMMON_DIR}/emxFullSearch.jsp?field=TYPES=type_Company&table=APPOrganizationSummary&selection=single&showInitialResults=true'
    setting 'Field Type'        'basic'
    setting 'Lookup Input Type' 'textbox'
    setting 'Show Clear Button' 'true'
    setting 'Update Program'    'XX_MyPartUI'
    setting 'Update Function'   'connectSupplier'
```

| 화면 | 쓰임 |
| --- | --- |
| `emxFullSearch.jsp?field=TYPES=type_X&table=...&selection=single` | 객체 검색. `field=TYPES=type_X:CURRENT=policy_P.state_S` 처럼 상태 조건 가능 |
| `emxTypeChooser.jsp?SelectType=single&InclusionList=type_X` | 타입 고르기 |
| 프로젝트 JSP | `fieldNameActual`, `fieldNameDisplay`, `fieldNameOID` 파라미터로 값을 돌려줄 칸 이름을 넘김 |

[emxFullSearch 파라미터](/ui-components/url-parameters#emxfullsearch-jsp)

## 배치

```text
field
    name 'BasicSection'
    label 'emxXXMyApp.Section.Basic'
    setting 'Field Type'    'Section Header'
    setting 'Section Level' '1'
field
    name 'DateGroup'
    label ''
    setting 'Field Type'  'Group Holder'
    setting 'Group Count' '2'
field
    name 'StartDate'
    ...
field
    name 'EndDate'
    ...
```

- `Section Header` 다음 필드들은 그 섹션 아래에 들어갑니다.
- `Group Holder` + `Group Count` `2` 는 바로 다음 두 필드를 한 줄에 놓는 것으로 보입니다.
- 생성 화면(`emxCreate.jsp`)에서는 `Group Name` 이 같은 필드끼리 가로로 묶습니다 (`emxCreateBody.xsl`). 프로젝트 생성 form 은 `Group Name` 을 253 건 씁니다.

## 보이기 조건

필드에도 `Access Expression`, `Access Function` / `Access Program`, `Access Mask` 가 그대로 됩니다. 프로젝트 form 은 `Access Expression` 131 건, `Access Function` 101 건을 씁니다. 같은 이름의 필드를 조건만 다르게 두 개 만들어 하나만 보이게 하는 방식이 흔합니다 (OOTB `PMCProjectTaskViewForm` 의 `NameNoEdit` / `Name`).

```text
setting 'Access Expression' "(from[relationship_ShadowGate] ~~ 'false')"
```

## emxForm.jsp (보기 / 편집)

```text
${COMMON_DIR}/emxForm.jsp?form=type_XX_MyPart&toolbar=XX_MyPartPropertiesToolbar&formHeader=emxXXMyApp.Header.Properties
```

| 파라미터 | 값 | 설명 |
| --- | --- | --- |
| `form` | form 이름 | 필드 정의 |
| `objectId` | 객체 id | 트리 / 포털 안에서는 자동으로 붙음 |
| `mode` | `view` (기본) / `edit` | `edit` 면 편집 화면(`emxFormEditDisplay.jsp`)으로 엶 |
| `toolbar` | menu 이름 | 위 툴바 |
| `formHeader` | 문자열 리소스 키 | 화면 제목 |
| `editLink` | `true` | 보기 화면에 편집 버튼 |
| `postProcessJPO` | <code>JPO:method</code> | 편집 저장 뒤 실행 |
| `postProcessURL` | URL | 편집 저장 뒤 열 JSP |
| `preProcessJavaScript` | JS 함수 이름 | 편집 화면을 띄운 직후 실행 |
| `targetLocation` | `slidein` | 슬라이드인 안에서 열 때 (보기 화면 아래 버튼이 달라짐) |
| `HelpMarker` | 도움말 키 | 도움말 버튼 |

편집 command 는 보통 같은 form 에 `mode=edit` 를 붙여 `Target Location` `slidein` 또는 `popup` 으로 엽니다.

## emxCreate.jsp (생성)

```text
${COMMON_DIR}/emxCreate.jsp?type=type_XX_MyPart&policy=policy_XX_MyPart&form=XX_MyPartCreateForm
    &nameField=autoname&header=emxXXMyApp.Header.Create
    &createJPO=XX_MyPartUI:createMyPart&postProcessJPO=XX_MyPartUI:afterCreate
    &submitAction=refreshCaller&suiteKey=XXMyApp
```

| 파라미터 | 값 | 설명 |
| --- | --- | --- |
| `type` | 심볼릭 타입 | 만들 타입 |
| `policy` | 심볼릭 policy | 만들 때 쓸 policy |
| `form` | form 이름 | 입력 필드 |
| `nameField` | `autoname`, `keyin`, `both` | 이름을 채번할지, 직접 입력할지, 둘 다 고를지 |
| `typeChooser` | `true` / `false` | 하위 타입 고르기 칸 |
| `createJPO` | <code>JPO:method</code> | 기본 생성 대신 이 메서드로 생성 |
| `postProcessJPO` | <code>JPO:method</code> | 생성 뒤 실행 (연결, 추가 값 설정) |
| `preProcessJavaScript` | JS 함수 이름 | 화면을 띄운 직후 |
| `submitAction` | `refreshCaller`, `refreshCallerParent`, `treeContent`, `treePopup` | 생성 뒤 동작. 부른 화면 새로고침 / 부모 새로고침 / 새 객체를 가운데에 엶 / 새 객체를 팝업으로 엶 |
| `header` | 문자열 리소스 키 | 제목 |
| `slideinType` | `wider` | 넓은 슬라이드인 |

`submitAction` 을 주지 않으면 "생성되었습니다" 알림만 띄웁니다 (`emxCreateProcess.jsp`).

::: tip 생성 form 과 상세 form 을 나누는 이유
생성 화면에는 `Editable` `true` 필드만 필요하고, 상세 화면에는 계산 값이나 연결 정보 필드가 더 붙습니다. 프로젝트도 `...CreateForm` 과 `type_...` (상세) 를 따로 둡니다.
:::
