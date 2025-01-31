const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('active_deliveries', {
            Delivery_ID: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            Courier_Name: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            Courier_ID: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            Status: {
                type: DataTypes.ENUM('On the Way', 'Delayed'),
                allowNull: true
            },
            ETA: {
                type: DataTypes.TIME,
                allowNull: true
            },
            ETA_Status: {
                type: DataTypes.STRING(50),
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('active_deliveries', [
            {
                Delivery_ID: '#DEL-2024-001',
                Courier_Name: 'John Smith',
                Courier_ID: '#C001',
                Status: 'On the Way',
                ETA: '15:30:00',
                ETA_Status: 'On Schedule'
            },
            {
                Delivery_ID: '#DEL-2024-002',
                Courier_Name: 'Sarah Johnson',
                Courier_ID: '#C002',
                Status: 'Delayed',
                ETA: '16:45:00',
                ETA_Status: 'Delayed by 15min'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('active_deliveries');
    }
}; 