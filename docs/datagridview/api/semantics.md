---
title: semantics
---

# semantics

컬럼 `semantics` 또는 컬럼 함수 `getCellSemantics` 의 반환값에 넣는 키입니다. 편집기(Tweaker)에 그대로 전달되는 세부 옵션입니다.

```js
{
  text: '수량', dataIndex: 'qty', typeRepresentation: 'integer', editableFlag: true,
  semantics: { minValue: 0, maxValue: 999 }
}
```

::: info 근거
Tweakers.js 의 TweakerBase / TweakerString / TweakerNumber / TweakerDate / TweakerBoolean publishedProperties
:::

## 공통 (TweakerBase)

| 키 | 타입 | 기본값 | 대상 타입 | 설명 |
| --- | --- | --- | --- | --- |
| <code>possibleValues</code> | <code>array</code> | - | 콤보, 버튼그룹, 토글아이콘 | 선택 목록. ['A','B'] 또는 [{ label, value, icon }] |
| <code>allowMultipleValuesFlag</code> | <code>boolean</code> | <code>false</code> | 콤보 | 멀티 선택 (값은 배열) |
| <code>viewOptions.multipleValuesSeparator</code> | <code>string</code> | <code>'&#124;'</code> | 멀티 값 (allowMultipleValuesFlag) | 멀티 값 화면 표시 구분자. 앞뒤 공백이 자동으로 붙어 ',' → "A , B" 로 표시. 예: semantics: { allowMultipleValuesFlag: true, viewOptions: { multipleValuesSeparator: ',' } } |
| <code>viewOptions</code> | <code>object</code> | - | 전체 | 편집기 화면(view) 옵션. multipleValuesSeparator 외에 displayStyle, controlType 등 편집기별 화면 옵션 |
| <code>allowFreeInputFlag</code> | <code>boolean</code> | <code>false</code> | 콤보 | 목록에 없는 값 직접 입력 허용 |
| <code>minValue / maxValue</code> | <code>number&#124;Date</code> | - | 숫자, 날짜 | 최소 / 최대 |
| <code>placeholder</code> | <code>string</code> | - | 문자열 | 빈 칸 안내 문구 |
| <code>readOnly</code> | <code>boolean</code> | <code>false</code> | 전체 | 읽기 전용 |
| <code>displayStyle</code> | <code>string</code> | 타입별 | 전체 | 편집기 모양을 직접 지정 ([typeRepresentation](/datagridview/api/type-representation) displayStyle 값) |
| <code>valueType</code> | <code>string</code> | - | 전체 | 값 형식 (예: 'integer', 'enumCustom') |
| <code>alignment</code> | <code>string</code> | - | 전체 | 'near' &#124; 'center' &#124; 'far' |
| <code>emphasize</code> | <code>any</code> | - | 전체 | 강조 표시 |
| <code>backgroundColor</code> | <code>string</code> | - | 전체 | 배경색 |
| <code>icon</code> | <code>string&#124;object</code> | - | 전체 | 아이콘 |
| <code>escapeHTML</code> | <code>boolean</code> | <code>false</code> | 문자열 | HTML 이스케이프 |
| <code>allowResetToUndefinedByUIFlag</code> | <code>boolean</code> | - | 전체 | 값 비우기 허용 |
| <code>referenceValue / showReferenceValueFlag</code> | <code>any / boolean</code> | <code>- / false</code> | 전체 | 기준값과 비교 표시 |
| <code>editorTitle / dialogOptions / augmentedDisplay</code> | - | <code>'' / - / 'popup'</code> | 전체 | 확장 편집 팝업 설정 |

## 문자열 (TweakerString)

| 키 | 타입 | 기본값 | 대상 타입 | 설명 |
| --- | --- | --- | --- | --- |
| <code>pattern</code> | <code>string</code> | - | <code>string</code> | 입력 패턴 |
| <code>requiredFlag</code> | <code>boolean</code> | - | <code>string</code> | 필수 입력 |
| <code>autoCorrectFlag</code> | <code>boolean</code> | - | <code>string</code> | 자동 보정 |
| <code>minLengthBeforeSearch / typeDelayBeforeSearch / keepSearchResultsFlag</code> | <code>number / number / boolean</code> | - | 검색형 콤보 | 입력하며 검색하는 콤보 설정 |

## 숫자 (TweakerNumber)

| 키 | 타입 | 기본값 | 대상 타입 | 설명 |
| --- | --- | --- | --- | --- |
| <code>stepValue</code> | <code>number</code> | <code>0.1</code> | 숫자 | 증감 단위 |
| <code>decimals</code> | <code>number</code> | <code>5</code> | 숫자 | 소수 자릿수 |
| <code>units</code> | <code>string</code> | <code>''</code> | 숫자 | 단위 표시 (예: 'kg', '%') |
| <code>colorFrom / colorTo</code> | <code>string</code> | <code>'#000' / '#fff'</code> | <code>colorSlider</code> | 슬라이더 색 범위 |

## 날짜 (TweakerDate)

| 키 | 타입 | 기본값 | 대상 타입 | 설명 |
| --- | --- | --- | --- | --- |
| <code>timePickerFlag</code> | <code>boolean</code> | <code>false</code> | <code>date</code> | 시간 선택 추가 |
| <code>timePickerPrecision</code> | <code>string</code> | <code>'min'</code> | <code>date, time</code> | 'min' &#124; 'sec' (시간 정밀도) |

## 불리언 (TweakerBoolean)

| 키 | 타입 | 기본값 | 대상 타입 | 설명 |
| --- | --- | --- | --- | --- |
| <code>label</code> | <code>string</code> | <code>''</code> | <code>boolean</code> | 체크박스 옆 글자 |
| <code>possibleValues</code> | <code>array</code> | - | <code>customBoolean</code> | [{ value: true, icon: 'eye' }, { value: false, icon: 'eye-off' }] |
