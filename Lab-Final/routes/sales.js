const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { isAdmin } = require('../middleware/auth');

// ─── Helper: calculate stats from DB ─────────────────────────────────────────
async function getSalesStats() {
    const orders = await Order.find({});

    const totalOrders  = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Top-selling product via aggregation
    const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        {
            $group: {
                _id:           '$items.name',
                totalSold:     { $sum: '$items.quantity' },
                totalRevenue:  { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 1 }
    ]);

    const topProduct = topProducts.length > 0
        ? { name: topProducts[0]._id, unitsSold: topProducts[0].totalSold }
        : { name: 'N/A', unitsSold: 0 };

    // Recent 5 transactions
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return { totalRevenue, totalOrders, topProduct, recentOrders };
}

// ─── GET /sales — render dashboard page (admin only) ─────────────────────────
router.get('/sales', isAdmin, async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.render('sales', { ...stats });
    } catch (err) {
        console.error('Sales page error:', err);
        res.status(500).send('Server Error');
    }
});

// ─── GET /api/sales-data — JSON endpoint for live polling ────────────────────
router.get('/api/sales-data', isAdmin, async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.json({
            totalRevenue:  stats.totalRevenue,
            totalOrders:   stats.totalOrders,
            topProduct:    stats.topProduct
        });
    } catch (err) {
        console.error('Sales API error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;