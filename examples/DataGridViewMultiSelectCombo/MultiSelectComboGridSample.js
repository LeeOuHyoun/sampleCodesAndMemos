/**
 * DataGridView 의 특정 컬럼(예: "disciplines") 셀마다 멀티 셀렉트 콤보박스를 붙이는 예제. (lodash 버전)
 *
 * 등록 순서 (zip 내 실제 사용 패턴):
 *   1) grid.getTypeRepresentationFactory().registerTypeTemplates(...)
 *        - CfgVariantEffectivityEditor.js  (tristatetemplate)
 *        - EPSSchematicsUI/assets/EPSSchematicsUITypeTemplates.json (valueTypeComboTemplate)
 *   2) grid.getTypeRepresentationFactory().registerTypeRepresentations(...)
 *        - DELMCBUserDefAdmin.js (enumCombo + semantics.possibleValues)
 *   3) 컬럼 정의에 typeRepresentation / editableFlag / editionPolicy / getCellSemantics / setCellValue
 *        - EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem.js (valueTypeCombo 컬럼)
 *
 * 사용: require(["DS/MyApp/MultiSelectComboGridSample"], function (S) { S.build(document.body); });
 */
define("DS/MyApp/MultiSelectComboGridSample", [
  "DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig",
  "DS/DataGridView/DataGridView",
  "DS/TreeModel/TreeDocument",
  "DS/TreeModel/TreeNodeModel",
  "DS/MyApp/MultiSelectComboTweaker", // 미리 로드(템플릿 path 로도 지연 로드 가능)
], function (_, WUXDataGridView, TreeDocument, TreeNodeModel) {
  "use strict";

  const TYPE_REP = "multiSelectCombo";
  const TEMPLATE = "multiSelectComboTemplate";
  const TWEAKER_PATH = "DS/MyApp/MultiSelectComboTweaker";

  // 콤보 선택지 (전체 공통)
  const DISCIPLINES = [
    { label: "기계", value: "MECH" },
    { label: "전기", value: "ELEC" },
    { label: "소프트웨어", value: "SW" },
    { label: "품질", value: "QA" },
  ];

  // 기본 semantics (registerTypeRepresentations / getCellSemantics 공용)
  const DEFAULT_SEMANTICS = {
    possibleValues: DISCIPLINES,
    enableSearchFlag: true,
    placeholder: "선택",
  };

  // 행별로 선택지를 제한하고 싶을 때: 행 라벨 → 허용 value 목록
  const RESTRICTED_VALUES_BY_ROW = {
    "Part-003": ["MECH", "ELEC"],
  };

  const SAMPLE_ROWS = [
    { name: "Part-001", disciplines: ["MECH"] },
    { name: "Part-002", disciplines: ["ELEC", "SW"] },
    { name: "Part-003", disciplines: [] },
  ];

  /** 행 데이터 → TreeNodeModel */
  function toNode(row) {
    return new TreeNodeModel({
      label: row.name,
      grid: _.pick(row, ["name", "disciplines"]),
    });
  }

  /** 셀별 semantics: 제한 목록이 있는 행이면 possibleValues 를 필터링 */
  function getSemanticsForCell(cellInfos) {
    const rowLabel = _.get(cellInfos, "nodeModel.options.label");
    const allowed = _.get(RESTRICTED_VALUES_BY_ROW, [rowLabel]);
    if (_.isEmpty(allowed)) return DEFAULT_SEMANTICS;
    return _.defaults(
      { possibleValues: _.filter(DISCIPLINES, (d) => _.includes(allowed, d.value)) },
      DEFAULT_SEMANTICS,
    );
  }

  function build(container) {
    // ---------------------------------------------------------- 데이터
    const model = new TreeDocument();
    model.prepareUpdate();
    _.forEach(SAMPLE_ROWS, (row) => model.addRoot(toNode(row)));
    model.pushUpdate();

    // ---------------------------------------------------------- 그리드
    const grid = new WUXDataGridView({
      treeDocument: model,
      columns: [
        {
          text: "Name",
          dataIndex: "name",
          typeRepresentation: "string",
          editableFlag: false,
        },
        {
          text: "Disciplines",
          dataIndex: "disciplines",
          typeRepresentation: TYPE_REP, // ★ 아래에서 등록한 타입
          editableFlag: true,
          editionPolicy: "EditionOnClick", // EditionInPlace / EditionOnDoubleClick / EditionOnOver 도 가능
          width: 260,

          // (선택) 셀마다 다른 선택지를 주고 싶을 때 → semantics 를 셀 단위로 반환
          getCellSemantics: getSemanticsForCell,

          // (선택) 편집 결과 후처리 / 서버 저장 훅
          setCellValue: function (cellInfos, newValue) {
            const node = cellInfos.nodeModel;
            // null/undefined/"" 제거 + 중복 제거
            const values = _.uniq(_.reject(_.castArray(newValue), (v) => _.isNil(v) || v === ""));
            node.updateOptions({
              grid: _.assign({}, _.get(node, "options.grid"), { disciplines: values }),
            });
            console.log("[disciplines]", _.get(node, "options.label"), values);
          },
        },
      ],
    });

    // ---------------------------------------------------------- 타입 등록
    const factory = grid.getTypeRepresentationFactory();

    // 1) 템플릿 이름 → Tweaker 모듈 경로
    factory.registerTypeTemplates({
      [TEMPLATE]: { path: TWEAKER_PATH, options: { displayStyle: "edition" } },
    });

    // 2) typeRepresentation 이름 → 템플릿 + 기본 semantics
    factory.registerTypeRepresentations({
      [TYPE_REP]: { stdTemplate: TEMPLATE, semantics: _.cloneDeep(DEFAULT_SEMANTICS) },
    });

    grid.inject(container);
    return grid;
  }

  return { build: build };
});
