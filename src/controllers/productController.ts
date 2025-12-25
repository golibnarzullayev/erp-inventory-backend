import { Request, Response } from "express";
import { IUser } from "../models/User";
import * as productService from "../services/productService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)._id.toString();
  const product = await productService.createProduct(req.body, userId);
  sendResponse(res, 201, "Product created successfully", product);
});

export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    const product = await productService.getProductById(req.params.id);
    sendResponse(res, 200, "Product retrieved successfully", product);
  }
);

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    sendResponse(res, 200, "Products retrieved successfully", products);
  }
);

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendResponse(res, 200, "Product updated successfully", product);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.softDeleteProduct(req.params.id);
  sendResponse(res, 200, "Product deactivated successfully");
});
