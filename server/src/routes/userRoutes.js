import express from 'express';
const router = express.Router();
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.middleware.js';

// Tất cả các route dưới đây đều yêu cầu Login
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;
