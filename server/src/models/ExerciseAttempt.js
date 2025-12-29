const mongoose = require('mongoose');

const exerciseAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    userAnswer: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    pointsEarned: {
        type: Number,
        default: 0,
        min: 0
    },
    // Time taken to answer (in seconds)
    timeTaken: {
        type: Number,
        default: 0,
        min: 0
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update exercise statistics after save
exerciseAttemptSchema.post('save', async function () {
    const Exercise = mongoose.model('Exercise');
    const exercise = await Exercise.findById(this.exercise);

    if (exercise) {
        exercise.totalAttempts += 1;
        if (this.isCorrect) {
            exercise.correctAttempts += 1;
        }
        await exercise.save();
    }

    // Update user statistics
    if (this.isCorrect) {
        const User = mongoose.model('User');
        await User.findByIdAndUpdate(this.user, {
            $inc: {
                totalExercisesCompleted: 1,
                totalPoints: this.pointsEarned
            }
        });
    }
});

// Indexes
exerciseAttemptSchema.index({ user: 1, exercise: 1 });
exerciseAttemptSchema.index({ user: 1, lesson: 1 });
exerciseAttemptSchema.index({ attemptedAt: -1 });

const ExerciseAttempt = mongoose.model('ExerciseAttempt', exerciseAttemptSchema);
module.exports = ExerciseAttempt;