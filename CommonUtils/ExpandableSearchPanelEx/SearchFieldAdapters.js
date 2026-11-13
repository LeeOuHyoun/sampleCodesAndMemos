define('DS/CommonUtils/ExpandableSearchPanelEx/SearchFieldAdapters', [
  'UWA/Core',
  'DS/sdxENOChgGovernanceUX/custom/util/lodash',
  'DS/Controls/LineEditor',
  'DS/Controls/Toggle',
  'DS/Controls/ButtonGroup',
  'DS/Controls/ComboBox',
  'DS/Tweakers/TweakerDate',
  'UWA/Element'
], (UWA, _, LineEditor, Toggle, ButtonGroup, ComboBox, TweakerDate) => {
  'use strict';

  const formatDate = (date) => (_.isDate(date)
    ? [date.getFullYear(), _.padStart(date.getMonth() + 1, 2, '0'), _.padStart(date.getDate(), 2, '0')].join('-')
    : '');

  const text = (options = {}) => {
    const editor = new LineEditor({ placeholder: _.defaultTo(options.placeholder, '') });
    return {
      content: editor,
      getValue: () => {
        editor.commitCurrentEntry();
        return _.defaultTo(editor.value, '');
      },
      reset: () => {
        editor.value = '';
      }
    };
  };

  const checkbox = (options = {}) => {
    const toggle = new Toggle({ type: 'checkbox', label: _.defaultTo(options.label, '') });
    return {
      content: toggle,
      getValue: () => toggle.checkFlag,
      reset: () => {
        toggle.checkFlag = false;
      }
    };
  };

  const checkboxGroup = (options) => {
    const group = new ButtonGroup({ type: 'checkbox', direction: 'horizontal' });
    const toggles = _.map(options.items, (item) => new Toggle({ type: 'checkbox', label: item, value: item }));
    _.forEach(toggles, (toggle) => group.addChild(toggle));
    return {
      content: group,
      getValue: () => _.map(_.filter(toggles, 'checkFlag'), 'value'),
      reset: () => {
        _.forEach(toggles, (toggle) => {
          toggle.checkFlag = false;
        });
      }
    };
  };

  const select = (options) => {
    const combo = new ComboBox({
      elementsList: options.items,
      placeholder: _.defaultTo(options.placeholder, ''),
      enableSearchFlag: false
    });
    return {
      content: combo,
      getValue: () => _.defaultTo(combo.value, ''),
      reset: () => {
        combo.selectedIndex = -1;
      }
    };
  };

  const multiSelect = (options) => {
    const combo = new ComboBox({
      elementsList: options.items,
      placeholder: _.defaultTo(options.placeholder, ''),
      enableSearchFlag: false,
      multiSelFlag: true
    });
    return {
      content: combo,
      getValue: () => _.castArray(_.defaultTo(combo.value, [])),
      reset: () => {
        combo.selectedIndexes = [];
      }
    };
  };

  const createDatePicker = () => new TweakerDate({ allowResetToUndefinedByUIFlag: true });

  const date = () => {
    const picker = createDatePicker();
    return {
      content: UWA.createElement('div', { 'class': 'espx-date', html: [picker] }),
      getValue: () => formatDate(picker.value),
      reset: () => {
        picker.value = undefined;
      }
    };
  };

  const dateRange = () => {
    const from = createDatePicker();
    const to = createDatePicker();
    from.addEventListener('change', () => {
      to.minValue = from.value;
    });
    to.addEventListener('change', () => {
      from.maxValue = to.value;
    });
    return {
      content: UWA.createElement('div', {
        'class': 'espx-date-range',
        html: [
          { 'class': 'espx-date', html: [from] },
          { tag: 'span', 'class': 'espx-date-separator', text: '~' },
          { 'class': 'espx-date', html: [to] }
        ]
      }),
      getValue: () => ({ from: formatDate(from.value), to: formatDate(to.value) }),
      reset: () => {
        from.value = undefined;
        to.value = undefined;
      }
    };
  };

  return { text, checkbox, checkboxGroup, select, multiSelect, date, dateRange };
});
