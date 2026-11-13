define('DS/CommonUtils/ExpandableSearchPanel/ExpandableSearchPanelDemo', [
  'UWA/Core',
  'DS/CommonUtils/ExpandableSearchPanel/ExpandableSearchPanel',
  'DS/DataGridView/DataGridView',
  'DS/TreeModel/TreeDocument',
  'DS/TreeModel/TreeNodeModel',
  'UWA/Element'
], (UWA, ExpandableSearchPanel, DataGridView, TreeDocument, TreeNodeModel) => {
  'use strict';

  const createTreeDocument = () => {
    const treeDocument = new TreeDocument();
    treeDocument.prepareUpdate();
    [
      { label: 'PRT-0001', grid: { title: '브라켓', status: '작업중' } },
      { label: 'PRT-0002', grid: { title: '샤프트', status: '검토중' } },
      { label: 'PRT-0003', grid: { title: '하우징', status: '승인' } }
    ].forEach((row) => treeDocument.addRoot(new TreeNodeModel(row)));
    treeDocument.pushUpdate();
    return treeDocument;
  };

  const render = (parent) => {
    const gridContainer = UWA.createElement('div', { styles: { height: 400 } }).inject(parent);

    const grid = new DataGridView({
      treeDocument: createTreeDocument(),
      columns: [
        { text: '품번', dataIndex: 'tree', width: 130 },
        { text: '품명', dataIndex: 'title', width: 160 },
        { text: '상태', dataIndex: 'status', width: 120 }
      ]
    }).inject(gridContainer);

    ExpandableSearchPanel.attachToGrid(grid, {
      fields: Array.from({ length: 12 }, (_, index) => ({ id: `item${index + 1}`, label: `item${index + 1}`, type: 'text' })),
      onSearch: (values) => console.log('검색', values)
    });

    return grid;
  };

  return { render };
});
