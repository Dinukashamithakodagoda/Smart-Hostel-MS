/**
 * Canteen Order Model
 * Represents a student's canteen food order with items and status tracking
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Order Document Interface
 * Tracks food orders placed by students through the canteen
 */
export interface OrderDocument {
  user: mongoose.Types.ObjectId;        // Reference to User (student)
  items: Array<{ item: mongoose.Types.ObjectId; quantity: number }>;  // Ordered items with quantities
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'; // Order status
  createdAt: Date;                       // Order creation timestamp
  updatedAt: Date;                       // Last status update
}

/**
 * MongoDB Schema for Orders
 */
const orderSchema = new Schema<OrderDocument>(
  {
    // Reference to the student placing the order
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Array of items in the order with quantities
    items: [
      {
        // Reference to CanteenItem
        item: { type: Schema.Types.ObjectId, ref: 'CanteenItem', required: true },
        // Quantity ordered
        quantity: { type: Number, required: true },
      },
    ],
    // Order status progression: pending -> preparing -> ready -> completed/cancelled
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);
