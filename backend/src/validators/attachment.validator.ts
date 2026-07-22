import { z } from "zod";

export const createAttachmentSchema = z.object({
  body: z.object({
    ticketId: z
      .string()
      .uuid("Invalid ticket id."),

    uploadedById: z
      .string()
      .uuid("Invalid user id.")
      .optional(),
  }),
});

export const attachmentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid attachment id."),
  }),
});

export const ticketAttachmentSchema = z.object({
  params: z.object({
    ticketId: z.string().uuid("Invalid ticket id."),
  }),
});