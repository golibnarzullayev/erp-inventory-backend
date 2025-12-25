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

  public getAllWithPagination = catchAsync(
    async (req: Request, res: Response) => {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
      };

      const result = await this.productService.getAllWithPagination(options);
      sendResponse(res, 200, "Products retrieved successfully", result);
    }
  );

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
