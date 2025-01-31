const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('active_disputes', {
            Dispute_ID: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                allowNull: false
            },
            Order_ID: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            Buyer_Name: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            Seller_Name: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            Dispute_Reason: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            Status: {
                type: DataTypes.ENUM('In Progress', 'Pending', 'Resolved'),
                allowNull: true
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('active_disputes', [
            {
                Dispute_ID: '#D12345',
                Order_ID: '#O98765',
                Buyer_Name: 'John Doe',
                Seller_Name: 'Jane Smith',
                Dispute_Reason: 'Item not as described',
                Status: 'In Progress'
            },
            // Add other disputes...
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('active_disputes');
    }
}; 