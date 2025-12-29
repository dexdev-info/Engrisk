// ============================================
// models/UserAchievement.js
// ============================================
const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true
    },
    unlockedAt: {
        type: Date,
        default: Date.now
    },
    // Was notification sent?
    notificationSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Update achievement unlockedCount after save
userAchievementSchema.post('save', async function () {
    const Achievement = mongoose.model('Achievement');
    await Achievement.findByIdAndUpdate(this.achievement, {
        $inc: { unlockedCount: 1 }
    });

    // Update user total points
    const achievement = await Achievement.findById(this.achievement);
    if (achievement) {
        const User = mongoose.model('User');
        await User.findByIdAndUpdate(this.user, {
            $inc: { totalPoints: achievement.pointsReward }
        });
    }
});

// Compound unique index
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
userAchievementSchema.index({ user: 1, unlockedAt: -1 });

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
module.exports = UserAchievement;