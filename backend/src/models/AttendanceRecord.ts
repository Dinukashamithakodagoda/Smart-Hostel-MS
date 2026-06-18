/**
 * Attendance Record Model
 * Tracks daily attendance records for students by hostel block
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Individual attendance entry for a single student
 */
export interface AttendanceEntry {
  studentId: string;                     // University student ID
  name: string;                          // Student's name
  room: string;                          // Room number
  present: boolean;                      // Presence status
}

/**
 * Attendance Record Document Interface
 * Represents a daily attendance record for a specific hostel block
 */
export interface AttendanceRecordDocument {
  date: string;                          // Date of attendance (YYYY-MM-DD format)
  block: string;                         // Hostel block name
  entries: AttendanceEntry[];            // Array of student attendance entries
  createdBy: mongoose.Types.ObjectId;    // Reference to AR (Attendance Register) who recorded
  createdAt: Date;                       // Record creation timestamp
  updatedAt: Date;                       // Last update timestamp
}

/**
 * Schema for individual attendance entry (nested document)
 */
const attendanceEntrySchema = new Schema<AttendanceEntry>(
  {
    // Student ID for identification
    studentId: { type: String, required: true },
    // Student name
    name: { type: String, required: true },
    // Room number
    room: { type: String, required: true },
    // Present/Absent status
    present: { type: Boolean, default: true },
  },
  { _id: false }  // Don't generate ObjectId for nested entries
);

/**
 * Schema for attendance records
 */
const attendanceRecordSchema = new Schema<AttendanceRecordDocument>(
  {
    // Date of attendance
    date: { type: String, required: true },
    // Block name
    block: { type: String, required: true },
    // Array of attendance entries
    entries: { type: [attendanceEntrySchema], default: [] },
    // Reference to AR who created the record
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Unique index: Only one attendance record per date per block
attendanceRecordSchema.index({ date: 1, block: 1 }, { unique: true });

export const AttendanceRecord = mongoose.model<AttendanceRecordDocument>('AttendanceRecord', attendanceRecordSchema);
