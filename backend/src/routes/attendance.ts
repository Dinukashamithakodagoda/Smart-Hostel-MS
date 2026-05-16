import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { StudentApplication } from '../models/StudentApplication.js';

export const attendanceRouter = express.Router();

const blocks = [
  { id: 'A', name: 'Block A (Female)' },
  { id: 'B', name: 'Block B (Female)' },
  { id: 'C', name: 'Block C (Male)' },
  { id: 'D', name: 'Block D (Male)' },
  { id: 'E', name: 'Block E (Female)' },
];

attendanceRouter.get('/blocks', requireAuth, requireRole(['Sub-Warden']), async (_req: Request, res: Response) => {
  return res.json({ blocks });
});

attendanceRouter.get(
  '/blocks/:block/roster',
  requireAuth,
  requireRole(['Sub-Warden']),
  async (req: Request, res: Response) => {
    const block = req.params.block;
    const students = await StudentApplication.find({ assignedBlock: block })
      .select('fullName studentId assignedRoom')
      .lean();

    const roster = students
      .filter((s) => s.assignedRoom)
      .map((student) => ({
        id: student.studentId,
        name: student.fullName,
        room: student.assignedRoom,
      }))
      .sort((a, b) => (a.room || '').localeCompare(b.room || ''));

    return res.json({ roster });
  }
);

attendanceRouter.get('/records', requireAuth, requireRole(['Sub-Warden']), async (req: Request, res: Response) => {
  const { block, date } = req.query as { block?: string; date?: string };
  if (!block || !date) {
    return res.status(400).json({ message: 'Missing block or date' });
  }

  const record = await AttendanceRecord.findOne({ block, date }).lean();
  return res.json({ record });
});

attendanceRouter.post(
  '/records',
  requireAuth,
  requireRole(['Sub-Warden']),
  async (req: AuthedRequest, res: Response) => {
    const { block, date, entries } = req.body as {
      block?: string;
      date?: string;
      entries?: Array<{ studentId: string; name: string; room: string; present: boolean }>;
    };

    if (!block || !date || !entries) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const record = await AttendanceRecord.findOneAndUpdate(
      { block, date },
      { block, date, entries, createdBy: req.user?.id },
      { new: true, upsert: true }
    );

    return res.json({ record });
  }
);

attendanceRouter.get(
  '/my-attendance',
  requireAuth,
  requireRole(['Student']),
  async (req: AuthedRequest, res: Response) => {
    try {
      // Find student application to get studentId
      const application = await StudentApplication.findOne({ userId: req.user?.id });
      if (!application) {
        return res.status(400).json({ message: 'Student application not found' });
      }

      const studentId = application.studentId;
      const records = await AttendanceRecord.find({})
        .select('date block entries')
        .lean();

      const studentRecords = records
        .map((record) => {
          const entry = record.entries.find((e: any) => e.studentId === studentId);
          if (!entry) return null;
          return {
            date: record.date,
            block: record.block,
            present: entry.present,
            name: entry.name,
            room: entry.room,
          };
        })
        .filter((r) => r !== null)
        .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());

      const totalRecords = studentRecords.length;
      const presentCount = studentRecords.filter((r: any) => r.present).length;
      const absentCount = totalRecords - presentCount;
      const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      return res.json({
        attendance: studentRecords,
        statistics: {
          total: totalRecords,
          present: presentCount,
          absent: absentCount,
          percentage: attendancePercentage.toFixed(2),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load attendance';
      return res.status(500).json({ message });
    }
  }
);
