import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { promises as fs } from 'fs';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '../..');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const TOKEN_PATH = path.join(backendDir, 'token.json');
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH 
  ? path.resolve(process.env.GOOGLE_CREDENTIALS_PATH)
  : path.join(backendDir, 'credentials.json');

/**
 * Check if token exists without triggering auth flow
 */
async function hasExistingToken(): Promise<boolean> {
  try {
    await fs.access(TOKEN_PATH);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load or request authorization to call APIs.
 */
async function authorize() {
  try {
    // Try to load saved token
    await fs.access(TOKEN_PATH);
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    console.log('✅ Loaded existing OAuth token');
    return JSON.parse(content);
  } catch {
    // If no token exists, authenticate and save
    console.log('🔐 Starting OAuth authentication flow...');
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (auth.credentials) {
      await fs.writeFile(TOKEN_PATH, JSON.stringify(auth.credentials, null, 2));
      console.log('✅ OAuth token saved to token.json');
    }

    return auth.credentials;
  }
}

/**
 * Convert email to base64 RFC 2822 format for Gmail API
 */
function encodeEmail(email: string): string {
  return Buffer.from(email).toString('base64');
}

/**
 * Create RFC 2822 formatted email
 */
function createEmailMessage(
  to: string,
  subject: string,
  htmlBody: string,
  fromEmail?: string
): string {
  const from = fromEmail || process.env.EMAIL_FROM || 'noreply@smarthost.com';
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody,
  ];

  return encodeEmail(emailLines.join('\r\n'));
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class GmailOAuthService {
  private gmail: any = null;
  private isInitialized = false;
  private hasToken = false;

  async checkTokenStatus() {
    this.hasToken = await hasExistingToken();
    if (this.hasToken) {
      console.log('ℹ️  OAuth token found. Gmail OAuth ready.');
    } else {
      console.log('⚠️  OAuth token not found. Run `npm run oauth-setup` to complete authentication.');
    }
  }

  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      const credentials = await authorize();
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth/callback'
      );

      auth.setCredentials(credentials);
      this.gmail = google.gmail({ version: 'v1', auth });
      this.isInitialized = true;
      console.log('✅ Gmail OAuth service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gmail OAuth:', error);
      return false;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Auto-initialize if needed
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error('Gmail OAuth service not available');
        return false;
      }
    }

    if (!this.gmail) {
      console.error('Gmail service not initialized');
      return false;
    }

    try {
      const message = createEmailMessage(options.to, options.subject, options.html, options.from);

      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message,
        },
      });

      console.log(`✅ Email sent to ${options.to} (Message ID: ${result.data.id})`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending email to ${options.to}:`, error);
      return false;
    }
  }

  async sendComplaintConfirmation(data: {
    studentName: string;
    studentEmail: string;
    complaintTitle: string;
    complaintDescription: string;
    complaintCategory: string;
    complaintId: string;
    submittedDate: Date;
  }): Promise<boolean> {
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
        
        <p style="color: #666; font-size: 14px;">Your complaint has been assigned to the relevant department. You will receive updates as your complaint is processed.</p>
        
        <p style="color: #666; font-size: 14px;">Best regards,<br><strong>Smart Hostel Management System</strong></p>
      </div>
    `;

    return this.sendEmail({
      to: data.studentEmail,
      subject: `Complaint Received - ${data.complaintTitle}`,
      html,
    });
  }

  async sendComplaintStatusUpdate(data: {
    studentName: string;
    studentEmail: string;
    complaintTitle: string;
    complaintDescription: string;
    complaintCategory: string;
    complaintId: string;
    submittedDate: Date;
    status: string;
    wardenName?: string;
  }): Promise<boolean> {
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
      </div>
    `;

    return this.sendEmail({
      to: data.studentEmail,
      subject: `Complaint Status Update - ${data.complaintTitle}`,
      html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    // If not initialized, check if token exists
    if (!this.isInitialized) {
      return this.hasToken;
    }

    try {
      const profile = await this.gmail.users.getProfile({
        userId: 'me',
      });

      console.log(`✅ Gmail OAuth connection verified. Email: ${profile.data.emailAddress}`);
      return true;
    } catch (error) {
      console.error('❌ Gmail OAuth connection verification failed:', error);
      return false;
    }
  }
}

export const gmailOAuthService = new GmailOAuthService();
