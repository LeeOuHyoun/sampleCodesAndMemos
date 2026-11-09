/*
 * 03_generatedToolbar.html 의 action: { module, func, argument } 로 연결되는 함수 모음
 *
 * 인자 e = argument 의 키 + { context, dsModel }
 *   e.step                     : argument.step
 *   e.context.executionContext : new GeneratedToolbar({ executionContext }) 에 넣은 객체
 *   e.context.toolbar          : 툴바
 *   e.context.nodeModel        : 클릭된 항목
 */
define('DS/TweakersSample/ToolbarActions', [], function () {
  'use strict';

  function changeZoom(e) {
    var toolbar = e.context.toolbar;
    var current = parseInt(toolbar.getNodeModelByID('zoomRate').getAttributeValue('data'), 10) || 100;
    var next = Math.min(200, Math.max(50, current + e.step));
    toolbar.updateNodeModel('zoomRate', { grid: { data: next + '%' } });
    toolbar.prepareUpdateView();
    toolbar.updateNodeModel('zoomIn', { disabled: next >= 200 });
    toolbar.updateNodeModel('zoomOut', { disabled: next <= 50 });
    toolbar.pushUpdateView();
    e.context.executionContext.log('zoom ' + current + '% → ' + next + '%');
  }

  return {
    zoomIn: changeZoom,
    zoomOut: changeZoom
  };
});
