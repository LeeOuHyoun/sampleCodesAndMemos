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
├─ scripts/coverage.mjs      원본과 문서를 비교해 빠진 이름 찾기
├─ scripts/key-index.mjs     DataGridView, Tweakers 이름 색인 (A-Z) 생성
├─ scripts/docs-utils.mjs    위 스크립트들이 같이 쓰는 함수
├─ scripts/samples-server.mjs   샘플을 ENOVIA 서버 없이 로컬에서 띄우는 서버
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
   - DataGridView, Tweakers 레퍼런스(`docs/주제/api/`)의 표를 고쳤으면 `npm run docs:key-index` 로 이름 색인(`api/key-index.md`)을 다시 만듭니다. 그 페이지는 직접 고치지 않습니다.
   - DataGridView 가이드를 추가했으면 [개요의 "하고 싶은 일로 찾기"](/datagridview/#하고-싶은-일로-찾기) 표에도 한 줄을 넣습니다.
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

## 샘플 코드를 문서에 불러오기

가이드의 예제 코드는 문서에 다시 적지 않고 샘플 파일에서 불러옵니다. 샘플을 고치면 문서도 같이 바뀌므로 둘이 어긋나지 않습니다.

샘플 파일에서 보여줄 범위를 `#region 이름` 주석으로 감쌉니다.

```js
// #region data
var treeDocument = new TreeDocument();
// #endregion data
```

문서에서는 `<<<` 로 그 범위를 불러옵니다. `@` 는 `docs/` 폴더이고, 중괄호 안은 코드 색칠에 쓸 언어입니다.

```md
<<< @/../DataGridViewSample/06_tree.html#data{js}
```

- 범위 이름은 영문, 숫자, `-`, `_` 만 씁니다.
- 지금은 DataGridView 의 가이드 중 트리 구조, 컬럼 함수, 우클릭 메뉴와 선택, 셀 직접 그리기, 상태바, 드래그앤드롭, 헤더, 레이아웃 메서드, 사용자 뷰, 행 그룹핑, 서버 사이드 데이터가 이 방식입니다.
- region 안에는 주석을 넣지 않습니다. 설명은 region 바로 위 블록 주석에 씁니다 (문서에는 region 안만 보입니다).
- 샘플에서 그리드를 담는 요소에는 높이와 `position: relative` 를 꼭 줍니다. 그리드는 높이 기본값(`'inherit'`)일 때 자신을 `position: absolute` 로 놓아서, 없으면 페이지 전체를 덮습니다.

## 원본과 문서 비교 (빠진 이름 찾기)

```sh
npm run docs:coverage
npm run docs:coverage -- <webapps 폴더 경로>
```

원본 `DataGridView/DataGridView.js` 에서 그리드 옵션, 그리드 메서드, layoutOptions, 레이아웃 메서드, 컬럼 옵션과 컬럼 함수 이름을, `CollectionView/CollectionView.js` 에서 상속받는 옵션과 메서드 이름을 뽑아서 `docs/datagridview/` 에 한 번도 나오지 않는 이름을 출력합니다. 이름 앞의 숫자는 DataGridView 를 쓰는 앱 파일 중 그 이름이 나오는 파일 수라서, 숫자가 큰 것부터 문서에 보태면 됩니다.

- 경로를 주지 않으면 저장소 옆의 `../enovia2025/3dspace/webapps` 를 읽습니다. 2026 과 비교하려면 2026 webapps 경로를 줍니다.
- 원본이 들여쓰기된 상태(코드 정리 도구로 줄을 나눈 상태)여야 합니다. 한 줄로 붙은 원본에서는 이름을 뽑지 못합니다.
- 남는 이름이 모두 문서에 있어야 하는 것은 아닙니다. 내부용 함수도 섞여 있으므로 사용 파일 수를 보고 고릅니다.
- 컬럼 정의에서 직접 읽는 키(`customHeader`, `columnGroupShow` 처럼 기본값 표에 없는 것)는 이 스크립트가 찾지 못합니다. 원본에서 컬럼 객체를 읽는 코드를 따로 봐야 합니다.
- 상속 옵션, 상속 메서드는 클래스가 `name: "CollectionView"` 형태로 정의된 2025 원본에서만 뽑힙니다.
- 문서의 "사용" 칸(그리드 옵션, 컬럼 함수)도 같은 기준(이름이 나오는 앱 파일 수)으로 센 값입니다.

## 샘플을 내 PC 에서 실행하기

```sh
npm run samples
npm run samples -- <webapps 폴더 경로>
```

저장소 옆의 `../enovia2025/3dspace/webapps` 와 `*Sample` 폴더를 한 서버로 묶어 `http://127.0.0.1:8080/webapps/DataGridViewSample/index.html` 같은 주소로 열 수 있게 합니다. ENOVIA 서버 없이 DataGridView 같은 화면 컨트롤이 실제로 동작합니다. 3DSpace 서버를 부르는 부분(WAFData 등)과 위젯 객체(`widget`)가 필요한 샘플은 동작하지 않습니다. 포트는 `PORT=9000 npm run samples` 로 바꿉니다.

## 내 PC 에서 미리 보기

```sh
npm install
npm run docs:dev
```

브라우저에서 터미널에 표시된 주소(기본 `http://localhost:5173/sampleCodesAndMemos/`)를 열면 파일을 저장할 때마다 바로 반영됩니다.

## 배포

`master` 에 push 하면 `.github/workflows/deploy-docs.yml` 이 사이트를 빌드해서 GitHub Pages 에 올립니다. 진행 상황은 저장소의 **Actions** 탭에서 볼 수 있습니다.
