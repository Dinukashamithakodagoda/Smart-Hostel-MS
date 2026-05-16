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

export const app = express();

app.use(express.json());
app.use(morgan('dev'));
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const allowedOrigins = (process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : defaultOrigins
).filter(Boolean);
const allowAllOrigins = process.env.NODE_ENV !== 'production';

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

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/health/db', (_req: Request, res: Response) => {
  res.json({
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
  });
});

app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/canteen', canteenRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/warden', wardenRouter);
app.use('/api/notifications', notificationsRouter);
