const express = require('express');
const router = express.Router();
const { getLesson, completeLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth.middleware');

router.get('/:slug', protect, getLesson); // Tạm thời để protect, nếu muốn public xem thử thì bỏ ra
router.post('/:id/complete', protect, completeLesson);

module.exports = router;