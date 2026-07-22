import type { Request, Response, NextFunction } from "express";
import { AttachmentService } from "../services/attachment.service.js";
import { BadRequestError } from "../errors/BadRequestError.js";

type AttachmentParams = {
  id: string;
};

type TicketAttachmentParams = {
  ticketId: string;
};

export class AttachmentController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new BadRequestError("Attachment file is required.");
      }

      const attachment = await AttachmentService.create({
        ...req.body,
        file: req.file,
      });

      res.status(201).json({
        success: true,
        data: attachment,
      });
console.log("Headers:", req.headers["content-type"]);
console.log("Body:", req.body);
console.log("File:", req.file);
    } catch (error) {
      next(error);
    }
  }

  static async findById(
    req: Request<AttachmentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const attachment = await AttachmentService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: attachment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findByTicketId(
    req: Request<TicketAttachmentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const attachments = await AttachmentService.findByTicketId(
        req.params.ticketId
      );

      res.status(200).json({
        success: true,
        data: attachments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request<AttachmentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AttachmentService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Attachment deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}