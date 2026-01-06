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

    console.log('[GET LESSON]', { slug, userId: req.user?._id })

    // 1. Find lesson
    const lesson = await Lesson.findOne({
      slug,
      isPublished: true,
      isDeleted: false
    })
      .populate({
        path: 'vocabularies',
        select:
          'word meaning pronunciation example exampleTranslation partOfSpeech level imageUrl audioUrl',
        match: { isDeleted: { $ne: true } }
      })
      // Lấy thêm info course để breadcrumb
      .populate({
        path: 'course',
        select: 'title slug level'
      })
    if (!lesson) {
      return next(new ErrorResponse('Bài học không tồn tại', 404))
    }

    // 2. Check enrollment (MUST be enrolled to view lesson)
    if (req.user) {
      const enrollment = await CourseEnrollment.findOne({
        user: req.user._id,
        course: lesson.course._id
      })

      if (!enrollment) {
        return next(
          new ErrorResponse('Bạn cần đăng ký khóa học để xem bài học này', 403)
        )
      }

      // Update last accessed
      enrollment.lastLessonAccessed = lesson._id
      enrollment.lastAccessedAt = new Date()
      await enrollment.save()
    }

    // 3. Get user progress
    let userProgress = null
    if (req.user) {
      userProgress = await UserProgress.findOne({
        user: req.user._id,
        lesson: lesson._id
      })

      // Create progress if not exists (track access)
      if (!userProgress) {
        userProgress = await UserProgress.create({
          user: req.user._id,
          course: lesson.course._id,
          lesson: lesson._id
        })
      } else {
        // Update access tracking
        await userProgress.recordAccess()
      }
    }

    // 4. Get navigation (previous/next lessons)
    const allLessons = await Lesson.find({
      course: lesson.course._id,
      isPublished: true,
      isDeleted: false
    })
      .select('_id title slug orderIndex course')
      .populate({
        path: 'course',
        select: 'slug'
      })
      .sort({ orderIndex: 1 })

    const currentIndex = allLessons.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    )

    const previousLesson =
      currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson =
      currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    // 5. Get exercises (without answers for security)
    const exercises = await lesson
      .model('Exercise')
      .find({
        lesson: lesson._id,
        isDeleted: { $ne: true }
      })
      .select('-correctAnswer -alternativeAnswers') // Don't send answers to frontend
      .sort({ orderIndex: 1 })

    // 6. Response
    res.status(200).json({
      success: true,
      data: {
        lesson: {
          _id: lesson._id,
          title: lesson.title,
          slug: lesson.slug,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          audioUrl: lesson.audioUrl,
          duration: lesson.duration,
          type: lesson.type,
          orderIndex: lesson.orderIndex,
          course: lesson.course,
          vocabularies: lesson.vocabularies,
          createdAt: lesson.createdAt
        },
        userProgress: userProgress
          ? {
              isCompleted: userProgress.isCompleted,
              completedAt: userProgress.completedAt,
              timeSpent: userProgress.timeSpent,
              notes: userProgress.notes,
              accessCount: userProgress.accessCount,
              lastAccessedAt: userProgress.lastAccessedAt
            }
          : null,
        exercises: exercises.map((ex) => ({
          _id: ex._id,
          title: ex.title,
          type: ex.type,
          question: ex.question,
          options: ex.options, // For multiple choice
          points: ex.points,
          orderIndex: ex.orderIndex,
          difficulty: ex.difficulty,
          explanation: ex.explanation // Show explanation after submit
        })),
        navigation: {
          previous: previousLesson
            ? {
                _id: previousLesson._id,
                slug: previousLesson.slug,
                courseSlug: previousLesson.course.slug
              }
            : null,
          next: nextLesson
            ? {
                _id: nextLesson._id,
                slug: nextLesson.slug,
                courseSlug: nextLesson.course.slug
              }
            : null,
          totalLessons: allLessons.length,
          currentPosition: currentIndex + 1
        }
      }
    })
  } catch (error) {
    console.error('[GET LESSON ERROR]', error)
    next(error)
  }
}

