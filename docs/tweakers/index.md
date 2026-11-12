# Tweakers 개요 <Badge type="tip" text="로컬 실행 확인" />

Tweakers 는 값 하나를 보여주고 편집하는 컨트롤(편집기) 모음입니다. DataGridView 의 셀 편집기, 툴바의 버튼과 콤보, 폼과 속성 패널의 입력칸이 모두 Tweaker 입니다. enovia2025 webapps 에서 69 개 모듈 폴더가 사용합니다.

## 구성 요소

| 모듈 | 역할 | 주로 쓰는 곳 |
| --- | --- | --- |
| `DS/Tweakers/TweakerString`, `TweakerNumber`, `TweakerBoolean`, `TweakerDate`, `TweakerEnum` ... | 값 타입별 편집기. 모두 `TweakerBase` 를 상속 | 폼, 다이얼로그 안의 입력칸 |
| `DS/Tweakers/TypeRepresentationFactory` | 타입 이름(`'integer'`, `'customEnumMember'` ...)으로 편집기를 만들고, 사용자 타입과 enum 을 등록 | DataGridView, Tree, 툴바, 속성 패널 |
| `DS/Tweakers/GeneratedToolbar` | JSON 으로 툴바를 만듦. 툴바 칸 하나가 Tweaker 하나 | 화면 상단 툴바, `grid.setToolbar` 내부 |
| `DS/Tweakers/TweakerBase` | 모든 편집기의 부모 클래스. 상속해서 편집기를 직접 만듦 (앱 파일 76개 중 15개) | [편집기 직접 만들기](/tweakers/custom-tweaker) |
| `DS/Tweakers/TypeEnums` | 보기 전환 버튼(`layout`)의 값 상수 `Layout` (앱 파일 76개 중 8개) | [보기 전환](/tweakers/generated-toolbar#보기-전환-layout-typeenums) |

```
typeRepresentation 이름 ('integer')
        │  TypeRepresentationFactory 가 이름 → 템플릿 → 편집기 클래스로 해석
        ▼
TweakerNumber (displayStyle 'spinBox', semantics { stepValue: 1, decimals: 0 })
        │
        ├─ DataGridView 셀 편집기
        ├─ GeneratedToolbar 칸
        └─ 직접 inject 한 폼 입력칸
```

## 하고 싶은 일로 찾기

키 이름을 알면 [이름 색인 (A-Z)](/tweakers/api/key-index) 이나 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)을 씁니다.

### 편집기 하나하나

