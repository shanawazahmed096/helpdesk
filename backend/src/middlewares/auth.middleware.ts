import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing.",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token missing.",
            });
        }

        const payload = await verifyAccessToken(token);
        console.log("JWT Payload:", payload);

        req.user = {
            id: payload.sub as string,
            email: payload.email as string,
            role: payload.role as string,
        };
        console.log("req.user:", req.user);

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token.",
        });
    }
}