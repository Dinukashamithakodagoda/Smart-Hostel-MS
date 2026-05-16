import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const usersRouter = express.Router();

usersRouter.get('/', requireAuth, requireRole(['Warden', 'Sub-Warden', 'AR']), async (_req: Request, res: Response) => {
  const users = await User.find().select('-passwordHash');
  return res.json({ users });
});

usersRouter.get('/role/:role', requireAuth, requireRole(['Warden', 'Sub-Warden', 'AR']), async (req: Request, res: Response) => {
  const { role } = req.params;
  const { search } = req.query as { search?: string };

  let query: any = { role };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).select('-passwordHash').sort({ name: 1 });
  return res.json({ users });
});
