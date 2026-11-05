// MultiSelectComboBoxCell.js
// DataGridView 컬럼의 각 셀에 멀티셀렉트 ComboBox를 넣는 예제

define("MyApp/MultiSelectComboBoxCell", [
  "DS/Controls/ComboBox",
  "DS/DataGridView/DataGridView",
  "DS/TreeModel/TreeDocument",
  "DS/TreeModel/TreeNodeModel",
], function (ComboBox, DataGridView, TreeDocument, TreeNodeModel) {
  "use strict";

  /**
   * 멀티셀렉트 ComboBox를 셀에 주입하는 헬퍼
   */
  function injectMultiSelectComboBox(cellView, options) {
    if (!cellView || !cellView.getContent) return null;

    const container = cellView.getContent();
    // 이미 주입된 경우 재사용
    if (container._multiComboBox) {
      return container._multiComboBox;
    }

    const combo = new ComboBox({
      multiSelFlag: true,           // 멀티셀렉트 활성화
      enableSearchFlag: options.enableSearch !== false,
      autocompleteFlag: false,
      placeholder: options.placeholder || "선택하세요",
      elementsList: options.items || [],
      // 초기 선택값 (배열)
      value: options.initialValue || [],
    });

    // 셀 내용 비우고 ComboBox 삽입
    container.empty();
    combo.inject(container);
    container._multiComboBox = combo;

    // 값 변경 시 노드 모델에 반영
    combo.addEventListener("change", function () {
      const selected = combo.getSelectedItems
        ? combo.getSelectedItems()
        : combo.value;
      const nodeModel = cellView.nodeModel || options.nodeModel;
      if (nodeModel && options.attributeName) {
        nodeModel.setAttribute(options.attributeName, selected);
      }
      if (typeof options.onChange === "function") {
        options.onChange(selected, nodeModel);
      }
    });

    return combo;
  }

  /**
   * DataGridView 컬럼에 멀티셀렉트 ComboBox를 적용하는 함수
   * @param {DataGridView} dataGridView
   * @param {string} columnId - 대상 컬럼 ID
   * @param {Object} options - items, attributeName, placeholder 등
   */
  function applyMultiSelectComboToColumn(dataGridView, columnId, options) {
    if (!dataGridView || !columnId) return;

    const applyToVisibleCells = () => {
      const rows = dataGridView.model || [];
      rows.forEach((nodeModel, rowIndex) => {
        // 셀 뷰 가져오기 (내부 구조에 따라 조정 필요)
        const cellView = dataGridView.getCellView
          ? dataGridView.getCellView(rowIndex, columnId)
          : null;

        if (cellView) {
          const currentValue = nodeModel.getAttributeValue(options.attributeName);
          injectMultiSelectComboBox(cellView, {
            items: options.items,
            placeholder: options.placeholder,
            attributeName: options.attributeName,
            nodeModel: nodeModel,
            initialValue: Array.isArray(currentValue) ? currentValue : [],
            enableSearch: options.enableSearch,
            onChange: options.onChange,
          });
        }
      });
    };

    // 셀이 렌더링된 후 적용
    dataGridView.addEventListener("allCellsRendered", applyToVisibleCells);
    // 스크롤 등으로 재렌더링될 때도 다시 적용 (필요 시)
    dataGridView.addEventListener("cellsRendered", applyToVisibleCells);

    // 즉시 한 번 실행
    applyToVisibleCells();
  }

  /**
   * 사용 예제
   */
  function createExampleGrid() {
    // 1. 데이터 모델 준비
    const treeDocument = new TreeDocument();
    const items = [
      { label: "옵션 A", value: "A" },
      { label: "옵션 B", value: "B" },
      { label: "옵션 C", value: "C" },
      { label: "옵션 D", value: "D" },
    ];

    // 샘플 행 추가
    ["행1", "행2", "행3"].forEach((name, idx) => {
      const node = new TreeNodeModel({
        label: name,
        grid: {
          name: name,
          selectedOptions: idx === 0 ? ["A", "C"] : [], // 초기값
        },
      });
      treeDocument.addRoot(node);
    });

    // 2. DataGridView 생성
    const dgv = new DataGridView({
      treeDocument: treeDocument,
      columns: [
        {
          text: "이름",
          dataIndex: "name",
          typeRepresentation: "string",
          width: 150,
        },
        {
          text: "다중 선택",
          dataIndex: "selectedOptions",
          typeRepresentation: "string", // 기본은 string, 나중에 ComboBox로 덮어씀
          width: 250,
        },
      ],
    });

    // 3. 멀티셀렉트 ComboBox 적용
    applyMultiSelectComboToColumn(dgv, "selectedOptions", {
      items: items,
      attributeName: "selectedOptions",
      placeholder: "옵션을 선택하세요",
      enableSearch: true,
      onChange: function (selected, nodeModel) {
        console.log("선택된 값:", selected, "노드:", nodeModel.getLabel());
      },
    });

    return dgv;
  }

  return {
    injectMultiSelectComboBox: injectMultiSelectComboBox,
    applyMultiSelectComboToColumn: applyMultiSelectComboToColumn,
    createExampleGrid: createExampleGrid,
  };
});
