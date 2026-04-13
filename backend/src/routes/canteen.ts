import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { CanteenItem } from '../models/CanteenItem.js';
import { Order } from '../models/Order.js';

export const canteenRouter = express.Router();

canteenRouter.get('/items', requireAuth, async (_req: Request, res: Response) => {
  const items = await CanteenItem.find();
  return res.json({ items });
});

canteenRouter.post('/items', requireAuth, requireRole(['Canteen']), async (req: Request, res: Response) => {
  const { name, price, image, category, available } = req.body as {
    name?: string;
    price?: number;
    image?: string;
    category?: string;
    available?: boolean;
  };

  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const item = await CanteenItem.create({ name, price, image, category, available });
  return res.status(201).json({ item });
});

canteenRouter.patch('/items/:id', requireAuth, requireRole(['Canteen']), async (req: Request, res: Response) => {
  const { name, price, image, category, available } = req.body as {
    name?: string;
    price?: number;
    image?: string;
    category?: string;
    available?: boolean;
  };

  const item = await CanteenItem.findByIdAndUpdate(
    req.params.id,
    { name, price, image, category, available },
    { new: true }
  );

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  return res.json({ item });
});

canteenRouter.delete('/items/:id', requireAuth, requireRole(['Canteen']), async (req: Request, res: Response) => {
  const item = await CanteenItem.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  return res.json({ ok: true });
});

canteenRouter.post('/orders', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { items } = req.body as { items?: Array<{ item: string; quantity: number }> };

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  const order = await Order.create({ user: req.user?.id, items });
  return res.status(201).json({ order });
});

canteenRouter.get('/orders', requireAuth, requireRole(['Canteen']), async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .populate('items.item')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  return res.json({ orders });
});

canteenRouter.get('/orders/mine', requireAuth, async (req: AuthedRequest, res: Response) => {
  const orders = await Order.find({ user: req.user?.id })
    .populate('items.item')
    .sort({ createdAt: -1 });
  return res.json({ orders });
});

canteenRouter.patch('/orders/:id/status', requireAuth, requireRole(['Canteen']), async (req: Request, res: Response) => {
  const { status } = req.body as { status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' };
  if (!status) {
    return res.status(400).json({ message: 'Missing status' });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('items.item')
    .populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.json({ order });
});
