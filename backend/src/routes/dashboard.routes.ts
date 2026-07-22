import { Router } from "express";

import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/summary", DashboardController.getSummary);

router.get("/status", DashboardController.getStatusCounts);

router.get("/priority", DashboardController.getPriorityCounts);

router.get("/departments", DashboardController.getDepartmentCounts);

router.get("/categories", DashboardController.getCategoryCounts);

router.get("/recent-tickets", DashboardController.getRecentTickets);

router.get("/recent-activities", DashboardController.getRecentActivities);

router.get("/agents", DashboardController.getAgentPerformance);

export default router;