import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Inventory } from "../models/Inventory";
import { InventoryService } from "../services/inventoryService";
import productRoutes from "../routes/productRoutes";
import saleRoutes from "../routes/saleRoutes";
import { ProductTrackingType, DocumentStatus } from "../constants/enums";

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

describe("Sales Flow", () => {
  const inventoryService = new InventoryService();

  it("should decrease stock when a sale is confirmed", async () => {
    const product = new Product({
      name: "Test Sale Product",
      sku: "TSP-001",
      unitOfMeasure: "unit",
      trackingType: ProductTrackingType.SIMPLE,
    });
    await product.save();

    const warehouseId = new mongoose.Types.ObjectId();
    await inventoryService.increaseStock({
      productId: product._id.toString(),
      warehouseId: warehouseId.toString(),
      quantity: 20,
    });

    // 2. Create a draft sale
    const saleData = {
      warehouseId,
      currency: "USD",
      lines: [
        {
          productId: product._id,
          quantity: 5,
          unitPrice: 150,
        },
      ],
    };

    const createResponse = await request(app).post("/api/sales").send(saleData);
    expect(createResponse.status).toBe(201);
    const saleId = createResponse.body._id;

    const confirmResponse = await request(app)
      .put(`/api/sales/${saleId}/confirm`)
      .send();
    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.status).toBe(DocumentStatus.CONFIRMED);

    const inventory = await Inventory.findOne({
      productId: product._id,
      warehouseId,
    });
    expect(inventory).not.toBeNull();
    expect(inventory?.quantityOnHand).toBe(15);
  });

  it("should not confirm a sale if stock is insufficient", async () => {
    const product = new Product({
      name: "Test No-Stock Product",
      sku: "TNSP-001",
      unitOfMeasure: "unit",
      trackingType: ProductTrackingType.SIMPLE,
    });
    await product.save();

    const saleData = {
      warehouseId: new mongoose.Types.ObjectId(),
      currency: "USD",
      lines: [
        {
          productId: product._id,
          quantity: 5,
          unitPrice: 150,
        },
      ],
    };

    const createResponse = await request(app).post("/api/sales").send(saleData);
    expect(createResponse.status).toBe(400);
  });
});
