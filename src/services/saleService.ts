import { withTransaction } from "../utils/transaction";
import { ISale } from "../models/Sale";
import * as productRepository from "../repositories/productRepository";
import * as saleRepository from "../repositories/saleRepository";
import { DocumentStatus, ProductTrackingType } from "../constants/enums";
import * as inventoryService from "./inventoryService";
import AppError from "../utils/AppError";

export const createSale = async (
  saleData: Partial<ISale>,
  userId: string
): Promise<ISale> => {
  if (!saleData.lines || saleData.lines.length === 0) {
    throw new AppError("Sale must have at least one line.", 400);
  }

  for (const line of saleData.lines) {
    const product = await productRepository.findById(line.productId.toString());
    if (!product) {
      throw new AppError(`Product with ID ${line.productId} not found.`, 404);
    }

    if (
      product.trackingType === ProductTrackingType.VARIANT &&
      !product.isVariant
    ) {
      throw new AppError("Cannot sell a variant parent product.", 400);
    }

    const hasStock = await inventoryService.checkAvailability({
      productId: line.productId.toString(),
      warehouseId: saleData.warehouseId!.toString(),
      quantity: line.quantity,
      serialNumbers: line.serialNumbers,
      lotCode: line.lotCode,
      expirationDate: line.expirationDate,
    });

    if (!hasStock) {
      throw new AppError(
        `Insufficient stock for product ${product.name}.`,
        400
      );
    }

    switch (product.trackingType) {
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

  const saleToCreate = { ...saleData, createdBy: userId };
  return await saleRepository.create(saleToCreate);
};

export const confirmSale = async (
  saleId: string,
  userId: string
): Promise<ISale> => {
  return withTransaction(async (session) => {
    const sale = await saleRepository.findById(saleId, session);

    if (!sale) {
      throw new AppError("Sale not found.", 404);
    }

    if (sale.status !== DocumentStatus.DRAFT) {
      throw new AppError("Only DRAFT sales can be confirmed.", 400);
    }

    for (const line of sale.lines) {
      const hasStock = await inventoryService.checkAvailability({
        productId: line.productId.toString(),
        warehouseId: sale.warehouseId.toString(),
        quantity: line.quantity,
        serialNumbers: line.serialNumbers,
        lotCode: line.lotCode,
        expirationDate: line.expirationDate,
        session,
      });

      if (!hasStock) {
        const product = await productRepository.findById(
          line.productId.toString(),
          session
        );
        throw new AppError(
          `Insufficient stock for product ${product?.name} at confirmation.`,
          400
        );
      }
    }

    for (const line of sale.lines) {
      await inventoryService.decreaseStock({
        productId: line.productId.toString(),
        warehouseId: sale.warehouseId.toString(),
        quantity: line.quantity,
        serialNumbers: line.serialNumbers,
        lotCode: line.lotCode,
        expirationDate: line.expirationDate,
        session,
      });
    }

    sale.status = DocumentStatus.CONFIRMED;
    sale.confirmedBy = userId;
    sale.confirmedAt = new Date();

    await saleRepository.save(sale, session);
    return sale;
  });
};

export const cancelSale = async (
  saleId: string,
  userId: string,
  reason: string
): Promise<ISale> => {
  return withTransaction(async (session) => {
    const sale = await saleRepository.findById(saleId, session);

    if (!sale) {
      throw new AppError("Sale not found.", 404);
    }

    if (sale.status === DocumentStatus.CANCELLED) {
      throw new AppError("This sale has already been cancelled.", 400);
    }

    if (sale.status === DocumentStatus.CONFIRMED) {
      for (const line of sale.lines) {
        await inventoryService.increaseStock({
          productId: line.productId.toString(),
          warehouseId: sale.warehouseId.toString(),
          quantity: line.quantity,
          serialNumbers: line.serialNumbers,
          lotCode: line.lotCode,
          expirationDate: line.expirationDate,
          session,
        });
      }
    }

    sale.status = DocumentStatus.CANCELLED;
    sale.cancelledBy = userId;
    sale.cancelledAt = new Date();
    sale.cancellationReason = reason;

    await saleRepository.save(sale, session);
    return sale;
  });
};
