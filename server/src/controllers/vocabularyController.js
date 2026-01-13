import Vocabulary from '../models/Vocabulary.js'
import UserVocabulary from '../models/UserVocabulary.js'
import ErrorResponse from '../utils/errorResponse.js'

// @desc    Get all vocabularies (Public Dictionary)
// @route   GET /api/vocabulary?level=Beginner&search=hello&page=1&limit=20
// @access  Public (but check if user logged in to show isSaved status)
export const getVocabularies = async (req, res, next) => {
  try {
    const { level, partOfSpeech, search, page = 1, limit = 20 } = req.query
    const query = {}

    // Filters
    if (level) query.level = level
    if (partOfSpeech) query.partOfSpeech = partOfSpeech
    if (search) {
      // Search in word OR meaning (more flexible)
      query.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } }
      ]
    }

    console.log('[GET VOCABULARIES]', {
      query,
      page,
      limit,
      userId: req.user?._id
    })

    // Execute query with pagination
    const vocabs = await Vocabulary.find(query)
      .select('-__v')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ usageCount: -1, word: 1 }) // Popular first, then alphabetical

    const total = await Vocabulary.countDocuments(query)

    // 🔥 NEW: Check which vocabs user has saved (if logged in)
    let savedVocabIds = []
    if (req.user) {
      const userVocabs = await UserVocabulary.find({
        user: req.user._id,
        vocabulary: { $in: vocabs.map((v) => v._id) }
      }).select('vocabulary status')

      savedVocabIds = userVocabs.map((uv) => ({
        id: uv.vocabulary.toString(),
        status: uv.status
      }))
    }

    // Attach isSaved & status to each vocab
    const vocabsWithStatus = vocabs.map((vocab) => {
      const saved = savedVocabIds.find((s) => s.id === vocab._id.toString())
      return {
        ...vocab.toObject(),
        isSaved: !!saved,
        userStatus: saved ? saved.status : null
      }
    })

    res.status(200).json({
      success: true,
      count: vocabs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: vocabsWithStatus
    })
  } catch (error) {
    console.error('[GET VOCABULARIES ERROR]', error)
    next(error)
  }
}

