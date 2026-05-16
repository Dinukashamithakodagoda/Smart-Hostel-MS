import nodemailer from 'nodemailer';

export interface EmailConfig {
  from: string;
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

export function getEmailConfig(): EmailConfig {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'sendgrid') {
    return {
      from: process.env.EMAIL_FROM || 'noreply@smarthost.com',
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY || '',
      },
    };
  }

  if (emailService === 'gmail') {
    return {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    };
  }

  // Custom SMTP configuration
  return {
    from: process.env.EMAIL_FROM || 'noreply@smarthost.com',
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  };
}

export function createTransporter() {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
}
