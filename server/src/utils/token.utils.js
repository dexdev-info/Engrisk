import jwt from 'jsonwebtoken'
import crypto from 'crypto'

/**
 * Generate Access Token (JWT) - Short lived (15m)
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
}

/**
 * Generate Random Refresh Token String
 */
export const generateRefreshTokenString = () => {
  return crypto.randomBytes(40).toString('hex')
}
