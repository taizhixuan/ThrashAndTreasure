const sequelize = require('./database');
const User = require('../models/User');

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful');

        await sequelize.sync({ 
            force: false, 
            alter: false 
        });
        console.log('Database synchronized');

        const adminExists = await User.findOne({
            where: { email: 'admin@thrashandtreasure.com' }
        });

        if (!adminExists) {
            await User.create({
                fullName: 'System Administrator',
                email: 'admin@thrashandtreasure.com',
                password: 'Admin@123',
                role: 'admin', 
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
