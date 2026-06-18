/**
 * Notice Model
 * Represents hostel announcements/notices that can be targeted to specific audiences
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Notice Document Interface
 * Stores important announcements and notices from hostel management
 */
export interface NoticeDocument {
  title: string;                         // Notice title/heading
  content: string;                       // Full notice content/body
  audience: 'Student' | 'All';          // Target audience for the notice
  targetBlock?: string | null;           // Specific hostel block (if applicable)
  createdBy: mongoose.Types.ObjectId;    // Reference to User who created notice
  createdAt: Date;                       // Notice creation timestamp
  updatedAt: Date;                       // Last update timestamp
}

/**
 * MongoDB Schema for Notices
 */
const noticeSchema = new Schema<NoticeDocument>(
  {
    // Notice title
    title: { type: String, required: true },
    // Notice content
    content: { type: String, required: true },
    // Target audience for notification
    audience: { type: String, enum: ['Student', 'All'], default: 'Student' },
    // Optional: Target specific block
    targetBlock: { type: String },
    // Reference to the user who created the notice
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Notice = mongoose.model<NoticeDocument>('Notice', noticeSchema);
