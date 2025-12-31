import { Schema, model } from 'mongoose';

const userProgressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    // Time spent on this lesson in seconds
    timeSpent: {
        type: Number,
        default: 0,
        min: 0
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    // Number of times accessed
    accessCount: {
        type: Number,
        default: 1
    },
    // Notes taken by user during lesson
    notes: {
        type: String,
        default: '',
        maxlength: [5000, 'Notes cannot exceed 5000 characters']
    }
}, {
    timestamps: true
});

// Update lastAccessedAt and increment accessCount
userProgressSchema.methods.recordAccess = async function () {
    this.lastAccessedAt = new Date();
    this.accessCount += 1;
    await this.save();
};

// Mark as completed
userProgressSchema.methods.markCompleted = async function () {
    if (!this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();

        // Update user statistics
        const User = model('User');
        await User.findByIdAndUpdate(this.user, {
            $inc: { totalLessonsCompleted: 1 }
        });

        await this.save();
    }
};

// Compound unique index
userProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });
userProgressSchema.index({ user: 1, course: 1 });
userProgressSchema.index({ isCompleted: 1 });

const UserProgress = model('UserProgress', userProgressSchema);
export default UserProgress;