/*
 * 03_generatedToolbar.html 의 action: { module, func, argument } 로 연결되는 함수 모음
 *
 * 인자 e = argument 의 키 + { context, dsModel }
 *   e.step                     : argument.step
 *   e.context.executionContext : new GeneratedToolbar({ executionContext }) 에 넣은 객체
 *   e.context.toolbar          : 툴바
 *   e.context.nodeModel        : 클릭된 항목
 *
 * 상태(disabled)와 값만 바꾸므로 prepareUpdateView / pushUpdateView 로 감싸지 않는다.
 * 감싸면 pushUpdateView 때 툴바 전체를 다시 그린다.
 */
define('DS/TweakersSample/ToolbarActions', [], function () {
  'use strict';

  // #region zoom
  function changeZoom(e) {
    var toolbar = e.context.toolbar;
    var current = parseInt(toolbar.getNodeModelByID('zoomRate').getAttributeValue('data'), 10) || 100;
    var next = Math.min(200, Math.max(50, current + e.step));
    toolbar.updateNodeModel('zoomRate', { grid: { data: next + '%' } });
    toolbar.updateNodeModel('zoomIn', { disabled: next >= 200 });
    toolbar.updateNodeModel('zoomOut', { disabled: next <= 50 });
    e.context.executionContext.log('zoom ' + current + '% → ' + next + '%');
  }

  return {
    zoomIn: changeZoom,
    zoomOut: changeZoom
  };
  // #endregion zoom
});
