import type { IAppError } from "../interfaces/error.interface.js";
export declare class AppError extends Error implements IAppError {
  readonly statusCode: number;
  readonly isOperational: boolean;
  constructor(message: string, statusCode: number, isOperational?: boolean);
}
//# sourceMappingURL=app-error.util.d.ts.map
