# 사용자 뷰와 화면 상태 저장 <Badge type="tip" text="로컬 실행 확인" />

사용자가 바꾼 컬럼 너비, 순서, 표시 여부, 고정, 정렬을 저장해 두었다가 다음에 그리드를 열 때 되살리는 기능입니다. 그리드에 `identifier` 만 주면 그리드가 알아서 저장하고, 이름을 붙인 구성 여러 개("사용자 뷰")를 골라 쓰게 할 수도 있습니다.

샘플: [13_customViews.html](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/DataGridViewSample/13_customViews.html)

::: info 근거
DataGridView.js 의 DataGridViewLayout (`_saveDataInPreferences`, `_applyPreferencesOnColumns`, `getCurrentViewChanges`, `exportPreferencesInJson`, `importJsonPreferences`, `deleteDataGridViewPreferences`, `_hasValidIdentifier`), CustomViewsManager, DataGridViewCustomViewsDialog, DataGridViewContextualMenuBuilder (`_createFirstColumnsVisibilityContextualMenu`, `_createColumnsManagementContextualMenu`), DataGridView 의 `loadCustomViews` / `showCustomViewsDialog` / 정적 함수 `hasPreferences` / `importJsonPreferences`. CollectionView.js 의 `_postBuildView` (`preferencesToApply`). Utilities.js 의 Utils (`saveDataInPreferences`, `getDataInPreferences`, `deleteDataFromPreferences`). 호출부: ENXMeetingMgmt, ENORouteMgmt, IssueComponents (identifier + useWidgetPreferencesFlag + loadCustomViews), ENOXCAD_Save (userPreferencesChange + exportPreferencesInJson), ENXNav, FolderEditor (deleteDataGridViewPreferences), CATFLCockpitWidget, ENOXEngineer, ENOProjectMgmtCommonComponents (onCustomViewsSave). 샘플은 원본 webapps 파일을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 두 가지 방법

| | 화면 상태 자동 저장 | 사용자 뷰 |
| --- | --- | --- |
| 무엇인가 | 사용자가 마지막으로 바꿔 둔 상태 하나 | 이름을 붙인 컬럼 구성 여러 개 중 하나를 골라 적용 |
| 누가 만드나 | 그리드가 자동으로 (헤더를 끌거나 메뉴를 누를 때마다) | 사용자가 대화상자에서, 또는 앱이 `loadCustomViews` 로 |
| 담는 것 | 너비, 순서, 표시, 고정, 정렬, 행 그룹, 컬럼 그룹 펼침 | 너비, 순서, 표시, 고정, 정렬, 행 그룹, 밀도 |
| 필요한 것 | 그리드 옵션 `identifier` | 없음 (저장까지 하려면 `identifier` 또는 저장 콜백) |
| 저장 위치 | 브라우저 `localStorage`. `useWidgetPreferencesFlag: true` 면 위젯 설정 | 같은 곳의 `customViews` 키. 앱이 콜백으로 받아 서버에 저장할 수도 있음 |

둘은 따로 놀지 않습니다. 화면에 적용되는 값은 "현재 뷰의 값 위에, 그 뒤 사용자가 바꾼 값을 덮어쓴 것" 입니다 (`getCurrentViewChanges`).

## 어디에 넣나

```js{2-4,6,8,10,14-15}
var grid = new DataGridView({
  identifier: 'partList',
  useWidgetPreferencesFlag: true,
  customViewsOptions: { dialogMaximizedFlag: false },
  treeDocument: treeDocument,
  layoutOptions: { preferencesToApply: savedJson },
  columns: [
    { text: '품번', dataIndex: 'tree', alwaysVisibleFlag: true },
    { text: '품명', dataIndex: 'name' },
    { text: '비고', dataIndex: 'note', visibleFlag: false }
  ]
});

grid.addEventListener('userPreferencesChange', function () { });
grid.getCustomViewsManager().onCustomViewsSave = function (views, currentIdentifier) { };
```

1. **그리드 옵션** `identifier`, `useWidgetPreferencesFlag`, `customViewsOptions` : 설정 객체 최상위. 앞의 둘은 만들 때만 넣을 수 있습니다(readOnly).
2. **컬럼 옵션** `visibleFlag`, `alwaysVisibleFlag` : 처음 표시 여부와 "숨길 수 없는 컬럼".
3. **layoutOptions** `preferencesToApply` : 만들 때 한 번 적용할 상태(JSON 문자열).
4. **만든 뒤** : 이벤트 `userPreferencesChange`, 저장 콜백 `onCustomViewsSave`, `grid.layout` 의 꺼내기 / 넣기 함수.

## 무엇이 어디에 저장되나

### 저장 위치

저장 이름은 항상 `wux-collectionView-dataGridView` 입니다. 값은 JSON 문자열이고, 최상위 키가 그리드의 `identifier` 입니다. 그래서 그리드 여러 개가 한 이름을 나눠 씁니다.

