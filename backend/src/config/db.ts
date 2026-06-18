/**
 * Database Configuration and Connection
 * Establishes connection to MongoDB and ensures the correct database is selected
 */

import mongoose from 'mongoose';

/**
 * Connects to MongoDB database
 * Ensures the connection URL includes the 'hostal' database name
 * Throws error if MONGO_URI is not configured
 * @throws {Error} If MONGO_URI environment variable is not set
 */
export async function connectDb(): Promise<void> {
  // Get MongoDB connection URI from environment variables
  let uri = process.env.MONGO_URI;
  
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  // Ensure the hostal database is specified in the URI
  // This prevents connecting to the wrong database
  if (!uri.includes('/hostal')) {
    uri = uri.replace(/\/$/, '') + '/hostal';
  }

  // Establish connection to MongoDB
  await mongoose.connect(uri);
  console.log('MongoDB connected to hostal database');
}
