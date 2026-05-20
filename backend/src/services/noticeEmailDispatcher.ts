import { User } from '../models/User.js';
import { StudentApplication } from '../models/StudentApplication.js';
import { emailService } from './emailService.js';
import { gmailOAuthService } from './gmailOAuthService.js';

function getEmailService() {
  return process.env.GMAIL_OAUTH_ENABLED === 'true' ? gmailOAuthService : emailService;
}

export async function dispatchNoticeEmails(
  noticeId: string,
  title: string,
  content: string,
  audience: string,
  targetBlock: string | null | undefined,
  publishedDate: Date
) {
  // We run this asynchronously so it doesn't block the request response
  setImmediate(async () => {
    try {
      let usersToEmail: { name: string; email: string }[] = [];

      if (audience === 'All') {
        // Find everyone
        const allUsers = await User.find({}).select('name email');
        usersToEmail = allUsers.map(u => ({ name: u.name, email: u.email }));
      } else if (audience === 'Student') {
        if (!targetBlock) {
          // All students
          const students = await User.find({ role: 'Student' }).select('name email');
          usersToEmail = students.map(u => ({ name: u.name, email: u.email }));
        } else {
          // Specific block
          const apps = await StudentApplication.find({
            status: 'finalized',
            assignedBlock: targetBlock,
          }).populate('user', 'name email');

          usersToEmail = apps
            .filter((app: any) => app.user && app.user.email)
            .map((app: any) => ({
              name: app.user.name,
              email: app.user.email,
            }));
        }
      }

      const mailService = getEmailService();
      
      // Dispatch emails
      for (const recipient of usersToEmail) {
        try {
          await mailService.sendNoticeEmail({
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            noticeTitle: title,
            noticeContent: content,
            noticeId: noticeId,
            publishedDate: publishedDate,
          });
        } catch (error) {
          console.error(`Failed to send notice email to ${recipient.email}:`, error);
        }
      }
    } catch (error) {
      console.error('Error dispatching notice emails:', error);
    }
  });
}
