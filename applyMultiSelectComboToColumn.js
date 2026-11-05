function applyMultiSelectComboToColumn(dataGridView, columnDataIndex, options) {
  if (!dataGridView || !columnDataIndex) return;
  
  const applyToCells = () => {
    const modelLength = dataGridView.getModelLength ?
      dataGridView.getModelLength() :
      (dataGridView.model || []).length;
    
    for (let rowID = 0; rowID < modelLength; rowID++) {
      // 컬럼 인덱스를 dataIndex로 찾기
      const columnID = dataGridView.layout ?
        dataGridView.layout.getColumnIndex(columnDataIndex) :
        -1;
      
      if (columnID < 0) continue;
      
      // 셀 정보 가져오기
      const cellID = dataGridView.layout ?
        dataGridView.layout.getCellIDFromCoordinates({ rowID, columnID }) :
        -1;
      
      if (cellID < 0) continue;
      
      const cellInfos = dataGridView.getCellInfosAt(cellID);
      if (!cellInfos || !cellInfos.nodeModel) continue;
      
      // 현재 값 읽기
      const currentValue = dataGridView.getCellValue(cellInfos);
      
      // 셀 DOM 컨테이너 접근 (내부 구조에 따라 조정 필요)
      const cellView = cellInfos.cellView ||
        (dataGridView.collectionView && dataGridView.collectionView._getViewAt ?
          dataGridView.collectionView._getViewAt(cellID) :
          null);
      
      if (!cellView || !cellView.getContent) continue;
      
      const container = cellView.getContent();
      if (container._multiComboBox) continue; // 이미 주입됨
      
      // 멀티셀렉트 ComboBox 생성
      const combo = new ComboBox({
        multiSelFlag: true,
        enableSearchFlag: options.enableSearch !== false,
        placeholder: options.placeholder || "선택하세요",
        elementsList: options.items || [],
        value: Array.isArray(currentValue) ? currentValue : [],
      });
      
      container.empty();
      combo.inject(container);
      container._multiComboBox = combo;
      
      // 값 변경 시 모델에 반영
      combo.addEventListener("change", function() {
        const selected = combo.value || [];
        dataGridView.setModelAt(cellID, selected);
        if (typeof options.onChange === "function") {
          options.onChange(selected, cellInfos.nodeModel);
        }
      });
    }
  };
  
  // 렌더링 완료 후 적용
  dataGridView.addEventListener("allCellsRendered", applyToCells);
  dataGridView.addEventListener("cellsRendered", applyToCells);
  applyToCells();
}