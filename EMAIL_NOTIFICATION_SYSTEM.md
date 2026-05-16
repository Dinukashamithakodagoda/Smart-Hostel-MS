# Email and Notification System Documentation

## Overview

The Smart Hostel Management System now includes a comprehensive email and notification system that keeps users informed about all important events and status changes in real-time.

## Features

### 1. Multi-Channel Notifications

- **Email Notifications**: Automated emails for important events
- **In-App Notifications**: Real-time in-application alerts
- **Real-Time Updates**: Socket.io-based instant notifications
- **Notification History**: All notifications stored in database for reference

### 2. Notification Types

#### Complaint Notifications
- **Complaint Submitted**: Student receives confirmation email when complaint is submitted
- **Complaint Status Update**: Email notification when complaint status changes (pending → in_progress → resolved)
- **New Complaint Assignment**: Assigned staff members receive notification of new complaints

#### Task Notifications
- **Task Assigned**: Automated email when task is assigned
- **Task Completion Reminder**: In-app notification for overdue tasks
- **Task Status Update**: Real-time notification when task status changes

#### Order Notifications
- **Order Confirmation**: Email confirmation when order is placed
- **Order Ready**: Notification when order is ready for pickup
- **Order Status Update**: Real-time updates on order preparation

#### Notice Notifications
- **Notice Published**: Email alert when new notice is posted
- **Important Announcement**: In-app notification for urgent notices

#### System Notifications
- **Attendance Alerts**: Notification for marked attendance
- **System Updates**: Critical system alerts

## Architecture

### Backend Components

#### Email Service (`services/emailService.ts`)
- Handles all email sending operations
- Supports multiple email providers:
  - Gmail
  - SendGrid
  - Custom SMTP servers
- Email templates with HTML formatting
- Error handling and logging

#### Notification Service (`services/notificationService.ts`)
- Manages notification creation and retrieval
- Database persistence of notifications
- User-specific notification queries
- Bulk notification operations
- Notification status management (read/unread)

#### Email Configuration (`config/email.ts`)
- Environment-based email configuration
- Support for multiple email service providers
- Secure credential management
- Transporter initialization

#### Notification Model (`models/Notification.ts`)
- MongoDB schema for storing notifications
- Notification metadata storage
- Indexed queries for performance
- Support for 9 different notification types

#### Notifications API Route (`routes/notifications.ts`)
- GET `/api/notifications` - Retrieve user notifications
- GET `/api/notifications/unread/count` - Get unread count
- PATCH `/api/notifications/:id/read` - Mark single notification as read
- PATCH `/api/notifications/all/read` - Mark all as read
- DELETE `/api/notifications/:id` - Delete notification
- DELETE `/api/notifications` - Clear all notifications

### Real-Time Communication

#### Socket.io Integration
- Real-time bidirectional communication
- User-specific notification rooms
- Event-driven architecture
- Automatic disconnection handling

#### Socket.io Events
- `user:join` - User joins notification room
- `complaint:new` - New complaint created
- `complaint:status-updated` - Complaint status changed
- `task:assigned` - New task assignment
- `order:confirmed` - Order confirmation
- `notice:published` - New notice published

## Email Configuration

### Gmail Setup
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@smarthost.com
```

**Note**: For Gmail, you need to generate an App Password:
1. Go to Google Account Security settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail" and "Windows Computer"
4. Use this password in EMAIL_PASSWORD

### SendGrid Setup
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=sg_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@smarthost.com
```

### Custom SMTP Setup
```env
EMAIL_SERVICE=custom
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@smarthost.com
```

## API Usage Examples

### Get User Notifications
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

### Get Unread Count
```bash
curl -X GET http://localhost:5000/api/notifications/unread/count \
  -H "Authorization: Bearer <token>"
```

### Mark Notification as Read
```bash
curl -X PATCH http://localhost:5000/api/notifications/<notificationId>/read \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:5000/api/notifications/<notificationId> \
  -H "Authorization: Bearer <token>"
```

## Frontend Integration

