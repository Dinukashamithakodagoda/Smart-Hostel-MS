#!/usr/bin/env node
/**
 * Gmail OAuth 2.0 Setup Script
 * 
 * This script sets up Gmail OAuth 2.0 authentication.
 * It will:
 * 1. Check for credentials.json file
 * 2. Open a browser for Google OAuth login
 * 3. Handle the OAuth callback
 * 4. Save the token to token.json
 * 5. Verify the connection works
 * 
 * Usage: npm run oauth-setup
 */

import dotenv from 'dotenv';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { promises as fs } from 'fs';

dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '..');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const TOKEN_PATH = path.join(backendDir, 'token.json');
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH 
  ? path.resolve(process.env.GOOGLE_CREDENTIALS_PATH)
  : path.join(backendDir, 'credentials.json');

async function setupGmailOAuth() {
  try {
    console.log('🔐 Gmail OAuth 2.0 Setup\n');

    // Check if credentials.json exists
    try {
      await fs.access(CREDENTIALS_PATH);
      console.log(`✅ Found credentials file: ${CREDENTIALS_PATH}`);
    } catch {
      console.error(`❌ Credentials file not found at: ${CREDENTIALS_PATH}`);
      console.log('\n📝 To get credentials:');
      console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
      console.log('2. Create a new project');
      console.log('3. Enable Gmail API');
      console.log('4. Create OAuth 2.0 Desktop credentials');
      console.log('5. Download the JSON file and rename to credentials.json');
      console.log(`6. Place it at: ${CREDENTIALS_PATH}\n`);
      process.exit(1);
    }

    // Check if token already exists
    try {
      await fs.access(TOKEN_PATH);
      console.log(`✅ Token already exists at: ${TOKEN_PATH}`);
      const tokenContent = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'));
      console.log(`   Expires at: ${new Date(tokenContent.expiry_date).toLocaleString()}\n`);
      
      // Try to verify the existing token
      console.log('🔍 Verifying token...');
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth/callback'
      );
      auth.setCredentials(tokenContent);
      const gmail = google.gmail({ version: 'v1', auth });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log(`✅ Token is valid! Email: ${profile.data.emailAddress}\n`);
      console.log('No re-authentication needed. Your Gmail OAuth is ready!\n');
      return;
    } catch {
      console.log('📝 No existing token found. Starting new authentication...\n');
    }

    // Authenticate with Google
    console.log('🌐 Opening browser for Google authentication...\n');
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (!auth.credentials) {
      throw new Error('No credentials received from authentication');
    }

    // Save the token
    await fs.writeFile(TOKEN_PATH, JSON.stringify(auth.credentials, null, 2));
    console.log(`\n✅ Token saved to: ${TOKEN_PATH}`);

    // Verify the token works
    console.log('🔍 Verifying token...');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth/callback'
    );
    oauth2Client.setCredentials(auth.credentials);
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    console.log(`✅ Gmail OAuth verified successfully!`);
    console.log(`   Email: ${profile.data.emailAddress}`);
    console.log(`   Your Gmail account is now connected!\n`);

    console.log('📧 You can now send emails using the Smart Hostel system.\n');
    console.log('✨ Setup complete! Start the server with: npm run dev\n');
  } catch (error) {
    console.error('❌ OAuth setup failed:');
    console.error(error instanceof Error ? error.message : error);
    console.log('\nℹ️  For troubleshooting, see GMAIL_OAUTH_SETUP.md\n');
    process.exit(1);
  }
}

setupGmailOAuth();
