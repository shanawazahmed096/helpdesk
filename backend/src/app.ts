import express, { type Application } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/env.config.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthRouter from "./routes/health.route.js";
import { swaggerOptions } from "./swagger/swagger.config.js";
import authRouter from "./routes/auth.route.js";
import usersRouter from "./routes/users.routes.js";
import rolesRoutes from "./routes/roles.route.js";
import departmentRoutes from "./routes/department.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import ticketRoutes from "./routes/ticket.route.js";

const app: Application = express();

// 1. Global Middleware Security & Optimizations
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. HTTP Request Logger
app.use(requestLogger);

// 3. Rate Limiter
app.use(
  rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// 4. API Documentation
const specs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 5. Base Routing
app.use(config.API_PREFIX, healthRouter);
app.use(`${config.API_PREFIX}/auth`, authRouter);
app.use(`${config.API_PREFIX}/users`, usersRouter);
app.use("/api/v1/roles", rolesRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tickets", ticketRoutes);

// 6. 404 & Centralized Error Infrastructure
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
