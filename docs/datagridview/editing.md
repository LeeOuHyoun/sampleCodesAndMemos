# 편집

셀을 편집하려면 컬럼에 `editableFlag: true` 를 넣습니다. 편집기가 **언제** 열리는지는 `editionPolicy` 로 정합니다.

```js
{ text: '품명', dataIndex: 'title', editableFlag: true, editionPolicy: 'EditionOnClick' }
```

::: info 근거
DataGridView.getEditionManager, CollectionView.js 의 edition/* 클래스
:::

## editionPolicy

| editionPolicy 값 | 편집 시작 | 편집기 표시 | 추천 용도 | 비고 |
| --- | --- | --- | --- | --- |
| <code>EditionOnDoubleClick</code> | 셀 더블클릭 (또는 F2, 글자 입력) | 편집 중에만 | 일반 텍스트/숫자 | 기본값 |
| <code>EditionOnClick</code> | 셀 한 번 클릭 | 편집 중에만 | 콤보박스, 날짜 | 클릭 즉시 편집기가 열림 |
| <code>DelayedEditionOnClick</code> | 이미 선택된 셀을 다시 클릭 → 500ms 후 | 편집 중에만 | 선택과 편집을 구분해야 할 때 | 더블클릭하면 편집 취소. 탐색기의 "이름 바꾸기" 와 비슷 |
| <code>EditionOnOver</code> | 마우스를 셀 위에 올리기 | 마우스가 올라가 있는 동안 | 체크박스, 버튼그룹, 토글 아이콘 | 클릭 한 번으로 값이 바뀌어야 하는 컨트롤에 적합 |
| <code>EditionInPlace</code> | 항상 | 항상 (모든 셀에 편집기가 떠 있음) | 설정 화면 같은 작은 표 | 행이 많으면 느려질 수 있음 |

## 편집 관련 컬럼 옵션

| 키 | 값 | 설명 |
| --- | --- | --- |
| `editableFlag` | `true` / `false` (기본) | false 면 editionPolicy 를 넣어도 편집되지 않습니다 |
| `disabled` | `true` / `false` | 컬럼 전체 비활성 |
| `liveUpdateFlag` | `true` / `false` | 입력 중(liveChange)에도 값을 바로 데이터에 반영 |
| `allowResetToUndefinedByUIFlag` | `true` / `false` | 사용자가 값을 비울(undefined) 수 있음 |

## 행마다 편집 가능 여부 다르게

`getCellEditableState` 가 false 를 돌려주면 그 셀은 편집되지 않습니다. `editableFlag: true` 인 컬럼에서만 동작합니다.

```js
{
  text: '품명', dataIndex: 'title', editableFlag: true,
  getCellEditableState: function (cellInfos) {
    return cellInfos.nodeModel.options.grid.status !== '승인';
  }
}
```

## 키보드 동작

그리드 옵션으로 정합니다. 자세한 내용은 [그리드 옵션](/datagridview/api/grid-options) 의 "편집 / 키보드" 묶음을 보세요.

```js
new DataGridView({
  treeDocument: treeDocument,
  columns: columns,
  editOnKeyPressFlag: true,
  focusNextEditableCellOnTabFlag: true,
  selectNextCellOnEnterFlag: true
});
```

## 편집 결과 받기

편집이 끝나면 행(TreeNodeModel)의 값이 바로 바뀝니다. 바뀐 순간에 무언가를 하려면 아래 셋 중 하나를 씁니다.

| 방법 | 언제 | 비고 |
| --- | --- | --- |
| 컬럼 `setCellValue(cellInfos, newValue)` | 편집 값을 데이터에 넣을 때 | 저장 방법을 직접 정합니다. 서버 저장에 적합 |
| `grid.addEventListener('postEdit', fn)` | 값이 바뀐 편집이 끝날 때 | `preEdit` 와 짝 |
| `treeDocument.onNodeModelUpdate(fn)` | 행 값이 바뀔 때 (편집, `updateOptions` 모두) | 어떤 경로로 바뀌든 한 곳에서 받기 |

```js
treeDocument.onNodeModelUpdate(function (e) {
  console.log(e.data.nodeModel.options.label, e.data.attributes);
});
```

서버에 저장하고 그 결과를 화면에 반영하는 방법은 [저장 후 화면 반영](/datagridview/save-and-reflect) 을 보세요.
