import { Request, Response } from "express";
import { IUser } from "../models/User";
import { PurchaseReceiptService } from "../services/purchaseReceiptService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export class PurchaseReceiptController {
  private purchaseReceiptService = new PurchaseReceiptService();

  createPurchaseReceipt = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const receipt = await this.purchaseReceiptService.createPurchaseReceipt(
      req.body,
      userId
    );
    sendResponse(res, 201, "Purchase receipt created successfully", receipt);
  });

  confirmPurchaseReceipt = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const { id } = req.params;
    const receipt = await this.purchaseReceiptService.confirmPurchaseReceipt(
      id,
      userId
    );
    sendResponse(res, 200, "Purchase receipt confirmed successfully", receipt);
  });

  cancelPurchaseReceipt = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const { id } = req.params;
    const { reason } = req.body;
    const receipt = await this.purchaseReceiptService.cancelPurchaseReceipt(
      id,
      userId,
      reason
    );
    sendResponse(res, 200, "Purchase receipt cancelled successfully", receipt);
  });
}
