import { z } from "zod";
import { ProductTrackingType } from "../constants/enums";

const params = {
  id: z.string().min(1, "Id parameter is required"),
};

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    unitOfMeasure: z.string().min(1, "Unit of measure is required"),
    trackingType: z.nativeEnum(ProductTrackingType),
    isVariant: z.boolean().optional(),
    parentProductId: z.string().optional(),
    variantAttributes: z.record(z.string(), z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object(params),
  body: z.object({
    name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    unitOfMeasure: z.string().min(1).optional(),
    trackingType: z.nativeEnum(ProductTrackingType).optional(),
    barcode: z.string().optional(),
    minStockLevel: z.number().optional(),
    salePriceDefault: z.number().optional(),
    purchasePriceDefault: z.number().optional(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object(params),
});

export const getProductSchema = z.object({
  params: z.object(params),
});

const purchaseReceiptLineSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  expirationDate: z.string().datetime().optional(),
  lotCode: z.string().optional(),
  serialNumbers: z.array(z.string()).optional(),
});

export const createPurchaseReceiptSchema = z.object({
  body: z.object({
    supplierId: z.string().min(1, "Supplier ID is required"),
    warehouseId: z.string().min(1, "Warehouse ID is required"),
    currency: z.string().min(1, "Currency is required"),
    lines: z
      .array(purchaseReceiptLineSchema)
      .min(1, "At least one line item is required"),
    receiptDate: z.string().datetime().optional(),
    invoiceNumber: z.string().optional(),
    comment: z.string().optional(),
  }),
});

export const confirmOrCancelSchema = z.object({
  params: z.object(params),
});

export const cancelPurchaseReceiptSchema = z.object({
  params: z.object(params),
  body: z.object({
    reason: z.string().min(1, "Cancellation reason is required"),
  }),
});

export const cancelSaleSchema = z.object({
  params: z.object(params),
  body: z.object({
    reason: z.string().min(1, "Cancellation reason is required"),
  }),
});

const saleLineSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  expirationDate: z.string().datetime().optional(),
  lotCode: z.string().optional(),
  serialNumbers: z.array(z.string()).optional(),
});

export const createSaleSchema = z.object({
  body: z.object({
    warehouseId: z.string().min(1, "Warehouse ID is required"),
    currency: z.string().min(1, "Currency is required"),
    lines: z.array(saleLineSchema).min(1, "At least one line item is required"),
    customerId: z.string().optional(),
    saleDate: z.string().datetime().optional(),
    paymentType: z.string().optional(),
    comment: z.string().optional(),
  }),
});

export const dateRangeFilterSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    limit: z.preprocess(
      (val) => Number(val),
      z.number().int().positive().optional()
    ),
  }),
});
