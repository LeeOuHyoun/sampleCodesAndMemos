# settings 레퍼런스 <Badge type="info" text="원본 분석" />

`setting '키' '값'` 은 command, menu, column, field, channel, portal 의 동작을 정합니다. 키는 정해진 영어 문구이고 값은 항상 문자열입니다. 이 페이지는 대상별로 키를 모읍니다.

- "사용" 은 프로젝트 MQL 정의에서 그 키가 나온 줄 수입니다 (주석 줄 제외). OOTB 를 `mod` 한 파일도 포함합니다.
- "읽는 곳" 은 그 키 문자열이 들어 있는 프레임워크 클래스 / 스크립트입니다.

::: info 근거
집계: `mql/06.command` ~ `11.portal` 의 `setting` 줄을 node 스크립트로 셈. command 33 종 1,466 줄, menu 12 종 139 줄, table column 75 종 4,340 줄, form field 66 종 4,655 줄, channel 2 종 11 줄, portal 1 종 7 줄. 읽는 곳: `WEB-INF/lib/framework.jar` (`UITable*`, `UIForm*`, `UIToolbar`, `UIPortal`), `xerinfra.jar` (`UIComponent`, `UINavigatorUtil`, `UIMenu`, `UITreeUtil`, `UICache`) 의 문자열 상수, `common/scripts/emxUIFreezePane.js`, `emxUIFormHandler.js`, `emxUICore.js`, `common/emxCreateBody.xsl`. 값 범위: `properties/emxSystem.properties`
:::

::: warning 키는 대소문자까지 똑같이
`UIComponent.getSetting(map, 키)` 는 settings `HashMap` 에서 `Map.get(키)` 로 그대로 찾고 값만 `trim` 합니다. 키 이름이 한 글자라도 다르면 **오류 없이 무시** 됩니다. 프로젝트에서 읽는 곳을 찾지 못한 키:

| 적힌 키 | 사용 | 바른 키 |
| --- | --- | --- |
| `Alternate TYPE expression` | 29 | `Alternate Type expression` |
| `formate` | 1 | `format` |
| `image` (menu) | 1 | `Image` |
| `PopUp Size` | 1 | `Popup Size` |
| `Range program` | 1 | `Range Program` |
| `selection`, `Selection` (command) | 14 | command 는 `Row Select`. `selection` 은 URL 파라미터 |
| `Input Type1`, `On Change Handler1`, `OnFocus Handler1` | 각 1 | 이름을 바꿔 임시로 끈 것으로 보입니다 |
| `Single Click`, `Type Ahead Validation`, `Align` | 2, 17, 2 | OOTB 코드에서 읽는 곳을 찾지 못함 |

값은 키마다 다릅니다. `Field Type` 처럼 소문자로 바꿔 비교하는 곳도 있지만(`emxCreateBody.xsl`), `Row Select` 의 `single` 처럼 정확히 비교하는 곳도 있습니다. 값도 이 페이지의 표기대로 씁니다.
:::

## 공통

여러 대상에 같은 뜻으로 쓰는 키입니다. 사용 칸은 command / menu / column / field 순서입니다.

### Registered Suite

| 값 | 의미 |
| --- | --- |
| suite 이름 (`Framework`, `Components`, `ProgramCentral`, `ProductLine`, `EngineeringCentral`, `LibraryCentral`, `DocumentCentral` ...) | 이 항목이 속한 앱 |

사용: 325 / 71 / 829 / 848 (channel 9, portal 7). 거의 모든 정의에 있습니다.

suite 이름 `X` 는 `emxSystem.properties` 의 `eServiceSuiteX.*` 묶음을 가리킵니다.

| 속성 | 예 (`ProductLine`) | 쓰임 |
| --- | --- | --- |
| `eServiceSuiteX.Directory` | `productline` | `${SUITE_DIR}` |
| `eServiceSuiteX.StringResourceFileId` | `emxProductLineStringResource` | `label` 키를 찾을 문자열 파일 |
| `eServiceSuiteX.UIForm.ValidationFile` | `UIFormValidation.jsp` | form `Validate` 함수가 있는 파일 |
| `eServiceSuiteX.UIFreezePane.ValidationFile` | 쉼표로 여러 파일 | table `Validate` 함수가 있는 파일 |

