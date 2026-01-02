// models/UserVocabulary.js
import { Schema, model } from 'mongoose';

const userVocabularySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vocabulary: {
      type: Schema.Types.ObjectId,
      ref: 'Vocabulary',
      required: true,
    },
    // Learning status
    status: {
      type: String,
      enum: ['learning', 'reviewing', 'mastered'],
      default: 'learning',
    },
    isMastered: {
      type: Boolean,
      default: false,
    },
    // Review count
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Correct review count
    correctReviewCount: {
      type: Number,
      default: 0,
    },
    // Last reviewed date
    lastReviewedAt: {
      type: Date,
      default: null,
    },
    // Next review date (spaced repetition)
    nextReviewAt: {
      type: Date,
      default: function () {
        // Default: review tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
    },
    // Difficulty multiplier (affects review intervals)
    difficultyLevel: {
      type: Number,
      default: 1,
      min: 0.5,
      max: 3,
    },
    // User's personal notes for this vocabulary
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// Calculate next review date based on spaced repetition
userVocabularySchema.methods.calculateNextReview = function (isCorrect) {
  const intervals = {
    learning: [1, 3, 7], // days
    reviewing: [14, 30, 60],
    mastered: [90, 180, 365],
  };

  if (isCorrect) {
    this.correctReviewCount += 1;

    // Increase interval
    const currentIntervals = intervals[this.status];
    const reviewIndex = Math.min(
      this.correctReviewCount - 1,
      currentIntervals.length - 1,
    );
    const daysToAdd = currentIntervals[reviewIndex] * this.difficultyLevel;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    this.nextReviewAt = nextDate;

    // Update status
    if (this.correctReviewCount >= 3 && this.status === 'learning') {
      this.status = 'reviewing';
    } else if (this.correctReviewCount >= 7 && this.status === 'reviewing') {
      this.status = 'mastered';
      this.isMastered = true;
    }
  } else {
    // Reset to shorter interval on incorrect answer
    this.difficultyLevel = Math.min(this.difficultyLevel * 1.2, 3);

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    this.nextReviewAt = nextDate;
  }

  this.reviewCount += 1;
  this.lastReviewedAt = new Date();
};

// Compound unique index
userVocabularySchema.index({ user: 1, vocabulary: 1 }, { unique: true });
userVocabularySchema.index({ user: 1, status: 1 });
userVocabularySchema.index({ user: 1, nextReviewAt: 1 });
userVocabularySchema.index({ isMastered: 1 });

const UserVocabulary = model('UserVocabulary', userVocabularySchema);
export default UserVocabulary;
