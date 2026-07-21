import { Prisma, TicketPriority, TicketStatus } from "@prisma/client";

import { TicketRepository } from "../repositories/ticket.repository.js";
import { DepartmentRepository } from "../repositories/department.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

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

    return TicketRepository.create({
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
  },
  async findAll(filters: any) {
  const tickets = await TicketRepository.findAll(filters);
  const totalRecords = await TicketRepository.count(filters);

  return {
    tickets,
    totalRecords,
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

  if (data.departmentId) {
    const department = await DepartmentRepository.findById(data.departmentId);

    if (!department) {
      throw new NotFoundError("Department not found.");
    }
  }

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

  return TicketRepository.update(id, data);
},

async delete(id: string) {
  const ticket = await TicketRepository.findById(id);

  if (!ticket) {
    throw new NotFoundError("Ticket not found.");
  }

  await TicketRepository.softDelete(id);

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

  return TicketRepository.update(id, data);
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

  return TicketRepository.update(id, {
    assignedTo: {
      connect: {
        id: assignedToId,
      },
    },
  });
},
};