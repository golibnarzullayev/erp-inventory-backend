import { Inventory } from "../models/Inventory";
import { InventorySerialized } from "../models/InventorySerialized";
import { InventoryLot } from "../models/InventoryLot";
import { InventoryExpirable } from "../models/InventoryExpirable";
import { ClientSession } from "mongoose";

export class InventoryRepository {
  findOne = async (filter: any, session?: ClientSession) => {
    return await Inventory.findOne(filter).session(session || null);
  };

  findSerialized = async (filter: any, session?: ClientSession) => {
    return await InventorySerialized.find(filter).session(session || null);
  };

  findOneLot = async (filter: any, session?: ClientSession) => {
    return await InventoryLot.findOne(filter).session(session || null);
  };

  findOneExpirable = async (filter: any, session?: ClientSession) => {
    return await InventoryExpirable.findOne(filter).session(session || null);
  };

  findOneAndUpdate = async (filter: any, update: any, options: any) => {
    return await Inventory.findOneAndUpdate(filter, update, options);
  };

  updateManySerialized = async (filter: any, update: any, options: any) => {
    return await InventorySerialized.updateMany(filter, update, options);
  };

  findOneAndUpdateLot = async (filter: any, update: any, options: any) => {
    return await InventoryLot.findOneAndUpdate(filter, update, options);
  };

  findOneAndUpdateExpirable = async (
    filter: any,
    update: any,
    options: any
  ) => {
    return await InventoryExpirable.findOneAndUpdate(filter, update, options);
  };

  insertManySerialized = async (entries: any[], options: any) => {
    return await InventorySerialized.insertMany(entries, options);
  };
}
