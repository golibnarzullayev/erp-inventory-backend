import { Router } from "express";
import passport from "passport";
import * as saleController from "../controllers/saleController";
import { validate } from "../middlewares/validate";
import {
  createSaleSchema,
  confirmOrCancelSchema,
  cancelSaleSchema,
} from "../utils/validationSchemas";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(createSaleSchema),
  saleController.createSale
);

router.put(
  "/:id/confirm",
  passport.authenticate("jwt", { session: false }),
  validate(confirmOrCancelSchema),
  saleController.confirmSale
);

router.put(
  "/:id/cancel",
  passport.authenticate("jwt", { session: false }),
  validate(cancelSaleSchema),
  saleController.cancelSale
);

export default router;
