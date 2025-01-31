const sequelize = require('./database');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                fullName: 'System Administrator',
                email: 'admin@thrashandtreasure.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('Default admin user created');
        }

    } catch (error) {
        console.error('Database initialization error:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1); // Exit with error code
    }
}

module.exports = initializeDatabase; 
