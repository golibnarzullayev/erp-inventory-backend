import { Schema, model, Document } from "mongoose";

export interface IInventoryLot extends Document {
  productId: Schema.Types.ObjectId;
  warehouseId: Schema.Types.ObjectId;
  lotCode: string;
  quantity: number;
}

const inventoryLotSchema = new Schema<IInventoryLot>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    warehouseId: { type: Schema.Types.ObjectId, required: true },
    lotCode: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

inventoryLotSchema.index(
  { productId: 1, warehouseId: 1, lotCode: 1 },
  { unique: true }
);

export const InventoryLot = model<IInventoryLot>(
  "InventoryLot",
  inventoryLotSchema
);