::: tip 프로젝트 suite
프로젝트 전용 앱을 따로 등록하면(`eServiceSuiteXXMyApp.*`) 문자열 파일과 폴더를 분리할 수 있습니다. label 키가 화면에 키 그대로 보이면 `Registered Suite` 와 문자열 파일이 맞는지 먼저 봅니다.
:::

### 접근

| 키 | 값 | 의미 | 사용 | 읽는 곳 |
| --- | --- | --- | --- | --- |
| `Access Expression` | select 식, `true`, `false` | 참일 때만 보임 | 98 / 1 / 10 / 131 | `UINavigatorUtil` |
| `Access Function` | JPO 메서드 이름 | `boolean` 을 돌려주는 메서드. 참일 때만 보임 | 74 / 15 / 19 / 101 | `UINavigatorUtil` |
| `Access Program` | JPO 이름 | `Access Function` 의 JPO | 74 / 15 / 19 / 101 | `UINavigatorUtil` |
| `Access Mask` | `modify`, `read` ... | 현재 객체 권한 | 1 / - / - / - | `UINavigatorUtil` |
| `Licensed Product` | 라이선스 코드 | 라이선스가 있는 사용자만 | 4 / 8 / 2 / 4 | `UINavigatorUtil`, `UICache` |
| `Hide Mode` | `Mobile`, `mobile`, `!mobile`, `desktop,Cloud` | 실행 환경별 숨김 | 2 / - / 6 / - | `UINavigatorUtil` |

### 열기

