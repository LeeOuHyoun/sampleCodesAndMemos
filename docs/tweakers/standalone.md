# 편집기 단독 사용

그리드 없이 편집기(Tweaker) 하나를 화면에 놓고 값을 주고받는 방법입니다. 폼, 다이얼로그, 속성 패널에 씁니다.

샘플: [01_standalone.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/01_standalone.html)

::: info 근거
Tweakers.js 의 TweakerBase, TweakerString / Number / Boolean / Date / Enum, TypeRepresentationFactory.generateView. Controls.js 의 Abstract (fire, addEventListener). 호출부: DocumentCreateNew CreateForm, DataGridViewCustomViewsDialog, ParameterizationSkeleton, Form, VCXGUIInfrastructure
:::

## 직접 만들기

편집기 클래스를 `new` 로 만들고 `inject` 로 붙입니다. `inject` 는 자기 자신을 돌려주므로 이어서 쓸 수 있습니다.

```js
require([
  'DS/Tweakers/TweakerString',
  'DS/Tweakers/TweakerNumber',
  'DS/Tweakers/TweakerBoolean'
], function (TweakerString, TweakerNumber, TweakerBoolean) {
  var title = new TweakerString({ value: '', placeholder: '품명 입력', requiredFlag: true })
    .inject(document.getElementById('title'));

  var qty = new TweakerNumber({ value: 1, minValue: 0, maxValue: 999, stepValue: 1, decimals: 0 })
    .inject(document.getElementById('qty'));

  var useFlag = new TweakerBoolean({ value: true, label: '사용', displayStyle: 'switch' })
    .inject(document.getElementById('useFlag'));
});
```

- 생성자 옵션은 각 편집기의 공개 속성(publishedProperties)만 반영되고, 나머지 키는 조용히 무시됩니다. 넣을 수 있는 키는 [semantics](/tweakers/api/semantics) 와 [Tweaker API](/tweakers/api/tweaker) 에 있습니다.
- `label` 은 TweakerBoolean 에만 있습니다. 다른 편집기의 라벨은 화면에 직접 만듭니다.
- 화면 요소가 필요하면 `tweaker.getContent()` 를 씁니다 (`div.wux-tweakers`).

::: warning setOptions 는 속성을 바꾸지 않습니다
`tweaker.setOptions({ requiredFlag: true })` 는 옵션 저장소에만 들어가고 편집기에 적용되지 않습니다. 실제 호출부(DocumentCreateNew)에도 이런 코드가 있지만 효과가 없습니다. `tweaker.requiredFlag = true` 또는 `tweaker.setProperties({ requiredFlag: true })` 를 씁니다.
:::

### 편집기별 displayStyle

| 편집기 | 기본 | displayStyle |
| --- | --- | --- |
| `TweakerString` | `lineEditor` | `lineEditor`, `password`, `link`, `combo`, `icon`, `buttonGroup`, `toggleGroup`, `color`, `editor`, `editorInline`, `editor2Inline`, `editorVerticallyResizable`, `tag` |
| `TweakerNumber` | `spinBox` | `spinBox`, `spinBoxLite`, `slider`, `sliderAndSpinBox`, `progress`, `progressNoAnim`, `colorSlider`, `pagination` |
| `TweakerBoolean` | `checkbox` | `checkbox`, `switch`, `radio`, `toggleIcon` |
| `TweakerDate` | `date` | `date`, `time` |
| `TweakerEnum` | `combo` | `combo`, `comboLite`, `searchableCombo`, `buttonGroup` |

`TweakerString` 에 `possibleValues` 를 주면 자동완성 콤보가, `allowMultipleValuesFlag: true` 를 주면 칩(태그) 입력이 됩니다.

## 값 읽기와 쓰기

값은 `value` 속성 하나로 읽고 씁니다. `getValue()` 는 없습니다.

```js
console.log(qty.value);          // 읽기
qty.value = 10;                  // 쓰기
qty.setProperties({ value: 10, readOnly: true });  // 여러 개 한 번에
```

`minValue` / `maxValue` / `possibleValues` 를 벗어난 값은 넣을 때 보정됩니다.

## 이벤트

`addEventListener` 로 받습니다. 브라우저 DOM 이벤트이므로 `e.dsModel` 이 편집기 자신이고, 확정된 값은 `e.dsModel.value` 로 읽습니다.

```js
qty.addEventListener('change', function (e) {
  console.log('확정 값', e.dsModel.value);
});

title.addEventListener('liveChange', function (e) {
  console.log('입력 중', e.options.value);
});
```

