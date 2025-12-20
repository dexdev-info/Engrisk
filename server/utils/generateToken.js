// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    // 1. Tạo token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token sống 30 ngày
    });

    // 2. Lưu token vào Cookie của response
    res.cookie('jwt', token, {
        httpOnly: true, // Quan trọng: Chặn JS đọc cookie (Chống XSS)
        secure: process.env.NODE_ENV !== 'development', // Nếu là production thì bắt buộc https
        sameSite: 'strict', // Chống CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày (tính bằng ms)
    });
};

module.exports = generateToken;