import { createTransporter } from '../config/email.js';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ComplaintEmailData {
  studentName: string;
  studentEmail: string;
  complaintTitle: string;
  complaintDescription: string;
  complaintCategory: string;
  complaintId: string;
  submittedDate: Date;
}

export interface TaskEmailData {
  assigneeName: string;
  assigneeEmail: string;
  taskTitle: string;
  taskDescription: string;
  taskId: string;
  dueDate: Date;
}

export interface NoticeEmailData {
  recipientName: string;
  recipientEmail: string;
  noticeTitle: string;
  noticeContent: string;
  noticeId: string;
  publishedDate: Date;
}

export interface OrderEmailData {
  studentName: string;
  studentEmail: string;
  orderItems: { itemName: string; quantity: number }[];
  orderId: string;
  estimatedReadyTime: Date;
}

class EmailService {
  async sendComplaintConfirmation(data: ComplaintEmailData): Promise<void> {
    const transporter = createTransporter();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px;">Complaint Received</h2>
        
        <p style="color: #666; font-size: 16px;">Dear <strong>${data.studentName}</strong>,</p>
        
        <p style="color: #666; font-size: 14px;">Thank you for submitting your complaint to the Smart Hostel Management System. We have received your complaint and will work on resolving it promptly.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Complaint Details:</h3>
          <p style="margin: 8px 0;"><strong>Title:</strong> ${data.complaintTitle}</p>
          <p style="margin: 8px 0;"><strong>Category:</strong> ${data.complaintCategory}</p>
          <p style="margin: 8px 0;"><strong>Description:</strong> ${data.complaintDescription}</p>
          <p style="margin: 8px 0;"><strong>Complaint ID:</strong> <code style="background-color: #e0e0e0; padding: 2px 6px;">${data.complaintId}</code></p>
          <p style="margin: 8px 0;"><strong>Submitted Date:</strong> ${new Date(data.submittedDate).toLocaleString()}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">Your complaint has been assigned to the relevant department. You will receive updates as your complaint is processed. Please check your email regularly for status updates.</p>
        
        <p style="color: #666; font-size: 14px;">If you have any additional information or questions regarding your complaint, please feel free to reach out to us.</p>
        
        <p style="color: #666; font-size: 14px;">Best regards,<br><strong>Smart Hostel Management System</strong></p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `;

    const options: EmailOptions = {
      to: data.studentEmail,
      subject: `Complaint Received - ${data.complaintTitle}`,
      html,
      text: `Your complaint "${data.complaintTitle}" has been received and is being processed.`,
    };

    await this.sendEmail(options);
  }

  async sendComplaintStatusUpdate(data: ComplaintEmailData & { status: string; wardenName?: string }): Promise<void> {
    const transporter = createTransporter();

    const statusMessages: Record<string, string> = {
      in_progress: 'Your complaint is now being investigated and worked on.',
      resolved: 'Your complaint has been resolved. Thank you for bringing this matter to our attention.',
      pending: 'Your complaint is pending review.',
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 3px solid #2196F3; padding-bottom: 10px;">Complaint Status Update</h2>
        
        <p style="color: #666; font-size: 16px;">Dear <strong>${data.studentName}</strong>,</p>
        
        <p style="color: #666; font-size: 14px;">${statusMessages[data.status] || 'Your complaint status has been updated.'}</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Updated Complaint Details:</h3>
          <p style="margin: 8px 0;"><strong>Title:</strong> ${data.complaintTitle}</p>
          <p style="margin: 8px 0;"><strong>Current Status:</strong> <span style="background-color: #2196F3; color: white; padding: 3px 8px; border-radius: 3px;">${data.status.toUpperCase()}</span></p>
          <p style="margin: 8px 0;"><strong>Complaint ID:</strong> <code style="background-color: #e0e0e0; padding: 2px 6px;">${data.complaintId}</code></p>
          ${data.wardenName ? `<p style="margin: 8px 0;"><strong>Assigned To:</strong> ${data.wardenName}</p>` : ''}
        </div>
        
        <p style="color: #666; font-size: 14px;">We appreciate your patience and will continue to update you on the progress.</p>
        
        <p style="color: #666; font-size: 14px;">Best regards,<br><strong>Smart Hostel Management System</strong></p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `;

    const options: EmailOptions = {
      to: data.studentEmail,
      subject: `Complaint Status Update - ${data.complaintTitle}`,
      html,
      text: `Your complaint "${data.complaintTitle}" status has been updated to ${data.status}.`,
    };

    await this.sendEmail(options);
  }

