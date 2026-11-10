---
title: typeRepresentation
---

# typeRepresentation <Badge type="info" text="원본 분석" />

컬럼의 `typeRepresentation` 에 넣는 값으로, 셀 모양과 편집기 종류를 정합니다. "기본 semantics" 는 따로 넣지 않아도 적용되는 값입니다.

```js
{ text: '진행률', dataIndex: 'progress', typeRepresentation: 'progress', editableFlag: true }
```

::: info 근거
Tweakers/assets/defaultTypeRepresentations.json, typeTemplates.json
:::

::: tip
자주 쓰는 타입의 실제 컬럼 예제는 [셀 타입](/datagridview/cell-types) 가이드에 있습니다.
:::

## 문자열 / 선택

| typeRepresentation | 편집기(Tweaker) | displayStyle | 기본 semantics | 설명 |
| --- | --- | --- | --- | --- |
| <code>string</code> | <code>TweakerString</code> | <code>lineEditor</code> | - | 한 줄 텍스트 (기본) |
| <code>multilineString / editor / textBlock</code> | <code>TweakerString</code> | <code>editor</code> | - | 여러 줄 텍스트 |
| <code>password</code> | <code>TweakerString</code> | <code>password</code> | - | 비밀번호 |
| <code>customEnumMember</code> | <code>TweakerString</code> | <code>combo</code> | - | 콤보박스. semantics.possibleValues 필수, allowMultipleValuesFlag:true 면 멀티 |
| <code>customSmallEnumMember</code> | <code>TweakerString</code> | <code>buttonGroup</code> | - | 버튼 그룹 (라디오처럼) |
| <code>stringChoice</code> | <code>TweakerString</code> | <code>toggleGroup</code> | - | 토글 버튼 그룹 |
| <code>enumString / enumInteger / enumCustom / enumDyn</code> | <code>TweakerEnum</code> | <code>combo</code> | - | 등록된 enum 콤보 (registerEnum 필요) |
| <code>tag</code> | <code>TweakerString</code> | <code>tag</code> | - | 태그(칩) 표시 |
| <code>icon</code> | <code>TweakerString</code> | <code>icon</code> | - | 값을 아이콘 이름으로 표시 |
| <code>link</code> | <code>TweakerString</code> | <code>link</code> | - | 링크 모양 글자 |
| <code>regexp</code> | <code>TweakerString</code> | - | - | 정규식 입력 |
| <code>fontSize / side / alignment</code> | <code>TweakerString</code> | <code>combo</code> | 목록 내장 | 정해진 목록 콤보 |
| <code>horizontalAlignment / orientation</code> | <code>TweakerString</code> | <code>buttonGroup</code> | 목록 내장 | 정해진 목록 버튼그룹 |

## 숫자

| typeRepresentation | 편집기(Tweaker) | displayStyle | 기본 semantics | 설명 |
| --- | --- | --- | --- | --- |
| <code>integer</code> | <code>TweakerNumber</code> | <code>spinBox</code> | <code>stepValue 1, decimals 0</code> | 정수 스핀박스 |
| <code>number / float / double</code> | <code>TweakerNumber</code> | <code>spinBox</code> | - | 실수 스핀박스 |
| <code>numberLite</code> | <code>TweakerNumber</code> | <code>spinBoxLite</code> | - | 가벼운 스핀박스 |
| <code>int8 / uint8</code> | <code>TweakerNumber</code> | <code>slider</code> | 범위 내장 | 슬라이더 |
| <code>int16 / int32 / int64 / uint / uint16 / uint32 / uint64</code> | <code>TweakerNumber</code> | <code>spinBox</code> | 범위 내장 | 범위가 정해진 정수 |
| <code>boundedNumber</code> | <code>TweakerNumber</code> | <code>slider</code> | <code>0~100, step 1</code> | 슬라이더 |
| <code>percentage</code> | <code>TweakerNumber</code> | <code>slider</code> | <code>0~100, units '%'</code> | 퍼센트 슬라이더 |
| <code>progress</code> | <code>TweakerNumber</code> | <code>progress</code> | <code>0~100, units '%'</code> | 프로그레스 바 |
| <code>progressNoAnim</code> | <code>TweakerNumber</code> | <code>progressNoAnim</code> | <code>0~100, units '%'</code> | 애니메이션 없는 프로그레스 바 |
| <code>angle</code> | <code>TweakerNumber</code> | <code>spinBox</code> | <code>0~360, units 'deg'</code> | 각도 |
| <code>opacity</code> | <code>TweakerNumber</code> | <code>colorSlider</code> | <code>0~255</code> | 투명도 슬라이더 |
| <code>pagination</code> | <code>TweakerNumber</code> | <code>pagination</code> | - | 페이지 번호 |
| <code>magnitude</code> | <code>TweakerAbstractMagnitude</code> | <code>editors</code> | - | 단위가 있는 물리량 |

