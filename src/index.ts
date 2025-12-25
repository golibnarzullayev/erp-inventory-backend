import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import routes from "./routes";
import passport from "./config/passport";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const mainSwagger = yaml.load(
  fs.readFileSync(path.join(__dirname, "docs/swagger.yml"), "utf8")
) as any;
const authPaths = yaml.load(
  fs.readFileSync(path.join(__dirname, "docs/auth.yml"), "utf8")
) as any;
const productsPaths = yaml.load(
  fs.readFileSync(path.join(__dirname, "docs/products.yml"), "utf8")
) as any;
const purchaseReceiptsPaths = yaml.load(
  fs.readFileSync(path.join(__dirname, "docs/purchaseReceipts.yml"), "utf8")
) as any;
const salesPaths = yaml.load(
  fs.readFileSync(path.join(__dirname, "docs/sales.yml"), "utf8")
) as any;
const dashboardPaths = yaml.load(
  fs.readFileSync(path.join(__dirname, "docs/dashboard.yml"), "utf8")
) as any;

const swaggerDocument = {
  ...mainSwagger,
  paths: {
    ...(authPaths.paths || {}),
    ...(productsPaths.paths || {}),
    ...(purchaseReceiptsPaths.paths || {}),
    ...(salesPaths.paths || {}),
    ...(dashboardPaths.paths || {}),
  },
};

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "ERP Backend is running! Visit <a href='/api-docs'>API Documentation</a>"
  );
});

app.use("/api", routes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
