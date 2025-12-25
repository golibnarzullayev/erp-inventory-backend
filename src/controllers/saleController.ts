import { Request, Response } from "express";
import { IUser } from "../models/User";
import { SaleService } from "../services/saleService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export class SaleController {
  private saleService = new SaleService();

  createSale = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const sale = await this.saleService.createSale(req.body, userId);
    sendResponse(res, 201, "Sale created successfully", sale);
  });

  confirmSale = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const { id } = req.params;
    const sale = await this.saleService.confirmSale(id, userId);
    sendResponse(res, 200, "Sale confirmed successfully", sale);
  });

  cancelSale = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const { id } = req.params;
    const { reason } = req.body;
    const sale = await this.saleService.cancelSale(id, userId, reason);
    sendResponse(res, 200, "Sale cancelled successfully", sale);
  });
}
