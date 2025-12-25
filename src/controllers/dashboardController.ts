import { Request, Response } from "express";
import * as dashboardService from "../services/dashboardService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export const getSalesSummary = catchAsync(
  async (req: Request, res: Response) => {
    const summary = await dashboardService.getSalesSummary(req.query);
    sendResponse(res, 200, "Sales summary retrieved successfully", summary);
  }
);

export const getDailySalesChart = catchAsync(
  async (req: Request, res: Response) => {
    const chartData = await dashboardService.getDailySalesChart(req.query);
    sendResponse(
      res,
      200,
      "Daily sales chart retrieved successfully",
      chartData
    );
  }
);

export const getTopProducts = catchAsync(
  async (req: Request, res: Response) => {
    const topProducts = await dashboardService.getTopProducts(req.query);
    sendResponse(res, 200, "Top products retrieved successfully", topProducts);
  }
);

export const getInventorySummary = catchAsync(
  async (req: Request, res: Response) => {
    const summary = await dashboardService.getInventorySummary();
    sendResponse(res, 200, "Inventory summary retrieved successfully", summary);
  }
);

export const getPurchaseSummary = catchAsync(
  async (req: Request, res: Response) => {
    const summary = await dashboardService.getPurchaseSummary(req.query);
    sendResponse(res, 200, "Purchase summary retrieved successfully", summary);
  }
);
