import express from 'express'
const router = express.Router()

import {
  getVocabularies,
  getVocabularyById,
  getVocabularyBySlug,
  toggleSaveVocab,
  getMyVocabularies,
  reviewVocab,
  updateVocabNotes,
  getReviewQueue
} from '../controllers/vocabularyController.js'

import { protect, optionalAuth } from '../middleware/auth.middleware.js'

// ===== PUBLIC =====
router.get('/', optionalAuth, getVocabularies)

// ===== PERSONAL / SRS =====
router.get('/my', protect, getMyVocabularies)
router.get('/review-queue', protect, getReviewQueue)

// ===== ACTIONS =====
router.post('/:id/save', protect, toggleSaveVocab)
router.post('/:id/notes', protect, updateVocabNotes)
router.post('/review/:id', protect, reviewVocab)

// ===== DETAIL =====
router.get('/:id', optionalAuth, getVocabularyById)
router.get('/:slug', optionalAuth, getVocabularyBySlug)

export default router
