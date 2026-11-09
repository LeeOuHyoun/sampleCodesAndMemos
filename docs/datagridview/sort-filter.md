# 정렬과 필터

샘플: [04_sortFilter.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/04_sortFilter.html)

## 화면 조작

| 조작 | 동작 |
| --- | --- |
| 헤더 클릭 | 정렬 (오름차순 → 내림차순 → 원래 순서) |
| <kbd>Ctrl</kbd> + 헤더 클릭 | 다중 정렬 |
| 헤더의 필터 아이콘 또는 우클릭 메뉴 | 컬럼 필터 |

## 처음 열 때 정렬

그리드 옵션 `sortModel` 에 정렬 조건을 넣습니다. 배열 순서가 정렬 우선순위입니다.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  sortModel: [
    { dataIndex: 'status', sort: 'asc' },
    { dataIndex: 'progress', sort: 'desc' }
  ],
  sortOptions: { maxSortedColumnsCount: 3 }
});
```

`sortOptions.maxSortedColumnsCount` 는 동시에 정렬할 수 있는 최대 컬럼 수입니다.

## 실행 중 정렬 바꾸기

`sortModel` 은 속성이라 값을 넣으면 바로 다시 정렬됩니다. 빈 배열은 정렬 해제입니다.

```js
grid.sortModel = [{ dataIndex: 'dueDate', sort: 'asc' }];
grid.sortModel = [];
```

## 사용자 정의 정렬

문자 순서가 아니라 업무 순서로 정렬할 때 컬럼에 `compareFunction` 을 넣습니다.

```js
var PRIORITY_ORDER = { '높음': 1, '보통': 2, '낮음': 3 };

{
  text: '우선순위', dataIndex: 'priority',
  compareFunction: function (a, b) {
    return (PRIORITY_ORDER[a] || 99) - (PRIORITY_ORDER[b] || 99);
  }
}
```

- 인자: `(값A, 값B, 행A, 행B, dataIndex)`
- 음수 = A 가 앞, 양수 = B 가 앞, 0 = 같음
- 내림차순일 때는 그리드가 결과에 -1 을 곱해 줍니다.

정렬에 쓸 값이 표시값과 다르면 `getCellValueForSort(nodeModel, dataIndex)` 를 씁니다 ([컬럼 함수](/datagridview/api/column-functions)).

## 정렬 금지

```js
{ text: '비고', dataIndex: 'note', sortableFlag: false }
```

## 필터

필터는 그리드 옵션이 아니라 **TreeDocument** 에 지정합니다. 여기서 지정한 컬럼만 헤더에 필터 기능이 생깁니다.

```js
treeDocument.setFilterModel({
  label: { filterId: 'stringRegexp' },
  title: { filterId: 'string' },
  status: { filterId: 'set' },
  progress: { filterId: 'numberWithCondition' },
  qty: { filterId: 'number' },
  dueDate: { filterId: 'date' }
});
```

::: warning
- 키는 컬럼의 `dataIndex` 입니다. 단, 첫 트리 컬럼(`dataIndex: 'tree'`)은 `label` 로 지정합니다.
- 데이터를 넣는 `prepareUpdate()` ~ `pushUpdate()` 사이에서 지정해도 됩니다.
:::

| filterId | 필터 화면 |
| --- | --- |
| `string` | 문자열 포함 검색 |
| `stringRegexp` | 문자열 검색 (정규식/와일드카드). ENOVIA 앱에서 가장 많이 사용 |
| `set` | 값 목록 체크박스. 콤보 성격의 컬럼에 적합 |
| `number` | 숫자 범위 |
| `numberWithCondition` | 숫자 조건 (=, &gt;, &lt; 등) |
| `date` | 날짜 범위 |
| `dateWithCondition` | 날짜 조건 |

전체 목록과 사용 빈도는 [필터 (filterId)](/datagridview/api/filter) 에 있습니다.
