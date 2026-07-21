import type { Request, Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service.js";

type DepartmentParams = {
  id: string;
};

export class DepartmentController {
  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        page = "1",
        limit = "10",
        search,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await DepartmentService.findAll(
        Number(page),
        Number(limit),
        search as string,
        sortBy as string,
        sortOrder as "asc" | "desc"
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(
    req: Request<DepartmentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const department = await DepartmentService.findById(
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const department = await DepartmentService.create(req.body);

      res.status(201).json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request<DepartmentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const department = await DepartmentService.update(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request<DepartmentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await DepartmentService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Department deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}