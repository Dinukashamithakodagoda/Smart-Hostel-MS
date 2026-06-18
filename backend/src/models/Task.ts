/**
 * Task Model
 * Represents maintenance and cleaning tasks assigned to staff members
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Task Document Interface
 * Tracks tasks for maintenance and cleaning operations
 */
export interface TaskDocument {
  title: string;                         // Task title/name
  description: string;                   // Detailed task description
  category: 'maintenance' | 'cleaning';  // Task category
  status: 'open' | 'in_progress' | 'done'; // Task status
  createdBy: mongoose.Types.ObjectId;    // Reference to User who created task
  assignedTo?: mongoose.Types.ObjectId;  // Reference to User assigned to task
  createdAt: Date;                       // Task creation timestamp
  updatedAt: Date;                       // Last update timestamp
}

/**
 * MongoDB Schema for Tasks
 */
const taskSchema = new Schema<TaskDocument>(
  {
    // Task title
    title: { type: String, required: true },
    // Detailed description of what needs to be done
    description: { type: String, required: true },
    // Category for organizing tasks
    category: { type: String, enum: ['maintenance', 'cleaning'], required: true },
    // Status progression: open -> in_progress -> done
    status: { type: String, enum: ['open', 'in_progress', 'done'], default: 'open' },
    // User who created/assigned the task
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // User assigned to complete the task
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
