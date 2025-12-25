import { Schema, model, Document } from "mongoose";

export interface IInventoryExpirable extends Document {
  productId: Schema.Types.ObjectId;
  warehouseId: Schema.Types.ObjectId;
  expirationDate: Date;
  quantity: number;
}

const inventoryExpirableSchema = new Schema<IInventoryExpirable>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    warehouseId: { type: Schema.Types.ObjectId, required: true },
    expirationDate: { type: Date, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

inventoryExpirableSchema.index(
  { productId: 1, warehouseId: 1, expirationDate: 1 },
  { unique: true }
);

export const InventoryExpirable = model<IInventoryExpirable>(
  "InventoryExpirable",
  inventoryExpirableSchema
);
