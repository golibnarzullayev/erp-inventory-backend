import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";
import { IUser } from "../models/User";

export class ProductController {
  private productService = new ProductService();

  public createProduct = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id.toString();

    const product = await this.productService.createProduct(req.body, userId);
    sendResponse(res, 201, "Product created successfully", product);
  });

  public getProductById = catchAsync(async (req: Request, res: Response) => {
    const product = await this.productService.getProductById(req.params.id);
    sendResponse(res, 200, "Product retrieved successfully", product);
  });

  public getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();
    sendResponse(res, 200, "Products retrieved successfully", products);
  });

  public updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await this.productService.updateProduct(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, "Product updated successfully", product);
  });

  public deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await this.productService.softDeleteProduct(req.params.id);
    sendResponse(res, 200, "Product deleted successfully", product);
  });
}
