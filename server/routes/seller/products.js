const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const multer = require('multer');
const path = require('path');

// Get all products
router.get('/products', async (req, res) => {
    try {
        console.log('Fetching products...');
        
        const [products] = await db.execute(`
            SELECT 
                product_id, 
                sku, 
                name, 
                category, 
                price, 
                stock_quantity, 
                status, 
                image_url, 
                description,
                created_at,
                updated_at
            FROM Product 
            ORDER BY created_at DESC
        `);
        
        // Log the results
        console.log('Products fetched:', products);
        
        res.json(products);
    } catch (error) {
        console.error('Detailed error fetching products:', error);
        res.status(500).json({ 
            message: 'Error fetching products',
            error: error.message,
            sqlState: error.sqlState
        });
    }
});

// Add new product
router.post('/products', async (req, res) => {
    try {
        const { sku, name, category, price, stock_quantity, status, description, image_url } = req.body;
        
        // Validate input
        if (!sku || !name || !category || !price || stock_quantity === undefined || !status) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Check if SKU already exists
        const [existingProducts] = await db.execute('SELECT sku FROM Product WHERE sku = ?', [sku]);
        if (existingProducts.length > 0) {
            return res.status(400).json({ message: 'SKU already exists' });
        }

        // Insert new product
        await db.execute(
            'INSERT INTO Product (sku, name, category, price, stock_quantity, status, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [sku, name, category, price, stock_quantity, status, description, image_url]
        );

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// Update product
router.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, category, price, stock_quantity, status, description, image_url } = req.body;
        
        // Validate input
        if (!name || !category || !price || stock_quantity === undefined || !status) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Update product
        await db.execute(`
            UPDATE Product 
            SET name = ?, 
                category = ?, 
                price = ?, 
                stock_quantity = ?, 
                status = ?, 
                description = ?, 
                image_url = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = ?
        `, [name, category, price, stock_quantity, status, description, image_url, productId]);

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await db.execute('DELETE FROM Product WHERE product_id = ?', [productId]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/images/products/');
    },
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

// Add image upload route
router.post('/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No image file uploaded');
        }
        res.json({ 
            imageUrl: `assets/images/products/${req.file.filename}`
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(400).json({ message: error.message });
    }
});

// Add this new route to get a single product
router.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const [products] = await db.execute(
            'SELECT * FROM Product WHERE product_id = ?',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

module.exports = router; 