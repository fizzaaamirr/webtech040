const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const connectDB = require('./database');

connectDB();

let app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ─── Session Setup ────────────────────────────────────────────────────────────
app.use(session({
    secret: 'cinnabon-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/cinnabon',
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// ─── Flash Messages ───────────────────────────────────────────────────────────
app.use(flash());

// ─── Global Template Variables ────────────────────────────────────────────────
app.use((req, res, next) => {
    res.locals.currentUser = {
        id: req.session.userId || null,
        name: req.session.userName || null,
        role: req.session.userRole || null,
        isLoggedIn: !!req.session.userId,
        isAdmin: req.session.userRole === 'admin'
    };
    res.locals.flashSuccess = req.flash('success');
    res.locals.flashError = req.flash('error');
    next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const { isAdmin, isLoggedIn } = require('./middleware/auth');
const adminRoutes = require('./routes/admin');
app.use('/admin', isAdmin, adminRoutes);

const Product = require('./models/Product');

app.get("/", function (req, res) {
    let logoutSuccess = null;
    if (req.query.loggedOut === '1') {
        const name = req.query.name ? decodeURIComponent(req.query.name) : '';
        logoutSuccess = name
            ? `You have successfully logged out. See you soon, ${name}!`
            : 'You have successfully logged out.';
    }
    return res.render("homepage", { logoutSuccess });
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

        if (search) query.name = { $regex: search, $options: 'i' };
        if (category) query.category = category;

        query.price = {
            $gte: parseFloat(minPrice),
            $lte: parseFloat(maxPrice)
        };

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(query).skip(skip).limit(limit);
        const categories = await Product.distinct('category');

        return res.render("products", {
            products, currentPage: page, totalPages,
            categories, search, category, minPrice, maxPrice, totalProducts
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
});

// Protected route example
app.get("/checkout", isLoggedIn, function (req, res) {
    return res.render("checkout");
});

app.listen(3000, function () {
    console.log("Console from server.js file");
    console.log("Server Started at localhost:3000");
});