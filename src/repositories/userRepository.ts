import { User, IUser } from "../models/User";

export class UserRepository {
  create = async (userData: Partial<IUser>): Promise<IUser> => {
    return await User.create(userData);
  };

  findByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email }).select("+password");
  };

  findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
  };
}
