import { Schema, model } from 'mongoose'
import User from './User.js'
import Course from './Course.js'
import Lesson from './Lesson.js'
import UserProgress from './UserProgress.js'

const courseEnrollmentSchema = new Schema(
  {
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
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    // Progress percentage (0-100)
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    // Last lesson accessed
    lastLessonAccessed: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

// Calculate progress percentage
courseEnrollmentSchema.methods.calculateProgress = async function () {
  const totalLessons = await Lesson.countDocuments({
    course: this.course,
    isPublished: true
  })
  if (totalLessons === 0) {
    this.progressPercentage = 0
    return
  }
  const completedLessons = await UserProgress.countDocuments({
    user: this.user,
    course: this.course,
    isCompleted: true
  })
  this.progressPercentage = Math.round((completedLessons / totalLessons) * 100)
  if (this.progressPercentage === 100 && !this.isCompleted) {
    this.isCompleted = true
    this.completedAt = new Date()
  }
  await this.save()
}

// Update course enrolledCount after save
courseEnrollmentSchema.pre('save', async function () {
  if (this.isNew) {
    await Course.findByIdAndUpdate(this.course, {
      $inc: { enrolledCount: 1 }
    })
    // Add to user's enrolledCourses
    await User.findByIdAndUpdate(this.user, {
      $addToSet: { enrolledCourses: this.course }
    })
  }
})

// TODO: Update course enrolledCount after remove

// Compound unique index
courseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true })
courseEnrollmentSchema.index({ user: 1, lastAccessedAt: -1 })
courseEnrollmentSchema.index({ isCompleted: 1 })

const CourseEnrollment = model('CourseEnrollment', courseEnrollmentSchema)
export default CourseEnrollment
