import { Schema, model, Document } from "mongoose";

export interface IInventorySerialized extends Document {
  productId: Schema.Types.ObjectId;
  warehouseId: Schema.Types.ObjectId;
  serialNumber: string;
  isSold: boolean;
}

const inventorySerializedSchema = new Schema<IInventorySerialized>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    warehouseId: { type: Schema.Types.ObjectId, required: true },
    serialNumber: { type: String, required: true, unique: true },
    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const InventorySerialized = model<IInventorySerialized>(
  "InventorySerialized",
  inventorySerializedSchema
);
