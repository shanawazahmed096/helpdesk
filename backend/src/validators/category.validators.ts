import { z } from "zod";


export const listCategorySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().optional(),

    isActive: z
      .enum(["true", "false"])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === "true"
      ),

    sortBy: z
      .enum([
        "name",
        "createdAt",
        "updatedAt"
      ])
      .optional(),

    sortOrder: z
      .enum(["asc", "desc"])
      .optional(),
  }),
});


export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100),

    description: z
      .string()
      .trim()
      .max(500)
      .optional(),

    departmentId: z.uuid("Invalid department id"),

    assignedAgentId: z
      .uuid("Invalid assigned agent id")
      .optional(),

    isActive: z.boolean().optional()
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.uuid("Invalid category id")
  }),

  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .max(500)
      .optional(),

    departmentId: z
      .uuid("Invalid department id")
      .optional(),

    assignedAgentId: z
      .uuid("Invalid assigned agent id")
      .optional(),

    isActive: z.boolean().optional()
  })
});