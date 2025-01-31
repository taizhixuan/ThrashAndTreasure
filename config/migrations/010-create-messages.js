const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('messages', {
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
        await queryInterface.bulkInsert('messages', [
            {
                sender: 'John Doe',
                message: 'Hi, I have a question about my order',
                timestamp: '2025-01-30 04:34:49',
                status: 'received'
            },
            {
                sender: 'Support',
                message: 'Hello! How can I assist you today?',
                timestamp: '2025-01-30 04:34:49',
                status: 'sent'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('messages');
    }
}; 