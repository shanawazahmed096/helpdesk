import { AttachmentRepository } from "../repositories/attachment.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";

import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { logActivity } from "../utils/activity-helper.util.js";
import { ActivityAction } from "@prisma/client";

export const AttachmentService = {
  async create(data: any) {
    // 1. Verify ticket exists
    const ticket = await TicketRepository.findById(data.ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    // 2. Verify uploader exists
    if (data.uploadedById) {
      const user = await UsersRepository.findById(data.uploadedById);

      if (!user) {
        throw new NotFoundError("User not found.");
      }
    }

    // 3. Ensure file is present
    if (!data.file) {
      throw new BadRequestError("Attachment file is required.");
    }

    const attachment = await AttachmentRepository.create({
      fileName: data.file.filename,
      originalName: data.file.originalname,
      mimeType: data.file.mimetype,
      sizeBytes: data.file.size,
      storageKey: data.file.filename,

      ticket: {
        connect: {
          id: data.ticketId,
        },
      },

      ...(data.uploadedById && {
        uploadedBy: {
          connect: {
            id: data.uploadedById,
          },
        },
      }),
    });

    await logActivity({
      action: ActivityAction.ATTACHMENT_UPLOADED,
      ticketId: ticket.id,
      ...(data.uploadedById && {
        actorId: data.uploadedById,
      }),
      details: {
        attachmentId: attachment.id,
        fileName: attachment.originalName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      },
    });

    return attachment;
  },

  async findById(id: string) {
    const attachment = await AttachmentRepository.findById(id);

    if (!attachment) {
      throw new NotFoundError("Attachment not found.");
    }

    return attachment;
  },

  async findByTicketId(ticketId: string) {
    const ticket = await TicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    return AttachmentRepository.findByTicketId(ticketId);
  },

  async delete(id: string) {
    const attachment = await AttachmentRepository.findById(id);

    if (!attachment) {
      throw new NotFoundError("Attachment not found.");
    }

    await AttachmentRepository.softDelete(id);

    await logActivity({
      action: ActivityAction.ATTACHMENT_DELETED,
      ticketId: attachment.ticketId,
      ...(attachment.uploadedById && {
        actorId: attachment.uploadedById,
      }),
      details: {
        attachmentId: attachment.id,
        fileName: attachment.originalName,
      },
    });

    return {
      message: "Attachment deleted successfully.",
    };
  },
};