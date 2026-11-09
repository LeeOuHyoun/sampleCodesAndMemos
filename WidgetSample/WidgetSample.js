define('DS/WidgetSample/WidgetSample', [
  'UWA/Core',
  'DS/WAFData/WAFData',
  'DS/WebappsUtils/WebappsUtils',
  'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
  'i18n!DS/WidgetSample/assets/nls/WidgetSample',
  'css!DS/WidgetSample/WidgetSample.css'
], function (UWA, WAFData, WebappsUtils, CompassServices, nls) {
  'use strict';

  var widget;
  var state = { spaceUrl: null, userName: null, error: null };
  var infoEl;
  var logEl;

  function log(text) {
    if (logEl) {
      logEl.textContent = new Date().toLocaleTimeString() + '  ' + text + '\n' + logEl.textContent;
    }
  }

  /* [1] WAFData 를 Promise 로 감싸기 (onPassportError 포함) */
  function request(url, options) {
    return new Promise(function (resolve, reject) {
      WAFData.authenticatedRequest(url, UWA.extend({
        method: 'GET',
        type: 'json',
        onComplete: function (data) { resolve(data); },
        onFailure: function (error, data) { reject(error || data); },
        onTimeout: function (error) { reject(error); },
        onPassportError: function (error) { reject(error); }
      }, options || {}));
    });
  }

  /* [2] 3DSpace 주소: Compass 에 묻고, 응답이 없으면 webapps 주소에서 계산 */
  function getSpaceUrl() {
    var fallback = WebappsUtils.getWebappsBaseUrl().replace(/webapps\/?$/, '');
    return new Promise(function (resolve) {
      var done = false;
      function finish(url, from) {
        if (done) {
          return;
        }
        done = true;
        log('3DSpace URL (' + from + ')');
        resolve(String(url).replace(/\/$/, ''));
      }
      setTimeout(function () { finish(fallback, 'fallback'); }, 5000);
      CompassServices.getServiceUrl({
        serviceName: '3DSpace',
        platformId: widget.getValue('x3dPlatformId') || undefined,
        onComplete: function (result) {
          var url = Array.isArray(result) ? (result[0] && result[0].url) : result;
          finish(url || fallback, url ? 'compass' : 'fallback');
        },
        onFailure: function () { finish(fallback, 'fallback'); }
      });
    });
  }

  /* [3] SecurityContext 목록: pno/person 응답의 collabspaces → ctx::역할.조직.협업공간 */
  function toContext(role, organization, collabspace) {
    return 'ctx::' + role + '.' + organization + '.' + collabspace;
  }

  function loadSecurityContexts() {
    var platformId = widget.getValue('x3dPlatformId');
    var url = state.spaceUrl + '/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces';
    if (platformId) {
      url += '&tenant=' + encodeURIComponent(platformId);
    }
    return request(url, { headers: { Accept: 'application/json' } }).then(function (person) {
      var options = [];
      var values = [];
      var pref = person.preferredcredentials;
      var preferred = pref && pref.role ? toContext(pref.role.name, pref.organization.name, pref.collabspace.name) : null;
      var saved = widget.getValue('securityContext');
      (person.collabspaces || []).forEach(function (cs) {
        (cs.couples || []).forEach(function (couple) {
          var value = toContext(couple.role.name, couple.organization.name, cs.name);
          values.push(value);
          options.push({ value: value, label: (cs.title || cs.name) + ' / ' + (couple.role.nls || couple.role.name) });
        });
      });
      var chosen = values.indexOf(saved) !== -1 ? saved : (values.indexOf(preferred) !== -1 ? preferred : values[0]);
      state.userName = person.name;
      /* [4] 위젯 설정에 목록형 항목을 코드로 추가 (같은 이름이면 교체) */
      widget.addPreference({
        name: 'securityContext',
        type: 'list',
        label: 'prefSecurityContext',
        options: options,
        defaultValue: chosen
      });
      /* [5] getValue 가 이미 캐시한 값은 defaultValue 로 바뀌지 않으므로 직접 저장 */
      if (saved !== chosen) {
        widget.setValue('securityContext', chosen);
      }
      log('SecurityContext ' + values.length + ' 개');
    });
  }

  /* [6] 화면 */
  function buildSkeleton() {
    infoEl = UWA.createElement('table', { 'class': 'ws-info' });
    logEl = UWA.createElement('div', { 'class': 'ws-log' });
    widget.setBody(UWA.createElement('div', {
      'class': 'ws-page',
      html: [
        { tag: 'h4', text: nls.get('infoTitle') },
        infoEl,
        { tag: 'h4', text: nls.get('logTitle') },
        logEl
      ]
    }));
  }

  function render() {
    var rows = [
      [nls.get('hello', { name: state.userName || '-' }), ''],
      ['x3dPlatformId', widget.getValue('x3dPlatformId') || '-'],
      [nls.get('spaceUrl'), state.spaceUrl || nls.get('loading')],
      [nls.get('securityContext'), widget.getValue('securityContext') || '-'],
      ['widget.lang', widget.lang],
      ['widget.id', String(widget.id)],
      [nls.get('prefPageSize'), widget.getInt('pageSize')],
      [nls.get('prefShowState'), String(widget.getBool('showState'))],
      [nls.get('prefViewMode'), widget.getValue('viewMode')]
    ];
    if (state.error) {
      rows.push([nls.get('error'), state.error]);
    }
    infoEl.setContent(rows.map(function (row) {
      return { tag: 'tr', html: [{ tag: 'th', text: row[0] }, { tag: 'td', text: String(row[1]) }] };
    }));
  }

  /* [7] 위젯 이벤트 */
  function onLoad() {
    widget.setTitle(nls.get('title'));
    buildSkeleton();
    log('onLoad');
    render();
    getSpaceUrl().then(function (url) {
      state.spaceUrl = url;
      render();
      return loadSecurityContexts();
    }).catch(function (error) {
      state.error = (error && error.message) || String(error);
      log('error: ' + state.error);
    }).then(render);
  }

  function onRefresh() {
    log('onRefresh');
    render();
  }

  function onEndEdit() {
    log('endEdit');
    render();
  }

  function onResize() {
    log('onResize ' + widget.body.offsetWidth + 'x' + widget.body.offsetHeight);
  }

  function onViewChange(view) {
    log('onViewChange ' + (view && view.type));
  }

  return {
    start: function (w) {
      widget = w;
      widget.addEvents({
        onLoad: onLoad,
        onRefresh: onRefresh,
        endEdit: onEndEdit,
        onResize: onResize,
        onViewChange: onViewChange
      });
    }
  };
});
