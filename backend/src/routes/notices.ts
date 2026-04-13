import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { Notice } from '../models/Notice.js';

export const noticesRouter = express.Router();

noticesRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  const notices = await Notice.find({ audience: { $in: ['Student', 'All'] } }).sort({ createdAt: -1 });
  return res.json({ notices });
});

noticesRouter.post(
  '/',
  requireAuth,
  requireRole(['Warden', 'AR', 'Sub-Warden']),
  async (req: AuthedRequest, res: Response) => {
    const { title, content, audience } = req.body as {
      title?: string;
      content?: string;
      audience?: 'Student' | 'All';
    };

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const notice = await Notice.create({
      title,
      content,
      audience: audience || 'Student',
      createdBy: req.user?.id,
    });

    return res.status(201).json({ notice });
  }
);
