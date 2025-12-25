import { Schema, model, Document } from "mongoose";

export interface IInventory extends Document {
  productId: Schema.Types.ObjectId;
  warehouseId: Schema.Types.ObjectId;
  quantityOnHand: number;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    warehouseId: { type: Schema.Types.ObjectId, required: true },
    quantityOnHand: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ productId: 1, warehouseId: 1 }, { unique: true });

export const Inventory = model<IInventory>("Inventory", inventorySchema);
