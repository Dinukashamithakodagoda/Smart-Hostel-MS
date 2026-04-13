import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const usersRouter = express.Router();

usersRouter.get('/', requireAuth, requireRole(['Warden', 'Sub-Warden', 'AR']), async (_req: Request, res: Response) => {
  const users = await User.find().select('-passwordHash');
  return res.json({ users });
});
