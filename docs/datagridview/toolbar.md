# 툴바

그리드 위에 검색창, 콤보, 버튼을 놓는 툴바입니다. DataGridView 에는 툴바용 생성자 옵션이 없고 `grid.setToolbar(JSON)` 으로만 만듭니다.

샘플: [03_toolbar.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/03_toolbar.html), [ToolbarActions.js](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/ToolbarActions.js)

::: info 근거
DataGridView.js 의 setToolbar, Tweakers.js 의 GeneratedToolbar
:::

## 툴바 만들기

`setToolbar` 가 툴바 객체를 돌려주면, 그 화면 요소(`getContent()`)를 원하는 위치에 붙입니다.

```html
<div id="toolbar"></div>
<div id="grid"></div>
```

```js
var toolbar = grid.setToolbar({
  entries: [
    {
      id: 'searchPartNo',
      position: 'near',
      dataElements: {
        typeRepresentation: 'string',
        label: '품번 검색',
        placeholder: '품번 입력 후 Enter',
        value: ''
      },
      onNodeUpdate: { module: 'DS/MyModule/ToolbarActions', func: 'searchByPartNo' }
    },
    {
      id: 'statusFilter',
      position: 'near',
      dataElements: {
        typeRepresentation: 'customEnumMember',
        label: '상태',
        value: '전체',
        possibleValues: ['전체', '작업중', '검토중', '승인', '폐기']
      },
      onNodeUpdate: { module: 'DS/MyModule/ToolbarActions', func: 'filterByStatus' }
    },
    {
      id: 'addRow',
      position: 'far',
      dataElements: {
        typeRepresentation: 'functionIcon',
        label: '추가',
        tooltip: '행 추가',
        icon: { iconName: 'plus', fontIconFamily: 1 },
        action: { module: 'DS/MyModule/ToolbarActions', func: 'addRow' }
      }
    }
  ]
});
document.getElementById('toolbar').appendChild(toolbar.getContent());
```

## entries 항목

항목 하나가 툴바 칸 하나입니다.

| 키 | 설명 |
| --- | --- |
| `id` | 항목 고유 id |
| `position` | `'near'` (왼쪽, 기본) / `'far'` (오른쪽) |
| `dataElements.typeRepresentation` | `'functionIcon'` (아이콘 버튼), `'string'` (입력칸), `'customEnumMember'` (콤보) 등 |
| `dataElements.label` / `tooltip` | 글자 / 툴팁 |
| `dataElements.displayLabel` | 라벨 글자를 같이 보일지 |
| `dataElements.icon` | `{ iconName: 'plus', fontIconFamily: 1 }` (1 = 3DS 폰트 아이콘) |
| `dataElements.value` | 입력칸, 콤보의 초기값 |
| `dataElements.possibleValues` | 콤보 목록 |
| `dataElements.action` | 버튼 클릭 시 호출 `{ module, func }` |
| `onNodeUpdate` | 입력칸, 콤보 값이 바뀔 때 호출 `{ module, func }` |

전체 키는 [툴바 (setToolbar)](/datagridview/api/toolbar) 에 있습니다.

## 동작 모듈 만들기

`action` 과 `onNodeUpdate` 는 함수를 직접 받지 않고 **AMD 모듈 이름 + 함수 이름** 으로 연결합니다. 툴바가 `require` 로 모듈을 불러서 함수를 호출합니다.

```js
define('DS/MyModule/ToolbarActions', ['DS/TreeModel/TreeNodeModel'], function (TreeNodeModel) {
  'use strict';

  return {
    addRow: function (e) {
      var grid = e.context.executionContext;
      grid.treeDocument.addRoot(new TreeNodeModel({ label: 'NEW', grid: { title: '신규 부품' } }));
    },

    searchByPartNo: function (e) {
      var keyword = (e.context.value || '').toLowerCase();
      var treeDocument = e.context.executionContext.treeDocument;
      treeDocument.prepareUpdate();
      treeDocument.getRoots().forEach(function (node) {
        if (String(node.options.label).toLowerCase().indexOf(keyword) > -1) {
          node.show();
        } else {
          node.hide();
        }
      });
      treeDocument.pushUpdate();
    }
  };
});
```

- `DS/MyModule/ToolbarActions` 는 AmdLoader 규칙상 `webapps/MyModule/ToolbarActions.js` 로 찾습니다.
- 로더가 먼저 묶음 파일(`MyModule/MyModule.js`)을 찾고, 없으면 콘솔에 `Concatenated module ... not found` info 를 남긴 뒤 개별 파일을 로드합니다. 정상 동작입니다.

### 함수 인자 e

| 키 | 내용 |
| --- | --- |
| `e.context.executionContext` | 툴바를 만든 DataGridView (`grid.setToolbar` 를 호출한 객체) |
| `e.context.toolbar` | 툴바 |
| `e.context.nodeModel` | 클릭되거나 값이 바뀐 툴바 항목 |
| `e.context.value` | 툴바 항목의 현재 값 (검색어, 콤보 선택값 등) |

## 선택된 행 다루기

선택 정보는 TreeDocument 가 가지고 있습니다.

```js
deleteSelected: function (e) {
  var treeDocument = e.context.executionContext.treeDocument;
  var selectedNodes = treeDocument.getSelectedNodes();
  treeDocument.prepareUpdate();
  selectedNodes.forEach(function (node) {
    treeDocument.removeRoot(node);
  });
  treeDocument.pushUpdate();
}
```
