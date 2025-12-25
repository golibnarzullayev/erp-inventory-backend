import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { UserRepository } from "../repositories/userRepository";
import AppError from "../utils/AppError";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  private userRepository = new UserRepository();

  private signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: "90d",
    });
  };

  register = async (
    userData: Partial<IUser>
  ): Promise<{ token: string; user: IUser }> => {
    const newUser = await this.userRepository.create(userData);
    const token = this.signToken(newUser._id.toString());
    newUser.password = "";
    return { token, user: newUser };
  };

  login = async (
    email: string,
    password: string
  ): Promise<{ token: string; user: IUser }> => {
    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    const user = await this.userRepository.findByEmail(email);

    const comparePassword = await user?.comparePassword(password);
    if (!user || !comparePassword) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = this.signToken(user._id.toString());
    user.password = "";
    return { token, user };
  };
}
