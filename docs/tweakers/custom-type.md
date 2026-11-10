# 사용자 타입 등록 <Badge type="info" text="원본 분석" />

자주 쓰는 콤보 목록이나 아이콘 토글을 이름 하나로 등록해 두면 그리드 컬럼, 툴바, 폼에서 `typeRepresentation: '이름'` 만으로 쓸 수 있습니다.

샘플: [02_customType.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/02_customType.html)

::: info 근거
Tweakers.js 의 TypeRepresentationFactory, TypeRepresentationDirectory, TweakerEnum, Tweakers/assets/typeTemplates.json. 호출부: DataGridView (pinnedEnum, setToolbar), CfgBaseUX, ControlsEx, ENOXEngineer, ENXSBToolbarClient
:::

## 등록은 전역에 한 번

```js
require(['DS/Tweakers/TypeRepresentationFactory'], function (TypeRepresentationFactory) {
  var factory = new TypeRepresentationFactory();
  factory.registerEnum('partStatus', ['작업중', '검토중', '승인', '폐기']);
});
```

- `new TypeRepresentationFactory()` 는 몇 개를 만들어도 **같은 전역 저장소** 를 씁니다. 어느 인스턴스로 등록하든 모든 그리드, 툴바, 편집기에서 보입니다.
- 그래서 실제 코드는 등록용으로 잠깐 만들어 쓰고 버리거나 (`new Factory().registerTypeRepresentations(...)`), 그리드가 가진 것을 씁니다 (`grid.getTypeRepresentationFactory()`).
- 등록은 그 이름을 쓰는 그리드나 툴바를 **만들기 전에** 합니다.

::: warning 같은 이름으로 다시 등록하면 무시됩니다
저장소는 기존 키를 덮어쓰지 않는 방식으로 합칩니다. 같은 이름으로 두 번 등록하면 처음 것이 남고 오류도 나지 않습니다. 목록을 바꾸려면 등록된 객체를 직접 고칩니다.

```js
var typeRep = factory.getRegisteredTypeRepresentation('partStatusCombo');
if (typeRep) {
  typeRep.semantics.possibleValues = newValues;
} else {
  factory.registerTypeRepresentations({ partStatusCombo: { ... } });
}
```
:::

## enum 등록 (registerEnum)

이름과 값 목록만 등록합니다. 값의 형태를 보고 콤보 종류가 자동으로 정해집니다.

| 값 형태 | 자동 타입 | 저장되는 값 |
| --- | --- | --- |
| `['작업중', '승인']` | `enumString` | 문자열 그대로 (라벨 = 값) |
| `[1, 2, 3]` | `enumInteger` | 숫자 |
| `{ '왼쪽 고정': 'left', '오른쪽 고정': 'right' }` | `enumCustom` | 키 = 화면 라벨, 값 = 저장 값 |
| `function () { return [...]; }` | `enumDyn` | 열 때마다 목록 생성 |

```js
factory.registerEnum('pinSide', { '고정 안 함': 'none', '왼쪽 고정': 'left', '오른쪽 고정': 'right' });
```

```js
{ text: '고정', dataIndex: 'pin', typeRepresentation: 'pinSide', editableFlag: true }
```

- `registerEnum` 은 한 번에 하나씩 등록합니다. 여러 개를 등록하는 메서드(`registerEnums`)는 없습니다.
- 아이콘이나 설명이 붙은 목록(`[{ value, label, icon }]`)은 enum 이 아니라 아래 사용자 타입으로 등록합니다.

## 사용자 타입 등록 (registerTypeRepresentations)

`{ 이름: 정의 }` 객체를 넘깁니다. 정의는 **어떤 템플릿(편집기 + 모양)을 쓸지** 와 **기본 semantics** 입니다.

```js
factory.registerTypeRepresentations({
  partStatusCombo: {
    stdTemplate: 'enumCombo',
    semantics: {
      valueType: 'enumString',
      possibleValues: [
        { value: 'WIP', label: '작업중', icon: 'pencil' },
        { value: 'REVIEW', label: '검토중', icon: 'eye' },
        { value: 'RELEASED', label: '승인', icon: 'check' }
      ]
    }
  },
  removeToggle: {
    stdTemplate: 'toggleIcon',
    semantics: {
      possibleValues: [
        { value: 'true', icon: 'trash' },
        { value: 'false', icon: 'undo' },
        { value: 'undefined', icon: '' }
      ]
    }
  }
});
```

