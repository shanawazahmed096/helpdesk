import { Router } from "express";
import { DepartmentController } from "../controllers/department.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  listDepartmentSchema,
} from "../validators/department.validators.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate(listDepartmentSchema),
  DepartmentController.findAll
);

router.get(
  "/:id",
  DepartmentController.findById
);

router.post(
  "/",
  authorize("ADMIN"),
  validate(createDepartmentSchema),
  DepartmentController.create
);

router.put(
  "/:id",
  authorize("ADMIN"),
  validate(updateDepartmentSchema),
  DepartmentController.update
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  DepartmentController.delete
);

export default router;