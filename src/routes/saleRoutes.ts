import { Router } from "express";
import passport from "passport";
import { SaleController } from "../controllers/saleController";
import { validate } from "../middlewares/validate";
import {
  createSaleSchema,
  confirmOrCancelSchema,
  cancelSaleSchema,
} from "../utils/validationSchemas";

export class SaleRoutes {
  private router = Router();
  private saleController = new SaleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      passport.authenticate("jwt", { session: false }),
      validate(createSaleSchema),
      this.saleController.createSale
    );

    this.router.put(
      "/:id/confirm",
      passport.authenticate("jwt", { session: false }),
      validate(confirmOrCancelSchema),
      this.saleController.confirmSale
    );

    this.router.put(
      "/:id/cancel",
      passport.authenticate("jwt", { session: false }),
      validate(cancelSaleSchema),
      this.saleController.cancelSale
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new SaleRoutes().getRouter();
