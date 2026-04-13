import mongoose, { Schema } from 'mongoose';

export interface TaskDocument {
  title: string;
  description: string;
  category: 'maintenance' | 'cleaning';
  status: 'open' | 'in_progress' | 'done';
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['maintenance', 'cleaning'], required: true },
    status: { type: String, enum: ['open', 'in_progress', 'done'], default: 'open' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
