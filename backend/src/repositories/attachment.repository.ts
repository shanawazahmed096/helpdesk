import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

const attachmentInclude = {
  uploadedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.AttachmentInclude;

export const AttachmentRepository = {
  async create(data: Prisma.AttachmentCreateInput) {
    return prisma.attachment.create({
      data,
      include: attachmentInclude,
    });
  },

  async findById(id: string) {
    return prisma.attachment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: attachmentInclude,
    });
  },

  async findByTicketId(ticketId: string) {
    return prisma.attachment.findMany({
      where: {
        ticketId,
        deletedAt: null,
      },
      include: attachmentInclude,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async update(id: string, data: Prisma.AttachmentUpdateInput) {
    return prisma.attachment.update({
      where: { id },
      data,
      include: attachmentInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.attachment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};