const express = require('express');
const router = express.Router();
const { submitExercise } = require('../controllers/exerciseController');
const { protect } = require('../middleware/auth.middleware');

router.post('/:id/submit', protect, submitExercise);

module.exports = router;