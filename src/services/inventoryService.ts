import { ProductTrackingType } from "../constants/enums";
import { ClientSession } from "mongoose";
import { InventoryRepository } from "../repositories/inventoryRepository";
import { ProductRepository } from "../repositories/productRepository";
import AppError from "../utils/AppError";

interface StockAdjustmentParams {
  productId: string;
  warehouseId: string;
  quantity: number;
  serialNumbers?: string[];
  lotCode?: string;
  expirationDate?: Date;
  session?: ClientSession;
}

export class InventoryService {
  private inventoryRepository = new InventoryRepository();
  private productRepository = new ProductRepository();

  checkAvailability = async (
    params: StockAdjustmentParams
  ): Promise<boolean> => {
    const {
      productId,
      warehouseId,
      quantity,
      serialNumbers,
      lotCode,
      expirationDate,
      session,
    } = params;

    const inventory = await this.inventoryRepository.findOne(
      { productId, warehouseId },
      session
    );
    if (!inventory || inventory.quantityOnHand < quantity) {
      return false;
    }

    const product = await this.productRepository.findById(productId, session);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    switch (product.trackingType) {
      case ProductTrackingType.SERIALIZED:
        if (!serialNumbers || serialNumbers.length !== quantity) {
          return false;
        }
        const existingSerials = await this.inventoryRepository.findSerialized(
          {
            serialNumber: { $in: serialNumbers },
            productId,
            warehouseId,
            isSold: false,
          },
          session
        );
        return existingSerials.length === quantity;

      case ProductTrackingType.LOT_TRACKED:
        if (!lotCode) return false;
        const lotInventory = await this.inventoryRepository.findOneLot(
          { productId, warehouseId, lotCode },
          session
        );
        return !!lotInventory && lotInventory.quantity >= quantity;

      case ProductTrackingType.EXPIRABLE:
        if (!expirationDate) return false;
        const expirableInventory =
          await this.inventoryRepository.findOneExpirable(
            { productId, warehouseId, expirationDate },
            session
          );
        return !!expirableInventory && expirableInventory.quantity >= quantity;

      default:
        return true;
    }
  };

  decreaseStock = async (params: StockAdjustmentParams) => {
    const {
      productId,
      warehouseId,
      quantity,
      serialNumbers,
      lotCode,
      expirationDate,
      session,
    } = params;

    const hasStock = await this.checkAvailability({ ...params, session });
    if (!hasStock) {
      throw new AppError("Insufficient stock.", 400);
    }

    const product = await this.productRepository.findById(productId, session);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await this.inventoryRepository.findOneAndUpdate(
      { productId, warehouseId },
      { $inc: { quantityOnHand: -quantity } },
      { session }
    );

    switch (product.trackingType) {
      case ProductTrackingType.SERIALIZED:
        await this.inventoryRepository.updateManySerialized(
          { serialNumber: { $in: serialNumbers! } },
          { isSold: true },
          { session }
        );
        break;

      case ProductTrackingType.LOT_TRACKED:
        await this.inventoryRepository.findOneAndUpdateLot(
          { productId, warehouseId, lotCode: lotCode! },
          { $inc: { quantity: -quantity } },
          { session }
        );
        break;

      case ProductTrackingType.EXPIRABLE:
        await this.inventoryRepository.findOneAndUpdateExpirable(
          { productId, warehouseId, expirationDate: expirationDate! },
          { $inc: { quantity: -quantity } },
          { session }
        );
        break;
    }
  };

  increaseStock = async (params: StockAdjustmentParams) => {
    const {
      productId,
      warehouseId,
      quantity,
      serialNumbers,
      lotCode,
      expirationDate,
      session,
    } = params;

    const product = await this.productRepository.findById(productId, session);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await this.inventoryRepository.findOneAndUpdate(
      { productId, warehouseId },
      { $inc: { quantityOnHand: quantity } },
      { upsert: true, new: true, session }
    );

    switch (product.trackingType) {
      case ProductTrackingType.SERIALIZED:
        if (!serialNumbers || serialNumbers.length !== quantity) {
          throw new AppError(
            "Serial numbers must match the quantity for serialized products.",
            400
          );
        }
        const serialEntries = serialNumbers.map((sn) => ({
          productId,
          warehouseId,
          serialNumber: sn,
        }));
        await this.inventoryRepository.insertManySerialized(serialEntries, {
          session,
        });
        break;

      case ProductTrackingType.LOT_TRACKED:
        if (!lotCode) {
          throw new AppError(
            "Lot code is required for lot-tracked products.",
            400
          );
        }
        await this.inventoryRepository.findOneAndUpdateLot(
          { productId, warehouseId, lotCode },
          { $inc: { quantity: quantity } },
          { upsert: true, new: true, session }
        );
        break;

      case ProductTrackingType.EXPIRABLE:
        if (!expirationDate) {
          throw new AppError(
            "Expiration date is required for expirable products.",
            400
          );
        }
        await this.inventoryRepository.findOneAndUpdateExpirable(
          { productId, warehouseId, expirationDate },
          { $inc: { quantity: quantity } },
          { upsert: true, new: true, session }
        );
        break;
    }
  };
}
