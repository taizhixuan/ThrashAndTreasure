const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('logisticsmessages', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sender: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            status: {
                type: DataTypes.ENUM('sent', 'received'),
                allowNull: false
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('logisticsmessages', [
            {
                sender: 'Courier',
                message: 'Hello, I have a question about my delivery',
                timestamp: '2025-01-30 04:35:01',
                status: 'received'
            },
            {
                sender: 'Logistics',
                message: 'Of course! How can I help you?',
                timestamp: '2025-01-30 04:35:01',
                status: 'sent'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('logisticsmessages');
    }
}; 