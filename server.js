const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./server/routes/auth');
const adminRoutes = require('./server/routes/admin');
const adminUsersRoutes = require('./server/routes/admin/users');
const deliveryZonesRoutes = require('./server/routes/admin/delivery-zones');
const productRoutes = require('./server/routes/seller/products');

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Debug middleware
app.use((req, res, next) => {
    console.log('\n=== Incoming Request ===');
    console.log('Time:', new Date().toISOString());
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    next();
});

// Mount API routes first
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminUsersRoutes);
app.use('/api/admin', deliveryZonesRoutes);
app.use('/api/seller', productRoutes);

// Test email route
app.post('/api/test-email', async (req, res) => {
    const testEmail = req.body.email;
    console.log('\nReceived test email request for:', testEmail);
    
    if (!testEmail) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email address is required' 
        });
    }

    try {
        const info = await sendEmail({
            to: testEmail,
            subject: 'Test Email from Thrash and Treasure',
            html: `
                <h1>Test Email</h1>
                <p>This is a test email sent at ${new Date().toISOString()}</p>
                <p>If you received this, the email service is working correctly!</p>
            `
        });
        
        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: info.messageId,
            response: info.response
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message,
            details: {
                code: error.code,
                command: error.command,
                response: error.response
            }
        });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/common/login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/common/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/common/register.html'));
});

// API 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `API route ${req.method} ${req.url} not found`
    });
});

// General 404 handler for all other routes
app.use((req, res) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({
            error: 'Not Found',
            message: `API route ${req.method} ${req.url} not found`
        });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'pages/common/404.html'));
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    if (req.url.startsWith('/api/')) {
        res.status(500).json({
            error: 'Server Error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } else {
        res.status(500).sendFile(path.join(__dirname, 'pages/common/500.html'));
    }
});

// Move this near other route definitions (before error handlers)
const { sendEmail } = require('./utils/emailService');

// Add near the top of the file, after require statements
const { initializeEmailService } = require('./utils/emailService');

// Modify the server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`\nServer running at http://localhost:${PORT}`);
    
    // Initialize services
    try {
        // Initialize email service
        const emailServiceStatus = await initializeEmailService();
        if (!emailServiceStatus) {
            console.error('Warning: Email service failed to initialize properly');
        }
    } catch (error) {
        console.error('Service initialization error:', error);
    }
}); 