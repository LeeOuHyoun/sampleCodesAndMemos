# 편집기 직접 만들기 <Badge type="tip" text="로컬 실행 확인" />

내장 편집기(문자열, 숫자, 콤보 ...)로 안 되는 값은 `TweakerBase` 를 상속해 편집기를 직접 만듭니다. 만든 편집기는 템플릿과 타입 이름으로 등록하면 폼(`generateView`)과 그리드 셀(컬럼 `typeRepresentation`)에서 내장 편집기처럼 씁니다. 앱 파일 76개 중 15개가 이 방법을 씁니다 (EPSSchematicsUI 의 tweakers 7개, CfgVariantEffectivityEditor, ENOXModelListView, WAfrTweakers, TweakersEx, SpecGridView UWAObjectTemplate 등).

샘플: [04_customTweaker.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/04_customTweaker.html)

::: info 근거
Tweakers.js 의 TweakerBase (publishedProperties, `_applyValue`, `_applyReadOnly`, `_createViewModule`, `_resolveViewModuleToApply`, `onChange` / `onPreEdit` / `onPostEdit` / `onCancelEdit`, `computeContentSize`), baseViewModule (`setTweakerValue`, `inject`, `destroy`, `computeTweakerContentLength`), TypeRepresentationDirectory.registerTemplates / `_callOnTemplateRequired`. Utilities.js 의 WUXUWAUtils.inherit, Dom.addEventOnElement / isCurrentlyCalledFromUIInteraction, Utils.dynamicRequire. DataGridView.js 의 셀 편집기 생성(`readOnly: !isCellInEdition`)과 change / liveChange 처리(`setModelAt`). 호출부: EPSSchematicsUI tweakers (BigInt, String, JSON, ValueTypeCombo ...) 와 EPSSchematicsUITypeTemplates.json, CfgVariantEffectivityEditor (TweakerTristate), SpecGridView UWAObjectTemplate, WAfrTweakers, ENOChgGovernanceUX (TweakerExpandInput).

샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 구조

편집기 하나는 네 조각으로 이루어집니다.

| 조각 | 하는 일 | 샘플 |
| --- | --- | --- |
| 편집기 클래스 | 값(`value`)과 속성을 가짐. `TweakerBase.inherit({ ... })` | `StarRatingTweaker`, `MeasureTweaker` |
| 화면 모듈 (view module) | 화면을 그리고 사용자 입력을 값으로 바꿈. 편집 모드용, 읽기 모드용을 따로 둘 수 있음 | `StarEditView`, `MeasureEditView`, `MeasureReadView` |
| 템플릿 | 템플릿 id 에 모듈 경로와 기본 옵션(`displayStyle`)을 묶음. `registerTypeTemplates` | `sampleStarRating`, `sampleMeasure` |
| 타입 | 타입 이름에 템플릿 id 와 기본 semantics 를 묶음. `registerTypeRepresentations` | `starRating`, `measure` |

편집기 클래스는 `VIEW_MODULES` 표에서 지금 모드(`readOnly`)와 `displayStyle` 에 맞는 화면 모듈을 골라 만듭니다. `readOnly` 나 `displayStyle` 이 바뀌면 화면 모듈을 버리고 새로 만듭니다. 원본 앱 15개 중 14개가 이 방식입니다.

## 편집기 클래스

<<< @/../TweakersSample/04_customTweaker.html#star-tweaker{js}

- `publishedProperties` 에는 **새로 추가하거나 기본값을 바꿀 속성만** 적습니다. 부모의 속성(`value`, `readOnly`, `disabled`, `possibleValues` ...)과 합쳐집니다 (샘플 편집기의 속성은 38개).
- `value` 를 다시 적을 때는 `advancedSetter: true` 를 그대로 둡니다. 그래야 값을 넣을 때 `minValue` / `maxValue` / `possibleValues` 보정(`_preEditValue`)을 거칩니다. EPSSchematicsUI 처럼 `advancedSetter: false` 로 두면 보정 없이 바로 `_applyValue` 가 불립니다.
- ES 클래스로 써도 됩니다 (EPSSchematicsUI: `class UIBigIntTweaker extends WUXTweakerBase { static get publishedProperties() { ... } }`). `inherit` 안의 함수에서 부모를 부를 때는 `this._parent(...)`, ES 클래스에서는 `super.xxx(...)` 를 씁니다.