| 하고 싶은 일 | 키 / 함수 | 문서 |
| --- | --- | --- |
| 콤보 (하나 선택), 표시 글자와 저장 값 다르게 | `customEnumMember`, `possibleValues: [{ label, value }]` | [콤보](/tweakers/editors#콤보) |
| 여러 개 선택, 입력하며 검색, 목록에 없는 값 입력 | `string` + `possibleValues`, `allowMultipleValuesFlag`, `allowFreeInputFlag` | [입력하며 고르기](/tweakers/editors#입력하며-고르기-검색-멀티-자유-입력) |
| 숫자 범위, 소수 자리, 단위 | `minValue`, `maxValue`, `decimals`, `units`, `valueType: 'integer'` | [숫자](/tweakers/editors#숫자) |
| 날짜, 날짜와 시간, 비우기 | `TweakerDate`, `timePickerFlag`, `allowResetToUndefinedByUIFlag` | [날짜와 시간](/tweakers/editors#날짜와-시간) |
| 버튼 그룹, 토글 아이콘, 체크박스 | `customSmallEnumMember`, `customBoolean`, `boolean` | [버튼 그룹과 토글 아이콘](/tweakers/editors#버튼-그룹과-토글-아이콘) |
| 값이 어떤 형태로 들어오는지, change 가 언제 오는지 | `value`, `change`, `liveChange` | [change 가 오는 때](/tweakers/editors#change-가-오는-때) |
| 필수 입력, 입력 형식 검사 | `requiredFlag`, `pattern`, `validState` | [유효성](/tweakers/standalone#유효성) |
| 읽기 전용, 비활성 | `readOnly`, `disabled` | [편집기 단독 사용](/tweakers/standalone) |

### 만들고 연결하기


| 하고 싶은 일 | 방법 | 문서 |
| --- | --- | --- |
| 그리드 없이 입력칸 하나를 화면에 놓기 | `new TweakerString({ ... }).inject(el)` | [편집기 단독 사용](/tweakers/standalone) |
| 타입 이름으로 편집기 만들기 (속성 패널처럼 타입이 데이터로 정해질 때) | `factory.generateView(value, { typePath })` | [편집기 단독 사용](/tweakers/standalone#타입-이름으로-만들기) |
| 프로젝트 전용 콤보, 아이콘 토글을 이름 하나로 재사용 | `registerTypeRepresentations`, `registerEnum` | [사용자 타입 등록](/tweakers/custom-type) |
| 그리드와 상관없는 툴바 만들기 | `new GeneratedToolbar({ items })` | [GeneratedToolbar](/tweakers/generated-toolbar) |
| 그리드 위 툴바 | `grid.setToolbar(JSON)` | [DataGridView 툴바](/datagridview/toolbar) |

## 공통 개념

| 용어 | 뜻 |
| --- | --- |
| typeRepresentation | 타입 이름. 어떤 편집기를 어떤 모양으로 쓸지 정한 묶음. 내장 목록은 [typeRepresentation](/datagridview/api/type-representation) |
| displayStyle | 같은 편집기 안의 모양. 예: TweakerNumber 의 `spinBox`, `slider`, `progress` |
| semantics | 편집기에 넘기는 세부 옵션 (`possibleValues`, `minValue` ...). 전체 키는 [semantics](/tweakers/api/semantics) |
| 템플릿 | typeRepresentation 이 가리키는 `{ path: 편집기 모듈, options }`. `Tweakers/assets/typeTemplates.json` |

## 이 섹션의 문서

| 문서 | 내용 |
| --- | --- |
| [편집기 종류별 사용법](/tweakers/editors) | 콤보, 숫자, 날짜 같은 편집기마다 만드는 법, value 형태, change 시점, 자주 쓰는 옵션 |
| [편집기 직접 만들기](/tweakers/custom-tweaker) | TweakerBase 를 상속해 내장 편집기로 안 되는 편집기를 만들고 폼과 그리드 셀에 연결 |
| [편집기 단독 사용](/tweakers/standalone) | 그리드 없이 편집기 하나를 화면에 놓고 값 주고받기 |
| [사용자 타입 등록](/tweakers/custom-type) | 콤보 목록, 아이콘 토글을 타입 이름으로 등록 |
| [GeneratedToolbar](/tweakers/generated-toolbar) | JSON 으로 툴바 만들기, 항목 상태 변경, 값 읽기 |
| [이름 색인 (A-Z)](/tweakers/api/key-index) | 옵션, 함수, 이벤트 이름을 알파벳 순으로 찾기 |
| [Tweaker](/tweakers/api/tweaker) · [semantics](/tweakers/api/semantics) · [TypeRepresentationFactory](/tweakers/api/type-representation-factory) · [GeneratedToolbar](/tweakers/api/generated-toolbar) | 레퍼런스 |

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [01_standalone.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/01_standalone.html) | 편집기 직접 생성, 타입 이름으로 생성, 값 읽기와 이벤트 | [편집기 단독 사용](/tweakers/standalone) |
| [02_customType.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/02_customType.html) | 사용자 타입과 enum 등록 후 그리드와 폼에서 사용 | [사용자 타입 등록](/tweakers/custom-type) |
| [03_generatedToolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/03_generatedToolbar.html) | 그리드 없는 툴바, 항목 상태 변경, 값 읽기, 메뉴형 버튼, 보기 전환 | [GeneratedToolbar](/tweakers/generated-toolbar) |
| [04_customTweaker.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/04_customTweaker.html) | 별점 편집기, 숫자 + 단위 편집기를 만들어 폼과 그리드 셀에서 사용 | [편집기 직접 만들기](/tweakers/custom-tweaker) |
| [05_editors.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/05_editors.html) | 편집기 종류별 폼과 그리드, value 형태 실시간 표시 | [편집기 종류별 사용법](/tweakers/editors) |

::: warning
샘플은 `<3DSpace>/webapps/TweakersSample/` 에 두고 ENOVIA 서버 주소로 열거나, `npm run samples` 로 내 PC 에서 엽니다 ([샘플을 내 PC 에서 실행하기](/guide/contributing#샘플을-내-pc-에서-실행하기)).

Tweakers 샘플 01 ~ 05 는 원본 webapps 파일을 로컬에서 띄워 동작을 확인했고, ENOVIA 서버에서는 아직 확인하지 않았습니다.
:::

::: info 근거
Tweakers.js (TweakerBase, TypeRepresentationFactory, TypeRepresentationDirectory, GeneratedToolbar), Tweakers/assets/*.json, 호출부 69 개 모듈
:::
