import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

// Middleware bảo vệ route (Login required)
export const protect = async (req, res, next) => {
  let token;

  // 1. Lấy token từ Header
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
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check user tồn tại
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('User không còn tồn tại', 401));
    }

    // 4. Attach user vào request
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Token không hợp lệ hoặc đã hết hạn', 401));
  }
};

// Middleware phân quyền
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized`, 403),
      );
    }
    next();
  };
};
