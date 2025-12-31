import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const lessonSchema = Schema({
    course: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary'
    }],
    // Lesson type for flexibility
    type: {
        type: String,
        enum: ['theory', 'practice', 'mixed'],
        default: 'mixed'
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

// Virtual populate exercises
lessonSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'lesson',
    options: { sort: { orderIndex: 1 } }
});

/* =======================
    QUERY FILTER
======================= */
function autoExcludeDeleted() {
    this.where({ isDeleted: false });
}

lessonSchema.pre('find', autoExcludeDeleted);
lessonSchema.pre('findOne', autoExcludeDeleted);
lessonSchema.pre('countDocuments', autoExcludeDeleted);

/* =======================
    SLUG UNIQUE / COURSE
======================= */
lessonSchema.pre('save', async function () {
    if (!this.isModified('title')) return;

    const baseSlug = slugify(this.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });

    let slug = baseSlug;
    let counter = 1;

    while (await model('Lesson').findOne({
        course: this.course,
        slug,
        _id: { $ne: this._id }
    })) {
        slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
});


/* =======================
    UPDATE COURSE COUNTS
======================= */
lessonSchema.post('save', async function () {
    const Course = model('Course');
    const course = await Course.findById(this.course);
    if (course) {
        await course.updateLessonsCount();
    }
});

/* =======================
    SOFT DELETE
======================= */
lessonSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();

    const Course = model('Course');
    const course = await Course.findById(this.course);
    if (course) await course.updateLessonsCount();
};

// Compound index for unique slug per course
lessonSchema.index({ course: 1, slug: 1 }, { unique: true });
lessonSchema.index({ course: 1, orderIndex: 1 });
lessonSchema.index({ isPublished: 1 });

const Lesson = model('Lesson', lessonSchema);
export default Lesson;