const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('reviews', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
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
        await queryInterface.bulkInsert('reviews', [
            {
                product_id: 1,
                user_id: 2,
                rating: 5,
                comment: 'Excellent vintage camera! Works perfectly and arrived well-packaged.',
                created_at: '2024-03-15',
                updated_at: '2024-03-15'
            },
            {
                product_id: 2,
                user_id: 4,
                rating: 4,
                comment: 'Beautiful antique compass. Minor wear but great collectible piece.',
                created_at: '2024-03-15',
                updated_at: '2024-03-15'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('reviews');
    }
}; 