/**
 * DataGridView 보조 함수 모음.
 *
 * 함수의 첫 인자 target 은 다음 중 하나를 받는다.
 * - DataGridView 인스턴스
 * - 그리드를 담은 DOM 요소, 그리드 안의 DOM 요소, 또는 그 요소의 id 문자열
 * - TreeDocument (데이터만 다루는 함수, 타입이 DocTarget 인 경우)
 *
 * 그리드 루트 DOM 에는 DS/Controls/Abstract 의 _preBuildView 가 넣어 둔 dsModel(그리드 인스턴스)과
 * wux-controls-abstract 클래스가 있어서 DOM 으로 그리드를 찾을 수 있다.
 *
 * @module DS/CommonUtils/DataGridViewUtils
 */
define('DS/CommonUtils/DataGridViewUtils', ['DS/lodash', 'DS/DataGridView/DataGridView', 'DS/TreeModel/TreeDocument', 'DS/TreeModel/TreeNodeModel'], (_, DataGridView, TreeDocument, TreeNodeModel) => {
  'use strict';

  /**
   * @typedef {DataGridView|HTMLElement|string} GridTarget 그리드, 그리드 DOM 요소, 또는 그 요소의 id
   */

  /**
   * @typedef {GridTarget|TreeDocument} DocTarget GridTarget 또는 TreeDocument
   */

  /**
   * 행 데이터. 아래 키를 뺀 나머지는 컬럼 값(TreeNodeModel options.grid)이 된다.
   * @typedef {Object} Row
   * @property {string} [label] 트리 컬럼(dataIndex 'tree') 값
   * @property {Row[]} [children] 하위 행. 빈 배열이면 "하위 행이 있지만 아직 안 불러옴" 으로 펼침 아이콘이 생긴다
   * @property {Array} [icons] 트리 셀 아이콘
   * @property {Object} [badges] 아이콘 모서리 배지 { topLeft, topRight, bottomLeft, bottomRight }
   * @property {Object} [data] 화면에 쓰이지 않는 보관용 값
   */

  /**
   * 행 조건. (row, node) => boolean 함수, 또는 lodash iteratee 축약형({ status: '완료' }, 'checked')
   * @typedef {Function|Object|string} RowPredicate
   */

  /**
   * 대상 행 지정. 행, 행 배열, 또는 RowPredicate
   * @typedef {TreeNodeModel|TreeNodeModel[]|RowPredicate} NodeSelector
   */

  const NODE_KEYS = ['label', 'icons', 'badges', 'data'];
  const NON_GRID_KEYS = [...NODE_KEYS, 'children'];

  const isGridEl = (node) => node.dsModel instanceof DataGridView;

  const findGridEl = (el) => {
    for (let node = el; node; node = node.parentElement) {
      if (isGridEl(node)) {
        return node;
      }
    }
    return _.find(el.querySelectorAll('.wux-controls-abstract'), isGridEl);
  };

  /**
   * 그리드 인스턴스를 얻는다. DOM 요소는 자신과 상위 요소, 그다음 하위 요소 순서로 찾는다.
   * @param {GridTarget} target
   * @returns {DataGridView}
   * @throws {Error} 그리드를 찾지 못한 경우
   */
  const getGrid = (target) => {
    if (target instanceof DataGridView) {
      return target;
    }
    const el = _.isString(target) ? document.getElementById(target) : target;
    const grid = _.isElement(el) && _.get(findGridEl(el), 'dsModel');
    if (!grid) {
      throw new Error(`DataGridView not found: ${target}`);
    }
    return grid;
  };

  /**
   * 그리드에 연결된 TreeDocument 를 얻는다.
   * @param {DocTarget} target
   * @returns {TreeDocument}
   */
  const getDoc = (target) => (target instanceof TreeDocument ? target : getGrid(target).getTreeDocument());

  /**
   * 여러 데이터 변경을 묶어 화면을 한 번만 다시 그린다. (TreeDocument.withTransactionUpdate)
   * @template T
   * @param {DocTarget} target
   * @param {function(TreeDocument): T} fn
   * @returns {T} fn 의 반환값
   */
  const batch = (target, fn) => {
    const doc = getDoc(target);
    let result;
    doc.withTransactionUpdate(() => {
      result = fn(doc);
    });
    return result;
  };

  /**
   * 셀 값을 읽는다. dataIndex 'tree' 와 'label' 은 트리 컬럼 값이다.
   * @param {TreeNodeModel} node
   * @param {string} dataIndex
   * @returns {*}
   */
  const getValue = (node, dataIndex) => node.getAttributeValue(dataIndex === 'tree' ? 'label' : dataIndex);

  /**
   * 행을 평범한 객체로 바꾼다. { label, ...컬럼 값 }
   * @param {TreeNodeModel} node
   * @returns {Row}
   */
  const getRow = (node) => _.assign({ label: node.getLabel() }, node.options.grid);

  const toMatcher = (predicate) => {
    const fn = _.iteratee(predicate);
    return (node) => fn(getRow(node), node);
  };

  const byKeys = (ids, key) => {
    const list = _.castArray(ids);
    return (row) => _.includes(list, row[key]);
  };

  /**
   * 행 목록. 하위 행과 접힌 행도 포함한다.
   * @param {DocTarget} target
   * @param {RowPredicate} [predicate] 없으면 전체
   * @returns {TreeNodeModel[]}
   */
  const getNodes = (target, predicate) => {
    const nodes = getDoc(target).getAllDescendants();
    return predicate ? _.filter(nodes, toMatcher(predicate)) : nodes;
  };

  /**
   * 행 데이터 목록. 하위 행과 접힌 행도 포함한다.
   * @param {DocTarget} target
   * @param {RowPredicate} [predicate] 없으면 전체
   * @returns {Row[]}
   */
  const getRows = (target, predicate) => _.map(getNodes(target, predicate), getRow);

  /**
   * 조건에 맞는 첫 행.
   * @param {DocTarget} target
   * @param {RowPredicate} predicate
   * @returns {TreeNodeModel|undefined}
   */
  const findNode = (target, predicate) => _.find(getNodes(target), toMatcher(predicate));

  /**
   * 키 컬럼 값으로 행을 찾는다.
   * @param {DocTarget} target
   * @param {*} id
   * @param {string} [key='id'] 키 컬럼 dataIndex
   * @returns {TreeNodeModel|undefined}
   */
  const getNodeById = (target, id, key = 'id') => findNode(target, byKeys(id, key));

  /**
   * 키 컬럼 값을 키로 하는 행 사전.
   * @param {DocTarget} target
   * @param {string} [key='id'] 키 컬럼 dataIndex
   * @returns {Object<string, TreeNodeModel>}
   */
  const keyNodesBy = (target, key = 'id') => _.keyBy(getNodes(target), (node) => getValue(node, key));

  /**
   * 선택된 행. 원본 선택 배열의 복사본을 돌려준다.
   * @param {DocTarget} target
   * @returns {TreeNodeModel[]}
   */
  const getSelectedNodes = (target) => [...getDoc(target).getSelectedNodes()];

  /**
   * 선택된 행 데이터.
   * @param {DocTarget} target
   * @returns {Row[]}
   */
  const getSelectedRows = (target) => _.map(getSelectedNodes(target), getRow);

  /**
   * 활성 셀(포커스)이 있는 행.
   * @param {GridTarget} target
   * @returns {TreeNodeModel|undefined}
   */
  const getActiveNode = (target) => {
    const grid = getGrid(target);
    const cellID = grid.getActiveCellID();
    return cellID < 0 ? undefined : grid.getNodeModelAt(cellID);
  };

  /**
   * 한 컬럼의 값 목록 (전체 행 순서).
   * @param {DocTarget} target
   * @param {string} dataIndex
   * @returns {Array}
   */
  const getColumnValues = (target, dataIndex) => _.map(getNodes(target), (node) => getValue(node, dataIndex));

  /**
   * 행 데이터로 TreeNodeModel 을 만든다. children 도 함께 만든다.
   * @param {Row|TreeNodeModel} row
   * @returns {TreeNodeModel}
   */
  const toNode = (row) => (row instanceof TreeNodeModel ? row : new TreeNodeModel(_.assign(
    _.pick(row, NODE_KEYS),
    { grid: _.omit(row, NON_GRID_KEYS) },
    row.children && { children: _.map(row.children, toNode) }
  )));

  /**
   * 행을 추가한다.
   * @param {DocTarget} target
   * @param {Row|Row[]} rows
   * @param {TreeNodeModel} [parent] 있으면 그 행의 하위로, 없으면 최상위로 추가
   * @returns {TreeNodeModel[]} 추가된 행
   */
  const addRows = (target, rows, parent) => batch(target, (doc) => _.map(_.castArray(rows), (row) => {
    const node = toNode(row);
    parent ? parent.addChild(node) : doc.addRoot(node);
    return node;
  }));

  /**
   * 모든 행을 rows 로 바꾼다. 변경 트랜잭션 모드여도 변경 기록 없이 새 데이터로 시작한다.
   * @param {DocTarget} target
   * @param {Row[]} rows
   * @returns {TreeNodeModel[]} 추가된 최상위 행
   */
  const setRows = (target, rows) => {
    const doc = getDoc(target);
    const txMode = doc.getUseChangeTransactionMode();
    doc.setUseChangeTransactionMode(false);
    try {
      return batch(doc, () => {
        doc.empty();
        return addRows(doc, rows);
      });
    } finally {
      doc.setUseChangeTransactionMode(txMode);
      txMode && doc.acceptChanges();
    }
  };

  /**
   * 모든 행을 지운다. 변경 기록도 남기지 않는다.
   * @param {DocTarget} target
   */
  const clearRows = (target) => {
    setRows(target, []);
  };

  /**
   * 행 값을 바꾼다. 바뀐 셀만 다시 그려진다.
   * @param {TreeNodeModel} node
   * @param {Row} values 바꿀 값. label, icons, badges, data 키는 행 옵션으로, 나머지는 컬럼 값으로 넣는다 (children 은 무시)
   * @returns {TreeNodeModel} node
   */
  const updateNode = (node, values) => {
    node.updateOptions(_.assign(_.pick(values, NODE_KEYS), { grid: _.omit(values, NON_GRID_KEYS) }));
    return node;
  };

  /**
   * 키 컬럼 값이 같은 행을 찾아 값을 바꾼다. 서버 저장 결과를 반영할 때 쓴다.
   * @param {DocTarget} target
   * @param {Row|Row[]} rows 키 컬럼 값을 가진 행 데이터
   * @param {string} [key='id'] 키 컬럼 dataIndex
   * @returns {Row[]} 일치하는 행이 없어 반영하지 못한 행 데이터
   */
  const updateRows = (target, rows, key = 'id') => {
    const nodeByKey = keyNodesBy(target, key);
    return batch(target, () => _.reject(_.castArray(rows), (row) => nodeByKey[row[key]] && updateNode(nodeByKey[row[key]], row)));
  };

  /**
   * 키 컬럼 값이 같은 행은 값을 바꾸고, 없는 행은 최상위로 추가한다.
   * @param {DocTarget} target
   * @param {Row|Row[]} rows
   * @param {string} [key='id'] 키 컬럼 dataIndex
   * @returns {TreeNodeModel[]} 새로 추가된 행
   */
  const upsertRows = (target, rows, key = 'id') => batch(target, () => addRows(target, updateRows(target, rows, key)));

  const resolveNodes = (target, selector) => (selector instanceof TreeNodeModel || _.isArray(selector) ? _.concat([], selector) : getNodes(target, selector));

  /**
   * 행을 지운다. 변경 트랜잭션 모드에서는 삭제 표시만 하고 acceptChanges() 때 실제로 지워진다.
   * @param {DocTarget} target
   * @param {NodeSelector} selector
   * @returns {TreeNodeModel[]} 지운 행
   */
  const removeNodes = (target, selector) => batch(target, () => _.forEach(resolveNodes(target, selector), (node) => {
    node.remove();
  }));

  /**
   * 키 컬럼 값으로 행을 지운다.
   * @param {DocTarget} target
   * @param {*|Array} ids
   * @param {string} [key='id'] 키 컬럼 dataIndex
   * @returns {TreeNodeModel[]} 지운 행
   */
  const removeById = (target, ids, key = 'id') => removeNodes(target, byKeys(ids, key));

  /**
   * 선택된 행을 지운다.
   * @param {DocTarget} target
   * @returns {TreeNodeModel[]} 지운 행
   */
  const removeSelected = (target) => removeNodes(target, getSelectedNodes(target));

  /**
   * 행을 선택한다. 그리드 rowSelection 옵션이 'single' 또는 'multiple' 이어야 한다.
   * @param {GridTarget} target
   * @param {NodeSelector} selector 빈 배열이면 선택 해제
   * @param {boolean} [add=false] true 면 기존 선택 유지 ('multiple' 일 때)
   * @returns {TreeNodeModel[]} 선택한 행
   */
  const selectNodes = (target, selector, add = false) => {
    const grid = getGrid(target);
    const nodes = resolveNodes(grid, selector);
    add || grid.unselectAll();
    nodes.forEach((node) => grid.selectNodeModel(node, true));
    return nodes;
  };

  /**
   * 키 컬럼 값으로 행을 선택한다.
   * @param {GridTarget} target
   * @param {*|Array} ids
   * @param {string} [key='id'] 키 컬럼 dataIndex
   * @param {boolean} [add=false] true 면 기존 선택 유지
   * @returns {TreeNodeModel[]} 선택한 행
   */
  const selectById = (target, ids, key = 'id', add = false) => selectNodes(target, byKeys(ids, key), add);

  /**
   * 선택이 바뀌면 선택된 행 목록으로 fn 을 부른다. 한 번의 조작으로 여러 번 바뀌어도 한 번만 부른다.
   * @param {DocTarget} target
   * @param {function(TreeNodeModel[]): void} fn
   * @returns {function(): void} 구독 해제 함수
   */
  const onSelectionChange = (target, fn) => {
    const doc = getDoc(target);
    const xso = doc.getXSO();
    const notify = _.debounce(() => fn(getSelectedNodes(doc)), 0);
    const token = xso.onChange(notify);
    return () => {
      notify.cancel();
      xso.unsubscribe(token);
    };
  };

  /**
   * 행이 화면 가운데 보이도록 스크롤하고 깜빡여 표시한다. 접힌 부모는 펼친다.
   * @param {GridTarget} target
   * @param {TreeNodeModel|RowPredicate} selector 행 또는 행 조건 (조건이면 첫 행)
   * @param {boolean} [select=true] 그 행을 선택할지
   * @returns {TreeNodeModel|undefined} 대상 행
   */
  const revealNode = (target, selector, select = true) => {
    const grid = getGrid(target);
    const node = selector instanceof TreeNodeModel ? selector : findNode(grid, selector);
    if (node) {
      grid.ensureNodeModelVisible(node, true, true, 0.5, true);
      select && grid.selectNodeModel(node);
    }
    return node;
  };

  /**
   * 행을 펼칠 때 하위 행을 불러오게 한다.
   * TreeDocument 는 useAsyncPreExpand: true 로 만들고, 불러올 행은 children: [] 로 넣어 둔다.
   * 하위 행이 이미 있으면 다시 부르지 않고, 실패해도 preExpandDone() 을 불러 "펼치는 중" 에서 멈추지 않게 한다.
   * onPreExpand 는 하나만 등록되므로 다시 부르면 이전 loader 를 대체한다.
   * @param {DocTarget} target
   * @param {function(TreeNodeModel, Row): (Row[]|Promise<Row[]>)} loader 펼치는 행과 그 행 데이터를 받아 하위 행 데이터를 돌려준다
   */
  const setChildrenLoader = (target, loader) => {
    const doc = getDoc(target);
    doc.onPreExpand((e) => {
      const node = e.target;
      if (node.hasChildren()) {
        node.preExpandDone();
        return;
      }
      Promise.resolve()
        .then(() => loader(node, getRow(node)))
        .then((rows) => addRows(doc, rows, node))
        .finally(() => node.preExpandDone());
    });
  };

  /**
   * 조건에 맞는 행만 보이게 한다. 하위 행이 맞으면 부모 행도 보인다. 헤더 필터와는 별개로 show/hide 를 쓴다.
   * @param {DocTarget} target
   * @param {RowPredicate} predicate
   */
  const showRowsWhere = (target, predicate) => {
    const match = toMatcher(predicate);
    const apply = (node) => {
      const visible = _.filter(node.getChildren(), apply).length > 0 || match(node);
      visible ? node.show() : node.hide();
      return visible;
    };
    batch(target, (doc) => {
      doc.getRoots().forEach(apply);
    });
  };

  /**
   * showRowsWhere 로 숨긴 행을 모두 다시 보이게 한다.
   * @param {DocTarget} target
   */
  const showAllRows = (target) => showRowsWhere(target, _.stubTrue);

  /**
   * 헤더 컬럼 필터를 지정한다. 키 'tree' 는 TreeDocument 규칙에 맞춰 'label' 로 바꿔 넣는다.
   * @param {DocTarget} target
   * @param {Object<string, (string|Object)>} filters { dataIndex: filterId } 또는 { dataIndex: { filterId, ... } }
   */
  const setFilters = (target, filters) => getDoc(target).setFilterModel(_.mapValues(
    _.mapKeys(filters, (value, key) => (key === 'tree' ? 'label' : key)),
    (value) => (_.isString(value) ? { filterId: value } : value)
  ));

  /**
   * 정렬을 바꾼다. spec 을 빼면 정렬을 해제한다.
   * @param {GridTarget} target
   * @param {string|Array<{dataIndex: string, sort: string}>} [spec] dataIndex 또는 sortModel 배열
   * @param {('asc'|'desc')} [sort='asc'] spec 이 dataIndex 일 때 방향
   */
  const sortBy = (target, spec, sort = 'asc') => {
    getGrid(target).sortModel = _.isString(spec) ? [{ dataIndex: spec, sort }] : spec || [];
  };

  /**
   * 컬럼을 보이거나 숨긴다. alwaysVisibleFlag 컬럼은 숨겨지지 않는다.
   * @param {GridTarget} target
   * @param {string|string[]} dataIndexes
   * @param {boolean} [visible=true]
   */
  const setColumnsVisible = (target, dataIndexes, visible = true) => {
    const grid = getGrid(target);
    grid.prepareUpdateView();
    _.castArray(dataIndexes).forEach((dataIndex) => grid.layout.setColumnVisibleFlag(dataIndex, visible));
    grid.pushUpdateView();
  };

  const changeKindOf = (node) => {
    const { AttributesChanged, NodeAdded, NodeToBeRemoved } = window.WUXModelChangeStates;
    const state = node.getChangeStates();
    if (state & NodeToBeRemoved) {
      return state & NodeAdded ? 'discarded' : 'removed';
    }
    return state & NodeAdded ? 'added' : state & AttributesChanged ? 'modified' : 'unchanged';
  };

  /**
   * 변경 트랜잭션 모드에서 저장할 행을 추가, 수정, 삭제로 나눈다. 추가했다가 지운 행은 어디에도 넣지 않는다.
   * @param {DocTarget} target
   * @returns {{added: TreeNodeModel[], modified: TreeNodeModel[], removed: TreeNodeModel[]}}
   */
  const getChanges = (target) => {
    const groups = _.groupBy(getNodes(target), changeKindOf);
    return { added: groups.added || [], modified: groups.modified || [], removed: groups.removed || [] };
  };

  /**
   * 그리드 이벤트를 등록한다. 셀 안에서 발생하면 fn 의 두 번째 인자로 cellInfos 가 넘어온다.
   * @param {GridTarget} target
   * @param {string} name 이벤트 이름 (change, click, contextmenu, activeCellChange 등)
   * @param {function(Event, Object=): void} fn
   * @returns {function(): void} 등록 해제 함수
   */
  const on = (target, name, fn) => {
    const grid = getGrid(target);
    const handler = grid.addEventListener(name, fn);
    return () => grid.removeEventListener(name, handler);
  };

  const run = (task) => Promise.resolve().then(() => (_.isFunction(task) ? task() : task));

  /**
   * 작업이 끝날 때까지 그리드에 로딩 표시를 덮는다.
   * @template T
   * @param {GridTarget} target
   * @param {Promise<T>|function(): (T|Promise<T>)} task
   * @param {string} [text] 로딩 문구
   * @returns {Promise<T>}
   */
  const withLoader = (target, task, text) => {
    const grid = getGrid(target);
    grid.displayModalLoader(text);
    return run(task).finally(() => grid.removeModalLoader());
  };

  /**
   * 로딩 표시를 덮은 채로 행 데이터를 불러와 모든 행을 바꾼다.
   * @param {GridTarget} target
   * @param {Promise<Row[]>|function(): (Row[]|Promise<Row[]>)} task
   * @param {string} [text] 로딩 문구
   * @returns {Promise<TreeNodeModel[]>} 추가된 최상위 행
   */
  const loadRows = (target, task, text) => withLoader(target, () => run(task).then((rows) => setRows(target, rows)), text);

  /**
   * 그리드 내용을 CSV 파일로 내려받는다. getAsCSV 결과에 BOM 이 있어 엑셀에서 한글이 깨지지 않는다.
   * @param {GridTarget} target
   * @param {string} [fileName='export.csv']
   * @param {Object} [options] getAsCSV 옵션 (onlySelectedRows, columnKeys, allColumns, columnSeparator, forceQuotes)
   */
  const downloadCSV = (target, fileName = 'export.csv', options) => {
    const url = URL.createObjectURL(new Blob([getGrid(target).getAsCSV(options)], { type: 'text/csv;charset=utf-8' }));
    _.assign(document.createElement('a'), { href: url, download: fileName }).click();
    setTimeout(() => URL.revokeObjectURL(url));
  };

  return {
    getGrid,
    getDoc,
    batch,
    getValue,
    getRow,
    getNodes,
    getRows,
    findNode,
    getNodeById,
    keyNodesBy,
    getSelectedNodes,
    getSelectedRows,
    getActiveNode,
    getColumnValues,
    toNode,
    addRows,
    setRows,
    clearRows,
    updateNode,
    updateRows,
    upsertRows,
    removeNodes,
    removeById,
    removeSelected,
    selectNodes,
    selectById,
    onSelectionChange,
    revealNode,
    setChildrenLoader,
    showRowsWhere,
    showAllRows,
    setFilters,
    sortBy,
    setColumnsVisible,
    getChanges,
    on,
    withLoader,
    loadRows,
    downloadCSV
  };
});
