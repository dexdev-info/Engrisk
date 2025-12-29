const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Lấy token từ Header: Authorization: Bearer <token>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Không có quyền truy cập (No Token)', 401));
    }

    try {
        // 2. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse('User không còn tồn tại', 401));
        }

        // 4. Gắn user vào request để dùng ở Controller sau
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse('Token không hợp lệ hoặc đã hết hạn', 401));
    }
};

// Middleware phân quyền (Admin only)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
            );
        }
        next();
    };
};