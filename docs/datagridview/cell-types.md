# 셀 타입 <Badge type="tip" text="서버 확인" />

::: warning 2026-11-12 수정
로컬 실행으로 다시 확인하다가 두 가지를 고쳤습니다. 여러 개 선택은 `customEnumMember` 가 아니라 `string` 타입으로 만들어야 하고, 링크(`url`) 값은 문자열이 아니라 `{ label, url }` 객체여야 보입니다. 샘플 `02_cellTypes.html` 도 같이 고쳤습니다.
:::

컬럼의 `typeRepresentation` 으로 셀 모양과 편집기를 정합니다. 편집하려면 `editableFlag: true` 를 같이 넣습니다.

샘플: [02_cellTypes.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/02_cellTypes.html)

## 한눈에 보기

| 원하는 셀 | typeRepresentation | 셀 값 | 추가 설정 |
| --- | --- | --- | --- |
| 텍스트 | `string` (기본) | 문자열 | - |
| 여러 줄 텍스트 | `multilineString` | 문자열 | - |
| 콤보박스 (하나 선택) | `customEnumMember` | 문자열 | `semantics.possibleValues` |
| 여러 개 선택 (칩) | `string` | 문자열 배열 | `semantics.possibleValues`, `semantics.allowMultipleValuesFlag: true` |
| 버튼 그룹 | `customSmallEnumMember` | 문자열 | `semantics.possibleValues` |
| 프로그레스 바 (편집 가능하면 슬라이더) | `progress` | 0~100 숫자 | `semantics.minValue / maxValue / stepValue` |
| 체크박스 | `boolean` | true / false | `editionPolicy: 'EditionOnOver'` 권장 |
| 날짜 | `date` (시간까지는 `datetime`) | Date 객체 | - |
| 정수 | `integer` | 숫자 | `semantics.minValue / maxValue` |
| 실수 | `float` (또는 `double`) | 숫자 | `semantics.units` 로 단위 표시 |
| 색상 | `color` | `'#rrggbb'` 를 넣으면 보이고, 편집 뒤 값은 `#` 없는 `'rrggbb'` | - |
| 링크 | `url` | `{ label: '표시 글자', url: '주소' }` 객체 (문자열은 빈 칸) | - |

전체 목록은 [typeRepresentation](/datagridview/api/type-representation), 세부 설정은 [semantics](/tweakers/api/semantics) 에 있습니다.

## 콤보박스 (하나 선택)

```js
{
  text: '상태', dataIndex: 'status',
  typeRepresentation: 'customEnumMember',
  editableFlag: true,
  editionPolicy: 'EditionOnClick',
  semantics: {
    possibleValues: ['작업중', '검토중', '승인', '폐기']
  }
}
```

`possibleValues` 는 문자열 배열 또는 `{ label: '표시값', value: '저장값' }` 배열 모두 됩니다.

## 여러 개 선택 (칩)

```js
{
  text: '담당자', dataIndex: 'owners',
  typeRepresentation: 'string',
  editableFlag: true,
  editionPolicy: 'EditionOnClick',
  semantics: {
    possibleValues: ['김철수', '이영희', '박민수', '최지훈'],
    allowMultipleValuesFlag: true,
    viewOptions: { multipleValuesSeparator: ',' }
  }
}
```

- 셀 값은 배열로 저장됩니다 (예: `['이영희', '박민수']`).
- 셀을 누르면 오른쪽에 `...` 버튼이 생기고, 그 버튼을 누르면 고른 값이 칩으로 보이는 편집기와 목록이 열립니다.
- `customEnumMember` (하나 선택 콤보)에 `allowMultipleValuesFlag` 를 주면 화면 표시는 되지만, 편집기가 하나만 고르는 콤보라서 편집하면 값이 배열이 아니라 문자열 하나로 바뀝니다 (로컬 실행 확인). 자세한 차이는 [편집기 종류별 사용법](/tweakers/editors).
- 화면에 보이는 구분자는 `viewOptions.multipleValuesSeparator` 로 바꿉니다. 기본은 `|` 입니다.

::: info 근거
Tweakers.js 의 TweakerBase.getStringFromValue. 구분자 앞뒤에 항상 공백을 붙이므로 `','` 를 주면 `김철수 , 이영희` 로 표시됩니다.
:::

## 버튼 그룹

선택지가 적을 때 콤보 대신 씁니다. 라디오 버튼처럼 하나만 고릅니다.

```js
{
  text: '우선순위', dataIndex: 'priority',
  typeRepresentation: 'customSmallEnumMember',
  editableFlag: true,
  editionPolicy: 'EditionOnOver',
  semantics: { possibleValues: ['높음', '보통', '낮음'] }
}
```

## 프로그레스 바

```js
{
  text: '진행률', dataIndex: 'progress',
  typeRepresentation: 'progress',
  editableFlag: true,
  semantics: { minValue: 0, maxValue: 100, stepValue: 5 }
}
```

## 체크박스

```js
{ text: '승인', dataIndex: 'approved', typeRepresentation: 'boolean', editableFlag: true, editionPolicy: 'EditionOnOver' }
```

`EditionOnOver` 로 두면 클릭 한 번에 바로 토글됩니다.

## 날짜, 숫자

```js
{ text: '납기', dataIndex: 'dueDate', typeRepresentation: 'date', editableFlag: true },
{ text: '수량', dataIndex: 'qty', typeRepresentation: 'integer', editableFlag: true, semantics: { minValue: 0, maxValue: 999 } },
{ text: '중량', dataIndex: 'weight', typeRepresentation: 'float', editableFlag: true, semantics: { units: 'kg' } }
```

날짜 셀 값은 문자열이 아니라 `Date` 객체로 넣습니다.

## 색상, 링크, 여러 줄 텍스트

```js
{ text: '색상', dataIndex: 'color', typeRepresentation: 'color', editableFlag: true },
{ text: '링크', dataIndex: 'url', typeRepresentation: 'url' },
{ text: '비고', dataIndex: 'note', typeRepresentation: 'multilineString', editableFlag: true }
```

## 행마다 다른 타입이나 목록

컬럼 하나에서 행마다 셀 타입이나 콤보 목록이 달라야 하면 컬럼 함수 `getCellTypeRepresentation`, `getCellSemantics` 를 씁니다. 예제는 [컬럼 함수](/datagridview/cell-functions) 가이드, 전체 목록은 [컬럼 함수 레퍼런스](/datagridview/api/column-functions) 에 있습니다.

```js
{
  text: '값', dataIndex: 'value', editableFlag: true,
  getCellTypeRepresentation: function (cellInfos) {
    return cellInfos.nodeModel.options.grid.kind === 'N' ? 'integer' : 'string';
  }
}
```

## 편집한 값 읽기

셀을 편집하면 행(TreeNodeModel)의 값이 바로 바뀝니다.

```js
treeDocument.getRoots().forEach(function (node) {
  console.log(node.options.label, node.getAttributeValue('status'));
});
```
