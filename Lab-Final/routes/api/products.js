const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// GET /api/v1/products - Get all products with pagination/filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';
        const category = req.query.category || '';
        const minPrice = req.query.minPrice || 0;
        const maxPrice = req.query.maxPrice || 1000;

        // Build query
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        query.price = {
            $gte: parseFloat(minPrice),
            $lte: parseFloat(maxPrice)
        };

        // Get total count
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Get products
        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            total: totalProducts,
            pages: totalPages,
            currentPage: page,
            data: products
        });

    } catch (error) {
        console.error('API Get products error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// GET /api/v1/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('API Get product error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;