import type { Options } from "swagger-jsdoc";
import { config } from "../config/env.config.js";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Odoo Helpdesk Replica API",
      version: "1.0.0",
      description: "Production-ready architecture for Odoo Helpdesk backend.",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}${config.API_PREFIX}`,
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/app.ts"],
};
