const mongoose = require('mongoose');
const connectDB = require('./database');
const Product = require('./models/Product');

const products = [
    { name: 'Classic Cinnabon Roll', price: 4.99, category: 'Bakery', rating: 4.8, stock: 50, description: 'Our signature cinnamon roll with cream cheese frosting', image: '/images/classic-cinnabon.jpg' },
    { name: 'Pecanbon', price: 5.49, category: 'Bakery', rating: 4.9, stock: 30, description: 'Cinnamon roll topped with pecans and caramel', image: '/images/pecanbon.jpg' },
    { name: 'Cinnamon Roll Cake', price: 6.99, category: 'Bakery', rating: 4.7, stock: 20, description: 'Whole cake perfect for sharing', image: '/images/Cinnamon-Roll-Cake.jpg' },
    { name: 'Mini Rolls 6 pack', price: 8.99, category: 'Bakery', rating: 4.6, stock: 40, description: 'Six bite-sized cinnamon rolls', image: '/images/6-rolls.png' },
    { name: 'Cinnabon Bites', price: 3.99, category: 'Bakery', rating: 4.5, stock: 60, description: 'Bite-sized pieces of cinnamon roll', image: '/images/bon-bites.png' },
    { name: 'Blueberry Roll', price: 5.49, category: 'Bakery', rating: 4.4, stock: 25, description: 'Cinnamon roll with blueberry swirl', image: '/images/blueberry-roll.jpg' },
    { name: 'Chocolate Babka', price: 4.99, category: 'Bakery', rating: 4.6, stock: 35, description: 'Twisted chocolate bread', image: '/images/choco-babka.jpg' },
    { name: 'Cinnamon Sugar Pretzel', price: 3.49, category: 'Bakery', rating: 4.3, stock: 45, description: 'Soft pretzel with cinnamon sugar', image: '/images/cinnamon-sugar-pretzels.jpg' },
    { name: 'MochaLatta Chill', price: 5.99, category: 'Beverages', rating: 4.8, stock: 100, description: 'Iced mocha latte with whipped cream', image: '/images/mochalatta.jpg' },
    { name: 'Caramel Iced Coffee', price: 4.99, category: 'Beverages', rating: 4.7, stock: 100, description: 'Cold brew with caramel', image: '/images/iced-coffee.png' },
    { name: 'Hot Chocolate', price: 3.99, category: 'Beverages', rating: 4.6, stock: 80, description: 'Rich hot chocolate with marshmallows', image: '/images/Hot-Cocoa.png' },
    { name: 'Cappuccino', price: 4.49, category: 'Beverages', rating: 4.5, stock: 100, description: 'Classic Italian coffee', image: '/images/Cappucino.jpg' },
    { name: 'Vanilla Latte', price: 4.99, category: 'Beverages', rating: 4.7, stock: 100, description: 'Espresso with steamed milk and vanilla', image: '/images/vanilla-latte.jpg' },
    { name: 'Fresh Orange Juice', price: 3.99, category: 'Beverages', rating: 4.4, stock: 50, description: 'Freshly squeezed orange juice', image: '/images/oj.jpg' },
    { name: 'Peach Iced Tea', price: 2.99, category: 'Beverages', rating: 4.3, stock: 100, description: 'Refreshing peach iced tea', image: '/images/iced-tea.jpg' },
    { name: 'Smoothie Berry Blast', price: 5.49, category: 'Beverages', rating: 4.6, stock: 60, description: 'Mixed berry smoothie', image: '/images/berryblast.jpg' },
    { name: 'CinnaPack Classic 4 rolls', price: 12.99, category: 'CinnaPacks', rating: 4.9, stock: 30, description: 'Four classic cinnamon rolls to share', image: '/images/4-rolls.jpg' },
    { name: 'CinnaPack Variety 6 rolls', price: 18.99, category: 'CinnaPacks', rating: 4.8, stock: 25, description: 'Six assorted cinnamon rolls', image: '/images/variety-6-rolls.png' },
    { name: 'CinnaPack Party 12 rolls', price: 34.99, category: 'CinnaPacks', rating: 4.9, stock: 15, description: 'Twelve rolls for parties', image: '/images/party.jpg' },
    { name: 'CinnaPack Mini 12 bites', price: 14.99, category: 'CinnaPacks', rating: 4.7, stock: 20, description: 'Twelve mini cinnamon roll bites', image: '/images/mini-12.jpg' },
    { name: 'CinnaPack Deluxe', price: 24.99, category: 'CinnaPacks', rating: 4.8, stock: 18, description: 'Eight premium rolls with drinks', image: '/images/deluxe.jpg' },
    { name: 'Cinnabon Mug', price: 8.99, category: 'Merchandise', rating: 4.5, stock: 40, description: 'Branded mugs', image: '/images/mugs.jpg' },
    { name: 'Cinnabon T-Shirt', price: 19.99, category: 'Merchandise', rating: 4.4, stock: 25, description: 'Cotton t-shirt with logo', image: '/images/tshirts.jpg' },
    { name: 'Gift Card 25', price: 25.00, category: 'Merchandise', rating: 5.0, stock: 100, description: 'Gift card worth 25 dollars', image: '/images/giftcard.jpg' },
    { name: 'Recipe Book', price: 14.99, category: 'Merchandise', rating: 4.6, stock: 30, description: 'Cinnabon recipes at home', image: '/images/recipe-book.jpg' }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        await Product.insertMany(products);
        console.log('Seeded ' + products.length + ' products successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();