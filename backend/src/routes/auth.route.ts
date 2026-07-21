import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { refresh } from "../controllers/auth.controller.js";

const router = Router();

console.log("✅ Auth router loaded");

router.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

router.post("/login", authController.login);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

router.post(
    "/refresh",
    refresh
);


export default router;

