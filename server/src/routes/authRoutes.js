import express from 'express';
const router = express.Router();
import { register, login, refreshToken, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.middleware.js';
// const { validateRegister, validateLogin } = require('../validators/authValidator');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken); // Client gọi khi nhận lỗi 401
router.post('/logout', logout);

export default router;