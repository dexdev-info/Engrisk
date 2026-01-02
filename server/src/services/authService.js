import User from '../models/User.js'
import RefreshToken from '../models/RefreshToken.js'
import ErrorResponse from '../utils/errorResponse.js'
import {
  generateAccessToken,
  generateRefreshTokenString
} from '../utils/token.utils.js'

/**
 * Register Service
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData

  // Check duplicate
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new ErrorResponse('Email đã được sử dụng', 400)
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password
  })

  return user
}

/**
 * Login Service
 */
export const loginUser = async ({ email, password, ipAddress }) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    throw new ErrorResponse('Email hoặc mật khẩu không đúng', 401)
  }

  // 1. Generate Access Token
  const accessToken = generateAccessToken(user)

  // 2. Generate Refresh Token & Save to DB
  const refreshTokenString = generateRefreshTokenString()

  const refreshToken = await RefreshToken.create({
    user: user._id,
    token: refreshTokenString,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    createdByIp: ipAddress
  })

  return {
    user,
    accessToken,
    refreshToken: refreshToken.token
  }
}

/**
 * Refresh Token Service (Rotation Flow)
 */
export const refreshAccessToken = async ({ token, ipAddress }) => {
  const refreshTokenDoc = await RefreshToken.findOne({ token })

  if (!refreshTokenDoc) {
    throw new ErrorResponse('Token không hợp lệ', 401)
  }

  if (!refreshTokenDoc.isActive) {
    // Security: Nếu token đã bị revoke mà vẫn mang ra dùng -> Có thể đang bị hack
    // Action: Revoke toàn bộ token của user này (Optional - Logic nâng cao)
    throw new ErrorResponse('Token đã hết hạn hoặc bị thu hồi', 401)
  }

  const { user } = refreshTokenDoc

  // Rotation: Revoke token cũ
  refreshTokenDoc.revoked = new Date()
  refreshTokenDoc.revokedByIp = ipAddress
  refreshTokenDoc.replacedByToken = 'new_token_generated' // Mark replacement
  await refreshTokenDoc.save()

  // Tạo token mới
  const userDoc = await User.findById(user)
  const newAccessToken = generateAccessToken(userDoc)
  const newRefreshTokenString = generateRefreshTokenString()

  // Lưu token mới vào DB
  await RefreshToken.create({
    user: userDoc._id,
    token: newRefreshTokenString,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshTokenString
  }
}

/**
 * Logout Service
 */
export const logoutUser = async (token, ipAddress) => {
  const refreshTokenDoc = await RefreshToken.findOne({ token })

  if (!refreshTokenDoc) return // Token không tồn tại thì thôi coi như xong

  // Revoke token
  refreshTokenDoc.revoked = new Date()
  refreshTokenDoc.revokedByIp = ipAddress
  await refreshTokenDoc.save()
}
