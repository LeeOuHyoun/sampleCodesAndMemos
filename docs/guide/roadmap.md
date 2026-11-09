# 처음 읽는 순서

ENOVIA 개발이 처음이라면 아래 순서로 읽습니다. 화면 하나는 보통 **데이터 정의(MQL) → 화면 정의(command, table, webform) → 서버 코드(JPO)** 로 만들어지고, 필요할 때 브라우저 쪽 화면(webapps)을 더합니다.

## 큰 그림

```
브라우저
 ├─ 3DSpace 고전 화면 (JSP)          ← command, menu, table, webform, portal 정의로 조립
 │    └─ 서버의 JPO 를 호출           ← 목록 조회, 열 값, 권한, 저장
 └─ 3DDashboard 위젯 (webapps)       ← AMD 모듈 + UWA + WebUX 컨트롤
      └─ 3DSpace REST API 호출       ← WAFData.authenticatedRequest

3DSpace 서버
 ├─ 스키마: type, attribute, policy, relationship, role   (mql/)
 ├─ UI 정의: command, menu, table, webform, portal        (mql/)
 ├─ JPO: *_mxJPO.java                                      (jpo/)
 ├─ 트리거: 생성, 수정, promote 때 JPO 실행                 (mql/12.trigger)
 └─ properties: 다국어 문자열, 시스템 설정                   (properties/)
```

## 1 단계: 3DSpace 서버 (먼저)

| 순서 | 문서 | 알게 되는 것 |
| --- | --- | --- |
| 1 | [데이터 모델 / MQL](/schema/) | type, attribute, policy, relationship 이 무엇이고 어떻게 정의하는지 |
| 2 | [mql 폴더 작성 규칙](/schema/conventions) | 이 프로젝트에서 MQL 파일을 쓰는 방법과 팀 규칙 |
| 3 | [UI 구성 요소](/ui-components/) | 메뉴, 목록, 상세 화면이 어떻게 조립되는지 |
| 4 | [settings 레퍼런스](/ui-components/settings) | command, table, webform 에 넣는 설정 키 |
| 5 | [JPO 개요](/jpo/) → [인자 구조](/jpo/args) | 화면에서 부르는 서버 코드의 모양과 인자 |
| 6 | [DomainObject 와 select](/jpo/domain-object) | 객체 조회, 관계 탐색, 값 저장 |
| 7 | [트리거](/trigger/) | 생성, 수정, 상태 변경 때 실행되는 검사와 후처리 |
| 8 | [properties](/properties/) | 다국어 문자열과 설정 키 |

## 2 단계: webapps (위젯을 만들 때)

| 순서 | 문서 | 알게 되는 것 |
| --- | --- | --- |
| 1 | [AMD 로딩](/amd/) | 모듈 이름 규칙, `i18n!` / `css!` 플러그인 |
| 2 | [위젯과 플랫폼](/widget/) | `widget` 객체, 설정, 3DSpace 주소와 보안 컨텍스트 얻기 |
| 3 | [UWA 개요](/uwa/) | 기반 라이브러리와 자주 틀리는 동작 |
| 4 | [서버 호출](/uwa/request) → [REST API](/rest-api/) | WAFData 로 3DSpace REST 호출, CSRF 토큰 |
| 5 | [화면 컨트롤](/controls/) | 버튼, 입력칸, 다이얼로그, 알림 |
| 6 | [DataGridView](/datagridview/) | 목록 / 트리 그리드 |
| 7 | [이벤트, 선택, 끌어 놓기](/events/) | 위젯 간 연동, 다른 위젯에서 끌어 온 객체 받기 |

## 막혔을 때

- 키 이름, 함수 이름은 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)으로 찾습니다.
- 각 페이지의 "근거" 상자에 원본 파일이 적혀 있습니다. 문서와 실제 동작이 다르면 원본이 맞습니다.
- 문서에 없는 것은 "아직 분석하지 않음" 일 뿐 "없음" 이 아닙니다.
