/**
 * User Model
 * Defines the User schema and interface for the MongoDB database
 * Stores basic user information and authentication details
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Available roles in the system
 * Student: Hostel residents who can apply and file complaints
 * Warden: Hostel administrator with full management permissions
 * Sub-Warden: Assistant to warden with limited management permissions
 * AR: Attendance Register - records attendance and leaves
 * Marshal: Oversees discipline and conduct
 * Maintenance Supervisor: Manages maintenance issues
 * Cleaning Supervisor: Manages cleaning tasks and schedules
 * Canteen: Manages canteen menu and orders
 */
export const roles = [
  'Student',
  'Warden',
  'Sub-Warden',
  'AR',
  'Marshal',
  'Maintenance Supervisor',
  'Cleaning Supervisor',
  'Canteen',
] as const;

// TypeScript type for role validation
export type Role = (typeof roles)[number];

/**
 * User document interface
 * Defines the structure of user data in MongoDB
 */
export interface UserDocument {
  email: string;                     // User email (unique identifier)
  name: string;                      // User's full name
  role: Role;                        // User's role in the system
  passwordHash: string;              // Hashed password for authentication
  createdAt: Date;                   // Account creation timestamp
  updatedAt: Date;                   // Last update timestamp
}

/**
 * MongoDB Schema for User collection
 * Defines field types, validations, and constraints
 */
const userSchema = new Schema<UserDocument>(
  {
    // Email field: unique, required, stored in lowercase for consistency
    email: { type: String, required: true, unique: true, lowercase: true },
    // Name field: required
    name: { type: String, required: true },
    // Role field: must be one of the predefined roles
    role: { type: String, enum: roles, required: true },
    // Password hash: required for authentication
    passwordHash: { type: String, required: true },
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create and export User model for database operations
export const User = mongoose.model<UserDocument>('User', userSchema);
