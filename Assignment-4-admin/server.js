const express = require("express");
const connectDB = require('./database');

connectDB();

let app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Mount admin routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const Product = require('./models/Product');

app.get("/", function (req, res) {
    return res.render("homepage");
});

app.get("/products", async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        
        const search = req.query.search || '';
        const category = req.query.category || '';
        const minPrice = req.query.minPrice || 0;
        const maxPrice = req.query.maxPrice || 1000;
        
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
        
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        
        const products = await Product.find(query)
            .skip(skip)
            .limit(limit);
        
        const categories = await Product.distinct('category');
        
        return res.render("products", {
            products,
            currentPage: page,
            totalPages,
            categories,
            search,
            category,
            minPrice,
            maxPrice,
            totalProducts
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});

app.get("/contact-us", function (req, res) {
    return res.render("contact-us");
});

app.listen(3000, function () {
    console.log("Console from server.js file");
    console.log("Server Started at localhost:3000");
});