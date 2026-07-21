import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsed = await schema.parseAsync({
          body: req.body,
          params: req.params,
          query: req.query,
        });

        if (parsed.body) {
          req.body = parsed.body;
        }

        if (parsed.params) {
          Object.assign(req.params, parsed.params);
        }

        if (parsed.query) {
          Object.assign(req.query, parsed.query);
        }

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.flatten(),
          });
        }

        next(error);
      }
    };