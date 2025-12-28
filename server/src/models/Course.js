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
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    thumbnail: {
        type: String, // Link ảnh (để string cho nhẹ, sau này tính sau)
        default: null
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
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
    // createdBy: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    lessonsCount: {
        type: Number,
        default: 0
    },
    enrolledCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Auto-generate slug from title
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Virtual populate lessons
courseSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'course'
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;