import type { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service.js";

type CategoryParams = {
  id: string;
};

export class CategoryController {
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
        isActive,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await CategoryService.findAll(
        Number(page),
        Number(limit),
        search as string,
        isActive !== undefined ? isActive === "true" : undefined,
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
    req: Request<CategoryParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: category,
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
      const category = await CategoryService.create(req.body);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request<CategoryParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category = await CategoryService.update(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request<CategoryParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CategoryService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}