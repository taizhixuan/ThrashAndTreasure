const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('performance_metrics', {
            metric_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            metric_name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            metric_value: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            metric_unit: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('performance_metrics', [
            {
                timestamp: '2025-01-30 04:05:36',
                metric_name: 'active_users',
                metric_value: 1234.00,
                metric_unit: 'users',
                category: 'user_metrics'
            },
            {
                timestamp: '2025-01-30 04:05:36',
                metric_name: 'cpu_usage',
                metric_value: 45.50,
                metric_unit: 'percent',
                category: 'system_metrics'
            },
            {
                timestamp: '2025-01-30 04:05:36',
                metric_name: 'memory_usage',
                metric_value: 75.20,
                metric_unit: 'percent',
                category: 'system_metrics'
            },
            {
                timestamp: '2025-01-30 04:05:36',
                metric_name: 'response_time',
                metric_value: 250.00,
                metric_unit: 'ms',
                category: 'performance_metrics'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('performance_metrics');
    }
};
