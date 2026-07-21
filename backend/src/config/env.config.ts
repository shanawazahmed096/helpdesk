import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_PREFIX: process.env.API_PREFIX || "/api/v1",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "900000",
    10,
  ),
  RATE_LIMIT_MAX: parseInt(
    process.env.RATE_LIMIT_MAX || "100",
    10,
  ),

  // Authentication
  // JWT_SECRET:
  //   process.env.JWT_SECRET || "helpdesk_super_secret_key_2026",

  // JWT_REFRESH_SECRET:
  //   process.env.JWT_REFRESH_SECRET ||
  //   "helpdesk_refresh_secret_key_2026",

  // ACCESS_TOKEN_EXPIRES:
  //   process.env.ACCESS_TOKEN_EXPIRES || "15m",

  // REFRESH_TOKEN_EXPIRES:
  //   process.env.REFRESH_TOKEN_EXPIRES || "7d",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",

};


