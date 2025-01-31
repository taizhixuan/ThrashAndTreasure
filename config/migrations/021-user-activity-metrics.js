const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_activity_metrics', {
            activity_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            user_type: {
                type: DataTypes.ENUM('BUYER', 'SELLER', 'ADMIN'),
                allowNull: false
            },
            activity_type: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            count: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            details: {
                type: DataTypes.JSON,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('user_activity_metrics', [
            {
                timestamp: '2025-01-30 04:05:49',
                user_type: 'BUYER',
                activity_type: 'login',
                count: 150,
                details: JSON.stringify({
                    device: 'mobile',
                    region: 'North'
                })
            },
            {
                timestamp: '2025-01-30 04:05:49',
                user_type: 'SELLER',
                activity_type: 'product_listing',
                count: 45,
                details: JSON.stringify({
                    category: 'electronics'
                })
            },
            {
                timestamp: '2025-01-30 04:05:49',
                user_type: 'ADMIN',
                activity_type: 'user_management',
                count: 10,
                details: JSON.stringify({
                    action: 'account_verification'
                })
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_activity_metrics');
    }
};
