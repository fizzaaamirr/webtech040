const express = require('express');
const router  = express.Router();
const Order   = require('../../models/Order');
const Product = require('../../models/Product');
const verifyToken = require('../../middleware/verifyToken');

// POST /api/v1/orders — Create new order (JWT protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // ── Validation ──
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

        // ── Build order items & calculate total ──
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            // item should have: productId (optional), name, price, quantity
            const qty   = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price)  || 0;

            orderItems.push({
                productId: item.productId || null,
                name:      item.name,
                price:     price,
                quantity:  qty
            });

            totalAmount += price * qty;
        }

        // ── Save to DB ──
        const newOrder = await Order.create({
            userId:          req.user.id,
            items:           orderItems,
            totalAmount:     totalAmount,
            shippingAddress: shippingAddress,
            paymentMethod:   paymentMethod || 'cash',
            status:          'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order:   newOrder
        });

    } catch (error) {
        console.error('API Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/v1/orders — List orders for logged-in user (JWT protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('API Get orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;