import express from 'express'
const router = express.Router()
import { getLesson, completeLesson } from '../controllers/lessonController.js'
import { protect } from '../middleware/auth.middleware.js'

router.get('/:slug', protect, getLesson) // Tạm thời để protect, nếu muốn public xem thử thì bỏ ra
router.post('/:id/complete', protect, completeLesson)

export default router
