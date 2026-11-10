# TODO

사양서 사이트(`docs/`) 보완 작업 목록입니다. 끝난 항목은 체크하거나 지웁니다.

## 서버에서 확인할 것

- [ ] `npm run docs:dev` 로 미리 보기: 제목 배지("서버 확인", "원본 분석") 때문에 브라우저 탭 제목이 이상해지지 않는지 확인. 이상하면 해당 페이지에 frontmatter `title` 추가
- [ ] 배지 기준 검토: 지금은 DataGridViewSample 을 링크하는 7개 페이지만 "서버 확인"
  - [ ] `datagridview/editing` : DataGridViewSample(02, 05)을 링크했지만 배지는 "원본 분석". 편집 동작을 서버에서 확인하면 "서버 확인"으로 변경
  - [ ] 그 밖에 서버에서 확인한 페이지가 있으면 배지 변경
- [ ] 확인 안 된 샘플을 서버에서 실행: EventsSample, UWASample, TweakersSample, ControlsSample, WidgetSample. 확인한 샘플을 링크하는 페이지는 배지를 "서버 확인"으로 변경하고 `guide/index.md` 의 "샘플 소스" 설명도 수정

## 문서 보완

- [ ] FAQ / 트러블슈팅 페이지: 각 페이지 `warning` 상자에 흩어진 "자주 틀리는 점"을 한 페이지로 모으기
- [ ] 2025 / 2026 차이 페이지: 원본 비교 분석 필요 (예: DataGridView 의 getTreeDocument, getActiveCellID 등이 2026 에서 CollectionView 로 옮겨짐)
- [ ] 샘플이 없는 페이지에 샘플 작성
  - [ ] `datagridview/save-and-reflect` (updateOptions, 변경 트랜잭션 모드)
  - [ ] `events/selection` (CSOManager)
  - [ ] `rest-api/documents` (modeler/documents)
  - [ ] `uwa/intercom`
  - [ ] `uwa/promise` (UWA/Promise)
  - [ ] `widget/platform-api`
  - [ ] `widget/widget-services`

## 저장소

- [ ] `develop` 의 변경을 `master` 에 반영해 사이트 배포 (`master` push 시 GitHub Actions 가 배포)
