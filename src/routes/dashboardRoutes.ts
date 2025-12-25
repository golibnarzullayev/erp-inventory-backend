import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController";
import { validate } from "../middlewares/validate";
import { dateRangeFilterSchema } from "../utils/validationSchemas";

const router = Router();

router.get(
  "/sales-summary",
  validate(dateRangeFilterSchema),
  dashboardController.getSalesSummary
);

router.get(
  "/daily-sales-chart",
  validate(dateRangeFilterSchema),
  dashboardController.getDailySalesChart
);

router.get(
  "/top-products",
  validate(dateRangeFilterSchema),
  dashboardController.getTopProducts
);
router.get("/inventory-summary", dashboardController.getInventorySummary);
router.get(
  "/purchase-summary",
  validate(dateRangeFilterSchema),
  dashboardController.getPurchaseSummary
);

export default router;
