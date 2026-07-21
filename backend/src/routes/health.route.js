import { Router } from "express";
const router = Router();
/**
 * @openapi
 * /health:
 * get:
 * description: Returns the health status of the application
 * responses:
 * 200:
 * description: Application up and running.
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
export default router;
//# sourceMappingURL=health.route.js.map
