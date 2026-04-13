import mongoose, { Schema } from 'mongoose';

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

export type Role = (typeof roles)[number];

export interface UserDocument {
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', userSchema);
