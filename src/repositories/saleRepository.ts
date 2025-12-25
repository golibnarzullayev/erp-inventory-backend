import { Sale, ISale } from "../models/Sale";
import { ClientSession } from "mongoose";

export class SaleRepository {
  public create = async (saleData: Partial<ISale>): Promise<ISale> => {
    const sale = new Sale(saleData);
    return await sale.save();
  };

  public findById = async (
    id: string,
    session?: ClientSession
  ): Promise<ISale | null> => {
    return await Sale.findById(id).session(session || null);
  };

  public save = async (
    sale: ISale,
    session?: ClientSession
  ): Promise<ISale> => {
    return await sale.save({ session });
  };
}
