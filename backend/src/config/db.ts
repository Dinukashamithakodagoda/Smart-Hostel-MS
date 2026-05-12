import mongoose from 'mongoose';

export async function connectDb(): Promise<void> {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  // Ensure the hostal database is specified in the URI
  if (!uri.includes('/hostal')) {
    uri = uri.replace(/\/$/, '') + '/hostal';
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected to hostal database');
}
