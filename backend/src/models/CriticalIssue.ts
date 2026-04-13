import mongoose, { Schema } from 'mongoose';

export interface CriticalIssueDocument {
  title: string;
  description: string;
  reportedByRole: string;
  priority: 'High' | 'Critical';
  status: 'Pending' | 'Reviewed' | 'Resolved';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const criticalIssueSchema = new Schema<CriticalIssueDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reportedByRole: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Critical'], default: 'High' },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const CriticalIssue = mongoose.model<CriticalIssueDocument>('CriticalIssue', criticalIssueSchema);
