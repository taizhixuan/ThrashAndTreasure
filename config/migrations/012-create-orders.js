const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orders', {
            id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            buyer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            seller_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
                defaultValue: 'Pending'
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
        await queryInterface.bulkInsert('orders', [
            {
                id: 'ORD-2024-001',
                buyer_id: 2,
                seller_id: 3,
                product_id: 1,
                quantity: 1,
                total_amount: 299.99,
                status: 'Processing',
                created_at: '2024-03-15 10:30:00',
                updated_at: '2024-03-15 10:30:00'
            },
            {
                id: 'ORD-2024-002',
                buyer_id: 4,
                seller_id: 3,
                product_id: 2,
                quantity: 2,
                total_amount: 599.98,
                status: 'Pending',
                created_at: '2024-03-15 11:45:00',
                updated_at: '2024-03-15 11:45:00'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('orders');
    }
}; 