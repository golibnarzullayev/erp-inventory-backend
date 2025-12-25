import { Request, Response } from "express";
import { IUser } from "../models/User";
import * as saleService from "../services/saleService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export const createSale = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)._id.toString();
  const sale = await saleService.createSale(req.body, userId);
  sendResponse(res, 201, "Sale created successfully", sale);
});

export const confirmSale = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)._id.toString();
  const { id } = req.params;
  const sale = await saleService.confirmSale(id, userId);
  sendResponse(res, 200, "Sale confirmed successfully", sale);
});

export const cancelSale = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)._id.toString();
  const { id } = req.params;
  const { reason } = req.body;
  const sale = await saleService.cancelSale(id, userId, reason);
  sendResponse(res, 200, "Sale cancelled successfully", sale);
});
