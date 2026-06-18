/**
 * Authentication Middleware
 * Provides JWT token verification and role-based access control
 */

import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

/**
 * Authentication payload structure
 * Contains user information extracted from JWT token
 */
export interface AuthPayload {
  id: string;        // User unique identifier
  role: string;      // User role (Student, Warden, etc.)
  email: string;     // User email
}

/**
 * Extended Express Request with optional user payload
 * Used in routes that require authentication
 */
export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

/**
 * Middleware: Verify JWT token and extract user information
 * Checks for Authorization header with Bearer token
 * Validates token signature and expiration
 * Attaches user payload to request object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns 401 if token is missing or invalid
 */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  // Extract Authorization header
  const header = req.headers.authorization;
  
  // Check if header exists and has correct format (Bearer <token>)
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  // Extract token by removing 'Bearer ' prefix
  const token = header.replace('Bearer ', '');
  
  try {
    // Verify token signature using JWT secret
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const payload = jwt.verify(token, secret) as AuthPayload;
    
    // Attach user information to request for use in route handlers
    req.user = payload;
    
    // Continue to next middleware/route handler
    return next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Middleware: Check if user has one of the required roles
 * Should be used after requireAuth middleware
 * Provides role-based access control for routes
 * @param roles - Array of allowed roles for this route
 * @returns Middleware function that validates user role
 */
export function requireRole(roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    // Get user role from authenticated request
    const role = req.user?.role;
    
    // Check if user exists and has one of the required roles
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // User has required role, continue to route handler
    return next();
  };
}
