/**
 * Delivery Status Model
 * Tracks the current block where food delivery is being processed
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Delivery Status Document Interface
 * Maintains information about which hostel block is currently receiving food delivery
 */
export interface DeliveryStatusDocument {
  currentBlock?: string | null;          // Currently active delivery block
  updatedBy: mongoose.Types.ObjectId;    // Reference to User who updated status
  updatedAt: Date;                       // Timestamp of last update
  createdAt: Date;                       // Status record creation timestamp
}

/**
 * MongoDB Schema for Delivery Status
 */
const deliveryStatusSchema = new Schema<DeliveryStatusDocument>(
  {
    // Current block receiving delivery (null if no active delivery)
    currentBlock: { type: String },
    // User who last updated the delivery status
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const DeliveryStatus = mongoose.model<DeliveryStatusDocument>('DeliveryStatus', deliveryStatusSchema);
