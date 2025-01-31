const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orderitems', {
            order_item_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            order_id: {
                type: DataTypes.STRING(15),
                allowNull: true
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            product_name: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            unit_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('orderitems', [
            {
                order_id: 'ORD-2024-001',
                product_id: 1,
                product_name: 'Vintage Camera',
                quantity: 1,
                unit_price: 299.99,
                subtotal: 299.99
            },
            {
                order_id: 'ORD-2024-002',
                product_id: 2,
                product_name: 'Antique Wooden Chair',
                quantity: 2,
                unit_price: 199.99,
                subtotal: 399.98
            },
            {
                order_id: 'ORD-2024-003',
                product_id: 3,
                product_name: 'Vintage Vinyl Records Collection',
                quantity: 3,
                unit_price: 149.99,
                subtotal: 449.97
            },
            {
                order_id: 'ORD-2024-004',
                product_id: 4,
                product_name: 'Retro Radio Set',
                quantity: 1,
                unit_price: 89.99,
                subtotal: 89.99
            },
            {
                order_id: 'ORD-2024-005',
                product_id: 5,
                product_name: 'Vintage Pocket Watch',
                quantity: 1,
                unit_price: 249.99,
                subtotal: 249.99
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('orderitems');
    }
};
