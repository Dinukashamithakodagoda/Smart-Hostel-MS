import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { StudentApplication } from '../models/StudentApplication.js';

export const wardenRouter = express.Router();

const blockCapacities: Record<string, number> = {
  A: 100,
  B: 100,
  C: 100,
  D: 100,
  E: 100,
};

wardenRouter.get('/stats', requireAuth, requireRole(['Warden']), async (_req: Request, res: Response) => {
  const totalCapacity = Object.values(blockCapacities).reduce((sum, value) => sum + value, 0);
  const allocatedCount = await StudentApplication.countDocuments({ assignedRoom: { $ne: null } });
  const availableRooms = Math.max(totalCapacity - allocatedCount, 0);

  return res.json({
    stats: {
      totalCapacity,
      allocatedCount,
      availableRooms,
    },
  });
});
