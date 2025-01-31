const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');

// Make sure these middleware are present
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware should be here
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Admin routes
app.use('/api/admin', adminRoutes); 