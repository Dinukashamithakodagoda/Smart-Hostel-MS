import mongoose, { Schema } from 'mongoose';

export type NotificationType =
  | 'complaint_submitted'
  | 'complaint_status_update'
  | 'task_assigned'
  | 'task_completed'
  | 'order_confirmed'
  | 'order_ready'
  | 'notice_published'
  | 'attendance_marked'
  | 'system_alert';

export interface NotificationDocument {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedItemId?: string;
  relatedItemType?: 'complaint' | 'task' | 'order' | 'notice' | 'attendance';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'complaint_submitted',
        'complaint_status_update',
        'task_assigned',
        'task_completed',
        'order_confirmed',
        'order_ready',
        'notice_published',
        'attendance_marked',
        'system_alert',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedItemId: { type: String },
    relatedItemType: {
      type: String,
      enum: ['complaint', 'task', 'order', 'notice', 'attendance'],
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);
