const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('delivery_issues', {
            Issue_ID: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            Order_ID: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            Issue_Type: {
                type: DataTypes.ENUM('Lost Package', 'Damaged Item', 'Wrong Item', 'Delayed Delivery', 'Courier Behavior'),
                allowNull: true
            },
            Status: {
                type: DataTypes.ENUM('In Progress', 'Resolved', 'Open'),
                allowNull: true
            },
            Reported_Date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            Reported_Time: {
                type: DataTypes.TIME,
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('delivery_issues', [
            {
                Issue_ID: '#ISS-2024-001',
                Order_ID: '#ORD-2024-123',
                Issue_Type: 'Lost Package',
                Status: 'In Progress',
                Reported_Date: '2024-01-15',
                Reported_Time: '14:30:00'
            },
            {
                Issue_ID: '#ISS-2024-002',
                Order_ID: '#ORD-2024-145',
                Issue_Type: 'Damaged Item',
                Status: 'Resolved',
                Reported_Date: '2024-01-15',
                Reported_Time: '09:15:00'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('delivery_issues');
    }
}; 