import jwt from 'jsonwebtoken'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/User.js'

// ===== REQUIRED AUTH  =====
export const protect = async (req, res, next) => {
  try {
    let token

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized, no token', 401))
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return next(new ErrorResponse('User not found', 401))
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return next(new ErrorResponse('Not authorized, token failed', 401))
  }
}

// ===== OPTIONAL AUTH (NEW) =====
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    // Get token from header (if exists)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Nếu có token → verify và attach user
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
      } catch (error) {
        console.log('[OPTIONAL AUTH] Token invalid, continue as guest')
        // Token invalid → continue as guest (không throw error)
      }
    }

    // Không có token hoặc token invalid → continue as guest (req.user = undefined)
    next()
  } catch (error) {
    // Nếu có lỗi gì → vẫn continue (không block request)
    console.error('[OPTIONAL AUTH ERROR]', error)
    next()
  }
}

// ===== AUTHORIZE ROLES =====
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized`, 403)
      )
    }
    next()
  }
}
