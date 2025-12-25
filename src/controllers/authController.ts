import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export class AuthController {
  private authService = new AuthService();

  public register = catchAsync(async (req: Request, res: Response) => {
    const { token, user } = await this.authService.register(req.body);
    sendResponse(res, 201, "User registered successfully", { token, user });
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { token, user } = await this.authService.login(email, password);
    sendResponse(res, 200, "Logged in successfully", { token, user });
  });
}