  async sendTaskAssignmentEmail(data: TaskEmailData): Promise<void> {
    const transporter = createTransporter();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 3px solid #FF9800; padding-bottom: 10px;">New Task Assigned</h2>
        
        <p style="color: #666; font-size: 16px;">Dear <strong>${data.assigneeName}</strong>,</p>
        
        <p style="color: #666; font-size: 14px;">A new task has been assigned to you in the Smart Hostel Management System.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Task Details:</h3>
          <p style="margin: 8px 0;"><strong>Title:</strong> ${data.taskTitle}</p>
          <p style="margin: 8px 0;"><strong>Description:</strong> ${data.taskDescription}</p>
          <p style="margin: 8px 0;"><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleString()}</p>
          <p style="margin: 8px 0;"><strong>Task ID:</strong> <code style="background-color: #e0e0e0; padding: 2px 6px;">${data.taskId}</code></p>
        </div>
        
        <p style="color: #666; font-size: 14px;">Please log into the system to view more details and mark the task as complete once finished.</p>
        
        <p style="color: #666; font-size: 14px;">Best regards,<br><strong>Smart Hostel Management System</strong></p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `;

    const options: EmailOptions = {
      to: data.assigneeEmail,
      subject: `Task Assigned - ${data.taskTitle}`,
      html,
      text: `You have been assigned a new task: ${data.taskTitle}. Due date: ${new Date(data.dueDate).toLocaleString()}`,
    };

    await this.sendEmail(options);
  }

  async sendNoticeEmail(data: NoticeEmailData): Promise<void> {
    const transporter = createTransporter();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 3px solid #9C27B0; padding-bottom: 10px;">New Notice</h2>
        
        <p style="color: #666; font-size: 16px;">Dear <strong>${data.recipientName}</strong>,</p>
        
        <p style="color: #666; font-size: 14px;">An important notice has been posted on the Smart Hostel Management System.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">${data.noticeTitle}</h3>
          <p style="color: #666; line-height: 1.6;">${data.noticeContent}</p>
          <p style="margin: 8px 0;"><strong>Published Date:</strong> ${new Date(data.publishedDate).toLocaleString()}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">Please log into the system to view the full details and any attachments.</p>
        
        <p style="color: #666; font-size: 14px;">Best regards,<br><strong>Smart Hostel Management System</strong></p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `;

    const options: EmailOptions = {
      to: data.recipientEmail,
      subject: `Notice - ${data.noticeTitle}`,
      html,
      text: `New notice: ${data.noticeTitle}`,
    };

    await this.sendEmail(options);
  }

  async sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
    const transporter = createTransporter();

    const itemsList = data.orderItems.map((item) => `<li>${item.itemName} (Qty: ${item.quantity})</li>`).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px;">Order Confirmation</h2>
        
        <p style="color: #666; font-size: 16px;">Dear <strong>${data.studentName}</strong>,</p>
        
        <p style="color: #666; font-size: 14px;">Your order from the hostel canteen has been confirmed!</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Items:</h3>
          <ul style="color: #666;">${itemsList}</ul>
          <p style="margin: 8px 0;"><strong>Order ID:</strong> <code style="background-color: #e0e0e0; padding: 2px 6px;">${data.orderId}</code></p>
          <p style="margin: 8px 0;"><strong>Estimated Ready Time:</strong> ${new Date(data.estimatedReadyTime).toLocaleString()}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">Your order will be ready at the specified time. Please collect it from the canteen.</p>
        
        <p style="color: #666; font-size: 14px;">Best regards,<br><strong>Smart Hostel Management System</strong></p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `;

    const options: EmailOptions = {
      to: data.studentEmail,
      subject: `Order Confirmed - Order ID: ${data.orderId}`,
      html,
      text: `Your canteen order has been confirmed. Order ID: ${data.orderId}. Estimated ready time: ${new Date(data.estimatedReadyTime).toLocaleString()}`,
    };

    await this.sendEmail(options);
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: options.to ? undefined : process.env.EMAIL_FROM || 'noreply@smarthost.com',
        ...options,
      });
      console.log(`Email sent to ${options.to}`);
    } catch (error) {
      console.error(`Error sending email to ${options.to}:`, error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const transporter = createTransporter();
      await transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
