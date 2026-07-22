import { Router } from "express";

import { ActivityController } from "../controllers/activity.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createActivitySchema,
  activityIdSchema,
  ticketActivitySchema,
  recentActivitySchema,
} from "../validators/activity.validator.js";

const router = Router();

router.post(
  "/",
  validate(createActivitySchema),
  ActivityController.create
);

router.get(
  "/recent",
  validate(recentActivitySchema),
  ActivityController.findRecent
);

router.get(
  "/ticket/:ticketId",
  validate(ticketActivitySchema),
  ActivityController.findByTicketId
);

router.get(
  "/:id",
  validate(activityIdSchema),
  ActivityController.findById
);

router.delete(
  "/:id",
  validate(activityIdSchema),
  ActivityController.delete
);

export default router;