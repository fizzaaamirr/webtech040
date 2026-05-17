const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /auth/register
router.get('/register', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render('auth/register', {
        error: req.flash('error'),
        success: req.flash('success'),
        formData: req.flash('formData')[0] || {}
    });
});

// POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validations
    if (!name || !email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required.');
        req.flash('formData', { name, email });
        return res.redirect('/auth/register');
    }

    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters.');
        req.flash('formData', { name, email });
        return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        req.flash('formData', { name, email });
        return res.redirect('/auth/register');
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            req.flash('error', 'An account with that email already exists.');
            req.flash('formData', { name, email });
            return res.redirect('/auth/register');
        }

        const user = await User.create({ name, email, password });

        // Auto-login after registration
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userRole = user.role;

        req.flash('success', `Welcome to Cinnabon, ${user.name}!`);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        req.flash('formData', { name, email });
        return res.redirect('/auth/register');
    }
});

// GET /auth/login
router.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render('auth/login', {
        error: req.flash('error'),
        success: req.flash('success'),
        formData: req.flash('formData')[0] || {}
    });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Email and password are required.');
        req.flash('formData', { email });
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            req.flash('formData', { email });
            return res.redirect('/auth/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            req.flash('formData', { email });
            return res.redirect('/auth/login');
        }

        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userRole = user.role;

        req.flash('success', `Welcome back, ${user.name}!`);

        // Redirect admins to admin panel, customers to home
        if (user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/auth/login');
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    const userName = req.session.userName;
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.clearCookie('connect.sid');
        // Flash won't work after session destroy, so use query param
        return res.redirect('/?loggedOut=1&name=' + encodeURIComponent(userName || ''));
    });
});

module.exports = router;
