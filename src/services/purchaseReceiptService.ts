import { withTransaction } from "../utils/transaction";
import { IPurchaseReceipt } from "../models/PurchaseReceipt";
import { ProductRepository } from "../repositories/productRepository";
import { PurchaseReceiptRepository } from "../repositories/purchaseReceiptRepository";
import { DocumentStatus, ProductTrackingType } from "../constants/enums";
import { InventoryService } from "./inventoryService";
import AppError from "../utils/AppError";

export class PurchaseReceiptService {
  private productRepository = new ProductRepository();
  private purchaseReceiptRepository = new PurchaseReceiptRepository();
  private inventoryService = new InventoryService();

  createPurchaseReceipt = async (
    receiptData: Partial<IPurchaseReceipt>,
    userId: string
  ): Promise<IPurchaseReceipt> => {
    if (!receiptData.lines || receiptData.lines.length === 0) {
      throw new AppError("Purchase receipt must have at least one line.", 400);
    }

    for (const line of receiptData.lines) {
      const product = await this.productRepository.findById(
        line.productId.toString()
      );
      if (!product) {
        throw new AppError(`Product with ID ${line.productId} not found.`, 404);
      }

      if (
        product.trackingType === ProductTrackingType.VARIANT &&
        !product.isVariant
      ) {
        throw new AppError(
          `Cannot add a variant parent product to a purchase receipt.`,
          400
        );
      }

      switch (product.trackingType) {
        case ProductTrackingType.EXPIRABLE:
          if (!line.expirationDate) {
            throw new AppError(
              `Expiration date is required for product ${product.name}.`,
              400
            );
          }
          break;
        case ProductTrackingType.LOT_TRACKED:
          if (!line.lotCode) {
            throw new AppError(
              `Lot code is required for product ${product.name}.`,
              400
            );
          }
          break;
        case ProductTrackingType.SERIALIZED:
          if (
            !line.serialNumbers ||
            line.serialNumbers.length !== line.quantity
          ) {
            throw new AppError(
              `The number of serial numbers must match the quantity for product ${product.name}.`,
              400
            );
          }
          break;
      }
    }

    const receiptToCreate = { ...receiptData, createdBy: userId };
    return await this.purchaseReceiptRepository.create(receiptToCreate);
  };

  confirmPurchaseReceipt = async (
    receiptId: string,
    userId: string
  ): Promise<IPurchaseReceipt> => {
    return withTransaction(async (session) => {
      const receipt = await this.purchaseReceiptRepository.findById(
        receiptId,
        session
      );

      if (!receipt) {
        throw new AppError("Purchase receipt not found.", 404);
      }

      if (receipt.status !== DocumentStatus.DRAFT) {
        throw new AppError(
          "Only DRAFT purchase receipts can be confirmed.",
          400
        );
      }

      for (const line of receipt.lines) {
        await this.inventoryService.increaseStock({
          productId: line.productId.toString(),
          warehouseId: receipt.warehouseId.toString(),
          quantity: line.quantity,
          serialNumbers: line.serialNumbers,
          lotCode: line.lotCode,
          expirationDate: line.expirationDate,
          session,
        });
      }

      receipt.status = DocumentStatus.CONFIRMED;
      receipt.confirmedBy = userId;
      receipt.confirmedAt = new Date();

      await this.purchaseReceiptRepository.save(receipt, session);
      return receipt;
    });
  };

  cancelPurchaseReceipt = async (
    receiptId: string,
    userId: string,
    reason: string
  ): Promise<IPurchaseReceipt> => {
    return withTransaction(async (session) => {
      const receipt = await this.purchaseReceiptRepository.findById(
        receiptId,
        session
      );

      if (!receipt) {
        throw new AppError("Purchase receipt not found.", 404);
      }

      if (receipt.status === DocumentStatus.CANCELLED) {
        throw new AppError(
          "This purchase receipt has already been cancelled.",
          400
        );
      }

      if (receipt.status === DocumentStatus.CONFIRMED) {
        for (const line of receipt.lines) {
          await this.inventoryService.decreaseStock({
            productId: line.productId.toString(),
            warehouseId: receipt.warehouseId.toString(),
            quantity: line.quantity,
            serialNumbers: line.serialNumbers,
            lotCode: line.lotCode,
            expirationDate: line.expirationDate,
            session,
          });
        }
      }

      receipt.status = DocumentStatus.CANCELLED;
      receipt.cancelledBy = userId;
      receipt.cancelledAt = new Date();
      receipt.cancellationReason = reason;

      await this.purchaseReceiptRepository.save(receipt, session);
      return receipt;
    });
  };
}
