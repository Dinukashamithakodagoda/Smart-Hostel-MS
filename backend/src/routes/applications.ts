import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { StudentApplication } from '../models/StudentApplication.js';

export const applicationsRouter = express.Router();

const femaleBlocks = ['A', 'B', 'E'];
const maleBlocks = ['C', 'D'];

async function autoAssignRoom(gender: 'male' | 'female') {
  const blocks = gender === 'female' ? femaleBlocks : maleBlocks;
  const counts = await Promise.all(
    blocks.map(async (block) => ({
      block,
      count: await StudentApplication.countDocuments({ assignedBlock: block }),
    }))
  );

  counts.sort((a, b) => a.count - b.count);
  const target = counts[0];
  const roomNumber = 101 + target.count;
  const assignedRoom = `${target.block}-${roomNumber}`;

  return { assignedBlock: target.block, assignedRoom };
}

applicationsRouter.get('/me', requireAuth, async (req: AuthedRequest, res: Response) => {
  const application = await StudentApplication.findOne({ user: req.user?.id });
  return res.json({ application });
});

applicationsRouter.get('/me/roommates', requireAuth, async (req: AuthedRequest, res: Response) => {
  const application = await StudentApplication.findOne({ user: req.user?.id });
  if (!application || !application.assignedRoom) {
    return res.json({ room: null, roommates: [] });
  }

  const roommates = await StudentApplication.find({
    assignedRoom: application.assignedRoom,
    user: { $ne: application.user },
  })
    .select('fullName studentId email assignedRoom assignedBlock')
    .lean();

  return res.json({
    room: application.assignedRoom,
    roommates,
  });
});

applicationsRouter.get(
  '/pending',
  requireAuth,
  requireRole(['Warden', 'Sub-Warden']),
  async (_req: Request, res: Response) => {
    const applications = await StudentApplication.find({ status: 'pending_warden' })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ applications });
  }
);

applicationsRouter.get(
  '/approved',
  requireAuth,
  requireRole(['AR']),
  async (_req: Request, res: Response) => {
    const applications = await StudentApplication.find({ status: 'approved_warden' })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ applications });
  }
);

applicationsRouter.patch(
  '/:id/warden-override',
  requireAuth,
  requireRole(['Warden', 'Sub-Warden']),
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const { assignedBlock, assignedRoom } = req.body as {
      assignedBlock?: string;
      assignedRoom?: string;
    };

    if (!assignedBlock || !assignedRoom) {
      return res.status(400).json({ message: 'Block and room are required' });
    }

    const application = await StudentApplication.findByIdAndUpdate(
      id,
      { assignedBlock, assignedRoom },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.json({ application });
  }
);

applicationsRouter.patch(
  '/:id/warden-approve',
  requireAuth,
  requireRole(['Warden', 'Sub-Warden']),
  async (req: AuthedRequest, res: Response) => {
    const application = await StudentApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'approved_warden';
    application.wardenApprovedBy = req.user?.id as any;
    application.wardenApprovedAt = new Date();
    await application.save();

    return res.json({ application });
  }
);

applicationsRouter.patch(
  '/:id/warden-reject',
  requireAuth,
  requireRole(['Warden', 'Sub-Warden']),
  async (req: AuthedRequest, res: Response) => {
    const application = await StudentApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected_warden';
    application.wardenApprovedBy = req.user?.id as any;
    application.wardenApprovedAt = new Date();
    await application.save();

    return res.json({ application });
  }
);

applicationsRouter.patch(
  '/:id/ar-finalize',
  requireAuth,
  requireRole(['AR']),
  async (req: AuthedRequest, res: Response) => {
    const application = await StudentApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'finalized';
    application.arFinalizedBy = req.user?.id as any;
    application.arFinalizedAt = new Date();
    await application.save();

    return res.json({ application });
  }
);

export async function createApplicationForStudent(payload: {
  userId: string;
  fullName: string;
  studentId: string;
  nic: string;
  gender: 'male' | 'female';
  faculty: string;
  year: string;
  address: string;
  distance: number;
  contactNumber: string;
  email: string;
}) {
  const { assignedBlock, assignedRoom } = await autoAssignRoom(payload.gender);

  return StudentApplication.create({
    user: payload.userId,
    fullName: payload.fullName,
    studentId: payload.studentId,
    nic: payload.nic,
    gender: payload.gender,
    faculty: payload.faculty,
    year: payload.year,
    address: payload.address,
    distance: payload.distance,
    contactNumber: payload.contactNumber,
    email: payload.email,
    assignedBlock,
    assignedRoom,
    status: 'pending_warden',
  });
}
