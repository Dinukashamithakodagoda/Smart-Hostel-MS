/**
 * Canteen Item Model
 * Represents food items available in the hostel canteen
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Canteen Item Document Interface
 * Stores information about food items available for order
 */
export interface CanteenItemDocument {
  name: string;                          // Item name
  price: number;                         // Price in currency units
  image?: string;                        // URL to item image
  category?: string;                     // Food category (e.g., 'Breakfast', 'Lunch')
  available: boolean;                    // Availability status
  createdAt: Date;                       // Item creation timestamp
  updatedAt: Date;                       // Last update timestamp
}

/**
 * MongoDB Schema for Canteen Items
 */
const canteenItemSchema = new Schema<CanteenItemDocument>(
  {
    // Item name
    name: { type: String, required: true },
    // Price
    price: { type: Number, required: true },
    // Optional image URL
    image: { type: String },
    // Optional category
    category: { type: String },
    // Whether item is available for ordering
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CanteenItem = mongoose.model<CanteenItemDocument>('CanteenItem', canteenItemSchema);
