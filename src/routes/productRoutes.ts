import { Router } from "express";
import passport from "passport";
import * as productController from "../controllers/productController";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductSchema,
} from "../utils/validationSchemas";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(createProductSchema),
  productController.createProduct
);
router.get(
  "/:id",
  validate(getProductSchema),
  productController.getProductById
);
router.get("/", productController.getAllProducts);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(deleteProductSchema),
  productController.deleteProduct
);

export default router;
