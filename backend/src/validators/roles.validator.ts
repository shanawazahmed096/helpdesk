import { z } from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),

    code: z
      .string()
      .min(2)
      .max(50)
      .transform((v) => v.toUpperCase().replace(/\s+/g, "_")),

    description: z.string().optional(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),

  body: z.object({
    name: z.string().min(2).max(100).optional(),

    code: z
      .string()
      .min(2)
      .max(50)
      .transform((v) => v.toUpperCase().replace(/\s+/g, "_"))
      .optional(),

    description: z.string().optional(),

    isActive: z.boolean().optional(),
  }),
});

export const listRoleSchema = z.object({
  query: z.object({
    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(10),

    search: z.string().optional(),

    sortBy: z.string().optional(),

    sortOrder: z.enum(["asc", "desc"]).optional(),

    isActive: z.coerce.boolean().optional(),
  }),
});