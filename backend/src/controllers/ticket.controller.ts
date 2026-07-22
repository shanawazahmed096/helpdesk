import type { Request, Response, NextFunction } from "express";
import { TicketService } from "../services/ticket.service.js";
import { Prisma, TicketPriority, TicketStatus } from "@prisma/client";
import type { TicketFilters } from "../repositories/ticket.repository.js";


export class TicketController {
  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const filters: TicketFilters = {
        page,
        limit,
      };

      if (req.query.search) {
        filters.search = req.query.search.toString();
      }

      if (req.query.departmentId) {
        filters.departmentId = req.query.departmentId.toString();
      }

      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId.toString();
      }

      if (req.query.assignedToId) {
        filters.assignedToId = req.query.assignedToId.toString();
      }

      if (req.query.createdById) {
        filters.createdById = req.query.createdById.toString();
      }

      if (req.query.status) {
        filters.status = req.query.status.toString() as TicketStatus;
      }

      if (req.query.priority) {
        filters.priority = req.query.priority.toString() as TicketPriority;
      }

      if (req.query.sortBy) {
        filters.sortBy =
          req.query.sortBy.toString() as keyof Prisma.TicketOrderByWithRelationInput;
      }

      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder.toString() as Prisma.SortOrder;
      }

      const result = await TicketService.findAll(filters);

      return res.status(200).json({
        success: true,
        message: "Tickets fetched successfully.",
        ...result,
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