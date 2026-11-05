/**
 * MultiSelectComboColumn 사용 예제. (lodash 버전)
 *
 * 공통 모듈이 그리드를 만들고 inject 까지 끝낸 뒤 넘겨주는 상황을 가정합니다.
 * 받은 그리드에 MultiSelectComboColumn.apply(...) 한 줄로 "disciplines" 컬럼만 멀티 셀렉트 콤보로 바꿉니다.
 *
 * 사용: require(["DS/MyApp/MultiSelectComboGridSample"], function (S) { S.build(document.body); });
 */
define("DS/MyApp/MultiSelectComboGridSample", [
  "DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig",
  "DS/DataGridView/DataGridView",
  "DS/TreeModel/TreeDocument",
  "DS/TreeModel/TreeNodeModel",
  "DS/MyApp/MultiSelectComboColumn",
], function (_, WUXDataGridView, TreeDocument, TreeNodeModel, MultiSelectComboColumn) {
  "use strict";

  const DISCIPLINES = [
    { label: "기계", value: "MECH" },
    { label: "전기", value: "ELEC" },
    { label: "소프트웨어", value: "SW" },
    { label: "품질", value: "QA" },
  ];

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
    const grid = createGridLikeCommonModule(container);

    // ★ 이 한 줄만 기존 소스에 추가하면 됩니다.
    MultiSelectComboColumn.apply(grid, "disciplines", DISCIPLINES, { placeholder: "선택" });

    return grid;
  }

  return { build: build };
});
