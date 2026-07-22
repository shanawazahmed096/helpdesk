import { Prisma, TicketStatus } from "@prisma/client";
import prisma from "../config/prisma.js";

export const DashboardRepository = {
  async getSummary() {
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
    ] = await Promise.all([
      prisma.ticket.count({
        where: {
          deletedAt: null,
        },
      }),

      prisma.ticket.count({
        where: {
          deletedAt: null,
          status: TicketStatus.OPEN,
        },
      }),

      prisma.ticket.count({
        where: {
          deletedAt: null,
          status: TicketStatus.IN_PROGRESS,
        },
      }),

      prisma.ticket.count({
        where: {
          deletedAt: null,
          status: TicketStatus.RESOLVED,
        },
      }),

      prisma.ticket.count({
        where: {
          deletedAt: null,
          status: TicketStatus.CLOSED,
        },
      }),
    ]);

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
    };
  },

    async getStatusCounts() {
    return prisma.ticket.groupBy({
      by: ["status"],

      where: {
        deletedAt: null,
      },

      _count: {
        status: true,
      },

      orderBy: {
        status: "asc",
      },
    });
  },

    async getPriorityCounts() {
    return prisma.ticket.groupBy({
      by: ["priority"],

      where: {
        deletedAt: null,
      },

      _count: {
        priority: true,
      },

      orderBy: {
        priority: "asc",
      },
    });
  },

    async getRecentTickets(limit = 10) {
    return prisma.ticket.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        department: true,
        category: true,
        createdBy: true,
        assignedTo: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,
    });
  },

    async getRecentActivities(limit = 10) {
    return prisma.activityLog.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        actor: true,
        ticket: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,
    });
  },

    async getDepartmentCounts() {
    return prisma.ticket.groupBy({
      by: ["departmentId"],

      where: {
        deletedAt: null,
      },

      _count: {
        departmentId: true,
      },
    });
  },

    async getCategoryCounts() {
    return prisma.ticket.groupBy({
      by: ["categoryId"],

      where: {
        deletedAt: null,
      },

      _count: {
        categoryId: true,
      },
    });
  },
  async getAgentPerformance() {
    return prisma.ticket.groupBy({
      by: ["assignedToId"],

      where: {
        deletedAt: null,
        assignedToId: {
          not: null,
        },
      },

      _count: {
        assignedToId: true,
      },
    });
  },

  
}