/**
 * Complaint Model
 * Represents complaints filed by students about hostel facilities and services
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Complaint Document Interface
 * Tracks issues reported by students and their resolution status
 */
export interface ComplaintDocument {
  title: string;                         // Brief complaint title
  description: string;                   // Detailed complaint description
  category: 'Maintenance' | 'Cleaning' | 'Canteen' | 'Furniture' | 'Security' | 'Other'; // Complaint type
  status: 'pending' | 'in_progress' | 'resolved'; // Resolution status
  createdBy: mongoose.Types.ObjectId;    // Reference to User who filed complaint
  submittedByRole?: string;              // Role of person who submitted (for filtering)
  submittedByName?: string;              // Name of person who submitted
  assignedRole?: string;                 // Role responsible for resolution (e.g., 'Maintenance Supervisor')
  assignedTo?: mongoose.Types.ObjectId;  // Reference to User assigned to resolve
  createdAt: Date;                       // Complaint submission timestamp
  updatedAt: Date;                       // Last update timestamp
}

/**
 * MongoDB Schema for Complaints
 */
const complaintSchema = new Schema<ComplaintDocument>(
  {
    // Complaint title
    title: { type: String, required: true },
    // Detailed description
    description: { type: String, required: true },
    // Category for filtering and routing
    category: {
      type: String,
      enum: ['Maintenance', 'Cleaning', 'Canteen', 'Furniture', 'Security', 'Other'],
      required: true,
    },
    // Status progression: pending -> in_progress -> resolved
    status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
    // User who filed the complaint
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Information about who submitted
    submittedByRole: { type: String },
    submittedByName: { type: String },
    // Assignment information
    assignedRole: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<ComplaintDocument>('Complaint', complaintSchema);
