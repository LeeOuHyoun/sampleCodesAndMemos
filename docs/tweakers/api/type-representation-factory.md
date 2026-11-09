---
title: TypeRepresentationFactory API
---

# TypeRepresentationFactory API

타입 이름으로 편집기를 만들고, 사용자 타입과 enum 을 등록합니다. 사용법은 [사용자 타입 등록](/tweakers/custom-type), [편집기 단독 사용](/tweakers/standalone#타입-이름으로-만들기) 에 있습니다.

```js
var factory = new TypeRepresentationFactory();
factory.registerEnum('partStatus', ['작업중', '승인']);
factory.generateView('승인', { typePath: 'partStatus' }).then(function (tweaker) { tweaker.inject(el); });
```

::: info 근거
Tweakers.js 의 TypeRepresentationFactory, TypeRepresentationDirectory. DataGridView.js 의 getTypeRepresentationFactory
:::

## 생성자 옵션

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| <code>directory</code> | 전역 저장소 | 타입 저장소. 생략하면 모든 인스턴스가 같은 전역 저장소를 씀 |
| <code>preLoadTemplates</code> | <code>true</code> | 템플릿 모듈 미리 불러오기 |
| <code>onReady</code> | - | 미리 불러오기가 끝나면 호출. 끝난 뒤에 지정해도 바로 호출 |

## 이미 있는 인스턴스

| 얻는 곳 | 설명 |
| --- | --- |
| <code>grid.getTypeRepresentationFactory()</code> | 모든 DataGridView 가 공유하는 인스턴스 |
| <code>tree.getTypeRepresentationFactory()</code> | Tree 인스턴스별 |
| <code>toolbar.typeRepresentationFactory</code> | GeneratedToolbar 가 쓰는 인스턴스 |

저장소가 전역이므로 어느 인스턴스로 등록해도 결과는 같습니다.

## 메서드

| 메서드 | 반환 | 설명 |
| --- | --- | --- |
| <code>registerTypeRepresentations(obj)</code> | - | <code>{ 이름: { stdTemplate, inlinedTemplate?, semantics? } }</code> 등록. JSON 문자열도 받음. 이미 있는 이름은 무시 |
| <code>getRegisteredTypeRepresentation(name)</code> | 정의 / undefined | 등록된 타입 정의 |
| <code>registerEnum(name, values)</code> | - | enum 하나 등록. 배열 / 객체 / 함수 |
| <code>getRegisteredEnum(name)</code> | values | 등록된 enum |
| <code>registerTypeTemplates(obj)</code> | - | <code>{ 템플릿id: { path, options } }</code> 등록. <code>path</code> 없는 항목, 이미 있는 id 는 무시 |
| <code>getRegisteredTypeTemplate(id)</code> | <code>{ path, options }</code> | 등록된 템플릿 |
| <code>generateView(value, opts)</code> | Promise / - | 편집기 생성. 아래 참고 |
| <code>destroy()</code> | - | 재사용 목록 중 사용하지 않는 편집기 정리 |

여러 enum 을 한 번에 등록하는 메서드는 없습니다. 꼭 필요하면 `factory.options.directory.registerEnumerations({ 이름: 값, ... })` 를 씁니다.

## generateView

`generateView(value, opts)`. `onViewCreated` 와 `onFailure` 를 둘 다 생략하면 편집기를 결과로 주는 Promise 를 돌려줍니다.

| 키 | 설명 |
| --- | --- |
| <code>typePath</code> | 타입 이름, enum 이름, 또는 [typePath 문법](/tweakers/custom-type#typepath-문법) |
| <code>semantics</code> | 편집기 옵션. 타입 정의의 semantics 보다 우선 |
| <code>readOnly</code> | 읽기 전용. semantics 가 아니라 여기에 넣음 |
| <code>escapeHTML</code> | HTML 이스케이프. semantics 가 아니라 여기에 넣음 |
| <code>touchMode / icon / valueType</code> | 편집기 속성 |
| <code>context</code> | <code>'stdTemplate'</code> (기본) 또는 <code>'inlinedTemplate'</code> (한 줄 모양) |
| <code>onViewCreated(tweaker)</code> | 생성 완료 콜백 |
| <code>onFailure(err)</code> | 실패 콜백. <code>{ message, data, typePath, typeRep }</code> |

## 2026 버전 차이

| 항목 | 내용 |
| --- | --- |
| <code>getTemplateIdentifierFromTypeRep</code> | 인스턴스 메서드에서 static 으로 바뀜. <code>factory.getTemplateIdentifierFromTypeRep(...)</code> 은 2026 에서 오류 |
| <code>generateTweaker</code> | 템플릿이 준비되어 있으면 편집기를 바로 반환, 아니면 Promise |
| <code>getTweakerStaticHeight / getTweakerStaticStringFromValue</code> <Badge type="warning" text="2026" /> | 편집기를 만들지 않고 높이 / 표시 문자열 계산 |
| <code>directory</code> 의 부모 저장소 | 2025 에서는 부모 저장소 조회가 실제로 동작하지 않음. 2026 에서 고쳐짐 (기본 전역 저장소만 쓰면 영향 없음) |
