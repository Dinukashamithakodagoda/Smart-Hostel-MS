# Gmail OAuth 2.0 Setup Guide

## Quick Start

After placing your `credentials.json` in the backend directory and setting environment variables, run:

```bash
cd backend
npm run oauth-setup
```

This will:
1. Open your browser for Google authentication
2. Grant Gmail sending permissions
3. Auto-save your token
4. Verify the connection works

Then start the server normally:

```bash
npm run dev
```

## Prerequisites

1. Google Cloud Project created
2. Gmail API enabled
3. OAuth 2.0 credentials (Client ID and Client Secret)
4. credentials.json file from Google Cloud

## Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Enter project name: `Smart-Hostel-Email`
4. Click "Create"

### Step 2: Enable Gmail API

1. Search for "Gmail API" in the search bar
2. Click on "Gmail API"
3. Click "Enable"
4. Wait for it to enable

### Step 3: Create OAuth 2.0 Credentials

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure OAuth consent screen first:
   - User Type: External
   - Fill in required fields (App name, User support email, etc.)
   - Add scopes: `https://www.googleapis.com/auth/gmail.send`
4. Application type: Desktop application
5. Name: Smart Hostel Backend
6. Click "Create"
7. Download the JSON file

### Step 4: Prepare credentials.json File

1. Rename the downloaded file to `credentials.json`
2. Place it in the backend root directory:
   ```
   backend/
   ├── credentials.json      ← Place here
   ├── .env
   ├── package.json
   └── src/
   ```

3. The file should contain:
   ```json
   {
     "web": {
       "client_id": "65082235821-7ppnomsjh3n7lhfj8hefnuh4ur0vdtqm.apps.googleusercontent.com",
       "project_id": "hostelemail",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_secret": "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"
     }
   }
   ```

### Step 5: Update Environment Variables

Update `.env` file:

```env
# Email Service - Use Gmail OAuth
EMAIL_SERVICE=gmail-oauth

# Gmail OAuth Configuration
GMAIL_OAUTH_ENABLED=true
GOOGLE_CLIENT_ID=65082235821-7ppnomsjh3n7lhfj8hefnuh4ur0vdtqm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/callback
GOOGLE_CREDENTIALS_PATH=./credentials.json
EMAIL_FROM=Smart Hostel <noreply@smarthost.com>
```

### Step 6: Install Dependencies

```bash
cd backend
npm install
```

### Step 7: Complete OAuth Authentication

Run the automated setup script:

```bash
npm run oauth-setup
```

This script will:
1. Check for `credentials.json` file
2. Open a browser window automatically
3. Redirect you to Google's login page
4. Ask for permission to send emails
5. Create `token.json` automatically
6. Verify the connection is working

**Output will look like:**
```
🔐 Gmail OAuth 2.0 Setup

✅ Found credentials file: ./credentials.json
📝 No existing token found. Starting new authentication...

🌐 Opening browser for Google authentication...

✅ Token saved to: ./token.json
🔍 Verifying token...
✅ Gmail OAuth verified successfully!
   Email: your-email@gmail.com
   Your Gmail account is now connected!

📧 You can now send emails using the Smart Hostel system.

✨ Setup complete! Start the server with: npm run dev
```

### Step 8: Start the Server

After successful authentication:

```bash
npm run dev
```

The server will now:
1. Detect the existing `token.json`
2. Skip re-authentication
3. Start normally on port 5000
4. Be ready to send emails

**First run output:**
```
MongoDB connected to hostal database
Database connected
Default staff accounts created
ℹ️  OAuth token found. Gmail OAuth ready.
Server running on port 5000
Socket.io server ready for real-time notifications
```

## File Structure After Setup

```
backend/
├── credentials.json      # Downloaded from Google Cloud (Do NOT commit)
├── token.json           # Auto-generated after first auth (Do NOT commit)
├── .gitignore          # Add both files to gitignore
├── .env
├── package.json
└── src/
    ├── services/
    │   ├── emailService.ts       # Original SMTP service
    │   └── gmailOAuthService.ts  # New OAuth service
    └── ...
```

## Update .gitignore

Make sure these files are NOT committed to Git:

```bash
# In backend/.gitignore
credentials.json
token.json
.env
.env.local
```

## Usage in Code

### Initialize OAuth Service

```typescript
import { gmailOAuthService } from '../services/gmailOAuthService.js';

// In your initialization code (e.g., server.ts)
await gmailOAuthService.initialize();
await gmailOAuthService.verifyConnection();
```

### Send Complaint Email

```typescript
await gmailOAuthService.sendComplaintConfirmation({
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  complaintTitle: 'Room maintenance issue',
  complaintDescription: 'Air conditioner not working',
  complaintCategory: 'Maintenance',
  complaintId: '507f1f77bcf86cd799439011',
  submittedDate: new Date(),
});
```

### Send Status Update

```typescript
await gmailOAuthService.sendComplaintStatusUpdate({
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  complaintTitle: 'Room maintenance issue',
  complaintDescription: 'Air conditioner not working',
  complaintCategory: 'Maintenance',
  complaintId: '507f1f77bcf86cd799439011',
  submittedDate: new Date(),
  status: 'in_progress',
  wardenName: 'Mr. Smith',
});
```

## Using the Setup Script

### What is `npm run oauth-setup`?

The setup script (`scripts/setupGmailOAuth.ts`) automates the OAuth authentication process. It:

