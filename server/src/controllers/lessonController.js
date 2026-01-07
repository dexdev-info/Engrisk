import Lesson from '../models/Lesson.js'
import Exercise from '../models/Exercise.js'
import UserProgress from '../models/UserProgress.js'
import CourseEnrollment from '../models/CourseEnrollment.js'
import UserVocabulary from '../models/UserVocabulary.js'
import ErrorResponse from '../utils/errorResponse.js'

/**
 * @desc    Get lesson detail by slug (require enrollment)
 * @route   GET /api/lessons/:slug
 * @access  Private
 */
export const getLesson = async (req, res, next) => {
  try {
    const { slug } = req.params
    const userId = req.user._id

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
    const enrollment = await CourseEnrollment.findOne({
      user: userId,
      course: lesson.course._id
    })

    if (!enrollment) {
      return next(
        new ErrorResponse('Bạn cần đăng ký khóa học để xem bài học này', 403)
      )
    }

    // Update resume info
    enrollment.lastLessonAccessed = lesson._id
    enrollment.lastAccessedAt = new Date()
    await enrollment.save()

    // 3. Get user progress
    let userProgress = await UserProgress.findOne({
      user: userId,
      lesson: lesson._id
    })

    // Create progress if not exists (track access)
    if (!userProgress) {
      userProgress = await UserProgress.create({
        user: userId,
        course: lesson.course._id,
        lesson: lesson._id
      })
    } else {
      // Update access tracking
      await userProgress.recordAccess()
    }

    // 4. Vocabulary saved state
    const savedVocabs = await UserVocabulary.find({
      user: userId,
      vocabulary: { $in: lesson.vocabularies.map((v) => v._id) }
    }).select('vocabulary')

    const savedVocabSet = new Set(
      savedVocabs.map((v) => v.vocabulary.toString())
    )

    const vocabularies = lesson.vocabularies.map((v) => ({
      _id: v._id,
      word: v.word,
      meaning: v.meaning,
      pronunciation: v.pronunciation,
      example: v.example,
      exampleTranslation: v.exampleTranslation,
      partOfSpeech: v.partOfSpeech,
      level: v.level,
      imageUrl: v.imageUrl,
      audioUrl: v.audioUrl,
      isSaved: savedVocabSet.has(v._id.toString())
    }))

    // 5. Get navigation (previous/next lessons)
    const allLessons = await Lesson.find({
      course: lesson.course._id,
      isPublished: true,
      isDeleted: false
    })
      .select('_id slug orderIndex')
      .sort({ orderIndex: 1 })

    const currentIndex = allLessons.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    )

    const previousLesson =
      currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson =
      currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    // 6. Get exercises (without answers for security)
    const exercises = await Exercise.find({
      lesson: lesson._id,
      isDeleted: { $ne: true }
    })
      .select('-correctAnswer -alternativeAnswers') // Don't send answers to frontend
      .sort({ orderIndex: 1 })

    // 7. Response
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
          vocabularies,
          createdAt: lesson.createdAt
        },

        userProgress: {
          isCompleted: userProgress.isCompleted,
          completedAt: userProgress.completedAt,
          timeSpent: userProgress.timeSpent,
          notes: userProgress.notes,
          accessCount: userProgress.accessCount,
          lastAccessedAt: userProgress.lastAccessedAt
        },

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
          previous: previousLesson ? { slug: previousLesson.slug } : null,
          next: nextLesson ? { slug: nextLesson.slug } : null,
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

/**
 * @desc    Complete lesson
 * @route   POST /api/lessons/:id/complete
 */
export const completeLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id
    const userId = req.user._id
    const { timeSpent, notes } = req.body || {}

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
    if (timeSpent) progress.timeSpent += timeSpent
    if (notes !== undefined) progress.notes = notes

    // Mark as completed
    // ! markCompleted is idempotent (safe to call multiple times)
    await progress.markCompleted()

    // 5. Update course enrollment progress
    await enrollment.calculateProgress()

    // TODO: 6. Check for achievements (optional - implement later)
    // await checkAndUnlockAchievements(userId)

    // 7. Response
    res.status(200).json({
      success: true,
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
        }
      }
    })
  } catch (error) {
    console.error('[COMPLETE LESSON ERROR]', error)
    next(error)
  }
}

/**
 * @desc    Update time spent
 * @route   POST /api/lessons/:id/update-time
 */
export const updateTimeSpent = async (req, res, next) => {
  try {
    const lessonId = req.params.id
    const userId = req.user._id
    const { timeSpent } = req.body // seconds

    if (!timeSpent || timeSpent < 0) {
      return next(new ErrorResponse('Invalid time value', 400))
    }

    // Find or create progress
    const progress = await UserProgress.findOneAndUpdate(
      {
        user: userId,
        lesson: lessonId
      },
      {
        $inc: { timeSpent },
        lastAccessedAt: new Date()
      },
      { new: true }
    )

    if (!progress) {
      return next(new ErrorResponse('Progress not found', 404))
    }

    res.status(200).json({
      success: true,
      data: { totalTimeSpent: progress.timeSpent }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Save lesson notes
 * @route   POST /api/lessons/:id/notes
 */
export const saveNotes = async (req, res, next) => {
  try {
    const userId = req.user._id
    const lessonId = req.params.id
    const { notes = '' } = req.body

    if (notes.length > 5000) {
      return next(new ErrorResponse('Notes cannot exceed 5000 characters', 400))
    }

    // Find progress
    const progress = await UserProgress.findOneAndUpdate(
      {
        user: userId,
        lesson: lessonId
      },
      { notes },
      { new: true }
    )

    if (!progress) {
      return next(new ErrorResponse('Progress not found', 404))
    }

    res.status(200).json({
      success: true,
      data: { notes: progress.notes }
    })
  } catch (error) {
    next(error)
  }
}