| 키 | 값 | 의미 | 사용 | 읽는 곳 |
| --- | --- | --- | --- | --- |
| `Target Location` | `content`, `listHidden`, `popup`, `slidein`, `self`, 프레임 이름 | 링크를 열 곳. [자세히](/ui-components/command-menu#어디에-열까-target-location) | 289 / - / 97 / 16 | `UIToolbar`, `UIMenu`, `UIComponent`, `emxUICore.js` |
| `Popup Modal` | `true` / `false` | 모달 창 | 58 / - / 5 / - | `UIToolbar`, `UIComponent` |
| `Window Width`, `Window Height` | 숫자 (px) | 팝업 크기 | 35 / - / - / 9 | `UIToolbar`, `UIFormCommon` |
| `Popup Size` | `Small`, `Medium`, `Large`, `SmallTall`, `MediumTall`, 등록된 `가로x세로` | 팝업 크기 이름. 기본 `Medium` (812x500) | 12 / - / 35 / 27 | `UIToolbar`, `UIUtil` |
| `Slidein Width` | 숫자 (px) | 슬라이드인 너비 | 15 / - / - / - | `UIToolbar` |
| `Image` | 이미지 경로 | 툴바 / 메뉴 아이콘 | 138 / 20 / 2 / - | `UIToolbar`, `UIMenu` |

`Popup Size` 이름별 크기 (`emxSystem.properties` 5298~5308 행): `Small` 412x400, `Medium` 812x500, `Large` 965x700, `SmallTall` 412x700, `MediumTall` 812x700.

## command

툴바 / 메뉴 / 카테고리 항목에 쓰는 키입니다. 위 공통 키도 씁니다.

| 키 | 값 | 의미 | 사용 | 읽는 곳 |
| --- | --- | --- | --- | --- |
| `Submit` | `true` | 목록의 체크한 행(`emxTableRowId`)을 `href` 로 보냄 | 136 | `UIToolbar` |
| `Row Select` | `single`, `multiple`, `none` | 보내기 전 선택 개수 검사 | 68 | `UIToolbar`, `emxUICore.js` |
| `Confirm Message` | 문자열 키 | 확인 창. `${TABLE_SELECTED_COUNT}` 치환 | 54 | `UIToolbar`, `emxUICore.js` |
| `Help Marker` | 도움말 키 | 도움말 | 1 | `UIToolbar` |
| `Mode` | `view`, `edit` | 구조 브라우저의 보기 / 편집 중 어느 쪽 툴바에 보일지로 보입니다 | 8 | `UIToolbar` |
| `Input Type` | `textbox`, `combobox`, `checkbox`, `submit` | 툴바 안에 입력 칸을 둠 (버튼 대신) | 5 | `UIToolbar` |
| `Range Program` / `Range Function` | JPO | 툴바 combobox 선택지 | 5 / 5 | `UIToolbar` |
| `Range Values`, `Range Display Values` | 목록 | 툴바 combobox 선택지를 직접 적는 것으로 보입니다 | - | `UIToolbar` |
| `Show Clear Button`, `Allow Manual Edit`, `Maximum Length` | `true` / 숫자 | 툴바 입력 칸 옵션 | - | `UIToolbar` |
| `Submit Program` / `Submit Function` | JPO | 툴바 입력 값을 JPO 로 보냄 (`emxAEFSubmitJPO.jsp`) | - | `UIToolbar`, `emxUIToolbar.js` |
| `Dynamic Label Program` / `Function` | JPO | label 을 JPO 로 | 1 / 1 | `UIToolbar` |
| `Pull Right` | `true` | 하위 메뉴를 오른쪽으로 펼치는 것으로 보입니다 | - | `UIToolbar` |
| `table` | table 이름 | `tableMenu` 안 command 일 때 그 보기의 table | 1 | `UIToolbar`, `UITable*` |
| `Label Program` / `Function`, `Structure Program` / `Function` | JPO | 트리 노드 글자 / 구조 트리 자식 | 1 / 1 | `UITreeUtil` |

`Row Select` 프로젝트 값: `Multiple` 24, `single` 15, `multiple` 11, `true` 6, `multi` 5, `Multi` 3, `Single` 2, `none` 2. [Row Select 값](/ui-components/command-menu#툴바-command-선택-행-넘기기)

## menu (툴바, 트리)

| 키 | 값 | 의미 | 사용 | 읽는 곳 |
| --- | --- | --- | --- | --- |
| `Image` | 이미지 경로 | 드롭다운 버튼 아이콘 (`iconActionActions.png` 가 흔함) | 20 | `UIToolbar`, `UIMenu` |
| `Show Type Icon` | `true` | 트리 위 타입 아이콘 | 4 | `UIComponent` |
| `Default Category Program` / `Function` | JPO | 처음 열 카테고리 | 1 / 1 | `UITreeUtil` |
| `Tree Scope ID` | 파라미터 이름 | 트리 노드에 붙일 범위 id 로 보입니다 | 1 | `UITreeUtil` |
| `Structure Menu` | menu 이름 | 왼쪽 구조 트리 | - | `UITreeUtil` |
| `Dynamic Command Program` / `Function` | JPO | command 목록을 실행 시점에 만듦 | - | `UIToolbar`, `UIPortal` |
| `ImageDrop Relationship` | 관계 이름 | 트리에 이미지를 끌어 놓을 때 쓸 관계로 보입니다 | 1 | `emxTree.jsp` |

## table column

[table](/ui-components/table) 에서 예와 함께 설명합니다. 사용이 많은 순서입니다.

### 값과 종류

| 키 | 값 | 의미 | 사용 |
| --- | --- | --- | --- |
| `Field Type` | `attribute`, `basic` | 값의 출처 종류 | 412 |
| `Admin Type` | `attribute_X`, `State`, `Type`, `owner`, `originated` ... | 번역 / 편집에 쓸 스키마 이름 | 419 |
| `Column Type` | `program`, `programHTMLOutput`, `icon`, `Image`, `separator`, `Dynamic` | 열 종류 | 255 |
| `program`, `function` | JPO 이름, 메서드 이름 | JPO 열 | 201 / 201 |
| `Dynamic Column Program` / `Function` | JPO | 열 여러 개를 실행 시점에 만듦 | 9 / 9 |
| `Alternate OID expression` | select 식 | 링크 대상 객체 | 30 |
| `Alternate Type expression` | select 식 | 타입 아이콘 대상 | 8 (+ 잘못된 표기 21) |
| `Show Alternate Icon` | `true` | 위 아이콘 표시 | 7 |

### 표시

| 키 | 값 | 의미 | 사용 |
| --- | --- | --- | --- |
| `Width` | 숫자 | 열 너비 | 318 |
| `Sortable` | `true` / `false` | 정렬 가능 | 161 |
| `Sort Type` | `date`, `integer`, `other` | 정렬 비교 방식 | 48 |
| `Sort Program` | JPO 이름 | 정렬 비교 JPO | 6 |
| `Target Location` | 공통 참고 | 링크 열 | 97 |
| `format` | `date`, `user`, `numeric`, `real` | 값 형식 | 89 |
| `Auto Filter` | `true` / `false` | 열 필터 | 70 |
| `Show Type Icon` | `true` | 타입 아이콘 | 68 |
| `Export` | `true` / `false` | 내보내기 포함 | 47 |
| `Group Header` | 문자열 키 | 열 묶음 제목 | 47 |
| `Popup Size` | 공통 참고 | 링크 팝업 크기 | 35 |
| `Style Program` / `Style Function` | JPO | 칸 CSS 클래스 | 25 / 25 |
| `RMB Menu` | menu 이름 / `false` | 오른쪽 클릭 메뉴 | 22 |
| `Column Icon` | 이미지 경로 | `icon` 열 그림 | 19 |
| `Printer Friendly` | `true` / `false` | 인쇄 포함 | 19 |
| `Display Time` | `true` | 날짜에 시간 | 15 |
| `IgnoreTimeZone` | `true` | 시간대 변환 안 함 | 7 |
| `Hide Mode` | 공통 참고 | 환경별 숨김 | 6 |
| `Draggable` | `true` / `false` | 끌어 놓기 | 5 |
| `Image Size` | 이미지 format 이름 | `Image` 열 크기 | 2 |
| `Calculate Sum` | `true` | 합계 줄 (`calculations=true` 와 함께) | 1 |
| `Group By` | `true` | 행 묶기 기준 열로 보입니다 | 1 |

### 편집

| 키 | 값 | 의미 | 사용 |
| --- | --- | --- | --- |
| `Editable` | `true` / `false` | 편집 가능 | 490 |
| `Input Type` | `textbox`, `textarea`, `combobox`, `listbox` | 편집 칸 | 43 |
| `Update Program` / `Update Function` | JPO | 저장 | 25 / 25 |
| `Edit Access Program` / `Edit Access Function` | JPO | 행별 편집 가능 (`StringList` of `"true"` / `"false"`) | 22 / 22 |
| `Range Program` / `Range Function` | JPO | 선택지 (`field_choices`, `field_display_choices`) | 11 / 11 |
| `Reload Program` / `Reload Function` | JPO | 선택지 다시 받기 | 5 / 5 |
| `OnFocus Handler` | JS 함수 | 칸에 들어갈 때 | 5 |
| `On Change Handler` | JS 함수 (`:` 구분) | 값이 바뀐 뒤 | 3 |
| `Validate` | JS 함수 | 값 확인 | 3 |
| `Data Type` | `numeric` | 숫자 확인 | 5 |
| `Lookup Input Type` | `textbox` | 검색으로 고르는 칸 | - |
| `Sort Range Values` | `disable` | 선택지 정렬 끔 | 2 |
| `Calendar Program` / `Calendar Function` | JPO | 달력 휴일 | 4 / 4 |

## form field

[webform](/ui-components/webform) 에서 예와 함께 설명합니다.

### 값과 배치

| 키 | 값 | 의미 | 사용 |
| --- | --- | --- | --- |
| `Field Type` | `attribute`, `basic`, `programHTMLOutput`, `program`, `Section Header`, `Section Separator`, `Group Holder`, `Dynamic`, `Dynamic Attributes`, `ClassificationPaths` | 필드 종류 | 780 |
| `Admin Type` | 스키마 이름 | 번역 / 편집에 쓸 스키마 | 482 |
| `program`, `function` | JPO 이름, 메서드 이름 | JPO 필드 | 91 / 91 |
| `Group Name` | 묶음 이름 | 생성 화면 가로 묶음 | 253 |
| `Section Level` | `1` | 섹션 단계 | 22 |
| `Group Count` | 숫자 | `Group Holder` 가 묶을 필드 수 | 5 |
| `Dynamic Field Program` / `Function` | JPO | 필드 여러 개를 만듦 | 4 / 4 |
| `Create Exclude`, `Edit Exclude`, `View Exclude` | 심볼릭 attribute 쉼표 목록 | `Dynamic Attributes` 에서 뺄 attribute | 1 / 1 / 1 |
| `Hide Label` | `true` | label 칸 숨김 | 7 |
| `Alternate OID expression`, `Alternate Type expression` | select 식 | 링크 / 아이콘 대상 | 15 / 7 (+ 잘못된 표기 8) |

### 편집

| 키 | 값 | 의미 | 사용 |
| --- | --- | --- | --- |
| `Editable` | `true` / `false` | 편집 가능 | 498 |
| `Input Type` | `textbox`, `textarea`, `combobox`, `listbox`, `checkbox`, `radiobutton`, `listboxmanual` | 편집 칸 | 351 |
| `Required` | `true` / `false` | 필수 | 185 |
| `Show Clear Button` | `true` | 지우기 버튼 | 96 |
| `format` | `date`, `user`, `integer` | 값 형식 | 60 |
| `Range Program` / `Range Function` | JPO | 선택지 | 44 / 45 |
| `Update Program` / `Update Function` | JPO | 저장 | 44 / 44 |
| `Reload Program` / `Reload Function` | JPO | 다른 필드가 바뀌면 다시 받기 | 29 / 29 |
| `OnChange Handler` | JS 함수 (`;` 구분) | 값이 바뀐 뒤. 있으면 `On Change Handler` 보다 먼저 | 23 |
| `On Change Handler` | JS 함수 (`:` 구분) | 위의 예전 이름 | 15 |
| `Type Ahead Mapping` | `NAME`, `LABEL` | 자동 완성 결과에서 칸에 넣을 값으로 보입니다 | 20 |
| `Lookup Input Type` | `textbox` | 검색 선택 칸 | 17 |
| `Validate` | JS 함수 | 값 확인 | 12 |
| `Calendar Program` / `Calendar Function` | JPO | 달력 휴일 | 11 / 11 |
| `Validate Type` | `Basic` | 기본 금지 문자 검사로 보입니다 | 9 |
| `Allow Manual Edit` | `false` | 직접 입력 금지 | 6 |
| `Field Size` | 숫자 | 칸 너비 | 4 |
| `readonly` | `true` | 읽기 전용 | 4 |
| `Type Ahead Validate` | `true` | 자동 완성 결과 값만 허용하는 것으로 보입니다 | 3 |
| `Edit Access Program` / `Edit Access Function` | JPO | 편집 가능 여부 | 1 / 1 |
| `Remove Range Blank` | `true` | 빈 선택지 제거 | 1 |

## channel, portal

| 대상 | 키 | 값 | 의미 | 사용 |
| --- | --- | --- | --- | --- |
| channel | `Registered Suite` | suite | 탭 label 문자열 파일 | 9 |
| channel | `Height` | `70%`, `30%` ... | 행 높이 | 2 |
| channel | `Dynamic Command Program` / `Function` | JPO | 탭 목록을 JPO 로 | - |
| portal | `Registered Suite` | suite | 포털 label | 7 |

## JPO 열 전용 키 (OOTB 범용 JPO)

`Column Type` `program` 으로 OOTB 범용 JPO `emxGenericColumns` / `emxGenericFields` 를 쓰면, 그 JPO 가 settings 에서 키를 더 읽습니다. 예: `Max Items`, `Url`, `Values`, `Types`, `Relationships`, `Thumbnail ...`, `Table ...`, `Filter ...`. 이 키는 프레임워크가 아니라 **그 JPO** 가 읽으므로, 다른 JPO 열에 적으면 효과가 없습니다 (`jpo/emxGenericColumnsBase_mxJPO.java`, `emxGenericFieldsBase_mxJPO.java` 의 `settings.get("...")`).

같은 원리로 프로젝트 JPO / JS 도 자기만의 setting 키를 만들어 읽을 수 있습니다. 프로젝트에도 자동 완성용 사용자 키 묶음(8 종, 각 3 건)이 있고, 프로젝트 JS 에서 읽습니다. 이런 키는 OOTB 문서에 없으므로 그 JPO / JS 를 함께 봐야 합니다. [JPO](/jpo/)
