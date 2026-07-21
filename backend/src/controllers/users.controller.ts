import type { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users.service.js";
import { getPagination } from "../utils/pagination.js";

export class UsersController {
    static async findAll(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search?.toString();
            const role = req.query.role?.toString();
            const departmentId = req.query.departmentId?.toString();
            const isActive =
                req.query.isActive !== undefined
                    ? req.query.isActive === "true"
                    : undefined;

            const sortBy = req.query.sortBy?.toString();
            const sortOrder = req.query.sortOrder?.toString();
            const result = await UsersService.findAll(
                page,
                limit,
                search,
                role,
                departmentId,
                isActive,
                sortBy,
                sortOrder
            );


            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: result.users,
                pagination: {
                    page,
                    limit,
                    totalRecords: result.totalRecords,
                    totalPages: Math.ceil(result.totalRecords / limit),
                    hasNextPage: page * limit < result.totalRecords,
                    hasPreviousPage: page > 1,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async findById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = req.params.id as string;

            const user = await UsersService.findById(id);

            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user,
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
        const user = await UsersService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}


static async update(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.id as string;

        const user = await UsersService.update(id, req.body);

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

static async delete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;

    const result = await UsersService.delete(id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
}