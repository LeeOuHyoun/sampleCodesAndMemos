---
title: GeneratedToolbar API
---

# GeneratedToolbar API <Badge type="info" text="원본 분석" />

툴바의 생성자 옵션, 메서드, 이벤트입니다. 엔트리 JSON 키는 [툴바 (setToolbar)](/datagridview/api/toolbar) 에 있습니다. 사용법은 [GeneratedToolbar](/tweakers/generated-toolbar) 가이드를 보세요.

```js
var toolbar = new GeneratedToolbar({
  items: GeneratedToolbar.prototype.createTreeDocument({ entries: [ ... ] }),
  executionContext: myView,
  overflowManagement: 'dropdown'
}).inject(el);
```

::: info 근거
Tweakers.js 의 GeneratedToolbar publishedProperties / prototype. 메서드, 이벤트 시점은 [샘플](https://github.com/LeeOuHyoun/sampleCodesAndMemos/blob/master/TweakersSample/03_generatedToolbar.html)을 로컬에서 띄워 실행 확인 (3DSpace 서버에서는 미확인).
:::

## 생성자 옵션

만든 뒤 `toolbar.키 = 값` 으로 바꿀 수 있습니다.

| 키 | 기본값 | 값 | 설명 |
| --- | --- | --- | --- |
| <code>items</code> | <code>null</code> | TreeDocument | <code>createTreeDocument(json)</code> 결과 |
| <code>executionContext</code> | - | 아무 객체 | 콜백의 <code>e.context.executionContext</code> |
| <code>overflowManagement</code> | <code>'scroll'</code> | <code>'scroll' &#124; 'dropdown'</code> | 공간이 모자랄 때 스크롤 / 넘친 항목을 팝업으로 |
| <code>direction</code> | <code>'horizontal'</code> | <code>'horizontal' &#124; 'vertical'</code> | 배치 방향 |
| <code>typeRepresentationFactory</code> | 자동 생성 | TypeRepresentationFactory | 편집기를 만들 Factory |
| <code>popupDisplayStyle</code> | <code>'TreeListView'</code> | <code>'TreeListView' &#124; 'Basic'</code> | 넘친 항목 팝업 모양. 2026 기본값은 <code>'DataGridView'</code> |
| <code>addTweakersIDs</code> | <code>false</code> | <code>boolean</code> | 항목 요소에 <code>tweaker_id</code> 속성 추가 (자동 테스트용) |
| <code>disabled / visibleFlag / touchMode / domId</code> | - | - | 공통 컨트롤 속성. <code>disabled</code> 는 모든 항목에 적용 |
| <code>displayLabel</code> <Badge type="warning" text="2026" /> | <code>false</code> | <code>boolean</code> | 모든 항목 라벨 표시 |
| <code>contextualMenu</code> <Badge type="warning" text="2026" /> | - | <code>{ displayLabel: true }</code> | 우클릭 메뉴에 라벨 보이기/숨기기 |

모든 항목이 버튼 계열(`function`, `functionIcon`, `functionMenu` ...)이고 `overflowManagement: 'dropdown'` 이면 넘친 항목은 메뉴로 표시됩니다.

## 메서드

| 메서드 | 설명 |
| --- | --- |
| <code>createTreeDocument(json)</code> | <code>{ entries }</code> 를 TreeDocument 로 변환. <code>GeneratedToolbar.prototype.createTreeDocument(...)</code> 로 호출. <code>enums</code>, <code>typeRepresentations</code> 는 등록하지 않음 |
| <code>updateModel(json)</code> | 항목 전체를 새 JSON 으로 교체. 입력값과 바꾼 상태는 JSON 값으로 돌아감. 같은 JSON 객체는 다시 쓸 수 없음 (변환하면서 바뀜) |
| <code>updateNodeModel(id, opts)</code> | 항목 하나의 상태, 값 변경. 그 항목만 바로 바뀌고 전체를 다시 그리지 않음. 최상위에 없으면 하위 메뉴에서 찾음. 2025 반환값은 최상위에서 찾았을 때만 <code>true</code> |
| <code>getNodeModelByID(id)</code> | 최상위 항목 (TreeNodeModel). 없거나 하위 메뉴 항목이면 <code>undefined</code> |
| <code>prepareUpdateView() / pushUpdateView()</code> | 사이의 <code>updateNodeModel</code> 은 바로 적용되고, <code>pushUpdateView</code> 때 툴바 전체를 지우고 다시 그림 (<code>onReady</code> 다시 발생). 라벨 글자처럼 다시 그려야 보이는 변경에 씀 |
| <code>giveFocusTo(id)</code> | 항목에 포커스 |
| <code>isReady()</code> | 모든 항목 편집기 생성이 끝났는지 |
| <code>showAllAndResize()</code> | 팝업으로 넘친 항목을 되돌린 뒤 다시 배치 |
| <code>inject(el) / getContent() / destroy()</code> | 공통 컨트롤 메서드 |

`addEntry`, `removeEntry` 는 없습니다. `updateModel` 또는 `toolbar.items` (TreeDocument) 의 `addRoot` / `removeRoot` 를 씁니다.

## 이벤트

`toolbar.addEventListener(이름, fn)` 으로 받습니다.

| 이벤트 | 시점 |
| --- | --- |
| <code>onReady</code> | 툴바 전체를 그린 뒤마다. 처음, <code>pushUpdateView</code>, <code>updateModel</code> (항목 수만큼 여러 번), <code>items.addRoot / removeRoot</code> |
| <code>modelUpdated</code> | 항목 하나의 값이나 상태가 바뀐 뒤마다 (엔트리 <code>onNodeUpdate</code> 다음). <code>updateNodeModel</code> 로 <code>disabled</code> 등만 바꿔도 발생 |
| <code>dimensionsChanged</code> | 툴바 크기 변경 |
| <code>displayLabelChange</code> <Badge type="warning" text="2026" /> | <code>displayLabel</code> 변경 |

## 엔트리 변환 규칙

`createTreeDocument` 는 엔트리를 아래처럼 옮겨 저장합니다. `updateNodeModel`, `getAttributeValue` 에 쓰는 이름이 여기서 정해집니다.

| 엔트리 | 저장 위치 |
| --- | --- |
| <code>dataElements.typeRepresentation</code> | <code>grid.typeRep</code> |
| <code>dataElements.value</code> | <code>grid.data</code> (<code>getAttributeValue('data')</code>) |
| <code>dataElements.icon</code> | <code>grid.semantics.icon</code> |
| <code>dataElements.readOnly / disabled</code> | <code>grid.readOnly / grid.disabled</code> |
| <code>dataElements.action</code> 안의 키 | <code>grid.data</code> 에 복사 |
| 그 밖의 <code>dataElements.*</code> | 항목 옵션 최상위 (<code>label</code>, <code>tooltip</code>, <code>visibleFlag</code> ...) |
| <code>children</code> | <code>grid.data.menu</code> (하위는 <code>submenu</code>). 각 항목의 <code>dataElements</code> 는 풀어서 넣고 <code>label</code> 은 <code>title</code>, <code>typeRepresentation</code> 은 <code>type</code> 으로 바꿈 |

엔트리에 `grid` 키를 직접 넣으면 오류가 납니다 (예약어). 변환은 넘긴 엔트리 객체를 그 자리에서 고치므로, 같은 객체로 다시 부르면 `Missing dataElements` 오류가 납니다.
