import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    ticketId: z
      .string()
      .uuid("Invalid ticket id."),

    authorId: z
      .string()
      .uuid("Invalid author id.")
      .optional(),

    content: z
      .string()
      .trim()
      .min(1, "Comment is required.")
      .max(5000, "Comment cannot exceed 5000 characters."),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Comment is required.")
      .max(5000, "Comment cannot exceed 5000 characters.")
      .optional(),
  }),
});

export const commentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid comment id."),
  }),
});

export const ticketCommentSchema = z.object({
  params: z.object({
    ticketId: z.string().uuid("Invalid ticket id."),
  }),
});