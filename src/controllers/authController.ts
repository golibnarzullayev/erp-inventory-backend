import { Request, Response } from "express";
import * as authService from "../services/authService";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/responseHandler";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { token, user } = await authService.register(req.body);
  sendResponse(res, 201, "User registered successfully", { token, user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);
  sendResponse(res, 200, "Logged in successfully", { token, user });
});
