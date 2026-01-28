import { Schema, model } from 'mongoose'

const userVocabularySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vocabulary: {
      type: Schema.Types.ObjectId,
      ref: 'Vocabulary',
      required: true
    },
    status: {
      type: String,
      enum: ['learning', 'reviewing', 'mastered'],
      default: 'learning'
    },
    isMastered: {
      type: Boolean,
      default: false
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    correctReviewCount: {
      type: Number,
      default: 0
    },
    lastReviewedAt: {
      type: Date,
      default: null
    },
    nextReviewAt: {
      type: Date,
      default: function () {
        // Default: review tomorrow
        return new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    },
    // Difficulty multiplier (affects review intervals)
    difficultyLevel: {
      type: Number,
      default: 1,
      min: 0.5,
      max: 3
    },
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
)

// Review intervals (spaced repetition) - days
const INTERVALS = {
  learning: [1, 3, 7],
  reviewing: [14, 30, 60],
  mastered: [90, 180, 365]
}

// Calculate next review date based on spaced repetition
userVocabularySchema.methods.calculateNextReview = function (isCorrect) {
  // Tổng số lần review
  this.reviewCount += 1
  this.lastReviewedAt = new Date()

  const now = Date.now()

  if (isCorrect) {
    // Tăng chuỗi trả lời đúng
    this.correctReviewCount += 1

    // Giảm độ khó khi trả lời đúng (adaptive difficulty)
    this.difficultyLevel = Math.max(this.difficultyLevel * 0.8, 0.5)

    // Trả lời đúng càng nhiều → interval gốc càng lớn
    const currentIntervals = INTERVALS[this.status]

    const reviewIndex = Math.min(
      this.correctReviewCount - 1,
      currentIntervals.length - 1
    )

    // Difficulty càng cao (càng khó) → số ngày càng nhỏ → gặp lại sớm
    const daysToAdd = currentIntervals[reviewIndex] / this.difficultyLevel
    this.nextReviewAt = new Date(now + daysToAdd * 24 * 60 * 60 * 1000)

    // Update status
    if (this.status === 'learning' && this.correctReviewCount >= 3) {
      this.status = 'reviewing'
    } else if (this.status === 'reviewing' && this.correctReviewCount >= 7) {
      this.status = 'mastered'
    }
  } else {
    // mất 1 chuỗi đúng
    this.correctReviewCount = Math.max(this.correctReviewCount - 1, 0)

    // Reset to shorter interval on incorrect answer
    this.difficultyLevel = Math.min(this.difficultyLevel * 1.2, 3)

    // Downgrade status
    if (this.status === 'mastered') {
      this.status = 'reviewing'
      this.isMastered = false
    } else if (this.status === 'reviewing') {
      this.status = 'learning'
    }

    // ôn lại sớm (1 ngày)
    this.nextReviewAt = new Date(now + 1 * 24 * 60 * 60 * 1000)
  }

  // Đồng bộ isMastered theo status
  if (this.status === 'mastered') {
    this.isMastered = true
  }

  // Nếu đã mastered, giới hạn correctReviewCount
  if (this.status === 'mastered') {
    this.correctReviewCount = Math.min(this.correctReviewCount, 5)
  }
}

// Compound unique index
userVocabularySchema.index({ user: 1, vocabulary: 1 }, { unique: true })
userVocabularySchema.index({ user: 1, status: 1 })
userVocabularySchema.index({ user: 1, nextReviewAt: 1 })
userVocabularySchema.index({ isMastered: 1 })

const UserVocabulary = model('UserVocabulary', userVocabularySchema)
export default UserVocabulary
