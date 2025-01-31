const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};

// Apply auth middleware and admin check to all routes
router.use(authMiddleware, isAdmin);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/stats', adminController.getUserStats);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);
router.post('/users/bulk-action', adminController.bulkAction);
router.get('/users/:userId', adminController.getUserProfile);
router.put('/users/:userId', adminController.updateUserProfile);

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/profile', adminController.getAdminProfile);
router.get('/notifications', adminController.getNotifications);
router.patch('/notifications/:notificationId', adminController.updateNotification);

// Add this route
router.get('/search', adminController.search);

module.exports = router; 