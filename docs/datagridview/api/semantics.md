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
Tweakers.js 의 TweakerBase / TweakerString / TweakerNumber / TweakerDate / TweakerBoolean publishedProperties, 편집기별 setViewOptions 허용 키 목록
:::

## 공통 (TweakerBase)

| 키 | 타입 | 기본값 | 대상 타입 | 설명 |
| --- | --- | --- | --- | --- |
| <code>possibleValues</code> | <code>array</code> | - | 콤보, 버튼그룹, 토글아이콘 | 선택 목록. ['A','B'] 또는 [{ label, value, icon }] |
| <code>allowMultipleValuesFlag</code> | <code>boolean</code> | <code>false</code> | 콤보 | 멀티 선택 (값은 배열) |
| <code>viewOptions</code> | <code>object</code> | - | 전체 | 편집기 화면(view) 옵션. 편집기별로 허용 키가 다름 ([viewOptions](#viewoptions) 참고) |
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

## viewOptions

`semantics.viewOptions` 에 넣는 키입니다. 편집기마다 허용 키 목록이 고정되어 있어, 목록에 없는 키는 화면 컨트롤에 전달되지 않습니다.

```js
semantics: {
  allowMultipleValuesFlag: true,
  viewOptions: { multipleValuesSeparator: ',' }
}
```

| 키 | 타입 | 기본값 | 대상 편집기 | 설명 |
| --- | --- | --- | --- | --- |
| <code>multipleValuesSeparator</code> | <code>string</code> | <code>'&#124;'</code> | 멀티 값 (allowMultipleValuesFlag) | 멀티 값 화면 표시 구분자. 앞뒤 공백이 자동으로 붙어 ',' → "A , B" 로 표시 |
| <code>maxLength</code> | <code>number</code> | <code>-1</code> | 문자열 (한 줄, 확장 편집기) | 최대 입력 길이. -1 은 제한 없음 |
| <code>resizableFlag</code> | <code>boolean</code> | <code>false</code> | 문자열 (여러 줄) | 입력 칸 크기 조절 허용 |
| <code>newLineMode</code> | <code>string</code> | <code>'shiftEnter'</code> | 문자열 (여러 줄) | 줄바꿈 입력 키 |
| <code>uniqueValue / customValidator / selection</code> | - | 컨트롤 기본값 | 문자열 (확장 편집기) | 확장 편집기 컨트롤에 전달 |
| <code>onDrop</code> | <code>function</code> | - | 문자열 (한 줄, 여러 줄) | 드롭 처리. 2026 버전부터 |
| <code>showWeekNumbers</code> | <code>boolean</code> | - | 날짜 | 달력에 주차 표시 |
| <code>hideTodayOrNowButton</code> | <code>boolean</code> | <code>false</code> | 날짜 | 오늘/현재 버튼 숨김. 2026 버전부터 |
| <code>enableSearchFlag</code> | <code>boolean</code> | <code>true</code> | 콤보 | 목록 검색 |
| <code>mainElementVisibleFlag</code> | <code>boolean</code> | <code>true</code> | 콤보 | 메인 요소 표시 |
| <code>expanderIcon</code> | <code>string</code> | <code>'expand-down'</code> | 콤보 | 펼침 아이콘 |
| <code>customValidator</code> | <code>function</code> | - | 숫자 | 입력값 검증 함수 |
| <code>customFormatter</code> | <code>function</code> | - | 숫자 | 표시 문자열 변환 함수. 문자열을 반환하면 그 값으로 표시 |
| <code>externallyDriven</code> | <code>boolean</code> | - | 숫자 | 값을 숫자로 변환하지 않고 그대로 설정 |
| <code>bigIcon</code> | <code>boolean</code> | - | 함수 (버튼) | 큰 아이콘 |
| <code>showLabelFlag / labelPosition</code> | <code>boolean / string</code> | <code>true / 'bottom'</code> | 함수 (버튼) | 라벨 표시 / 위치. 2026 버전부터 |
| <code>descriptionHeight / orientation</code> | - | - | URL | 설명 영역 높이 / 배치 방향. 2026 버전부터 |

::: tip 내부 키
`displayStyle`(불리언), `controlType`(문자열 버튼), `identifier` 는 소스에서 `viewOptions` 로 읽지만 Tweakers 가 편집기 등록 시 직접 채우는 값입니다. 모양 지정은 `semantics.displayStyle` 을 사용합니다.
:::

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
