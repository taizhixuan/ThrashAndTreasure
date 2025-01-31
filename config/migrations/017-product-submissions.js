const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_submissions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            product_image: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            product_name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            seller_name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            submission_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            condition: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
                defaultValue: 'Pending'
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('product_submissions', [
            {
                product_image: '../../../assets/images/vintage.jpeg',
                product_name: 'Vintage Chair',
                seller_name: 'John Smith',
                category: 'Furniture',
                submission_date: '2023-10-01',
                price: 199.99,
                condition: 'Good',
                description: 'Vintage wooden chair in excellent condition. Minor wear consistent with age.',
                status: 'Pending'
            },
            {
                product_image: '../../../assets/images/sofa.jpeg',
                product_name: 'Retro Sofa',
                seller_name: 'Michael Brown',
                category: 'Furniture',
                submission_date: '2023-10-03',
                price: 300.00,
                condition: 'Good',
                description: 'Retro Sofa in good condition.',
                status: 'Pending'
            },
            {
                product_image: '../../../assets/images/lamp.jpg',
                product_name: 'Antique Lamp',
                seller_name: 'Jane Doe',
                category: 'Home Decor',
                submission_date: '2023-10-02',
                price: 200.00,
                condition: 'Good',
                description: 'Antique Lamp in good condition.',
                status: 'Pending'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('product_submissions');
    }
};
