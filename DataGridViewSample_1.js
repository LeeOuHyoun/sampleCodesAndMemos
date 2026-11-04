define('MyWidget/MultiSelectGrid', [
    'UWA/Core',
    'DS/DataGridView/DataGridView',
    'DS/TreeModel/TreeDocument',
    'DS/TreeModel/TreeNodeModel'
], function (UWA, DataGridView, TreeDocument, TreeNodeModel) {
    'use strict';

    var MyMultiSelectGrid = {
        init: function (container) {
            var model = new TreeDocument();

            var row1 = new TreeNodeModel({
                label: 'Item 1',
                grid: {
                    id: '1',
                    name: 'Task Alpha',
                    roles: ['Admin', 'Manager']
                }
            });

            var row2 = new TreeNodeModel({
                label: 'Item 2',
                grid: {
                    id: '2',
                    name: 'Task Beta',
                    roles: ['User']
                }
            });

            model.addRoots([row1, row2]);

            var columns = [
                {
                    dataIndex: 'tree',
                    text: 'Label',
                    width: 120
                },
                {
                    dataIndex: 'id',
                    text: 'ID',
                    width: 80
                },
                {
                    dataIndex: 'name',
                    text: 'Name',
                    width: 150
                },
                {
                    dataIndex: 'roles',
                    text: 'Roles (Multi-Select)',
                    width: 250,
                    editableFlag: true,
                    typeRepresentation: 'enumString',
                    getCellSemantics: function (cellInfos) {
                        return {
                            possibleValues: ['Admin', 'User', 'Manager', 'Guest', 'Auditor'],
                            multiSelectFlag: true
                        };
                    },
                    getCellValueForExport: function (cellInfos) {
                        var val = cellInfos.cellModel;
                        return Array.isArray(val) ? val.join(', ') : '';
                    }
                }
            ];

            var dataGridView = new DataGridView({
                treeDocument: model,
                columns: columns,
                defaultColumnDef: {
                    width: 'auto'
                }
            });

            dataGridView.inject(container);
            return dataGridView;
        }
    };

    return MyMultiSelectGrid;
});
