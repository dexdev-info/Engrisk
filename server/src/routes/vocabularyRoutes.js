const express = require('express');
const router = express.Router();
const { 
    getVocabularies, 
    toggleSaveVocab, 
    getMyVocabularies, 
    reviewVocab 
} = require('../controllers/vocabularyController');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getVocabularies); // Public Dictionary
router.get('/my-vocab', protect, getMyVocabularies); // SRS List

router.post('/:id/save', protect, toggleSaveVocab); // Save/Unsave
router.post('/review/:id', protect, reviewVocab); // Submit review result

module.exports = router;