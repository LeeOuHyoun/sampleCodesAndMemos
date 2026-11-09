import { defineConfig } from 'vitepress'

const REPO = 'https://github.com/LeeOuHyoun/sampleCodesAndMemos'

export default defineConfig({
  lang: 'ko-KR',
  title: 'ENOVIA 분석 사양서',
  description: 'ENOVIA(3DEXPERIENCE) webapps 모듈 사용법 분석 문서',
  base: '/sampleCodesAndMemos/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '이 문서에 대해', link: '/guide/', activeMatch: '/guide/' },
      {
        text: '모듈',
        items: [
          { text: 'DataGridView', link: '/datagridview/' },
          { text: 'Tweakers', link: '/tweakers/' },
          { text: 'UWA', link: '/uwa/' }
        ]
      },
      {
        text: 'API 레퍼런스',
        items: [
          { text: 'DataGridView', link: '/datagridview/api/grid-options' },
          { text: 'Tweakers', link: '/tweakers/api/tweaker' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '이 문서에 대해',
          items: [
            { text: '소개', link: '/guide/' },
            { text: '문서 추가 방법', link: '/guide/contributing' }
          ]
        }
      ],
      '/datagridview/': [
        {
          text: '시작하기',
          items: [
            { text: '개요', link: '/datagridview/' },
            { text: '기본 그리드', link: '/datagridview/getting-started' }
          ]
        },
        {
          text: '가이드',
          items: [
            { text: '셀 타입', link: '/datagridview/cell-types' },
            { text: '편집', link: '/datagridview/editing' },
            { text: '저장 후 화면 반영', link: '/datagridview/save-and-reflect' },
            { text: '행 높이', link: '/datagridview/row-height' },
            { text: '정렬과 필터', link: '/datagridview/sort-filter' },
            { text: '툴바', link: '/datagridview/toolbar' }
          ]
        },
        {
          text: 'API 레퍼런스',
          items: [
            { text: '그리드 옵션', link: '/datagridview/api/grid-options' },
            { text: 'layoutOptions', link: '/datagridview/api/layout-options' },
            { text: '컬럼 옵션', link: '/datagridview/api/column-options' },
            { text: '컬럼 함수', link: '/datagridview/api/column-functions' },
            { text: 'typeRepresentation', link: '/datagridview/api/type-representation' },
            { text: 'semantics (Tweakers)', link: '/tweakers/api/semantics' },
            { text: '하위 옵션 객체', link: '/datagridview/api/sub-options' },
            { text: '필터 (filterId)', link: '/datagridview/api/filter' },
            { text: '툴바 (setToolbar)', link: '/datagridview/api/toolbar' },
            { text: '데이터 (TreeDocument)', link: '/datagridview/api/data' },
            { text: '이벤트', link: '/datagridview/api/events' }
          ]
        }
      ],
      '/tweakers/': [
        {
          text: '시작하기',
          items: [
            { text: '개요', link: '/tweakers/' }
          ]
        },
        {
          text: '가이드',
          items: [
            { text: '편집기 단독 사용', link: '/tweakers/standalone' },
            { text: '사용자 타입 등록', link: '/tweakers/custom-type' },
            { text: 'GeneratedToolbar', link: '/tweakers/generated-toolbar' }
          ]
        },
        {
          text: 'API 레퍼런스',
          items: [
            { text: 'Tweaker', link: '/tweakers/api/tweaker' },
            { text: 'semantics', link: '/tweakers/api/semantics' },
            { text: 'TypeRepresentationFactory', link: '/tweakers/api/type-representation-factory' },
            { text: 'GeneratedToolbar', link: '/tweakers/api/generated-toolbar' },
            { text: 'typeRepresentation 목록', link: '/datagridview/api/type-representation' }
          ]
        }
      ],
      '/uwa/': [
        {
          text: '시작하기',
          items: [
            { text: '개요', link: '/uwa/' }
          ]
        },
        {
          text: '기반',
          items: [
            { text: 'Core 유틸', link: '/uwa/core' },
            { text: 'DOM (Element, Event)', link: '/uwa/element' }
          ]
        },
        {
          text: '클래스',
          items: [
            { text: '클래스 (UWA/Class)', link: '/uwa/class' },
            { text: 'Model, Collection, View', link: '/uwa/mvc' }
          ]
        },
        {
          text: '비동기와 통신',
          items: [
            { text: 'Promise', link: '/uwa/promise' },
            { text: '서버 호출 (WAFData)', link: '/uwa/request' },
            { text: '위젯 간 통신 (InterCom)', link: '/uwa/intercom' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: REPO }
    ],
    editLink: {
      pattern: `${REPO}/edit/master/docs/:path`,
      text: 'GitHub 에서 이 페이지 수정'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '검색', buttonAriaLabel: '검색' },
          modal: {
            noResultsText: '검색 결과가 없습니다',
            resetButtonTitle: '지우기',
            footer: { selectText: '선택', navigateText: '이동', closeText: '닫기' }
          }
        }
      }
    },
    outline: { level: [2, 3], label: '이 페이지에서' },
    docFooter: { prev: '이전', next: '다음' },
    lastUpdated: { text: '마지막 수정' },
    darkModeSwitchLabel: '다크 모드',
    lightModeSwitchTitle: '라이트 모드로',
    darkModeSwitchTitle: '다크 모드로',
    sidebarMenuLabel: '메뉴',
    returnToTopLabel: '맨 위로',
    langMenuLabel: '언어'
  }
})
