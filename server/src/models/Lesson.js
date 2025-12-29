const mongoose = require('mongoose');
const slugify = require('slugify');

const lessonSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Course reference is required'],
        ref: 'Course' // <--- Khóa ngoại trỏ về bảng Course
    },
    title: {
        type: String,
        required: [true, 'Lesson title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    // Main content (can be markdown or HTML)
    content: {
        type: String,
        required: [true, 'Lesson content is required']
    },
    // Video URL (YouTube, Vimeo, or direct link)
    videoUrl: {
        type: String,
        default: null
    },
    // Audio URL for pronunciation
    audioUrl: {
        type: String,
        default: null
    },
    // Duration in minutes
    duration: {
        type: Number,
        default: 0,
        min: [0, 'Duration cannot be negative']
    },
    orderIndex: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    // Vocabularies associated with this lesson
    vocabularies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vocabulary'
    }],
    // Lesson type for flexibility
    type: {
        type: String,
        enum: ['theory', 'practice', 'mixed'],
        default: 'mixed'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate exercises
lessonSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'lesson',
    options: { sort: { orderIndex: 1 } }
});

// Auto-generate slug from title + course
lessonSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        const baseSlug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        // Ensure unique slug within the course
        let slug = baseSlug;
        let counter = 1;

        while (await mongoose.model('Lesson').findOne({
            course: this.course,
            slug: slug,
            _id: { $ne: this._id }
        })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

// Update course lessonsCount after save/delete
lessonSchema.post('save', async function () {
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course);
    if (course) {
        await course.updateLessonsCount();
    }
});

lessonSchema.post('remove', async function () {
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course);
    if (course) {
        await course.updateLessonsCount();
    }
});

// Compound index for unique slug per course
lessonSchema.index({ course: 1, slug: 1 }, { unique: true });
lessonSchema.index({ course: 1, orderIndex: 1 });
lessonSchema.index({ isPublished: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;