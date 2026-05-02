import express, { type Request, type Response } from 'express';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { CanteenItem } from '../models/CanteenItem.js';
import { DeliveryStatus } from '../models/DeliveryStatus.js';
import { Order } from '../models/Order.js';
import { Notice } from '../models/Notice.js';

export const canteenRouter = express.Router();

const hostelBlocks = ['A', 'B', 'C', 'D', 'E'] as const;

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

canteenRouter.get('/orders/summary/items', requireAuth, requireRole(['Canteen']), async (_req: Request, res: Response) => {
  const summary = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.item',
        totalQty: { $sum: '$items.quantity' },
      },
    },
    {
      $lookup: {
        from: 'canteenitems',
        localField: '_id',
        foreignField: '_id',
        as: 'item',
      },
    },
    { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        itemId: '$_id',
        itemName: { $ifNull: ['$item.name', 'Unknown item'] },
        totalQty: 1,
      },
    },
    { $sort: { totalQty: -1 } },
  ]);

  return res.json({ summary });
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

canteenRouter.get('/delivery/status', requireAuth, requireRole(['Canteen']), async (_req: Request, res: Response) => {
  const status = await DeliveryStatus.findOne().sort({ updatedAt: -1 }).lean();
  return res.json({ status });
});

canteenRouter.patch('/delivery/status', requireAuth, requireRole(['Canteen']), async (req: AuthedRequest, res: Response) => {
  const { block } = req.body as { block?: string | null };
  const normalizedBlock = block?.trim().toUpperCase();

  if (!normalizedBlock) {
    return res.status(400).json({ message: 'Block is required' });
  }

  if (!hostelBlocks.includes(normalizedBlock as (typeof hostelBlocks)[number])) {
    return res.status(400).json({ message: 'Invalid block' });
  }

  const status = await DeliveryStatus.findOneAndUpdate(
    {},
    { currentBlock: normalizedBlock, updatedBy: req.user?.id },
    { new: true, upsert: true }
  );

  return res.json({ status });
});

canteenRouter.post('/delivery/arrived', requireAuth, requireRole(['Canteen']), async (req: AuthedRequest, res: Response) => {
  const { block } = req.body as { block?: string };
  const normalizedBlock = block?.trim().toUpperCase();

  if (!normalizedBlock) {
    return res.status(400).json({ message: 'Block is required' });
  }

  if (!hostelBlocks.includes(normalizedBlock as (typeof hostelBlocks)[number])) {
    return res.status(400).json({ message: 'Invalid block' });
  }

  const notice = await Notice.create({
    title: `Canteen delivery arrived - Block ${normalizedBlock}`,
    content: `Canteen delivery vehicle has arrived at Block ${normalizedBlock}. Please collect your orders from the drop point.`,
    audience: 'Student',
    targetBlock: normalizedBlock,
    createdBy: req.user?.id,
  });

  const hydrated = await Notice.findById(notice._id).populate('createdBy', 'name email role');
  return res.status(201).json({ notice: hydrated });
});
