const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('previous_reports', {
            Report_ID: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            Order_ID: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            Product_Name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            Issue_Type: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            Status: {
                type: DataTypes.ENUM('IN PROGRESS', 'RESOLVED'),
                allowNull: true
            },
            Report_Date: {
                type: DataTypes.DATE,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('previous_reports', [
            {
                Report_ID: '#REP-2024-001',
                Order_ID: '#TT-2024-0122',
                Product_Name: 'Vintage Camera',
                Issue_Type: 'Product Damaged',
                Status: 'IN PROGRESS',
                Report_Date: '2024-03-08'
            },
            {
                Report_ID: '#REP-2024-002',
                Order_ID: '#TT-2024-0123',
                Product_Name: 'Antique Clock',
                Issue_Type: 'Wrong Item Received',
                Status: 'RESOLVED',
                Report_Date: '2024-03-05'
            },
            {
                Report_ID: '#REP-2024-003',
                Order_ID: '#TT-2024-0124',
                Product_Name: 'Vintage Typewriter',
                Issue_Type: 'Quality Issues',
                Status: 'IN PROGRESS',
                Report_Date: '2024-03-01'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('previous_reports');
    }
};
