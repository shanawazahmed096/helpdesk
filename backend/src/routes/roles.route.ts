import { Router } from "express";

import { RolesController } from "../controllers/roles.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createRoleSchema,
  listRoleSchema,
  updateRoleSchema,
} from "../validators/roles.validator.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate(listRoleSchema),
  RolesController.findAll
);

router.get("/:id", RolesController.findById);

router.post(
  "/",
  authorize("ADMIN"),
  validate(createRoleSchema),
  RolesController.create
);

router.put(
  "/:id",
  authorize("ADMIN"),
  validate(updateRoleSchema),
  RolesController.update
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  RolesController.delete
);

export default router;