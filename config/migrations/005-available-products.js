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
            },
            {
                Product_Name: 'Vinyl Record Player',
                Category: 'Restored Turntable',
                Price: 30.00,
                Original_Price: 100.00,
                Discounted: true,
                Rating: 4.9,
                Reviews: 32
            },
            {
                Product_Name: 'Antique Wall Clock',
                Category: 'Victorian Era Timepiece',
                Price: 88.00,
                Original_Price: null,
                Discounted: false,
                Rating: 4.7,
                Reviews: 21
            },
            {
                Product_Name: 'Vintage Radio',
                Category: '1960s Transistor Radio',
                Price: 20.00,
                Original_Price: null,
                Discounted: false,
                Rating: 4.6,
                Reviews: 24
            },
            {
                Product_Name: 'Art Deco Lamp',
                Category: '1930s Table Lamp',
                Price: 55.00,
                Original_Price: 90.00,
                Discounted: true,
                Rating: 4.4,
                Reviews: 16
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('available_products');
    }
}; 