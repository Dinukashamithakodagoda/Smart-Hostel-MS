import mongoose, { Schema } from 'mongoose';

export interface ComplaintDocument {
  title: string;
  description: string;
  category: 'Maintenance' | 'Cleaning' | 'Canteen' | 'Furniture' | 'Security' | 'Other';
  status: 'pending' | 'in_progress' | 'resolved';
  createdBy: mongoose.Types.ObjectId;
  submittedByRole?: string;
  submittedByName?: string;
  assignedRole?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<ComplaintDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Maintenance', 'Cleaning', 'Canteen', 'Furniture', 'Security', 'Other'],
      required: true,
    },
    status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submittedByRole: { type: String },
    submittedByName: { type: String },
    assignedRole: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<ComplaintDocument>('Complaint', complaintSchema);
