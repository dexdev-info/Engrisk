// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // Enrolled courses (for quick access)
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    // Learning streak tracking
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    // Total statistics
    totalLessonsCompleted: {
        type: Number,
        default: 0
    },
    totalExercisesCompleted: {
        type: Number,
        default: 0
    },
    totalVocabulariesMastered: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    // ===== Soft Delete =====
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user achievements
userSchema.virtual('achievements', {
    ref: 'UserAchievement',
    localField: '_id',
    foreignField: 'user'
});

/* =======================
    GLOBAL QUERY FILTER
======================= */
function autoExcludeDeleted() {
    this.where({ isDeleted: false });
}

userSchema.pre('find', autoExcludeDeleted);
userSchema.pre('findOne', autoExcludeDeleted);
userSchema.pre('countDocuments', autoExcludeDeleted);

/* =======================
    PASSWORD
======================= */
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/* =======================
    SOFT DELETE METHOD
======================= */
userSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
};

// Update activity date and streak
userSchema.methods.updateActivity = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = this.lastActivityDate ? new Date(this.lastActivityDate) : null;

    if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0);
        const dayDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            // Consecutive day
            this.currentStreak += 1;
            if (this.currentStreak > this.longestStreak) {
                this.longestStreak = this.currentStreak;
            }
        } else if (dayDiff > 1) {
            // Streak broken
            this.currentStreak = 1;
        }
        // If dayDiff === 0, same day, no change
    } else {
        // First activity
        this.currentStreak = 1;
        this.longestStreak = 1;
    }

    this.lastActivityDate = new Date();
    await this.save();
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;