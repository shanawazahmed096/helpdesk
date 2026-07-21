import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.util.js";
export declare const errorHandler: (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
//# sourceMappingURL=error.middleware.d.ts.map
