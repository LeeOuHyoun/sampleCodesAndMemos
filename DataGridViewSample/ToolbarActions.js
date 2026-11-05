/*
 * 툴바 버튼/입력의 동작을 모아 둔 AMD 모듈 (03_toolbar.html 에서 사용)
 *
 * - 툴바 JSON 의 action: { module: 'DS/DataGridViewSample/ToolbarActions', func: 'addRow' } 처럼
 *   "모듈 이름 + 함수 이름" 으로 연결된다. (Tweakers/Tweakers.js 의 GeneratedToolbar 가 require 로 불러서 호출)
 * - 'DS/DataGridViewSample/...' 은 AmdLoader 규칙상 webapps/DataGridViewSample/ToolbarActions.js 로 해석된다.
 *   (로더가 먼저 DataGridViewSample/DataGridViewSample.js 묶음 파일을 찾아보고 없으면
 *    콘솔에 "Concatenated module ... not found" info 를 남긴 뒤 이 파일을 직접 로드한다. 정상 동작이다.)
 *
 * 모든 함수가 받는 인자 e 의 구조 (Tweakers.js 의 GeneratedToolbar 내부 함수 M/T 참고)
 *   e.context.executionContext : 툴바를 만든 DataGridView 인스턴스 (grid.setToolbar 를 호출한 객체)
 *   e.context.toolbar          : 툴바 인스턴스
 *   e.context.nodeModel        : 클릭/변경된 툴바 항목
 *   e.context.value            : 툴바 항목의 현재 값 (검색창 문자열, 콤보 선택값 등)
 */
define('DS/DataGridViewSample/ToolbarActions', ['DS/TreeModel/TreeNodeModel'], function (TreeNodeModel) {
  'use strict';

  var newRowCount = 0;

  /* 검색어 + 상태 콤보 두 조건을 함께 적용해서 행을 보이기/숨기기 */
  var currentKeyword = '';
  var currentStatus = '전체';

  function applyRowVisibility(grid) {
    var treeDocument = grid.treeDocument;
    treeDocument.prepareUpdate();
    treeDocument.getRoots().forEach(function (node) {
      var label = String(node.options.label);
      var status = node.getAttributeValue('status');
      var keywordOk = currentKeyword === '' || label.toLowerCase().indexOf(currentKeyword.toLowerCase()) > -1;
      var statusOk = currentStatus === '전체' || status === currentStatus;
      if (keywordOk && statusOk) {
        node.show();
      } else {
        node.hide();
      }
    });
    treeDocument.pushUpdate();
  }

  return {
    /* [+] 버튼 : 행 추가. TreeDocument 에 TreeNodeModel 을 addRoot 하면 그리드에 바로 반영된다. */
    addRow: function (e) {
      var grid = e.context.executionContext;
      newRowCount++;
      grid.treeDocument.prepareUpdate();
      grid.treeDocument.addRoot(new TreeNodeModel({
        label: 'NEW-' + newRowCount,
        grid: { title: '신규 부품 ' + newRowCount, status: '작업중', progress: 0, qty: 1 }
      }));
      grid.treeDocument.pushUpdate();
    },

    /* [휴지통] 버튼 : 선택된 행 삭제. 선택 정보는 TreeDocument 가 가지고 있다. */
    deleteSelected: function (e) {
      var grid = e.context.executionContext;
      var selectedNodes = grid.treeDocument.getSelectedNodes();
      if (selectedNodes.length === 0) {
        alert('삭제할 행을 선택하세요.');
        return;
      }
      grid.treeDocument.prepareUpdate();
      selectedNodes.forEach(function (node) {
        grid.treeDocument.removeRoot(node);
      });
      grid.treeDocument.pushUpdate();
    },

    /* [보기] 버튼 : 선택된 행의 값을 읽어서 확인. getAttributeValue(dataIndex) 로 셀 값을 읽는다. */
    showSelected: function (e) {
      var grid = e.context.executionContext;
      var lines = grid.treeDocument.getSelectedNodes().map(function (node) {
        return node.options.label + ' / ' + node.getAttributeValue('title') + ' / ' + node.getAttributeValue('status') + ' / ' + node.getAttributeValue('progress') + '%';
      });
      alert(lines.length ? lines.join('\n') : '선택된 행이 없습니다.');
    },

    /* 검색창(onNodeUpdate) : 값이 확정(Enter/포커스 이동)되면 호출된다. */
    searchByPartNo: function (e) {
      currentKeyword = e.context.value || '';
      applyRowVisibility(e.context.executionContext);
    },

    /* 상태 콤보(onNodeUpdate) : 콤보 값이 바뀌면 호출된다. */
    filterByStatus: function (e) {
      currentStatus = e.context.value || '전체';
      applyRowVisibility(e.context.executionContext);
    },

    /* [새로고침] 버튼 : 검색 조건 초기화 후 모든 행 표시 (툴바 입력칸에 남은 글자는 그대로 둔다) */
    resetView: function (e) {
      currentKeyword = '';
      currentStatus = '전체';
      applyRowVisibility(e.context.executionContext);
    }
  };
});
