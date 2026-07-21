import app from "./app.js";
import { config } from "./config/env.config.js";
import { logger } from "./logger/winston.logger.js";
const server = app.listen(config.PORT, () => {
  logger.info(`==================================================`);
  logger.info(`  Server running in [${config.NODE_ENV}] mode`);
  logger.info(`  Listening on port: ${config.PORT}`);
  logger.info(`  API Docs available at: http://localhost:${config.PORT}/docs`);
  logger.info(`==================================================`);
});
const handleSystemTermination = (signal) => {
  logger.warn(`Received ${signal}. Gracefully shutting down server...`);
  server.close(() => {
    logger.info("HTTP Server closed safely.");
    process.exit(0);
  });
};
process.on("SIGTERM", () => handleSystemTermination("SIGTERM"));
process.on("SIGINT", () => handleSystemTermination("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error(
    `UNHANDLED REJECTION! Shutting down... Reason: ${reason.message}`,
  );
  server.close(() => {
    process.exit(1);
  });
});
//# sourceMappingURL=server.js.map
