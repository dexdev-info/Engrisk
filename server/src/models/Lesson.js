const mongoose = require('mongoose');
const slugify = require('slugify');

const lessonSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course' // <--- Khóa ngoại trỏ về bảng Course
    },
    title: {
        type: String,
        required: [true, 'Lesson title is required'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    videoUrl: {
        type: String,
        default: null,
        required: false
    },
    // Nội dung bài học (có thể là text, HTML, Markdown, v.v.)
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    orderIndex: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    vocabularies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vocabulary' // Mảng từ vựng liên quan đến bài học
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Auto-generate slug
lessonSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Virtual populate exercises
lessonSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'lesson'
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;