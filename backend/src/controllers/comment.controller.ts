import type { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service.js";

type CommentParams = {
  id: string;
};

type TicketCommentParams = {
  ticketId: string;
};

export class CommentController {
  static async findByTicketId(
    req: Request<TicketCommentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comments = await CommentService.findByTicketId(
        req.params.ticketId
      );

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(
    req: Request<CommentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comment = await CommentService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: comment,
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
      const comment = await CommentService.create(req.body);

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request<CommentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comment = await CommentService.update(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request<CommentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CommentService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}