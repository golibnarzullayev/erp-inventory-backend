import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export const validate =
  (schema: z.ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: issue.message,
          field: issue.path.join("."),
        }));
        return res.status(400).json({ errors: errorMessages });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
