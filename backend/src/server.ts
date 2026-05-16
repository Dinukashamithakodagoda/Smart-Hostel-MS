import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { seedDefaultStaffUsers } from './seed/defaultUsers.js';
import { emailService } from './services/emailService.js';
import { gmailOAuthService } from './services/gmailOAuthService.js';

dotenv.config();

const port = Number(process.env.PORT || 5000);

// Create HTTP server with Socket.io support
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: (process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173']).map((o) => o.trim()),
    credentials: true,
  },
});

// Make io accessible to Express app
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // User join event - join user-specific room
  socket.on('user:join', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined room`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error from ${socket.id}:`, error);
  });
});

connectDb()
  .then(() => {
    console.log('Database connected');
    return seedDefaultStaffUsers();
  })
  .then(async () => {
    // Check email service status based on configuration
    const useGmailOAuth = process.env.GMAIL_OAUTH_ENABLED === 'true';
    
    if (useGmailOAuth) {
      // Check if token exists - don't trigger OAuth flow on startup
      await gmailOAuthService.checkTokenStatus();
    } else {
      try {
        await emailService.verifyConnection();
        console.log('✅ SMTP email service ready');
      } catch (error) {
        console.warn('⚠️  SMTP email service warning:', error instanceof Error ? error.message : error);
      }
    }
    
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Socket.io server ready for real-time notifications`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
