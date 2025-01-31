const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('notifications', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('notifications', [
            {
                user_id: 1,
                type: 'order_update',
                message: 'Your order #TT-2024-0123 has been shipped',
                read: false,
                created_at: '2024-03-15 10:30:00'
            },
            {
                user_id: 2,
                type: 'delivery_alert',
                message: 'Package will be delivered today',
                read: true,
                created_at: '2024-03-15 09:15:00'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('notifications');
    }
}; 