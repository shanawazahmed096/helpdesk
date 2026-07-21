import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createTicketSchema,
  updateTicketSchema,
  changeStatusSchema,
  assignTicketSchema,
} from "../validators/ticket.validators.js";

const router = Router();

router.use(authenticate);

// Get all tickets
router.get("/", TicketController.findAll);

// Get ticket by ID
router.get("/:id", TicketController.findById);

// Create ticket
router.post(
  "/",
  authorize("ADMIN", "MANAGER"),
  validate(createTicketSchema),
  TicketController.create
);

// Update ticket
router.put(
  "/:id",
  authorize("ADMIN", "MANAGER"),
  validate(updateTicketSchema),
  TicketController.update
);

// Delete ticket (Soft Delete)
router.delete(
  "/:id",
  authorize("ADMIN"),
  TicketController.delete
);

// Change ticket status
router.patch(
  "/:id/status",
  authorize("ADMIN", "MANAGER", "AGENT"),
  validate(changeStatusSchema),
  TicketController.changeStatus
);

// Assign ticket
router.patch(
  "/:id/assign",
  authorize("ADMIN", "MANAGER"),
  validate(assignTicketSchema),
  TicketController.assign
);

export default router;