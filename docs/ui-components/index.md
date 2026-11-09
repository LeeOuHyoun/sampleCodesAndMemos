# 고전 UI 구성 요소 개요

3DSpace 의 고전 화면(AEF, Application Exchange Framework)은 JSP 를 직접 짜서 만들지 않습니다. **command, menu, table, webform, channel, portal** 같은 admin 객체를 MQL 로 정의하면, 프레임워크 JSP(`emxIndentedTable.jsp`, `emxForm.jsp` ...)가 그 정의를 읽어 화면을 그립니다. 개발자가 하는 일은 대부분 이 객체를 만들고, **setting** 으로 동작을 정하고, 데이터가 필요하면 JPO 메서드를 연결하는 것입니다.

::: info 근거
`mql/06.command` (346 파일), `07.menu` (146), `08.table` (96), `09.webform` (50), `10.channel` (33), `11.portal` (22), `21.page`, 각 폴더의 `*_Sample.mql` 템플릿. 화면 쪽: `3dspace/common/emxIndentedTable.jsp`, `emxTable.jsp`, `emxForm.jsp`, `emxPortal.jsp`, `emxPortalDisplay.jsp`, `emxTree.jsp`, `emxNavigator.jsp`, `scripts/emxUICore.js`, `scripts/emxUIToolbar.js`. setting 키를 읽는 쪽: `WEB-INF/lib/framework.jar`, `xerinfra.jar` 의 `com/matrixone/apps/framework/ui/UI*.class` 문자열 상수
:::

## 구성 요소 한눈에

| 객체 | 역할 | 화면에서 보이는 모습 | 프로젝트 폴더 | 문서 |
| --- | --- | --- | --- | --- |
| command | 링크 하나. `href` (열 URL) + label + setting | 메뉴 항목, 툴바 버튼, 왼쪽 카테고리, 포털 탭 | `06.command` | [command, menu](/ui-components/command-menu) |
| menu | command 와 menu 를 담는 묶음 | 툴바, 드롭다운, 객체 트리(카테고리 목록), 앱 메뉴 | `07.menu` | [command, menu](/ui-components/command-menu) |
| table | 목록 화면의 열(column) 정의 | 목록 / 구조(BOM) 화면의 열 | `08.table` | [table](/ui-components/table) |
| webform (form) | 한 객체의 상세 화면 필드(field) 정의 | 속성 보기 / 편집 / 생성 화면 | `09.webform` | [webform](/ui-components/webform) |
| channel | command 를 탭으로 묶은 칸 하나 | 포털 안의 탭 묶음 | `10.channel` | [portal, channel](/ui-components/portal-channel) |
| portal | channel 을 행 / 열로 배치한 대시보드 | 한 화면에 여러 칸이 나뉜 페이지 | `11.portal` | [portal, channel](/ui-components/portal-channel) |
| page | 설정 파일 성격의 텍스트(XML 등) 저장 | 직접 보이지 않음. 화면 동작 설정으로 읽힘 | `21.page` | - |

table, webform, portal 은 **혼자서는 열리지 않습니다**. 반드시 어떤 command(또는 menu)의 `href` 가 `emxIndentedTable.jsp?table=...`, `emxForm.jsp?form=...`, `emxPortal.jsp?portal=...` 처럼 이름을 넘겨야 화면이 됩니다.

## 중첩 구조

```text
 앱 메뉴 / My Desk (menu)
   └─ command ──href──▶ emxIndentedTable.jsp?table=XX_MyPartSummary
                                     &program=XX_MyPartUI:getList
                                     &toolbar=XX_MyPartListToolbar
                                           │
          ┌────────────────────────────────┼────────────────────────────┐
          ▼                                ▼                            ▼
   table XX_MyPartSummary          JPO XX_MyPartUI.getList      menu XX_MyPartListToolbar
   column Name (href=emxTree.jsp)  (행 목록 MapList)              └─ menu XX_MyPartActions (드롭다운)
   column State                                                       ├─ command XX_MyPartCreate
   column ...                                                         └─ command XX_MyPartDelete

 Name 링크 클릭 ─▶ emxTree.jsp?objectId=...
                    └─ menu Tree ─▶ menu type_XX_MyPart (객체 트리, 타입마다 하나)
                                     │ href  = 처음 열 화면 (emxForm.jsp / emxPortal.jsp)
                                     ├─ command XX_MyPartProperties ─▶ emxForm.jsp?form=type_XX_MyPart
                                     ├─ command XX_MyPartBOM        ─▶ emxIndentedTable.jsp?expandProgram=...
                                     ├─ command AEFLifecycle
                                     └─ command AEFHistory

 command ─▶ emxPortal.jsp?portal=XX_MyPartPortal
              portal XX_MyPartPortal
                ├─ channel 줄 1: XX_MyPartChannelA , XX_MyPartChannelB   (같은 줄 = 같은 행)
                └─ channel 줄 2: XX_MyPartChannelC
                                   └─ command (탭 하나마다 화면 하나: table / form ...)
```

