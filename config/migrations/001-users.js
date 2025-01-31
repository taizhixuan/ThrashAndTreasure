const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM('admin', 'buyer', 'seller', 'user', 'logistics_manager'),
                allowNull: false
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            verificationToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });

        // Only add the most important index
        await queryInterface.addIndex('users', ['email'], {
            unique: true,
            name: 'users_email_unique'
        });

        // Insert initial admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await queryInterface.bulkInsert('users', [{
            fullName: 'System Administrator',
            email: 'admin@thrashandtreasure.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            verificationToken: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
}; 