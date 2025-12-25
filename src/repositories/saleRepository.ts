import { Sale, ISale } from "../models/Sale";
import { ClientSession } from "mongoose";

export const create = async (saleData: Partial<ISale>): Promise<ISale> => {
  const sale = new Sale(saleData);
  return await sale.save();
};

export const findById = async (
  id: string,
  session?: ClientSession
): Promise<ISale | null> => {
  return await Sale.findById(id).session(session || null);
};

export const save = async (
  sale: ISale,
  session?: ClientSession
): Promise<ISale> => {
  return await sale.save({ session });
};
