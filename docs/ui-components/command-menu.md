# command, menu <Badge type="info" text="원본 분석" />

**command** 는 링크 하나입니다. 무엇을 열지(`href`), 어떻게 보일지(`label`, `Image`), 어디에 열지(`Target Location`), 누구에게 보일지(`Access ...`)를 정합니다. **menu** 는 command 와 다른 menu 를 담는 묶음입니다. 같은 menu 객체가 놓이는 곳에 따라 툴바, 드롭다운, 객체 트리, 앱 메뉴가 됩니다.

샘플: [01_command_menu.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UIComponentSample/01_command_menu.mql)

::: info 근거
`mql/06.command/Command_sample.mql`, `mql/07.menu/Menu_Sample.mql`, `mql/07.menu/Tree.mql`, `type_*.mql`, 프로젝트 command 346 파일 / menu 146 파일. 동작: `3dspace/common/scripts/emxUICore.js` 의 `submitList`, `findFrame`, `scripts/emxUIToolbar.js`, `common/emxTree.jsp`. 키 목록: `xerinfra.jar` 의 `UINavigatorUtil.class`, `UIMenu.class`, `framework.jar` 의 `UIToolbar.class` 문자열 상수. `properties/emxSystem.properties` 의 `emxFramework.PopupSize`, `eServiceSuite*`
:::

## command 정의

```text
add command 'XX_MyPartCreate'
    description 'My Part 생성'
    label   'emxXXMyApp.Command.MyPartCreate'
    href    '${COMMON_DIR}/emxCreate.jsp?type=type_XX_MyPart&form=XX_MyPartCreateForm&policy=policy_XX_MyPart&submitAction=refreshCaller'
    alt     'emxXXMyApp.Command.MyPartCreate'
    setting 'Registered Suite'  'XXMyApp'
    setting 'Target Location'   'slidein'
    setting 'Image'             '${COMMON_DIR}/images/iconActionCreate.png'
    setting 'Access Function'   'hasCreateAccess'
    setting 'Access Program'    'XX_MyPartUI'
    property 'original name' value 'XX_MyPartCreate'
;
add property command_XX_MyPartCreate on program eServiceSchemaVariableMapping.tcl to command XX_MyPartCreate;
mod menu 'XX_MyPartActions' add command 'XX_MyPartCreate';
```

