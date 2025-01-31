const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('pending_tasks', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            order_id: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            product_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            product_image: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            delivery_address: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            priority: {
                type: DataTypes.ENUM('High', 'Medium', 'Low'),
                allowNull: false
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('pending_tasks', [
            {
                order_id: '#ORD-2024-001',
                product_name: 'Vintage Chair',
                product_image: '../../../assets/images/products/vintage.jpeg',
                delivery_address: '123 Main St, City',
                priority: 'High'
            },
            {
                order_id: '#ORD-2024-002',
                product_name: 'Antique Lamp',
                product_image: '../../../assets/images/products/vintage-lamp.jpg',
                delivery_address: '456 Oak Ave, Town',
                priority: 'Medium'
            },
            {
                order_id: '#ORD-2024-003',
                product_name: 'Vintage Radio',
                product_image: '../../../assets/images/products/vintage-radio.jpg',
                delivery_address: '789 Pine Rd, Village',
                priority: 'Low'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('pending_tasks');
    }
};
