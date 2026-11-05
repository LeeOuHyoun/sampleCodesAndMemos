/**
 * 이미 생성(inject 완료)된 DataGridView 의 "한 컬럼"에만 멀티 셀렉트 콤보를 적용하는 헬퍼.
 *
 * 사용 예:
 *   require([
 *     "DS/MyApp/MultiSelectComboColumn",
 *   ], function (MultiSelectComboColumn) {
 *     const grid = commonModule.createGrid(...); // 공통 모듈이 만든 그리드
 *     MultiSelectComboColumn.apply(grid, "disciplines", [
 *       { label: "기계", value: "MECH" },
 *       { label: "전기", value: "ELEC" },
 *     ]);
 *   });
 *
 * 동작:
 *   1) 그리드의 TypeRepresentationFactory 에 템플릿/타입 등록 (이 그리드에만 적용됨)
 *   2) grid.columns 를 복사해서 해당 dataIndex 컬럼만 typeRepresentation 등을 바꾸고 다시 대입
 *      (zip 내 EngineeringItemCmd.js, CfgBaseUX.js, ConfiguratorPanel.js 가 같은 방식으로 컬럼 재설정)
 *   - 나머지 컬럼과 기존 컬럼 옵션(getCellValue, setCellValue 등 함수 포함)은 그대로 유지됩니다.
 *   - 셀 값(nodeModel.options.grid[dataIndex])은 배열이어야 합니다. 예: ["MECH", "ELEC"]
 */
define("DS/MyApp/MultiSelectComboColumn", [
  "DS/sdxENOChgGovernanceUX/custom/lib/lodash-amd/lodashConfig",
  "DS/MyApp/MultiSelectComboTweaker", // 로드만 함 (템플릿 path 로 그리드가 사용)
], function (_) {
  "use strict";

  const TEMPLATE = "multiSelectComboTemplate";
  const TWEAKER_PATH = "DS/MyApp/MultiSelectComboTweaker";

  /** 컬럼 트리(그룹 컬럼의 children 포함)에서 dataIndex 컬럼만 바꿔서 새 배열 반환 */
  function replaceColumn(columns, dataIndex, patch) {
    return _.map(columns, (col) => {
      if (col.dataIndex === dataIndex) return _.assign({}, col, patch);
      if (_.isArray(col.children)) {
        return _.assign({}, col, { children: replaceColumn(col.children, dataIndex, patch) });
      }
      return col;
    });
  }

  /**
   * @param {DataGridView} grid           공통 모듈에서 받은 그리드
   * @param {string}       dataIndex      적용할 컬럼의 dataIndex
   * @param {Array}        possibleValues [{ label, value }, ...]
   * @param {Object}       [options]      { placeholder, enableSearchFlag, editionPolicy }
   */
  function apply(grid, dataIndex, possibleValues, options) {
    const opts = _.defaults({}, options, {
      placeholder: "",
      enableSearchFlag: true,
      editionPolicy: "EditionOnClick",
    });
    // 컬럼마다 선택지가 다를 수 있으므로 타입 이름을 컬럼별로 만듦
    const typeRep = "multiSelectCombo_" + dataIndex;
    const factory = grid.getTypeRepresentationFactory();

    // 1) 타입 등록
    factory.registerTypeTemplates({
      [TEMPLATE]: { path: TWEAKER_PATH, options: { displayStyle: "edition" } },
    });
    factory.registerTypeRepresentations({
      [typeRep]: {
        stdTemplate: TEMPLATE,
        semantics: {
          possibleValues: _.cloneDeep(possibleValues),
          placeholder: opts.placeholder,
          enableSearchFlag: opts.enableSearchFlag,
        },
      },
    });

    // 2) 해당 컬럼만 교체 (새 배열을 대입해야 그리드가 변경을 감지함)
    grid.columns = replaceColumn(grid.columns, dataIndex, {
      typeRepresentation: typeRep,
      editableFlag: true,
      editionPolicy: opts.editionPolicy,
    });
  }

  return { apply: apply };
});
