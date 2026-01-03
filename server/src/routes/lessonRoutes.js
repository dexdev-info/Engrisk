import express from 'express'
import { getLesson, completeLesson } from '../controllers/lessonController.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public view (hoặc optional auth để check progress)
// Lưu ý: Ở đây mình dùng protect dạng optional (custom) hoặc cứ để protect cứng nếu bắt buộc login để học
// Để đơn giản giai đoạn này: user phải login mới vào màn hình học
router.get('/:slug', protect, getLesson)

router.post('/:id/complete', protect, completeLesson)

export default router