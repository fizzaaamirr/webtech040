// Middleware: user must be logged in
const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/auth/login');
};

// Middleware: user must be an admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.userRole === 'admin') {
        return next();
    }
    if (req.session && req.session.userId) {
        req.flash('error', 'Access Denied. Admins only.');
        return res.redirect('/');
    }
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/auth/login');
};

module.exports = { isLoggedIn, isAdmin };
