import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";

export const createTicketSchema = z.object({
  body: z.object({
    subject: z
      .string()
      .trim()
      .min(5)
      .max(150),

    description: z
      .string()
      .trim()
      .min(10),

    customerName: z
      .string()
      .trim()
      .min(2),

    customerEmail: z
      .string()
      .trim()
      .email(),

    customerPhone: z
      .string()
      .trim()
      .min(10)
      .max(15)
      .optional(),

    departmentId: z.string().uuid(),

    categoryId: z.string().uuid(),

    createdById: z.string().uuid(),

    assignedToId: z.string().uuid().optional(),

    priority: z.nativeEnum(TicketPriority).optional(),

    dueDate: z
      .string()
      .datetime()
      .optional(),
  }),
});

export const updateTicketSchema = z.object({
  body: createTicketSchema.shape.body.partial(),
});
export const changeStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TicketStatus),
  }),
});

export const assignTicketSchema = z.object({
  body: z.object({
    assignedToId: z.string().uuid("Invalid agent ID."),
  }),
});

export const listTicketSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    departmentId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    assignedToId: z.string().uuid().optional(),
    createdById: z.string().uuid().optional(),

    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),

    sortBy: z
      .enum([
        "createdAt",
        "updatedAt",
        "subject",
        "priority",
        "status",
        "dueDate",
      ])
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;

export type AssignTicketInput = z.infer<typeof assignTicketSchema>;

export type ListTicketInput = z.infer<typeof listTicketSchema>;