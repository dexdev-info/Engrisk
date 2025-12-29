const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate Access Token (JWT) - Short lived (15m)
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // 15 phút
    );
};

/**
 * Generate Random Refresh Token String
 */
const generateRefreshTokenString = () => {
    return crypto.randomBytes(40).toString('hex');
};

module.exports = {
    generateAccessToken,
    generateRefreshTokenString
};