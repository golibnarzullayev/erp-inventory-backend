import { Request, Response } from "express";
import { PurchaseReceiptService } from "../services/purchaseReceiptService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";
import { IUser } from "../models/User";

export class PurchaseReceiptController {
  private purchaseReceiptService = new PurchaseReceiptService();

  public createPurchaseReceipt = catchAsync(
    async (req: Request, res: Response) => {
      const userId = (req.user as IUser)._id.toString();

      const receipt = await this.purchaseReceiptService.createPurchaseReceipt(
        req.body,
        userId
      );
      sendResponse(res, 201, "Purchase receipt created successfully", receipt);
    }
  );

  public confirmPurchaseReceipt = catchAsync(
    async (req: Request, res: Response) => {
      const userId = (req.user as IUser)._id.toString();

      const receipt = await this.purchaseReceiptService.confirmPurchaseReceipt(
        req.params.id,
        userId
      );
      sendResponse(
        res,
        200,
        "Purchase receipt confirmed successfully",
        receipt
      );
    }
  );

  public cancelPurchaseReceipt = catchAsync(
    async (req: Request, res: Response) => {
      const userId = (req.user as IUser)._id.toString();

      const receipt = await this.purchaseReceiptService.cancelPurchaseReceipt(
        req.params.id,
        userId,
        req.body.reason
      );
      sendResponse(
        res,
        200,
        "Purchase receipt cancelled successfully",
        receipt
      );
    }
  );
}
