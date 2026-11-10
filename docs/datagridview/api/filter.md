---
title: 필터 (filterId)
---

# 필터 (filterId) <Badge type="info" text="원본 분석" />

필터는 그리드 옵션이 아니라 **TreeDocument** 에 지정합니다. 지정한 컬럼만 헤더에 필터 기능이 생깁니다.

```js
treeDocument.setFilterModel({
  label: { filterId: 'stringRegexp' },
  status: { filterId: 'set' },
  qty: { filterId: 'number' }
});
```

::: warning
첫 트리 컬럼(`dataIndex: 'tree'`)의 키는 `tree` 가 아니라 `label` 입니다.
:::

::: info 근거
TreeModel.js 의 TreeDocument.setFilterModel, DataGridView.js 의 DataGridViewFilterViewManager (filterId 와 필터 화면 등록 표), DataGridViewSetFilterView.
:::

사용 빈도는 webapps 전체 소스에서 센 값입니다.

| filterId | 필터 화면 | 사용 빈도 | 어울리는 컬럼 | 설명 |
| --- | --- | --- | --- | --- |
| <code>stringRegexp</code> | 문자열 입력 (정규식/와일드카드) | 248 | 품번, 이름 | ENOVIA 앱에서 가장 많이 사용 |
| <code>set</code> | 값 목록 체크박스 | 234 | 상태, 담당자 등 콤보 성격 | 데이터에 있는 값 목록이 자동으로 표시 |
| <code>string</code> | 문자열 포함 검색 | 32 | 설명, 비고 | 단순 포함 검색 |
| <code>number</code> | 숫자 범위 | 28 | 수량 | 최소~최대 |
| <code>numberWithCondition</code> | 숫자 조건 (=, >, &lt; ...) | 3 | 진행률, 수치 | 조건식 |
| <code>date</code> | 날짜 범위 | 17 | 날짜 | 시작~끝 |
| <code>dateWithCondition</code> | 날짜 조건 | 7 | 날짜 | 조건식 |
| <code>(사용자 정의)</code> | - | - | - | grid.getFilterViewManager().registerFilterView(...) 로 등록한 filterId (예: stringRole, superFilter) |