| `useWidgetPreferencesFlag` | 저장하는 곳 |
| --- | --- |
| `false` (기본) | 브라우저 `localStorage` 의 `wux-collectionView-dataGridView` 항목 |
| `true` | 위젯 설정. `widget.setValue('wux-collectionView-dataGridView', 문자열)`. 설정 항목이 없으면 그리드가 `hidden` 타입으로 추가하므로 위젯 HTML 에 따로 선언하지 않아도 됨 |

- `true` 인데 `window.widget` 이 없으면 `localStorage` 에 저장합니다.
- `true` 로 바꾸기 전에 `localStorage` 에 남은 값이 있으면, 다음에 저장할 때 위젯 설정으로 옮기고 `localStorage` 에서 지웁니다.
- 읽을 때 위젯 설정에 그 `identifier` 의 값이 없으면 `localStorage` 를 읽습니다.
- 위젯 설정에 저장한 값은 대시보드가 위젯마다 보관하므로 다른 브라우저에서 열어도 유지되는 것으로 보입니다. <Badge type="danger" text="검증 필요" />

저장된 모습은 이렇습니다. 키는 바뀐 것만 생깁니다. 처음에는 항목 자체가 없고, 사용자가 품명 너비만 바꾸면 `{ "partList": { "columnsWidth": { "name": 241 } } }` 처럼 그 키 하나만 들어갑니다.

```json
{
  "partList": {
    "columnsWidth": { "name": 240 },
    "columnsVisibleFlag": { "note": true },
    "columnsPinnedState": { "tree": "left" },
    "pinnedColumnsOrder": { "tree": 0 },
    "unpinnedColumnsOrder": { "state": 0, "name": 1 },
    "columnsSortModel": [{ "dataIndex": "name", "sort": "asc" }],
    "customViews": [
      { "identifier": "DefaultConfiguration", "label": "기본 사양" },
      { "identifier": "CustomConfiguration1", "label": "사양 1", "columnsWidth": { "name": 300 } }
    ],
    "currentCustomViewId": "CustomConfiguration1"
  }
}
```

### 저장되는 키

