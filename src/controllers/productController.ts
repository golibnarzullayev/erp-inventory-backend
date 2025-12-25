import { Request, Response } from "express";
import { IUser } from "../models/User";
import { ProductService } from "../services/productService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export class ProductController {
  private productService = new ProductService();

  createProduct = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();
    const product = await this.productService.createProduct(req.body, userId);
    sendResponse(res, 201, "Product created successfully", product);
  });

  getProductById = catchAsync(async (req: Request, res: Response) => {
    const product = await this.productService.getProductById(req.params.id);
    sendResponse(res, 200, "Product retrieved successfully", product);
  });

  getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();
    sendResponse(res, 200, "Products retrieved successfully", products);
  });

  updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await this.productService.updateProduct(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, "Product updated successfully", product);
  });

  deleteProduct = catchAsync(async (req: Request, res: Response) => {
    await this.productService.softDeleteProduct(req.params.id);
    sendResponse(res, 200, "Product deactivated successfully");
  });
}
