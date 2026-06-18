/**
 * Notification Model
 * Represents in-app notifications sent to users about various system events
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Types of notifications that can be sent
 */
export type NotificationType =
  | 'complaint_submitted'         // When complaint is filed
  | 'complaint_status_update'     // When complaint status changes
  | 'task_assigned'               // When task is assigned to user
  | 'task_completed'              // When assigned task is completed
  | 'order_confirmed'             // When canteen order is confirmed
  | 'order_ready'                 // When canteen order is ready
  | 'notice_published'            // When new notice is posted
  | 'attendance_marked'           // When attendance is recorded
  | 'system_alert';               // General system alerts

/**
 * Notification Document Interface
 */
export interface NotificationDocument {
  userId: mongoose.Types.ObjectId;       // Reference to User receiving notification
  type: NotificationType;                 // Type of notification
  title: string;                          // Notification title
  message: string;                        // Notification message
  read: boolean;                          // Whether user has read it
  relatedItemId?: string;                 // ID of related item (e.g., complaint ID)
  relatedItemType?: 'complaint' | 'task' | 'order' | 'notice' | 'attendance'; // Type of related item
  metadata?: Record<string, unknown>;     // Additional data specific to notification
  createdAt: Date;                        // Notification creation timestamp
  updatedAt: Date;                        // Last update timestamp
}

/**
 * MongoDB Schema for Notifications
 */
const notificationSchema = new Schema<NotificationDocument>(
  {
    // Reference to user receiving notification
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Type of notification
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
    // Notification title
    title: { type: String, required: true },
    // Notification message content
    message: { type: String, required: true },
    // Read status
    read: { type: Boolean, default: false },
    // Reference to related item
    relatedItemId: { type: String },
    relatedItemType: {
      type: String,
      enum: ['complaint', 'task', 'order', 'notice', 'attendance'],
    },
    // Flexible metadata for additional notification-specific data
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for efficient queries
// Query notifications for specific user sorted by creation date
notificationSchema.index({ userId: 1, createdAt: -1 });
// Query unread notifications for specific user
notificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);
