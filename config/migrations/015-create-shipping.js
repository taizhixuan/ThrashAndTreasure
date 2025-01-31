const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('shipping', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            order_id: {
                type: DataTypes.STRING(20),
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                }
            },
            tracking_number: {
                type: DataTypes.STRING(50),
                allowNull: true,
                unique: true
            },
            carrier: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            shipping_method: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            shipping_cost: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            estimated_delivery: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Pending', 'In Transit', 'Delivered', 'Failed'),
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
        await queryInterface.bulkInsert('shipping', [
            {
                order_id: 'ORD-2024-001',
                tracking_number: 'TRK123456789',
                carrier: 'FedEx',
                shipping_method: 'Ground',
                shipping_cost: 12.99,
                estimated_delivery: '2024-03-20',
                status: 'In Transit',
                created_at: '2024-03-15',
                updated_at: '2024-03-15'
            },
            {
                order_id: 'ORD-2024-002',
                tracking_number: 'TRK987654321',
                carrier: 'UPS',
                shipping_method: 'Express',
                shipping_cost: 24.99,
                estimated_delivery: '2024-03-18',
                status: 'Pending',
                created_at: '2024-03-15',
                updated_at: '2024-03-15'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('shipping');
    }
}; 