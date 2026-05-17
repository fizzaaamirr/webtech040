const express = require('express');
const router = express.Router();

// Import API routes
const authRoutes = require('./auth');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');
const userRoutes = require('./user');

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/user', userRoutes);

// API Root endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Cinnabon API v1',
        endpoints: {
            auth: {
                login: 'POST /api/v1/auth/login'
            },
            products: {
                getAll: 'GET /api/v1/products',
                getOne: 'GET /api/v1/products/:id'
            },
            orders: {
                create: 'POST /api/v1/orders (requires token)'
            },
            user: {
                profile: 'GET /api/v1/user/profile (requires token)'
            }
        }
    });
});

module.exports = router;