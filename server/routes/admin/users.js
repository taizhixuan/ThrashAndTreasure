const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const bcrypt = require('bcrypt');

// Debug middleware
router.use((req, res, next) => {
    console.log('\n=== Users Route ===');
    console.log('Path:', req.path);
    console.log('Method:', req.method);
    console.log('=================\n');
    next();
});

// Get all users - Keep the route path as /users
router.get('/users', async (req, res) => {
    try {
        console.log('Fetching users from database...'); // Debug log
        
        const [users] = await db.execute(`
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
        
        console.log('Users fetched:', users.length, 'users'); // Debug log
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch users', 
            details: error.message 
        });
    }
});

// Add new user
router.post('/users', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute(
            'INSERT INTO users (fullName, email, password, role, isVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, NOW(), NOW())',
            [fullName, email, hashedPassword, role]
        );
        
        res.json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Add test endpoint
router.get('/test-db', async (req, res) => {
    try {
        const [result] = await db.execute('SELECT 1 as test');
        res.json({
            message: 'Database connection successful',
            result: result[0]
        });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({
            error: 'Database connection failed',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullName, email, role, isVerified } = req.body;
        
        // Validate input
        if (!fullName || !email || !role) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Check if email exists for other users
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Update user with exact column names from database schema
        await db.execute(`
            UPDATE users 
            SET fullName = ?, 
                email = ?, 
                role = ?, 
                isVerified = ?,
                updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [fullName, email, role.toUpperCase(), isVerified ? 1 : 0, userId]);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ 
            message: 'Error updating user',
            details: error.message 
        });
    }
});

// Get single user
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const [users] = await db.execute(
            'SELECT id, fullName, email, role, isVerified FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

module.exports = router; 