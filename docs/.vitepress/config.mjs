import { defineConfig } from 'vitepress'

const REPO = 'https://github.com/LeeOuHyoun/sampleCodesAndMemos'

const SERVER_SIDEBAR = [
  {
    text: '데이터 모델 / MQL',
    collapsed: true,
    items: [
      {
        text: '시작하기',
        items: [
          { text: '개요', link: '/schema/' }
        ]
      },
      {
        text: '스키마 정의',
        items: [
          { text: 'Attribute, Type, Relationship, Role', link: '/schema/admin' },
          { text: 'Policy (상태와 권한)', link: '/schema/policy' }
        ]
      },
      {
        text: 'MQL',
        items: [
          { text: 'MQL 문법과 조회', link: '/schema/mql' },
          { text: 'mql 폴더 작성 규칙', link: '/schema/conventions' }
        ]
      }
    ]
  },
  {
    text: 'UI 구성 요소',
    collapsed: true,
    items: [
      {
        text: '시작하기',
        items: [
          { text: '개요', link: '/ui-components/' }
        ]
      },
      {
        text: '구성 요소',
        items: [
          { text: 'command, menu', link: '/ui-components/command-menu' },
          { text: 'table (목록, 구조)', link: '/ui-components/table' },
          { text: 'webform (상세, 생성)', link: '/ui-components/webform' },
          { text: 'portal, channel', link: '/ui-components/portal-channel' }
        ]
      },
      {
        text: '레퍼런스',
        items: [
          { text: 'URL 파라미터', link: '/ui-components/url-parameters' },
          { text: 'settings 레퍼런스', link: '/ui-components/settings' }
        ]
      }
    ]
  },
  {
    text: 'JPO',
    collapsed: true,
    items: [
      {
        text: '시작하기',
        items: [
          { text: '개요', link: '/jpo/' }
        ]
      },
      {
        text: '작성',
        items: [
          { text: '호출 종류별 인자 구조', link: '/jpo/args' },
          { text: 'DomainObject 와 select', link: '/jpo/domain-object' },
          { text: 'MqlUtil', link: '/jpo/mql-util' }
        ]
      },
      {
        text: '실행 환경',
        items: [
          { text: 'Context, 트랜잭션, 권한 전환', link: '/jpo/transaction-context' },
          { text: '다국어, 예외, 로그', link: '/jpo/i18n-exception' }
        ]
      }
    ]
  },
  {
    text: '트리거',
    collapsed: true,
    items: [
      { text: '개요', link: '/trigger/' },
      { text: '트리거 등록', link: '/trigger/register' },
      { text: 'JPO 와 인자', link: '/trigger/jpo-args' },
      { text: '라이프사이클과 promote', link: '/trigger/lifecycle' },
      { text: '채번기', link: '/trigger/generator' }
    ]
  },
  {
    text: 'properties',
    collapsed: true,
    items: [
      { text: '개요', link: '/properties/' },
      { text: '문자열 리소스 (다국어)', link: '/properties/string-resource' },
      { text: '시스템 설정과 page 객체', link: '/properties/system-settings' }
    ]
  },
  {
    text: '서버 Java',
    collapsed: true,
    items: [
      { text: '개요', link: '/server-java/' },
      { text: '커스텀 REST 서비스', link: '/server-java/rest-service' },
      { text: '스케줄러', link: '/server-java/scheduler' },
      { text: '외부 DB (MyBatis)', link: '/server-java/external-db' },
      { text: '메일', link: '/server-java/mail' }
    ]
  },
  {
    text: '서버 반영',
    collapsed: true,
    items: [
      { text: '서버 반영 절차', link: '/deploy/' }
    ]
  }
]

