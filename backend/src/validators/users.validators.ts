import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(50)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),

  phone: z
    .string()
    .trim()
    .optional(),

  roleId: z
    .string()
    .uuid("Invalid Role Id"),

  departmentId: z
    .string()
    .uuid("Invalid Department Id")
    .optional(),

  avatarUrl: z
    .string()
    .url()
    .optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().trim().min(2).max(100).optional(),

  lastName: z.string().trim().min(2).max(100).optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase()
    .optional(),

  phone: z.string().trim().optional(),

  roleId: z.string().uuid().optional(),

  departmentId: z.string().uuid().optional(),

  avatarUrl: z.string().url().optional(),

  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;