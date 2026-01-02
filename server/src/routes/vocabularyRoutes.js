import express from 'express'
const router = express.Router()
import {
  getVocabularies,
  toggleSaveVocab,
  getMyVocabularies,
  reviewVocab
} from '../controllers/vocabularyController.js'
import { protect } from '../middleware/auth.middleware.js'

router.get('/', getVocabularies) // Public Dictionary
router.get('/my-vocab', protect, getMyVocabularies) // SRS List

router.post('/:id/save', protect, toggleSaveVocab) // Save/Unsave
router.post('/review/:id', protect, reviewVocab) // Submit review result

export default router
