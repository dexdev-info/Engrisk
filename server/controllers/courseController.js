const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (Ai cũng xem được list)
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get course by ID (kèm theo danh sách bài học)
// @route   GET /api/courses/:id
// @access  Private (Phải login mới được học)
const getCourseById = async (req, res) => {
    try {
        // Lấy thông tin khóa học
        const course = await Course.findById(req.params.id);

        if (course) {
            // Lấy thêm danh sách bài học thuộc khóa này
            const lessons = await Lesson.find({ course: req.params.id }).sort('order');
            
            // Trả về object gộp cả 2
            res.json({ ...course.toObject(), lessons }); 
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourses, getCourseById };