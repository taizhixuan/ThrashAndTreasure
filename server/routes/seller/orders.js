const express = require('express');
const router = express.Router();
const db = require('../../config/database');

// Debug middleware
router.use((req, res, next) => {
    console.log('\n=== Orders Route ===');
    console.log('Path:', req.path);
    console.log('Method:', req.method);
    next();
});

// Test route should be BEFORE any parameterized routes
router.get('/test', (req, res) => {
    res.json({ message: 'Orders route is working' });
});

// Add this at the top of your orders.js file
const handleDatabaseError = (error, res) => {
    console.error('Database Error:', error);
    if (error.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({
            message: 'Database table not found',
            error: error.message,
            code: error.code
        });
    }
    res.status(500).json({
        message: 'Database error occurred',
        error: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};

// Get all orders - Temporarily disabled
/*
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all orders...');
        
        // First, check if the table exists
        const [tables] = await db.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_NAME = 'Orders'
        `);

        if (tables.length === 0) {
            return res.status(500).json({
                message: 'Orders table does not exist',
                error: 'Database schema error'
            });
        }
        
        const [orders] = await db.execute(`
            SELECT 
                o.order_id,
                o.order_date,
                o.customer_name,
                o.customer_email,
                o.total_amount,
                o.status,
                o.tracking_number,
                GROUP_CONCAT(DISTINCT oi.product_name) as products,
                GROUP_CONCAT(DISTINCT oi.quantity) as quantities,
                GROUP_CONCAT(DISTINCT oi.unit_price) as prices
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
            GROUP BY 
                o.order_id,
                o.order_date,
                o.customer_name,
                o.customer_email,
                o.total_amount,
                o.status,
                o.tracking_number
            ORDER BY o.order_date DESC
        `);
        
        console.log(`Found ${orders.length} orders`);
        
        if (orders.length === 0) {
            return res.json([]);
        }
        
        res.json(orders);
    } catch (error) {
        console.error('Database error:', error);
        handleDatabaseError(error, res);
    }
});
*/

// Get single order
router.get('/:id', async (req, res) => {  // Changed from '/orders/:id' to '/:id'
    try {
        const [order] = await db.execute('SELECT * FROM Orders WHERE order_id = ?', [req.params.id]);
        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {  // Changed from '/orders/:id/status' to '/:id/status'
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        await db.execute(
            'UPDATE Orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

module.exports = router; 