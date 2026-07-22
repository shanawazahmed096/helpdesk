import { Router } from "express";

import { CommentController } from "../controllers/comment.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createCommentSchema,
  updateCommentSchema,
  commentIdSchema,
  ticketCommentSchema,
} from "../validators/comment.validator.js";

const router = Router();

// Create Comment
router.post(
  "/",
  validate(createCommentSchema),
  CommentController.create
);

// Get Comments By Ticket
router.get(
  "/ticket/:ticketId",
  validate(ticketCommentSchema),
  CommentController.findByTicketId
);

// Get Single Comment
router.get(
  "/:id",
  validate(commentIdSchema),
  CommentController.findById
);

// Update Comment
router.put(
  "/:id",
  validate(commentIdSchema),
  validate(updateCommentSchema),
  CommentController.update
);

// Delete Comment
router.delete(
  "/:id",
  validate(commentIdSchema),
  CommentController.delete
);

export default router;