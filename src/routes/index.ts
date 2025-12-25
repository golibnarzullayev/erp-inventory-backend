import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import purchaseReceiptRoutes from "./purchaseReceiptRoutes";
import saleRoutes from "./saleRoutes";
import dashboardRoutes from "./dashboardRoutes";

export class RoutesIndex {
  private router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/auth", authRoutes);
    this.router.use("/products", productRoutes);
    this.router.use("/purchase-receipts", purchaseReceiptRoutes);
    this.router.use("/sales", saleRoutes);
    this.router.use("/dashboard", dashboardRoutes);
  }

  getRouter() {
    return this.router;
  }
}

export default new RoutesIndex().getRouter();
