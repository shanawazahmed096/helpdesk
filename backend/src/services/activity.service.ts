import { Prisma } from "@prisma/client";

import { ActivityRepository } from "../repositories/activity.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { UsersRepository } from "../repositories/users.repository.js";

import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export const ActivityService = {
  async create(data: any) {
    // 1. Ticket
    const ticket = await TicketRepository.findById(data.ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    // 2. Actor
    if (data.actorId) {
      const actor = await UsersRepository.findById(data.actorId);

      if (!actor) {
        throw new NotFoundError("Actor not found.");
      }
    }

    // 3. Action
    if (!data.action) {
      throw new BadRequestError("Activity action is required.");
    }

    return ActivityRepository.create({
      action: data.action,

      ...(data.details && {
        details: data.details,
      }),

      ticket: {
        connect: {
          id: data.ticketId,
        },
      },

      ...(data.actorId && {
        actor: {
          connect: {
            id: data.actorId,
          },
        },
      }),
    });
  },

  async findByTicketId(ticketId: string) {
    const ticket = await TicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    return ActivityRepository.findByTicketId(ticketId);
  },

  async findById(id: string) {
    const activity = await ActivityRepository.findById(id);

    if (!activity) {
      throw new NotFoundError("Activity not found.");
    }

    return activity;
  },

  async findRecent(limit?: number) {
    return ActivityRepository.findRecent(limit);
  },

  async update(id: string, data: any) {
    const activity = await ActivityRepository.findById(id);

    if (!activity) {
      throw new NotFoundError("Activity not found.");
    }

    const updateData: Prisma.ActivityLogUpdateInput = {
      ...(data.action && {
        action: data.action,
      }),

      ...(data.details && {
        details: data.details,
      }),
    };

    return ActivityRepository.update(id, updateData);
  },

  async delete(id: string) {
    const activity = await ActivityRepository.findById(id);

    if (!activity) {
      throw new NotFoundError("Activity not found.");
    }

    await ActivityRepository.softDelete(id);

    return {
      message: "Activity deleted successfully.",
    };
  },
};