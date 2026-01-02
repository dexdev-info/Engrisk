import express from 'express'
const router = express.Router()
import { submitExercise } from '../controllers/exerciseController.js'
import { protect } from '../middleware/auth.middleware.js'

router.post('/:id/submit', protect, submitExercise)

export default router