const WEBAPPS_SIDEBAR = [
  {
    text: 'AMD 로딩',
    collapsed: true,
    items: [
      {
        text: '시작하기',
        items: [
          { text: '개요 (AMD 로딩)', link: '/amd/' }
        ]
      },
      {
        text: '가이드',
        items: [
          { text: '플러그인 (i18n!, css!, text!)', link: '/amd/plugins' },
          { text: 'WebappsUtils', link: '/amd/webapps-utils' }
        ]
      }
    ]
  },
  {
    text: '위젯과 플랫폼',
    collapsed: true,
    items: [
      {
        text: '시작하기',
        items: [
          { text: '개요', link: '/widget/' }
        ]
      },
      {
        text: '위젯',
        items: [
          { text: 'widget 객체', link: '/widget/widget-api' },
          { text: '위젯 설정 (preferences)', link: '/widget/preferences' },
          { text: '3DDashboard 에 올리기', link: '/widget/dashboard-register' }
        ]
      },
      {
        text: '플랫폼 서비스',
        items: [
          { text: 'PlatformAPI', link: '/widget/platform-api' },
          { text: 'Compass 서비스', link: '/widget/compass-services' },
          { text: 'WidgetServices', link: '/widget/widget-services' },
          { text: '3DSpace 주소와 SecurityContext', link: '/widget/space-url' }
        ]
      }
    ]
  },
  {
    text: 'UWA',
    collapsed: true,
    items: [
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
  {
    text: '화면 컨트롤',
    collapsed: true,
    items: [
      {
        text: '시작하기',
        items: [
          { text: '개요 (무엇을 쓸까)', link: '/controls/' }
        ]
      },
      {
        text: '가이드',
        items: [
          { text: 'WebUX 컨트롤', link: '/controls/webux-controls' },
          { text: '다이얼로그 (Windows)', link: '/controls/dialog' },
          { text: 'UIKIT', link: '/controls/uikit' },
          { text: '알림 메시지', link: '/controls/notifications' }
        ]
      },
      {
        text: 'API 레퍼런스',
        items: [
          { text: 'WebUX 컨트롤 API', link: '/controls/api/webux-controls' },
          { text: 'Windows API', link: '/controls/api/windows' },
          { text: 'UIKIT API', link: '/controls/api/uikit' }
        ]
      }
    ]
  },
  {
    text: '이벤트, 선택, 끌어 놓기',
    collapsed: true,
    items: [
      { text: '개요', link: '/events/' },
      { text: 'PubSub (Events, ModelEvents)', link: '/events/pubsub' },
      { text: '선택 (CSOManager)', link: '/events/selection' },
      { text: '끌어 놓기 (3DXContent)', link: '/events/drag-and-drop' }
    ]
  },
  {
    text: '3DSpace REST API',
    collapsed: true,
    items: [
      { text: '공통 규칙', link: '/rest-api/' },
      { text: '보안 컨텍스트', link: '/rest-api/security-context' },
      { text: '엔드포인트 목록', link: '/rest-api/catalog' },
      { text: '문서 (documents)', link: '/rest-api/documents' }
    ]
  },
  {
    text: 'DataGridView',
    collapsed: true,
    items: [
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
          { text: '툴바', link: '/datagridview/toolbar' },
          { text: '트리 구조', link: '/datagridview/tree' },
          { text: '컬럼 함수', link: '/datagridview/cell-functions' },
          { text: '우클릭 메뉴와 선택', link: '/datagridview/context-menu' },
          { text: '셀 직접 그리기', link: '/datagridview/custom-cell' },
          { text: '상태바', link: '/datagridview/status-bar' }
        ]
      },
      {
        text: 'API 레퍼런스',
        items: [
          { text: '그리드 옵션', link: '/datagridview/api/grid-options' },
          { text: '그리드 메서드', link: '/datagridview/api/grid-methods' },
          { text: 'layoutOptions', link: '/datagridview/api/layout-options' },
          { text: '컬럼 옵션', link: '/datagridview/api/column-options' },
          { text: '컬럼 함수', link: '/datagridview/api/column-functions' },
          { text: 'typeRepresentation', link: '/datagridview/api/type-representation' },
          { text: '하위 옵션 객체', link: '/datagridview/api/sub-options' },
          { text: '필터 (filterId)', link: '/datagridview/api/filter' },
          { text: '툴바 (setToolbar)', link: '/datagridview/api/toolbar' },
          { text: '데이터 (TreeDocument)', link: '/datagridview/api/data' },
          { text: '이벤트', link: '/datagridview/api/events' }
        ]
      }
    ]
  },
  {
    text: 'Tweakers',
    collapsed: true,
    items: [
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
          { text: 'GeneratedToolbar', link: '/tweakers/api/generated-toolbar' }
        ]
      }
    ]
  }
]

