import type { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service.js";

export const DashboardController = {
  async getSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await DashboardService.getSummary();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getStatusCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await DashboardService.getStatusCounts();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPriorityCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await DashboardService.getPriorityCounts();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getDepartmentCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await DashboardService.getDepartmentCounts();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await DashboardService.getCategoryCounts();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getRecentTickets(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = req.query.limit
        ? Number(req.query.limit)
        : 10;

      const data = await DashboardService.getRecentTickets(limit);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getRecentActivities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = req.query.limit
        ? Number(req.query.limit)
        : 10;

      const data = await DashboardService.getRecentActivities(limit);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAgentPerformance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await DashboardService.getAgentPerformance();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};