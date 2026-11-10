# portal, channel <Badge type="info" text="원본 분석" />

**portal** 은 한 화면을 여러 칸으로 나눈 대시보드입니다. 칸 하나가 **channel** 이고, channel 은 command 를 **탭** 으로 담습니다. 탭(command)마다 자기 `href` 화면(table, form ...)을 칸 안에 엽니다.

샘플: [03_webform_portal.mql](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/UIComponentSample/03_webform_portal.mql)

::: info 근거
`mql/10.channel/Channel_Sample.mql`, `mql/11.portal/Portal_Sample.mql` (배치 그림 주석), 프로젝트 channel 33 파일, portal 22 파일. 화면: `3dspace/common/emxPortal.jsp`, `emxPortalDisplay.jsp` (행 → channel → 탭 반복). `framework.jar` 의 `UIPortal.class` 문자열 상수 (`Height`, `&portalMode=true&portalCmdName=`, `Alternate OID expression`)
:::

## 배치

```text
add portal 'XX_MyPartPortal'
    channel 'XX_MyPartInfoChannel','XX_MyPartDocChannel'
    channel 'XX_MyPartBOMChannel'
;
```

```text
 ┌───────────────────────────┬───────────────────────────┐
 │ XX_MyPartInfoChannel      │ XX_MyPartDocChannel       │  ← channel 줄 1
 │ [속성] [담당자]            │ [문서]                     │
 ├───────────────────────────┴───────────────────────────┤
 │ XX_MyPartBOMChannel                                   │  ← channel 줄 2
 │ [BOM] [Where Used]                                    │
 └───────────────────────────────────────────────────────┘
```

| 규칙 | 내용 |
| --- | --- |
| `channel` 줄 하나 | 화면의 행 하나 |
| 한 줄에 쉼표로 여러 channel | 그 행을 가로로 나눔 |
| channel 안의 command | 칸 위쪽 탭. 첫 탭이 먼저 열림 |

## channel 정의

```text
add channel 'XX_MyPartInfoChannel'
    label ''
    command 'XX_MyPartPropertiesPortalCmd','XX_MyPartOwnersPortalCmd'
    setting 'Registered Suite' 'XXMyApp'
    setting 'Height' '60%'
;
add property channel_XX_MyPartInfoChannel on program eServiceSchemaVariableMapping.tcl to channel 'XX_MyPartInfoChannel';
```

| 항목 | 설명 |
| --- | --- |
| `command 'A','B'` | 탭 목록 (쉼표로 나열) |
| `setting 'Height'` | 이 channel 이 있는 행의 높이 (`70%`, `30%` 처럼). 높이는 행 단위로 정해지는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> (`UIPortal.getRowHeight`) |
| `setting 'Registered Suite'` | 탭 label 을 찾을 suite |
| `Dynamic Command Program` / `Function` | 탭 목록을 JPO 로 만듦 |

나중에 탭을 끼울 때는 `place` 로 자리를 정합니다.

```text
mod channel 'XX_MyPartInfoChannel'
    place 'XX_MyPartHistoryPortalCmd' after 'XX_MyPartOwnersPortalCmd';
```

## 탭 command

탭 command 는 일반 command 와 같습니다. 칸 안에 열리므로 `href` 에 포털용 파라미터를 붙여 둡니다.

```text
add command 'XX_MyPartBOMPortalCmd'
    label 'emxXXMyApp.Tab.BOM'
    href  '${COMMON_DIR}/emxIndentedTable.jsp?table=XX_MyPartBOM&expandProgram=XX_MyPartUI:getBOM&toolbar=XX_MyPartBOMToolbar&header=emxXXMyApp.Header.BOM'
    setting 'Registered Suite' 'XXMyApp'
;
```

포털은 탭 `href` 뒤에 아래 값을 붙여서 엽니다 (`UIPortal`).

| 붙는 파라미터 | 값 |
| --- | --- |
| `portalMode` | `true`. 받는 JSP 는 이 값으로 "포털 칸 안" 인지 알고 머리글 / 버튼 배치를 바꾸는 것으로 보입니다 <Badge type="danger" text="검증 필요" /> |
| `portalCmdName` | 탭 command 이름 |
| `objectId` | 포털을 연 객체 id. command 에 `Alternate OID expression` 이 있으면 그 식의 객체 id |
| `parentOID`, `relId` | 부모 객체 id, 연결 id (있을 때) |
| `suiteKey` | 탭 command 의 `Registered Suite` |

::: tip 탭 화면의 머리글
포털 칸 안에서는 제목줄이 겹쳐 보이기 쉽습니다. 프로젝트 portal command 는 `emxPortal.jsp?portal=...&showPageHeader=false` 를 15 건 씁니다. 칸 안 table 은 `hideHeader=true` 를 주기도 합니다.
:::

## 포털 열기

```text
${COMMON_DIR}/emxPortal.jsp?portal=XX_MyPartPortal&showPageHeader=false
```

| 파라미터 | 설명 |
| --- | --- |
| `portal` | portal 이름 |
| `objectId` | 대상 객체 (트리 안이면 자동) |
| `showPageHeader` | `false` 면 포털 위 제목줄 숨김 |
| `header`, `subHeader` | 제목 문자열 키. 없으면 객체 포털은 `emxFramework.ObjectPortal.Header`, 홈 포털은 `emxFramework.HomePortal.Header` |
| `toolbar` | 포털 위 툴바 menu |
| `HelpMarker` | 도움말 키 |

포털을 여는 곳은 두 가지입니다.

| 위치 | 예 |
| --- | --- |
| 객체 트리 menu 의 `href` | `type_XX_MyPart` 의 `href` 를 `emxPortal.jsp?portal=...` 로 두면 객체를 열 때 포털이 첫 화면 |
| 카테고리 command | 트리의 카테고리 하나를 포털로 |

::: warning channel 이름과 portal 이름
portal 의 `channel` 절은 channel 이 먼저 있어야 합니다. 등록 스크립트 순서를 command → channel → portal 로 둡니다. 템플릿의 portal 등록 줄은 `to relationship` 으로 잘못 적혀 있으니 `to portal` 로 고쳐 씁니다.
:::