const LOOKUP_ITEMS = [
  { text: '자주 틀리는 점', link: '/guide/faq' },
  { text: '용어집', link: '/guide/glossary' },
  { text: '모듈 경로 색인', link: '/guide/module-index' },
  { text: '검증 대기 목록', link: '/guide/verify-list' }
]

const sidebarFor = (prefixes, sidebar) => Object.fromEntries(prefixes.map((prefix) => [prefix, sidebar]))

export default defineConfig({
  lang: 'ko-KR',
  title: 'ENOVIA 분석 사양서',
  description: 'ENOVIA(3DEXPERIENCE) 3DSpace 서버와 webapps 개발 사양 분석 문서',
  base: '/sampleCodesAndMemos/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '이 문서에 대해', link: '/guide/', activeMatch: '^/guide/($|roadmap|contributing)' },
      {
        text: '3DSpace 서버',
        items: [
          { text: '데이터 모델 / MQL', link: '/schema/' },
          { text: 'UI 구성 요소', link: '/ui-components/' },
          { text: 'JPO', link: '/jpo/' },
          { text: '트리거', link: '/trigger/' },
          { text: 'properties', link: '/properties/' },
          { text: '서버 Java', link: '/server-java/' },
          { text: '서버 반영', link: '/deploy/' }
        ]
      },
      {
        text: 'webapps',
        items: [
          { text: 'AMD 로딩', link: '/amd/' },
          { text: '위젯과 플랫폼', link: '/widget/' },
          { text: 'UWA', link: '/uwa/' },
          { text: '화면 컨트롤', link: '/controls/' },
          { text: '이벤트, 선택, 끌어 놓기', link: '/events/' },
          { text: '3DSpace REST API', link: '/rest-api/' },
          { text: 'DataGridView', link: '/datagridview/' },
          { text: 'Tweakers', link: '/tweakers/' }
        ]
      },
      {
        text: 'API 레퍼런스',
        items: [
          {
            text: '3DSpace 서버',
            items: [
              { text: 'UI settings', link: '/ui-components/settings' },
              { text: 'URL 파라미터', link: '/ui-components/url-parameters' },
              { text: 'JPO 인자 구조', link: '/jpo/args' },
              { text: '트리거 JPO 인자', link: '/trigger/jpo-args' }
            ]
          },
          {
            text: 'webapps',
            items: [
              { text: 'widget 객체', link: '/widget/widget-api' },
              { text: 'PlatformAPI', link: '/widget/platform-api' },
              { text: 'REST 엔드포인트', link: '/rest-api/catalog' },
              { text: '화면 컨트롤', link: '/controls/api/webux-controls' },
              { text: 'DataGridView', link: '/datagridview/api/grid-options' },
              { text: 'Tweakers', link: '/tweakers/api/tweaker' }
            ]
          }
        ]
      },
      { text: '찾아보기', items: LOOKUP_ITEMS }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '이 문서에 대해',
          items: [
            { text: '소개', link: '/guide/' },
            { text: '처음 읽는 순서', link: '/guide/roadmap' },
            { text: '문서 추가 방법', link: '/guide/contributing' }
          ]
        },
        { text: '찾아보기', items: LOOKUP_ITEMS }
      ],
      ...sidebarFor(['/schema/', '/ui-components/', '/jpo/', '/trigger/', '/properties/', '/server-java/', '/deploy/'], SERVER_SIDEBAR),
      ...sidebarFor(['/amd/', '/widget/', '/uwa/', '/controls/', '/events/', '/rest-api/', '/datagridview/', '/tweakers/'], WEBAPPS_SIDEBAR)
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
