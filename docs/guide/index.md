# 소개

ENOVIA(3DEXPERIENCE) 는 개발 사양서를 제공하지 않고, webapps 소스는 난독화(minify)되어 있어 사용법을 알기 어렵습니다. 이 문서는 원본 소스(3DSpace 서버의 mql, JPO, JSP, properties 와 webapps)를 직접 분석해서 **기존 기능을 어떻게 불러 쓰는지**(API, 모듈 구조, 호출 방식)를 정리한 사양서입니다.

처음이라면 [처음 읽는 순서](/guide/roadmap) 부터 보세요.

## 문서 구성

문서는 두 분야로 나뉩니다. 상단 메뉴의 같은 이름에서 고릅니다.

| 분야 | 다루는 것 | 문서 |
| --- | --- | --- |
| 3DSpace 서버 | 데이터 모델과 MQL, 화면 정의(command, table, webform ...), JPO, 트리거, properties | [데이터 모델](/schema/), [UI 구성 요소](/ui-components/), [JPO](/jpo/), [트리거](/trigger/), [properties](/properties/) |
| webapps | 3DDashboard 위젯과 브라우저 화면. AMD 로딩, 위젯, UWA, 화면 컨트롤, 이벤트, REST API, DataGridView, Tweakers | [AMD](/amd/), [위젯](/widget/), [UWA](/uwa/), [컨트롤](/controls/), [이벤트](/events/), [REST API](/rest-api/), [DataGridView](/datagridview/), [Tweakers](/tweakers/) |

분야 안의 각 주제는 대체로 아래 순서로 페이지를 둡니다.

| 구분 | 내용 |
| --- | --- |
| 개요 | 무엇인지, 전체 구조, 무엇을 쓸지 |
| 가이드 | 자주 하는 작업별 설명과 예제 |
| 레퍼런스 | 설정 키, 옵션, 인자, 이벤트 전체 표. 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)으로 키 이름을 바로 찾을 수 있습니다 |

## 근거와 버전 표시

- 내용은 **enovia2025 원본** 을 기준으로 합니다. 서버 쪽은 `mql/`, `jpo/`, `properties/`, `3dspace/common/*.jsp`, webapps 쪽은 `3dspace/webapps/` 입니다. 부족한 부분은 2026 버전(webapps)으로 보완합니다.
- 페이지마다 근거가 된 원본 파일을 적어 둡니다.

::: info 근거
이런 상자에 근거가 된 원본 파일과 함수를 적습니다.
:::

- 한쪽 버전에만 있는 키는 배지로 표시합니다.
  - <Badge type="warning" text="2026" /> 2026 에만 있음
  - <Badge type="tip" text="2025" /> 2025 에만 있음 (2026 에서 빠짐)
- 페이지 제목 옆 배지는 내용을 어디까지 확인했는지 나타냅니다.
  - <Badge type="tip" text="서버 확인" /> 관련 샘플을 ENOVIA 서버에서 실행해 동작을 확인함
  - <Badge type="info" text="원본 분석" /> 원본 소스 분석으로만 작성함. 실제 동작이 다르면 원본 쪽이 맞음

## 샘플 소스

문서의 예제는 샘플 소스에서 가져왔습니다. 샘플은 저장소의 주제별 폴더에 있습니다.

| 모듈 | 샘플 폴더 |
| --- | --- |
| DataGridView | [DataGridViewSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/DataGridViewSample) |
| Tweakers | [TweakersSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/TweakersSample) |
| UWA | [UWASample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/UWASample) |
| 화면 컨트롤 | [ControlsSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/ControlsSample) |
| 이벤트, 끌어 놓기 | [EventsSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/EventsSample) |
| 위젯 | [WidgetSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/WidgetSample) |
| 데이터 모델 / MQL | [SchemaSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/SchemaSample) |
| UI 구성 요소 | [UIComponentSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/UIComponentSample) |
| JPO | [JPOSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/JPOSample) |
| 트리거 | [TriggerSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/TriggerSample) |

- 서버에서 동작을 확인한 것은 DataGridViewSample 입니다. 그 밖의 샘플은 원본 소스 분석으로 작성했고 아직 서버에서 확인하지 않았습니다. 다르게 동작하면 원본 쪽이 맞습니다.
- 화면 샘플(`*.html`)은 `<3DSpace>/webapps/` 아래에 폴더째 넣고 서버 주소로 엽니다. 형제 폴더의 `AmdLoader`, `Core` 등을 상대 경로로 불러오기 때문입니다.
- 서버 샘플(`*.mql`, `*_mxJPO.java`)은 형식 예시입니다. 이름(`XX_` 접두어)을 프로젝트 규칙에 맞게 바꿔서 씁니다.

## 익명화

원본의 사내 고유 정보(서버 주소, 계정, 고객사/프로젝트명, 고유 스키마명 등)는 옮기지 않고 일반적인 이름으로 바꿔서 적습니다.
