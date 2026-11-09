# 문서 추가 방법

이 사이트는 [VitePress](https://vitepress.dev/) 로 만듭니다. 페이지는 `docs/` 아래의 마크다운(`.md`) 파일이고, `master` 에 push 하면 GitHub Actions 가 자동으로 배포합니다.

## 폴더 구조

```
sampleCodesAndMemos/
├─ docs/
│  ├─ .vitepress/config.mjs   상단 메뉴, 왼쪽 메뉴 설정
│  ├─ index.md               홈
│  ├─ guide/                 이 문서에 대해
│  └─ datagridview/          모듈 하나 = 폴더 하나
│     ├─ index.md            개요
│     ├─ cell-types.md       가이드 페이지
│     └─ api/                API 레퍼런스
├─ DataGridViewSample/       실행 샘플 (ENOVIA 서버용)
└─ package.json
```

## 기존 모듈에 페이지 추가

1. `docs/datagridview/` 아래에 `새페이지.md` 를 만듭니다.
2. `docs/.vitepress/config.mjs` 의 `sidebar['/datagridview/']` 에서 알맞은 묶음에 한 줄을 추가합니다.

```js
{ text: '새 페이지 제목', link: '/datagridview/새페이지' }
```

## 새 모듈 추가

1. `docs/모듈이름/index.md` 를 만듭니다 (폴더 이름은 소문자 권장).
2. `config.mjs` 에 세 군데를 추가합니다.
   - `nav` 의 "모듈" 목록
   - `nav` 의 "API 레퍼런스" 목록 (API 페이지가 있으면)
   - `sidebar['/모듈이름/']` 묶음
3. 홈(`docs/index.md`)의 `features` 에 카드를 추가합니다.

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
