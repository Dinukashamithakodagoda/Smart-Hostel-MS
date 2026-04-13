import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const defaultPassword = process.env.DEFAULT_STAFF_PASSWORD || 'Hostel@123';

const staffUsers = [
  { email: 'warden@gmail.com', name: 'Warden', role: 'Warden' },
  { email: 'subwarden@gmail.com', name: 'Sub Warden', role: 'Sub-Warden' },
  { email: 'ar@gmail.com', name: 'Assistant Registrar', role: 'AR' },
  { email: 'marshal@gmail.com', name: 'Marshal', role: 'Marshal' },
  { email: 'maintenance@gmail.com', name: 'Maintenance Supervisor', role: 'Maintenance Supervisor' },
  { email: 'cleaning@gmail.com', name: 'Cleaning Supervisor', role: 'Cleaning Supervisor' },
  { email: 'canteen@gmail.com', name: 'Canteen Manager', role: 'Canteen' },
] as const;

export async function seedDefaultStaffUsers(): Promise<void> {
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await User.deleteMany({ role: { $ne: 'Student' } });
  await User.insertMany(
    staffUsers.map((user) => ({
      ...user,
      passwordHash,
    }))
  );

  console.log('Default staff accounts created');
}
