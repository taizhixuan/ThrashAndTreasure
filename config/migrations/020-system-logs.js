const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('system_logs', {
            log_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            log_level: {
                type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'DEBUG'),
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            source: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            trace: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('system_logs', [
            {
                timestamp: '2025-01-30 04:05:42',
                log_level: 'ERROR',
                message: 'Database connection failed',
                source: 'DatabaseService',
                trace: null
            },
            {
                timestamp: '2025-01-30 04:05:42',
                log_level: 'WARNING',
                message: 'High memory usage detected',
                source: 'SystemMonitor',
                trace: null
            },
            {
                timestamp: '2025-01-30 04:05:42',
                log_level: 'INFO',
                message: 'Scheduled maintenance completed',
                source: 'MaintenanceService',
                trace: null
            },
            {
                timestamp: '2025-01-30 04:05:42',
                log_level: 'ERROR',
                message: 'API response timeout',
                source: 'APIService',
                trace: null
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('system_logs');
    }
};
