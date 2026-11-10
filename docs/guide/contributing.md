# 문서 추가 방법

이 사이트는 [VitePress](https://vitepress.dev/) 로 만듭니다. 페이지는 `docs/` 아래의 마크다운(`.md`) 파일이고, `master` 에 push 하면 GitHub Actions 가 자동으로 배포합니다.

## 폴더 구조

```
sampleCodesAndMemos/
├─ docs/
│  ├─ .vitepress/config.mjs   상단 메뉴, 왼쪽 메뉴 설정
│  ├─ index.md               홈 (분야별 문서 표, 하고 싶은 일로 찾기)
│  ├─ guide/                 이 문서에 대해, 처음 읽는 순서, 찾아보기
│  │
│  ├─ schema/                3DSpace 서버: 데이터 모델 / MQL
│  ├─ ui-components/         3DSpace 서버: command, table, webform ...
│  ├─ jpo/                   3DSpace 서버: JPO
│  ├─ trigger/, properties/  3DSpace 서버: 트리거, properties
│  ├─ server-java/, deploy/  3DSpace 서버: JPO 밖의 Java, 서버 반영 절차
│  │
│  ├─ amd/, widget/          webapps: AMD 로딩, 위젯과 플랫폼
│  ├─ uwa/, controls/        webapps: UWA, 화면 컨트롤
│  ├─ events/, rest-api/     webapps: 이벤트, REST API
│  └─ datagridview/          webapps: 주제 하나 = 폴더 하나
│     ├─ index.md            개요
│     ├─ cell-types.md       가이드 페이지
│     └─ api/                레퍼런스
├─ DataGridViewSample/ ...   주제별 샘플 (주제이름Sample)
├─ scripts/verify-list.mjs   검증 대기 목록 생성
└─ package.json
```

## 기존 주제에 페이지 추가

1. 주제 폴더(예: `docs/jpo/`) 아래에 `새페이지.md` 를 만듭니다.
2. `docs/.vitepress/config.mjs` 의 `sidebar['/jpo/']` 에서 알맞은 묶음에 한 줄을 추가합니다.

```js
{ text: '새 페이지 제목', link: '/jpo/새페이지' }
```

3. 자주 찾을 페이지면 홈(`docs/index.md`)의 분야별 표나 "하고 싶은 일로 찾기" 표에도 링크를 넣습니다.
4. 새 webapps 모듈(`DS/폴더/모듈`)을 다루면 [모듈 경로 색인](/guide/module-index) 에 한 줄을 추가합니다.
5. 처음 나오는 용어는 [용어집](/guide/glossary) 에 한 줄을 추가합니다.

## 새 주제 추가

1. `docs/주제이름/index.md` 를 만듭니다 (폴더 이름은 소문자, 단어는 `-` 로 연결).
2. `config.mjs` 에 추가합니다.
   - `nav` 의 "3DSpace 서버" 또는 "webapps" 목록
   - `nav` 의 "API 레퍼런스" 목록 (레퍼런스 페이지가 있으면)
   - `sidebar['/주제이름/']` 묶음
3. 홈(`docs/index.md`)의 분야별 표에 한 줄을 추가합니다.
4. [처음 읽는 순서](/guide/roadmap) 에 넣을 만하면 순서 표에도 추가합니다.

## 자주 쓰는 표기

````md
::: info 근거
DataGridView.js 의 DataGridViewLayout.getDefaultCellHeight
:::

::: tip
도움말
:::

::: warning
주의할 점
:::

키 이름 <Badge type="warning" text="2026" />

```js
var grid = new DataGridView({ ... });
```
````

- 페이지 제목(`#`) 끝에 확인 상태 배지를 붙입니다. 새 페이지는 `<Badge type="info" text="원본 분석" />` 로 시작하고, 관련 샘플을 서버에서 실행해 확인하면 `<Badge type="tip" text="서버 확인" />` 로 바꿉니다.
- 원본에서 확인하지 못하고 추정한 사양("~것으로 보입니다")은 문장 뒤에 `<Badge type="danger" text="검증 필요" />` 를 붙입니다. 서버에서 확인하면 배지를 지우고 문장을 단정형으로 고칩니다.
- 배지를 붙이거나 지운 뒤에는 `npm run docs:verify-list` 를 실행해 [검증 대기 목록](/guide/verify-list) 을 다시 만듭니다. 그 페이지는 직접 고치지 않습니다.
- `::: warning` 으로 자주 틀리는 점을 새로 쓰면 [자주 틀리는 점](/guide/faq) 의 증상별 표에도 한 줄 추가하고 그 절로 링크합니다.
- `##`, `###` 제목은 오른쪽 "이 페이지에서" 목차에 나타납니다.
- 다른 페이지 링크는 `/datagridview/row-height` 처럼 `/` 로 시작하는 경로로 씁니다.
- 본문에 꺾쇠(`<`)나 중괄호 두 개를 그대로 쓰면 Vue 템플릿으로 해석되어 화면이 깨질 수 있습니다. 코드는 백틱(`` ` ``)이나 코드 블록으로 감쌉니다.

## 내 PC 에서 미리 보기

```sh
npm install
npm run docs:dev
```

브라우저에서 터미널에 표시된 주소(기본 `http://localhost:5173/sampleCodesAndMemos/`)를 열면 파일을 저장할 때마다 바로 반영됩니다.

## 배포

`master` 에 push 하면 `.github/workflows/deploy-docs.yml` 이 사이트를 빌드해서 GitHub Pages 에 올립니다. 진행 상황은 저장소의 **Actions** 탭에서 볼 수 있습니다.
