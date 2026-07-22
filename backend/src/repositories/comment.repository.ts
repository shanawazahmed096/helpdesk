import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

const commentInclude = {
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.CommentInclude;

export const CommentRepository = {
  async create(data: Prisma.CommentCreateInput) {
    return prisma.comment.create({
      data,
      include: commentInclude,
    });
  },

  async findById(id: string) {
    return prisma.comment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: commentInclude,
    });
  },

  async findByTicketId(ticketId: string) {
    return prisma.comment.findMany({
      where: {
        ticketId,
        deletedAt: null,
      },
      include: commentInclude,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async update(id: string, data: Prisma.CommentUpdateInput) {
    return prisma.comment.update({
      where: {
        id,
      },
      data,
      include: commentInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.comment.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};