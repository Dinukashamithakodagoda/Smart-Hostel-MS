/**
 * Express Application Setup
 * This file initializes the main Express app with middleware configurations,
 * CORS policies, and API route mounting for the Smart Hostel Management System
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { authRouter } from './routes/auth';
import { applicationsRouter } from './routes/applications';
import { canteenRouter } from './routes/canteen';
import { complaintRouter } from './routes/complaints';
import { attendanceRouter } from './routes/attendance';
import { issuesRouter } from './routes/issues';
import { noticesRouter } from './routes/notices';
import { tasksRouter } from './routes/tasks';
import { usersRouter } from './routes/users';
import { wardenRouter } from './routes/warden';
import { notificationsRouter } from './routes/notifications.js';

// Create and export the Express application
export const app = express();

// Middleware: Parse incoming JSON requests
app.use(express.json());

// Middleware: HTTP request logging using Morgan (logs requests in dev format)
app.use(morgan('dev'));

// CORS Configuration: Define allowed origins for cross-origin requests
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const allowedOrigins = (process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : defaultOrigins
).filter(Boolean);
const allowAllOrigins = process.env.NODE_ENV !== 'production';

// Setup CORS: Allow requests from specified origins with credentials
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowAllOrigins) {
        callback(null, true);
        return;
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Health Check Endpoint: Returns server status
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Database Health Check: Returns MongoDB connection status
app.get('/health/db', (_req: Request, res: Response) => {
  res.json({
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
  });
});

// API Routes: Mount all feature routers
// Authentication routes: register, login, logout
app.use('/api/auth', authRouter);
// Student application routes: submit and manage hostel applications
app.use('/api/applications', applicationsRouter);
// User management routes: get user info, update profile
app.use('/api/users', usersRouter);
// Complaint filing routes: create and manage complaints
app.use('/api/complaints', complaintRouter);
// Canteen management routes: view menu, place orders
app.use('/api/canteen', canteenRouter);
// Task assignment routes: create and track tasks
app.use('/api/tasks', tasksRouter);
// Attendance tracking routes: mark and view attendance
app.use('/api/attendance', attendanceRouter);
// Issue reporting routes: report maintenance/cleaning issues
app.use('/api/issues', issuesRouter);
// Notice management routes: create and distribute notices
app.use('/api/notices', noticesRouter);
// Warden-specific routes: manage hostel operations
app.use('/api/warden', wardenRouter);
// Notification routes: get user notifications
app.use('/api/notifications', notificationsRouter);
