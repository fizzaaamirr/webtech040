const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');

// POST /api/v1/orders - Create new order (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Order items are required' 
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({ 
                success: false, 
                message: 'Shipping address is required' 
            });
        }

        // For now, just return success (you can create Order model later)
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: {
                userId: req.user.id,
                items,
                shippingAddress,
                paymentMethod: paymentMethod || 'cash',
                status: 'pending',
                createdAt: new Date()
            }
        });

    } catch (error) {
        console.error('API Create order error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;