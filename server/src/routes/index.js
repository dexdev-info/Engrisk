import express from 'express'

import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import courseRoutes from './courseRoutes.js'
import lessonRoutes from './lessonRoutes.js'
import vocabularyRoutes from './vocabularyRoutes.js'
import exerciseRoutes from './exerciseRoutes.js'
// import progressRoutes from './progress.routes.js';
// import notificationRoutes from './notification.routes.js';

const router = express.Router()

// Health check cho API
router.get('/health', (req, res) => {
  res.json({ status: 'API OK' })
})

// Mount routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/courses', courseRoutes)
router.use('/lessons', lessonRoutes)
router.use('/vocabulary', vocabularyRoutes)
router.use('/exercises', exerciseRoutes)
// router.use('/progress', progressRoutes);
// router.use('/notifications', notificationRoutes);

export default router
