import Course from '../models/Course.js'
import CourseEnrollment from '../models/CourseEnrollment.js'
import ErrorResponse from '../utils/errorResponse.js'

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      isPublished: true,
      isDeleted: false
    })
      .select(
        'title slug thumbnail level description lessonsCount enrolledCount'
      ) // Chỉ lấy field cần thiết
      .sort({ orderIndex: 1 })

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } catch (error) {
    next(error)
  }
}

export const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      isPublished: true,
      isDeleted: false
    }).populate({
      path: 'lessons',
      select: 'title slug type duration isPublished orderIndex',
      match: { isPublished: true, isDeleted: false }, // Chỉ lấy bài học đã public
      options: { sort: { orderIndex: 1 } }
    })

    if (!course) {
      return next(new ErrorResponse('Khóa học không tồn tại', 404))
    }

    // Check enrollment status (nếu đã login)
    let isEnrolled = false
    let enrollmentData = null

    if (req.user && req.user._id) {
      const enrollment = await CourseEnrollment.findOne({
        user: req.user._id,
        course: course._id
      }).select('progressPercentage lastLessonAccessed enrolledAt')

      if (enrollment) {
        isEnrolled = true
        enrollmentData = {
          progressPercentage: enrollment.progressPercentage,
          lastLessonAccessed: enrollment.lastLessonAccessed,
          enrolledAt: enrollment.enrolledAt
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        isEnrolled,
        enrollmentData
      }
    })
  } catch (error) {
    next(error)
  }
}

export const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id
    const userId = req.user._id

    // 1. Check khóa học tồn tại
    const course = await Course.findById(courseId)
    if (!course) {
      return next(new ErrorResponse('Khóa học không tồn tại', 404))
    }

    if (!course.isPublished) {
      return next(new ErrorResponse('Khóa học chưa được phát hành', 400))
    }

    // 2. Check đã đăng ký chưa
    const existingEnrollment = await CourseEnrollment.findOne({
      user: userId,
      course: courseId
    })

    if (existingEnrollment) {
      return next(new ErrorResponse('Bạn đã đăng ký khóa học này rồi', 400))
    }

    // 3. Tạo enrollment mới
    // (Middleware 'save' trong Model sẽ tự update User.enrolledCourses và Course.enrolledCount)
    const enrollment = await CourseEnrollment.create({
      user: userId,
      course: courseId
    })

    res.status(200).json({
      success: true,
      message: 'Đăng ký khóa học thành công!',
      data: {
        courseId,
        enrollment: {
          progressPercentage: enrollment.progressPercentage,
          enrolledAt: enrollment.enrolledAt
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
