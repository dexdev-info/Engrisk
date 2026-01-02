import { Schema, model } from 'mongoose';

const courseEnrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // Progress percentage (0-100)
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Last lesson accessed
    lastLessonAccessed: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate progress percentage
courseEnrollmentSchema.methods.calculateProgress = async function () {
  const Lesson = model('Lesson');
  const UserProgress = model('UserProgress');
  const totalLessons = await Lesson.countDocuments({
    course: this.course,
    isPublished: true,
  });
  if (totalLessons === 0) {
    this.progressPercentage = 0;
    return;
  }
  const completedLessons = await UserProgress.countDocuments({
    user: this.user,
    course: this.course,
    isCompleted: true,
  });
  this.progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  if (this.progressPercentage === 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  await this.save();
};

// Update course enrolledCount after save
courseEnrollmentSchema.post('save', async function () {
  if (this.isNew) {
    const Course = model('Course');
    await Course.findByIdAndUpdate(this.course, {
      $inc: { enrolledCount: 1 },
    });
    // Add to user's enrolledCourses
    const User = model('User');
    await User.findByIdAndUpdate(this.user, {
      $addToSet: { enrolledCourses: this.course },
    });
  }
});

// Compound unique index
courseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
courseEnrollmentSchema.index({ user: 1, lastAccessedAt: -1 });
courseEnrollmentSchema.index({ isCompleted: 1 });

const CourseEnrollment = model('CourseEnrollment', courseEnrollmentSchema);
export default CourseEnrollment;