| 키 | 설명 |
| --- | --- |
| `stdTemplate` | 기본으로 쓸 템플릿 id. typeRepresentation 이름이 아니라 `typeTemplates.json` 의 id 입니다 |
| `inlinedTemplate` | 한 줄 모양(툴바, 폼 셀)에서 쓸 템플릿 id. 없으면 `stdTemplate` |
| `semantics` | 편집기에 넘길 기본값. 쓰는 쪽(컬럼 `semantics` 등)에서 같은 키를 넣으면 그쪽이 우선 |

`stdTemplate` 자리에 `{ default: '템플릿A', readOnly: '템플릿B' }` 를 넣으면 읽기 전용일 때 다른 모양을 씁니다. 상속(`parentType` 같은 키)은 없습니다.

### 자주 쓰는 템플릿 id

| 템플릿 id | 편집기 | 모양 |
| --- | --- | --- |
| `enumCombo` | TweakerEnum | 콤보 |
| `enumSearchableCombo` | TweakerEnum | 검색 콤보 |
| `toggleIcon` | TweakerBoolean | 아이콘 토글 |
| `functionMenuIcon` | TweakerFunction | 아이콘 메뉴 버튼 |

전체 목록은 원본 `Tweakers/assets/typeTemplates.json` 에 있습니다. 내장 typeRepresentation 이 어떤 템플릿을 쓰는지는 [typeRepresentation](/datagridview/api/type-representation) 표의 "편집기", "displayStyle" 열과 같습니다.

### 편집기 모듈을 직접 지정 (registerTypeTemplates)

내장 템플릿에 없는 편집기(직접 만든 TweakerBase 상속 클래스 등)는 템플릿을 먼저 등록합니다. 이미 있는 템플릿 id 는 바꿀 수 없습니다.

```js
factory.registerTypeTemplates({
  myExpandInput: { path: 'DS/MyModule/MyExpandTweaker', options: { displayStyle: 'TextBox' } }
});
factory.registerTypeRepresentations({ expandInput: { stdTemplate: 'myExpandInput' } });
```

## 등록한 타입 쓰기

| 쓰는 곳 | 방법 |
| --- | --- |
| DataGridView 컬럼 | `typeRepresentation: 'partStatusCombo'` |
| 셀마다 다르게 | 컬럼 함수 `getCellTypeRepresentation` 이 이름을 반환 |
| 만든 뒤 바꾸기 | `grid.setColumnTypeRepresentation(dataIndex, 'partStatusCombo')` |
| 툴바 칸 | `dataElements: { typeRepresentation: 'partStatusCombo' }` |
| 편집기 단독 | `factory.generateView(value, { typePath: 'partStatusCombo' })` |

### 툴바 JSON 의 enums, typeRepresentations

툴바 JSON 최상위에 `enums`, `typeRepresentations` 를 넣을 수 있지만, 이를 등록해 주는 것은 `grid.setToolbar` 뿐입니다. `GeneratedToolbar` 를 직접 만들 때는 무시되므로 먼저 Factory 로 등록합니다. ([GeneratedToolbar](/tweakers/generated-toolbar#사용자-타입-쓰기))

## typePath 문법

`generateView` 의 `typePath` 와 컬럼 `typeRepresentation` 은 이름 외의 형식도 받습니다.

| 형식 | 의미 |
| --- | --- |
| `'partStatus'` | 타입 이름. 같은 이름의 enum 이 있으면 그 목록이 `possibleValues` 로 들어감 |
| `'myObject.child'` | 객체 타입의 하위 항목 (`children`) |
| `'name#partStatus'` | `name` 을 못 찾으면 `#` 뒤 이름으로 대신 |
| <code>'array&lt;integer&gt;'</code> | 배열 타입. 값 타입이 integer |

## 2026 버전 차이

- 내장 `url` 타입이 `stdTemplate: 'urlBlock'`, `inlinedTemplate: 'url'` 로 바뀌었습니다.
- 템플릿 id `magnitude`, `inlineMagnitude` 가 없어지고 `customMagnitude`, `inlineCustomMagnitude` 가 생겼습니다. 사용자 타입의 `stdTemplate` 에 `magnitude` 를 썼다면 2026 에서 동작하지 않습니다.
- 그리드 공유 Factory(`getTypeRepresentationFactory`)가 DataGridView 에서 CollectionView 로 옮겨졌습니다. 등록 방법과 전역 공유는 같습니다.
