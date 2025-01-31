const sequelize = require('./database');
const User = require('../models/User');

async function initializeDatabase() {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection successful');

        // Sync with more careful options
        await sequelize.sync({ 
            force: false, 
            alter: false // Changed to false to prevent automatic alterations
        });
        console.log('Database synchronized');

        // Create default admin user if it doesn't exist
        const adminExists = await User.findOne({
            where: { email: 'admin@thrashandtreasure.com' }
        });

        if (!adminExists) {
            await User.create({
                fullName: 'System Administrator',
                email: 'admin@thrashandtreasure.com',
                password: 'Admin@123',
                role: 'admin', // Changed to lowercase
                isVerified: true
            });
            console.log('Default admin user created');
        }

    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

module.exports = initializeDatabase; 