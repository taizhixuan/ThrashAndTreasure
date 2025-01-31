const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            seller_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
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
                allowNull: false
            },
            category: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            condition: {
                type: DataTypes.ENUM('New', 'Like New', 'Good', 'Fair', 'Poor'),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('Available', 'Sold', 'Reserved', 'Unavailable'),
                defaultValue: 'Available'
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
        await queryInterface.bulkInsert('products', [
            {
                seller_id: 3,
                name: 'Vintage Polaroid Camera',
                description: 'Classic Polaroid camera from the 1970s in excellent working condition',
                price: 149.99,
                category: 'Cameras',
                condition: 'Good',
                status: 'Available',
                created_at: '2024-03-15',
                updated_at: '2024-03-15'
            },
            {
                seller_id: 3,
                name: 'Antique Brass Compass',
                description: 'Beautiful brass compass from the early 1900s',
                price: 89.99,
                category: 'Collectibles',
                condition: 'Like New',
                status: 'Available',
                created_at: '2024-03-15',
                updated_at: '2024-03-15'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('products');
    }
}; 