import type { Response, NextFunction } from "express";
import type { CustomRequest } from "../types/index.js";
export declare const requestLogger: (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => void;
//# sourceMappingURL=logger.middleware.d.ts.map
