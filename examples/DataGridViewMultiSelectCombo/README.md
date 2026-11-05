# DataGridView 컬럼에 멀티 셀렉트 콤보박스 넣기

`webapps_enovia2026.zip`을 분석해 정리한 방법과 예제입니다.

## 기존 소스에 적용하기 (한 컬럼만)

이미 만들어진 그리드라면 inject가 끝난 뒤라도 아래 한 줄만 추가하면 됩니다.

```js
define("...", [
  // ...기존 의존성
  "DS/MyApp/MultiSelectComboColumn",
], function (/* ...기존 인자, */ MultiSelectComboColumn) {
  // 공통 모듈에서 받은 grid
  MultiSelectComboColumn.apply(grid, "disciplines", [
    { label: "기계", value: "MECH" },
    { label: "전기", value: "ELEC" },
  ], { placeholder: "선택" });
});
```

- `"disciplines"` 자리에 적용할 컬럼의 `dataIndex`를 넣습니다. 그 컬럼만 바뀌고 다른 컬럼은 그대로입니다.
- 셀 값(`nodeModel.options.grid[dataIndex]`)은 **배열**이어야 합니다. 예: `["MECH", "ELEC"]`
- 옵션(선택): `placeholder`, `enableSearchFlag`(기본 `true`), `editionPolicy`(기본 `"EditionOnClick"`)

`apply`는 내부에서 두 가지를 합니다.
1. 그리드의 `getTypeRepresentationFactory()`에 템플릿과 타입을 등록합니다. 이 그리드에만 적용됩니다.
2. `grid.columns`를 복사해서 해당 컬럼만 바꾼 다음 다시 대입합니다.
   zip 안의 `EngineeringItemCmd.js`, `CfgBaseUX.js`, `ConfiguratorPanel.js`도 이미 생성된 그리드의 컬럼을 이 방식으로 다시 설정합니다.
   기존 컬럼에 있던 함수 옵션(`getCellValue` 등)은 유지됩니다.

## 파일

| 파일 | 내용 |
|---|---|
| `MultiSelectComboColumn.js` | **기존 그리드의 한 컬럼에 적용하는 헬퍼** (`apply`) |
| `MultiSelectComboTweaker.js` | 셀 편집기(Tweaker) 본체. 편집할 때는 `ComboBox(multiSelFlag)`, 평소에는 "라벨1, 라벨2" 텍스트 |
| `MultiSelectComboGridSample.js` | 공통 모듈이 만든 그리드를 받아 `apply`하는 흐름의 예제 |

## 근거 (zip 분석)

1. **ComboBox 자체가 멀티 셀렉트를 지원합니다.**
   `DS/Controls/ComboBox`의 `multiSelFlag: true`를 쓰면 `value`가 선택한 값들의 배열이 됩니다.
   실제 사용 예는 `ParameterizationSkeleton.js`입니다.
2. **기본 `enumCombo`에서 멀티 셀렉트를 켜는 옵션은 찾지 못했습니다.**
   `DS/Tweakers` 프레임워크 소스는 zip에 들어 있지 않습니다.
3. 그래서 **커스텀 Tweaker를 typeRepresentation으로 등록**하는 방식을 씁니다.
   `EPSSchematicsUI`가 같은 구조를 씁니다(`EPSSchematicsUIValueTypeComboTweaker.js`, `EPSSchematicsUITypeTemplates.json`).
4. **inject 이후에 등록해도 됩니다.**
   `CharacteristicsGridViewManager.js`가 inject한 다음에 `registerTypeTemplates`를 호출합니다.

## lodash

`define`에서 `"DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig"`를 받아 `_`로 사용합니다.
이 모듈이 lodash 전체 객체를 반환한다고 가정했습니다. 해당 모듈이 zip에 없어 직접 확인하지는 못했습니다.

## 적용 시 주의

- `define("DS/MyApp/...")`의 모듈 이름은 실제 위젯 모듈 경로에 맞게 바꾸세요.
  `MultiSelectComboColumn.js` 안의 `TWEAKER_PATH`도 함께 바꿔야 합니다.
- 기존 컬럼에 `getCellSemantics`가 있으면 그 값이 셀 단위 semantics로 우선 적용될 수 있습니다.
- 이 예제는 zip 소스를 분석해 작성했고, 실제 3DEXPERIENCE 환경에서 실행해 보지는 않았습니다.
