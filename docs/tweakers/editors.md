# 편집기 종류별 사용법 <Badge type="tip" text="로컬 실행 확인" />

편집기(Tweaker) 종류마다 어떻게 만들고, `value` 에 어떤 모양의 값이 들어오고 나가며, 자주 쓰는 옵션이 무엇인지를 한 페이지에 모았습니다. 옵션 전체 목록은 [semantics](/tweakers/api/semantics), 타입 이름 전체 목록은 [typeRepresentation](/datagridview/api/type-representation) 에 있습니다.

샘플: [05_editors.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/05_editors.html)

::: info 근거
Tweakers.js 의 TweakerBase (`_preEditValue`, `_applyMinValue`, possibleValues 검사), TweakerString / TweakerNumber / TweakerDate / TweakerBoolean / TweakerEnum / TweakerFunction / TweakerURLObject / TweakerColor 와 각 VIEW_MODULES, StringViewModules 의 ComboBox, `assets/typeTemplates.json`, `assets/defaultTypeRepresentations.json`.
앱에서 쓰는 빈도: 클래스 이름은 앱 파일 76개 중 TypeRepresentationFactory 26개, TweakerString 6개, TweakerNumber / TweakerDate / TweakerBoolean 각 4개, TweakerEnum / TweakerColor 각 2개, TweakerFunction / TweakerURLObject 0개. 타입 이름은 webapps 앱 .js 에서 `typeRepresentation: "이름"` 또는 `typePath: "이름"` 으로 쓴 파일 수가 string 119, functionIcon 77, boolean 38, url 30, datetime 26, integer 18, number 13, color 12, date 8, customEnumMember 7, multilineString 7, customBoolean 6, progress 4 입니다.
샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 한눈에 보기

| 편집기 | 만드는 법 (샘플) | value | 자주 쓰는 옵션 |
| --- | --- | --- | --- |
| 한 줄 글자 | `new TweakerString` | 문자열 | `placeholder`, `requiredFlag`, `pattern`, `viewOptions.maxLength` |
| 여러 줄 글자 | `new TweakerString({ displayStyle: 'editor' })`, 타입 `multilineString` | 문자열 (줄바꿈은 `\n`) | `viewOptions.newLineMode` |
| 콤보 | 타입 `customEnumMember` | 고른 항목의 value (문자열) | `possibleValues` |
| 입력하며 고르기 | 타입 `string` + `possibleValues` | 문자열, 멀티면 배열 | `allowMultipleValuesFlag`, `allowFreeInputFlag` |
| 버튼 그룹 | 타입 `customSmallEnumMember` | 문자열 | `possibleValues` |
| 토글 아이콘 | 타입 `customBoolean` | true / false | `possibleValues` (값마다 아이콘) |
| 숫자 | `new TweakerNumber`, 타입 `integer` / `number` / `float` | 숫자 | `minValue`, `maxValue`, `stepValue`, `decimals`, `units`, `valueType` |
| 슬라이더 / 프로그레스 | 타입 `percentage` / `progress` | 숫자 (0~100) | `readOnly` |
| 날짜, 날짜+시간 | `new TweakerDate`, 타입 `date` / `datetime` | `Date` | `minValue`, `maxValue`, `timePickerFlag`, `allowResetToUndefinedByUIFlag` |
| 체크박스 | `new TweakerBoolean` | true / false | `label` |
| 버튼 | 타입 `function` / `functionIcon` | 함수 (클릭하면 불림) | `label`, `icon` |
| 링크 | 타입 `url` | `{ label, url }` 객체 | `readOnly` |
| 색상 | 타입 `color` | `'368ec4'` (`#` 없는 16진수 문자열) | - |

편집기를 만드는 방법은 두 가지입니다. 클래스를 `new` 로 직접 만들거나, 타입 이름으로 `factory.generateView(value, { typePath, semantics })` 를 부릅니다. 그리드 컬럼의 `typeRepresentation` 은 뒤의 방법과 같은 이름을 씁니다. 자세한 내용은 [편집기 단독 사용](/tweakers/standalone) 에 있습니다. 아래 예제는 앱에서 더 많이 쓰는 쪽으로 보여 줍니다.

## 문자열

<<< @/../TweakersSample/05_editors.html#string{js}

