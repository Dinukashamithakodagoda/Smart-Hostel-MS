import mongoose, { Schema } from 'mongoose';

export interface AttendanceEntry {
  studentId: string;
  name: string;
  room: string;
  present: boolean;
}

export interface AttendanceRecordDocument {
  date: string;
  block: string;
  entries: AttendanceEntry[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceEntrySchema = new Schema<AttendanceEntry>(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    room: { type: String, required: true },
    present: { type: Boolean, default: true },
  },
  { _id: false }
);

const attendanceRecordSchema = new Schema<AttendanceRecordDocument>(
  {
    date: { type: String, required: true },
    block: { type: String, required: true },
    entries: { type: [attendanceEntrySchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

attendanceRecordSchema.index({ date: 1, block: 1 }, { unique: true });

export const AttendanceRecord = mongoose.model<AttendanceRecordDocument>('AttendanceRecord', attendanceRecordSchema);
