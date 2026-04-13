import mongoose, { Schema } from 'mongoose';

export type ApplicationStatus =
  | 'pending_warden'
  | 'approved_warden'
  | 'rejected_warden'
  | 'finalized';

export interface StudentApplicationDocument {
  user: mongoose.Types.ObjectId;
  fullName: string;
  studentId: string;
  nic: string;
  gender: 'male' | 'female';
  faculty: string;
  year: string;
  address: string;
  distance: number;
  contactNumber: string;
  email: string;
  assignedBlock?: string;
  assignedRoom?: string;
  status: ApplicationStatus;
  wardenApprovedBy?: mongoose.Types.ObjectId;
  wardenApprovedAt?: Date;
  arFinalizedBy?: mongoose.Types.ObjectId;
  arFinalizedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<StudentApplicationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    studentId: { type: String, required: true },
    nic: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    faculty: { type: String, required: true },
    year: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    assignedBlock: { type: String },
    assignedRoom: { type: String },
    status: {
      type: String,
      enum: ['pending_warden', 'approved_warden', 'rejected_warden', 'finalized'],
      default: 'pending_warden',
    },
    wardenApprovedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    wardenApprovedAt: { type: Date },
    arFinalizedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    arFinalizedAt: { type: Date },
  },
  { timestamps: true }
);

export const StudentApplication = mongoose.model<StudentApplicationDocument>(
  'StudentApplication',
  applicationSchema
);
