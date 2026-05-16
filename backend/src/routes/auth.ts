import bcrypt from 'bcryptjs';
import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, roles } from '../models/User.js';
import { createApplicationForStudent } from './applications.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

export const authRouter = express.Router();

function signToken(userId: string, email: string, role: string) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ id: userId, email, role }, secret, { expiresIn: '1d' });
}

authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body as {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
  };

  const {
    fullName,
    studentId,
    idCardNumber,
    nic,
    gender,
    faculty,
    year,
    address,
    distance,
    contactNumber,
  } = req.body as {
    fullName?: string;
    studentId?: string;
    idCardNumber?: string;
    nic?: string;
    gender?: 'male' | 'female';
    faculty?: string;
    year?: string;
    address?: string;
    distance?: number;
    contactNumber?: string;
  };

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (role && role !== 'Student') {
    return res.status(403).json({ message: 'Only students can register' });
  }

  if (
    !fullName ||
    !studentId ||
    !idCardNumber ||
    !nic ||
    !gender ||
    !faculty ||
    !year ||
    !address ||
    typeof distance !== 'number' ||
    !contactNumber
  ) {
    return res.status(400).json({ message: 'Missing student application data' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, role: 'Student', passwordHash });
  await createApplicationForStudent({
    userId: user.id,
    fullName,
    studentId,
    idCardNumber,
    nic,
    gender,
    faculty,
    year,
    address,
    distance,
    contactNumber,
    email,
  });
  const token = signToken(user.id, user.email, user.role);

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user.id, user.email, user.role);
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

authRouter.get('/me', requireAuth, async (req: AuthedRequest, res: Response) => {
  return res.json({ user: req.user });
});
