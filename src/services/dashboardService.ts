import { Sale } from "../models/Sale";
import { PurchaseReceipt } from "../models/PurchaseReceipt";
import { Product } from "../models/Product";
import { Inventory } from "../models/Inventory";
import { DocumentStatus } from "../constants/enums";

interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export const getSalesSummary = async (filters: DateRangeFilter) => {
  const { startDate, endDate } = filters;

  const matchStage: any = { status: DocumentStatus.CONFIRMED };
  if (startDate || endDate) {
    matchStage.saleDate = {};
    if (startDate) matchStage.saleDate.$gte = new Date(startDate);
    if (endDate) matchStage.saleDate.$lte = new Date(endDate);
  }

  const summary = await Sale.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSalesAmount: {
          $sum: {
            $sum: {
              $map: {
                input: "$lines",
                as: "line",
                in: { $multiply: ["$$line.quantity", "$$line.unitPrice"] },
              },
            },
          },
        },
        salesCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalSalesAmount: 1,
        salesCount: 1,
        averageSaleValue: {
          $cond: [
            { $eq: ["$salesCount", 0] },
            0,
            { $divide: ["$totalSalesAmount", "$salesCount"] },
          ],
        },
      },
    },
  ]);

  return (
    summary[0] || { totalSalesAmount: 0, salesCount: 0, averageSaleValue: 0 }
  );
};

export const getDailySalesChart = async (filters: DateRangeFilter) => {
  const { startDate, endDate } = filters;

  const matchStage: any = { status: DocumentStatus.CONFIRMED };
  if (startDate || endDate) {
    matchStage.saleDate = {};
    if (startDate) matchStage.saleDate.$gte = new Date(startDate);
    if (endDate) matchStage.saleDate.$lte = new Date(endDate);
  }

  const chartData = await Sale.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
        total_amount: {
          $sum: {
            $sum: {
              $map: {
                input: "$lines",
                as: "line",
                in: { $multiply: ["$$line.quantity", "$$line.unitPrice"] },
              },
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        total_amount: 1,
        count: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return chartData;
};

export const getTopProducts = async (
  filters: DateRangeFilter & { limit?: number }
) => {
  const { startDate, endDate, limit = 5 } = filters;

  const matchStage: any = { status: DocumentStatus.CONFIRMED };
  if (startDate || endDate) {
    matchStage.saleDate = {};
    if (startDate) matchStage.saleDate.$gte = new Date(startDate);
    if (endDate) matchStage.saleDate.$lte = new Date(endDate);
  }

  const topProducts = await Sale.aggregate([
    { $match: matchStage },
    { $unwind: "$lines" },
    {
      $group: {
        _id: "$lines.productId",
        totalQuantitySold: { $sum: "$lines.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$lines.quantity", "$lines.unitPrice"] },
        },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: { $arrayElemAt: ["$productInfo.name", 0] },
        totalQuantitySold: 1,
        totalRevenue: 1,
      },
    },
  ]);

  return topProducts;
};

export const getInventorySummary = async () => {
  const totalSKUs = await Product.countDocuments({ isActive: true });
  const totalStock = await Inventory.aggregate([
    { $group: { _id: null, total: { $sum: "$quantityOnHand" } } },
  ]);

  const lowStockProducts = await Product.aggregate([
    { $match: { isActive: true, minStockLevel: { $gt: 0 } } },
    {
      $lookup: {
        from: "inventories",
        localField: "_id",
        foreignField: "productId",
        as: "inventoryInfo",
      },
    },
    {
      $project: {
        name: 1,
        sku: 1,
        minStockLevel: 1,
        quantityOnHand: { $sum: "$inventoryInfo.quantityOnHand" },
      },
    },
    { $match: { $expr: { $lt: ["$quantityOnHand", "$minStockLevel"] } } },
  ]);

  return {
    totalSKUs,
    totalStock: totalStock[0]?.total || 0,
    lowStockProducts,
  };
};

export const getPurchaseSummary = async (filters: DateRangeFilter) => {
  const { startDate, endDate } = filters;

  const matchStage: any = { status: DocumentStatus.CONFIRMED };
  if (startDate || endDate) {
    matchStage.receiptDate = {};
    if (startDate) matchStage.receiptDate.$gte = new Date(startDate);
    if (endDate) matchStage.receiptDate.$lte = new Date(endDate);
  }

  const summary = await PurchaseReceipt.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPurchaseAmount: {
          $sum: {
            $sum: {
              $map: {
                input: "$lines",
                as: "line",
                in: { $multiply: ["$$line.quantity", "$$line.unitPrice"] },
              },
            },
          },
        },
        receiptCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalPurchaseAmount: 1,
        receiptCount: 1,
      },
    },
  ]);

  return summary[0] || { totalPurchaseAmount: 0, receiptCount: 0 };
};
