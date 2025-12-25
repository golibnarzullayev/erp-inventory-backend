import { User, IUser } from "../models/User";

export const create = async (userData: Partial<IUser>): Promise<IUser> => {
  return await User.create(userData);
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email }).select("+password");
};

export const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};
