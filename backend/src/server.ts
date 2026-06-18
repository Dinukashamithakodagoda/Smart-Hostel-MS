/**
 * Server Initialization and Real-time Communication
 * Sets up HTTP server with Socket.io for real-time notifications,
 * database connection, email service, and application startup
 */

import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { seedDefaultStaffUsers } from './seed/defaultUsers.js';
import { emailService } from './services/emailService.js';
import { gmailOAuthService } from './services/gmailOAuthService.js';

// Load environment variables from .env file
dotenv.config();

// Get server port from environment or default to 5000
const port = Number(process.env.PORT || 5000);

// Create HTTP server from Express app for use with Socket.io
const httpServer = createServer(app);

// Initialize Socket.io for real-time bidirectional communication
const io = new SocketServer(httpServer, {
  cors: {
    // Allow connections from frontend URLs
    origin: (process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173']).map((o) => o.trim()),
    credentials: true,
  },
});

// Make Socket.io instance accessible to Express routes for sending events
app.set('io', io);

/**
 * Socket.io Connection Handling
 * Manages real-time communication between server and clients
 */
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Event: User joins their personal room for receiving notifications
  // This allows the server to send targeted messages to specific users
  socket.on('user:join', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined room`);
  });

  // Event: Client disconnects (user closes app or loses connection)
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Event: Handle any Socket.io errors
  socket.on('error', (error) => {
    console.error(`Socket error from ${socket.id}:`, error);
  });
});

/**
 * Application Startup Sequence
 * 1. Connect to MongoDB database
 * 2. Seed default staff users if needed
 * 3. Verify email service configuration
 * 4. Start HTTP server and Socket.io
 */
connectDb()
  .then(() => {
    console.log('Database connected');
    return seedDefaultStaffUsers();
  })
  .then(async () => {
    // Check which email service is enabled
    const useGmailOAuth = process.env.GMAIL_OAUTH_ENABLED === 'true';
    
    if (useGmailOAuth) {
      // Verify Gmail OAuth token status
      await gmailOAuthService.checkTokenStatus();
    } else {
      // Verify SMTP email service connection
      try {
        await emailService.verifyConnection();
        console.log('✅ SMTP email service ready');
      } catch (error) {
        console.warn('⚠️  SMTP email service warning:', error instanceof Error ? error.message : error);
      }
    }
    
    // Start listening for incoming HTTP and Socket.io connections
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Socket.io server ready for real-time notifications`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
