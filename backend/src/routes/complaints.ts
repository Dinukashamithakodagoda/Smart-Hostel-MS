import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';
import { emailService } from '../services/emailService.js';
import { gmailOAuthService } from '../services/gmailOAuthService.js';
import { notificationService } from '../services/notificationService.js';

export const complaintRouter = express.Router();

const categoryRoleMap: Record<string, string> = {
  Maintenance: 'Maintenance Supervisor',
  Cleaning: 'Cleaning Supervisor',
  Canteen: 'Canteen',
};

const forwardedRoleMap: Record<string, string> = {
  Maintenance: 'Maintenance Supervisor',
  Cleaning: 'Cleaning Supervisor',
  Canteen: 'Canteen',
};

// Helper to get the appropriate email service
function getEmailService() {
  return process.env.GMAIL_OAUTH_ENABLED === 'true' ? gmailOAuthService : emailService;
}

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

    // Get the current user for email
    const currentUser = await User.findById(req.user?.id);

    // Send confirmation email to the student
    if (currentUser && currentUser.email) {
      try {
        const mailService = getEmailService();
        await mailService.sendComplaintConfirmation({
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          complaintTitle: title,
          complaintDescription: description,
          complaintCategory: category,
          complaintId: complaint._id.toString(),
          submittedDate: complaint.createdAt,
        });
      } catch (emailError) {
        console.error('Error sending complaint confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Create in-app notification for the student
    try {
      await notificationService.createNotification({
        userId: req.user!.id,
        type: 'complaint_submitted',
        title: 'Complaint Submitted',
        message: `Your complaint "${title}" has been received and is being processed.`,
        relatedItemId: complaint._id.toString(),
        relatedItemType: 'complaint',
        metadata: {
          complaintId: complaint._id,
          category,
        },
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    // Notify assigned role users
    try {
      const assignedUsers = await notificationService.getUsersByRole(assignedRole);
      await notificationService.notifyUsers(assignedUsers, {
        type: 'complaint_submitted',
        title: 'New Complaint Assigned',
        message: `A new ${category} complaint "${title}" has been assigned to you.`,
        relatedItemId: complaint._id.toString(),
        relatedItemType: 'complaint',
        metadata: {
          complaintId: complaint._id,
          category,
          submittedBy: currentUser?.name,
        },
      });
    } catch (notificationError) {
      console.error('Error notifying assigned role:', notificationError);
    }

    // Emit real-time notification via Socket.io
    const io = req.app?.get('io');
    if (io) {
      io.emit('complaint:new', {
        id: complaint._id,
        title,
        category,
        status: complaint.status,
        assignedRole,
      });
    }

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

    const shouldForwardToTeam =
      status === 'in_progress' &&
      complaint.assignedRole === 'Warden' &&
      Boolean(forwardedRoleMap[complaint.category]);

    const forwardedRole = shouldForwardToTeam ? forwardedRoleMap[complaint.category] : undefined;

    complaint.status = status;
    if (forwardedRole) {
      complaint.assignedRole = forwardedRole;
    }
    await complaint.save();

    // Get the student who submitted the complaint and the warden who updated it
    const student = await User.findById(complaint.createdBy);
    const warden = await User.findById(req.user?.id);

    // Send status update email to the student
    if (student && student.email) {
      try {
        const mailService = getEmailService();
        await mailService.sendComplaintStatusUpdate({
          studentName: student.name,
          studentEmail: student.email,
          complaintTitle: complaint.title,
          complaintDescription: complaint.description,
          complaintCategory: complaint.category,
          complaintId: complaint._id.toString(),
          submittedDate: complaint.createdAt,
          status,
          wardenName: warden?.name,
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
      }
    }

    // Create notification for the student
    try {
      await notificationService.createNotification({
        userId: complaint.createdBy,
        type: 'complaint_status_update',
        title: 'Complaint Status Updated',
        message: `Your complaint "${complaint.title}" status has been updated to ${status}.`,
        relatedItemId: complaint._id.toString(),
        relatedItemType: 'complaint',
        metadata: {
          complaintId: complaint._id,
          newStatus: status,
          updatedBy: warden?.name,
        },
      });
    } catch (notificationError) {
      console.error('Error creating status update notification:', notificationError);
    }

    if (forwardedRole) {
      try {
        await notificationService.notifyRoleUsers(forwardedRole, {
          type: 'complaint_status_update',
          title: 'New Complaint Assigned',
          message: `A ${complaint.category.toLowerCase()} complaint "${complaint.title}" has been forwarded to you.`,
          relatedItemId: complaint._id.toString(),
          relatedItemType: 'complaint',
          metadata: {
            complaintId: complaint._id,
            category: complaint.category,
            forwardedBy: warden?.name,
            previousRole: 'Warden',
          },
        });
      } catch (notificationError) {
        console.error('Error notifying forwarded role:', notificationError);
      }
    }

    // Emit real-time notification via Socket.io
    const io = req.app?.get('io');
    if (io) {
      io.to(`user:${complaint.createdBy}`).emit('complaint:status-updated', {
        complaintId: complaint._id,
        newStatus: status,
        title: complaint.title,
      });

      if (forwardedRole) {
        io.emit('complaint:assigned', {
          complaintId: complaint._id,
          assignedRole: forwardedRole,
          title: complaint.title,
          category: complaint.category,
        });
      }
    }

    return res.json({ complaint });
  }
);
