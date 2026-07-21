import type { Request, Response, NextFunction } from "express";
import { loginSchema } from "../validators/auth.validators.js";
import * as authService from "../services/auth.service.js";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.log("🔥 LOGIN CONTROLLER HIT");
  try {
    const body = loginSchema.parse(req.body);

    const user = await authService.login(
      body.email,
      body.password,
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { refreshToken } = req.body;

    const data = await authService.refresh(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
}