// @desc    Mark lesson as completed
// @route   POST /api/lessons/:id/complete
export const completeLesson = async (req, res, next) => {
  try {
    console.log('[COMPLETE LESSON] req.user:', req.user)
    console.log('[COMPLETE LESSON] body:', req.body)
    const lessonId = req.params.id
    const userId = req.user._id

    const timeSpent = req.body?.timeSpent
    const notes = req.body?.notes

    // const { timeSpent, notes } = req.body || {}

    console.log('[COMPLETE LESSON]', { lessonId, userId, timeSpent })

    // 1. Validate lesson exists
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      return next(new ErrorResponse('Lesson not found', 404))
    }

    // 2. Check enrollment
    const enrollment = await CourseEnrollment.findOne({
      user: userId,
      course: lesson.course
    })

    if (!enrollment) {
      return next(
        new ErrorResponse('Bạn cần đăng ký khóa học để hoàn thành bài học', 403)
      )
    }

    // 3. Find or create progress
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

    // 4. Update progress
    if (timeSpent) {
      progress.timeSpent += timeSpent
    }
    if (notes) {
      progress.notes = notes
    }

    // Mark as completed
    // ! markCompleted is idempotent (safe to call multiple times)
    await progress.markCompleted()

    // 5. Update course enrollment progress
    await enrollment.calculateProgress()

    // 6. Check for achievements (optional - implement later)
    // await checkAndUnlockAchievements(userId)

    // 7. Get next lesson suggestion
    const nextLesson = await Lesson.findOne({
      course: lesson.course,
      orderIndex: { $gt: lesson.orderIndex },
      isPublished: true,
      isDeleted: false
    })
      .select('_id title slug')
      .sort({ orderIndex: 1 })

    res.status(200).json({
      success: true,
      message: 'Chúc mừng! Bạn đã hoàn thành bài học.',
      data: {
        progress: {
          isCompleted: progress.isCompleted,
          completedAt: progress.completedAt,
          timeSpent: progress.timeSpent,
          notes: progress.notes
        },
        courseProgress: {
          progressPercentage: enrollment.progressPercentage,
          isCompleted: enrollment.isCompleted
        },
        nextLesson: nextLesson
          ? {
              _id: nextLesson._id,
              title: nextLesson.title,
              slug: nextLesson.slug
            }
          : null
      }
    })
  } catch (error) {
    console.error('[COMPLETE LESSON ERROR FULL]', error)
    next(error)
  }
}

// @desc    Update time spent on lesson
// @route   POST /api/lessons/:id/update-time
// @access  Private
export const updateTimeSpent = async (req, res, next) => {
  try {
    const lessonId = req.params.id
    const userId = req.user._id
    // const { timeSpent } = req.body // seconds
    const timeSpent = req.body?.timeSpent // seconds

    if (!timeSpent || timeSpent < 0) {
      return next(new ErrorResponse('Invalid time value', 400))
    }

    // Find or create progress
    let progress = await UserProgress.findOne({
      user: userId,
      lesson: lessonId
    })

    if (!progress) {
      const lesson = await Lesson.findById(lessonId)
      if (!lesson) {
        return next(new ErrorResponse('Lesson not found', 404))
      }

      progress = new UserProgress({
        user: userId,
        course: lesson.course,
        lesson: lessonId,
        timeSpent: 0
      })
    }

    // Update time
    progress.timeSpent += timeSpent
    progress.lastAccessedAt = new Date()
    await progress.save()

    res.status(200).json({
      success: true,
      data: {
        totalTimeSpent: progress.timeSpent
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Save/Update lesson notes
// @route   POST /api/lessons/:id/notes
// @access  Private
export const saveNotes = async (req, res, next) => {
  try {
    const lessonId = req.params.id
    const userId = req.user._id
    const { notes } = req.body

    if (notes && notes.length > 5000) {
      return next(new ErrorResponse('Notes cannot exceed 5000 characters', 400))
    }

    // Find progress
    const progress = await UserProgress.findOne({
      user: userId,
      lesson: lessonId
    })

    if (!progress) {
      return next(new ErrorResponse('Please access the lesson first', 404))
    }

    // Update notes
    progress.notes = notes || ''
    await progress.save()

    res.status(200).json({
      success: true,
      message: 'Ghi chú đã được lưu',
      data: {
        notes: progress.notes
      }
    })
  } catch (error) {
    next(error)
  }
}
