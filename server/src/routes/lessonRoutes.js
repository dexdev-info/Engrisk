import express from 'express'
import { getLesson, completeLesson, updateTimeSpent, saveNotes } from '../controllers/lessonController.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect)

router.get('/:slug', getLesson)
router.post('/:id/complete', completeLesson)
router.post('/:id/update-time', updateTimeSpent)
router.post('/:id/notes', saveNotes)

export default router