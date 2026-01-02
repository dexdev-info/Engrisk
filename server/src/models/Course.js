import { Schema, model } from 'mongoose'
import slugify from 'slugify'

const courseSchema = Schema(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual populate lessons
courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  options: { sort: { orderIndex: 1 } }
})

/* =======================
    QUERY FILTER
======================= */
function autoExcludeDeleted() {
  this.where({ isDeleted: false })
}

courseSchema.pre('find', autoExcludeDeleted)
courseSchema.pre('findOne', autoExcludeDeleted)
courseSchema.pre('countDocuments', autoExcludeDeleted)

/* =======================
    SLUG
======================= */
courseSchema.pre('save', function () {
  if (!this.isModified('title')) return

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
})

/* =======================
    LESSON COUNT
======================= */
courseSchema.methods.updateLessonsCount = async function () {
  const Lesson = model('Lesson')
  this.lessonsCount = await Lesson.countDocuments({
    course: this._id,
    isDeleted: false
  })
  await this.save()
}

/* =======================
    SOFT DELETE (CASCADE)
======================= */
courseSchema.methods.softDelete = async function () {
  const Lesson = model('Lesson')

  await Lesson.updateMany(
    { course: this._id },
    { isDeleted: true, deletedAt: new Date() }
  )

  this.isDeleted = true
  this.deletedAt = new Date()
  await this.save()
}

// Indexes
courseSchema.index({ slug: 1 })
courseSchema.index({ level: 1, isPublished: 1 })
courseSchema.index({ createdBy: 1 })

const Course = model('Course', courseSchema)
export default Course
