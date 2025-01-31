const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transactions', {
            id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            order_id: {
                type: DataTypes.STRING(20),
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                }
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            payment_method: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
                defaultValue: 'Pending'
            },
            payment_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('transactions', [
            {
                id: 'TRX-2024-001',
                order_id: 'ORD-2024-001',
                amount: 312.98,
                payment_method: 'Credit Card',
                status: 'Completed',
                payment_date: '2024-03-15 10:30:00',
                created_at: '2024-03-15 10:30:00',
                updated_at: '2024-03-15 10:30:00'
            },
            {
                id: 'TRX-2024-002',
                order_id: 'ORD-2024-002',
                amount: 624.97,
                payment_method: 'PayPal',
                status: 'Pending',
                payment_date: '2024-03-15 11:45:00',
                created_at: '2024-03-15 11:45:00',
                updated_at: '2024-03-15 11:45:00'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transactions');
    }
}; 