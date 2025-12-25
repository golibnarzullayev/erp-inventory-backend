import { Router } from "express";
import passport from "passport";
import { ProductController } from "../controllers/productController";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductSchema,
} from "../utils/validationSchemas";

export class ProductRoutes {
  private router = Router();
  private productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      passport.authenticate("jwt", { session: false }),
      validate(createProductSchema),
      this.productController.createProduct
    );
    this.router.get(
      "/:id",
      validate(getProductSchema),
      this.productController.getProductById
    );
    this.router.get("/", this.productController.getAllWithPagination);
    this.router.put(
      "/:id",
      passport.authenticate("jwt", { session: false }),
      validate(updateProductSchema),
      this.productController.updateProduct
    );
    this.router.delete(
      "/:id",
      passport.authenticate("jwt", { session: false }),
      validate(deleteProductSchema),
      this.productController.deleteProduct
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new ProductRoutes().getRouter();
