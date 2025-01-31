const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('activeorders', {
            order_id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            order_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('In Transit', 'Processing', 'Out for Delivery', 'Order Placed'),
                allowNull: false
            },
            product_name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            seller_name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('activeorders', [
            {
                order_id: 'TT-2024-0123',
                order_date: '2024-03-15',
                status: 'In Transit',
                product_name: 'Vintage Leica M3 Camera (1954)',
                quantity: 1,
                seller_name: 'Vintage Camera Shop',
                total: 3164.37
            },
            {
                order_id: 'TT-2024-0124',
                order_date: '2024-03-16',
                status: 'Processing',
                product_name: '1940s Philco Tube Radio',
                quantity: 1,
                seller_name: 'Retro Electronics',
                total: 299.99
            }
            // Add other orders...
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('activeorders');
    }
}; 