| 편집기 클래스에서 덮어쓰는 것 | 필요 | 설명 | 원본 앱 |
| --- | --- | --- | --- |
| `name` | 권장 (`inherit`) | 클래스 이름 | 모든 `inherit` 사용처 |
| `publishedProperties` | 필수 | 추가 / 변경할 속성 | 15개 모두 |
| `prototype.VIEW_MODULES` | 필수 | 모드별 화면 모듈 표 (아래) | 14개 |
| `getStringFromValue(value)` | 선택 | 값을 글자로. 기본 읽기 모드 화면, 그리드 툴팁에 쓰임 | - |
| `_applyProperties(oldValues)` | 선택 | 직접 추가한 속성이 바뀔 때 처리. 부모를 꼭 부름 | EPSSchematicsUI, TweakersEx 등 8개 |
| `_upgradeValue(value)` | 선택 | 들어온 값을 정규화 (`'1'` → `true` 등) | CfgVariantEffectivityEditor |
| `_isValueValid(value)` | 선택 | `false` 면 `validState` 가 false, 경고 아이콘 | - |
| `_applyValue(old, new)` | 거의 안 씀 | 기본 동작(화면 모듈 `setValue` 호출, change / liveChange 발생)을 바꿀 때. 부모를 꼭 부름 | EPSSchematicsUI JSON 등 4개 |
| `prototype.baseViewModule` | 선택 | 화면 모듈 공통 부모. `isValueDisplayedAsString` 에만 쓰임 | EPSSchematicsUI |

::: tip 직접 추가한 속성의 반영
`units` 처럼 직접 추가한 속성은 생성 시 넘긴 값이 들어 있으므로 화면 모듈의 `buildView` 에서 읽으면 됩니다 (샘플). 만든 뒤에 바뀌는 것까지 반영하려면 `_applyProperties` 를 덮어써 `this.isDirty('units')` 일 때 처리합니다 (EPSSchematicsUI BigInt 의 `stepValue`).
:::

## 화면 모듈

<<< @/../TweakersSample/04_customTweaker.html#star-edit-view{js}

화면 모듈은 `TweakerBase.prototype.baseViewModule` 을 상속합니다. 생성자에서 부모를 부르면 `buildView` → `handleEvents` 순으로 불리고, 편집기가 `this._view` 를 편집기 요소(`div.wux-tweakers`) 안에 붙입니다. `this._tweaker` 가 편집기, `this._options` 가 `VIEW_MODULES` 항목의 `options` 입니다.

| 화면 모듈에서 덮어쓰는 것 | 필요 | 설명 |
| --- | --- | --- |
| `buildView()` | 필수 | `this._view` 에 화면 요소를 만듦. `inject` / `remove` / `destroy` 가 있는 UWA 요소나 WUX 컨트롤 |
| `setValue(newValue, oldValue)` | 필수 | 코드로 `value` 를 넣었을 때 화면 갱신. 안 만들면 화면이 안 바뀜 |
| `handleEvents()` | 편집 모드 필수 | 사용자 입력을 받아 `this.setTweakerValue(값)` 호출 |
| `setDisabled(flag)` | 선택 | `disabled` 반영. 없으면 `this._view.disabled = flag` 만 함 (WUX 컨트롤, input 이 아니면 효과 없음) |
| `_getElementToFocus()` | 선택 | 편집기가 포커스를 받을 때(그리드 편집 시작) 포커스를 줄 요소 |
| `destroy()` | 선택 | 편집기 요소에 직접 붙인 클래스나 글자를 지울 때. 끝에 `BaseView.prototype.destroy.call(this)` |
| `computeTweakerContentLength()` | 선택 | 내용 너비(px). 기본은 편집 모드 `_view.offsetWidth`, 읽기 모드 글자 너비 |
| `setTouchMode`, `setIcon`, `setPossibleValues`, `setPlaceholder`, `setViewOptions` | 선택 | 해당 속성이 바뀔 때 편집기가 부름 |

`this._view` 를 만들지 않고 `this._tweaker.elements.container` 에 직접 글자를 쓰는 화면 모듈도 있습니다 (EPSSchematicsUI 읽기 모드, SpecGridView UWAObjectTemplate). 이때는 `destroy` 에서 직접 비웁니다.

