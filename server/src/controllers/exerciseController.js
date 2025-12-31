import Exercise from '../models/Exercise.js';
import ExerciseAttempt from '../models/ExerciseAttempt.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Submit Exercise Answer
// @route   POST /api/exercises/:id/submit
export const submitExercise = async (req, res, next) => {
    try {
        const exerciseId = req.params.id;
        const { userAnswer, timeTaken } = req.body;

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) return next(new ErrorResponse('Exercise not found', 404));

        // Logic chấm điểm đơn giản
        // (Nâng cao: xử lý case-insensitive, trim space...)
        let isCorrect = false;
        
        if (exercise.type === 'multiple_choice') {
            isCorrect = exercise.correctAnswer === userAnswer;
        } else if (exercise.type === 'fill_blank') {
            // Check correct answer OR alternative answers
            const possibleAnswers = [exercise.correctAnswer, ...exercise.alternativeAnswers]
                .map(a => a.toLowerCase().trim());
            
            isCorrect = possibleAnswers.includes(userAnswer.toLowerCase().trim());
        } else if (exercise.type === 'matching') {
            // Logic matching phức tạp hơn, tạm thời giả sử Client gửi lên true/false đã validate
            // Hoặc so sánh JSON string
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(exercise.correctAnswer);
        }

        const pointsEarned = isCorrect ? exercise.points : 0;

        // Lưu lịch sử làm bài
        const attempt = await ExerciseAttempt.create({
            user: req.user._id,
            exercise: exerciseId,
            lesson: exercise.lesson,
            userAnswer: JSON.stringify(userAnswer), // Convert to string nếu là object
            isCorrect,
            pointsEarned,
            timeTaken
        });

        res.status(200).json({
            success: true,
            data: {
                isCorrect,
                pointsEarned,
                correctAnswer: isCorrect ? null : exercise.correctAnswer, // Chỉ hiện đáp án đúng nếu làm sai (Optional)
                explanation: exercise.explanation
            }
        });

    } catch (error) {
        next(error);
    }
};
