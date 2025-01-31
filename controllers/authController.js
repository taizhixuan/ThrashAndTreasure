const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        console.log('\n=== Processing Registration ===');
        console.log('Email:', email);
        console.log('Role:', role);

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create verification token
        const verificationToken = uuidv4();
        console.log('Generated verification token:', verificationToken);

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            role,
            verificationToken,
            isVerified: false
        });
        console.log('User created successfully:', user.id);

        try {
            console.log('=== Sending Verification Email ===');
            console.log('To:', email);
            console.log('Token:', verificationToken);
            
            const emailResult = await sendVerificationEmail(email, verificationToken);
            console.log('Verification email sent successfully:', emailResult);
            
            res.status(201).json({
                message: 'Registration successful! Please check your email to verify your account.',
                redirectUrl: '/pages/common/login.html'
            });
        } catch (emailError) {
            console.error('=== Email Sending Failed ===');
            console.error('Error Type:', emailError.name);
            console.error('Error Message:', emailError.message);
            console.error('Stack:', emailError.stack);
            
            res.status(201).json({
                message: 'Registration successful, but verification email could not be sent. Please contact support.',
                redirectUrl: '/pages/common/login.html',
                error: emailError.message
            });
        }
    } catch (error) {
        console.error('=== Registration Failed ===');
        console.error('Error:', error);
        res.status(500).json({ 
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Debug user role
        console.log('Original user role:', user.role);
        console.log('Uppercase role:', user.role.toUpperCase());

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role.toUpperCase() }, // Ensure role is uppercase in token
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update redirect URLs with absolute paths
        let redirectUrl;
        const userRole = user.role.toUpperCase();
        console.log('Role for switch statement:', userRole);

        switch(userRole) {
            case 'BUYER':
                redirectUrl = '/pages/buyer/buyer-dashboard.html';
                break;
            case 'SELLER':
                redirectUrl = '/pages/seller/seller-dashboard.html';
                break;
            case 'ADMIN':
                redirectUrl = '/pages/admin/admin-dashboard.html';
                break;
            case 'LOGISTICS_MANAGER':
                redirectUrl = '/pages/logistics/logistics-dashboard.html';
                break;
            default:
                console.log('Unknown role:', userRole);
                redirectUrl = '/pages/common/login.html';
        }

        // Log the final redirect URL
        console.log('Final redirect URL:', redirectUrl);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: userRole // Send uppercase role to client
            },
            redirectUrl
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ where: { verificationToken: token } });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        await user.update({
            isVerified: true,
            verificationToken: null
        });

        // Send HTML response instead of JSON
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verified</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { height: 100vh; display: flex; align-items: center; justify-content: center; }
                    .card { max-width: 400px; text-align: center; padding: 2rem; }
                </style>
            </head>
            <body>
                <div class="card shadow">
                    <h2 class="text-success mb-4">Email Verified Successfully!</h2>
                    <p class="mb-4">Your email has been verified. You can now log in to your account.</p>
                    <a href="/pages/common/login.html" class="btn btn-primary">Go to Login</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Verification failed. Please try again.' });
    }
}; 