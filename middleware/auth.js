const authenticateAdmin = (req, res, next) => {
    // Check if user is logged in and is an admin
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

module.exports = {
    authenticateAdmin
}; 