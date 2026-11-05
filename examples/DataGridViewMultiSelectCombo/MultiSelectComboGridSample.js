/**
 * 이미 생성(inject 완료)된 DataGridView 의 "한 컬럼"만 멀티 셀렉트 콤보로 바꾸는 예제. (lodash 버전)
 *
 * 공통 모듈이 그리드를 만들어 inject 까지 끝낸 뒤 넘겨주는 상황을 가정합니다.
 * 기존 소스에는 아래 applyMultiSelectCombo() 안의 [1]~[3] 단계를 그대로 옮기면 됩니다.
 *
 *   [0] define 에 MultiSelectComboTweaker 를 추가 (로드만 하면 됨, 인자로 받을 필요 없음)
 *   [1] registerTypeTemplates      : 템플릿 이름 → Tweaker 모듈 경로
 *   [2] registerTypeRepresentations : 타입 이름 → 템플릿 + semantics(선택지 등)
 *   [3] grid.columns 재대입         : 대상 컬럼 하나만 typeRepresentation/editableFlag/editionPolicy 변경
 *
 * 셀 값(nodeModel.options.grid[dataIndex])은 배열이어야 합니다. 예: ["MECH", "ELEC"]
 *
 * 사용: require(["DS/MyApp/MultiSelectComboGridSample"], function (S) { S.build(document.body); });
 */
define("DS/MyApp/MultiSelectComboGridSample", [
  "DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig",
  "DS/DataGridView/DataGridView",
  "DS/TreeModel/TreeDocument",
  "DS/TreeModel/TreeNodeModel",
  "DS/MyApp/MultiSelectComboTweaker", // [0] 로드만 함 (맨 뒤에 두고 인자는 받지 않음)
], function (_, WUXDataGridView, TreeDocument, TreeNodeModel) {
  "use strict";

  // ------------------------------------------------------------------
  // 설정값 (실제 환경에 맞게 변경)
  // ------------------------------------------------------------------
  const TARGET_DATA_INDEX = "disciplines";                  // 적용할 컬럼의 dataIndex
  const TWEAKER_PATH = "DS/MyApp/MultiSelectComboTweaker";  // [0] 의 모듈 경로와 동일하게
  const TEMPLATE_NAME = "multiSelectComboTemplate";         // 임의 이름
  const TYPE_REP_NAME = "multiSelectCombo";                 // 임의 이름 (컬럼의 typeRepresentation 값)

  // 콤보 선택지: label = 화면 표시, value = 셀에 저장되는 값
  const POSSIBLE_VALUES = [
    { label: "기계", value: "MECH" },
    { label: "전기", value: "ELEC" },
    { label: "소프트웨어", value: "SW" },
    { label: "품질", value: "QA" },
  ];

  // ------------------------------------------------------------------
  // ★ 기존 소스에 옮길 부분
  // ------------------------------------------------------------------
  function applyMultiSelectCombo(grid) {
    const factory = grid.getTypeRepresentationFactory();

    // [1] 템플릿 등록: 이 템플릿을 쓰는 셀은 Tweaker 모듈로 그려짐
    factory.registerTypeTemplates({
      [TEMPLATE_NAME]: {
        path: TWEAKER_PATH,
        options: { displayStyle: "edition" },
      },
    });

    // [2] 타입 등록 + semantics
    //     semantics 의 키는 Tweaker 의 publishedProperties 로 전달됨
    //     (MultiSelectComboTweaker.js: value / possibleValues / placeholder / enableSearchFlag)
    factory.registerTypeRepresentations({
      [TYPE_REP_NAME]: {
        stdTemplate: TEMPLATE_NAME,
        semantics: {
          possibleValues: POSSIBLE_VALUES, // 콤보 선택지
          placeholder: "선택",              // 아무것도 선택 안 했을 때 문구
          enableSearchFlag: true,           // 콤보 내 검색 사용
        },
      },
    });

    // [3] 대상 컬럼 하나만 변경
    //     - grid.columns 를 직접 수정하면 변경이 감지되지 않으므로 "새 배열"을 만들어 다시 대입
    //     - 기존 컬럼 옵션(text, width, getCellValue 등)은 그대로 유지하고 아래 3개만 덮어씀
    //     - 그룹 컬럼(children) 안에 있는 경우는 MultiSelectComboColumn.js 참고
    grid.columns = _.map(grid.columns, (col) =>
      col.dataIndex === TARGET_DATA_INDEX
        ? _.assign({}, col, {
            typeRepresentation: TYPE_REP_NAME, // [2] 에서 등록한 타입 이름
            editableFlag: true,                // 편집 가능
            editionPolicy: "EditionOnClick",   // 클릭 시 편집 (EditionOnDoubleClick / EditionOnOver / EditionInPlace)
          })
        : col,
    );
  }

  // ------------------------------------------------------------------
  // 이하: 예제 실행용 (공통 모듈 역할 흉내)
  // ------------------------------------------------------------------
  const SAMPLE_ROWS = [
    { name: "Part-001", disciplines: ["MECH"] },
    { name: "Part-002", disciplines: ["ELEC", "SW"] },
    { name: "Part-003", disciplines: [] },
  ];

  /** 공통 모듈 역할: 일반 컬럼으로 그리드를 만들고 inject 까지 끝내서 반환 */
  function createGridLikeCommonModule(container) {
    const model = new TreeDocument();
    model.prepareUpdate();
    _.forEach(SAMPLE_ROWS, (row) =>
      model.addRoot(new TreeNodeModel({ label: row.name, grid: _.clone(row) })),
    );
    model.pushUpdate();

    return new WUXDataGridView({
      treeDocument: model,
      columns: [
        { text: "Name", dataIndex: "name", typeRepresentation: "string", editableFlag: false },
        { text: "Disciplines", dataIndex: "disciplines", width: 260 },
      ],
    }).inject(container);
  }

  function build(container) {
    const grid = createGridLikeCommonModule(container); // 이미 inject 된 그리드를 받음
    applyMultiSelectCombo(grid);                        // 받은 직후 적용
    return grid;
  }

  return { build: build, applyMultiSelectCombo: applyMultiSelectCombo };
});
