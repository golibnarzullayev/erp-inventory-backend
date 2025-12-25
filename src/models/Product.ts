import { Schema, model } from "mongoose";
import { ProductTrackingType } from "../constants/enums";
import { BaseDocument } from "../types/documents";

export interface IProduct extends BaseDocument {
  name: string;
  sku: string;
  unitOfMeasure: string;
  trackingType: ProductTrackingType;
  isActive: boolean;
  barcode?: string;
  minStockLevel?: number;
  salePriceDefault?: number;
  purchasePriceDefault?: number;
  isVariant: boolean;
  parentProductId?: Schema.Types.ObjectId;
  variantAttributes?: Record<string, string>;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    unitOfMeasure: { type: String, required: true },
    trackingType: {
      type: String,
      enum: Object.values(ProductTrackingType),
      required: true,
    },
    isActive: { type: Boolean, default: true },
    barcode: { type: String },
    minStockLevel: { type: Number, default: 0 },
    salePriceDefault: { type: Number },
    purchasePriceDefault: { type: Number },
    isVariant: { type: Boolean, default: false },
    parentProductId: { type: Schema.Types.ObjectId, ref: "Product" },
    variantAttributes: { type: Map, of: String },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
