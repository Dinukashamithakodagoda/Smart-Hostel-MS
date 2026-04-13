import mongoose, { Schema } from 'mongoose';

export interface OrderDocument {
  user: mongoose.Types.ObjectId;
  items: Array<{ item: mongoose.Types.ObjectId; quantity: number }>;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'CanteenItem', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);
