import type { Response, NextFunction } from "express";
import type { CustomRequest } from "../types/index.js";
import { logger } from "../logger/winston.logger.js";

export const requestLogger = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  req.startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - (req.startTime || Date.now());
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
};
