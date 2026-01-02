import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: [
          'lesson_completed',
          'achievement_unlocked',
          'streak_reminder',
          'course_update',
          'vocabulary_review',
          'new_course',
          'system',
        ],
        message: 'Invalid notification type',
      },
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    // Additional data (JSON)
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    // Link to redirect on click
    link: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Mark as read
notificationSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
};

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

const Notification = model('Notification', notificationSchema);
export default Notification;
