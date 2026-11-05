# DataGridView 컬럼에 멀티 셀렉트 콤보박스 넣기

`webapps_enovia2026.zip`을 분석해 정리한 방법과 예제입니다.

## 핵심 정리

1. **ComboBox 자체가 멀티 셀렉트를 지원합니다.**
   `DS/Controls/ComboBox`(`Controls/Controls.js`)의 `multiSelFlag: true`를 쓰면 됩니다.
   이때 `value`는 `elementsList`에 있는 `value`들의 **배열**입니다.
   실제 사용 예는 `ParameterizationSkeleton.js`의 `uiobject === "multiselcombobox"`입니다.
2. **기본 `enumCombo` 템플릿에서 멀티 셀렉트를 켜는 옵션은 찾지 못했습니다.**
   zip에서 `semantics`에 `multiSelFlag`를 넣은 사례가 없었습니다.
   `DS/Tweakers` 프레임워크 소스는 zip에 들어 있지 않아 내부 구현은 확인할 수 없었습니다.
3. 그래서 **커스텀 Tweaker를 만들어 typeRepresentation으로 등록**하는 방식을 씁니다.
   이 방식은 `EPSSchematicsUI`가 실제로 쓰는 구조와 같습니다.
   - `EPSSchematicsUI/tweakers/EPSSchematicsUIValueTypeComboTweaker.js`
   - `EPSSchematicsUI/assets/EPSSchematicsUITypeTemplates.json`: 템플릿 이름과 모듈 경로를 연결
   - `EPSSchematicsUI/assets/EPSSchematicsUIBaseTypes.json`: `stdTemplate`과 `semantics`를 지정
   - `EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem.js`: 컬럼에 `typeRepresentation: "valueTypeCombo"` 지정

## 흐름

```
grid.getTypeRepresentationFactory()
  .registerTypeTemplates({ multiSelectComboTemplate: { path: "DS/MyApp/MultiSelectComboTweaker" } })
  .registerTypeRepresentations({ multiSelectCombo: { stdTemplate: "multiSelectComboTemplate",
                                                     semantics: { possibleValues: [...] } } })

columns: [{ dataIndex: "disciplines", typeRepresentation: "multiSelectCombo",
            editableFlag: true, editionPolicy: "EditionOnClick",
            getCellSemantics: (cell) => ({ possibleValues: ... }) }]   // 셀별 선택지(선택 사항)
```

`semantics`의 키(`possibleValues`, `placeholder`, `enableSearchFlag`)는 Tweaker의 `publishedProperties`로 그대로 전달됩니다.

## 파일

| 파일 | 내용 |
|---|---|
| `MultiSelectComboTweaker.js` | Tweaker 본체. 편집 모드는 `ComboBox(multiSelFlag)`, 읽기 모드는 "라벨1, 라벨2" 텍스트 |
| `MultiSelectComboGridSample.js` | DataGridView 생성, 타입 등록, 컬럼 설정 예제 |

## 적용 시 주의

- `define("DS/MyApp/...")`의 모듈 이름은 실제 위젯 모듈 경로에 맞게 바꾸세요.
- 셀 값(`grid.disciplines`)은 **배열**로 저장하세요. 예: `["ELEC", "SW"]`
- 이 예제는 zip 소스를 분석해 작성했고, 실제 3DEXPERIENCE 환경에서 실행해 보지는 않았습니다.
  `DS/Tweakers/TweakerBase`의 세부 동작(예: `setTweakerValue`)은 EPSSchematicsUI 코드와 같은 방식으로 사용했습니다.