### VIEW_MODULES 키

`{ 키: { classObject: 화면모듈, options: { ... } } }` 입니다. 편집기는 아래 순서로 찾아 처음 맞는 것을 씁니다. 자기 클래스에 없으면 부모 클래스(`TweakerBase` 까지)의 표도 찾습니다.

| 모드 | 찾는 키 (순서대로) |
| --- | --- |
| 편집 | `{displayStyle}_hasPossibleValues_allowMultipleValues` → `{displayStyle}_hasPossibleValues` → `{displayStyle}` |
| 읽기 (`readOnly: true`) | `{displayStyle}_hasPossibleValues_..._readOnly` → `{displayStyle}_readOnly` → `readOnly` |

- `_hasPossibleValues` 는 `possibleValues` 가 있을 때, `_allowMultipleValues` 는 `allowMultipleValuesFlag` 가 true 일 때만 붙습니다.
- `TweakerBase` 에 `readOnly` 키(값을 글자로 보여 주는 기본 화면)가 있습니다. 그래서 **읽기 모드 화면 모듈을 만들지 않으면 `getStringFromValue` 의 글자가 보입니다.** 샘플의 별점 편집기가 이 방식입니다 (그리드 셀, 폼 읽기 전용 모두 `★★★★☆`).
- 실제 앱은 키 이름을 `edition` / `readOnly` (EPSSchematicsUI), `switch` / `checkbox` / `readOnly` (CfgVariantEffectivityEditor) 처럼 정합니다.

::: warning displayStyle 이 비어 있으면 편집 모드 화면이 없습니다
편집 모드는 `displayStyle` 값을 키로 찾습니다. 템플릿 `options` 에 `displayStyle` 을 넣지 않고 편집기 기본값도 없으면, 읽기 모드는 기본 글자로 보이지만 편집 모드(그리드 더블클릭, 폼)는 빈 `div.wux-tweakers` 만 남고 오류도 나지 않습니다. 템플릿의 `options: { displayStyle: 'edition' }` 이나 `publishedProperties` 의 `displayStyle: { defaultValue: 'edition' }` 으로 정합니다.
:::

### 화면 모듈 없이 만들기

WAfrTweakers 는 `VIEW_MODULES` 없이 편집기 클래스의 `buildView` / `_applyValue` / `handleEvents` 를 직접 덮어쓰고 (`this._parent()` 를 먼저 부름) 화면 컨트롤을 `this.elements.internalView` 에 둡니다. 화면 모듈이 없으면 `TweakerBase._applyValue` 가 `internalView.value = value` 만 해 주고, 읽기 / 편집 모드 전환은 직접 처리해야 합니다. 툴바 명령 버튼처럼 모드 구분이 없는 경우에만 씁니다.

## 값과 이벤트

<<< @/../TweakersSample/04_customTweaker.html#measure-tweaker{js}

<<< @/../TweakersSample/04_customTweaker.html#measure-edit-view{js}

화면 모듈에서 부르는 것과 그 결과입니다.

| 부르는 것 | 하는 일 | 나가는 이벤트 |
| --- | --- | --- |
| `this.setTweakerValue(v)` | 편집기 `value` 를 사용자 조작으로 바꿈. 같은 값이면 아무 일 없음 | 편집 중이 아니면 `change`. 편집 중(`onPreEdit` 뒤)이면 처음에 `preEdit`, 그다음부터 `liveChange` (`e.options.value`) |
| `tweaker.onPreEdit()` | 편집 중 상태 시작. 지금 값을 취소용으로 기억. 여러 번 불러도 한 번만 | 없음 |
| `tweaker.onPostEdit()` | 편집 끝. 그사이 liveChange 가 있었으면 확정 | `change`, `postEdit` |
| `tweaker.onCancelEdit()` | 편집 취소. 기억한 값으로 되돌림 (`handleEditionCancel: false` 면 되돌리지 않음) | 되돌린 값의 `liveChange`, `cancelEdit` |

