const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sales_metrics', {
            sales_metric_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            period_start: {
                type: DataTypes.DATE,
                allowNull: false
            },
            period_end: {
                type: DataTypes.DATE,
                allowNull: false
            },
            metric_type: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            value: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false
            },
            currency: {
                type: DataTypes.STRING(3),
                defaultValue: 'USD'
            }
        });

        // Add index for period_start and period_end
        await queryInterface.addIndex('sales_metrics', {
            fields: ['period_start', 'period_end'],
            name: 'idx_sales_metrics_period'
        });

        // Insert initial data
        await queryInterface.bulkInsert('sales_metrics', [
            {
                timestamp: '2025-01-30 04:05:55',
                period_start: '2024-01-01',
                period_end: '2024-03-31',
                metric_type: 'quarterly_sales',
                value: 15000.00,
                currency: 'RM'
            },
            {
                timestamp: '2025-01-30 04:05:55',
                period_start: '2024-04-01',
                period_end: '2024-06-30',
                metric_type: 'quarterly_sales',
                value: 20000.00,
                currency: 'RM'
            },
            {
                timestamp: '2025-01-30 04:05:55',
                period_start: '2024-07-01',
                period_end: '2024-09-30',
                metric_type: 'quarterly_sales',
                value: 18000.00,
                currency: 'RM'
            },
            {
                timestamp: '2025-01-30 04:05:55',
                period_start: '2024-10-01',
                period_end: '2024-12-31',
                metric_type: 'quarterly_sales',
                value: 22000.00,
                currency: 'RM'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sales_metrics');
    }
};
