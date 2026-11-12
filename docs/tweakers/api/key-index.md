---
title: 이름 색인 (A-Z)
---

# 이름 색인 (A-Z)

Tweakers 레퍼런스에 나오는 옵션, 함수, 이벤트 이름 161개를 알파벳 순으로 모았습니다. 이름은 아는데 어느 페이지에 있는지 모를 때 씁니다.

- "있는 곳" 은 그 이름이 설명된 페이지와 절입니다. 어느 편집기의 옵션인지(공통, 문자열, 숫자 ...)도 여기서 알 수 있습니다.
- 이름의 일부만 기억나면 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)에 `MultipleValues` 처럼 넣습니다.
- 하고 싶은 일로 찾으려면 [개요의 "하고 싶은 일로 찾기"](/tweakers/#하고-싶은-일로-찾기) 를 봅니다.
- 이 페이지는 `npm run docs:key-index` 로 다시 만듭니다. 직접 고치지 않습니다.

## A

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>action</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.data</code> 에 복사 |
| <code>addEventListener</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 이벤트 등록 / 해제 (<code>getContent()</code> 에 위임) |
| <code>addTweakersIDs</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 항목 요소에 <code>tweaker_id</code> 속성 추가 (자동 테스트용) |
| <code>alignment</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 'near' &#124; 'center' &#124; 'far' |
| <code>allowFreeInputFlag</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 목록에 없는 값 직접 입력 허용. <code>customEnumMember</code> 콤보에서는 화면에 첫 항목이 보임 |
| <code>allowMultipleValuesFlag</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 여러 개 선택 (값은 배열, 칩으로 쌓임). <code>customEnumMember</code> 콤보에 주면 표시만 되고 편집하면 값이 문자열 하나로 바뀜 ([편집기 종류별 사용법](/tweakers/editors)) |
| <code>allowResetToUndefinedByUIFlag</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 값 비우기 허용 |
| <code>allowUnsafeHTMLContent</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | HTML 내용 허용 |
| <code>augmentedDisplay</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 확장 편집 팝업 설정 |
| <code>autoCorrectFlag</code> | [semantics › 문자열 (TweakerString)](/tweakers/api/semantics#문자열-tweakerstring) | 자동 보정 |

## B

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>backgroundColor</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 배경색 |
| <code>bigIcon</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 큰 아이콘 |

## C

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>cancelEdit</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | - |
| <code>change</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | 대개 <code>{}</code> |
| <code>children</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.data.menu</code> (하위는 <code>submenu</code>). 각 항목의 <code>dataElements</code> 는 풀어서 넣고 <code>label</code> 은 <code>title</code>, <code>typeRepresentation</code> 은 <code>type</code> 으로 바꿈 |
| <code>colorFrom</code> | [semantics › 숫자 (TweakerNumber)](/tweakers/api/semantics#숫자-tweakernumber) | 슬라이더 색 범위 |
| <code>colorTo</code> | [semantics › 숫자 (TweakerNumber)](/tweakers/api/semantics#숫자-tweakernumber) | 슬라이더 색 범위 |
| <code>computeContentSize</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 내용 너비(px). 그리드 컬럼 너비 맞춤에 쓰임 |
| <code>context</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | <code>'stdTemplate'</code> (기본) 또는 <code>'inlinedTemplate'</code> (한 줄 모양) |
| <code>contextualMenu</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 우클릭 메뉴에 라벨 보이기/숨기기 |
| <code>createTreeDocument</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | <code>{ entries }</code> 를 TreeDocument 로 변환. <code>GeneratedToolbar.prototype.createTreeDocument(...)</code> 로 호출. <code>enums</code>, <code>typeRepresentations</code> 는 등록하지 않음 |
| <code>customFormatter</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 표시 문자열 변환 함수. 문자열을 반환하면 그 값으로 표시 |
| <code>customValidator</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 확장 편집기 컨트롤에 전달 |
| <code>customValidator</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 입력값 검증 함수 |

## D

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>decimals</code> | [semantics › 숫자 (TweakerNumber)](/tweakers/api/semantics#숫자-tweakernumber) | 화면에 보이는 소수 자릿수. 값은 깎지 않음 (2.7 을 넣으면 decimals 0 이라도 값은 2.7). 정수로 저장하려면 <code>valueType: 'integer'</code> |
| <code>descriptionHeight</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 설명 영역 높이 / 배치 방향 |
| <code>destroy</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 공통 컨트롤 메서드 |
| <code>destroy</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 정리 |
| <code>destroy</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | 재사용 목록 중 사용하지 않는 편집기 정리 |
| <code>dialogOptions</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 확장 편집 팝업 설정 |
| <code>dimensionsChanged</code> | [GeneratedToolbar API › 이벤트](/tweakers/api/generated-toolbar#이벤트) | 툴바 크기 변경 |
| <code>direction</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 배치 방향 |
| <code>directory</code> | [TypeRepresentationFactory API › 2026 버전 차이](/tweakers/api/type-representation-factory#_2026-버전-차이) | 2025 에서는 부모 저장소 조회가 실제로 동작하지 않음. 2026 에서 고쳐짐 (기본 전역 저장소만 쓰면 영향 없음) |
| <code>directory</code> | [TypeRepresentationFactory API › 생성자 옵션](/tweakers/api/type-representation-factory#생성자-옵션) | 타입 저장소. 생략하면 모든 인스턴스가 같은 전역 저장소를 씀 |
| <code>disabled</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 공통 컨트롤 속성. <code>disabled</code> 는 모든 항목에 적용 |
| <code>disabled</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.readOnly / grid.disabled</code> |
| <code>disabled</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 비활성 |
| <code>disableEvents</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 이벤트 일시 정지 / 재개. 횟수를 세므로 짝을 맞춤 |
| <code>displayLabel</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 모든 항목 라벨 표시 |
| <code>displayLabelChange</code> | [GeneratedToolbar API › 이벤트](/tweakers/api/generated-toolbar#이벤트) | <code>displayLabel</code> 변경 |
| <code>displayStyle</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 편집기 모양을 직접 지정 ([typeRepresentation](/datagridview/api/type-representation) displayStyle 값) |
| <code>domId</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 공통 컨트롤 속성. <code>disabled</code> 는 모든 항목에 적용 |

## E

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>editorTitle</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 확장 편집 팝업 설정 |
| <code>emphasize</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 강조 표시 |
| <code>enableEvents</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 이벤트 일시 정지 / 재개. 횟수를 세므로 짝을 맞춤 |
| <code>enableSearchFlag</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 목록 검색 입력칸. <code>displayStyle: 'searchableCombo'</code> 로도 켜짐. <code>customEnumMember</code> (TweakerString 콤보)는 viewOptions 를 무시함. 아래 <code>mainElementVisibleFlag</code>, <code>expanderIcon</code> 도 같음 |
| <code>escapeHTML</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | HTML 이스케이프 |
| <code>escapeHTML</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | HTML 이스케이프. semantics 가 아니라 여기에 넣음 |
| <code>executionContext</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 콜백의 <code>e.context.executionContext</code> |
| <code>executionContext</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 버튼 편집기 콜백의 <code>e.context</code> 로 전달 |
| <code>expanderIcon</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 펼침 아이콘 |
| <code>externallyDriven</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 값을 숫자로 변환하지 않고 그대로 설정 |

## F

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>fireOnlyFromUIInteractionFlag</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | true 면 사용자 조작으로 생긴 이벤트만 발생 (코드로 값을 넣을 때 change 없음) |

## G

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>generateTweaker</code> | [TypeRepresentationFactory API › 2026 버전 차이](/tweakers/api/type-representation-factory#_2026-버전-차이) | 템플릿이 준비되어 있으면 편집기를 바로 반환, 아니면 Promise |
| <code>generateView</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | 편집기 생성. 아래 참고 |
| <code>getContent</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 공통 컨트롤 메서드 |
| <code>getContent</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 화면 요소 (<code>div.wux-tweakers</code>). 요소의 <code>dsModel</code> 이 편집기 |
| <code>getDisplayedInformation</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 화면 표시 정보를 직접 계산 |
| <code>getEventsAllowedState</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 이벤트가 켜져 있는지 |
| <code>getNodeModelByID</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 최상위 항목 (TreeNodeModel). 없거나 하위 메뉴 항목이면 <code>undefined</code> |
| <code>getRegisteredEnum</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | 등록된 enum |
| <code>getRegisteredTypeRepresentation</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | 등록된 타입 정의 |
| <code>getRegisteredTypeTemplate</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | 등록된 템플릿 |
| <code>getStringFromValue</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 값을 화면 글자로 바꿈 (읽기 표시, 툴팁). 직접 만든 편집기에서 덮어씀 |
| <code>getTemplateIdentifierFromTypeRep</code> | [TypeRepresentationFactory API › 2026 버전 차이](/tweakers/api/type-representation-factory#_2026-버전-차이) | 인스턴스 메서드에서 static 으로 바뀜. <code>factory.getTemplateIdentifierFromTypeRep(...)</code> 은 2026 에서 오류 |
| <code>getTweakerStaticHeight</code> | [TypeRepresentationFactory API › 2026 버전 차이](/tweakers/api/type-representation-factory#_2026-버전-차이) | 편집기를 만들지 않고 높이 / 표시 문자열 계산 |
| <code>getTweakerStaticStringFromValue</code> | [TypeRepresentationFactory API › 2026 버전 차이](/tweakers/api/type-representation-factory#_2026-버전-차이) | 편집기를 만들지 않고 높이 / 표시 문자열 계산 |
| <code>getTypeRepresentationFactory</code> | [TypeRepresentationFactory API › 이미 있는 인스턴스](/tweakers/api/type-representation-factory#이미-있는-인스턴스) | 모든 DataGridView 가 공유하는 인스턴스 |
| <code>getTypeRepresentationFactory</code> | [TypeRepresentationFactory API › 이미 있는 인스턴스](/tweakers/api/type-representation-factory#이미-있는-인스턴스) | Tree 인스턴스별 |
| <code>giveFocusTo</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 항목에 포커스 |

## H

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>handleEditionCancel</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | Esc 로 편집 취소, 값 복원 |
| <code>hide</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | <code>hide</code>: <code>{ cancelFlag }</code> |
| <code>hideTodayOrNowButton</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 오늘/현재 버튼 숨김 |

## I

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>icon</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.semantics.icon</code> |
| <code>icon</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 아이콘 |
| <code>icon</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 편집기 속성 |
| <code>inject</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 공통 컨트롤 메서드 |
| <code>inject</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 화면에 붙임. 자기 자신 반환 |
| <code>invalidTooltip</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 유효하지 않을 때 툴팁 |
| <code>isReady</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 모든 항목 편집기 생성이 끝났는지 |
| <code>items</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | <code>createTreeDocument(json)</code> 결과 |

## K

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>keepSearchResultsFlag</code> | [semantics › 문자열 (TweakerString)](/tweakers/api/semantics#문자열-tweakerstring) | 입력하며 검색하는 콤보 설정 |

## L

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>label</code> | [semantics › 불리언 (TweakerBoolean)](/tweakers/api/semantics#불리언-tweakerboolean) | 체크박스 옆 글자 |
| <code>labelPosition</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 라벨 표시 / 위치 |
| <code>liveChange</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | <code>{ value }</code> |

## M

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>mainElementVisibleFlag</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 메인 요소 표시 |
| <code>maxLength</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 최대 입력 길이. -1 은 제한 없음 |
| <code>maxValue</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 최소 / 최대. 넘는 값은 경계값으로 바뀌고 validState 는 true 그대로. 경계가 0 이면 코드로 넣는 값은 검사하지 않음 |
| <code>minLengthBeforeSearch</code> | [semantics › 문자열 (TweakerString)](/tweakers/api/semantics#문자열-tweakerstring) | 입력하며 검색하는 콤보 설정 |
| <code>minValue</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 최소 / 최대. 넘는 값은 경계값으로 바뀌고 validState 는 true 그대로. 경계가 0 이면 코드로 넣는 값은 검사하지 않음 |
| <code>modelUpdated</code> | [GeneratedToolbar API › 이벤트](/tweakers/api/generated-toolbar#이벤트) | 항목 하나의 값이나 상태가 바뀐 뒤마다 (엔트리 <code>onNodeUpdate</code> 다음). <code>updateNodeModel</code> 로 <code>disabled</code> 등만 바꿔도 발생 |
| <code>multipleValuesSeparator</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 멀티 값 화면 표시 구분자. 앞뒤 공백이 자동으로 붙어 ',' → "A , B" 로 표시 |

## N

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>newLineMode</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 줄바꿈 입력 키 |
| <code>numeric</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 숫자형 값으로 취급 (정렬 등) |

## O

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>onCancelEdit</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 편집 시작 / 확정(<code>change</code>, <code>postEdit</code>) / 취소(값 복원, <code>cancelEdit</code>). 직접 만든 편집기의 화면 모듈에서 부름 ([편집기 직접 만들기](/tweakers/custom-tweaker)) |
| <code>onDrop</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 드롭 처리 |
| <code>onFailure</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 실패 콜백. <code>{ message, data, typePath, typeRep }</code> |
| <code>onPostEdit</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 편집 시작 / 확정(<code>change</code>, <code>postEdit</code>) / 취소(값 복원, <code>cancelEdit</code>). 직접 만든 편집기의 화면 모듈에서 부름 ([편집기 직접 만들기](/tweakers/custom-tweaker)) |
| <code>onPreEdit</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 편집 시작 / 확정(<code>change</code>, <code>postEdit</code>) / 취소(값 복원, <code>cancelEdit</code>). 직접 만든 편집기의 화면 모듈에서 부름 ([편집기 직접 만들기](/tweakers/custom-tweaker)) |
| <code>onReady</code> | [GeneratedToolbar API › 이벤트](/tweakers/api/generated-toolbar#이벤트) | 툴바 전체를 그린 뒤마다. 처음, <code>pushUpdateView</code>, <code>updateModel</code> (항목 수만큼 여러 번), <code>items.addRoot / removeRoot</code> |
| <code>onReady</code> | [TypeRepresentationFactory API › 생성자 옵션](/tweakers/api/type-representation-factory#생성자-옵션) | 미리 불러오기가 끝나면 호출. 끝난 뒤에 지정해도 바로 호출 |
| <code>onViewCreated</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 생성 완료 콜백 |
| <code>orientation</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 설명 영역 높이 / 배치 방향 |
| <code>overflowManagement</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 공간이 모자랄 때 스크롤 / 넘친 항목을 팝업으로 |

## P

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>pattern</code> | [semantics › 문자열 (TweakerString)](/tweakers/api/semantics#문자열-tweakerstring) | 입력 패턴 |
| <code>placeholder</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 빈 칸 안내 문구 |
| <code>popupDisplayStyle</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 넘친 항목 팝업 모양. 2026 기본값은 <code>'DataGridView'</code> |
| <code>possibleValues</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 선택 목록. ['A','B'] 또는 [{ label, value, icon }] |
| <code>possibleValues</code> | [semantics › 불리언 (TweakerBoolean)](/tweakers/api/semantics#불리언-tweakerboolean) | [{ value: true, icon: 'eye' }, { value: false, icon: 'eye-off' }] |
| <code>postEdit</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | - |
| <code>preEdit</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | - |
| <code>preLoadTemplates</code> | [TypeRepresentationFactory API › 생성자 옵션](/tweakers/api/type-representation-factory#생성자-옵션) | 템플릿 모듈 미리 불러오기 |
| <code>prepareUpdateView</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 사이의 <code>updateNodeModel</code> 은 바로 적용되고, <code>pushUpdateView</code> 때 툴바 전체를 지우고 다시 그림 (<code>onReady</code> 다시 발생). 라벨 글자처럼 다시 그려야 보이는 변경에 씀 |
| <code>pushUpdateView</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 사이의 <code>updateNodeModel</code> 은 바로 적용되고, <code>pushUpdateView</code> 때 툴바 전체를 지우고 다시 그림 (<code>onReady</code> 다시 발생). 라벨 글자처럼 다시 그려야 보이는 변경에 씀 |

## R

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>readOnly</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.readOnly / grid.disabled</code> |
| <code>readOnly</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 읽기 전용 |
| <code>readOnly</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 읽기 전용. semantics 가 아니라 여기에 넣음 |
| <code>referenceValue</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 기준값과 비교 표시 |
| <code>registerEnum</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | enum 하나 등록. 배열 / 객체 / 함수 |
| <code>registerTypeRepresentations</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | <code>{ 이름: { stdTemplate, inlinedTemplate?, semantics? } }</code> 등록. JSON 문자열도 받음. 이미 있는 이름은 무시 |
| <code>registerTypeTemplates</code> | [TypeRepresentationFactory API › 메서드](/tweakers/api/type-representation-factory#메서드) | <code>{ 템플릿id: { path, options } }</code> 등록. <code>path</code> 없는 항목, 이미 있는 id 는 무시 |
| <code>remove</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 화면에서 떼기만 함 (정리 안 함) |
| <code>removeEventListener</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 이벤트 등록 / 해제 (<code>getContent()</code> 에 위임) |
| <code>requiredFlag</code> | [semantics › 문자열 (TweakerString)](/tweakers/api/semantics#문자열-tweakerstring) | 필수 입력 |
| <code>resetToReferenceValue</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 현재 값을 기준값으로 저장 / 기준값으로 되돌림 (<code>referenceValue</code>) |
| <code>resizableFlag</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 입력 칸 크기 조절 허용 |

## S

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>selection</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 확장 편집기 컨트롤에 전달 |
| <code>semantics</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 편집기 옵션. 타입 정의의 semantics 보다 우선 |
| <code>setProperties</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 속성 여러 개 변경 |
| <code>setValueAsReference</code> | [Tweaker API › 메서드](/tweakers/api/tweaker#메서드) | 현재 값을 기준값으로 저장 / 기준값으로 되돌림 (<code>referenceValue</code>) |
| <code>show</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | <code>hide</code>: <code>{ cancelFlag }</code> |
| <code>showAllAndResize</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 팝업으로 넘친 항목을 되돌린 뒤 다시 배치 |
| <code>showLabelFlag</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 라벨 표시 / 위치 |
| <code>showReferenceValueFlag</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 기준값과 비교 표시 |
| <code>showWeekNumbers</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 달력에 주차 표시 |
| <code>stepValue</code> | [semantics › 숫자 (TweakerNumber)](/tweakers/api/semantics#숫자-tweakernumber) | 증감 단위 |

## T

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>timePickerFlag</code> | [semantics › 날짜 (TweakerDate)](/tweakers/api/semantics#날짜-tweakerdate) | 시간 선택 추가 |
| <code>timePickerPrecision</code> | [semantics › 날짜 (TweakerDate)](/tweakers/api/semantics#날짜-tweakerdate) | 'min' &#124; 'sec' (시간 정밀도) |
| <code>touchMode</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 공통 컨트롤 속성. <code>disabled</code> 는 모든 항목에 적용 |
| <code>touchMode</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 터치용 큰 모양 |
| <code>touchMode</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 편집기 속성 |
| <code>typeDelayBeforeSearch</code> | [semantics › 문자열 (TweakerString)](/tweakers/api/semantics#문자열-tweakerstring) | 입력하며 검색하는 콤보 설정 |
| <code>typePath</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 타입 이름, enum 이름, 또는 [typePath 문법](/tweakers/custom-type#typepath-문법) |
| <code>typeRepresentation</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.typeRep</code> |
| <code>typeRepresentationFactory</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 편집기를 만들 Factory |
| <code>typeRepresentationFactory</code> | [TypeRepresentationFactory API › 이미 있는 인스턴스](/tweakers/api/type-representation-factory#이미-있는-인스턴스) | GeneratedToolbar 가 쓰는 인스턴스 |

## U

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>uniqueValue</code> | [semantics › viewOptions](/tweakers/api/semantics#viewoptions) | 확장 편집기 컨트롤에 전달 |
| <code>units</code> | [semantics › 숫자 (TweakerNumber)](/tweakers/api/semantics#숫자-tweakernumber) | 단위 표시 (예: 'kg', '%') |
| <code>updateModel</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 항목 전체를 새 JSON 으로 교체. 입력값과 바꾼 상태는 JSON 값으로 돌아감. 같은 JSON 객체는 다시 쓸 수 없음 (변환하면서 바뀜) |
| <code>updateNodeModel</code> | [GeneratedToolbar API › 메서드](/tweakers/api/generated-toolbar#메서드) | 항목 하나의 상태, 값 변경. 그 항목만 바로 바뀌고 전체를 다시 그리지 않음. 최상위에 없으면 하위 메뉴에서 찾음. 2025 반환값은 최상위에서 찾았을 때만 <code>true</code> |
| <code>useWrappedView</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 줄바꿈 표시 모양 사용 |

## V

| 이름 | 있는 곳 | 설명 |
| --- | --- | --- |
| <code>validState</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 유효 여부 (읽기 전용) |
| <code>validStateChange</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | - |
| <code>value</code> | [GeneratedToolbar API › 엔트리 변환 규칙](/tweakers/api/generated-toolbar#엔트리-변환-규칙) | <code>grid.data</code> (<code>getAttributeValue('data')</code>) |
| <code>value</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 현재 값 |
| <code>valueType</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 값 형식 (예: 'integer', 'enumCustom') |
| <code>valueType</code> | [TypeRepresentationFactory API › generateView](/tweakers/api/type-representation-factory#generateview) | 편집기 속성 |
| <code>viewBuilt</code> | [Tweaker API › 이벤트](/tweakers/api/tweaker#이벤트) | - |
| <code>viewOptions</code> | [semantics › 공통 (TweakerBase)](/tweakers/api/semantics#공통-tweakerbase) | 편집기 화면(view) 옵션. 편집기별로 허용 키가 다름 ([viewOptions](/tweakers/api/semantics#viewoptions) 참고) |
| <code>visibleFlag</code> | [GeneratedToolbar API › 생성자 옵션](/tweakers/api/generated-toolbar#생성자-옵션) | 공통 컨트롤 속성. <code>disabled</code> 는 모든 항목에 적용 |
| <code>visibleFlag</code> | [Tweaker API › 속성](/tweakers/api/tweaker#속성) | 표시 여부 |