| 절 | 의미 |
| --- | --- |
| `label` | 화면 글자. 보통 문자열 리소스 키. `Registered Suite` 의 문자열 파일에서 찾음 |
| `href` | 누르면 열 URL. 비우면(`''`) 링크 없이 묶음 / 설정용 |
| `alt` | 마우스를 올렸을 때 글자 (툴팁) |
| `user` | 보이는 사람. `'all'` 이 대부분. role 이름을 적으면 그 role 만 보임 |
| `code` | 프로젝트에서는 항상 빈 값 |
| `setting` | 동작 설정. [settings 레퍼런스](/ui-components/settings#command) |
| `nothidden` / `hidden` | 관리 도구에서 숨길지. 화면 동작과는 무관한 것으로 보입니다 |

### href 매크로

`href` 와 `label` 안의 `${...}` 는 화면을 그릴 때 바뀝니다 (`UINavigatorUtil` 이 처리).

| 매크로 | 바뀌는 값 | 프로젝트 사용 |
| --- | --- | --- |
| `${COMMON_DIR}` | `common` 폴더 (`emxIndentedTable.jsp` 같은 프레임워크 JSP 위치) | 527 |
| `${SUITE_DIR}` | `Registered Suite` 의 폴더 (`eServiceSuite이름.Directory`). 예: `ProgramCentral` → `programcentral` | 210 |
| `${COMPONENT_DIR}` | `components` 폴더 | 1 |
| `${ROOT_DIR}` | 웹앱 루트 | 1 |
| `${NAME}`, `${REVISION}`, `${TYPE}` | 현재 객체의 이름 / 리비전 / 타입. 객체 트리 label 에 씀 | 7 / 7 / - |
| `$<select식>` | 현재 객체에서 select 한 값. 예: `$<attribute[attribute_Title].value>` | label 에 몇 건 |

`href` 가 `javascript:함수()` 로 시작하면 URL 대신 그 함수를 실행합니다 (툴바에서 편집 모드 전환 `javascript:editMode()` 등).

::: tip 폴더 규칙
템플릿 주석의 규칙: `common` 폴더 JSP 는 `${COMMON_DIR}/`, `components` 는 `${COMPONENT_DIR}/`, 앱 폴더(프로젝트 JSP 포함)는 `${SUITE_DIR}/` 로 씁니다. `${SUITE_DIR}` 를 쓰면 `Registered Suite` 가 맞아야 경로가 맞습니다.
:::

## 어디에 열까: Target Location

| 값 | 동작 | 프로젝트 사용 |
| --- | --- | --- |
| `content` | 가운데 내용 칸(`content` 프레임)에 엶. 트리 카테고리, 목록 command 의 기본 | 104 (+ `Content` 7) |
| `listHidden` | 화면에 안 보이는 숨은 프레임에서 실행. 삭제, 상태 변경처럼 처리만 하고 결과는 스크립트로 알리는 JSP 용 | 104 |
| `popup` | 새 창(팝업). 크기는 `Window Width` / `Window Height` 또는 `Popup Size` | 39 |
| `slidein` | 오른쪽에서 밀려 나오는 패널. 너비는 `Slidein Width` | 23 |
| `self` | 지금 보고 있는 프레임 | 7 |
| `hiddenFrame`, `formViewHidden` | 다른 숨은 프레임 이름 | 4, 1 |
| 그 밖의 문자열 | 그 이름의 프레임을 찾아서 엶. 못 찾으면 `content` 로 엶 | - |

`popup` / `slidein` 이 아닌 값은 **프레임 이름** 입니다. `emxUICore.findFrame` 이 이름으로 프레임을 찾고, `_top`, `_self`, `_parent` 만 따로 처리합니다.

::: warning 값은 소문자로
프레임 이름 비교는 대소문자를 가리는 것으로 보입니다. 프로젝트에 `Content` 로 적은 command 가 8 건 있습니다. 찾지 못하면 `content` 로 되돌아가서 우연히 동작하지만, 표준 값인 `content` 로 적습니다.
:::

### 창 크기

| setting | 값 | 설명 |
| --- | --- | --- |
| `Popup Modal` | `true` / `false` | `true` 면 모달 창 (뒤 화면 조작 불가) |
| `Window Width`, `Window Height` | 숫자 (px) | 팝업 크기. 프로젝트에서는 700 x 600 이 대부분 |
| `Popup Size` | `Small`, `Medium`, `Large`, `SmallTall`, `MediumTall`, 또는 `가로x세로` | 이름은 `emxFramework.PopupSize.이름` 값으로 바뀜. 기본 `Medium` = 812x500, `Large` = 965x700 |
| `Slidein Width` | 숫자 (px) | 슬라이드인 너비 |

`가로x세로` 형식(`1500x1000`)은 `emxFramework.PopupSize` 목록에 등록된 것만 쓰는 것으로 보입니다. 프로젝트는 `emxFrameworkCustom.properties` 에 크기를 추가해 둡니다.

## 툴바 command: 선택 행 넘기기

목록 화면의 툴바 command 는 체크한 행을 받아 처리하는 경우가 많습니다.

```text
add command 'XX_MyPartDelete'
    label 'emxXXMyApp.Command.Delete'
    href  '${SUITE_DIR}/XX_MyPartDeleteProcess.jsp'
    setting 'Registered Suite' 'XXMyApp'
    setting 'Target Location'  'listHidden'
    setting 'Submit'           'true'
    setting 'Row Select'       'multiple'
    setting 'Confirm Message'  'emxXXMyApp.Confirm.Delete'
    setting 'Image'            '${COMMON_DIR}/images/iconActionDelete.png'
;
```

| setting | 값 | 설명 |
| --- | --- | --- |
| `Submit` | `true` | 목록의 form 을 `href` 로 보냄. 체크한 행이 `emxTableRowId` 파라미터로 감 |
| `Row Select` | `single`, `multiple`, `none` | 선택 개수 검사. `single` 은 1 개만, `none` 은 검사 안 함, 그 밖의 값은 1 개 이상 |
| `Confirm Message` | 문자열 리소스 키 | 보내기 전에 확인 창. 메시지 안의 `${TABLE_SELECTED_COUNT}` 는 선택 개수로 바뀜 |
| `Image` | 아이콘 경로 | 툴바 아이콘. 없으면 글자 버튼 |

`emxTableRowId` 값 하나는 `relId|objectId|parentId|rowId` 형식입니다 (`emxUIFreezePane.js`). 받는 JSP 에서 `request.getParameterValues("emxTableRowId")` 로 읽고 `|` 로 나눕니다. 연결이 없는 행은 `relId` 가 빈 값입니다.

::: warning Row Select 값
선택 개수 검사(`submitList`)는 `strRowSelect == "single"` 처럼 정확히 비교합니다. `Single`, `Multi`, `true` 같은 값은 "1 개 이상" 으로만 동작합니다. 프로젝트에는 `Multiple` 24, `single` 15, `multiple` 11, `true` 6, `multi` 5 건 등이 섞여 있습니다. `single` / `multiple` / `none` 중 하나를 소문자로 씁니다.
:::

::: warning selection 은 URL 파라미터
command setting 에 `selection` 을 적은 사례(12 건)가 있습니다. `selection` 은 `emxIndentedTable.jsp` 의 **URL 파라미터**(체크박스 종류)이고, command 의 선택 검사는 `Row Select` 입니다.
:::

## 보일지 말지: 접근 setting

메뉴, 툴바, 트리를 그릴 때 command 와 menu 마다 검사합니다. 하나라도 거짓이면 그 항목이 빠집니다.

| setting | 값 | 설명 |
| --- | --- | --- |
| `Access Expression` | select 식 / `true` / `false` | 현재 객체 기준으로 평가하는 것으로 보입니다. 예: `current == 'In Work'`, `context.user == 'admin_platform'` |
| `Access Function` + `Access Program` | JPO 메서드 이름 + JPO 이름 | `boolean` 을 돌려주는 JPO 메서드. 둘 다 적어야 함 |
| `Access Mask` | 권한 이름 (`modify`, `read` ...) | 현재 객체에 그 권한이 있어야 보임 |
| `user` (절) | `'all'` 또는 role 이름 | role 기준 노출 |
| `Licensed Product` | 라이선스 코드 (`ENO_PRF_TP` ...) | 그 라이선스가 있는 사용자에게만 |
| `Hide Mode` | `Mobile`, `desktop`, `Cloud`, `!mobile` ... | 실행 환경에 따라 숨김 |

```text
setting 'Access Expression' "current == 'In Work' && owner == context.user"
```

Access Function 메서드의 인자와 작성법은 [JPO](/jpo/) 문서를 봅니다.

::: tip 셋 중 무엇을 쓸까
select 식으로 끝나면 `Access Expression` 이 가장 가볍습니다. 여러 객체를 봐야 하거나 role / 설정값을 따져야 하면 `Access Function` 을 씁니다. 프로젝트는 command 에 `Access Expression` 98 건, `Access Function` 74 건을 씁니다.
:::

## menu 정의

```text
add menu 'XX_MyPartActions'
    label 'emxXXMyApp.Menu.Actions'
    href  ''
    setting 'Registered Suite' 'XXMyApp'
    setting 'Image' '${COMMON_DIR}/images/iconActionActions.png'
    command 'XX_MyPartCreate'
    command 'XX_MyPartDelete'
    menu    'XX_MyPartExportMenu'
;
```

- 적은 순서대로 표시합니다. 나중에 끼울 때는 `mod menu ... add command ...` 다음 `order command 이름 순번` 으로 자리를 정합니다.
- `menu` 안에 `menu` 를 넣으면 하위 메뉴(드롭다운 안의 펼침 메뉴)가 됩니다.

### menu 가 쓰이는 곳

| 쓰임 | 연결 방법 | 이름 관례 |
| --- | --- | --- |
| 목록 / 폼 위 툴바 | URL 파라미터 `toolbar=메뉴이름` (쉼표로 여러 개) | `...Toolbar` |
| 툴바 안 드롭다운 | 툴바 menu 안에 menu 를 넣음. 아이콘은 `Image` | `...Actions`, `...ActionToolbar` |
| 객체 트리 (왼쪽 카테고리) | `Tree` menu 안의 `type_타입` menu | `type_심볼릭타입` |
| 앱 메뉴 / My Desk | OOTB 상위 menu(`ENCMyDesk` 같은 것) 에 add | `...MyDesk` |
| 오른쪽 클릭 메뉴 | 열 setting `RMB Menu` | `...RMBMenu` |
| 목록의 보기(table) 전환 | URL 파라미터 `tableMenu=메뉴이름`. 안의 command 마다 `setting 'table' 'table이름'` | `...TableMenu` |
| 펼침 방식 전환 | URL 파라미터 `expandProgramMenu=메뉴이름` | `...ListMenu` |

템플릿(`Menu_Sample.mql`)은 툴바를 두 단으로 만들기를 권합니다. **Toolbar menu** 는 **ActionToolbar menu** 만 담고, ActionToolbar 에 command 를 넣습니다. 화면에는 Toolbar 이름만 넘깁니다.

```text
 menu XX_MyPartListToolbar          ← URL 의 toolbar= 에 넘기는 것
   └─ menu XX_MyPartActions         ← 드롭다운 (Image = iconActionActions.png)
        ├─ command XX_MyPartCreate
        └─ command XX_MyPartDelete
```

## 객체 트리 menu (type_ menu)

목록에서 이름을 누르면 보통 `emxTree.jsp?objectId=...` 가 열립니다. `emxTree.jsp` 는 객체 타입으로 `type_타입` menu 를 찾아 왼쪽 카테고리 목록과 첫 화면을 그립니다.

```text
add menu 'type_XX_MyPart'
    label '${NAME} ${REVISION}'
    href  '${COMMON_DIR}/emxForm.jsp?form=type_XX_MyPart&toolbar=XX_MyPartPropertiesToolbar'
    setting 'Registered Suite' 'XXMyApp'
    setting 'Show Type Icon'   'true'
    command 'XX_MyPartProperties'
    command 'XX_MyPartBOM'
    command 'AEFLifecycle'
    command 'AEFHistory'
;
mod menu 'Tree' add menu 'type_XX_MyPart';
```

| 부분 | 의미 |
| --- | --- |
| menu 이름 | `type_` + 타입 심볼릭 이름. 새 타입은 템플릿대로 만들고 `Tree` menu 에 add |
| `label` | 트리 맨 위(객체 이름) 글자. `${NAME}`, `${REVISION}`, `$<select식>` 사용 |
| `href` | 객체를 처음 열 때 가운데에 보일 화면. `emxForm.jsp` (속성) 또는 `emxPortal.jsp` (포털) |
| 안의 command | 왼쪽 카테고리. 누르면 `Target Location` `content` 로 엶 |
| `Show Type Icon` | 트리에 타입 아이콘 표시 |
| `Default Category Program` / `Function` | 처음 열 카테고리를 JPO 로 정함 |

`emxTree.jsp` 에 `treeMenu=메뉴이름` 을 주면 타입 menu 대신 그 menu 를 씁니다. `DefaultCategory=command이름` 은 그 카테고리를 먼저 엽니다. [URL 파라미터](/ui-components/url-parameters#emxtree-jsp)

::: warning 새 타입인데 상세 화면이 안 나올 때
OOTB 타입은 `type_` menu 가 이미 있지만 프로젝트에서 만든 타입은 없습니다. `type_새타입` menu 를 만들고 `Tree` menu 에 넣지 않으면 상위 타입의 menu 나 기본 화면이 열립니다. 프로젝트의 `Tree.mql` 은 새 타입 menu 를 모두 이 방식으로 붙입니다.
:::

## 자주 쓰는 OOTB command

카테고리에는 OOTB command 를 그대로 넣어 씁니다.

| command | 화면 |
| --- | --- |
| `AEFLifecycle` | 라이프사이클 (상태 흐름, 승인) |
| `AEFHistory` | 이력 |
| `PMCHistory` | 프로젝트 쪽 이력 |

## 동적 command, label

| setting | 대상 | 설명 |
| --- | --- | --- |
| `Dynamic Command Program` / `Function` | menu, channel | 실행 시점에 command 목록을 JPO 로 만듦 |
| `Dynamic Label Program` / `Function` | command | label 을 JPO 로 만듦 (개수 표시 등) |
| `Label Program` / `Function` | 트리 menu | 트리 노드 글자를 JPO 로 만듦 |
| `Structure Program` / `Function` | 트리 menu | 왼쪽 구조 트리 자식을 JPO 로 만듦 |

전체 키 목록: [settings 레퍼런스](/ui-components/settings#command)
