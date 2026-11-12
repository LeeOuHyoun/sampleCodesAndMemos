# TODO

사양서 사이트(`docs/`) 보완 작업 목록입니다. 끝난 항목은 체크하거나 지웁니다.

## 서버에서 확인할 것

- [ ] `npm run docs:dev` 로 미리 보기: 제목 배지("서버 확인", "원본 분석") 때문에 브라우저 탭 제목이 이상해지지 않는지 확인. 이상하면 해당 페이지에 frontmatter `title` 추가
- [x] 샘플 코드 불러오기 확인 (2026-11-12, `vitepress build` 결과를 브라우저로 열어 06 ~ 15 를 쓰는 페이지에 `#region` 이 새지 않고 코드가 보이는 것을 확인): 샘플 코드 불러오기(`<<< @/../DataGridViewSample/...#범위{js}`)가 제대로 보이는지 확인. 대상은 `datagridview/tree`, `cell-functions`, `context-menu`, `custom-cell`, `status-bar`. 코드 대신 파일 전체나 "not found" 가 보이면 범위 이름이나 경로가 틀린 것
- [ ] DataGridViewSample 06 ~ 10 을 서버에서 실행 (원본 분석으로만 작성). 확인하면 링크하는 페이지의 배지를 "서버 확인" 으로 변경하고 `DataGridViewSample/index.html`, `datagridview/index.md`, `guide/index.md` 의 "06 ~ 10 은 확인하지 않았습니다" 문장 수정
  - [ ] `06_tree.html` → `datagridview/tree` : 펼칠 때 불러오기(`useAsyncPreExpand`, `preExpandDone`), 행 아이콘 / 배지 모양, 끝 행에 `addChild` 했을 때 펼침 아이콘
  - [ ] `07_columnFunctions.html` → `datagridview/cell-functions` : 수량을 편집하면 금액 셀이 다시 계산되는지, 계산 컬럼 정렬, 헤더 셀에서 컬럼 함수가 호출되는지
  - [ ] `08_contextMenu.html` → `datagridview/context-menu` : 메뉴 항목 형식(`state`, `submenu`), 메뉴 버튼 컬럼이 같은 메뉴를 여는지, `getXSO().onEmpty`
  - [ ] `09_save.html` → `datagridview/save-and-reflect` : 저장 중 변경 표시, 실패 시 되돌리기, 변경 트랜잭션 모드의 추가 / 삭제 표시
  - [ ] `10_customCell.html` → `datagridview/custom-cell`, `status-bar` : 스크롤할 때 셀 내용 재사용, 칩 클릭 후 다시 그려지는지, 상태바 자동 갱신과 `updateNodeModel`
- [ ] 스크린샷 추가 (서버 화면을 직접 찍어야 함): `02_cellTypes.html` 전체 화면 → `datagridview/cell-types` "한눈에 보기" 위, `05_options.html` 에서 `editionPolicy` 별 화면 → `datagridview/editing`. 이미지는 `docs/public/datagridview/` 에 넣고 `![설명](/datagridview/파일.png)` 로 넣음
- [ ] 배지 기준 검토: 지금은 DataGridViewSample 을 링크하는 7개 페이지만 "서버 확인"
  - [ ] `datagridview/editing` : DataGridViewSample(02, 05)을 링크했지만 배지는 "원본 분석". 편집 동작을 서버에서 확인하면 "서버 확인"으로 변경
  - [ ] 그 밖에 서버에서 확인한 페이지가 있으면 배지 변경
- [ ] DataGridViewSample 11 ~ 15 를 ENOVIA 서버에서 실행. 원본 webapps 파일을 로컬에서 띄워 Edge 로 동작은 확인했음 (배지 "로컬 실행 확인"). 서버에서도 같으면 배지를 "서버 확인" 으로 변경. 로컬에서 확인하지 못한 것:
  - [ ] `12_header.html` → `datagridview/header`, `api/layout-methods` : 터치 모드의 헤더 높이, 헤더에 마우스를 올렸을 때 툴팁
  - [ ] `14_rowGrouping.html` → `datagridview/row-grouping` : 트리 데이터와 `depth`, `mapGroupingKeys`, `canNodeBeGrouped`, 필터와 같이 쓸 때
  - [ ] `11_dragDrop.html` → `datagridview/drag-and-drop` : 마우스를 올렸을 때 손잡이 표시, 컬럼 헤더 끌기, 자동 스크롤, 다른 위젯과 주고받기 (3DXContent)
  - [ ] `13_customViews.html` → `datagridview/custom-views` : `useWidgetPreferencesFlag: true` (위젯 설정 저장, 2025 의 삭제 문제)
  - [ ] `15_serverSide.html` → `datagridview/server-side` : 그룹핑 응답 모양, 컬럼 필터의 `filterModel`, `pushUpdatesNotifications`
- [x] 사이트 검색 확인: `HeaderHeight`, `Tooltip`, `VisibleFlag` 처럼 키 이름의 일부로 검색됨 (빌드 결과로 확인)
- [ ] 확인 안 된 샘플을 서버에서 실행: EventsSample, UWASample, TweakersSample, ControlsSample, WidgetSample. 확인한 샘플을 링크하는 페이지는 배지를 "서버 확인"으로 변경하고 `guide/index.md` 의 "샘플 소스" 설명도 수정

## 실무 검증: 샘플 작성 후 서버에서 확인

실무에서 제대로 동작해야 하는 기능입니다. 샘플을 만들고 서버에서 실행해 확인합니다.

