import { PurchaseReceipt, IPurchaseReceipt } from "../models/PurchaseReceipt";
import { ClientSession } from "mongoose";

export const create = async (
  receiptData: Partial<IPurchaseReceipt>
): Promise<IPurchaseReceipt> => {
  const receipt = new PurchaseReceipt(receiptData);
  return await receipt.save();
};

export const findById = async (
  id: string,
  session?: ClientSession
): Promise<IPurchaseReceipt | null> => {
  return await PurchaseReceipt.findById(id).session(session || null);
};

export const save = async (
  receipt: IPurchaseReceipt,
  session?: ClientSession
): Promise<IPurchaseReceipt> => {
  return await receipt.save({ session });
};
