/**
 * Critical Issue Model
 * Represents urgent/critical issues reported by various staff members
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Critical Issue Document Interface
 * Tracks critical incidents that need immediate attention
 */
export interface CriticalIssueDocument {
  title: string;                         // Issue title
  description: string;                   // Detailed description
  reportedByRole: string;                // Role of person reporting (for reference)
  priority: 'High' | 'Critical';        // Priority level
  status: 'Pending' | 'Reviewed' | 'Resolved'; // Resolution status
  createdBy: mongoose.Types.ObjectId;    // Reference to User who reported
  createdAt: Date;                       // Report creation timestamp
  updatedAt: Date;                       // Last update timestamp
}

/**
 * MongoDB Schema for Critical Issues
 */
const criticalIssueSchema = new Schema<CriticalIssueDocument>(
  {
    // Issue title
    title: { type: String, required: true },
    // Detailed description of the critical issue
    description: { type: String, required: true },
    // Role of person reporting (for context)
    reportedByRole: { type: String, required: true },
    // Priority level
    priority: { type: String, enum: ['High', 'Critical'], default: 'High' },
    // Status: Pending -> Reviewed -> Resolved
    status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
    // User who reported the critical issue
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const CriticalIssue = mongoose.model<CriticalIssueDocument>('CriticalIssue', criticalIssueSchema);
