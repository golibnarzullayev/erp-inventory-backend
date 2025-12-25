import { Request, Response } from "express";
import { IUser } from "../models/User";
import * as purchaseReceiptService from "../services/purchaseReceiptService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export const createPurchaseReceipt = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const receipt = await purchaseReceiptService.createPurchaseReceipt(
      req.body,
      userId
    );
    sendResponse(res, 201, "Purchase receipt created successfully", receipt);
  }
);

export const confirmPurchaseReceipt = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const { id } = req.params;
    const receipt = await purchaseReceiptService.confirmPurchaseReceipt(
      id,
      userId
    );
    sendResponse(res, 200, "Purchase receipt confirmed successfully", receipt);
  }
);

export const cancelPurchaseReceipt = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const { id } = req.params;
    const { reason } = req.body;
    const receipt = await purchaseReceiptService.cancelPurchaseReceipt(
      id,
      userId,
      reason
    );
    sendResponse(res, 200, "Purchase receipt cancelled successfully", receipt);
  }
);
