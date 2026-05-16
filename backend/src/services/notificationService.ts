import mongoose from 'mongoose';
import { Notification, type NotificationDocument, type NotificationType } from '../models/Notification.js';
import { User } from '../models/User.js';

export interface CreateNotificationOptions {
  userId: string | mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string;
  relatedItemType?: 'complaint' | 'task' | 'order' | 'notice' | 'attendance';
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  complaintUpdates: boolean;
  taskAssignments: boolean;
  noticePublished: boolean;
  orderUpdates: boolean;
  systemAlerts: boolean;
}

class NotificationService {
  async createNotification(options: CreateNotificationOptions): Promise<NotificationDocument> {
    try {
      const notification = new Notification({
        userId: options.userId,
        type: options.type,
        title: options.title,
        message: options.message,
        relatedItemId: options.relatedItemId,
        relatedItemType: options.relatedItemType,
        metadata: options.metadata,
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string | mongoose.Types.ObjectId, limit = 50, skip = 0) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Notification.countDocuments({ userId });

      return {
        notifications,
        total,
        unreadCount: await Notification.countDocuments({ userId, read: false }),
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string | mongoose.Types.ObjectId): Promise<NotificationDocument | null> {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string | mongoose.Types.ObjectId): Promise<void> {
    try {
      await Notification.updateMany({ userId, read: false }, { read: true });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string | mongoose.Types.ObjectId): Promise<void> {
    try {
      await Notification.findByIdAndDelete(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async clearAllNotifications(userId: string | mongoose.Types.ObjectId): Promise<void> {
    try {
      await Notification.deleteMany({ userId });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string | mongoose.Types.ObjectId): Promise<number> {
    try {
      return await Notification.countDocuments({ userId, read: false });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async notifyUsers(
    userIds: (string | mongoose.Types.ObjectId)[],
    options: Omit<CreateNotificationOptions, 'userId'>
  ): Promise<NotificationDocument[]> {
    try {
      const notifications = await Promise.all(
        userIds.map((userId) =>
          this.createNotification({
            ...options,
            userId,
          })
        )
      );
      return notifications;
    } catch (error) {
      console.error('Error notifying multiple users:', error);
      throw error;
    }
  }

  async getUsersByRole(role: string): Promise<(string | mongoose.Types.ObjectId)[]> {
    try {
      const users = await User.find({ role }).select('_id').lean();
      return users.map((user) => user._id);
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }

  async notifyRoleUsers(
    role: string,
    options: Omit<CreateNotificationOptions, 'userId'>
  ): Promise<NotificationDocument[]> {
    try {
      const userIds = await this.getUsersByRole(role);
      return this.notifyUsers(userIds, options);
    } catch (error) {
      console.error('Error notifying role users:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
