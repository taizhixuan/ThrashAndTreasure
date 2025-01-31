const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_details', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            condition: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            features: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            image_main: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            image_1: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            image_2: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            image_3: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            image_4: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            seller_name: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            seller_rating: {
                type: DataTypes.DECIMAL(3, 2),
                allowNull: true
            },
            seller_reviews: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('product_details', [
            {
                name: 'Vintage Camera',
                description: 'Rare Leica M3 camera in excellent condition. Double-stroke film advance, original leather case included. Serial number confirms 1954 production date. All mechanical functions working perfectly.',
                price: 90.00,
                condition: 'Excellent',
                features: 'Original leather case, 50mm f/2 Summicron lens, Recently serviced, Light meter included',
                image_main: '../../../assets/images/products/vintage-camera-main.jpg',
                image_1: '../../../assets/images/products/vintage-camera-1.jpg',
                image_2: '../../../assets/images/products/vintage-camera-2.jpg',
                image_3: '../../../assets/images/products/vintage-camera-3.jpg',
                image_4: '../../../assets/images/products/vintage-camera-4.jpg',
                seller_name: 'Vintage Camera Shop',
                seller_rating: 4.90,
                seller_reviews: 142
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('product_details');
    }
};
