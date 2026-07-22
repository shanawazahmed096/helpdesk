import { ActivityAction, Prisma, TicketPriority, TicketStatus } from "@prisma/client";

import { TicketRepository, type TicketFilters } from "../repositories/ticket.repository.js";
import { DepartmentRepository } from "../repositories/department.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { logActivity } from "../utils/activity-helper.util.js";
import { getPagination } from "../utils/pagination.js";

export const TicketService = {
  async create(data: any) {
    // 1. Department
    const department = await DepartmentRepository.findById(data.departmentId);

    if (!department) {
      throw new NotFoundError("Department not found.");
    }

    // 2. Category
    const category = await CategoryRepository.findById(data.categoryId);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    // 3. Category belongs to Department
    if (category.departmentId !== data.departmentId) {
      throw new BadRequestError(
        "Selected category does not belong to the selected department."
      );
    }

    // 4. Creator
    const creator = await UsersRepository.findById(data.createdById);

    if (!creator) {
      throw new NotFoundError("Creator not found.");
    }

    // 5. Assigned Agent
    if (data.assignedToId) {
      const agent = await UsersRepository.findById(data.assignedToId);

      if (!agent) {
        throw new NotFoundError("Assigned agent not found.");
      }

      if (agent.role.code !== "AGENT") {
        throw new BadRequestError(
          "Assigned user must have AGENT role."
        );
      }
    }

    // 6. Due Date
    if (data.dueDate) {
      const due = new Date(data.dueDate);

      if (due.getTime() < Date.now()) {
        throw new BadRequestError(
          "Due date cannot be in the past."
        );
      }
    }

    const ticket = await TicketRepository.create({
      subject: data.subject,
      description: data.description,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      priority: data.priority ?? TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,

      department: {
        connect: {
          id: data.departmentId,
        },
      },

      category: {
        connect: {
          id: data.categoryId,
        },
      },

      createdBy: {
        connect: {
          id: data.createdById,
        },
      },

      ...(data.assignedToId && {
        assignedTo: {
          connect: {
            id: data.assignedToId,
          },
        },
      }),

      dueDate: data.dueDate,
    });

    await logActivity({
      action: ActivityAction.TICKET_CREATED,
      ticketId: ticket.id,
      actorId: ticket.createdById,
      details: {
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
      },
    });

    return ticket;
  },

async findAll(filters: TicketFilters) {
  const {
    tickets,
    totalRecords,
    page,
    limit,
  } = await TicketRepository.findAll(filters);

  return {
    data: tickets,
    pagination: getPagination(page, limit, totalRecords),
  };
},
  async findById(id: string) {
    const ticket = await TicketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    return ticket;
  },

  async update(id: string, data: any) {
    const ticket = await TicketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    // Validate Department
    if (data.departmentId) {
      const department = await DepartmentRepository.findById(data.departmentId);

      if (!department) {
        throw new NotFoundError("Department not found.");
      }
    }

    // Validate Category
    if (data.categoryId) {
      const category = await CategoryRepository.findById(data.categoryId);

      if (!category) {
        throw new NotFoundError("Category not found.");
      }

      if (
        data.departmentId &&
        category.departmentId !== data.departmentId
      ) {
        throw new BadRequestError(
          "Category does not belong to selected department."
        );
      }
    }

    // Validate Assigned Agent
    if (data.assignedToId) {
      const agent = await UsersRepository.findById(data.assignedToId);

      if (!agent) {
        throw new NotFoundError("Assigned agent not found.");
      }

      if (agent.role.code !== "AGENT") {
        throw new BadRequestError(
          "Assigned user must have AGENT role."
        );
      }
    }

    const updatedTicket = await TicketRepository.update(id, data);

    // Ticket Updated
    await logActivity({
      action: ActivityAction.TICKET_UPDATED,
      ticketId: updatedTicket.id,
      actorId: data.updatedById ?? ticket.createdById,
      details: {
        ticketNumber: updatedTicket.ticketNumber,
      },
    });

    // Status Changed
    if (
      data.status &&
      ticket.status !== updatedTicket.status
    ) {
      await logActivity({
        action: ActivityAction.STATUS_CHANGED,
        ticketId: updatedTicket.id,
        actorId: data.updatedById ?? ticket.createdById,
        details: {
          oldStatus: ticket.status,
          newStatus: updatedTicket.status,
        },
      });
    }

    // Priority Changed
    if (
      data.priority &&
      ticket.priority !== updatedTicket.priority
    ) {
      await logActivity({
        action: ActivityAction.PRIORITY_CHANGED,
        ticketId: updatedTicket.id,
        actorId: data.updatedById ?? ticket.createdById,
        details: {
          oldPriority: ticket.priority,
          newPriority: updatedTicket.priority,
        },
      });
    }

    return updatedTicket;
  },

  async delete(id: string) {
    const ticket = await TicketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    await TicketRepository.softDelete(id);

    await logActivity({
      action: ActivityAction.TICKET_UPDATED,
      ticketId: ticket.id,
      actorId: ticket.createdById,
      details: {
        deleted: true,
      },
    });

    return {
      message: "Ticket deleted successfully.",
    };
  },

  async changeStatus(id: string, status: TicketStatus) {
    const ticket = await TicketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    const data: Prisma.TicketUpdateInput = {
      status,
    };

    if (status === TicketStatus.RESOLVED) {
      data.resolvedAt = new Date();
    }

    if (status === TicketStatus.CLOSED) {
      data.closedAt = new Date();
    }

    if (status === TicketStatus.REOPENED) {
      data.resolvedAt = null;
      data.closedAt = null;
    }

    const updatedTicket = await TicketRepository.update(id, data);

    let action: ActivityAction = ActivityAction.STATUS_CHANGED;

    if (status === TicketStatus.CLOSED) {
      action = ActivityAction.TICKET_CLOSED;
    }

    if (status === TicketStatus.REOPENED) {
      action = ActivityAction.TICKET_REOPENED;
    }

    await logActivity({
      action,
      ticketId: updatedTicket.id,
      actorId: ticket.createdById,
      details: {
        oldStatus: ticket.status,
        newStatus: updatedTicket.status,
      },
    });

    return updatedTicket;
  },

  async assign(id: string, assignedToId: string) {
    const ticket = await TicketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    const agent = await UsersRepository.findById(assignedToId);

    if (!agent) {
      throw new NotFoundError("Assigned agent not found.");
    }

    if (agent.role.code !== "AGENT") {
      throw new BadRequestError(
        "Assigned user must have AGENT role."
      );
    }

    const updatedTicket = await TicketRepository.update(id, {
      assignedTo: {
        connect: {
          id: assignedToId,
        },
      },
    });

    await logActivity({
      action: ActivityAction.ASSIGNED,
      ticketId: updatedTicket.id,
      actorId: assignedToId,
      details: {
        assignedToId,
        agentName: `${agent.firstName} ${agent.lastName}`,
      },
    });

    return updatedTicket;
  },
};