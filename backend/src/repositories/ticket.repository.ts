import { Prisma, TicketPriority, TicketStatus } from "@prisma/client";
import prisma from "../config/prisma.js";

export interface TicketFilters {
  search?: string;
  departmentId?: string;
  categoryId?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string;
  createdById?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof Prisma.TicketOrderByWithRelationInput;
  sortOrder?: Prisma.SortOrder;
}

const ticketInclude = {
  department: true,
  category: true,
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
  _count: {
    select: {
      comments: true,
      attachments: true,
    },
  },
} satisfies Prisma.TicketInclude;

export const TicketRepository = {
  async create(data: Prisma.TicketCreateInput) {
    return prisma.ticket.create({
      data,
      include: ticketInclude,
    });
  },

  async findById(id: string) {
    return prisma.ticket.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: ticketInclude,
    });
  },

  async findByTicketNumber(ticketNumber: string) {
    return prisma.ticket.findFirst({
      where: {
        ticketNumber,
        deletedAt: null,
      },
      include: ticketInclude,
    });
  },

  async findAll(filters: TicketFilters) {
    const {
      search,
      departmentId,
      categoryId,
      status,
      priority,
      assignedToId,
      createdById,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const where: Prisma.TicketWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        {
          subject: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          customerName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          customerEmail: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          ticketNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (departmentId) where.departmentId = departmentId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;
    if (createdById) where.createdById = createdById;

    return prisma.ticket.findMany({
      where,
      include: ticketInclude,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  },

  async count(filters: TicketFilters) {
    const where: Prisma.TicketWhereInput = {
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        {
          subject: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          customerName: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          customerEmail: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          ticketNumber: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.createdById) where.createdById = filters.createdById;

    return prisma.ticket.count({ where });
  },

  async update(id: string, data: Prisma.TicketUpdateInput) {
    return prisma.ticket.update({
      where: { id },
      data,
      include: ticketInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.ticket.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};