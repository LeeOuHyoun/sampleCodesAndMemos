define('DS/CommonUtils/ExpandableSearchPanel/ExpandableSearchPanel', [
  'UWA/Core',
  'DS/Controls/LineEditor',
  'DS/Controls/Button',
  'UWA/Element',
  'css!DS/CommonUtils/ExpandableSearchPanel/ExpandableSearchPanel.css'
], (UWA, LineEditor, Button) => {
  'use strict';

  const ROW_STEPS = [1, 4, 12];

  const iconOf = (iconName) => ({ iconName, fontIconFamily: WUXManagedFontIcons.Font3DS });

  const fieldFactories = {
    text: (field) => {
      const editor = new LineEditor({ placeholder: field.placeholder || '' });
      return {
        control: editor,
        getValue: () => {
          editor.commitCurrentEntry();
          return editor.value || '';
        },
        reset: () => {
          editor.value = '';
        }
      };
    }
  };

  const createRow = (field) => {
    const input = fieldFactories[field.type || 'text'](field);
    const element = UWA.createElement('div', {
      'class': 'esp-row',
      html: [{
        'class': 'esp-row-inner',
        html: [{
          'class': 'esp-field',
          html: [
            { tag: 'label', 'class': 'esp-label', text: field.label },
            { 'class': 'esp-editor', html: [input.control] }
          ]
        }]
      }]
    });
    element.addEventListener('transitionend', (e) => {
      if (e.target === element && element.hasClassName('esp-row--open')) {
        element.addClassName('esp-row--settled');
      }
    });
    return { field, input, element };
  };

  const create = (options) => {
    const validate = options.validate || (() => true);
    const rows = options.fields.map(createRow);
    let stepIndex = 0;

    const getValues = () => rows
      .slice(0, ROW_STEPS[stepIndex])
      .reduce((values, row) => Object.assign(values, { [row.field.id]: row.input.getValue() }), {});

    const searchButton = new Button({ label: '검색', emphasize: 'primary' });
    searchButton.addEventListener('buttonclick', () => {
      const values = getValues();
      if (validate(values)) {
        options.onSearch(values);
      }
    });

    const toggleButton = new Button({ displayStyle: 'lite', showLabelFlag: false, icon: iconOf('expand-down') });

    const applyStep = () => {
      const visibleCount = ROW_STEPS[stepIndex];
      rows.forEach((row, index) => {
        const open = index < visibleCount;
        if (!open) {
          row.input.reset();
          row.element.removeClassName('esp-row--settled');
        }
        row.element.toggleClassName('esp-row--open', open);
        row.element.inert = !open;
      });
      toggleButton.icon = iconOf(stepIndex === ROW_STEPS.length - 1 ? 'expand-up' : 'expand-down');
    };

    toggleButton.addEventListener('buttonclick', () => {
      stepIndex = (stepIndex + 1) % ROW_STEPS.length;
      applyStep();
    });

    const element = UWA.createElement('div', {
      'class': 'esp',
      html: [
        {
          'class': 'esp-body',
          html: [
            { 'class': 'esp-rows', html: rows.map((row) => row.element) },
            { 'class': 'esp-actions', html: [searchButton] }
          ]
        },
        { 'class': 'esp-expander', html: [toggleButton] }
      ]
    });

    applyStep();
    rows[0].element.addClassName('esp-row--settled');

    return { element, getValues };
  };

  const attachToGrid = (grid, options) => {
    const gridElement = grid.getContent();
    const panel = create(options);
    const gridHolder = UWA.createElement('div', { 'class': 'esp-grid-holder' });
    UWA.createElement('div', {
      'class': 'esp-layout',
      html: [panel.element, gridHolder]
    }).inject(gridElement, 'before');
    gridHolder.appendChild(gridElement);
    return panel;
  };

  return { create, attachToGrid };
});
