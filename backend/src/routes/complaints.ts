import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { Complaint } from '../models/Complaint.js';

export const complaintRouter = express.Router();

const categoryRoleMap: Record<string, string> = {
  Maintenance: 'Maintenance Supervisor',
  Cleaning: 'Cleaning Supervisor',
  Canteen: 'Canteen',
};

complaintRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  return res.json({ complaints });
});

complaintRouter.get('/mine', requireAuth, async (req: AuthedRequest, res: Response) => {
  const complaints = await Complaint.find({ createdBy: req.user?.id }).sort({ createdAt: -1 });
  return res.json({ complaints });
});

complaintRouter.get('/assigned', requireAuth, async (req: AuthedRequest, res: Response) => {
  const role = req.user?.role;
  if (!role) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const complaints = await Complaint.find({ assignedRole: role }).sort({ createdAt: -1 });
  return res.json({ complaints });
});

complaintRouter.post(
  '/',
  requireAuth,
  requireRole(['Warden', 'Marshal', 'Student']),
  async (req: AuthedRequest, res: Response) => {
    const { title, description, category } = req.body as {
      title?: string;
      description?: string;
      category?: string;
    };

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const submitterRole = req.user?.role;
    const assignedRole = submitterRole === 'Student'
      ? 'Warden'
      : categoryRoleMap[category] || 'Warden';

    const complaint = await Complaint.create({
      title,
      description,
      category,
      createdBy: req.user?.id,
      submittedByRole: req.user?.role,
      submittedByName: req.user?.email,
      assignedRole,
    });

    return res.status(201).json({ complaint });
  }
);

complaintRouter.patch(
  '/:id/status',
  requireAuth,
  async (req: AuthedRequest, res: Response) => {
    const { status } = req.body as { status?: 'pending' | 'in_progress' | 'resolved' };
    if (!status) {
      return res.status(400).json({ message: 'Missing status' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedRole && complaint.assignedRole !== req.user?.role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    complaint.status = status;
    await complaint.save();

    return res.json({ complaint });
  }
);
