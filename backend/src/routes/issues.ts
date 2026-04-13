import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { CriticalIssue } from '../models/CriticalIssue.js';

export const issuesRouter = express.Router();

issuesRouter.get('/', requireAuth, requireRole(['Warden']), async (_req: Request, res: Response) => {
  const issues = await CriticalIssue.find().sort({ createdAt: -1 });
  return res.json({ issues });
});

issuesRouter.post(
  '/',
  requireAuth,
  requireRole(['Marshal', 'Maintenance Supervisor', 'Sub-Warden', 'Warden']),
  async (req: AuthedRequest, res: Response) => {
    const { title, description, priority } = req.body as {
      title?: string;
      description?: string;
      priority?: 'High' | 'Critical';
    };

    if (!title || !description) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const issue = await CriticalIssue.create({
      title,
      description,
      priority: priority || 'High',
      reportedByRole: req.user?.role || 'Staff',
      createdBy: req.user?.id,
    });

    return res.status(201).json({ issue });
  }
);

issuesRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole(['Warden']),
  async (req: Request, res: Response) => {
    const { status } = req.body as { status?: 'Pending' | 'Reviewed' | 'Resolved' };
    if (!status) {
      return res.status(400).json({ message: 'Missing status' });
    }

    const issue = await CriticalIssue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    return res.json({ issue });
  }
);