## 불리언

| typeRepresentation | 편집기(Tweaker) | displayStyle | 기본 semantics | 설명 |
| --- | --- | --- | --- | --- |
| <code>boolean / bool</code> | <code>TweakerBoolean</code> | <code>checkbox</code> | - | 체크박스 |
| <code>independantBoolean</code> | <code>TweakerBoolean</code> | <code>switch</code> | - | 스위치 |
| <code>radio</code> | <code>TweakerBoolean</code> | <code>radio</code> | - | 라디오 |
| <code>visibility</code> | <code>TweakerBoolean</code> | <code>toggleIcon</code> | 눈 아이콘 | 보이기/숨기기 아이콘 토글 |
| <code>lock</code> | <code>TweakerBoolean</code> | <code>toggleIcon</code> | 자물쇠 아이콘 | 잠금 아이콘 토글 |
| <code>customBoolean</code> | <code>TweakerBoolean</code> | <code>toggleIcon</code> | <code>possibleValues: []</code> | 아이콘 토글. possibleValues: [{ value: true, icon: '...' }, { value: false, icon: '...' }] |

## 날짜 / 시간

| typeRepresentation | 편집기(Tweaker) | displayStyle | 기본 semantics | 설명 |
| --- | --- | --- | --- | --- |
| <code>date</code> | <code>TweakerDate</code> | <code>date</code> | - | 날짜 (값: Date) |
| <code>datetime</code> | <code>TweakerDate</code> | <code>date + timePickerFlag</code> | - | 날짜 + 시간 |
| <code>time</code> | <code>TweakerDate</code> | <code>time</code> | <code>timePickerPrecision 'sec'</code> | 시간 |
| <code>dateRange</code> | <code>TweakerDuration</code> | <code>datePickers</code> | - | 기간(시작~끝) |
| <code>duration</code> | <code>TweakerDuration</code> | <code>editors</code> | - | 기간 길이 |

## 링크 / 사용자 / 기타

| typeRepresentation | 편집기(Tweaker) | displayStyle | 기본 semantics | 설명 |
| --- | --- | --- | --- | --- |
| <code>url / urlBlock</code> | <code>TweakerURLObject</code> | <code>clickableLabel(Block)</code> | - | 클릭 가능한 링크 |
| <code>user / detailedUser</code> | <code>TweakerURLObject</code> | <code>user</code> | - | 사용자 표시 |
| <code>detailedInfo / card</code> | <code>TweakerURLObject</code> | <code>detailedInfo / card</code> | - | 상세 정보 / 카드 |
| <code>color / colorAlpha</code> | <code>TweakerColor</code> | <code>colorpicker</code> | - | 색상 선택 ('#rrggbb') |
| <code>image</code> | <code>TweakerImage</code> | <code>simple</code> | - | 이미지 |
| <code>file / blob</code> | <code>TweakerFile / TweakerBlob</code> | - | - | 파일 |
| <code>function / functionIcon</code> | <code>TweakerFunction</code> | <code>button / buttonIcon</code> | - | 버튼 / 아이콘 버튼 (툴바에서 주로 사용) |
| <code>functionMenu / functionMenuIcon / functionMenuIconCount / chevronMenuIcon / threeDotsMenu</code> | <code>TweakerFunction</code> | menu 계열 | - | 메뉴 버튼 |
| <code>array / typedarray</code> | <code>TweakerArray</code> | <code>std</code> | - | 배열 |
| <code>vector2 / vector3 / vector4</code> | <code>TweakerVector</code> | - | - | 벡터 |
| <code>object / uwaObject / typedObject</code> | TweakerObject 계열 | <code>std</code> | - | 객체 |
| <code>variant / parameterEditor / layout / parentTreeNodeModel</code> | 각 Tweaker | - | - | 특수 용도 |
