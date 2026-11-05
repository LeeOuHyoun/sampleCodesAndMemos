/**
 * DataGridView 의 특정 컬럼(예: "tags") 셀마다 멀티 셀렉트 콤보박스를 붙이는 예제.
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
  "DS/DataGridView/DataGridView",
  "DS/TreeModel/TreeDocument",
  "DS/TreeModel/TreeNodeModel",
  "DS/MyApp/MultiSelectComboTweaker", // 미리 로드(템플릿 path 로도 지연 로드 가능)
], function (WUXDataGridView, TreeDocument, TreeNodeModel) {
  "use strict";

  // 콤보 선택지 (전체 공통)
  const DISCIPLINES = [
    { label: "기계", value: "MECH" },
    { label: "전기", value: "ELEC" },
    { label: "소프트웨어", value: "SW" },
    { label: "품질", value: "QA" },
  ];

  function build(container) {
    // ---------------------------------------------------------- 데이터
    const model = new TreeDocument();
    model.prepareUpdate();
    [
      { name: "Part-001", disciplines: ["MECH"] },
      { name: "Part-002", disciplines: ["ELEC", "SW"] },
      { name: "Part-003", disciplines: [] },
    ].forEach(function (row) {
      model.addRoot(
        new TreeNodeModel({
          label: row.name,
          grid: { name: row.name, disciplines: row.disciplines },
        }),
      );
    });
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
          typeRepresentation: "multiSelectCombo", // ★ 아래에서 등록한 타입
          editableFlag: true,
          editionPolicy: "EditionOnClick", // EditionInPlace / EditionOnDoubleClick / EditionOnOver 도 가능
          width: 260,

          // (선택) 셀마다 다른 선택지를 주고 싶을 때 → semantics 를 셀 단위로 반환
          getCellSemantics: function (cellInfos) {
            const node = cellInfos.nodeModel;
            if (node && node.options.label === "Part-003") {
              // 예: 이 행만 2개 항목만 선택 가능
              return { possibleValues: DISCIPLINES.slice(0, 2), placeholder: "선택" };
            }
            return { possibleValues: DISCIPLINES, placeholder: "선택" };
          },

          // (선택) 편집 결과 후처리 / 서버 저장 훅
          setCellValue: function (cellInfos, newValue) {
            const node = cellInfos.nodeModel;
            node.updateOptions({
              grid: Object.assign({}, node.options.grid, { disciplines: newValue }),
            });
            console.log("[disciplines]", node.options.label, newValue);
          },
        },
      ],
    });

    // ---------------------------------------------------------- 타입 등록
    const factory = grid.getTypeRepresentationFactory();

    // 1) 템플릿 이름 → Tweaker 모듈 경로
    factory.registerTypeTemplates({
      multiSelectComboTemplate: {
        path: "DS/MyApp/MultiSelectComboTweaker",
        options: { displayStyle: "edition" },
      },
    });

    // 2) typeRepresentation 이름 → 템플릿 + 기본 semantics
    factory.registerTypeRepresentations({
      multiSelectCombo: {
        stdTemplate: "multiSelectComboTemplate",
        semantics: {
          possibleValues: DISCIPLINES,
          enableSearchFlag: true,
          placeholder: "선택",
        },
      },
    });

    grid.inject(container);
    return grid;
  }

  return { build: build };
});
