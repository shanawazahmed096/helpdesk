import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { authenticate } from "../../../backend/src/middlewares/auth.middleware.js";
import { authorize } from "../../../backend/src/middlewares/authorize.middleware.js";
import { validate } from "../../../backend/src/middlewares/validate.middleware.js";
import { createUserSchema,updateUserSchema } from "../validators/users.validators.js";

const router = Router();

router.use(authenticate);

router.get("/", UsersController.findAll);

router.get("/:id", UsersController.findById);

router.post(
    "/",
    authorize("ADMIN"),
    validate(createUserSchema),
    UsersController.create
);

router.put(
    "/:id",
    authorize("ADMIN"),
    validate(updateUserSchema),
    UsersController.update
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  UsersController.delete
);

export default router;