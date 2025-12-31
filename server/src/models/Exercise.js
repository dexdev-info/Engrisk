import { Schema, model } from 'mongoose';

const exerciseSchema = new Schema({
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: [true, 'Lesson reference is required']
    },
    title: {
        type: String,
        required: [true, 'Exercise title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    type: {
        type: String,
        enum: {
            values: ['multiple_choice', 'fill_blank', 'matching', 'speaking', 'writing'],
            message: 'Invalid exercise type'
        },
        required: [true, 'Exercise type is required']
    },
    question: {
        type: String,
        required: [true, 'Question is required'],
        maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    // For multiple choice exercises
    options: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                if (this.type === 'multiple_choice') {
                    return arr.length >= 2 && arr.length <= 6;
                }
                return true;
            },
            message: 'Multiple choice must have 2-6 options'
        }
    },
    // Correct answer(s)
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required']
    },
    // Alternative correct answers (for fill blank)
    alternativeAnswers: [{
        type: String,
        trim: true
    }],
    // Explanation for the answer
    explanation: {
        type: String,
        default: null,
        maxlength: [1000, 'Explanation cannot exceed 1000 characters']
    },
    // Points awarded for correct answer
    points: {
        type: Number,
        default: 10,
        min: [1, 'Points must be at least 1']
    },
    orderIndex: {
        type: Number,
        default: 0
    },
    // Difficulty level
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    // Related vocabulary (if applicable)
    relatedVocabulary: [{
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary'
    }],
    // Statistics
    totalAttempts: {
        type: Number,
        default: 0
    },
    correctAttempts: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate success rate
exerciseSchema.virtual('successRate').get(function () {
    if (this.totalAttempts === 0) return 0;
    return ((this.correctAttempts / this.totalAttempts) * 100).toFixed(2);
});

// Indexes
exerciseSchema.index({ lesson: 1, orderIndex: 1 });
exerciseSchema.index({ type: 1 });
exerciseSchema.index({ difficulty: 1 });

const Exercise = model('Exercise', exerciseSchema);
export default Exercise;