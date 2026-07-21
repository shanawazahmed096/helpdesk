import type { Request, Response, NextFunction } from "express";
import { RolesService } from "../services/role.service.js";

type RoleParams = {
  id: string;
};

export class RolesController {
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

      const result = await RolesService.findAll(
        Number(page),
        Number(limit),
        search as string,
        isActive !== undefined
          ? isActive === "true"
          : undefined,
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
    req: Request<RoleParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const role = await RolesService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: role,
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
      const role = await RolesService.create(req.body);

      res.status(201).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request<RoleParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const role = await RolesService.update(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request<RoleParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await RolesService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Role deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}