- 글자를 칠 때마다 `liveChange`, Enter 나 포커스가 빠질 때 `change` 가 옵니다. Esc 를 누르면 편집 전 값으로 돌아가고 `change` 는 오지 않습니다.
- `pattern` 과 `requiredFlag` 는 입력을 막지 않고 `validState` 만 `false` 로 바꿉니다. 앞에 빨간 경고 아이콘이 붙습니다. `pattern` 은 앞뒤에 `^`, `$` 가 붙어 전체가 맞아야 합니다.
- `viewOptions.maxLength` 를 넘는 글자는 입력되지 않습니다. 8 로 두고 `PRT-0001XYZ` 를 치면 `PRT-0001` 까지만 들어갑니다.
- 여러 줄(`editor`)은 Enter 가 확정, Shift+Enter 가 줄바꿈입니다 (`viewOptions.newLineMode` 기본값 `'shiftEnter'`).

## 콤보

<<< @/../TweakersSample/05_editors.html#combo{js}

`possibleValues` 는 두 가지 모양을 받습니다.

| 모양 | 화면 | value |
| --- | --- | --- |
| `['작업중', '검토중']` | 그 글자 | 그 글자 |
| `[{ label: '검토중', value: 'REVIEW', icon: 'eye' }]` | label (icon 이 있으면 앞에 아이콘) | value (`'REVIEW'`) |

- 목록에서 고르면 `liveChange` 다음에 `change` 가 옵니다. 키보드 화살표로 목록을 움직이기만 해도 `value` 가 바뀌고 `liveChange` 가 오며, Enter 를 누르면 `change` 가 옵니다.
- 목록은 `body` 바로 아래에 붙는 팝업(`div.wux-controls-combobox-popup`)으로 열립니다.

::: warning 목록에 없는 값은 첫 항목으로 바뀝니다
`possibleValues` 에 없는 값을 넣으면(만들 때, 코드로 넣을 때 모두) 오류 없이 첫 항목의 value 로 바뀝니다. `{ label, value }` 목록에 label(`'승인'`)을 넣어도 찾지 못해서 첫 항목(`'WIP'`)이 됩니다. 저장할 값은 항상 value 쪽으로 넣습니다. `undefined` 는 그대로 둡니다 (빈 콤보).
:::

::: warning customEnumMember 는 하나만 고릅니다
`customEnumMember` 에 `allowMultipleValuesFlag: true` 를 줘도 화면은 하나만 고르는 콤보입니다. 처음 값이 배열이면 읽기 전용 셀에서는 `A | B` 로 보이지만, 편집해서 고르면 배열이 **문자열 하나로 바뀝니다**. `viewOptions.enableSearchFlag`, `allowFreeInputFlag` 도 이 콤보에는 효과가 없습니다 (자유 입력 값은 value 에 남지만 화면에는 첫 항목이 보임). 여러 개 고르기, 검색, 자유 입력은 아래의 "입력하며 고르기" 를 씁니다.
:::

## 입력하며 고르기 (검색, 멀티, 자유 입력)

타입 이름 `string` 에 `possibleValues` 를 주면 자동완성 입력 칸이 됩니다. 앱에서 멀티 선택, 자유 입력을 만들 때 쓰는 방법입니다.

<<< @/../TweakersSample/05_editors.html#autocomplete{js}

| 옵션 | 동작 | value |
| --- | --- | --- |
| (없음) | 글자를 치면 맞는 항목만 목록에 남음. 목록에 없는 글자는 포커스가 빠질 때 이전 값으로 되돌림 | 문자열 |
| `allowMultipleValuesFlag: true` | 고른 항목이 칩으로 쌓임. 칸 오른쪽 `...` 버튼이나 칸을 누르면 편집 팝업 | 배열 (`['김철수', '이영희']`) |
| `allowFreeInputFlag: true` | 목록에 없는 글자도 그대로 확정 | 문자열 |

- 항목을 고르거나 포커스가 빠질 때 `change` 가 옵니다. 멀티는 칩이 하나 늘 때마다 옵니다.
- 목록 팝업은 `div.wux-controls-autoComplete-popup` 으로 `body` 아래에 붙습니다.
- 콤보 모양을 유지하면서 검색 칸만 원하면 `TweakerEnum` 을 `displayStyle: 'searchableCombo'` 로 만듭니다 (실행 확인). 이 경우 콤보 칸이 입력 칸이 되어 글자로 걸러집니다.

## 버튼 그룹과 토글 아이콘

<<< @/../TweakersSample/05_editors.html#choice{js}

