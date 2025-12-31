import Vocabulary from '../models/Vocabulary.js';
import UserVocabulary from '../models/UserVocabulary.js';
import ErrorResponse from '../utils/errorResponse.js';

// ================= PUBLIC =================

// @desc    Get all vocabularies (Dictionary mode)
// @route   GET /api/vocabularies
// @query   ?level=beginner&type=noun&search=hello
export const getVocabularies = async (req, res, next) => {
    try {
        const { level, partOfSpeech, search, page = 1, limit = 20 } = req.query;
        const query = {};

        if (level) query.level = level;
        if (partOfSpeech) query.partOfSpeech = partOfSpeech;
        if (search) {
            query.word = { $regex: search, $options: 'i' }; // Tìm kiếm tương đối
        }

        const vocabs = await Vocabulary.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ word: 1 });

        const total = await Vocabulary.countDocuments(query);

        res.status(200).json({
            success: true,
            count: vocabs.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: vocabs
        });
    } catch (error) {
        next(error);
    }
};

// ================= PRIVATE (MY VOCAB) =================

// @desc    Toggle Save/Unsave Vocabulary to "My Vocab"
// @route   POST /api/vocabularies/:id/save
export const toggleSaveVocab = async (req, res, next) => {
    try {
        const vocabId = req.params.id;
        
        // Check vocab exist
        const vocab = await Vocabulary.findById(vocabId);
        if (!vocab) return next(new ErrorResponse('Từ vựng không tồn tại', 404));

        // Check user saved
        let userVocab = await UserVocabulary.findOne({
            user: req.user._id,
            vocabulary: vocabId
        });

        if (userVocab) {
            // Nếu đã lưu -> Xóa (Unsave)
            await userVocab.deleteOne();
            
            // Giảm usageCount của từ gốc
            await Vocabulary.findByIdAndUpdate(vocabId, { $inc: { usageCount: -1 } });

            return res.status(200).json({
                success: true,
                message: 'Đã bỏ lưu từ vựng',
                isSaved: false
            });
        } else {
            // Chưa lưu -> Tạo mới
            await UserVocabulary.create({
                user: req.user._id,
                vocabulary: vocabId,
                status: 'learning' // Mặc định là đang học
            });

            // Tăng usageCount
            await Vocabulary.findByIdAndUpdate(vocabId, { $inc: { usageCount: 1 } });

            return res.status(200).json({
                success: true,
                message: 'Đã lưu vào kho từ vựng cá nhân',
                isSaved: true
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get My Vocabularies (Filter & SRS)
// @route   GET /api/vocabularies/my-vocab
// @query   ?status=learning|mastered&due=true (due=true để lấy từ cần ôn tập)
export const getMyVocabularies = async (req, res, next) => {
    try {
        const { status, due } = req.query;
        const query = { user: req.user._id };

        if (status) query.status = status;
        
        // Logic SRS: Lấy các từ đã đến hạn ôn (nextReviewAt <= now)
        if (due === 'true') {
            query.nextReviewAt = { $lte: new Date() };
        }

        const myVocabs = await UserVocabulary.find(query)
            .populate('vocabulary') // Populate lấy data từ gốc
            .sort({ nextReviewAt: 1 }); // Ưu tiên từ cần ôn gấp

        res.status(200).json({
            success: true,
            count: myVocabs.length,
            data: myVocabs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Review Vocabulary (SRS Logic)
// @route   POST /api/vocabularies/review/:id
// @body    { isCorrect: true/false }
export const reviewVocab = async (req, res, next) => {
    try {
        const { isCorrect } = req.body;
        const userVocabId = req.params.id; // ID của UserVocabulary, ko phải Vocab gốc

        const userVocab = await UserVocabulary.findById(userVocabId);
        
        if (!userVocab || userVocab.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Không tìm thấy từ vựng trong kho của bạn', 404));
        }

        // Gọi method SRS xịn sò cậu đã viết trong Model
        userVocab.calculateNextReview(isCorrect);
        await userVocab.save();

        res.status(200).json({
            success: true,
            data: {
                word: userVocab.vocabulary, // ID
                status: userVocab.status,
                nextReviewAt: userVocab.nextReviewAt,
                message: isCorrect ? 'Great job! +1 Point' : 'Don\'t worry, keep trying!'
            }
        });
    } catch (error) {
        next(error);
    }
};
