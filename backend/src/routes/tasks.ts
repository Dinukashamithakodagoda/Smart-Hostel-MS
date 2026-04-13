import express, { type Request, type Response } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { Task } from '../models/Task.js';

export const tasksRouter = express.Router();

tasksRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return res.json({ tasks });
});

tasksRouter.post('/', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { title, description, category } = req.body as {
    title?: string;
    description?: string;
    category?: 'maintenance' | 'cleaning';
  };

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const task = await Task.create({
    title,
    description,
    category,
    createdBy: req.user?.id,
  });

  return res.status(201).json({ task });
});
