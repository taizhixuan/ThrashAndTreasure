const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

// Remove all authentication middleware
// const { authenticateAdmin } = require('../middleware/auth');
// router.use(authenticateAdmin);

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await sequelize.query(`
            SELECT 
                id, 
                fullName, 
                email, 
                role, 
                isVerified, 
                DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt,
                DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') as updatedAt
            FROM users 
            ORDER BY createdAt DESC
        `);
        
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch users', 
            details: error.message 
        });
    }
});

// Get single user
router.get('/users/:id', async (req, res) => {
    try {
        const [user] = await sequelize.query(
            'SELECT id, fullName, email, role, isVerified FROM users WHERE id = ?',
            {
                replacements: [req.params.id],
                type: sequelize.QueryTypes.SELECT
            }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Add new user
router.post('/users', async (req, res) => {
    try {
        console.log('Received user data:', req.body);
        
        const { fullName, email, password, role } = req.body;
        
        // Validate input
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Ensure role is lowercase and valid
        const validRoles = ['admin', 'buyer', 'seller', 'user', 'logistics_manager'];
        const formattedRole = role.toLowerCase();
        
        if (!validRoles.includes(formattedRole)) {
            return res.status(400).json({ 
                message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await sequelize.query(`
            INSERT INTO users (fullName, email, password, role, isVerified, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, false, NOW(), NOW())
        `, {
            replacements: [fullName, email, hashedPassword, formattedRole]
        });

        console.log('User created:', result);

        res.status(201).json({ 
            message: 'User created successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Error creating user:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        if (error.sqlMessage && error.sqlMessage.includes('Data truncated for column \'role\'')) {
            return res.status(400).json({ 
                message: 'Invalid role. Please select a valid role from the dropdown.' 
            });
        }
        
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const { fullName, email, role, isVerified } = req.body;
        
        // Validate role
        const validRoles = ['admin', 'buyer', 'seller', 'user', 'logistics_manager'];
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).json({ 
                message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` 
            });
        }

        await sequelize.query(
            'UPDATE users SET fullName = ?, email = ?, role = ?, isVerified = ? WHERE id = ?',
            {
                replacements: [fullName, email, role.toLowerCase(), isVerified, req.params.id],
                type: sequelize.QueryTypes.UPDATE
            }
        );
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error updating user' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        // Use proper parameter binding with replacements option
        await sequelize.query('DELETE FROM users WHERE id = ?', {
            replacements: [userId]
        });
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            message: 'Error deleting user',
            details: error.message 
        });
    }
});

// Bulk actions
router.post('/users/bulk', async (req, res) => {
    try {
        const { action, userIds } = req.body;
        
        switch (action) {
            case 'activate':
                await sequelize.query('UPDATE users SET isVerified = 1 WHERE id IN (?)', [userIds]);
                break;
            case 'deactivate':
                await sequelize.query('UPDATE users SET isVerified = 0 WHERE id IN (?)', [userIds]);
                break;
            case 'delete':
                await sequelize.query('DELETE FROM users WHERE id IN (?)', [userIds]);
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }
        
        res.json({ message: 'Bulk action completed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error performing bulk action' });
    }
});

module.exports = router; 