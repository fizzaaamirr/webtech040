const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../config/upload');

// 1. Dashboard: Show all products
router.get('/', async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.render('admin/dashboard', { products });
});

// 2. Add Product Page
router.get('/add', (req, res) => {
    res.render('admin/form', { 
        product: null, 
        title: 'Add New Product', 
        action: '/admin/add' 
    });
});

// 3. Handle Add Product (Create)
router.post('/add', upload, async (req, res) => {
    const { name, price, category, rating, stock, description } = req.body;
    
    // Validation: Ensure no empty fields
    if (!name || !price || !category || !stock) {
        return res.send('<script>alert("All required fields must be filled!"); window.history.back();</script>');
    }

    const imagePath = req.file ? '/uploads/' + req.file.filename : '/images/product-placeholder.jpg';
    
    await Product.create({ name, price, category, rating, stock, description, image: imagePath });
    res.redirect('/admin');
});

// 4. Edit Product Page (Pre-fills form)
router.get('/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/form', { 
        product, 
        title: 'Edit Product', 
        action: `/admin/edit/${product._id}` 
    });
});

// 5. Handle Edit Product (Update)
router.post('/edit/:id', upload, async (req, res) => {
    const { name, price, category, rating, stock, description } = req.body;
    const product = await Product.findById(req.params.id);
    
    product.name = name;
    product.price = price;
    product.category = category;
    product.rating = rating;
    product.stock = stock;
    product.description = description;
    
    // Only update image if a new one was uploaded
    if (req.file) {
        product.image = '/uploads/' + req.file.filename;
    }
    
    await product.save();
    res.redirect('/admin');
});

// 6. Delete Product
router.post('/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

module.exports = router;