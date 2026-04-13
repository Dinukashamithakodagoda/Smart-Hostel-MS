import mongoose, { Schema } from 'mongoose';

export interface CanteenItemDocument {
  name: string;
  price: number;
  image?: string;
  category?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const canteenItemSchema = new Schema<CanteenItemDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CanteenItem = mongoose.model<CanteenItemDocument>('CanteenItem', canteenItemSchema);