### Socket.io Client Setup
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: authToken,
  },
});

// Join user-specific notification room
socket.emit('user:join', userId);

// Listen for new complaints
socket.on('complaint:new', (complaint) => {
  console.log('New complaint:', complaint);
});

// Listen for status updates
socket.on('complaint:status-updated', (update) => {
  console.log('Complaint updated:', update);
});
```

### Fetch Notifications
```typescript
const response = await fetch('/api/notifications', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { notifications, unreadCount } = await response.json();
```

## Complaint Email Workflow

1. **Student submits complaint**
   - Email sent to student confirming receipt
   - In-app notification created for student
   - Real-time notification to assigned staff
   - Socket.io event emitted to all connected clients

2. **Staff updates complaint status**
   - Email sent to student with status update
   - In-app notification created for student
   - Real-time notification via Socket.io
   - Database notification stored

3. **Complaint resolved**
   - Final email sent to student confirming resolution
   - Notification marked in system
   - Email template shows completion details

## Database Schema

### Notification Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "complaint_submitted|complaint_status_update|...",
  "title": "string",
  "message": "string",
  "read": "boolean",
  "relatedItemId": "string",
  "relatedItemType": "complaint|task|order|notice|attendance",
  "metadata": {
    "complaintId": "ObjectId",
    "category": "string",
    "newStatus": "string"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Error Handling

### Email Service
- Logs errors when email fails to send
- Doesn't fail request if email fails
- Fallback to in-app notification

### Notification Service
- Database-backed persistence
- Error logging for debugging
- Graceful error handling

### Socket.io
- Automatic reconnection handling
- Error event emitters
- Connection timeout handling

## Performance Optimization

### Database Indexes
- Indexed queries on `userId` and `createdAt`
- Optimized for unread notification queries
- Efficient pagination support

### Email Service
- Connection pooling
- Bulk email support through `notifyUsers` method
- Template caching

### Socket.io
- User-specific rooms for targeted notifications
- Reduced bandwidth with selective broadcasting
- Automatic cleanup on disconnect

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| EMAIL_SERVICE | Email provider (gmail/sendgrid/custom) | No | gmail |
| EMAIL_USER | Email account username | No | - |
| EMAIL_PASSWORD | Email account password | No | - |
| SENDGRID_API_KEY | SendGrid API key | No | - |
| EMAIL_FROM | Sender email address | No | noreply@smarthost.com |
| SMTP_HOST | Custom SMTP host | No | - |
| SMTP_PORT | Custom SMTP port | No | 587 |
| SMTP_SECURE | SMTP SSL/TLS | No | false |
| SMTP_USER | SMTP username | No | - |
| SMTP_PASSWORD | SMTP password | No | - |
| ENABLE_COMPLAINT_EMAILS | Enable complaint emails | No | true |
| ENABLE_TASK_EMAILS | Enable task emails | No | true |
| ENABLE_ORDER_EMAILS | Enable order emails | No | true |
| ENABLE_NOTICE_EMAILS | Enable notice emails | No | true |

## Testing

### Test Email Service Connection
The system automatically verifies email service connection on startup. Check console output for:
- "Email service is ready to send emails" - Connection successful
- "Email service verification failed" - Connection error

### Development Email Testing
Use Mailtrap or Mailhog for development:
1. Set up Mailtrap account
2. Configure credentials in .env
3. Emails will be captured without actually sending

## Troubleshooting

### Emails not being sent
1. Verify email credentials in .env
2. Check EMAIL_SERVICE is set correctly
3. Ensure "ENABLE_*_EMAILS" flags are true
4. Check server logs for error messages

### Socket.io not connecting
1. Verify Socket.io server is running
2. Check CORS origins in environment variables
3. Verify client is using correct server URL

### Notifications not appearing
1. Verify user is connected to Socket.io
2. Check database connection
3. Review notification service logs

## Future Enhancements

- SMS notifications
- Push notifications for mobile apps
- Notification scheduling
- User notification preferences UI
- Notification templates management
- Analytics and reporting
- Notification throttling/rate limiting