- 한 번에 확정되는 입력(별 클릭, 콤보 선택)은 `setTweakerValue` 만 부릅니다. 실행 결과 폼에서 `change` 가 한 번 옵니다.
- 타이핑처럼 이어지는 입력은 샘플처럼 `input` 에서 `onPreEdit` + `setTweakerValue`, `blur` 에서 `onPostEdit`, Esc 에서 `onCancelEdit` 를 부릅니다. 실행 결과 글자마다 `liveChange`, 칸을 떠날 때 `change` 가 한 번 옵니다. 내장 문자열 편집기도 같은 구조입니다 (`uncommittedChange` → `onPreEdit`, `blur` → `onPostEdit`, Esc → `onCancelEdit`).
- `onPreEdit` 를 `focus` 에서 한 번만 부르면, Esc 로 취소한 뒤 포커스가 그대로인 채 다시 입력할 때 편집 중 상태가 아니어서 글자마다 `change` 가 나갑니다. 입력할 때마다 부르는 것이 안전합니다.
- `setTweakerValue` 대신 `this._tweaker.value = v` 를 직접 넣어도 값과 `change` 는 같습니다 (CfgVariantEffectivityEditor). 다만 `preEdit` / `liveChange` 구분이 없습니다.

### 코드로 value 를 넣을 때

