import { IProduct } from "../models/Product";
import { ProductTrackingType } from "../constants/enums";
import AppError from "../utils/AppError";
import { ProductRepository } from "../repositories/productRepository";

export class ProductService {
  private productRepository = new ProductRepository();

  public createProduct = async (
    productData: Partial<IProduct>,
    userId: string
  ): Promise<IProduct> => {
    if (
      productData.trackingType === ProductTrackingType.VARIANT &&
      !productData.isVariant &&
      (!productData.variantAttributes ||
        Object.keys(productData.variantAttributes).length === 0)
    ) {
      throw new AppError("Variant parent must have variant attributes.", 400);
    }

    if (productData.isVariant && !productData.parentProductId) {
      throw new AppError("Variant child must have a parent product.", 400);
    }

    const productToCreate = { ...productData, createdBy: userId };
    return await this.productRepository.create(productToCreate);
  };

  public getProductById = async (id: string): Promise<IProduct> => {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  };

  public getAllProducts = async (): Promise<IProduct[]> => {
    return await this.productRepository.findAll();
  };

  public getAllWithPagination = async (options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    data: IProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 10, 100);
    const search = options.search || "";
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";

    const skip = (page - 1) * limit;

    // Build search filter
    let filter: any = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get total count
    const total = await this.productRepository.count(filter);

    // Get paginated results
    const data = await this.productRepository.findWithPagination(
      filter,
      sort,
      skip,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  };

  public updateProduct = async (
    id: string,
    updateData: Partial<IProduct>
  ): Promise<IProduct> => {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const inUse = await this.productRepository.findInUse(id);

    if (inUse) {
      if (
        updateData.trackingType &&
        updateData.trackingType !== product.trackingType
      ) {
        throw new AppError(
          "Cannot change tracking type of a product that has been used.",
          400
        );
      }

      if (updateData.sku && updateData.sku !== product.sku) {
        throw new AppError(
          "Cannot change SKU of a product that has been used.",
          400
        );
      }
    }

    const updatedProduct = await this.productRepository.updateById(
      id,
      updateData
    );
    if (!updatedProduct) {
      throw new AppError("Product not found after update.", 404);
    }
    return updatedProduct;
  };

  public softDeleteProduct = async (id: string): Promise<IProduct> => {
    const productToDeactivate = await this.productRepository.findById(id);
    if (!productToDeactivate) {
      throw new AppError("Product not found", 404);
    }

    const inUse = await this.productRepository.findInUse(id);
    if (inUse) {
      const updatedProduct = await this.productRepository.updateById(id, {
        isActive: false,
      });
      if (!updatedProduct) {
        throw new AppError("Product not found after update.", 404);
      }
      return updatedProduct;
    } else {
      if (
        productToDeactivate.trackingType === ProductTrackingType.VARIANT &&
        !productToDeactivate.isVariant
      ) {
        await this.productRepository.updateMany(
          { parentProductId: id },
          { isActive: false }
        );
      }
      const updatedProduct = await this.productRepository.updateById(id, {
        isActive: false,
      });
      if (!updatedProduct) {
        throw new AppError("Product not found after update.", 404);
      }
      return updatedProduct;
    }
  };
}
