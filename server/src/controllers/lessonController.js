import Lesson from '../models/Lesson.js'
import Course from '../models/Course.js'
import UserProgress from '../models/UserProgress.js'
import CourseEnrollment from '../models/CourseEnrollment.js'
import ErrorResponse from '../utils/errorResponse.js'

// @desc    Get lesson detail by Slug
// @route   GET /api/lessons/:slug
export const getLesson = async (req, res, next) => {
  try {
    const { slug } = req.params

    // 1. Lấy bài học
    const lesson = await Lesson.findOne({
      slug,
      isPublished: true,
      isDeleted: false
    })
      .populate('vocabularies', 'word meaning pronunciation audioUrl type image')
      .populate('exercises')
      .populate('course', 'title slug') // Lấy thêm info course để breadcrumb

    if (!lesson) {
      return next(new ErrorResponse('Bài học không tồn tại', 404))
    }

    // 2. Check tiến độ (nếu đã login)
    let progress = null
    if (req.user) {
      progress = await UserProgress.findOne({
        user: req.user._id,
        lesson: lesson._id
      })
    }

    res.status(200).json({
      success: true,
      data: {
        ...lesson.toObject(),
        isCompleted: !!progress?.isCompleted,
        userNote: progress?.notes || ''
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark lesson as completed
// @route   POST /api/lessons/:id/complete
export const completeLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id
    const userId = req.user._id

    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      return next(new ErrorResponse('Lesson not found', 404))
    }

    // 🔒 Check enrollment
    const enrollment = await CourseEnrollment.findOne({
      user: userId,
      course: lesson.course
    })

    if (!enrollment) {
      return next(
        new ErrorResponse('Bạn cần đăng ký khóa học để hoàn thành bài học', 403)
      )
    }

    // Find or create progress
    let progress = await UserProgress.findOne({
      user: userId,
      lesson: lessonId
    })

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        course: lesson.course,
        lesson: lessonId
      })
    }

    await progress.markCompleted()

    res.status(200).json({
      success: true,
      message: 'Chúc mừng! Bạn đã hoàn thành bài học.',
      data: progress
    })
  } catch (error) {
    next(error)
  }
}