import { ActivityAction, Prisma } from "@prisma/client";

import { CommentRepository } from "../repositories/comment.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";

import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { logActivity } from "../utils/activity-helper.util.js";

export const CommentService = {
  async create(data: any) {
  // 1. Ticket
  const ticket = await TicketRepository.findById(data.ticketId);

  if (!ticket) {
    throw new NotFoundError("Ticket not found.");
  }

  // 2. Author
  if (data.authorId) {
    const author = await UsersRepository.findById(data.authorId);

    if (!author) {
      throw new NotFoundError("Author not found.");
    }
  }

  // 3. Content
  if (!data.content?.trim()) {
    throw new BadRequestError("Comment cannot be empty.");
  }

  const comment = await CommentRepository.create({
    content: data.content.trim(),

    ticket: {
      connect: {
        id: data.ticketId,
      },
    },

    ...(data.authorId && {
      author: {
        connect: {
          id: data.authorId,
        },
      },
    }),
  });

  await logActivity({
    action: ActivityAction.COMMENT_ADDED,
    ticketId: ticket.id,
    actorId: data.authorId,
    details: {
      commentId: comment.id,
      content: comment.content,
    },
  });

  return comment;
},

  async findByTicketId(ticketId: string) {
    const ticket = await TicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    return CommentRepository.findByTicketId(ticketId);
  },

  async findById(id: string) {
    const comment = await CommentRepository.findById(id);

    if (!comment) {
      throw new NotFoundError("Comment not found.");
    }

    return comment;
  },

async update(id: string, data: any) {
  const comment = await CommentRepository.findById(id);

  if (!comment) {
    throw new NotFoundError("Comment not found.");
  }

  if (data.content !== undefined && !data.content.trim()) {
    throw new BadRequestError("Comment cannot be empty.");
  }

  const updateData: Prisma.CommentUpdateInput = {
    ...(data.content && {
      content: data.content.trim(),
    }),
  };

  const updatedComment = await CommentRepository.update(id, updateData);

  await logActivity({
    action: ActivityAction.COMMENT_UPDATED,
    ticketId: comment.ticketId,
    actorId: comment.authorId ?? undefined,
    details: {
      commentId: comment.id,
      oldContent: comment.content,
      newContent: updatedComment.content,
    },
  });

  return updatedComment;
},

async delete(id: string) {
  const comment = await CommentRepository.findById(id);

  if (!comment) {
    throw new NotFoundError("Comment not found.");
  }

  await CommentRepository.softDelete(id);

  await logActivity({
    action: ActivityAction.COMMENT_DELETED,
    ticketId: comment.ticketId,
    actorId: comment.authorId ?? undefined,
    details: {
      commentId: comment.id,
    },
  });

  return {
    message: "Comment deleted successfully.",
  };
},
};