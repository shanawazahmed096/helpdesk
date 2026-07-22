import { ActivityAction, Prisma } from "@prisma/client";
import { ActivityService } from "../services/activity.service.js";

interface LogActivityParams {
  action: ActivityAction;
  ticketId: string;
  actorId?: string | undefined;
  details?: Prisma.JsonValue;
}

export async function logActivity({
  action,
  ticketId,
  actorId,
  details,
}: LogActivityParams) {
  try {
    await ActivityService.create({
      action,
      ticketId,
      actorId,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}