| 담는 쪽 | 담기는 쪽 | MQL 절 |
| --- | --- | --- |
| menu | command, menu | `command 'A'`, `menu 'B'` (적은 순서대로 표시) |
| channel | command | `command 'A','B'` (쉼표로 나열, 탭이 됨) |
| portal | channel | `channel 'A','B'` 한 줄이 행 하나 |
| command, menu | table, form, portal, 다른 menu | `href` 의 URL 파라미터로 이름을 넘김 |
| table column, form field | JPO, command 화면 | `setting 'program'`, `href`, `range` |

## 화면 하나가 조립되는 순서

목록 command 를 눌렀을 때를 예로 듭니다.

1. command 의 `setting 'Access ...'`, `user` 를 검사해 보여 줄지 정합니다. 안 맞으면 메뉴에서 빠집니다.
2. `href` 의 `${COMMON_DIR}`, `${SUITE_DIR}` 같은 매크로를 실제 경로로 바꾸고, `Target Location` 이 가리키는 곳(가운데 내용 칸, 팝업, 슬라이드인 ...)에 엽니다.
3. `emxIndentedTable.jsp` 가 `table` 이름으로 table 정의를 읽고, `program` 의 JPO 메서드를 불러 행 목록(object id 목록)을 받습니다.
4. 열마다 `businessobject` select 식 또는 열의 `program` / `function` JPO 로 칸 값을 채웁니다.
5. `toolbar` 로 넘긴 menu 를 읽어 위쪽 툴바를 그립니다. 툴바의 command 도 1번처럼 접근 검사를 거칩니다.
6. 행을 고르고 툴바 command 를 누르면, command 의 `Submit`, `Row Select` 설정에 따라 선택 행 id(`emxTableRowId`)를 담아 `href` 로 보냅니다.

::: tip 화면을 고칠 때 먼저 찾을 것
화면에 보이는 글자로 properties 키를 찾고, 그 키를 `label` 로 쓰는 command / column / field 를 `mql/` 에서 찾습니다. command 를 찾으면 `href` 를 따라 table / form / JPO 로 내려갑니다.
:::

## 공통 규칙

| 항목 | 내용 |
| --- | --- |
| label | 대부분 문자열 리소스 키 (`emxFramework.Command.Edit`). `Registered Suite` 의 문자열 파일에서 찾음 |
| `Registered Suite` | 어느 앱 소속인지. label 을 찾을 문자열 파일과 `${SUITE_DIR}` 폴더를 정함. [settings](/ui-components/settings#registered-suite) |
| 심볼릭 이름 등록 | 만든 뒤 `add property command_이름 on program eServiceSchemaVariableMapping.tcl to command 이름;` (menu, table, form, channel, portal 도 같은 형식). [심볼릭 이름](/schema/#심볼릭-이름) |
| OOTB 수정 | `copy` 로 백업 후 `mod` 로 고침. 템플릿 주석에 따르면 table, webform 은 지우고 다시 만들어도 됨 |
| setting 형식 | `setting '키' '값'`. 키는 공백이 들어간 영어 단어 (`'Target Location'`). 값은 항상 문자열 |

`mod` 로 고칠 때는 `add setting` / `remove setting`, `add command` / `remove command`, `order command 이름 순번` 을 씁니다.

```text
copy command 'PMCRiskMyDesk' 'PMCRiskMyDesk_OOTB';

mod command 'PMCRiskMyDesk'
    add setting 'Access Expression' 'false';

mod menu 'XX_MyPartActions'
    add command 'XX_MyPartExport'
    order command 'XX_MyPartExport' 2;
```

::: tip OOTB 메뉴 숨기기
OOTB command 를 지우지 않고 `add setting 'Access Expression' 'false'` 로 숨기는 방식을 씁니다. 프로젝트의 OOTB 수정 command 대부분이 이 형태입니다.
:::

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [command, menu](/ui-components/command-menu) | command 정의, 툴바 / 드롭다운 / 객체 트리 menu, Target Location, 선택 행 넘기기 |
| [table](/ui-components/table) | table / column 정의, `emxIndentedTable.jsp` (구조 브라우저), 편집 가능한 열 |
| [webform](/ui-components/webform) | form / field 정의, `emxForm.jsp` 보기 / 편집, `emxCreate.jsp` 생성 화면 |
| [portal, channel](/ui-components/portal-channel) | 포털 배치, 채널 탭, 포털 안 화면에 넘어가는 파라미터 |
| [URL 파라미터](/ui-components/url-parameters) | 화면 JSP 별 URL 파라미터 표 |
| [settings 레퍼런스](/ui-components/settings) | 대상별 setting 키, 값, 의미, 프로젝트 사용 빈도 |

샘플 MQL: [UIComponentSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/UIComponentSample)

JPO 메서드(행 목록, 열 값, range, update, 접근 함수)를 만드는 방법은 [JPO](/jpo/) 문서를 봅니다.
