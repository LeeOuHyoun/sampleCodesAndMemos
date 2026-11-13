# 그 밖의 편집기와 보조 모듈 <Badge type="info" text="원본 분석" />

[편집기 종류별 사용법](/tweakers/editors) 에 없는 편집기(기간, 물리량, 배열, 벡터, 파일, 객체 ...)와 Tweakers 안의 보조 모듈입니다. 모든 편집기가 물려받는 공통 속성, 메서드, 이벤트(`value`, `readOnly`, `change` ...)는 [Tweaker API](/tweakers/api/tweaker) 에 있고 여기서는 다시 적지 않습니다.

::: info 근거
Tweakers.js (2025 / 2026) 의 TweakerDuration, DurationViewModules, TweakerAbstractMagnitude, AbstractMagnitudeViewModules, TweakerRange, TweakerVector, TweakerFile, TweakerImage, TweakerBlob, TweakerMultiRep, TweakerArray, TweakerObjectBase, TweakerObject, TweakerUWAObject, TweakerWUXAbstract, TweakerVariant, TweakerParameter, TweakerLayout, TweakerTreeNodeModel, TweakerParentTreeNodeModel, TypeEnums, TypeUtils, TweakerUtils, TypeRepresentationDirectory, StringViewModules, URLObjectViewModules, 2026 의 TweakerViewUtils. `assets/typeTemplates.json`, `assets/defaultTypeRepresentations.json`. DataGridView.js 의 셀 편집기 생성부 (`context = "inlinedTemplate"`).
호출부: 클래스 이름은 앱 파일 중 TypeEnums 8개, TweakerBlob 3개 (VCXWebGUI, ENOProjectMgmtCommonComponents, XSRCommonComponents), TypeUtils 2개 (DataGridView, WUXAutoComplete), StringViewModules 2개 (TweakersEx, EPSSchematicsUI), TweakerArray 1개 (DocumentCreateNew), TweakerVector 1개 (VCXWebGUI), TweakerUtils / URLObjectViewModules 각 1개 (TweakersEx). 타입 이름은 `layout` 7개, `image` 4개 (ENXNav, ENOXAlternateSubstitute 등), `file` 2개 (DocumentCommonInfra 등), `object` 2개 (CollectionView, Tree) 이고 `dateRange`, `duration`, `magnitude`, `array`, `vector3` 를 쓰는 앱 파일은 없습니다.
:::

## 한눈에 보기

그리드 셀은 타입의 `inlinedTemplate` 을 쓰고 (DataGridView 가 `context: 'inlinedTemplate'` 으로 만듦), `factory.generateView` 는 기본으로 `stdTemplate` 을 씁니다. 그래서 같은 타입 이름이라도 그리드와 단독 화면의 모양이 다를 수 있습니다.

| 편집기 | value | typeRepresentation (std / inlined 의 displayStyle) | 직접 만들 때 기본 displayStyle |
| --- | --- | --- | --- |
| `TweakerDuration` | 기간 `{ from, to }` (밀리초 숫자) 또는 길이(초) | `dateRange` (`datePickers` / `inlineDatePickers`), `duration` (`editors` / `divDotsEditors`) | `divDotsEditors` (길이) |
| `TweakerAbstractMagnitude` | 숫자 또는 `{ magnitude, tolerance }` | `magnitude` (`editors` / `divDotsEditors`) | `divDotsEditors` |
| `TweakerArray` | 배열 | `array`, `typedarray` (`std` / `inline`) | `inline` |
| `TweakerVector` | 숫자 배열 | `vector2`, `vector3`, `vector4` (`spinBoxes`) | `spinBoxes` |
| `TweakerFile` | `File` 또는 `FileList` | `file` (`filePicker`) | `filePicker` |
| `TweakerImage` | 이미지 경로 / 아이콘 정의 | `image` (`simple`) | `simple` |
| `TweakerBlob` | data URL 문자열 | `blob` (`label`) | `label` |
| `TweakerObject` | 일반 객체 | `object` (`std` / `inline`) | `inline` |
| `TweakerUWAObject` | UWA 객체 (`options` 를 편집) | `uwaObject` (`std`) | `inline` |
| `TweakerWUXAbstract` | WebUX 컨트롤 (`publishedProperties` 를 편집) | `typedObject` (`std`) | `inline` |
| `TweakerVariant` | 타입을 바꿔 가며 넣는 값 | `variant` (`editors`) | `editors` |
| `TweakerParameter` | 숫자 (입력 글자 유지) | `parameterEditor` (`spinBox`) | `spinBox` |
| `TweakerLayout` | `TypeEnums.Layout` 항목 | `layout` (`layoutModes`) | `layoutModes` |
| `TweakerTreeNodeModel` | `TreeNodeModel` | `DS/TreeModel/TreeNodeModel`, `DS/Tree/TreeNodeModel` (`std`) | - |
| `TweakerParentTreeNodeModel` | `TreeNodeModel` | `parentTreeNodeModel` (`clickableIcons`) | - |

## TweakerDuration

