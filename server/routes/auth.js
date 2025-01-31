const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role = 'user' } = req.body;
        
        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.execute(
            'INSERT INTO users (fullName, email, password, role, isVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, false, NOW(), NOW())',
            [fullName, email, hashedPassword, role]
        );

        res.status(201).json({
            message: 'Registration successful',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Get user from database
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Determine redirect URL based on role
        let redirectUrl;
        const userRole = user.role.toLowerCase();
        
        switch(userRole) {
            case 'admin':
                redirectUrl = '/pages/admin/admin-dashboard.html';
                break;
            case 'seller':
                redirectUrl = '/pages/seller/seller-dashboard.html';
                break;
            case 'buyer':
                redirectUrl = '/pages/buyer/buyer-dashboard.html';
                break;
            case 'logistics_manager':
                redirectUrl = '/pages/logistics/logistics-dashboard.html';
                break;
            default:
                redirectUrl = '/pages/common/login.html';
        }

        // Set user session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: userRole,
            fullName: user.fullName
        };

        // Send response with user info and redirect URL
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: userRole,
                fullName: user.fullName
            },
            redirectUrl
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.json({ message: 'Logout successful' });
    });
});

module.exports = router; 