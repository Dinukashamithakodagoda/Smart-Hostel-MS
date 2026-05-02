import mongoose, { Schema } from 'mongoose';

export interface NoticeDocument {
  title: string;
  content: string;
  audience: 'Student' | 'All';
  targetBlock?: string | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<NoticeDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    audience: { type: String, enum: ['Student', 'All'], default: 'Student' },
    targetBlock: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Notice = mongoose.model<NoticeDocument>('Notice', noticeSchema);