`DS/Tweakers/TweakerDuration`. 부모는 [TweakerAbstractMagnitude](#tweakerabstractmagnitude) 입니다. 두 가지 값을 다룹니다.

- **기간 (시작 ~ 끝)**: `{ from: 밀리초, to: 밀리초 }`. 화면은 `DatePicker` 두 개 ([날짜 (DatePicker, TweakerDate)](/controls/webux-controls#날짜-datepicker-tweakerdate)). 타입 이름 `dateRange`.
- **길이**: 초 단위 숫자 또는 `{ duration: 초, tolerance: 초 }`. 화면은 숫자 칸 + 단위 콤보 (초, 분, 시간, 일, 주, 개월, 년). 타입 이름 `duration`.

어느 쪽으로 동작할지는 `displayStyle` 로 정합니다. 직접 `new` 로 만들면 기본값이 `divDotsEditors` 라서 **길이 편집기**가 됩니다. 기간은 `displayStyle: 'datePickers'` 를 꼭 줍니다.

```js
require(['DS/Tweakers/TweakerDuration'], function (TweakerDuration) {
  var period = new TweakerDuration({
    displayStyle: 'datePickers',
    value: { from: new Date(2026, 0, 5).getTime(), to: new Date(2026, 0, 30).getTime() }
  }).inject(document.getElementById('period'));
  period.addEventListener('change', function (e) {
    var v = e.dsModel.value;
    console.log(v ? new Date(v.from) : null, v ? new Date(v.to) : null);
  });

  var effort = new TweakerDuration({
    displayStyle: 'editors',
    value: { duration: 7200, tolerance: 600 },
    displayOptions: { unit: { duration: 'Hours', tolerance: 'Minutes' } }
  }).inject(document.getElementById('effort'));
  effort.addEventListener('change', function (e) {
    console.log(e.dsModel.value);
  });
});
```

### 속성

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `undefined` | 기간이면 `{ from, to }` (각각 밀리초 숫자, 한쪽만 있어도 됨), 길이면 숫자(초) 또는 `{ duration, tolerance }` |
| `displayStyle` | `'divDotsEditors'` | 아래 표 |
| `displayOptions` | 아래 | 길이 편집기의 표시 설정. 일부 키만 넣어도 나머지는 기본값으로 채워짐 |

`displayOptions` 기본값은 `{ label: '기간', precision: 3, tolerance: true, unit: 'Seconds', supportedUnits: TweakerDuration.getDefaultSupportedUnits() }` 입니다 (label 은 언어 파일). 키의 뜻은 [TweakerAbstractMagnitude](#tweakerabstractmagnitude) 와 같고, 길이 값의 키 이름이 `magnitude` 대신 `duration` 입니다. 기간 편집기는 `displayOptions.timePickerFlag: true` 를 주면 두 `DatePicker` 에 시간 선택이 붙습니다.

### displayStyle

| displayStyle | 값 | 화면 |
| --- | --- | --- |
| `datePickers` | 기간 | "시작:" 라벨 + DatePicker, "종료:" 라벨 + DatePicker (`stdTemplate` of `dateRange`) |
| `inlineDatePickers` | 기간 | 위와 같고 한 줄 (`single-line` 속성). 그리드 셀의 `dateRange` |
| `noLabelDatePickers` | 기간 | 라벨 없는 DatePicker 두 개 |
| `editors` | 길이 | "기간" 라벨 + 숫자 칸 + 단위 콤보, `tolerance` 가 true 면 `±` + 오차 칸 + 단위 콤보 (`stdTemplate` of `duration`) |
| `editorsInline` | 길이 | 위에서 라벨만 뺀 것 |
| `divDotsEditors` | 길이 | 값 글자 + `...` 버튼. 글자나 버튼을 누르면 `editors` 화면이 팝업으로 열림. 그리드 셀의 `duration` |

읽기 전용(`readOnly: true`)은 전용 화면이 없어 글자로 보입니다. 기간은 `2026년 1월 5일 - 2026년 1월 30일` (브라우저 언어 형식, 시각은 안 보임), 길이는 `2 시간 ± 10 분` 형태입니다.

### 값과 이벤트

- 날짜를 고르면 그 쪽만 바꾼 새 객체 `{ from, to }` 가 `value` 가 되고 `change` 가 옵니다. 날짜는 `getTime()` 밀리초로 들어갑니다.
- 두 날짜를 모두 지우면 `value` 는 `undefined` 가 됩니다 (안쪽 DatePicker 가 `allowUndefinedFlag: true`).
- 시작이 끝보다 늦어도 검사하지 않습니다. 필요하면 `change` 에서 확인합니다.
- 길이는 항상 기준 단위(초)로 저장되고, 화면에는 `displayOptions.unit` 단위로 나눠 `precision` 자리까지 보입니다. `{ duration: 7200, tolerance: 600 }` 에 단위 `Hours` / `Minutes` 면 `2` 시간, `10` 분입니다.
- 안쪽 DatePicker, SpinBox, ComboBox 의 `change` 는 막히고(`stopPropagation`) 편집기의 `change` 하나만 바깥으로 나옵니다.

::: warning from / to 는 Date 가 아니라 밀리초 숫자입니다
타입 정의 문자열에는 `{ from: Date, to: Date }` 로 적혀 있지만, 값 검사는 `from`, `to` 가 숫자인지 봅니다. `{ from: new Date(), to: new Date() }` 를 넣으면 기간으로 인식되지 않아 편집 화면이 만들어지지 않고 읽기 글자도 빈 칸입니다. 그 상태에서 `value` 를 다시 넣으면 화면 모듈의 `setValue` 가 없는 DatePicker 를 건드려 `TypeError` 가 납니다. `date.getTime()` 으로 넣습니다. 반대로 `displayStyle: 'editors'` 에 `{ from, to }` 를 넣어도 같은 일이 생깁니다.
:::

::: warning 단위 콤보를 바꾸면 값이 바뀝니다
단위 콤보에서 다른 단위를 고르면 **보이는 숫자는 그대로 두고 단위만 바꾼 값**으로 저장합니다. `2 시간` 에서 `분` 을 고르면 `2 분` (120초) 이 되고 `change` 가 옵니다. 같은 길이를 다른 단위로 보고 싶을 때는 `tweaker.updateDisplayOptions({ unit: 'Minutes' })` 처럼 코드로 단위를 바꿉니다 (값은 그대로, 화면 숫자만 바뀜). 콤보로 고른 단위는 `displayOptions.unit` 에도 남습니다.
:::

### 메서드

| 메서드 | 설명 |
| --- | --- |
| `updateDisplayOptions(obj)` | 지금 `displayOptions` 에 `obj` 를 합쳐서 다시 넣음. `displayOptions = obj` 는 기본값 위에 `obj` 를 합침 (지금 설정은 버림) |
| `TweakerDuration.getDefaultSupportedUnits()` (static) | 기본 단위 표. `Seconds` 1, `Minutes` 60, `Hours` 3600, `Days` 86400, `Weeks` 604800, `Months` 2678400 (31일), `Years` 31536000 (365일) |
| `TweakerDuration.Format` (static) | `{ MagnitudeAndTolerance: 0, FromTo: 1 }`. 내부 표시용 |

## TweakerAbstractMagnitude

`DS/Tweakers/TweakerAbstractMagnitude`. 단위가 있는 물리량(길이, 무게 ...)과 그 오차를 편집합니다. 부모는 `TweakerBase` 이고, 화면은 `SpinBox` (lite) 와 `ComboBox` 로 만듭니다. 타입 이름 `magnitude` (2026 은 `customMagnitude` 도 같음).

```js
require(['DS/Tweakers/TweakerAbstractMagnitude'], function (TweakerAbstractMagnitude) {
  var len = new TweakerAbstractMagnitude({
    displayStyle: 'editors',
    value: { magnitude: 0.25, tolerance: 0.00005 },
    displayOptions: {
      label: '길이',
      unit: { magnitude: 'mm', tolerance: 'um' },
      supportedUnits: {
        m: { label: 'm', ratio: 1 },
        mm: { label: 'mm', ratio: 0.001 },
        um: { label: 'µm', ratio: 0.000001 }
      }
    }
  }).inject(document.getElementById('len'));
  len.addEventListener('change', function (e) {
    console.log(e.dsModel.value);
  });
});
```

위 편집기는 `250 mm ± 50 µm` 로 보입니다. 값은 `ratio` 가 1 인 기준 단위(m)로 저장됩니다.

### 속성

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `undefined` | 숫자, 또는 `{ magnitude, tolerance }` (기준 단위) |
| `displayStyle` | `'divDotsEditors'` | `editors`, `editorsInline`, `divDotsEditors` ([TweakerDuration](#displaystyle) 표와 같은 모양) |
| `displayOptions` | `{ label: '값', precision: 3, tolerance: true, unit: '', supportedUnits: {} }` | 아래 표 |

| `displayOptions` 키 | 설명 |
| --- | --- |
| `label` | `editors` 화면 앞의 라벨 |
| `precision` | 화면 소수 자릿수 (SpinBox `decimals`). 값은 깎지 않음 |
| `tolerance` | `true` 면 오차 칸(`±`)을 보임 |
| `unit` | 화면 단위의 키. 문자열이면 값과 오차가 같은 단위, `{ magnitude: 'mm', tolerance: 'um' }` 이면 따로 |
| `supportedUnits` | `{ 키: { label, ratio } }`. `ratio` 는 기준 단위에 대한 배율. `{ magnitude: {...}, tolerance: {...} }` 로 값 / 오차 단위 목록을 따로 줄 수도 있음 |

- 오차 칸에 숫자를 넣으면 값이 숫자였더라도 `{ magnitude, tolerance }` 객체로 바뀝니다. 오차를 지우면 다시 숫자가 됩니다.
- 읽기 전용은 `250 mm ± 50 µm` 같은 글자입니다. 오차 단위의 label 이 값 단위와 같으면 오차 뒤 단위는 생략됩니다.

::: warning supportedUnits 와 unit 은 꼭 넣습니다
기본값 `supportedUnits: {}`, `unit: ''` 로는 단위를 찾지 못해 읽기 글자가 빈 칸이고, 편집 화면의 숫자 칸에 값을 치면 `ratio` 를 읽다가 `TypeError` 가 납니다. TweakerDuration 은 기본 단위 표가 있어 그대로 써도 됩니다.
:::

`updateDisplayOptions(obj)` 메서드와 단위 콤보의 동작은 [TweakerDuration](#tweakerduration) 과 같습니다.

## TweakerArray

`DS/Tweakers/TweakerArray`. 배열을 편집합니다. 부모는 [TweakerMultiRep](#tweakermultirep) 이고, 목록 화면은 `TreeListView` 한 열에 항목마다 `valueType` 의 편집기를 넣어 만듭니다.

```js
require(['DS/Tweakers/TweakerArray'], function (TweakerArray) {
  var sizes = new TweakerArray({
    valueType: 'integer',
    value: [10, 20, 30],
    editorTitle: '치수 목록'
  }).inject(document.getElementById('sizes'));
  sizes.addEventListener('change', function (e) {
    console.log(e.dsModel.value);
  });
});
```

### 속성

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `[]` | 배열. 타입 배열(`Float32Array` 등)도 받음 |
| `valueType` | `'string'` | 항목의 타입 이름 (`'string'`, `'integer'`, `'number'`, `'boolean'`, `'date'` ...). `'auto'` 면 항목마다 값의 종류로, `'typedarray'` 면 타입 배열의 종류로 정함 |
| `displayStyle` | `'inline'` | `inline` (한 줄 글자 + `...` 버튼) 또는 `std` (목록 편집 화면) |
| `editorTitle` | `'Array Editor'` | 다이얼로그 제목 (`dialogOptions.title` 이 없을 때) |
| `displayRowIndexes` | `true` | 목록 왼쪽에 행 번호 |
| `itemEditionTrigger` | `'double click'` | 항목 편집을 시작하는 동작. `'click'`, `'double click'`, `'in place'` (모든 항목이 늘 편집 상태) |
| `liveChangeFlag` | `false` | 목록 편집 중에도 `liveChange` 를 보냄 |

`augmentedDisplay: 'dialog'` 를 주면 `...` 버튼이 팝업 대신 `Dialog` (OK / Cancel) 를 엽니다 (`dialogOptions` 의 `title`, `icon`, `width` (기본 200), `height` (기본 240), `modalFlag`). 이 두 키는 [semantics](/tweakers/api/semantics#공통-tweakerbase) 의 공통 키입니다.

### 화면

- `inline`: 값이 `["a","b"]`, `[10,20,30]` 같은 글자로 보입니다. 이 글자를 직접 고쳐 Enter 를 쳐도 됩니다 (`valueType` 으로 바꿔서 넣음). `...` 버튼을 누르면 `std` 목록이 팝업(높이 176px)으로 열립니다.
- `std`: 행마다 항목 편집기가 있고, 선택하거나 마우스를 올린 행에 `+` (아래에 추가) / `-` (삭제) 버튼이 나옵니다. 끌어서 순서를 바꿀 수 있고 Delete 키는 선택 행 삭제, 위 / 아래 키는 이동, F2 는 편집 시작 / 끝입니다. 비어 있으면 "Click here to add items" 를 누르면 첫 항목이 생깁니다.
- 읽기 전용이면 `+` / `-` 열이 숨고 항목도 읽기 모양입니다. 타입 배열은 길이를 바꿀 수 없어 `+` / `-` 와 끌기가 늘 막힙니다.

### 이벤트

| 이벤트 | 시점 |
| --- | --- |
| `change` | 한 줄 글자를 확정할 때. 팝업은 닫힐 때 값이 처음과 다르면 한 번. 다이얼로그는 OK 를 눌러 값이 바뀌었을 때 (`e.options` 는 새 값) |
| `liveChange` | 팝업 / 다이얼로그를 연 채 항목을 바꿀 때 (`e.options` 는 지금 배열) |
| `cancelEdit` | 다이얼로그를 Cancel 이나 닫기로 닫을 때 |

::: warning 항목 타입이 맞지 않으면 빈 배열이 됩니다
값을 넣을 때 항목마다 `valueType` 검사를 하고, 하나라도 틀리면 `value` 를 `[]` 로 바꿉니다. 기본 `valueType` 이 `'string'` 이라서 `new TweakerArray({ value: [1, 2, 3] })` 는 빈 배열이 됩니다. 숫자는 `'number'` / `'integer'` 를 줍니다. `'integer'` 는 `1.5` 를 받지 않습니다. `'date'` 는 항목이 **문자열**이어야 하고 (`Date` 객체면 빈 배열), 목록에서 새로 추가한 날짜 항목도 `Date.toString()` 문자열로 들어갑니다.
:::

::: tip 타입 이름으로 만들 때
`factory.generateView(v, { typePath: 'array' })` 처럼 타입 이름으로 만들면 `valueType` 기본값이 `'auto'` 가 되어 위 검사에 잘 걸리지 않습니다. 항목 타입을 정하려면 `typePath: 'array<integer>'` 로 씁니다 ([typePath 문법](/tweakers/custom-type#typepath-문법)). 2026 에서 숫자 항목이고 브라우저의 소수점이 `,` 인 언어면 한 줄 글자의 구분자가 `;` 로 바뀝니다.
:::

## TweakerVector

`DS/Tweakers/TweakerVector`. 길이가 정해진 숫자 배열(좌표, 크기)을 칸마다 SpinBox 로 편집합니다. 부모는 [TweakerRange](#tweakerrange) 입니다. 타입 이름 `vector2` (x, y), `vector3` (x, y, z), `vector4` (x, y, z, t).

```js
require(['DS/Tweakers/TweakerVector'], function (TweakerVector) {
  var pos = new TweakerVector({
    definition: ['X', 'Y', 'Z'],
    units: 'mm',
    value: [10, 0, 5]
  }).inject(document.getElementById('pos'));
  pos.addEventListener('change', function (e) {
    console.log(e.dsModel.value.slice());
  });
});
```

### 속성

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `definition` | `['x', 'y']` | 칸 이름 배열. 길이가 칸 수. 바꾸면 칸을 더하거나 빼고 값 길이도 맞춤 |
| `value` | `undefined` | 숫자 배열 |
| `units` | `''` | 모든 칸 숫자 뒤의 단위 |
| `displayStyle` | `'spinBoxes'` | `spinBoxes` 하나 |
| `stepValue` <Badge type="warning" text="2026" /> | `0.1` | 칸마다 증감 단위 |

- 값은 `definition` 길이에 맞춰집니다. 짧으면 앞에서부터 되풀이해 채우고 (`[1, 2]` → 3칸이면 `[1, 2, 1]`), 길면 자릅니다. 숫자 하나(`3`)는 `[3, 3, 3]`, 문자열 `'[1,2,3]'` 은 JSON 으로 읽습니다.
- 칸 하나를 바꿀 때마다 `change` 가 옵니다.
- 읽기 전용이어도 SpinBox 모양 그대로이고 비활성(`disabled`)만 됩니다.

::: warning value 배열을 그 자리에서 고칩니다
칸을 바꾸면 새 배열을 만들지 않고 지금 `value` 배열의 그 칸만 바꿉니다. `change` 에서 받은 배열을 그대로 보관하면 다음 편집 때 같이 바뀌므로 `slice()` 로 복사해 둡니다. 2025 에는 `stepValue` 가 칸에 전달되지 않아 SpinBox 기본 증감을 씁니다.
:::

## TweakerFile

`DS/Tweakers/TweakerFile`. 파일 하나(또는 여러 개)를 고르는 칸입니다. 화면은 [FilePicker](/controls/input-controls#filepicker) 를 그대로 씁니다. 타입 이름 `file`.

```js
require(['DS/Tweakers/TweakerFile'], function (TweakerFile) {
  var file = new TweakerFile({
    placeholder: '도면 파일',
    fileTypes: '.pdf,.dwg',
    allowResetToUndefinedByUIFlag: true
  }).inject(document.getElementById('file'));
  file.addEventListener('change', function (e) {
    var f = e.dsModel.value;
    console.log(f ? f.name : '없음');
  });
});
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | `undefined` | `File`, 여러 파일이면 `FileList` |
| `displayStyle` | `'filePicker'` | `filePicker` 하나 |
| `placeholder` | `undefined` | 빈 칸 안내 글자 |
| `fileTypes` | `undefined` | 파일 창의 `accept` (`'.xml'`, `'image/*'`) |
| `allowMultipleFiles` | `false` | 여러 파일 (2026 에서 없어짐, 아래 참고) |
| `allowResetToUndefinedByUIFlag` | `false` | 지우기 버튼 |
| `dropOptions` | `undefined` | FilePicker 의 끌어 놓기 설정 |

- 파일을 고르거나 놓거나 지우면 `change` 가 옵니다. 같은 파일 객체를 다시 넣으면 아무 일도 없습니다.
- 읽기 전용은 파일 이름 글자입니다.
- `File` / `FileList` 가 아닌 값(파일 이름 문자열 등)이나 `allowMultipleFiles` 와 맞지 않는 값은 화면에 반영되지 않습니다.
- DocumentCommonInfra 는 툴바 / 폼 항목 `{ typeRepresentation: 'file', value: files[0], onNodeUpdate: function (t) { ... t.value.name ... } }` 로 씁니다.

::: warning 2026 은 allowMultipleFiles 대신 allowMultipleValuesFlag
2026 에서 `allowMultipleFiles` 속성이 없어지고 공통 키 `allowMultipleValuesFlag` 로 여러 파일을 정합니다. 2025 코드의 `allowMultipleFiles: true` 는 2026 에서 무시되어 한 파일만 고르게 되고, `FileList` 값도 받지 않습니다. 두 버전에서 모두 쓰려면 두 키를 같이 넣습니다.
:::

## TweakerImage

`DS/Tweakers/TweakerImage`. 값을 이미지로만 보여 줍니다 (편집 없음). 타입 이름 `image`. 앱에서는 그리드 아이콘 컬럼에 씁니다 (ENXNav, ENOXAlternateSubstitute: `typeRepresentation: 'image'` + `getCellValue` 가 아이콘 경로를 돌려줌).

```js
{ text: '', dataIndex: 'thumb', width: '41px', typeRepresentation: 'image' }
```

- `value` 는 `DS/Utilities/Dom.generateIcon` 이 받는 값입니다. `.` 이 들어 있거나 `data:image`, `blob:` 이면 이미지 경로로, 아니면 글꼴 아이콘 이름으로 봅니다. `{ iconPath }`, `{ iconName, fontIconFamily }` 객체도 됩니다.
- 값이 비면 이미지를 뗍니다. `displayStyle` 은 `simple` 하나이고 읽기 / 편집 모양이 같습니다. 셀 안쪽 여백이 0 입니다.

## TweakerBlob

`DS/Tweakers/TweakerBlob`. 파일 내용을 data URL 문자열로 다룹니다. 업로드 버튼을 누르거나 파일을 칸에 끌어 놓으면 그 파일을 `FileReader.readAsDataURL` 로 읽어 `value` 에 넣습니다. 타입 이름 `blob`.

```js
require(['DS/Tweakers/TweakerBlob'], function (TweakerBlob) {
  var attach = new TweakerBlob({ placeholder: '첨부 파일을 끌어 놓으세요' })
    .inject(document.getElementById('attach'));
  attach.addEventListener('change', function (e) {
    var t = e.dsModel;
    console.log(t.value ? t.value.substring(0, 40) : '', t.blob);
  });
});
```

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `value` | - | `'data:<mime>;base64,...'` 문자열 |
| `blob` | `undefined` | `value` 에서 만든 `Blob`. 직접 넣으면 비동기로 읽어 `value` 를 채움 |
| `placeholder` | `''` | 파일이 없을 때 글자 |
| `displayStyle` | `'label'` | `label` (글자 칸 + 업로드 버튼, 끌어 놓기) |

- 칸에는 고른 파일 이름이 보입니다. 화면에서 고르지 않고 코드로 넣은 값은 이름을 몰라 `No name` 으로 보입니다. 읽기 전용도 같은 글자입니다.
- 끌어 놓기는 첫 파일만 받습니다. 파일 종류는 거르지 않습니다.
- 파일 이름을 읽는 공개 속성은 없습니다 (VCXWebGUI 는 내부 키로 읽음).

::: warning value 를 넣을 때마다 change 가 옵니다
TweakerBlob 은 값 비교 없이 `value` 가 바뀔 때마다 `change` 를 보냅니다. 코드로 넣은 값도, `blob` 을 넣어 비동기로 채워진 값도 `change` 가 옵니다. 막으려면 [편집기 단독 사용](/tweakers/standalone#이벤트) 의 `fireOnlyFromUIInteractionFlag` 나 `disableEvents()` 를 씁니다.
:::

## TweakerMultiRep

`DS/Tweakers/TweakerMultiRep`. [TweakerArray](#tweakerarray), [TweakerObjectBase](#tweakerobjectbase) 의 부모입니다. 직접 쓰지 않습니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `displayStyle` | `'inline'` | `inline`: 값 글자(`TweakerString`) + `...` 버튼. `std`: 펼친 편집 화면 |
| `liveChangeFlag` | `false` | 펼친 편집 화면 안의 입력에도 `liveChange` |

- `...` 버튼은 `augmentedDisplay` 가 `'popup'` (기본) 이면 버튼 아래 `Popup`, `'dialog'` 이면 OK / Cancel `Dialog` 를 엽니다. 팝업 / 다이얼로그 안은 같은 클래스를 `displayStyle: 'std'` 로 만든 편집기입니다.
- 읽기 전용이면 값이 비었거나 글자가 칸에 다 들어갈 때 `...` 버튼을 숨깁니다.

## TweakerObjectBase

`DS/Tweakers/TweakerObjectBase`. 객체의 속성을 이름 / 값 두 열의 `TreeListView` 로 보여 주고 편집하는 편집기들([TweakerObject](#tweakerobject), [TweakerUWAObject](#tweakeruwaobject), [TweakerWUXAbstract](#tweakerwuxabstract))의 부모입니다. 각 속성의 값 칸은 그 속성 타입의 편집기를 `inlinedTemplate` 으로 만들어 넣습니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `editorTitle` | `'Object Editor'` | 다이얼로그 제목 |
| `configuration` | `undefined` (만들면 `{}`) | 속성 경로별 설정 `{ 'a.b': { type, readOnly, uiDisplay, label, defaultValue, semantics: { icon } } }`. `type` 은 그 속성 편집기의 타입 이름, `uiDisplay: false` 는 숨김 |
| `recursionDepth` | `0` | 하위 객체를 펼쳐 보이는 깊이. `0` 이면 하위 객체를 펼치지 않음 |
| `hierarchyCriteria` | `'category'` | 속성을 묶는 기준. `'flat'` 이면 묶지 않음 |
| `permanentReadOnly` | `true` | 편집기가 `readOnly` 일 때 속성 편집기도 모두 읽기 전용 |
| `displayMode` | `'twoColumns'` | `'twoColumns'` (이름 / 값 열) 또는 `'oneColumn'` (한 칸에 이름 위, 편집기 아래) |
| `labelDisplay` | `'left'` | 이름 정렬. `'left'` / `'right'` |
| `typeDisplayFlag` | `false` | 속성 타입 이름 열을 보임 |
| `uiOptions` | `{ height: 'inherit', maxHeight: '100%', rootMargin: 7 }` | 안쪽 `TreeListView` 옵션에 합쳐짐 |
| `authoringFlag` | `false` | 속성 추가(`+ Add property`) / 삭제 / 타입 바꾸기 열을 보임 |
| `authoringFilters` | `undefined` | 저작 모드에서 고를 수 있는 타입 목록 |
| `failureCapture` / `onFailure` | `true` / - | 속성 편집기를 만들지 못했을 때 `onFailure(err)` 호출 |

- 속성의 편집기 타입은 `configuration[경로].type` 이고, 없으면 값의 종류(`string`, `number`, `boolean`, `date`, `object` ...)로 정해집니다.
- 저작 모드에서 속성을 더하거나 지우면 `change` 가 오고 `e.options` 에 `{ propertyChangeName, propertyChangePath }` 가 들어 있습니다.
- 속성 값을 바꿀 때 안쪽 속성 편집기의 `change` 가 위로 올라오며, 이때 `e.options` 가 `{ propertyChangePath, propertyChangeName, propertyChangeValue }` 로 바뀌어 나오는 것으로 보입니다 <Badge type="danger" text="검증 필요" />.

## TweakerObject

`DS/Tweakers/TweakerObject`. 일반 자바스크립트 객체용입니다. 타입 이름 `object` 는 `std` 모양에 `filter: { mode: 'standard', parameters: { matchingRegexp: '^[^_]', displayChainOfPrototypes: 1 } }` (밑줄로 시작하는 속성 숨김, 프로토타입 체인 표시)가 미리 들어 있습니다. 그리드 셀(`objectinline`)은 `inline` 모양입니다.

```js
require(['DS/Tweakers/TypeRepresentationFactory'], function (TypeRepresentationFactory) {
  var factory = new TypeRepresentationFactory();
  factory.generateView({ name: 'Bolt', qty: 4, released: true }, {
    typePath: 'object',
    readOnly: true
  }).then(function (tweaker) {
    tweaker.inject(document.getElementById('props'));
  });
});
```

CollectionView, Tree 의 기본 `onRightViewRequest` 가 이 형태(`typePath: 'object', readOnly: true`)로 노드의 `grid` 데이터를 보여 줍니다.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `filter` | `{ mode: 'standard', parameters: { matchingRegexp: '', displayFunctions: true, displayChainOfPrototypes: false } }` | 보일 속성 고르기 |

| `filter.mode` | 보이는 속성 |
| --- | --- |
| `'standard'` | `matchingRegexp` 에 맞는 이름. `displayFunctions: false` 면 함수 속성 제외, `displayChainOfPrototypes` 면 프로토타입의 속성도 |
| `'noneExcept'` | `parameters.exceptions` 배열에 있는 이름만 |
| `'allExcept'` | `parameters.exceptions` 에 있는 이름 빼고 전부 |
| 함수 | `filter.mode.call(tweaker)` 가 돌려준 속성 정의 배열 |

- `__` 로 시작하는 이름과 `constructor` 는 늘 숨깁니다. `configuration[경로].uiDisplay` 가 있으면 필터보다 먼저 봅니다.
- 화면에서 바꾼 값은 지금 `value` 객체에 그 자리에서 씁니다 (`a.b` 경로면 하위 객체까지).
- `configuration` 에만 있고 값에 없는 경로도 빈 속성으로 보입니다.

## TweakerUWAObject

`DS/Tweakers/TweakerUWAObject`. UWA 클래스 인스턴스용 [TweakerObject](#tweakerobject) 입니다. 타입 이름 `uwaObject` 는 `filter.mode: 'onlyOptions'` 로 `value.options` 의 속성만 보입니다. `defaultOptions`, `elements` 속성은 늘 숨깁니다. 값을 바꾸면 `value[이름]` 이 있으면 그곳에, 없으면 `value.options[이름]` 에 쓰고 `change` 를 보냅니다.

## TweakerWUXAbstract

`DS/Tweakers/TweakerWUXAbstract`. WebUX 컨트롤(`DS/Controls/*`) 인스턴스의 `publishedProperties` 를 속성 목록으로 보여 줍니다 (`uiDisplay: false` 인 속성 제외). 타입 이름 `typedObject`. 값을 바꾸면 컨트롤의 그 속성에 넣고 `change` 를 보냅니다.

## TweakerRange

`DS/Tweakers/TweakerRange`. `stepValue` 속성 하나를 더한 중간 부모입니다 ([TweakerVector](#tweakervector), TweakerNumber, TweakerDate 가 상속). 바꾸면 화면 모듈의 `setStepValue` 를, 없으면 안쪽 컨트롤의 `stepValue` 를 바꿉니다. 자체 `VIEW_MODULES` 는 비어 있어 직접 쓰지 않습니다.

## TweakerVariant

`DS/Tweakers/TweakerVariant`. 값의 타입을 사용자가 고르게 하는 편집기입니다. 톱니 아이콘 콤보(`TweakerEnum` `comboLite`)로 타입을 고르면 그 타입 이름으로 편집기를 새로 만들어 옆에 붙입니다. 타입 이름 `variant`.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| `valueTypes` | `undefined` | 고를 수 있는 타입 이름. <code>'string&#124;integer&#124;boolean'</code> 처럼 <code>&#124;</code> 로 구분한 문자열 |
| `currentType` | `undefined` | 지금 타입 이름. 콤보로 고르면 바뀜 |
| `displayStyle` | `'editors'` | `editors` (콤보 + 편집기). 읽기 전용은 편집기만 읽기 모양 |

- 타입을 바꿔 편집기가 새로 만들어지면 `currentTypeChange` 이벤트가 옵니다. 지금 값을 새 편집기에 넣어 보고 그 편집기의 값으로 `value` 를 맞춥니다.
- 안쪽 편집기의 `change` / `liveChange` 는 막고 이 편집기의 이벤트로 다시 보냅니다.

## TweakerParameter

`DS/Tweakers/TweakerParameter`. TweakerNumber 를 상속한 스핀박스로 `stepValue` 기본값이 `1` 입니다. 타입 이름 `parameterEditor`. 입력 칸에 친 글자를 그대로 보여 주고, 편집이 끝날 때(`onPostEdit`) 마지막으로 친 글자를 `value` 에 넣습니다. 그래서 숫자가 아닌 문자열이 `value` 가 될 수 있습니다.

## TweakerLayout

`DS/Tweakers/TweakerLayout`. 목록 / 타일 같은 보기 전환 아이콘 버튼입니다. 타입 이름 `layout`. `possibleValues` 가 있으면 누를 때 메뉴(`CheckItem`)가 펼쳐집니다. 고르면 2025 는 항목 객체 `{ value, label, icon }`, 2026 은 항목의 `value` 문자열이 `value` 가 됩니다. 사용법과 `TypeEnums.Layout` 값은 [GeneratedToolbar 의 보기 전환](/tweakers/generated-toolbar#보기-전환-layout-typeenums) 에 있습니다.

| displayStyle | 화면 |
| --- | --- |
| `layoutModes` | 아이콘만 (`possibleValues` 없을 때) |
| `layoutModes_hasPossibleValues` | 지금 값의 아이콘 + 메뉴 |

## TweakerTreeNodeModel

`DS/Tweakers/TweakerTreeNodeModel`. `TreeNodeModel` 을 트리 셀 모양(연결선, 펼침, 아이콘, 라벨)으로 그리는 편집기입니다. 타입 이름 `DS/TreeModel/TreeNodeModel`, `DS/Tree/TreeNodeModel` 이 이 편집기로 연결됩니다. 라벨을 한 번 누른 뒤 300ms 넘게 지나 다시 누르면 라벨 편집으로 바뀌고, 편집 결과는 노드 `label` 로 들어갑니다. Tree / DataGridView 내부용입니다.

## TweakerParentTreeNodeModel

`DS/Tweakers/TweakerParentTreeNodeModel`. 부모 노드의 보이는 자식들을 아이콘 줄(`clickableIcons`)로 그리는 편집기입니다 (자식의 첫 아이콘). 아이콘에 마우스를 올리면 그 자식이 미리 선택(preselect)되고, 누르면 그 자식이 선택됩니다 (Shift 는 범위 선택). 타입 이름 `parentTreeNodeModel`. 그리드의 선택 처리에서 부르는 `managePreselection(e)`, `manageSelection(e, ctrl, cellInfos)` 메서드가 있습니다. 내부용입니다.

## TypeEnums

`DS/Tweakers/TypeEnums`. `Layout` 하나를 내보냅니다. 각 항목은 `Object.freeze` 된 `{ value, label, icon }` 입니다. 키와 값 목록은 [GeneratedToolbar 의 보기 전환](/tweakers/generated-toolbar#보기-전환-layout-typeenums) 표와 같고 2025 / 2026 이 같습니다.

```js
require(['DS/Tweakers/TypeEnums'], function (TypeEnums) {
  var modes = [TypeEnums.Layout.DataGridView, TypeEnums.Layout.SmallTile];
  console.log(modes[0].value);
});
```

## TypeUtils

`DS/Tweakers/TypeUtils`. 정적 함수 두 개입니다. DataGridView (정렬 아이콘), WUXAutoComplete 가 씁니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| `getSortingIconDefinition(typeName, directory, 'asc' 또는 'desc')` | `{ iconName, fontIconFamily }` | 타입의 `semantics.numeric` 이 true 면 숫자 정렬 아이콘, `string` / `user` / `url` 이면 글자 정렬 아이콘, 그 밖은 일반 정렬 아이콘 (Font Awesome) |
| `doesTypeRepresentationHandleIcon(name)` | boolean | `url`, `clickableLabel`, `user`, `detailedUser`, `detailedInfo` 이면 true (값 안에 아이콘을 직접 그리는 타입) |

2026 은 `directory` 를 생략할 수 있습니다 (2025 는 생략하면 오류).

## TweakerUtils

`DS/Tweakers/TweakerUtils`. 정적 함수 모음이며 대부분 `_` 로 시작하는 내부 함수입니다. 쓸 만한 것은 아래뿐입니다.

| 함수 | 설명 |
| --- | --- |
| `getTypePath(name)` | 등록된 타입 이름 / enum 이름으로 `{ path: 편집기 모듈 경로, options: semantics }` 를 돌려줌. enum 이면 `path` 가 `DS/Tweakers/TweakerEnum`, `options` 가 enum 값 |
| `getCompleteContext(tweaker)` <Badge type="warning" text="2026" /> | `{ dsModel, context }`. `context` 는 `executionContext` 복사본이며, 그 안 `executionContext.getNodesXSO` 가 있으면 `context.selectedNodes` 를 채움 |

TweakersEx, TweakerAbstractMagnitude 가 쓰는 내부 함수(값 글자 + `...` 버튼 + 펼침 팝업 묶음 만들기)는 2026 에서 [TweakerViewUtils](#내부용-모듈) 로 옮겨졌고, TweakerUtils 에도 같은 이름이 남아 있습니다.

## TypeRepresentationDirectory

`DS/Tweakers/TypeRepresentationDirectory`. 타입 이름, 템플릿, enum 을 담는 저장소입니다. 보통은 [TypeRepresentationFactory](/tweakers/api/type-representation-factory) 를 통해 쓰고, 저장소는 `factory.options.directory` 로 꺼냅니다. 모듈을 불러오면 전역 저장소 하나가 만들어지고 기본 타입(`defaultTypeRepresentations.json`), 템플릿(`typeTemplates.json`), enum `allSupportedTypes` (등록된 모든 타입 / enum 이름을 정렬한 목록)가 들어갑니다.

| 메서드 | 설명 |
| --- | --- |
| `new TypeRepresentationDirectory({ preLoadTemplates, parentDirectory })` | 기본은 `preLoadTemplates: false`, `parentDirectory: 전역 저장소` |
| `TypeRepresentationDirectory.WebUXTypeRepresentationDirectory` (static) | 전역 저장소 |
| `registerTypeRepresentations(obj 또는 JSON 문자열)` / `getRegisteredTypeRepresentation(name)` | 타입 등록 / 조회 |
| `getAllRegisteredTypeRepresentationNames()` | 이 저장소에 등록된 타입 이름 (부모 제외) |
| `registerEnumerations({ 이름: 값 })` / `getRegisteredEnumeration(name)` | enum 여러 개 등록 / 조회 |
| `registerTemplates(obj)` / `getRegisteredTemplate(id)` | 템플릿 등록 / 조회. `path` 없는 항목, 이미 있는 id 는 버림 |
| `setPreLoadTemplates(flag)` / `getNumberOfTemplatesToRequire()` | 템플릿 모듈 미리 불러오기 / 아직 안 불러온 수 |
| `getModelEvents()` | `templatesRequired` 이벤트를 내는 ModelEvents |
| `destroy()` | 부모 연결을 끊고 목록에서 뺌 |

`registerTypeRepresentations` 와 `registerEnumerations` 는 같은 이름이 있으면 합칩니다(`merge`). 2025 는 생성할 때 부모 저장소를 넣는 곳과 조회 함수가 보는 곳이 달라서, 자식 저장소에서 부모의 항목을 찾지 못합니다 ([TypeRepresentationFactory API 2026 차이](/tweakers/api/type-representation-factory#_2026-버전-차이) 참고).

## StringViewModules

`DS/Tweakers/StringViewModules`. TweakerString 의 화면 모듈 클래스 모음입니다. [편집기를 직접 만들 때](/tweakers/custom-tweaker#화면-모듈) 이미 있는 화면을 다시 쓰려고 불러옵니다.

```js
require(['DS/Tweakers/TweakerBase', 'DS/Tweakers/StringViewModules'], function (TweakerBase, StringViewModules) {
  var MyTweaker = TweakerBase.inherit({ name: 'myTweaker' });
  MyTweaker.prototype.baseViewModule = StringViewModules.Base;
  MyTweaker.prototype.VIEW_MODULES = {
    edition: { classObject: StringViewModules.LineEditorDotsEditor, options: { viewOptions: { displayPopupOnCreation: true } } }
  };
});
```

위는 EPSSchematicsUI 의 UIStringTweaker 와 같은 형태입니다.

| 내보내는 이름 | TweakerString 에서 쓰는 displayStyle |
| --- | --- |
| `Base` | 모든 화면 모듈의 부모 |
| `LineEditor` | `lineEditor`, `password`, `link`, `tag` |
| `ComboBox` | `combo`, `lineEditor_hasPossibleValues` |
| `SelectionChipsEditor` | `lineEditor_allowMultipleValues`, `tag_allowMultipleValues` |
| `Icon` / `IconWithPossibleValues` | `icon` / `icon_hasPossibleValues` (TweakerLayout 도 씀) |
| `ButtonGroup` | `buttonGroup`, `toggleGroup` |
| `ColorPicker` / `ColorSquare` | `color` / `color_readOnly` |
| `Editor` | `editor`, `editorVerticallyResizable` |
| `LineEditorDotsEditor` | `editorInline`, `editor2Inline`, `editorVerticallyResizableInline` (한 줄 + `...` 로 여러 줄 편집) |
| `StringDotsEditor` | `editorInline_readOnly` |
| `Label` | `tag_readOnly` |

## URLObjectViewModules

`DS/Tweakers/URLObjectViewModules`. TweakerURLObject 의 화면 모듈 모음입니다. 내보내는 이름은 `Base`, `ClickableLabel` (읽기 전용 링크), `LineEditor` (`clickableLabel`, `user` 편집), `Editor` (`clickableLabelBlock` 편집), `SearchableLink` (`searchableLink`), `ClickableDetailed` (`detailedUser` 등 읽기 전용) 입니다. TweakersEx 가 이것으로 다른 편집기를 만듭니다.

## 내부용 모듈

앱에서 직접 부르지 않는 모듈입니다.

| 모듈 | 하는 일 |
| --- | --- |
| `DS/Tweakers/DurationViewModules` | TweakerDuration 의 기간 화면(`DatePickers`) |
| `DS/Tweakers/AbstractMagnitudeViewModules` | TweakerAbstractMagnitude 의 길이 화면(`Editors`, `DivDotsEditors`) |
| `DS/Tweakers/CustomTreeNodeViewTweaker` | TweakerObjectBase 의 속성 목록 행 모양과 부모 / 자식 값 갱신 |
| `DS/Tweakers/ModelProxy` | 속성 정의 배열을 TreeDocument 로 바꾸는 필터 (`hierarchyFilter`, `modelToTreeDocument` 등) |
| `DS/Tweakers/TweakerViewUtils` <Badge type="warning" text="2026" /> | 2025 TweakerUtils 의 화면 함수(묶음 보기, 한 줄 편집기, 팝업, 다이얼로그 만들기와 `enableLiveChangeOnTreeListView`)를 옮겨 온 모듈 |

## 2026 버전 차이

| 항목 | 내용 |
| --- | --- |
| `TweakerFile.allowMultipleFiles` | 없어짐. 공통 `allowMultipleValuesFlag` 로 여러 파일을 정함 |
| `TweakerVector.stepValue` | 새 키 (기본 `0.1`). 2025 는 칸에 증감 단위가 전달되지 않음 |
| 타입 이름 `magnitude` | 템플릿 id 가 `magnitude` / `inlineMagnitude` 에서 `customMagnitude` / `inlineCustomMagnitude` 로 바뀜. 타입 이름 `customMagnitude` 추가. 편집기와 displayStyle 은 같음 |
| TweakerDuration 읽기 글자 | 날짜를 `DS/Utilities/DateUtils.formatDateToString` 으로 씀 (2025 는 TweakerDate 의 `month: 'short'` 형식) |
| 길이 / 물리량 숫자 표시 | `NumberUtils.formatNumberToString` 으로 언어별 소수점을 씀 (2025 는 `toFixed`) |
| TweakerArray 한 줄 글자 | 숫자 항목이고 소수점이 `,` 인 언어면 구분자 `;` |
| `TypeUtils.getSortingIconDefinition` | `directory` 생략 가능 |
| `TweakerUtils.getCompleteContext` | 새 함수 |
| `TweakerViewUtils` | 새 모듈 (TweakerUtils 의 화면 함수 이동) |
| TweakerLayout 메뉴 선택 | `value` 가 항목 객체 대신 항목의 `value` 문자열 |
