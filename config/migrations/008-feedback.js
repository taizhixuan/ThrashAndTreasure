const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('feedback', {
            Feedback_ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Product_Name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            Category: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            Rating: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            Review: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            Review_Date: {
                type: DataTypes.DATE,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('feedback', [
            {
                Product_Name: 'Vintage Radio',
                Category: 'Classic Electronics',
                Rating: 5,
                Review: 'Excellent vintage piece! Works perfectly and adds a great retro touch to my room.',
                Review_Date: '2024-03-12'
            },
            {
                Product_Name: 'Antique Clock',
                Category: 'Home Decor',
                Rating: 4,
                Review: 'Beautiful craftsmanship! The clock keeps perfect time and looks stunning.',
                Review_Date: '2024-03-08'
            },
            {
                Product_Name: 'Vintage Typewriter',
                Category: 'Office Equipment',
                Rating: 4,
                Review: 'Great condition for its age. Keys are smooth and the ribbon still works well.',
                Review_Date: '2024-03-01'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('feedback');
    }
}; 