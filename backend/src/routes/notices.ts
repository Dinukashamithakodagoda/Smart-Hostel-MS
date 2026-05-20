import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { Notice } from '../models/Notice.js';
import { StudentApplication } from '../models/StudentApplication.js';
import { dispatchNoticeEmails } from '../services/noticeEmailDispatcher.js';

export const noticesRouter = express.Router();

const staffRoles = ['Warden', 'Sub-Warden', 'AR'] as const;

noticesRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response) => {
  const application = await StudentApplication.findOne({ user: req.user?.id })
    .select('assignedBlock')
    .lean();
  const assignedBlock = application?.assignedBlock;

  const blockFilter = assignedBlock
    ? {
        $or: [
          { targetBlock: { $exists: false } },
          { targetBlock: null },
          { targetBlock: '' },
          { targetBlock: assignedBlock },
        ],
      }
    : {
        $or: [{ targetBlock: { $exists: false } }, { targetBlock: null }, { targetBlock: '' }],
      };

  const notices = await Notice.find({ audience: { $in: ['Student', 'All'] }, ...blockFilter })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email role');
  return res.json({ notices });
});

noticesRouter.get('/all', requireAuth, requireRole([...staffRoles]), async (_req: Request, res: Response) => {
  const notices = await Notice.find().sort({ createdAt: -1 }).populate('createdBy', 'name email role');
  return res.json({ notices });
});

noticesRouter.post(
  '/',
  requireAuth,
  requireRole([...staffRoles]),
  async (req: AuthedRequest, res: Response) => {
    const { title, content, audience, targetBlock } = req.body as {
      title?: string;
      content?: string;
      audience?: 'Student' | 'All';
      targetBlock?: string | null;
    };

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const notice = await Notice.create({
      title,
      content,
      audience: audience || 'Student',
      targetBlock: targetBlock || undefined,
      createdBy: req.user?.id,
    });

    const hydrated = await Notice.findById(notice._id).populate('createdBy', 'name email role');
    
    dispatchNoticeEmails(
      notice._id.toString(),
      notice.title,
      notice.content,
      notice.audience,
      notice.targetBlock,
      notice.createdAt
    );

    return res.status(201).json({ notice: hydrated });
  }
);

noticesRouter.patch(
  '/:id',
  requireAuth,
  requireRole([...staffRoles]),
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const { title, content, audience, targetBlock } = req.body as {
      title?: string;
      content?: string;
      audience?: 'Student' | 'All';
      targetBlock?: string | null;
    };

    if (!title && !content && !audience && targetBlock === undefined) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const updates: Partial<{ title: string; content: string; audience: 'Student' | 'All'; targetBlock: string | null }> = {};
    if (title) {
      updates.title = title;
    }
    if (content) {
      updates.content = content;
    }
    if (audience) {
      updates.audience = audience;
    }
    if (targetBlock !== undefined) {
      updates.targetBlock = targetBlock;
    }

    const notice = await Notice.findByIdAndUpdate(id, updates, { new: true }).populate('createdBy', 'name email role');
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    return res.json({ notice });
  }
);

noticesRouter.delete(
  '/:id',
  requireAuth,
  requireRole([...staffRoles]),
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    return res.json({ message: 'Notice deleted' });
  }
);
