define('DS/CommonUtils/ExpandableSearchPanelEx/ExpandableSearchPanelExDemo', [
  'UWA/Core',
  'DS/sdxENOChgGovernanceUX/custom/util/lodash',
  'DS/CommonUtils/ExpandableSearchPanelEx/ExpandableSearchPanelEx',
  'DS/CommonUtils/ExpandableSearchPanelEx/SearchFieldAdapters',
  'DS/DataGridView/DataGridView',
  'DS/TreeModel/TreeDocument',
  'DS/TreeModel/TreeNodeModel',
  'UWA/Element'
], (UWA, _, ExpandableSearchPanelEx, Adapters, DataGridView, TreeDocument, TreeNodeModel) => {
  'use strict';

  const OPTION_ITEMS = ['옵션A', '옵션B', '옵션C'];

  const handleSearch = (values) => {
    console.log('검색', values);
  };

  const createTreeDocument = () => {
    const treeDocument = new TreeDocument();
    treeDocument.prepareUpdate();
    _.forEach([
      { label: 'PRT-0001', grid: { title: '브라켓', status: '작업중' } },
      { label: 'PRT-0002', grid: { title: '샤프트', status: '검토중' } },
      { label: 'PRT-0003', grid: { title: '하우징', status: '승인' } }
    ], (row) => treeDocument.addRoot(new TreeNodeModel(row)));
    treeDocument.pushUpdate();
    return treeDocument;
  };

  const textField = (id) => ({ id, label: id, editor: Adapters.text() });

  const createRows = () => {
    const rowFields = [
      [textField('item1'), { id: 'select', label: '드롭다운', editor: Adapters.select({ items: OPTION_ITEMS, placeholder: '선택' }) }],
      [textField('item2'), { id: 'dateRange', label: '날짜 범위', editor: Adapters.dateRange() }],
      [textField('item3'), { id: 'checkboxGroup', label: '체크박스 그룹', editor: Adapters.checkboxGroup({ items: OPTION_ITEMS }) }],
      [textField('item4'), { id: 'checkbox', label: '체크박스', editor: Adapters.checkbox({ label: '포함' }) }],
      [textField('item5'), { id: 'multiSelect', label: '드롭다운(멀티)', editor: Adapters.multiSelect({ items: OPTION_ITEMS, placeholder: '선택' }) }],
      [textField('item6')],
      [textField('item7')],
      [textField('item8')],
      [textField('item9')],
      [textField('item10')],
      [textField('item11')],
      [textField('item12')]
    ];
    return _.map(rowFields, (fields) => ({ fields }));
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

    ExpandableSearchPanelEx.attachToGrid(grid, {
      rows: createRows(),
      onSearch: handleSearch
    });
  };

  return { render };
});
