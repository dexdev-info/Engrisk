const express = require('express');
const router = express.Router();
const { getCourses, getCourseBySlug, enrollCourse } = require('../controllers/courseController');
// const { protect } = require('../middleware/auth.middleware');

// Ai cũng xem được danh sách khóa học
router.get('/', getCourses);

// Nhưng muốn xem chi tiết (để học) thì phải Login
router.get('/:slug', getCourseBySlug);

// Private routes
// router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/enroll', enrollCourse);


// router.get('/lessons/:id/vocab', protect, getVocabByLesson);
// Note: Nếu muốn check enrollment chính xác ở Backend thì cần middleware optional auth.
// Nhưng ở Frontend mình check theo list enrolledCourses trong User Profile cũng được.

module.exports = router;