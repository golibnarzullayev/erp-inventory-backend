import { Document } from "mongoose";
import { DocumentStatus } from "../constants/enums";
import { AuditFields } from "./common";

export interface BaseDocument extends Document, AuditFields {
  status: DocumentStatus;
}