`tweaker.value = 새값` 을 넣으면 편집기가 화면 모듈의 `setValue(새값, 이전값)` 을 부르고 `change` 를 냅니다 (실행 확인: 별 1개로 바뀌고 `change starRating = 1`). 이벤트 없이 넣으려면 [`disableEvents()` / `enableEvents()`](/tweakers/api/tweaker#메서드) 로 감쌉니다. `readOnly` 나 `displayStyle` 을 같이 바꾸는 중에는 `setValue` 대신 화면 모듈을 새로 만듭니다.

`setValue` 는 사용자가 입력하는 중(liveChange)에도 불립니다. 이때 입력칸을 다시 쓰면 커서가 움직여 입력이 꼬입니다 (실행 확인: 조건 없이 다시 쓰게 바꾸면 `2.7` 을 입력했을 때 값이 `72`). 샘플은 입력칸의 숫자와 새 값이 같으면 입력칸을 건드리지 않습니다.

::: warning 이벤트는 Dom.addEventOnElement 로 등록합니다
그리드는 셀 편집기의 `change` 를 받으면 **사용자 조작 중일 때만** 값을 데이터(`nodeModel`)에 넣습니다 (`Dom.isCurrentlyCalledFromUIInteraction()`). `DS/Utilities/Dom` 의 `addEventOnElement(편집기, 요소, 이벤트, 함수)` 로 등록한 함수는 진짜 사용자 이벤트일 때 이 상태를 만들어 줍니다.

실행 결과 별 클릭을 `this._view.addEventListener('click', ...)` 로 받으면 편집기 값은 바뀌고 폼의 `change` 와 그리드의 `change` 이벤트도 오지만 **`nodeModel` 은 그대로**입니다. `addEventOnElement` 로 바꾸면 들어갑니다. 원본 앱 15개 중 11개가 `addEventOnElement` 를 씁니다. 파일 읽기 완료처럼 사용자 이벤트가 아닌 곳에서 값을 넣을 때는 `Dom.pushUserInteractionContext()` 와 `Dom.popUserInteractionContext()` 로 감쌉니다 (EPSSchematicsUI JSON).
:::

::: warning 안쪽 input / select 의 change 는 막습니다
브라우저의 `change` 이벤트는 편집기의 `change` 와 이름이 같고 위로 올라갑니다. 막지 않으면 편집기에 단 `change` 리스너가 한 번 더 불리고, 그때의 `e.dsModel` 은 `undefined` 입니다 (실행 확인: 리스너에서 `e.dsModel.value` 오류). 안쪽 요소의 `change` 에서 `e.stopPropagation()` 을 부릅니다. EPSSchematicsUI 도 모든 핸들러에서 막습니다.
:::

## 읽기 모드와 편집 모드

<<< @/../TweakersSample/04_customTweaker.html#measure-read-view{js}

| 상황 | 동작 (실행 확인) |
| --- | --- |
| 그리드 셀 보기 | `readOnly: true` 로 만들어져 읽기 모드 화면 모듈(없으면 `getStringFromValue` 글자) |
| 그리드 셀 더블클릭 | 같은 편집기의 `readOnly` 가 false 가 되어 편집 모드 화면 모듈로 바뀜. `_getElementToFocus` 의 요소(숫자칸)에 포커스 |
| 편집 중 Enter, 다른 셀 클릭 | 편집 끝 → `readOnly: true` → 편집 모드 화면 모듈을 버릴 때 편집기가 `onPostEdit` 를 불러, 입력 중이던 값이 `change` 로 확정되어 `nodeModel` 에 들어감 |
| 편집 중 그리드 밖 클릭 | 편집이 끝나지 않음 (셀은 계속 편집 모드) |
| 편집 중 Esc | 화면 모듈이 `onCancelEdit` 를 부르면 원래 값으로 돌아가고 `nodeModel` 도 그대로. **부르지 않으면 Esc 로 편집이 끝나면서 입력값이 확정됨** |
| 폼에서 `readOnly = true` | 읽기 모드 화면 모듈로 바뀜 (`★☆☆☆☆`, `10cm`) |
| 폼에서 `disabled = true` | 화면 모듈의 `setDisabled(true)` 가 불림. 샘플은 별 클릭과 입력칸을 막음 |

- 그리드는 컬럼마다 편집기를 셀 수만큼 만들지 않고 재사용하며, 셀마다 `value` 와 `readOnly` 를 바꿔 넣습니다. 그래서 화면 모듈은 `setValue` 로 어떤 값이 와도 다시 그려야 합니다.
- 그리드가 툴팁을 띄울지, 자동 너비를 얼마로 할지는 편집기의 `computeContentSize()` 로 정합니다. 기본 구현이 편집 모드는 `_view` 의 너비, 읽기 모드는 글자 너비를 재므로 대개 덮어쓰지 않아도 됩니다 (샘플: 편집 100 / 127px, 읽기 74 / 51px). 내용이 비동기로 그려지는 등 잴 수 없을 때만 화면 모듈의 `computeTweakerContentLength` 를 덮어씁니다.

## 연결

<<< @/../TweakersSample/04_customTweaker.html#register{js}

- `registerTypeTemplates` 의 `path` 는 AMD 모듈 경로, `options` 는 편집기를 만들 때 속성으로 넘어갑니다 (`displayStyle` 외의 속성도 됨). `path` 가 없는 항목은 버리고, 이미 있는 템플릿 id 는 무시합니다.
- `registerTypeRepresentations` 의 `semantics` 도 편집기 속성으로 넘어갑니다. 샘플의 `units` 처럼 직접 추가한 속성을 여기서 줍니다. 쓰는 쪽(컬럼 `semantics`, `generateView` 의 `semantics`)에서 같은 키를 주면 그쪽이 우선입니다.
- 실제 앱은 템플릿 목록을 JSON 파일로 두고 한 번에 등록합니다 (EPSSchematicsUI `assets/EPSSchematicsUITypeTemplates.json`: `{ "bigintTemplate": { "path": "DS/EPSSchematicsUI/tweakers/EPSSchematicsUIBigIntTweaker", "options": { "displayStyle": "edition" } } }`).

::: tip 모듈은 처음 쓸 때 불러옵니다
`path` 가 `DS/폴더/모듈` 이면 Factory 는 먼저 같은 폴더의 묶음 파일 `DS/폴더/폴더` 를 불러오고(실패해도 무시) 그다음 모듈을 불러옵니다. ENOVIA 에 배포된 폴더에는 묶음 파일이 있으므로 문제가 없지만, 샘플처럼 한 페이지에서 `define` 으로 모듈을 정의하면 `TweakersSample/TweakersSample.js` 404 가 납니다. 샘플은 빈 `define('DS/TweakersSample/TweakersSample', ...)` 을 두어 막았습니다.
:::

### 폼에서

<<< @/../TweakersSample/04_customTweaker.html#form{js}

실행 결과: 별을 누르면 `change starRating = 5`, 숫자칸에 입력하면 글자마다 `liveChange`, 칸을 떠날 때 `change`, 단위 콤보를 바꾸면 `change` 가 옵니다.

### 그리드 셀에서

<<< @/../TweakersSample/04_customTweaker.html#grid{js}

실행 결과: 평점 셀을 더블클릭하면 별 다섯 개가 나오고, 별을 누르면 바로 `nodeModel` 의 `rating` 이 바뀝니다 (그리드 `change` 와 `onNodeModelUpdate` 가 옴). 두께 셀은 숫자를 입력하고 Enter 를 누르거나, 단위 콤보를 고르면 `thickness` 가 `{ amount, unit }` 객체로 들어갑니다.

- 그리드 `addEventListener('change', function (e, cellInfos) { ... })` 의 `e.dsModel` 은 편집기가 아니라 **그리드**입니다. 셀 정보는 두 번째 인자 `cellInfos` 로 받습니다. 셀 밖에서 올라온 `change` 는 `cellInfos` 없이 불립니다.
- 컬럼에 `liveUpdateFlag: true` 를 주면 입력 중(liveChange)에도 `nodeModel` 에 들어갑니다 (실행 확인).

## 코드로 제어

<<< @/../TweakersSample/04_customTweaker.html#code-control{js}

## 덮어쓰지 않으면 (실행 결과)

| 빠뜨린 것 | 결과 |
| --- | --- |
| 템플릿 `options.displayStyle` (편집기 기본값도 없음) | 편집 모드 화면이 비어 있음. 오류 없음 |
| `VIEW_MODULES.readOnly` | 읽기 모드는 `TweakerBase` 기본 화면으로 `getStringFromValue` 글자 표시 (정상 동작) |
| `getStringFromValue` (값이 객체) | 기본 구현이 `value.toString()` 이라 읽기 모드 기본 화면과 툴팁에 `[object Object]` 로 나옴 (원본 기준). 객체 값이면 덮어씀 |
| 이벤트를 `Dom.addEventOnElement` 대신 `addEventListener` 로 등록 | 폼은 정상. 그리드는 change 이벤트까지 오지만 `nodeModel` 에 값이 안 들어감 |
| 안쪽 input / select 의 `change` 를 `stopPropagation` 안 함 | 편집기 `change` 리스너가 `dsModel` 없는 이벤트로 한 번 더 불림 |
| Esc 에서 `onCancelEdit` | 그리드에서 Esc 가 취소가 아니라 확정이 됨 |
| `_getElementToFocus` | 그리드 편집 시작 때 포커스가 그리드 요소에 남아, 숫자칸을 한 번 더 눌러야 입력됨 |
| `disabled` 처리 (`setDisabled` 나 핸들러에서 확인) | `_view` 가 div 면 `disabled = true` 여도 별 클릭으로 값이 바뀜 |

## 실제 앱의 예

| 앱 파일 | 편집기 | 특징 |
| --- | --- | --- |
| EPSSchematicsUI/tweakers/*.js (7개) | BigInt, String, JSON, FileBuffer, ObjectEditor, ValueTypeCombo, DGVActionBar | ES 클래스 `extends`. `edition` / `readOnly` 화면 모듈, 템플릿은 JSON 파일로 등록 |
| CfgVariantEffectivityEditor, CfgMassVariantEffectivityEditor | TweakerTristate | true / false / 미정 3상태 아이콘. `_upgradeValue` 로 값 정규화, `tristate` 타입으로 그리드 컬럼에 사용 |
| CfgRuleMatrixComponent | matrixRuleCellTweaker | 규칙 매트릭스 셀 |
| SpecGridView/utils/UWAObjectTemplate.js | uwaObjectTemplate | 값이 DOM 요소. 읽기 모드 화면 모듈만 있음 |
| ENOXModelListView | titleTweaker, contextualMenu | 목록 제목, 메뉴 버튼 |
| ENOChgGovernanceUX | TweakerExpandInput | 펼침 입력칸 (`registerTypeTemplates` 로 그리드, 툴바에 등록) |
| WAfrTweakers | tweakerHandlerSimple 등 | 화면 모듈 없이 `buildView` / `_applyValue` 직접 덮어씀. 툴바 명령 버튼 |
| TweakersEx | tweakerObject2, pathExplorer | 객체 편집기 |

## 2026 버전 차이

- `TweakerBase` 가 ES 클래스로 바뀌었지만 `TweakerBase.inherit({ ... })`, `prototype.baseViewModule`, `VIEW_MODULES`, `setTweakerValue`, `onPreEdit` / `onPostEdit` / `onCancelEdit` 는 같습니다.
- `VIEW_MODULES` 항목에 `wrappedView: '다른키'` 를 넣으면 편집기의 `useWrappedView` 가 true 일 때 그 키의 화면 모듈을 씁니다.
- 편집 중인지 알려 주는 `isInTransaction()` 이 추가되었습니다.
