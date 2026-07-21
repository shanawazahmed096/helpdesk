import { logger } from "../logger/winston.logger.js";
export const requestLogger = (req, res, next) => {
  req.startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - (req.startTime || Date.now());
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
    );
  });
  next();
};
//# sourceMappingURL=logger.middleware.js.map
