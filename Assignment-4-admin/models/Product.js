const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    stock: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: '/images/product-placeholder.jpg'
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Product', productSchema);