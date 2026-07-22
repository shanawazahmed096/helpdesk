import type { Request, Response, NextFunction } from "express";
import { TicketService } from "../services/ticket.service.js";

export class TicketController {
  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const filters = {
        page,
        limit,
        search: req.query.search?.toString(),
        departmentId: req.query.departmentId?.toString(),
        categoryId: req.query.categoryId?.toString(),
        assignedToId: req.query.assignedToId?.toString(),
        createdById: req.query.createdById?.toString(),
        status: req.query.status?.toString(),
        priority: req.query.priority?.toString(),
        sortBy: req.query.sortBy?.toString(),
        sortOrder: req.query.sortOrder?.toString(),
      };

      const result = await TicketService.findAll(filters);

      return res.status(200).json({
        success: true,
        message: "Tickets fetched successfully.",
        data: result.tickets,
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

      const ticket = await TicketService.findById(id);

      return res.status(200).json({
        success: true,
        message: "Ticket fetched successfully.",
        data: ticket,
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
      const ticket = await TicketService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Ticket created successfully.",
        data: ticket,
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

      const ticket = await TicketService.update(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Ticket updated successfully.",
        data: ticket,
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

      const result = await TicketService.delete(id);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id as string;

      const ticket = await TicketService.changeStatus(
        id,
        req.body.status
      );

      return res.status(200).json({
        success: true,
        message: "Ticket status updated successfully.",
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async assign(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id as string;
      const ticket = await TicketService.assign(
        id,
        req.body.assignedToId
      );

      return res.status(200).json({
        success: true,
        message: "Ticket assigned successfully.",
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }
}