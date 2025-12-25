import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Product } from "../models/Product";
import { PurchaseReceipt } from "../models/PurchaseReceipt";
import { Inventory } from "../models/Inventory";
import productRoutes from "../routes/productRoutes";
import purchaseReceiptRoutes from "../routes/purchaseReceiptRoutes";
import { ProductTrackingType, DocumentStatus } from "../constants/enums";

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/purchase-receipts", purchaseReceiptRoutes);

describe("Purchase Receipt Flow", () => {
  it("should increase stock when a purchase receipt is confirmed", async () => {
    const product = new Product({
      name: "Test Product",
      sku: "TP-001",
      unitOfMeasure: "unit",
      trackingType: ProductTrackingType.SIMPLE,
    });
    await product.save();

    const receiptData = {
      supplierId: new mongoose.Types.ObjectId(),
      warehouseId: new mongoose.Types.ObjectId(),
      currency: "USD",
      lines: [
        {
          productId: product._id,
          quantity: 10,
          unitPrice: 100,
        },
      ],
    };

    const createResponse = await request(app)
      .post("/api/purchase-receipts")
      .send(receiptData);

    expect(createResponse.status).toBe(201);
    const receiptId = createResponse.body._id;

    const confirmResponse = await request(app)
      .put(`/api/purchase-receipts/${receiptId}/confirm`)
      .send();

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.status).toBe(DocumentStatus.CONFIRMED);

    const inventory = await Inventory.findOne({
      productId: product._id,
      warehouseId: receiptData.warehouseId,
    });

    expect(inventory).not.toBeNull();
    expect(inventory?.quantityOnHand).toBe(10);
  });
});
