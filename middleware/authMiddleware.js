const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'You are not logged in. Please log in to get access.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
