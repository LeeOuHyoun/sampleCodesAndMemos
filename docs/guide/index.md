# 소개

ENOVIA(3DEXPERIENCE) 의 webapps 소스는 난독화(minify)되어 있어 공식 문서 없이 사용법을 알기 어렵습니다. 이 문서는 원본 소스를 직접 분석해서 **기존 기능을 어떻게 불러 쓰는지**(API, 모듈 구조, 호출 방식)를 정리한 사양서입니다.

## 문서 구성

모듈마다 아래 세 부분으로 나눕니다.

| 구분 | 내용 |
| --- | --- |
| 시작하기 | 모듈이 무엇인지, 최소 구성으로 띄우는 방법 |
| 가이드 | 자주 하는 작업별 설명과 예제 (셀 타입, 편집, 저장 후 반영 등) |
| API 레퍼런스 | 옵션, 함수, 이벤트 전체 표. 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)으로 키 이름을 바로 찾을 수 있습니다 |

## 근거와 버전 표시

- 내용은 **enovia2025 webapps 원본** 을 기준으로 합니다. 원본에서 부족한 부분은 2026 버전으로 보완합니다.
- 페이지마다 근거가 된 원본 파일을 적어 둡니다.

::: info 근거
이런 상자에 근거가 된 원본 파일과 함수를 적습니다.
:::

- 한쪽 버전에만 있는 키는 배지로 표시합니다.
  - <Badge type="warning" text="2026" /> 2026 에만 있음
  - <Badge type="tip" text="2025" /> 2025 에만 있음 (2026 에서 빠짐)

## 샘플 소스

문서의 예제는 실제로 동작을 확인한 샘플 소스에서 가져왔습니다. 샘플은 저장소의 모듈별 폴더에 있습니다.

| 모듈 | 샘플 폴더 |
| --- | --- |
| DataGridView | [DataGridViewSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/DataGridViewSample) |
| Tweakers | [TweakersSample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/TweakersSample) |
| UWA | [UWASample](https://github.com/LeeOuHyoun/sampleCodesAndMemos/tree/master/UWASample) |

::: warning 샘플은 ENOVIA 서버에서만 동작합니다
샘플은 형제 폴더의 `AmdLoader`, `Core` 등을 상대 경로로 불러옵니다. `<3DSpace>/webapps/` 아래에 폴더째 넣고 서버 주소로 열어야 합니다.
:::

## 익명화

원본의 사내 고유 정보(서버 주소, 계정, 고객사/프로젝트명, 고유 스키마명 등)는 옮기지 않고 일반적인 이름으로 바꿔서 적습니다.