// @desc    Get single vocabulary detail
// @route   GET /api/vocabulary/id/:id
// @access  Public (but show more info if logged in)
export const getVocabularyById = async (req, res, next) => {
  try {
    const vocabId = req.params.id

    const vocab = await Vocabulary.findById(vocabId).populate(
      'relatedWords',
      'word meaning pronunciation partOfSpeech'
    )

    if (!vocab) {
      return next(new ErrorResponse('Từ vựng không tồn tại', 404))
    }

    // Check if user saved this vocab
    let userVocab = null
    if (req.user) {
      userVocab = await UserVocabulary.findOne({
        user: req.user._id,
        vocabulary: vocabId
      }).select('-__v')
    }

    res.status(200).json({
      success: true,
      data: {
        ...vocab.toObject(),
        isSaved: !!userVocab,
        userVocabulary: userVocab
          ? {
              status: userVocab.status,
              isMastered: userVocab.isMastered,
              reviewCount: userVocab.reviewCount,
              correctReviewCount: userVocab.correctReviewCount,
              nextReviewAt: userVocab.nextReviewAt,
              lastReviewedAt: userVocab.lastReviewedAt,
              notes: userVocab.notes
            }
          : null
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get vocabulary by slug (SEO / reload-safe)
// @route   GET /api/vocabulary/:slug
// @access  Public (optionalAuth)
export const getVocabularyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    const vocab = await Vocabulary.findOne({ slug }).populate(
      'relatedWords',
      'word meaning pronunciation partOfSpeech'
    )

    if (!vocab) {
      return next(new ErrorResponse('Từ vựng không tồn tại', 404))
    }

    let userVocab = null
    if (req.user) {
      userVocab = await UserVocabulary.findOne({
        user: req.user._id,
        vocabulary: vocab._id
      })
    }

    res.status(200).json({
      success: true,
      data: {
        ...vocab.toObject(),
        isSaved: !!userVocab,
        userVocabulary: userVocab
          ? {
              _id: userVocab._id,
              status: userVocab.status,
              isMastered: userVocab.isMastered,
              reviewCount: userVocab.reviewCount,
              correctReviewCount: userVocab.correctReviewCount,
              nextReviewAt: userVocab.nextReviewAt,
              lastReviewedAt: userVocab.lastReviewedAt,
              notes: userVocab.notes
            }
          : null
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle save vocabulary (Save/Unsave)
// @route   POST /api/vocabulary/:id/save
// @access  Private
export const toggleSaveVocab = async (req, res, next) => {
  try {
    const vocabId = req.params.id
    const userId = req.user._id

    console.log('[TOGGLE SAVE VOCAB]', { vocabId, userId })

    // Check vocab exists
    const vocab = await Vocabulary.findById(vocabId)
    if (!vocab) {
      return next(new ErrorResponse('Từ vựng không tồn tại', 404))
    }

    // Check if already saved
    let userVocab = await UserVocabulary.findOne({
      user: userId,
      vocabulary: vocabId
    })

    if (userVocab) {
      // Already saved → Unsave
      await userVocab.deleteOne()

      // Decrease usageCount
      await Vocabulary.findByIdAndUpdate(vocabId, { $inc: { usageCount: -1 } })

      return res.status(200).json({
        success: true,
        message: 'Đã bỏ lưu từ vựng',
        isSaved: false,
        action: 'unsaved'
      })
    } else {
      // Not saved yet → Save
      userVocab = await UserVocabulary.create({
        user: userId,
        vocabulary: vocabId,
        status: 'learning'
      })

      // Increase usageCount
      await Vocabulary.findByIdAndUpdate(vocabId, { $inc: { usageCount: 1 } })

      return res.status(200).json({
        success: true,
        message: 'Đã lưu vào kho từ vựng cá nhân',
        isSaved: true,
        action: 'saved',
        data: {
          userVocabId: userVocab._id,
          status: userVocab.status,
          nextReviewAt: userVocab.nextReviewAt
        }
      })
    }
  } catch (error) {
    console.error('[TOGGLE SAVE VOCAB ERROR]', error)
    next(error)
  }
}

// @desc    Get user's saved vocabularies (My Vocabulary)
// @route   GET /api/vocabulary/my-vocab?status=learning&due=true&page=1&limit=20
// @access  Private
export const getMyVocabularies = async (req, res, next) => {
  try {
    const { status, due, page = 1, limit = 20 } = req.query
    const query = { user: req.user._id }

    // Filter by status
    if (status) query.status = status

    // Filter by due date (SRS: words need review)
    if (due === 'true') {
      query.nextReviewAt = { $lte: new Date() }
    }

    console.log('[GET MY VOCABULARIES]', { query, page, limit })

    // Get vocabularies with pagination
    const myVocabs = await UserVocabulary.find(query)
      .populate('vocabulary')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ nextReviewAt: 1 }) // Urgent reviews first

    const total = await UserVocabulary.countDocuments(query)

    // 🔥 NEW: Calculate statistics
    const stats = await UserVocabulary.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statistics = {
      total: await UserVocabulary.countDocuments({ user: req.user._id }),
      learning: stats.find((s) => s._id === 'learning')?.count || 0,
      reviewing: stats.find((s) => s._id === 'reviewing')?.count || 0,
      mastered: stats.find((s) => s._id === 'mastered')?.count || 0,
      dueForReview: await UserVocabulary.countDocuments({
        user: req.user._id,
        nextReviewAt: { $lte: new Date() }
      })
    }

    res.status(200).json({
      success: true,
      count: myVocabs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      statistics,
      data: myVocabs
    })
  } catch (error) {
    console.error('[GET MY VOCABULARIES ERROR]', error)
    next(error)
  }
}

// @desc    Review vocabulary (Submit review result)
// @route   POST /api/vocabulary/review/:id
// @access  Private
export const reviewVocab = async (req, res, next) => {
  try {
    const { isCorrect } = req.body
    const userVocabId = req.params.id // UserVocabulary ID

    console.log('[REVIEW VOCAB]', { userVocabId, isCorrect })

    if (typeof isCorrect !== 'boolean') {
      return next(new ErrorResponse('isCorrect must be a boolean', 400))
    }

    // Find user vocabulary
    const userVocab = await UserVocabulary.findById(userVocabId).populate(
      'vocabulary',
      'word meaning pronunciation'
    )

    if (!userVocab) {
      return next(
        new ErrorResponse('Không tìm thấy từ vựng trong kho của bạn', 404)
      )
    }

    // Security: Ensure this vocab belongs to current user
    if (userVocab.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Unauthorized access', 403))
    }

    // 🔥 Calculate next review using SRS algorithm
    userVocab.calculateNextReview(isCorrect)
    await userVocab.save()

    // Check if just mastered
    const justMastered =
      userVocab.isMastered && userVocab.correctReviewCount === 7

    res.status(200).json({
      success: true,
      message: isCorrect
        ? justMastered
          ? '🎉 Chúc mừng! Bạn đã thành thạo từ này!'
          : '✅ Chính xác! Tiếp tục phát huy nhé.'
        : '❌ Chưa đúng! Đừng bỏ cuộc, cố gắng thêm nha.',
      data: {
        vocabulary: {
          _id: userVocab.vocabulary._id,
          word: userVocab.vocabulary.word,
          meaning: userVocab.vocabulary.meaning
        },
        status: userVocab.status,
        isMastered: userVocab.isMastered,
        reviewCount: userVocab.reviewCount,
        correctReviewCount: userVocab.correctReviewCount,
        nextReviewAt: userVocab.nextReviewAt,
        difficultyLevel: userVocab.difficultyLevel,
        justMastered
      }
    })
  } catch (error) {
    console.error('[REVIEW VOCAB ERROR]', error)
    next(error)
  }
}

// @desc    Update vocabulary notes
// @route   POST /api/vocabulary/:id/notes
// @access  Private
export const updateVocabNotes = async (req, res, next) => {
  try {
    const userVocabId = req.params.id
    const { notes } = req.body

    if (notes && notes.length > 1000) {
      return next(new ErrorResponse('Notes cannot exceed 1000 characters', 400))
    }

    const userVocab = await UserVocabulary.findById(userVocabId)

    if (!userVocab) {
      return next(new ErrorResponse('Vocabulary not found in your list', 404))
    }

    if (userVocab.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Unauthorized access', 403))
    }

    userVocab.notes = notes || ''
    await userVocab.save()

    res.status(200).json({
      success: true,
      message: 'Ghi chú đã được lưu',
      data: {
        notes: userVocab.notes
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get review queue (words due for review today)
// @route   GET /api/vocabulary/review-queue
// @access  Private
export const getReviewQueue = async (req, res, next) => {
  try {
    const reviewQueue = await UserVocabulary.find({
      user: req.user._id,
      nextReviewAt: { $lte: new Date() },
      status: { $in: ['learning', 'reviewing'] } // Exclude mastered from daily reviews
    })
      .populate('vocabulary')
      .sort({ nextReviewAt: 1 })
      .limit(50) // Max 50 reviews per session

    res.status(200).json({
      success: true,
      count: reviewQueue.length,
      data: reviewQueue
    })
  } catch (error) {
    next(error)
  }
}
