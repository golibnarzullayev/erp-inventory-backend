import { Request } from "express";
import { IUser } from "../models/User";

export interface AuditFields {
  createdBy: string;
  createdAt: Date;
  confirmedBy?: string;
  confirmedAt?: Date;
  cancelledBy?: string;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface ApiError {
  errorCode: string;
  message: string;
  field?: string;
}

export interface IRequest extends Request {
  user: IUser;
}
