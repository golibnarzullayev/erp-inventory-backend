import { Response } from "express";

interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const response: IResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };
  res.status(statusCode).json(response);
};