- 버튼 그룹은 누른 버튼의 값이 `value` 가 되고 `change` 만 옵니다 (`liveChange` 없음).
- 토글 아이콘은 누를 때마다 `true` / `false` 가 바뀌고 `change` 가 옵니다. `possibleValues` 의 `value` 는 `true` / `false` 또는 `'true'` / `'false'` 로 줍니다.

## 숫자

<<< @/../TweakersSample/05_editors.html#number{js}

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `stepValue` | `0.1` | 화살표 버튼, 위/아래 키 한 번의 증감 |
| `decimals` | `5` | **화면에 보이는** 소수 자릿수. `value` 는 깎지 않음 |
| `units` | `''` | 숫자 뒤 단위 (`12.5 kg`) |
| `valueType` | `'number'` | `'integer'` 면 값을 반올림해 정수로 저장 |
| `minValue` / `maxValue` | 없음 | 범위. 아래 "범위를 벗어난 값" 참고 |

- 옵션 없이 만든 편집기에 `1.123456789` 를 넣으면 화면은 `1.12346`, `value` 는 `1.123456789` 이고, 위 키를 누르면 `1.22346` 이 됩니다.
- `decimals: 2` 인 칸에 `1.23456` 을 치면 화면은 `1.23 kg` 이지만 `value` 는 `1.23456` 입니다. `decimals: 0` 만 주고 `2.7` 을 치면 화면은 `3`, `value` 는 `2.7` 입니다. 정수만 받으려면 `valueType: 'integer'` 를 같이 줍니다 (타입 이름 `integer` 에는 이미 들어 있음).
- Enter 나 포커스가 빠질 때 `liveChange` 다음에 `change` 가 옵니다. 화살표로 바꾸면 한 번마다 둘 다 옵니다. 숫자가 아닌 글자를 치면 이전 값으로 돌아갑니다.

## 슬라이더, 프로그레스

<<< @/../TweakersSample/05_editors.html#number-styles{js}

- 둘 다 `minValue: 0, maxValue: 100, stepValue: 1, units: '%'` 가 미리 들어 있습니다. 150 을 넣으면 100 이 됩니다.
- `progress` 는 읽기 전용일 때만 막대로 보이고, 편집 가능하면 슬라이더로 그려집니다.
- 슬라이더를 클릭하면 `liveChange` 와 `change` 가 옵니다.

## 범위를 벗어난 값

<<< @/../TweakersSample/05_editors.html#out-of-range{js}

| 넣는 방법 | 결과 |
| --- | --- |
| 화면에서 숫자 입력 (수량 1~999 에 5000) | Enter 나 포커스가 빠질 때 999 로 바뀌고 `change` |
| 코드로 숫자 (`qty.value = 5000`) | 999 로 바뀜 |
| 화면에서 날짜 입력 (11/1~12/31 에 `2025/01/01`) | 받지 않고 이전 날짜로 되돌림 |
| 코드로 날짜 (`2026-01-01`) | 최소값 11/1 로 바뀜 |

어느 경우에도 `validState` 는 `true` 그대로입니다. 입력을 막거나 경고를 띄우지 않고 값을 경계로 바꿉니다.

::: warning minValue / maxValue 가 0 이면 코드로 넣는 값은 검사하지 않습니다
값을 바꿀 때의 범위 검사(`TweakerBase._preEditValue`)가 `if (minValue)` 로 되어 있어 경계가 `0` 이면 건너뜁니다. `minValue: 0` 인 칸에 `tweaker.value = -3` 을 넣으면 `value` 는 `-3` 인데 화면은 `0` 으로 보입니다. `maxValue: 0` 도 같습니다. 화면에서 친 값은 스핀박스가 막아 주므로 `0` 이 됩니다. 코드로 넣는 값은 직접 확인합니다.
:::

## 날짜와 시간

<<< @/../TweakersSample/05_editors.html#date{js}

