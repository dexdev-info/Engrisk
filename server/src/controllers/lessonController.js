import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get lesson detail by Slug (Public/Private hybrid)
// @route   GET /api/lessons/:slug
export const getLesson = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // 1. Lấy bài học, populate Vocabulary (cơ bản) và Exercises
    const lesson = await Lesson.findOne({
      slug,
      isPublished: true,
      isDeleted: false,
    })
      .populate(
        'vocabularies',
        'word meaning pronunciation audioUrl type image',
      ) // Lấy thông tin từ vựng để hiển thị popup
      .populate('exercises'); // Lấy bài tập

    if (!lesson) {
      return next(new ErrorResponse('Bài học không tồn tại', 404));
    }

    // 2. Nếu User đã login -> Check xem đã hoàn thành chưa
    let progress = null;
    if (req.user) {
      progress = await UserProgress.findOne({
        user: req.user._id,
        lesson: lesson._id,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...lesson.toObject(),
        isCompleted: !!progress?.isCompleted, // Convert boolean
        userNote: progress?.notes || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson as completed
// @route   POST /api/lessons/:id/complete
export const completeLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) return next(new ErrorResponse('Lesson not found', 404));

    // Tìm hoặc tạo tiến trình
    let progress = await UserProgress.findOne({
      user: req.user._id,
      lesson: lessonId,
    });

    if (!progress) {
      progress = new UserProgress({
        user: req.user._id,
        course: lesson.course,
        lesson: lessonId,
      });
    }

    // Gọi method markCompleted trong Model (nó tự update User stats)
    await progress.markCompleted();

    res.status(200).json({
      success: true,
      message: 'Chúc mừng! Bạn đã hoàn thành bài học.',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
