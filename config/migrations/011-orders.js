const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orders', {
            order_id: {
                type: DataTypes.STRING(15),
                primaryKey: true,
                allowNull: false
            },
            order_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            customer_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            customer_email: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
                allowNull: false
            },
            shipping_address: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            tracking_number: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('orders', [
            {
                order_id: 'ORD-2024-001',
                order_date: '2024-03-15 00:00:00',
                customer_id: 1,
                customer_name: 'John Smith',
                customer_email: 'john@example.com',
                total_amount: 299.99,
                status: 'processing',
                shipping_address: '123 Main St',
                tracking_number: null,
                created_at: '2025-01-30 01:18:36',
                updated_at: '2025-01-30 01:18:36'
            },
            {
                order_id: 'ORD-2024-002',
                order_date: '2024-03-14 00:00:00',
                customer_id: 2,
                customer_name: 'Emma Wilson',
                customer_email: 'emma@example.com',
                total_amount: 399.98,
                status: 'shipped',
                shipping_address: '456 Oak Ave',
                tracking_number: null,
                created_at: '2025-01-30 01:18:36',
                updated_at: '2025-01-30 01:18:36'
            },
            {
                order_id: 'ORD-2024-003',
                order_date: '2024-03-14 00:00:00',
                customer_id: 3,
                customer_name: 'Michael Brown',
                customer_email: 'michael@example.com',
                total_amount: 449.97,
                status: 'pending',
                shipping_address: '789 Pine Rd',
                tracking_number: null,
                created_at: '2025-01-30 01:18:36',
                updated_at: '2025-01-30 01:18:36'
            },
            {
                order_id: 'ORD-2024-004',
                order_date: '2024-03-13 00:00:00',
                customer_id: 4,
                customer_name: 'Sarah Davis',
                customer_email: 'sarah@example.com',
                total_amount: 89.99,
                status: 'cancelled',
                shipping_address: '321 Elm St',
                tracking_number: null,
                created_at: '2025-01-30 01:18:36',
                updated_at: '2025-01-30 01:18:36'
            },
            {
                order_id: 'ORD-2024-005',
                order_date: '2024-03-13 00:00:00',
                customer_id: 5,
                customer_name: 'David Wilson',
                customer_email: 'david@example.com',
                total_amount: 249.99,
                status: 'delivered',
                shipping_address: '654 Maple Dr',
                tracking_number: null,
                created_at: '2025-01-30 01:18:36',
                updated_at: '2025-01-30 01:18:36'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('orders');
    }
};
