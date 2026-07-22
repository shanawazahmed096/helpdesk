/*
  Warnings:

  - Changed the type of `action` on the `ActivityLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('TICKET_CREATED', 'TICKET_UPDATED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNED', 'UNASSIGNED', 'COMMENT_ADDED', 'COMMENT_UPDATED', 'COMMENT_DELETED', 'ATTACHMENT_UPLOADED', 'ATTACHMENT_DELETED', 'CATEGORY_CHANGED', 'DEPARTMENT_CHANGED', 'TICKET_CLOSED', 'TICKET_REOPENED', 'USER_MENTIONED');

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "action",
ADD COLUMN     "action" "ActivityAction" NOT NULL;

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");
