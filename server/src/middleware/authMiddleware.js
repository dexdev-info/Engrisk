// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Đọc token từ cookie tên là 'jwt'
    token = req.cookies.jwt;

    if (token) {
        try {
            // 1. Giải mã token để lấy userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 2. Tìm user trong DB (bỏ qua password) và gán vào req.user
            req.user = await User.findById(decoded.userId).select('-password');

            next(); // Cho phép đi tiếp vào Controller
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };