const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import routes (remove auth routes)
const adminRoutes = require('./routes/admin');
const sellerOrdersRoutes = require('./routes/seller/orders');
const sellerProductsRoutes = require('./routes/seller/products');
const buyerOrdersRoutes = require('./routes/buyer/orders');
const logisticsDeliveriesRoutes = require('./routes/logistics/deliveries');

// Basic middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
    console.log('\n=== Incoming Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Path:', req.path);
    console.log('======================\n');
    next();
});

// Mount API routes
app.use('/api/seller/orders', sellerOrdersRoutes);
app.use('/api/seller/products', sellerProductsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buyer/orders', buyerOrdersRoutes);
app.use('/api/logistics/deliveries', logisticsDeliveriesRoutes);

// Static files (must come after API routes)
app.use(express.static(path.join(__dirname, '../')));
app.use('/pages', express.static(path.join(__dirname, '../pages')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    console.log('API 404:', req.originalUrl);
    res.status(404).json({
        error: 'Not Found',
        message: `API route ${req.method} ${req.originalUrl} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        error: err.name || 'Server Error',
        message: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${PORT}`);
}); 