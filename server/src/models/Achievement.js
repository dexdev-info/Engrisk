const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: '🏆'
    },
    // Condition to unlock achievement
    conditionType: {
        type: String,
        enum: {
            values: [
                'lessons_completed',
                'streak_days',
                'vocabularies_mastered',
                'exercises_completed',
                'courses_completed',
                'points_earned',
                'perfect_score'
            ],
            message: 'Invalid condition type'
        },
        required: true
    },
    conditionValue: {
        type: Number,
        required: true,
        min: 1
    },
    // Badge tier
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    // Points awarded when unlocked
    pointsReward: {
        type: Number,
        default: 100,
        min: 0
    },
    // How many users unlocked this
    unlockedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes
achievementSchema.index({ conditionType: 1 });
achievementSchema.index({ tier: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;