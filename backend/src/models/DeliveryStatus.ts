import mongoose, { Schema } from 'mongoose';

export interface DeliveryStatusDocument {
  currentBlock?: string | null;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const deliveryStatusSchema = new Schema<DeliveryStatusDocument>(
  {
    currentBlock: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const DeliveryStatus = mongoose.model<DeliveryStatusDocument>('DeliveryStatus', deliveryStatusSchema);
