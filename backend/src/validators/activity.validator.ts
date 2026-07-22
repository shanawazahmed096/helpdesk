import { z } from "zod";
import { ActivityAction } from "@prisma/client";

export const createActivitySchema = z.object({
  body: z.object({
    action: z.nativeEnum(ActivityAction),

    ticketId: z.string().uuid("Invalid ticket id."),

    actorId: z.string().uuid("Invalid actor id.").optional(),

    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const activityIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid activity id."),
  }),
});

export const ticketActivitySchema = z.object({
  params: z.object({
    ticketId: z.string().uuid("Invalid ticket id."),
  }),
});

export const recentActivitySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});