import { Router } from "express";
import { AuthController } from "../controllers/authController";

export class AuthRoutes {
  private router = Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
  }

  getRouter() {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
