import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.util.js";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};
