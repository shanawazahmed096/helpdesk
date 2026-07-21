import { AppError } from "../utils/app-error.util.js";
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};
//# sourceMappingURL=not-found.middleware.js.map
