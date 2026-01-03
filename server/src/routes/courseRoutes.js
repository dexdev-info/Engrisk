import express from 'express'
import {
  getCourses,
  getCourseBySlug,
  enrollCourse
} from '../controllers/courseController.js'
import { protect, optionalAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes (không cần login)
router.get('/', getCourses)

// Dùng optionalAuth cho course detail
router.get('/:slug', optionalAuth, getCourseBySlug)

// Protected routes (cần login)
router.post('/:id/enroll', protect, enrollCourse)

// router.get('/lessons/:id/vocab', protect, getVocabByLesson);

export default router