| 키 | 내용 | 값의 형식 | 자동 저장 | 뷰 안 |
| --- | --- | --- | --- | --- |
| <code>columnsWidth</code> | 컬럼 너비 | <code>{ dataIndex: 숫자 &#124; 'auto' }</code> | O | O |
| <code>columnsVisibleFlag</code> | 컬럼 표시 여부 | <code>{ dataIndex: true &#124; false }</code> | O | O |
| <code>columnsPinnedState</code> | 컬럼 고정 | <code>{ dataIndex: 'left' &#124; 'right' &#124; 'unpinned' }</code> | O | O |
| <code>unpinnedColumnsOrder</code> | 고정 안 된 컬럼의 순서 | <code>{ dataIndex: 순번 }</code>. 고정 안 된 컬럼끼리 0 부터. 사용자가 옮긴 컬럼만 들어감 | O | O |
| <code>pinnedColumnsOrder</code> | 고정된 컬럼의 순서 | <code>{ dataIndex: 순번 }</code>. 같은 쪽에 고정된 컬럼끼리 0 부터 | O | O |
| <code>columnsSortModel</code> | 정렬 | <code>[{ dataIndex, sort: 'asc' &#124; 'desc' }]</code> | O | O |
| <code>groupingOptions</code> | 행 그룹 기준 | <code>{ dataIndexesToGroup: ['state'] }</code> | O | O |
| <code>columnGroupsExpandedStates</code> | 컬럼 그룹(children) 펼침 | <code>{ 'dataIndex_순번': 1 &#124; 0 }</code> | O | X |
| <code>layoutDensity</code> | 밀도 | <code>'compact' &#124; 'comfortable'</code> | X | O |
| <code>customViews</code> | 사용자 뷰 목록 | 뷰 객체 배열 ([뷰 하나의 키](#뷰-하나의-키)) | O | - |
| <code>currentCustomViewId</code> | 지금 적용된 뷰 | 뷰의 `identifier` | O | - |

### 언제 저장하고 언제 되살리나

| 시점 | 하는 일 |
| --- | --- |
| 헤더 경계를 끌어 너비를 바꿀 때, 메뉴의 "크기에 맞게 열 조정" | `columnsWidth` 저장 |
| 헤더를 끌어 순서를 바꿀 때 | `unpinnedColumnsOrder` / `pinnedColumnsOrder` 저장 |
| 메뉴에서 컬럼 표시를 체크하거나 풀 때 | `columnsVisibleFlag` 저장 |
| 메뉴의 "열 고정" | `columnsPinnedState` 와 순서 저장 |
| 헤더를 눌러 정렬할 때 | `columnsSortModel` 저장 |
| 행 그룹 영역(`grid.createGroupingUI()` 로 만든 칩)에서 그룹 기준을 바꿀 때 | `groupingOptions` 저장 |
| 컬럼 그룹을 펼치거나 접을 때 | `columnGroupsExpandedStates` 저장 |
| 뷰를 적용할 때 | 위 키들을 뷰의 값으로 바꿔 쓰고 `currentCustomViewId` 저장 |
| 그리드를 만들 때, `grid.columns` 를 다시 넣을 때 | 저장된 값을 읽어 컬럼에 적용 (`_applyPreferencesOnColumns`) |

코드로 바꾼 것은 저장하지 않습니다. `grid.layout.setColumnWidth('name', 300)` 은 화면만 바꿉니다. 저장까지 하려면 세 번째 인자로 `{ isUserInteraction: true }` 를 줍니다. `setColumnVisibleFlag`, `setColumnPinned`, `moveColumn` 도 같습니다.

<<< @/../DataGridViewSample/13_customViews.html#codeChange{js}

이미 화면이 300 이어도 `{ isUserInteraction: true }` 로 다시 부르면 그 값이 저장됩니다.

## 옵션과 함수

괄호 안이나 "사용" 칸의 숫자는 DataGridView 를 쓰는 앱 파일 119개 중 그 이름이 나오는 파일 수입니다.

### 옵션

| 넣는 자리 | 키 | 사용 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| 그리드 옵션 | <code>identifier</code> | - | <code>undefined</code> | 저장할 때 쓰는 그리드 이름. 문자열, 만들 때만 지정(readOnly). 없으면 저장도 복원도 안 함 |
| 그리드 옵션 | <code>useWidgetPreferencesFlag</code> | 13 | <code>false</code> | `true` 면 `localStorage` 대신 위젯 설정에 저장. 만들 때만 지정(readOnly) |
| 그리드 옵션 | <code>customViewsOptions</code> | 0 | <code>undefined</code> | <code>{ dialogMaximizedFlag: true }</code> 면 사용자 뷰 대화상자를 최대화로 엶. 키는 이것 하나 |
| layoutOptions | <code>preferencesToApply</code> | 0 | <code>undefined</code> | 만들 때 한 번 적용할 상태. `exportPreferencesInJson()` 이 돌려준 것과 같은 형식의 JSON 문자열. 만들 때만 지정(readOnly) |
| 컬럼 옵션 | <code>visibleFlag</code> | - | <code>true</code> | 처음 표시 여부. 저장된 `columnsVisibleFlag` 가 있으면 그 값이 우선 |
| 컬럼 옵션 | <code>alwaysVisibleFlag</code> | 23 | 없음 (2026 은 <code>false</code>) | `true` 면 사용자도 코드도 숨길 수 없는 컬럼 ([예제 7](#예제-7-숨길-수-없는-컬럼)) |

`preferencesToApply` 는 그리드가 만들어질 때 `layout.importJsonPreferences(값, { importCurrentCustomViewId: true })` 로 넘어갑니다. 받은 값을 먼저 저장소에 쓴 다음 적용하므로 `identifier` 가 있어야 합니다. `identifier` 와 함께 주면 그리드가 그 값으로 그려지고 `localStorage` 에도 저장됩니다. `identifier` 가 없으면 아무것도 적용되지 않습니다 (로컬 확인).

### 상태를 꺼내고 넣는 함수

`grid.layout` 에서 부릅니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>exportPreferencesInJson(options?)</code> | JSON 문자열 | 이 그리드의 저장값 전체 (1). `identifier` 키 아래의 객체만 돌려줌 (예: <code>{"columnsWidth":{"name":300}}</code>). <code>{ onlyCustomViewsFlag: true }</code> 를 주면 <code>{ customViews: [...] }</code> 만. 저장된 것이 없으면 `undefined` |
| <code>importJsonPreferences(json, options?)</code> | - | JSON 문자열을 저장소에 쓰고 바로 적용. options 는 아래 표 |
| <code>getCurrentViewChanges()</code> | 객체 | 지금 적용되는 값. 현재 뷰의 값에 저장된 값을 덮어쓴 결과. 키는 [저장되는 키](#저장되는-키) 와 같음 |
| <code>saveColumnSortModelInPreferences()</code> | - | 지금 정렬(`grid.sortModel`)을 `columnsSortModel` 로 저장 (5). 코드로 정렬을 바꾼 뒤 그것도 기억시킬 때 |
| <code>checkPresenceOfDataGridViewPreferences()</code> | <code>boolean</code> | 이 그리드의 저장값이 있는지 |
| <code>deleteDataGridViewPreferences()</code> | - | 이 그리드의 저장값 전체 삭제 (3). 뷰 목록도 같이 지워짐 |
| <code>deleteDataGridViewKeyPreference(key)</code> | - | 키 하나만 삭제. 예: `'columnsWidth'` |

`importJsonPreferences` 의 options:

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>importOnlyCustomViews</code> | <code>false</code> | `true` 면 `customViews` 만 받음 |
| <code>importCurrentCustomViewId</code> | <code>false</code> | `true` 여야 `currentCustomViewId` 도 받음 |

받은 `customViews` 는 지금 목록에 **더합니다**. `identifier` 가 같은 뷰가 이미 있으면 바꾸지 않습니다.

그리드를 만들기 전에 쓰는 정적 함수도 있습니다. `DataGridView` 는 `require` 로 받은 클래스입니다.

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>DataGridView.hasPreferences(identifier)</code> | <code>boolean</code> | 그 이름의 저장값이 있는지 (위젯 설정과 `localStorage` 를 모두 확인) |
| <code>DataGridView.importJsonPreferences(identifier, json)</code> | - | 그 이름의 저장값을 통째로 바꿔 씀 (1). 항상 `localStorage` 에 씀. 그 뒤에 만든 그리드가 이 값을 읽어 적용 |

### 사용자 뷰 함수

그리드에서 바로 부르는 것:

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>grid.getCustomViewsManager()</code> | 관리 객체 | 사용자 뷰 관리 객체 (17). 처음 부를 때 만들어짐 |
| <code>grid.loadCustomViews(views, current?)</code> | - | 뷰 목록을 통째로 바꾸고 `current` 뷰를 적용 (10). `current` 는 순번(0 부터) 또는 `identifier`. 빼면 목록만 바뀌고 적용된 뷰는 없는 상태가 됨 |
| <code>grid.showCustomViewsDialog()</code> | 대화상자 | 사용자 뷰 대화상자를 엶 (10) |

관리 객체(`grid.getCustomViewsManager()`)의 함수:

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| <code>getCustomViews()</code> | 뷰 배열 | 뷰 목록 (7). 처음 부를 때 저장소에서 `customViews` 와 `currentCustomViewId` 를 읽음 |
| <code>getCustomView(identifier)</code> | 뷰 &#124; <code>undefined</code> | 뷰 하나 (4) |
| <code>getCurrentCustomView()</code> | 뷰 &#124; <code>undefined</code> | 지금 적용된 뷰 (6) |
| <code>getCurrentCustomViewIdentifier()</code> | 문자열 &#124; <code>undefined</code> | 지금 적용된 뷰의 `identifier` (4) |
| <code>getCurrentCustomViewIndex()</code> | 숫자 | 지금 적용된 뷰의 순번 (1). 없으면 `-1` |
| <code>setCurrentCustomView(identifier)</code> | - | 그 뷰를 적용 (2). 뷰에 없는 컬럼 값은 원래 컬럼 정의로 되돌림 |
| <code>addCustomView(view, replaceFlag?)</code> | - | 뷰 하나 또는 배열을 더함 (3). `identifier` 가 같은 뷰가 있으면 `replaceFlag` 가 `true` 일 때만 바꿈 |
| <code>deleteCustomView(identifier)</code> | - | 뷰 하나 삭제 (0) |
| <code>setCustomViews(views, current, applyFlag, notifyFlag)</code> | - | 목록을 통째로 바꿈 (4). `applyFlag` 가 `true` 면 `current` 를 적용, `notifyFlag` 가 `true` 면 `onCustomViewsSave` 를 부름 |
| <code>showCustomViewsDialog()</code> | 대화상자 | `grid.showCustomViewsDialog()` 와 같음 |
| <code>onCustomViewsSave</code> | - | 함수를 대입해 두는 속성 (16). [이벤트와 콜백](#이벤트와-콜백) 참고 |

2025 의 `addCustomView`, `deleteCustomView` 는 메모리의 목록만 바꿉니다. 2026 은 저장소의 `customViews` 도 같이 고칩니다. <Badge type="warning" text="2026" />

### 뷰 하나의 키

| 키 | 필수 | 설명 |
| --- | --- | --- |
| <code>identifier</code> | O | 뷰를 가리키는 이름. 기본 뷰는 `'DefaultConfiguration'`, 대화상자에서 만든 뷰는 `'CustomConfiguration1'`, `'CustomConfiguration2'` ... |
| <code>label</code> | - | 대화상자에 보이는 이름. 없으면 `identifier` 를 보여 줌 |
| <code>columnsVisibleFlag</code> | - | <code>{ dataIndex: true &#124; false }</code> |
| <code>columnsWidth</code> | - | <code>{ dataIndex: 숫자 &#124; 'auto' }</code> |
| <code>columnsPinnedState</code> | - | <code>{ dataIndex: 'left' &#124; 'right' &#124; 'unpinned' }</code> |
| <code>unpinnedColumnsOrder</code> / <code>pinnedColumnsOrder</code> | - | <code>{ dataIndex: 순번 }</code> |
| <code>columnsSortModel</code> | - | <code>[{ dataIndex, sort }]</code>. 없으면 그리드의 원래 정렬 |
| <code>groupingOptions</code> | - | <code>{ dataIndexesToGroup: [...] }</code>. `rowGroupingEnabledFlag` 가 `true` 일 때만 적용 |
| <code>layoutDensity</code> | - | <code>'compact' &#124; 'comfortable'</code>. 없으면 그리드의 원래 밀도 |
| <code>readOnly</code> <Badge type="warning" text="2026" /> | - | `true` 면 대화상자에서 이름 변경, 삭제, 기본값 재설정을 막음 |
| <code>readOnlyWarningMessage</code> <Badge type="warning" text="2026" /> | - | `readOnly` 뷰를 고르면 대화상자에 보여 줄 안내 글 |

- 대화상자가 저장하는 뷰에는 **원래 컬럼 정의와 다른 값만** 들어갑니다. 뷰에 없는 컬럼은 `columns` 에 적은 값 그대로입니다.
- 배열의 첫 번째 뷰는 대화상자에서 이름 변경과 삭제가 막힙니다. 그래서 첫 번째에는 기본 뷰를 둡니다.

### 이벤트와 콜백

뷰가 바뀌었다는 전용 이벤트는 없습니다. 아래 셋으로 받습니다.

| 이름 | 등록 | 언제 | 인자 |
| --- | --- | --- | --- |
| <code>userPreferencesChange</code> | <code>grid.addEventListener('userPreferencesChange', fn)</code> | 그리드가 상태를 저장할 때마다, 뷰를 적용할 때 (5) | `event.options` 는 빈 객체 `{}`. 바뀐 내용은 `grid.layout.exportPreferencesInJson()` 으로 읽음 |
| <code>onCustomViewsSave</code> (관리 객체) | <code>grid.getCustomViewsManager().onCustomViewsSave = fn</code> | 대화상자에서 저장 및 적용 버튼이나 저장 버튼을 누를 때 | <code>(views, 고른 뷰의 identifier)</code> |
| <code>onCustomViewsSave</code> (그리드) | <code>grid.onCustomViewsSave = fn</code> | 위와 같은 때 | <code>(views, 지금 적용된 뷰의 순번)</code>. `this` 는 관리 객체 |

- `loadCustomViews` 나 `setCurrentCustomView` 를 코드로 불렀을 때는 `onCustomViewsSave` 가 불리지 않습니다.
- 대화상자에서 고친 것이 없으면 저장 버튼이 눌리지 않고, 오른쪽 버튼 글자도 "저장 및 적용" 이 아니라 "적용" 입니다.

조작 한 번에 `userPreferencesChange` 가 나는 횟수 (로컬에서 센 값):

| 조작 | 횟수 |
| --- | --- |
| 헤더 경계를 끌어 너비 바꾸기, 헤더를 눌러 정렬 | 1 |
| 헤더를 끌어 컬럼 하나 옮기기 | 6 |
| `setColumnVisibleFlag` / `setColumnWidth` (`isUserInteraction: true`) | 1 |
| `setColumnPinned` (`isUserInteraction: true`) | 4 |
| `moveColumn` (`isUserInteraction: true`) | 3 |
| `loadCustomViews` 로 뷰 적용 | 8 |
| `grid.layout.importJsonPreferences` | 키 개수만큼 |
- 너비, 순서, 표시, 정렬 하나하나를 따로 받으려면 `columnWidthChange`, `columnOrderChange`, `columnVisibleStateChange`, `sortModelChange` 를 씁니다 ([이벤트](/datagridview/api/events)).

## 사용자가 헤더에서 할 수 있는 일

컬럼 헤더를 우클릭하면 그리드 기본 메뉴가 열립니다. `onContextualEvent` 를 직접 넣었다면 `buildDefaultContextualMenu` 로 기본 메뉴를 가져와야 보입니다 ([우클릭 메뉴](/datagridview/context-menu#그리드-기본-메뉴-쓰기)).

| 메뉴 (한글 화면) | 켜고 끄는 옵션 | 하는 일 |
| --- | --- | --- |
| 열 고정 | <code>pin</code> | 왼쪽 고정 / 오른쪽 고정 / 해제 |
| 크기에 맞게 열 조정, 크기에 맞게 모든 열 조정 | <code>sizeColumnToFit</code> | 우클릭한 컬럼, 또는 모든 컬럼의 너비를 내용에 맞춤 |
| 컬럼 이름 체크 항목 (최대 8개) | <code>firstColumnsVisibility</code> | 화면 순서로 앞쪽 8개 컬럼을 숨기거나 보임. 숨긴 컬럼도 목록에 나옴. 보이는 컬럼은 왼쪽에 파란 막대 표시. `alwaysVisibleFlag` 컬럼은 회색으로 눌리지 않음 |
| 테이블 보기 구성... | <code>columnsManagement</code> | 사용자 뷰 대화상자를 엶 |

샘플(컬럼 6개, 필터 없음)에서 헤더를 우클릭하면 "열 고정 / 크기에 맞게 열 조정 / 크기에 맞게 모든 열 조정 / 컬럼 이름 6개 / 테이블 보기 구성..." 순서로 나옵니다.

9번째 뒤의 컬럼을 숨기거나 보이려면 "테이블 보기 구성..." 대화상자를 써야 합니다. 대화상자("테이블 보기 사양")에서 할 수 있는 일:

- 뷰 고르기, 새로 만들기, 이름 바꾸기, 삭제
- 컬럼마다 표시(가시성), 너비, 고정 바꾸기. 행을 끌어 컬럼 순서 바꾸기
- 행 그룹 기준 (그리드의 `rowGroupingEnabledFlag` 가 `true` 일 때만 보임), 정렬 기준, 밀도
- "기본값으로 재설정" : 고른 뷰를 원래 컬럼 정의로 되돌림
- "테이블 보기에서 업데이트" : 지금 화면 상태를 고른 뷰로 가져옴
- "저장 및 적용" 버튼(저장할 것이 없으면 "적용")은 저장하고 고른 뷰를 화면에 적용, 저장 버튼은 목록만 저장

## 예제

### 예제 1. 사용자가 바꾼 화면을 브라우저에 기억

`identifier` 하나면 됩니다. 사용자가 너비나 순서를 바꾸면 `localStorage` 에 저장되고, 다음에 같은 `identifier` 로 그리드를 만들면 되살아납니다.

<<< @/../DataGridViewSample/13_customViews.html#grid{js}

샘플에서 너비, 순서, 숨김, 고정, 정렬을 바꾸고 새로 고침하면 모두 그대로 돌아옵니다.

### 예제 2. 위젯 설정에 저장

`useWidgetPreferencesFlag: true` 를 더합니다. 실제 ENOVIA 앱이 가장 많이 쓰는 형태입니다.

```js
var grid = new DataGridView({
  identifier: 'partList',
  useWidgetPreferencesFlag: true,
  treeDocument: treeDocument,
  columns: columns
});
```

### 예제 3. 저장된 상태 지우기 (초기화 버튼)

기본 뷰를 적용하면 너비, 표시, 고정, 순서, 정렬, 밀도가 원래 컬럼 정의로 돌아가고, 저장소의 그 키들도 지워집니다 (`customViews` 와 `currentCustomViewId` 만 남음). 행 그룹과 컬럼 그룹 펼침은 그대로 남습니다. 뷰 목록에 `DefaultConfiguration` 뷰가 있어야 합니다 (처음부터 들어 있습니다. 한글 화면의 이름은 "기본 사양").

뷰 목록까지 저장값을 통째로 지우려면 `deleteDataGridViewPreferences()` 를 씁니다. 저장소만 지우고 화면은 바꾸지 않으므로, 그리드를 다시 만들 때부터 원래대로 보입니다. 지운 뒤 `localStorage` 의 항목은 `{}` 로 남습니다.

<<< @/../DataGridViewSample/13_customViews.html#saved{js}

`loadCustomViews` 로 `layoutDensity` 가 있는 뷰를 적용한 뒤에는 기본 뷰를 적용해도 밀도가 돌아가지 않습니다 ([주의](#주의)).

2025 에서 `useWidgetPreferencesFlag: true` 인 그리드는 이 함수로 지워지지 않습니다 ([주의](#주의)). 그때는 키마다 지웁니다.

```js
['groupingOptions', 'columnGroupsExpandedStates', 'customViews', 'currentCustomViewId'].forEach(function (key) {
  grid.layout.deleteDataGridViewKeyPreference(key);
});
```

### 예제 4. 상태를 꺼내 서버에 저장하고 되살리기

`userPreferencesChange` 는 한 번 조작에 여러 번 나므로 모아서 한 번만 저장합니다. 샘플은 서버 대신 `sessionStorage` 에 넣습니다.

<<< @/../DataGridViewSample/13_customViews.html#export{js}

이미 만든 그리드에는 `grid.layout.importJsonPreferences` 로 되살립니다. 저장소에 쓰고 화면에 바로 적용합니다. 되살리는 동안에도 `userPreferencesChange` 가 나므로 저장을 건너뜁니다.

<<< @/../DataGridViewSample/13_customViews.html#restore{js}

그리드를 다시 만드는 화면이라면 만들기 **전에** 정적 함수로 넣어 둡니다. 그리드가 만들어지면서 읽어 적용합니다.

```js
if (savedJson) {
  DataGridView.importJsonPreferences('partList', savedJson);
}

var grid = new DataGridView({
  identifier: 'partList',
  treeDocument: treeDocument,
  columns: columns
});
```

이 정적 함수 방식도 로컬에서 확인했습니다 (넣어 둔 너비로 그리드가 그려짐). 같은 일을 그리드 옵션 `layoutOptions: { preferencesToApply: savedJson }` 로도 할 수 있습니다.

### 예제 5. 사용자 뷰를 코드로 넣기

첫 번째에 기본 뷰를 두고, 두 번째 인자로 처음 적용할 뷰를 고릅니다.

<<< @/../DataGridViewSample/13_customViews.html#views{js}

적용하면 뷰의 값이 화면에 들어가고, 뷰 목록(`customViews`), 뷰의 각 키, `currentCustomViewId` 가 저장소에 저장됩니다. 그래서 새로 고침해도 같은 뷰가 적용된 채로 열립니다.

코드로 뷰만 바꾸려면 `grid.getCustomViewsManager().setCurrentCustomView('DefaultConfiguration')` 을 부릅니다.

### 예제 6. 뷰 대화상자를 버튼으로 열고, 저장할 때 서버에 보내기

사용자가 대화상자에서 저장을 누르면 뷰 목록 전체가 콜백으로 옵니다. 앱은 이것을 서버에 보관했다가 다음에 `grid.loadCustomViews(views, currentIdentifier)` 로 다시 넣습니다.

<<< @/../DataGridViewSample/13_customViews.html#dialog{js}

로컬에서 확인한 콜백 인자:

- 첫 번째 인자는 뷰 배열입니다. 대화상자가 다시 만든 뷰라서 원래 컬럼 정의와 다른 값만 들어 있습니다 (예: 순서는 `{ state: 0 }` 처럼 바뀐 컬럼만).
- 두 번째 인자는 대화상자에서 고른 뷰의 `identifier` 입니다. "+" 로 새 뷰를 만들고 저장하면 `'CustomConfiguration1'` (이름 "사양 1") 이 옵니다.
- 그리드의 `grid.onCustomViewsSave` 도 같은 때 불리고, 두 번째 인자는 지금 적용된 뷰의 순번입니다.

위젯 설정에 저장한 그리드(예제 2)는 저장값에서 뷰를 다시 읽어 넣는 앱이 많습니다.

```js
var raw = widget.getValue('wux-collectionView-dataGridView');
if (raw) {
  var saved = JSON.parse(raw)[grid.identifier];
  if (saved) {
    grid.loadCustomViews(saved.customViews, saved.currentCustomViewId);
  }
}
```

### 예제 7. 숨길 수 없는 컬럼

`alwaysVisibleFlag: true` 인 컬럼은 헤더 메뉴의 체크 항목이 눌리지 않고, 대화상자의 가시성 칸도 고칠 수 없고(체크박스 대신 체크 표시), `setColumnVisibleFlag(컬럼, false)` 도 무시됩니다.

<<< @/../DataGridViewSample/13_customViews.html#columns{js}

<<< @/../DataGridViewSample/13_customViews.html#alwaysVisible{js}

| `visibleFlag` | `alwaysVisibleFlag` | 화면 |
| --- | --- | --- |
| `true` | 없음 / `false` | 보임. 사용자가 숨길 수 있음 |
| `false` | 없음 / `false` | 숨김. 사용자가 보이게 할 수 있음 |
| `true` | `true` | 보임. 숨길 수 없음 |
| `false` | `true` | 보임. `getColumnVisibleFlag` 는 `false`, `getColumnVisibleState` 는 `true`. 헤더 메뉴의 체크 항목은 꺼진 채 회색으로 눌리지 않음 |

2025 에서도 동작합니다 (앱 파일 23개가 사용). 2026 은 `defaultColumnDef` 에 기본값 `false` 가 추가되었습니다.

### 예제 8. 헤더 메뉴에서 컬럼 숨기기와 뷰 대화상자 빼기

사용자가 컬럼 구성을 바꾸지 못하게 하려면 기본 메뉴에서 두 묶음을 끕니다. 샘플은 체크박스로 켜고 끄고, 그리드 옵션에 `onContextualEvent: buildHeaderMenu` 로 넣습니다.

<<< @/../DataGridViewSample/13_customViews.html#headerMenu{js}

둘 다 끄면 헤더 메뉴에는 "열 고정 / 크기에 맞게 열 조정 / 크기에 맞게 모든 열 조정" 만 남습니다.

## 주의

::: warning identifier 가 없으면 저장되지 않습니다
`useWidgetPreferencesFlag: true` 만 넣고 `identifier` 를 빼면 아무것도 저장되지 않고 오류도 나지 않습니다. `identifier` 가 없어도 `userPreferencesChange` 이벤트는 나지만, 그때 `exportPreferencesInJson()` 은 `undefined` 를 돌려줍니다. `localStorage` 도 바뀌지 않습니다 (로컬 확인).
:::

::: warning identifier 는 겹치지 않게 짓습니다
`localStorage` 의 항목 하나(`wux-collectionView-dataGridView`)를 같은 주소의 모든 화면이 같이 씁니다. 다른 화면의 그리드와 `identifier` 가 같으면 서로의 상태를 덮어씁니다. `'grid1'` 대신 `'myApp_partList'` 처럼 앱 이름을 붙입니다. 2026 은 `identifier` 가 `'12'` 처럼 숫자만으로 되어 있으면 화면 상태를 저장하지 않습니다. <Badge type="warning" text="2026" /> 2025 는 `'12'` 도 그대로 저장합니다 (로컬 확인).
:::

::: warning 코드로 넣은 뷰의 밀도는 "원래 밀도" 가 됩니다
`loadCustomViews` (또는 코드로 부른 `setCurrentCustomView`)로 `layoutDensity` 가 있는 뷰를 적용하면, 그리드가 그 밀도를 원래 밀도로 기록합니다 (`_applyLayoutDensity` 는 사용자 조작이나 저장값 복원이 아닐 때 원래 밀도를 바꿈). 그래서 그 뒤 기본 뷰를 적용해도 밀도가 돌아가지 않고, 대화상자에서 저장한 뷰에서는 `layoutDensity` 가 빠집니다. 새로 고침해서 저장값으로 같은 뷰가 복원될 때는 이 일이 없습니다 (로컬 확인).
:::

::: warning 저장된 상태가 컬럼 정의보다 우선합니다
개발 중에 `columns` 의 `width` 나 `visibleFlag` 를 바꿨는데 화면이 그대로면 예전에 저장된 값이 적용된 것입니다. `grid.layout.deleteDataGridViewPreferences()` 를 부르거나 브라우저 개발자 도구에서 `localStorage` 의 `wux-collectionView-dataGridView` 항목을 지웁니다. `columns` 에 없는 `dataIndex` 의 저장값은 무시됩니다.
:::

::: warning 2025 에서는 위젯 설정에 저장한 상태가 한 번에 지워지지 않습니다
2025 의 `deleteDataGridViewPreferences()` 는 내부 함수에 인자를 한 칸 어긋나게 넘깁니다. 그래서 `useWidgetPreferencesFlag: true` 인 그리드에서는 아무것도 지우지 못합니다. 기본 뷰를 적용하거나 `deleteDataGridViewKeyPreference(키)` 로 키마다 지웁니다 (예제 3). 2026 에서 고쳐졌습니다.
:::

- `userPreferencesChange` 는 저장할 때마다 납니다. 헤더를 끌어 컬럼 하나를 옮기면 6번 나므로 서버 저장은 모아서 합니다 (예제 4, [이벤트와 콜백](#이벤트와-콜백)의 횟수 표).
- `grid.layout.importJsonPreferences` 도 키마다 `userPreferencesChange` 를 일으킵니다 (키 3개면 3번). 이 이벤트에서 서버에 저장한다면, 되살리는 동안에는 저장을 건너뜁니다.
- `loadCustomViews` 는 목록을 **통째로** 바꿉니다. 사용자가 만든 뷰를 남기려면 `getCustomViews()` 로 받은 배열에 더해서 넘깁니다.
- 밀도(`layoutDensity`)는 자동 저장 대상이 아닙니다. 뷰에 넣어야 되살아납니다.
- 2025 의 관리 객체에는 `createNewCustomView()` 가 있지만 관리 객체에 없는 함수를 불러서 오류가 납니다. 2026 에서는 빠졌습니다. 뷰를 코드로 만들 때는 `addCustomView` 나 `loadCustomViews` 를 씁니다.

## 같이 보기

- 그리드 옵션 `identifier`, `useWidgetPreferencesFlag`, `customViewsOptions` → [그리드 옵션](/datagridview/api/grid-options)
- `customViewsOptions` 의 키 → [하위 옵션 객체](/datagridview/api/sub-options#customviewsoptions)
- `getCustomViewsManager`, `loadCustomViews`, `showCustomViewsDialog` → [그리드 메서드](/datagridview/api/grid-methods)
- `setColumnVisibleFlag`, `setColumnWidth` 같은 `grid.layout` 함수와 `isUserInteraction` → [레이아웃 메서드](/datagridview/api/layout-methods)
- `visibleFlag`, `alwaysVisibleFlag`, `pinned`, `width` → [컬럼 옵션](/datagridview/api/column-options)
- `userPreferencesChange` 와 컬럼 이벤트 → [이벤트](/datagridview/api/events)
- 헤더 우클릭 기본 메뉴 → [우클릭 메뉴와 선택](/datagridview/context-menu#그리드-기본-메뉴-쓰기)
- 정렬 상태(`sortModel`) → [정렬과 필터](/datagridview/sort-filter)
- 위젯 설정에 값이 저장되는 방식 → [위젯 설정 (preferences)](/widget/preferences)
