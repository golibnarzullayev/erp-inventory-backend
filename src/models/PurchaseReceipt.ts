import { Schema, model } from "mongoose";
import { DocumentStatus } from "../constants/enums";
import { BaseDocument } from "../types/documents";

interface IPurchaseReceiptLine {
  productId: Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  expirationDate?: Date;
  lotCode?: string;
  serialNumbers?: string[];
}

export interface IPurchaseReceipt extends BaseDocument {
  supplierId: Schema.Types.ObjectId;
  warehouseId: Schema.Types.ObjectId;
  receiptDate: Date;
  currency: string;
  invoiceNumber?: string;
  comment?: string;
  lines: IPurchaseReceiptLine[];
}

const purchaseReceiptLineSchema = new Schema<IPurchaseReceiptLine>(
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

const purchaseReceiptSchema = new Schema<IPurchaseReceipt>(
  {
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      required: true,
      default: DocumentStatus.DRAFT,
    },
    supplierId: { type: Schema.Types.ObjectId, required: true },
    warehouseId: { type: Schema.Types.ObjectId, required: true },
    receiptDate: { type: Date, required: true, default: Date.now },
    currency: { type: String, required: true },
    invoiceNumber: { type: String },
    comment: { type: String },
    lines: [purchaseReceiptLineSchema],
    createdBy: { type: String, required: true },
    confirmedBy: { type: String },
    confirmedAt: { type: Date },
    cancelledBy: { type: String },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const PurchaseReceipt = model<IPurchaseReceipt>(
  "PurchaseReceipt",
  purchaseReceiptSchema
);
