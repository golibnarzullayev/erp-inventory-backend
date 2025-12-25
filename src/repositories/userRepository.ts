import { User, IUser } from "../models/User";

export class UserRepository {
  public create = async (userData: Partial<IUser>): Promise<IUser> => {
    return await User.create(userData);
  };

  public findByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email }).select("+password");
  };

  public findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
  };
}
