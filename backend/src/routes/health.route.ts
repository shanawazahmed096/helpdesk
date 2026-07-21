import { Router, type Request, type Response } from "express";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     description: Returns the health status of the application
 *     responses:
 *       200:
 *         description: Application up and running.
 */
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
