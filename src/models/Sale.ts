import { Schema, model } from "mongoose";
import { DocumentStatus } from "../constants/enums";
import { BaseDocument } from "../types/documents";

interface ISaleLine {
  productId: Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  expirationDate?: Date;
  lotCode?: string;
  serialNumbers?: string[];
}

export interface ISale extends BaseDocument {
  customerId?: Schema.Types.ObjectId;
  warehouseId: Schema.Types.ObjectId;
  saleDate: Date;
  currency: string;
  paymentType?: string;
  comment?: string;
  lines: ISaleLine[];
}

const saleLineSchema = new Schema<ISaleLine>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date },
    lotCode: { type: String },
    serialNumbers: [{ type: String }],
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      required: true,
      default: DocumentStatus.DRAFT,
    },
    customerId: { type: Schema.Types.ObjectId },
    warehouseId: { type: Schema.Types.ObjectId, required: true },
    saleDate: { type: Date, required: true, default: Date.now },
    currency: { type: String, required: true },
    paymentType: { type: String },
    comment: { type: String },
    lines: [saleLineSchema],
    createdBy: { type: String, required: true },
    confirmedBy: { type: String },
    confirmedAt: { type: Date },
    cancelledBy: { type: String },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const Sale = model<ISale>("Sale", saleSchema);
