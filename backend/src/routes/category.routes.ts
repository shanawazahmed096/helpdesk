import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  listCategorySchema,
} from "../validators/category.validators.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate(listCategorySchema),
  CategoryController.findAll
);

router.get(
  "/:id",
  CategoryController.findById
);

router.post(
  "/",
  authorize("ADMIN"),
  validate(createCategorySchema),
  CategoryController.create
);

router.put(
  "/:id",
  authorize("ADMIN"),
  validate(updateCategorySchema),
  CategoryController.update
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  CategoryController.delete
);

export default router;