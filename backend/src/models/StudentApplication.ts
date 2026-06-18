/**
 * Student Application Model
 * Represents a student's hostel accommodation application with approval workflow
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Application status progression:
 * pending_warden -> Waiting for warden review
 * approved_warden -> Warden approved, waiting for AR finalization
 * rejected_warden -> Warden rejected the application
 * finalized -> AR completed the process, room assigned
 */
export type ApplicationStatus =
  | 'pending_warden'
  | 'approved_warden'
  | 'rejected_warden'
  | 'finalized';

/**
 * Student Application Document Interface
 */
export interface StudentApplicationDocument {
  user: mongoose.Types.ObjectId;        // Reference to User
  fullName: string;                      // Student's full name
  studentId: string;                     // University student ID
  idCardNumber: string;                  // National ID card number
  nic: string;                           // National ID number
  gender: 'male' | 'female';            // Student's gender
  faculty: string;                       // Faculty/Department
  year: string;                          // Academic year (1st, 2nd, etc.)
  address: string;                       // Home address
  distance: number;                      // Distance from hostel
  contactNumber: string;                 // Contact phone number
  email: string;                         // Email address
  assignedBlock?: string;               // Hostel block assignment
  assignedRoom?: string;                // Room number assignment
  status: ApplicationStatus;             // Current application status
  wardenApprovedBy?: mongoose.Types.ObjectId;  // Warden who approved
  wardenApprovedAt?: Date;              // Approval timestamp
  arFinalizedBy?: mongoose.Types.ObjectId;     // AR who finalized
  arFinalizedAt?: Date;                 // Finalization timestamp
  createdAt: Date;                       // Application creation date
  updatedAt: Date;                       // Last update date
}

/**
 * MongoDB Schema for Student Applications
 */
const applicationSchema = new Schema<StudentApplicationDocument>(
  {
    // Reference to User document
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    // Student information fields
    fullName: { type: String, required: true },
    studentId: { type: String, required: true },
    idCardNumber: { type: String, required: true },
    nic: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    faculty: { type: String, required: true },
    year: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    // Room assignment fields
    assignedBlock: { type: String },
    assignedRoom: { type: String },
    // Approval workflow fields
    status: {
      type: String,
      enum: ['pending_warden', 'approved_warden', 'rejected_warden', 'finalized'],
      default: 'pending_warden',
    },
    // Warden approval details
    wardenApprovedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    wardenApprovedAt: { type: Date },
    // AR finalization details
    arFinalizedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    arFinalizedAt: { type: Date },
  },
  { timestamps: true }
);

export const StudentApplication = mongoose.model<StudentApplicationDocument>(
  'StudentApplication',
  applicationSchema
);
