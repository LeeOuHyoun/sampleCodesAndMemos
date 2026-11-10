# Tweakers 개요 <Badge type="info" text="원본 분석" />

Tweakers 는 값 하나를 보여주고 편집하는 컨트롤(편집기) 모음입니다. DataGridView 의 셀 편집기, 툴바의 버튼과 콤보, 폼과 속성 패널의 입력칸이 모두 Tweaker 입니다. enovia2025 webapps 에서 69 개 모듈 폴더가 사용합니다.

## 구성 요소

| 모듈 | 역할 | 주로 쓰는 곳 |
| --- | --- | --- |
| `DS/Tweakers/TweakerString`, `TweakerNumber`, `TweakerBoolean`, `TweakerDate`, `TweakerEnum` ... | 값 타입별 편집기. 모두 `TweakerBase` 를 상속 | 폼, 다이얼로그 안의 입력칸 |
| `DS/Tweakers/TypeRepresentationFactory` | 타입 이름(`'integer'`, `'customEnumMember'` ...)으로 편집기를 만들고, 사용자 타입과 enum 을 등록 | DataGridView, Tree, 툴바, 속성 패널 |
| `DS/Tweakers/GeneratedToolbar` | JSON 으로 툴바를 만듦. 툴바 칸 하나가 Tweaker 하나 | 화면 상단 툴바, `grid.setToolbar` 내부 |

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

## 무엇을 쓸까

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
| [편집기 단독 사용](/tweakers/standalone) | 그리드 없이 편집기 하나를 화면에 놓고 값 주고받기 |
| [사용자 타입 등록](/tweakers/custom-type) | 콤보 목록, 아이콘 토글을 타입 이름으로 등록 |
| [GeneratedToolbar](/tweakers/generated-toolbar) | JSON 으로 툴바 만들기, 항목 상태 변경, 값 읽기 |
| [Tweaker](/tweakers/api/tweaker) · [semantics](/tweakers/api/semantics) · [TypeRepresentationFactory](/tweakers/api/type-representation-factory) · [GeneratedToolbar](/tweakers/api/generated-toolbar) | 레퍼런스 |

## 샘플

| 샘플 | 내용 | 관련 문서 |
| --- | --- | --- |
| [01_standalone.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/01_standalone.html) | 편집기 직접 생성, 타입 이름으로 생성, 값 읽기와 이벤트 | [편집기 단독 사용](/tweakers/standalone) |
| [02_customType.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/02_customType.html) | 사용자 타입과 enum 등록 후 그리드와 폼에서 사용 | [사용자 타입 등록](/tweakers/custom-type) |
| [03_generatedToolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/03_generatedToolbar.html) | 그리드 없는 툴바, 항목 상태 변경, 값 읽기 | [GeneratedToolbar](/tweakers/generated-toolbar) |

::: warning
샘플은 `<3DSpace>/webapps/TweakersSample/` 에 두고 ENOVIA 서버 주소로 열어야 동작합니다.

Tweakers 샘플은 원본 소스 분석으로 작성했고, 서버에서 동작 확인을 아직 하지 않았습니다. 다르게 동작하면 원본 쪽이 맞습니다.
:::

::: info 근거
Tweakers.js (TweakerBase, TypeRepresentationFactory, TypeRepresentationDirectory, GeneratedToolbar), Tweakers/assets/*.json, 호출부 69 개 모듈
:::
