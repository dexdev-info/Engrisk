const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    thumbnail: {
        type: String, // Link ảnh (để string cho nhẹ, sau này tính sau)
        default: null
    },
    level: {
        type: String,
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: 'Level must be beginner, intermediate, or advanced'
        },
        default: 'Beginner'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    orderIndex: {
        type: Number,
        default: 0
    },
    // Quan hệ: Một khóa học do ai tạo? (Optional: nếu muốn mở rộng cho giảng viên)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Cached counts for performance
    lessonsCount: {
        type: Number,
        default: 0
    },
    enrolledCount: {
        type: Number,
        default: 0
    },
    // Estimated duration in hours
    estimatedDuration: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate lessons
courseSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'course',
    options: { sort: { orderIndex: 1 } }
});

// Auto-generate slug from title
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

// Update lessonsCount when lessons are added/removed
courseSchema.methods.updateLessonsCount = async function () {
    const Lesson = mongoose.model('Lesson');
    this.lessonsCount = await Lesson.countDocuments({ course: this._id });
    await this.save();
};

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ level: 1, isPublished: 1 });
courseSchema.index({ createdBy: 1 });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;