import express, { type Request, type Response } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { notificationService } from '../services/notificationService.js';

export const notificationsRouter = express.Router();

// Get all notifications for the current user
notificationsRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const result = await notificationService.getUserNotifications(req.user!.id, limit, skip);
    return res.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Get unread notification count
notificationsRouter.get('/unread/count', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.id);
    return res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return res.status(500).json({ message: 'Error fetching unread count' });
  }
});

// Mark a notification as read
notificationsRouter.patch('/:id/read', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Error marking notification as read' });
  }
});

// Mark all notifications as read
notificationsRouter.patch('/all/read', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    await notificationService.markAllAsRead(req.user!.id);
    return res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ message: 'Error marking all notifications as read' });
  }
});

// Delete a notification
notificationsRouter.delete('/:id', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    return res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Error deleting notification' });
  }
});

// Clear all notifications
notificationsRouter.delete('/', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    await notificationService.clearAllNotifications(req.user!.id);
    return res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return res.status(500).json({ message: 'Error clearing notifications' });
  }
});
