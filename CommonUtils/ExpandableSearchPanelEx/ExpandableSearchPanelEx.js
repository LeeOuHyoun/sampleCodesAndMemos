define('DS/CommonUtils/ExpandableSearchPanelEx/ExpandableSearchPanelEx', [
  'UWA/Core',
  'DS/sdxENOChgGovernanceUX/custom/util/lodash',
  'DS/Controls/Button',
  'UWA/Element',
  'css!DS/CommonUtils/ExpandableSearchPanelEx/ExpandableSearchPanelEx.css'
], (UWA, _, Button) => {
  'use strict';

  const ROW_STEPS = [1, 4, 12];

  const createField = (field) => UWA.createElement('div', {
    'class': 'espx-field',
    html: [
      { tag: 'label', 'class': 'espx-label', text: field.label },
      { 'class': 'espx-editor', html: [field.editor.content] }
    ]
  });

  const createRow = (rowConfig) => {
    const element = UWA.createElement('div', {
      'class': 'espx-row',
      html: [{
        'class': 'espx-row-inner',
        html: [{ 'class': 'espx-fields', html: _.map(rowConfig.fields, createField) }]
      }]
    });
    element.addEventListener('transitionend', (e) => {
      if (e.target === element && element.hasClassName('espx-row--open')) {
        element.addClassName('espx-row--settled');
      }
    });
    return { fields: rowConfig.fields, element };
  };

  const create = (options) => {
    const validate = _.defaultTo(options.validate, _.stubTrue);
    const rows = _.map(options.rows, createRow);
    let stepIndex = 0;

    const getValues = () => _.fromPairs(_.map(
      _.flatMap(_.take(rows, ROW_STEPS[stepIndex]), 'fields'),
      (field) => [field.id, field.editor.getValue()]
    ));

    const searchButton = new Button({ label: '검색', emphasize: 'primary' });
    searchButton.addEventListener('buttonclick', () => {
      const values = getValues();
      if (validate(values)) {
        options.onSearch(values);
      }
    });

    const toggleIcon = UWA.createElement('span', { 'class': 'espx-toggle wux-ui-3ds' });
    const expander = UWA.createElement('div', { 'class': 'espx-expander', html: [toggleIcon] });

    const applyStep = () => {
      const visibleCount = ROW_STEPS[stepIndex];
      _.forEach(rows, (row, index) => {
        const open = index < visibleCount;
        if (!open) {
          _.forEach(row.fields, (field) => field.editor.reset());
          row.element.removeClassName('espx-row--settled');
        }
        row.element.toggleClassName('espx-row--open', open);
        row.element.inert = !open;
      });
      const expanded = stepIndex === ROW_STEPS.length - 1;
      toggleIcon.toggleClassName('wux-ui-3ds-expand-up', expanded);
      toggleIcon.toggleClassName('wux-ui-3ds-expand-down', !expanded);
    };

    expander.addEvent('click', () => {
      stepIndex = (stepIndex + 1) % ROW_STEPS.length;
      applyStep();
    });

    const element = UWA.createElement('div', {
      'class': 'espx',
      html: [
        {
          'class': 'espx-body',
          html: [
            { 'class': 'espx-rows', html: _.map(rows, 'element') },
            { 'class': 'espx-actions', html: [searchButton] }
          ]
        },
        expander
      ]
    });

    element.style.setProperty('--espx-columns', _.max(_.map(rows, (row) => row.fields.length)));
    applyStep();
    _.head(rows).element.addClassName('espx-row--settled');

    return { element, getValues };
  };

  const attachToGrid = (grid, options) => {
    const gridElement = grid.getContent();
    const panel = create(options);
    const gridHolder = UWA.createElement('div', { 'class': 'espx-grid-holder' });
    UWA.createElement('div', {
      'class': 'espx-layout',
      html: [panel.element, gridHolder]
    }).inject(gridElement, 'before');
    gridHolder.appendChild(gridElement);
    return panel;
  };

  return { create, attachToGrid };
});
