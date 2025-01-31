const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sellermessages', {
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            status: {
                type: DataTypes.ENUM('sent', 'received'),
                allowNull: false
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('sellermessages', [
            {
                sender: 'John Smith',
                message: 'Hi, I\'m interested in the vintage camera you have listed. Is it still available?',
                timestamp: '2025-01-30 04:34:49',
                status: 'received'
            },
            {
                sender: 'Seller',
                message: 'Yes, it\'s still available! It\'s in excellent condition.',
                timestamp: '2025-01-30 04:34:49',
                status: 'sent'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sellermessages');
    }
};
