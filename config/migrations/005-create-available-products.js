const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('available_products', {
            Product_ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Product_Name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            Category: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            Original_Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            Discounted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            Rating: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: true
            },
            Reviews: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('available_products', [
            {
                Product_Name: 'Vintage Camera',
                Category: '1960s Film Camera',
                Price: 90.00,
                Original_Price: null,
                Discounted: false,
                Rating: 4.8,
                Reviews: 28
            },
            {
                Product_Name: 'Vintage Typewriter',
                Category: 'Classic Remington Model',
                Price: 50.00,
                Original_Price: null,
                Discounted: false,
                Rating: 4.5,
                Reviews: 18
            }
            // Add other products...
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('available_products');
    }
}; 