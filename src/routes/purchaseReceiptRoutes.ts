import { Router } from "express";
import passport from "passport";
import * as purchaseReceiptController from "../controllers/purchaseReceiptController";
import { validate } from "../middlewares/validate";
import {
  createPurchaseReceiptSchema,
  confirmOrCancelSchema,
  cancelPurchaseReceiptSchema,
} from "../utils/validationSchemas";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(createPurchaseReceiptSchema),
  purchaseReceiptController.createPurchaseReceipt
);

router.put(
  "/:id/confirm",
  passport.authenticate("jwt", { session: false }),
  validate(confirmOrCancelSchema),
  purchaseReceiptController.confirmPurchaseReceipt
);

router.put(
  "/:id/cancel",
  passport.authenticate("jwt", { session: false }),
  validate(cancelPurchaseReceiptSchema),
  purchaseReceiptController.cancelPurchaseReceipt
);

export default router;
