import { Product, IProduct } from "../models/Product";
import { PurchaseReceipt } from "../models/PurchaseReceipt";
import { Sale } from "../models/Sale";
import { DocumentStatus } from "../constants/enums";
import { ClientSession } from "mongoose";

export const create = async (
  productData: Partial<IProduct>,
  session?: ClientSession
): Promise<IProduct> => {
  const product = new Product(productData);
  return await product.save({ session });
};

export const findById = async (
  id: string,
  session?: ClientSession
): Promise<IProduct | null> => {
  return await Product.findById(id).session(session || null);
};

export const findAll = async (): Promise<IProduct[]> => {
  return await Product.find({ isActive: true });
};

export const updateById = async (
  id: string,
  updateData: Partial<IProduct>,
  session?: ClientSession
): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    session,
  });
};

export const findInUse = async (
  productId: string,
  session?: ClientSession
): Promise<boolean> => {
  const purchaseReceipt = await PurchaseReceipt.findOne({
    "lines.productId": productId,
    status: DocumentStatus.CONFIRMED,
  }).session(session || null);
  if (purchaseReceipt) return true;

  const sale = await Sale.findOne({
    "lines.productId": productId,
    status: DocumentStatus.CONFIRMED,
  }).session(session || null);
  return !!sale;
};

export const updateMany = async (
  filter: any,
  update: any,
  session?: ClientSession
) => {
  return await Product.updateMany(filter, update, { session });
};