| 이벤트 | 시점 | e.options |
| --- | --- | --- |
| `change` | 값 확정 (Enter, 포커스 이동, 콤보 선택) | 대개 `{}` |
| `liveChange` | 타이핑 중 | `{ value }` |
| `preEdit` / `postEdit` | 편집 시작 / 끝 | - |
| `cancelEdit` | Esc 로 취소 (값 복원) | - |
| `validStateChange` | `validState` 가 바뀜 | - |
| `show` / `hide` | 팝업 열림 / 닫힘 | `hide` 는 `{ cancelFlag }` |
| `viewBuilt` | 비동기로 불러오는 화면(자동완성 등) 준비 완료 | - |

`onChange` 같은 속성으로 콜백을 넣는 방식은 없습니다. `endEdit`, `valueChange` 이벤트도 없습니다.

::: warning 코드로 값을 넣어도 change 가 발생합니다
`qty.value = 10` 처럼 코드에서 값을 바꿔도 `change` 가 발생합니다. 저장 처리 등이 두 번 돌지 않게 하려면 아래 중 하나를 씁니다.

- 생성 옵션 `fireOnlyFromUIInteractionFlag: true` : 사용자 조작으로 생긴 이벤트만 발생
- `tweaker.disableEvents()` → 값 변경 → `tweaker.enableEvents()` : 그 구간만 막기 (DataGridView, Factory 가 쓰는 방식)
:::

## 유효성

`validState` (읽기 전용, boolean) 로 확인합니다. 값이 바뀔 때마다 다시 계산되고 `validStateChange` 가 발생합니다.

```js
var partNo = new TweakerString({ value: '', pattern: 'PRT-[0-9]{4}', requiredFlag: true })
  .inject(document.getElementById('partNo'));

partNo.addEventListener('validStateChange', function (e) {
  saveButton.disabled = !e.dsModel.validState;
});
```

- 검사 규칙은 TweakerString 의 `pattern` (앞뒤에 `^`, `$` 가 자동으로 붙음) 과 `requiredFlag` 뿐입니다.
- 숫자의 `viewOptions.customValidator` 는 입력 문자열 해석용이며 `validState` 와 상관이 없습니다.

## 타입 이름으로 만들기

편집기 클래스 대신 typeRepresentation 이름으로 만들 수 있습니다. 화면에 띄울 타입이 데이터로 정해지는 속성 패널에서 씁니다.

```js
require(['DS/Tweakers/TypeRepresentationFactory'], function (TypeRepresentationFactory) {
  var factory = new TypeRepresentationFactory();

  factory.generateView(50, {
    typePath: 'percentage',
    semantics: { maxValue: 80 },
    readOnly: false
  }).then(function (tweaker) {
    tweaker.inject(document.getElementById('rate'));
    tweaker.addEventListener('change', function (e) {
      console.log(e.dsModel.value);
    });
  });
});
```

- `onViewCreated`, `onFailure` 를 넣지 않으면 Promise 를 돌려줍니다. 넣으면 콜백으로 받습니다.
- `typePath` 에는 내장 타입 이름, [등록한 사용자 타입](/tweakers/custom-type), enum 이름을 넣을 수 있습니다.
- `context: 'inlinedTemplate'` 을 주면 타입에 정의된 한 줄용 모양을 씁니다 (툴바, 폼 셀). 기본은 `'stdTemplate'` 입니다.
- 만들 때 넣는 초기값으로는 `change` 가 발생하지 않습니다.
- 전체 옵션은 [TypeRepresentationFactory API](/tweakers/api/type-representation-factory#generateview) 에 있습니다.

::: warning readOnly, escapeHTML 은 semantics 가 아니라 최상위에
`semantics.readOnly` 와 `semantics.escapeHTML` 은 `'true'` 문자열과 비교해서 변환되므로 `true` (boolean) 를 넣으면 `false` 가 됩니다. `generateView(value, { readOnly: true })` 처럼 최상위 옵션으로 넘깁니다.
:::

## 정리

화면을 닫을 때 `destroy()` 를 부릅니다. `remove()` 는 화면에서 떼기만 하고 정리하지 않습니다.

```js
qty.destroy();
```

::: tip Factory 로 만든 편집기
Factory 는 만든 편집기를 재사용 목록(pool)에 보관합니다. `factory.destroy()` 는 **사용하지 않는** 편집기만 정리하므로, 화면에 붙어 있는 편집기는 각각 `tweaker.destroy()` 를 부른 뒤 `factory.destroy()` 를 부릅니다.
:::