- [ ] `datagridview/save-and-reflect` : 그리드 편집 → 저장 → 반영, 실패 시 되돌리기 (updateOptions, 변경 트랜잭션 모드). 샘플 `DataGridViewSample/09_save.html` 작성함, 서버 확인만 남음
- [ ] `rest-api/documents` : 3DSpace 문서 조회 / 생성 (modeler/documents)
- [ ] 위젯 간 통신
  - [ ] `widget/platform-api` : publish / subscribe, 사용자 정보
  - [ ] `uwa/intercom` : 위젯끼리 메시지
- [ ] 선택, Promise, 주소
  - [ ] `events/selection` : CSOManager
  - [ ] `uwa/promise` : UWA/Promise
  - [ ] `widget/widget-services` : 3DSpace 주소 보조 함수

## 실무 검증: 추정 사양 확인

문서 본문에 <검증 필요> 배지가 붙은 문장(원본에서 확인하지 못한 추정, 144 곳)입니다. 확인하면 배지를 지우고 문장을 단정형으로 고친 뒤 `npm run docs:verify-list` 로 `docs/guide/verify-list.md` 를 다시 만듭니다. 문장별 목록은 그 페이지에 있습니다. 괄호 안은 배지 수입니다.

- [ ] server-java (18): `rest-service` 6, `mail` 4, `scheduler` 4, `index` 3, `external-db` 1
- [ ] deploy (10): `index` 10 (JPO 컴파일 명령, 재시작 필요 여부, jar 위치 등)
- [ ] ui-components (28): `settings` 10, `url-parameters` 7, `command-menu` 4, `table` 3, `portal-channel` 2, `webform` 2
- [ ] schema (22): `conventions` 7, `mql` 7, `policy` 5, `admin` 2, `index` 1
- [ ] jpo (13): `args` 5, `domain-object` 3, `transaction-context` 2, `i18n-exception` 1, `mql-util` 1, `index` 1
- [ ] trigger (11): `generator` 3, `lifecycle` 3, `index` 2, `register` 2, `jpo-args` 1
- [ ] widget (22): `dashboard-register` 12, `index` 2, `preferences` 2, `space-url` 2, `widget-api` 2, `compass-services` 1, `platform-api` 1
- [ ] properties (7): `system-settings` 5, `string-resource` 2
- [ ] events (4): `selection` 2, `drag-and-drop` 1, `index` 1
- [ ] rest-api (3): `index` 2, `security-context` 1
- [ ] amd (1) `webapps-utils`, controls (1) `index`, uwa (1) `intercom`
- [ ] datagridview (3): `server-side` 1, `custom-views` 1, `header` 1 (나머지 11 곳은 샘플 실행으로 확인해 지움)

## 문서 보완

- [x] FAQ / 트러블슈팅 페이지: `guide/faq.md` (증상별 6 묶음)
- [x] 찾아보기 보강: 홈 표 누락 보완, API 레퍼런스 메뉴, `guide/module-index.md`, `guide/verify-list.md`, `guide/glossary.md`
- [x] 서버 반영 절차: `deploy/index.md`
- [x] 서버 Java: `server-java/` (개요, 커스텀 REST 서비스, 스케줄러, 외부 DB, 메일)
- [x] 위젯을 3DDashboard 에 등록하는 방법: `widget/dashboard-register.md` (배포 위치, Run Your App, Additional App)
- [x] 주제 개요 페이지의 "이 섹션의 문서" 표 형식 통일
- [x] DataGridView 보완: 트리, 컬럼 함수, 우클릭 메뉴와 선택, 셀 직접 그리기, 상태바 가이드와 샘플 06 ~ 10, 레퍼런스 표 정리, 사용 파일 수, `npm run docs:coverage`
- [x] DataGridView 남은 분석: 헤더와 컬럼 그룹(`header`), 행 그룹핑(`row-grouping`), 드래그앤드롭(`drag-and-drop`), 서버 사이드(`server-side`), 사용자 뷰(`custom-views`), 레이아웃 메서드(`api/layout-methods`)
- [x] DataGridView 찾아보기: 이름 색인(`api/key-index`, `npm run docs:dgv-index`), 개요의 "하고 싶은 일로 찾기", 사이드바 묶음 나누기, 키 이름 일부로 검색
- [x] DataGridView 새 가이드의 샘플 작성: 11 드래그앤드롭, 12 헤더와 컬럼, 13 사용자 뷰, 14 행 그룹핑, 15 서버 사이드. 가이드 예제는 샘플에서 불러옴
- [x] 모든 샘플의 그리드 담는 요소에 `position: relative` 추가 (없으면 그리드가 페이지 전체를 덮음)
- [ ] DataGridView 남은 이름 (`npm run docs:coverage`): 페이지 나누기(`paginationManager`) 가이드, 찾기(`setFindStr`) 가이드, 일괄 수정, 인쇄
- [ ] DataGridView 기존 가이드(기본 그리드, 셀 타입, 툴바, 정렬과 필터)의 예제 코드도 샘플에서 불러오도록 변경. 새 가이드에서 불러오기가 제대로 보이는 것을 확인한 뒤에 진행
- [ ] server-java 남은 분석: Slack 알림, 독립 실행 이관 프로그램 내부
- [ ] server-java, deploy 샘플 폴더 (ServerJavaSample) 작성

## 저장소

- [ ] `develop` 의 변경을 `master` 에 반영해 사이트 배포 (`master` push 시 GitHub Actions 가 배포)
