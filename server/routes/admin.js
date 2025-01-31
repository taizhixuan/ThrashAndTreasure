const express = require('express');
const router = express.Router();
const db = require('../config/database');  // Use the pool instead of mysql2 directly

// Debug middleware for admin routes
router.use((req, res, next) => {
    console.log('\n=== Admin Route ===');
    console.log('Path:', req.path);
    console.log('Method:', req.method);
    console.log('=================\n');
    next();
});

// Get all pending listings
router.get('/pending-listings', async (req, res) => {
    try {
        console.log('Fetching pending listings...');
        
        const [rows] = await db.execute(
            'SELECT * FROM Product_Submissions WHERE status = "Pending" ORDER BY submission_date DESC'
        );
        
        console.log(`Found ${rows.length} pending listings`);
        res.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            message: error.message 
        });
    }
});

// Approve listing
router.put('/approve-listing/:id', async (req, res) => {
    try {
        console.log('Approving listing:', req.params.id);
        
        const [result] = await db.execute(
            'UPDATE Product_Submissions SET status = "Approved" WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Listing not found',
                message: `No listing found with ID ${req.params.id}`
            });
        }
        
        console.log('Listing approved successfully');
        res.json({ message: 'Listing approved successfully' });
    } catch (error) {
        console.error('Error approving listing:', error);
        res.status(500).json({ 
            error: 'Failed to approve listing', 
            message: error.message 
        });
    }
});

// Reject listing
router.put('/reject-listing/:id', async (req, res) => {
    try {
        console.log('Rejecting listing:', req.params.id);
        
        const [result] = await db.execute(
            'UPDATE Product_Submissions SET status = "Rejected" WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Listing not found',
                message: `No listing found with ID ${req.params.id}`
            });
        }
        
        console.log('Listing rejected successfully');
        res.json({ message: 'Listing rejected successfully' });
    } catch (error) {
        console.error('Error rejecting listing:', error);
        res.status(500).json({ 
            error: 'Failed to reject listing', 
            message: error.message 
        });
    }
});

// Test database connection
router.get('/test-db', async (req, res) => {
    try {
        const [result] = await db.execute('SELECT 1 as test');
        console.log('Test query result:', result);
        
        res.json({
            message: 'Database connection successful',
            result: result[0]
        });
    } catch (error) {
        console.error('Database connection test failed:', error);
        res.status(500).json({
            error: 'Database connection failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 