- `value` 는 항상 `Date` 입니다. 문자열(`'2026-12-01T09:30:00'`)이나 밀리초 숫자를 넣으면 `Date` 로 바뀌어 저장됩니다. 화면 글자는 브라우저 언어 형식(`2026년 11월 20일`)입니다.
- 칸 오른쪽 달력 아이콘을 누르면 달력 팝업이 `body` 아래에 열립니다. `timePickerFlag: true` 면 달력 아래에 시간 칸이 붙고, 아래 버튼이 "오늘" 대신 "지금" 이 됩니다.
- 달력에서 고르면 `change` 만 옵니다. 입력 칸에 날짜를 치고 Enter 를 누르면 `liveChange` 가 오고, 포커스가 빠질 때 `change` 가 옵니다.
- `allowResetToUndefinedByUIFlag: true` 면 입력 칸을 지우고 나갈 때 `value` 가 `undefined` 가 되고 `change` 가 옵니다. 코드에서는 `tweaker.value = undefined` 로 비웁니다 (샘플의 "값 비우기" 버튼).

## 체크박스

<<< @/../TweakersSample/05_editors.html#boolean{js}

- 누를 때마다 `true` / `false` 가 바뀌고 `change` 만 옵니다.
- 문자열 `'true'` / `'false'`, `'0'`, 숫자 `0` 을 넣으면 불리언으로 바뀝니다.
- 모양은 `displayStyle` 로 `'switch'`, `'radio'`, `'toggleIcon'` 으로 바꿀 수 있습니다.

## 버튼, 링크, 색상

<<< @/../TweakersSample/05_editors.html#button-link-color{js}

- `function` 편집기의 `value` 는 함수이고, 클릭하면 `{ context, dsModel }` 를 인자로 불립니다. `context` 는 편집기의 `executionContext` 입니다. `change` 는 오지 않습니다.
- `url` 의 `value` 는 `{ label, url }` 객체입니다. 문자열(`'https://...'`)을 넣으면 아무것도 보이지 않습니다. `icon`, `target` 도 넣을 수 있습니다.
- `color` 는 칸을 누르면 색상 선택 팝업이 열립니다. `value` 는 `#` 없는 16진수이고 대소문자는 넣은 그대로입니다 (`'#FF0000'` → `'FF0000'`).

## 그리드에서

같은 타입 이름을 컬럼 `typeRepresentation` 에 넣으면 셀 편집기가 됩니다. 셀 값의 모양은 위의 `value` 와 같습니다.

<<< @/../TweakersSample/05_editors.html#grid{js}

<<< @/../TweakersSample/05_editors.html#grid-events{js}

- 상태 컬럼(`{ label, value }` 목록)은 셀에 `승인` 이 보이고 `nodeModel` 에는 `'RELEASED'` 가 저장됩니다. `EditionOnClick` 이면 셀을 한 번 누르면 콤보가 나타나고, 한 번 더 누르면 목록이 열립니다.
- 수량 셀에 5000 을 치면 999 로 저장됩니다.
- 담당자 컬럼은 `string` + `allowMultipleValuesFlag` 이므로 고른 이름이 배열에 더해집니다.
- `functionIcon` 셀은 값이 있는 행에만 버튼이 보입니다 (값이 함수면 클릭할 때 그 함수도 불림). `semantics.icon` 에 문자열만 주면 Font Awesome 이름으로 찾으므로 3DS 아이콘은 `{ iconName, fontIconFamily: WUXManagedFontIcons.Font3DS }` 로 줍니다.
- 그리드의 `buttonclick` 은 셀 안 모든 버튼에서 옵니다. 멀티 칸의 `...` 버튼도 오므로 컬럼을 확인합니다.

## change 가 오는 때

| 편집기 | `liveChange` | `change` |
| --- | --- | --- |
| 한 줄 / 여러 줄 글자 | 글자마다 | Enter (여러 줄은 Enter, 줄바꿈은 Shift+Enter), 포커스가 빠질 때 |
| 콤보 | 키보드로 항목 이동, 항목 클릭 | 항목 클릭, Enter |
| 입력하며 고르기 | 확정할 때 | 항목 선택, 포커스가 빠질 때 |
| 숫자 (스핀박스) | Enter, 포커스 이동, 화살표 | 같은 때 (`liveChange` 바로 뒤) |
| 슬라이더 | 클릭 | 클릭 (`liveChange` 바로 뒤) |
| 날짜 | 입력 칸에서 Enter | 달력에서 고를 때, 포커스가 빠질 때 |
| 버튼 그룹, 토글 아이콘, 체크박스 | 없음 | 클릭 |
| 함수 버튼 | 없음 | 없음 (함수가 불림) |

코드로 `value` 를 넣어도 `change` 가 옵니다. 막는 방법은 [편집기 단독 사용](/tweakers/standalone#이벤트) 에 있습니다.
