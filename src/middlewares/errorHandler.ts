import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { sendResponse } from "../utils/responseHandler";

const handleDevError = (err: AppError, res: Response) => {
  sendResponse(res, err.statusCode, err.message, { stack: err.stack });
};

const handleProdError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    sendResponse(res, err.statusCode, err.message);
  } else {
    console.error("ERROR 💥", err);
    sendResponse(res, 500, "Something went very wrong!");
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    handleDevError(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    handleProdError(error, res);
  }
};
