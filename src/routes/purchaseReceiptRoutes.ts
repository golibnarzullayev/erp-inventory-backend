import { Router } from "express";
import passport from "passport";
import { PurchaseReceiptController } from "../controllers/purchaseReceiptController";
import { validate } from "../middlewares/validate";
import {
  createPurchaseReceiptSchema,
  confirmOrCancelSchema,
  cancelPurchaseReceiptSchema,
} from "../utils/validationSchemas";

export class PurchaseReceiptRoutes {
  private router = Router();
  private purchaseReceiptController = new PurchaseReceiptController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      passport.authenticate("jwt", { session: false }),
      validate(createPurchaseReceiptSchema),
      this.purchaseReceiptController.createPurchaseReceipt
    );

    this.router.put(
      "/:id/confirm",
      passport.authenticate("jwt", { session: false }),
      validate(confirmOrCancelSchema),
      this.purchaseReceiptController.confirmPurchaseReceipt
    );

    this.router.put(
      "/:id/cancel",
      passport.authenticate("jwt", { session: false }),
      validate(cancelPurchaseReceiptSchema),
      this.purchaseReceiptController.cancelPurchaseReceipt
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new PurchaseReceiptRoutes().getRouter();
