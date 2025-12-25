import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import routes from "./routes";
import passport from "./config/passport";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (_req: Request, res: Response) => {
  res.send("ERP Backend is running!");
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
