import { Inventory } from "../models/Inventory";
import { InventorySerialized } from "../models/InventorySerialized";
import { InventoryLot } from "../models/InventoryLot";
import { InventoryExpirable } from "../models/InventoryExpirable";
import { ClientSession } from "mongoose";

export const findOne = async (filter: any, session?: ClientSession) => {
  return await Inventory.findOne(filter).session(session || null);
};

export const findSerialized = async (filter: any, session?: ClientSession) => {
  return await InventorySerialized.find(filter).session(session || null);
};

export const findOneLot = async (filter: any, session?: ClientSession) => {
  return await InventoryLot.findOne(filter).session(session || null);
};

export const findOneExpirable = async (
  filter: any,
  session?: ClientSession
) => {
  return await InventoryExpirable.findOne(filter).session(session || null);
};

export const findOneAndUpdate = async (
  filter: any,
  update: any,
  options: any
) => {
  return await Inventory.findOneAndUpdate(filter, update, options);
};

export const updateManySerialized = async (
  filter: any,
  update: any,
  options: any
) => {
  return await InventorySerialized.updateMany(filter, update, options);
};

export const findOneAndUpdateLot = async (
  filter: any,
  update: any,
  options: any
) => {
  return await InventoryLot.findOneAndUpdate(filter, update, options);
};

export const findOneAndUpdateExpirable = async (
  filter: any,
  update: any,
  options: any
) => {
  return await InventoryExpirable.findOneAndUpdate(filter, update, options);
};

export const insertManySerialized = async (entries: any[], options: any) => {
  return await InventorySerialized.insertMany(entries, options);
};
