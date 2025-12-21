const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware'); // Import middleware bảo vệ

// Ai cũng xem được danh sách khóa học
router.get('/', getCourses);

// Nhưng muốn xem chi tiết (để học) thì phải Login
router.get('/:id', protect, getCourseById);

module.exports = router;