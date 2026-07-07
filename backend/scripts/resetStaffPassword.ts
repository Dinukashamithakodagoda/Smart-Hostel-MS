#!/usr/bin/env node
import dotenv from 'dotenv';
import process from 'node:process';
import { connectDb } from '../src/config/db.js';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.js';

dotenv.config();

async function resetPasswords() {
  const pwArg = process.argv[2];
  const password = pwArg || process.env.DEFAULT_STAFF_PASSWORD;

  if (!password) {
    console.error('Please provide a password as the first argument or set DEFAULT_STAFF_PASSWORD in the environment');
    process.exit(1);
  }

  try {
    await connectDb();
    console.log('Connected to DB — updating staff passwords...');

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.updateMany(
      { role: { $ne: 'Student' } },
      { $set: { passwordHash } }
    );

    console.log(`Matched ${result.matchedCount} staff users, modified ${result.modifiedCount}`);
    console.log('✅ Staff passwords updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update staff passwords:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

resetPasswords();
