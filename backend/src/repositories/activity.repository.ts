import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

const activityInclude = {
  actor: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
  ticket: {
    select: {
      id: true,
      ticketNumber: true,
      subject: true,
      status: true,
      priority: true,
    },
  },
} satisfies Prisma.ActivityLogInclude;

export const ActivityRepository = {
  async create(data: Prisma.ActivityLogCreateInput) {
    return prisma.activityLog.create({
      data,
      include: activityInclude,
    });
  },

  async findById(id: string) {
    return prisma.activityLog.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: activityInclude,
    });
  },

  async findByTicketId(ticketId: string) {
    return prisma.activityLog.findMany({
      where: {
        ticketId,
        deletedAt: null,
      },
      include: activityInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findRecent(limit = 20) {
    return prisma.activityLog.findMany({
      where: {
        deletedAt: null,
      },
      include: activityInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },

  async update(id: string, data: Prisma.ActivityLogUpdateInput) {
    return prisma.activityLog.update({
      where: {
        id,
      },
      data,
      include: activityInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.activityLog.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};