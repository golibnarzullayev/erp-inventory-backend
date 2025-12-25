import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController";
import { validate } from "../middlewares/validate";
import { dateRangeFilterSchema } from "../utils/validationSchemas";

export class DashboardRoutes {
  private router = Router();
  private dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/sales-summary",
      validate(dateRangeFilterSchema),
      this.dashboardController.getSalesSummary
    );

    this.router.get(
      "/daily-sales-chart",
      validate(dateRangeFilterSchema),
      this.dashboardController.getDailySalesChart
    );

    this.router.get(
      "/top-products",
      validate(dateRangeFilterSchema),
      this.dashboardController.getTopProducts
    );
    this.router.get(
      "/inventory-summary",
      this.dashboardController.getInventorySummary
    );
    this.router.get(
      "/purchase-summary",
      validate(dateRangeFilterSchema),
      this.dashboardController.getPurchaseSummary
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new DashboardRoutes().getRouter();
