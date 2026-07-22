import { Router } from "express";

import { AttachmentController } from "../controllers/attachment.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createAttachmentSchema,
  attachmentIdSchema,
  ticketAttachmentSchema,
} from "../validators/attachment.validator.js";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  validate(createAttachmentSchema),
  AttachmentController.create
);

router.get(
  "/ticket/:ticketId",
  validate(ticketAttachmentSchema),
  AttachmentController.findByTicketId
);

router.get(
  "/:id",
  validate(attachmentIdSchema),
  AttachmentController.findById
);

router.delete(
  "/:id",
  validate(attachmentIdSchema),
  AttachmentController.delete
);

export default router;