1. **Checks Prerequisites** - Verifies `credentials.json` exists
2. **Detects Existing Token** - Reuses token if already authenticated
3. **Opens Browser** - Launches Google login automatically
4. **Handles Callback** - Creates a temporary local server for OAuth redirect
5. **Saves Token** - Stores credentials in `token.json`
6. **Verifies Connection** - Tests that Gmail API access works

### When to Run Setup Script

- **First time setup:** After placing `credentials.json` and updating `.env`
- **Re-authentication:** After deleting `token.json` or token expiration
- **Testing:** To verify Gmail credentials work without starting the server

### How It Works

```bash
# Run the setup script
npm run oauth-setup

# Expected flow:
# 1. Checks credentials.json exists
# 2. No token found message (if first time)
# 3. Browser opens automatically
# 4. You sign in with Google
# 5. Grant "Send emails" permission
# 6. Redirected back to localhost
# 7. token.json saved automatically
# 8. Connection verified
# 9. "Setup complete!" message
```

### Server Startup Behavior

The Smart Hostel backend now uses **lazy initialization**:

- **On startup:** Server checks if `token.json` exists but doesn't try to authenticate
- **When needed:** Gmail service initializes automatically when first email needs to be sent
- **If no token:** Server logs `⚠️ OAuth token not found. Run npm run oauth-setup to complete authentication.`

This allows the server to start and run even without Gmail OAuth configured.

## Comparison: SMTP vs OAuth

| Feature | SMTP App Password | OAuth 2.0 |
|---------|------------------|----------|
| **Security** | Good | Excellent ✅ |
| **Setup Complexity** | Simple | Medium |
| **Rate Limits** | Standard | Higher |
| **Token Expiry** | None | Auto-refresh |
| **Scope Control** | Limited | Fine-grained |
| **User Interaction** | Once at start | Once at start |
| **Setup Method** | Manual config | `npm run oauth-setup` ✅ |

## Switching Between Services

### Keep Both Services and Switch by Environment

```typescript
// Already implemented in complaints.ts and other routes
import { emailService } from '../services/emailService.js';
import { gmailOAuthService } from '../services/gmailOAuthService.js';

function getEmailService() {
  return process.env.GMAIL_OAUTH_ENABLED === 'true' ? gmailOAuthService : emailService;
}

// Use getEmailService() for sending
const mailService = getEmailService();
await mailService.sendComplaintConfirmation(data);
```

## Troubleshooting

### Setup Script Issues

#### Browser Won't Open Automatically

**Error:** Browser doesn't launch during `npm run oauth-setup`

**Solution:** 
1. Look for a URL in the console (like `http://localhost:3000/...`)
2. Manually copy and paste that URL into your browser
3. Complete authentication there

#### Port 3000 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Stop any process using port 3000 (often frontend dev server)
2. Try again: `npm run oauth-setup`
3. Or temporarily change `GOOGLE_REDIRECT_URI` in `.env` to a different port

#### Script Hangs or Doesn't Complete

**Error:** Script starts but never finishes

**Solution:**
1. Check browser for Google sign-in screen
2. Make sure you granted permissions
3. If it still hangs after 5 minutes, press Ctrl+C and try again

### Runtime Issues

#### Token Expired

**Error:** `credentials_expired`

**Solution:** Delete `token.json` and restart the app to re-authenticate

```bash
rm token.json
npm run oauth-setup
```

### Permission Denied

**Error:** `Permission denied` or `Insufficient scopes`

**Solution:** 
1. Delete `token.json`
2. Check Google OAuth consent screen permissions
3. Add scope: `https://www.googleapis.com/auth/gmail.send`
4. Re-authenticate

### Credentials Not Found

**Error:** `ENOENT: no such file or directory, open 'credentials.json'`

**Solution:**
1. Verify `credentials.json` is in backend root directory
2. Check GOOGLE_CREDENTIALS_PATH in .env
3. Ensure file is not in .gitignore while developing

### Browser Won't Open for Auth

**Error:** Browser doesn't open automatically

**Solution:** Manually open the provided URL in browser after restart

## Production Deployment

### Environment Setup

1. Upload `credentials.json` to server securely:
   ```bash
   scp credentials.json user@server:/path/to/backend/
   chmod 600 /path/to/backend/credentials.json
   ```

2. Set environment variables:
   ```bash
   export GMAIL_OAUTH_ENABLED=true
   export GOOGLE_CLIENT_ID=your-client-id
   export GOOGLE_CLIENT_SECRET=your-secret
   ```

3. Pre-generate token.json locally:
   ```bash
   npm run dev
   # Go through auth process
   scp token.json user@server:/path/to/backend/
   chmod 600 /path/to/backend/token.json
   ```

### Backup Token

Always backup `token.json` in production:
```bash
# Create backup
cp token.json token.json.backup

# If compromised, re-authenticate to get new token
rm token.json
npm run dev
```

## Rate Limits

- Gmail API free tier: 1,000 requests per 100 seconds
- Using OAuth 2.0: Higher quotas than SMTP
- Monitor usage in Google Cloud Console

## Additional Resources

- [Google Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)

## Migration from SMTP to OAuth

If you already have the SMTP service running:

1. Keep `emailService.ts` as is
2. Install new dependencies: `npm install`
3. Add Gmail OAuth service alongside
4. Gradually migrate by testing with OAuth
5. Update routing to use OAuth service
6. Remove SMTP credentials from production

## Support

For issues or questions about Gmail OAuth:
1. Check [Gmail API Console Errors](https://developers.google.com/gmail/api/guides/errors)
2. Review Google Cloud Console audit logs
3. Verify OAuth 2.0 consent screen permissions
