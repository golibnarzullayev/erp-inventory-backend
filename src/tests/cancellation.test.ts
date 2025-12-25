import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Inventory } from "../models/Inventory";
import { InventoryService } from "../services/inventoryService";
import productRoutes from "../routes/productRoutes";
import purchaseReceiptRoutes from "../routes/purchaseReceiptRoutes";
import saleRoutes from "../routes/saleRoutes";
import { ProductTrackingType, DocumentStatus } from "../constants/enums";

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/purchase-receipts", purchaseReceiptRoutes);
app.use("/api/sales", saleRoutes);

describe("Cancellation Flow", () => {
  const inventoryService = new InventoryService();

  it("should revert stock when a confirmed purchase receipt is cancelled", async () => {
    const product = new Product({
      name: "Cancel Test Product",
      sku: "CTP-001",
      unitOfMeasure: "unit",
      trackingType: ProductTrackingType.SIMPLE,
    });
    await product.save();
    const warehouseId = new mongoose.Types.ObjectId();

    const receiptData = {
      supplierId: new mongoose.Types.ObjectId(),
      warehouseId,
      currency: "USD",
      lines: [{ productId: product._id, quantity: 15, unitPrice: 50 }],
    };
    const createResponse = await request(app)
      .post("/api/purchase-receipts")
      .send(receiptData);
    const receiptId = createResponse.body._id;

    await request(app)
      .put(`/api/purchase-receipts/${receiptId}/confirm`)
      .send();
    let inventory = await Inventory.findOne({
      productId: product._id,
      warehouseId,
    });
    expect(inventory?.quantityOnHand).toBe(15);

    const cancelResponse = await request(app)
      .put(`/api/purchase-receipts/${receiptId}/cancel`)
      .send({ reason: "Test cancellation" });
    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.status).toBe(DocumentStatus.CANCELLED);

    inventory = await Inventory.findOne({
      productId: product._id,
      warehouseId,
    });
    expect(inventory?.quantityOnHand).toBe(0);
  });

  it("should restore stock when a confirmed sale is cancelled", async () => {
    const product = new Product({
      name: "Sale Cancel Test",
      sku: "SCT-001",
      unitOfMeasure: "unit",
      trackingType: ProductTrackingType.SIMPLE,
    });
    await product.save();
    const warehouseId = new mongoose.Types.ObjectId();

    await inventoryService.increaseStock({
      productId: product._id.toString(),
      warehouseId: warehouseId.toString(),
      quantity: 30,
    });

    const saleData = {
      warehouseId,
      currency: "USD",
      lines: [{ productId: product._id, quantity: 10, unitPrice: 200 }],
    };
    const createResponse = await request(app).post("/api/sales").send(saleData);
    const saleId = createResponse.body._id;

    await request(app).put(`/api/sales/${saleId}/confirm`).send();
    let inventory = await Inventory.findOne({
      productId: product._id,
      warehouseId,
    });
    expect(inventory?.quantityOnHand).toBe(20);

    const cancelResponse = await request(app)
      .put(`/api/sales/${saleId}/cancel`)
      .send({ reason: "Test cancellation" });
    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.status).toBe(DocumentStatus.CANCELLED);

    inventory = await Inventory.findOne({
      productId: product._id,
      warehouseId,
    });
    expect(inventory?.quantityOnHand).toBe(30);
  });
});
