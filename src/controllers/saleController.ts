import { Request, Response } from "express";
import { SaleService } from "../services/saleService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";
import { IUser } from "../models/User";

export class SaleController {
  private saleService = new SaleService();

  public createSale = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();

    const sale = await this.saleService.createSale(req.body, userId);
    sendResponse(res, 201, "Sale created successfully", sale);
  });

  public confirmSale = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const sale = await this.saleService.confirmSale(req.params.id, userId);
    sendResponse(res, 200, "Sale confirmed successfully", sale);
  });

  public cancelSale = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const sale = await this.saleService.cancelSale(
      req.params.id,
      userId,
      req.body.reason
    );
    sendResponse(res, 200, "Sale cancelled successfully", sale);
  });
}
