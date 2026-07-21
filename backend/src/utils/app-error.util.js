export class AppError extends Error {
  statusCode;
  isOperational;
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
//# sourceMappingURL=app-error.util.js.map
