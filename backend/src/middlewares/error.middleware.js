import { AppError } from "../utils/app-error.util.js";
import { logger } from "../logger/winston.logger.js";
export const errorHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    logger.error(`Unhandled Exception: ${err.message}\nStack: ${err.stack}`);
  }
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
//# sourceMappingURL=error.middleware.js.map
