# TODO

사양서 사이트(`docs/`) 보완 작업 목록입니다. 끝난 항목은 체크하거나 지웁니다.

## 서버에서 확인할 것

- [ ] `npm run docs:dev` 로 미리 보기: 제목 배지("서버 확인", "원본 분석") 때문에 브라우저 탭 제목이 이상해지지 않는지 확인. 이상하면 해당 페이지에 frontmatter `title` 추가
- [ ] 배지 기준 검토: 지금은 DataGridViewSample 을 링크하는 7개 페이지만 "서버 확인"
  - [ ] `datagridview/editing` : DataGridViewSample(02, 05)을 링크했지만 배지는 "원본 분석". 편집 동작을 서버에서 확인하면 "서버 확인"으로 변경
  - [ ] 그 밖에 서버에서 확인한 페이지가 있으면 배지 변경
- [ ] 확인 안 된 샘플을 서버에서 실행: EventsSample, UWASample, TweakersSample, ControlsSample, WidgetSample. 확인한 샘플을 링크하는 페이지는 배지를 "서버 확인"으로 변경하고 `guide/index.md` 의 "샘플 소스" 설명도 수정

## 실무 검증: 샘플 작성 후 서버에서 확인

실무에서 제대로 동작해야 하는 기능입니다. 샘플을 만들고 서버에서 실행해 확인합니다.

- [ ] `datagridview/save-and-reflect` : 그리드 편집 → 저장 → 반영, 실패 시 되돌리기 (updateOptions, 변경 트랜잭션 모드)
- [ ] `rest-api/documents` : 3DSpace 문서 조회 / 생성 (modeler/documents)
- [ ] 위젯 간 통신
  - [ ] `widget/platform-api` : publish / subscribe, 사용자 정보
  - [ ] `uwa/intercom` : 위젯끼리 메시지
- [ ] 선택, Promise, 주소
  - [ ] `events/selection` : CSOManager
  - [ ] `uwa/promise` : UWA/Promise
  - [ ] `widget/widget-services` : 3DSpace 주소 보조 함수

## 실무 검증: 추정 사양 확인

문서 본문에 <검증 필요> 배지가 붙은 문장(원본에서 확인하지 못한 추정, 107 곳)입니다. 확인하면 배지를 지우고 문장을 단정형으로 고칩니다. 괄호 안은 배지 수입니다.

- [ ] ui-components (28): `settings` 10, `url-parameters` 7, `command-menu` 4, `table` 3, `portal-channel` 2, `webform` 2
- [ ] schema (22): `conventions` 7, `mql` 7, `policy` 5, `admin` 2, `index` 1
- [ ] jpo (19): `args` 5, `domain-object` 4, `i18n-exception` 4, `transaction-context` 3, `mql-util` 2, `index` 1
- [ ] trigger (11): `generator` 3, `lifecycle` 3, `index` 2, `register` 2, `jpo-args` 1
- [ ] widget (10): `index` 2, `preferences` 2, `space-url` 2, `widget-api` 2, `compass-services` 1, `platform-api` 1
- [ ] properties (7): `system-settings` 5, `string-resource` 2
- [ ] events (4): `selection` 2, `drag-and-drop` 1, `index` 1
- [ ] rest-api (3): `index` 2, `security-context` 1
- [ ] amd (1) `webapps-utils`, controls (1) `index`, uwa (1) `intercom`

## 문서 보완

- [x] FAQ / 트러블슈팅 페이지: `guide/faq.md` (증상별 6 묶음)

## 저장소

- [ ] `develop` 의 변경을 `master` 에 반영해 사이트 배포 (`master` push 시 GitHub Actions 가 배포)
