import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} from '../services/authService.js'
import ErrorResponse from '../utils/errorResponse.js'

// Cấu hình Cookie
const cookieOptions = {
  httpOnly: true, // JS không đọc được
  // secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS
  secure: false, // localhost = http
  sameSite: 'lax', // Chuẩn SPA cross-site request, nếu để 'strict'
  // hoặc 'none' sẽ không hoạt động nếu khác domain
  // lên production dùng 'none'.
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body)

    // Đăng ký xong chưa login ngay (tùy logic, ở đây mình trả về success để client tự redirect sang login)
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng đăng nhập.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    next(error) // Đẩy về errorHandler trung tâm
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const ipAddress = req.ip

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
      ipAddress
    })

    // Set Refresh Token vào Cookie
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({
      success: true,
      accessToken, // Gửi Access Token qua JSON
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public (nhưng cần refresh token trong cookie)
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken // Lấy từ Cookie
    const ipAddress = req.ip

    if (!token) {
      return next(new ErrorResponse('Refresh Token is required', 400))
    }

    const result = await refreshAccessToken({ token, ipAddress })

    // Update lại Cookie mới (Rotation)
    res.cookie('refreshToken', result.refreshToken, cookieOptions)

    res.status(200).json({
      success: true,
      accessToken: result.accessToken
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private (dựa trên refresh token)
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken
    const ipAddress = req.ip

    if (token) {
      await logoutUser(token, ipAddress)
    }

    // Xóa cookie
    res.cookie('refreshToken', '', {
      ...cookieOptions,
      expires: new Date(0)
    })

    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    })
  } catch (error) {
    next(error)
  }
}
