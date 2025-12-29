const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken); // Client gọi khi nhận lỗi 401
router.post('/logout', logout);

module.exports = router;