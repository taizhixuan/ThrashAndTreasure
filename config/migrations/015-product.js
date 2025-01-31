const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product', {
            product_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sku: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            stock_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            status: {
                type: DataTypes.ENUM('Active', 'Low Stock', 'Out of Stock'),
                allowNull: false
            },
            image_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
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

        // Add the unique constraint with a different name
        await queryInterface.addIndex('product', ['sku'], {
            unique: true,
            name: 'product_sku_unique'
        });

        // Insert initial data
        await queryInterface.bulkInsert('product', [
            {
                sku: 'FUR002',
                name: 'Antique Wooden Chair',
                category: 'Furniture',
                price: 199.99,
                stock_quantity: 3,
                status: 'Low Stock',
                image_url: '//assets/images/products/vintage.jpeg',
                description: '-',
                created_at: '2025-01-30 00:27:42',
                updated_at: '2025-01-31 01:54:48'
            },
            {
                sku: 'MUS003',
                name: 'Vintage Vinyl Records Collection',
                category: 'Music',
                price: 149.99,
                stock_quantity: 8,
                status: 'Active',
                image_url: '../assets/images/products/vinyl-records.jpg',
                description: null,
                created_at: '2025-01-30 00:27:42',
                updated_at: '2025-01-30 00:27:42'
            },
            {
                sku: 'ELE004',
                name: 'Retro Radio Set',
                category: 'Electronics',
                price: 89.99,
                stock_quantity: 0,
                status: 'Out of Stock',
                image_url: '../assets/images/products/retro-radio.jpg',
                description: null,
                created_at: '2025-01-30 00:27:42',
                updated_at: '2025-01-30 00:27:42'
            },
            {
                sku: 'ACC005',
                name: 'Vintage Pocket Watch',
                category: 'Accessories',
                price: 249.99,
                stock_quantity: 5,
                status: 'Active',
                image_url: '../assets/images/products/vintage-watch.jpg',
                description: null,
                created_at: '2025-01-30 00:27:42',
                updated_at: '2025-01-30 00:27:42'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('product');
    }
};
