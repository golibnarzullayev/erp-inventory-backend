import { Request, Response } from "express";
import { DashboardService } from "../services/dashboardService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export class DashboardController {
  private dashboardService = new DashboardService();

  public getSalesSummary = catchAsync(async (req: Request, res: Response) => {
    const summary = await this.dashboardService.getSalesSummary(req.query);
    sendResponse(res, 200, "Sales summary retrieved successfully", summary);
  });

  public getDailySalesChart = catchAsync(
    async (req: Request, res: Response) => {
      const chartData = await this.dashboardService.getDailySalesChart(
        req.query
      );
      sendResponse(
        res,
        200,
        "Daily sales chart retrieved successfully",
        chartData
      );
    }
  );

  public getTopProducts = catchAsync(async (req: Request, res: Response) => {
    const topProducts = await this.dashboardService.getTopProducts(req.query);
    sendResponse(res, 200, "Top products retrieved successfully", topProducts);
  });

  public getInventorySummary = catchAsync(
    async (req: Request, res: Response) => {
      const summary = await this.dashboardService.getInventorySummary();
      sendResponse(
        res,
        200,
        "Inventory summary retrieved successfully",
        summary
      );
    }
  );

  public getPurchaseSummary = catchAsync(
    async (req: Request, res: Response) => {
      const summary = await this.dashboardService.getPurchaseSummary(req.query);
      sendResponse(
        res,
        200,
        "Purchase summary retrieved successfully",
        summary
      );
    }
  );
}
