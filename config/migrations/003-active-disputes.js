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
            {
                Dispute_ID: '#D12346',
                Order_ID: '#O98766',
                Buyer_Name: 'Alice Johnson',
                Seller_Name: 'Bob Brown',
                Dispute_Reason: 'Wrong item received',
                Status: 'Pending'
            },
            {
                Dispute_ID: '#D12347',
                Order_ID: '#O98767',
                Buyer_Name: 'Charlie Davis',
                Seller_Name: 'David Wilson',
                Dispute_Reason: 'Item arrived damaged',
                Status: 'In Progress'
            },
            {
                Dispute_ID: '#D12348',
                Order_ID: '#O98768',
                Buyer_Name: 'Emily Clark',
                Seller_Name: 'Frank Harris',
                Dispute_Reason: 'Late delivery',
                Status: 'Resolved'
            },
            {
                Dispute_ID: '#D12349',
                Order_ID: '#O98769',
                Buyer_Name: 'George Martin',
                Seller_Name: 'Helen White',
                Dispute_Reason: 'Request for refund',
                Status: 'Pending'
            },
            {
                Dispute_ID: '#D12350',
                Order_ID: '#O98770',
                Buyer_Name: 'Irene Black',
                Seller_Name: 'Jack Green',
                Dispute_Reason: 'Product not delivered',
                Status: 'In Progress'
            },
            {
                Dispute_ID: '#D12351',
                Order_ID: '#O98771',
                Buyer_Name: 'Kevin Brown',
                Seller_Name: 'Laura Blue',
                Dispute_Reason: 'Refund processed',
                Status: 'Resolved'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('active_disputes');
    }
}; 