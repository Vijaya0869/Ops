-- CreateEnum
CREATE TYPE "NotificationEventType" AS ENUM ('deal_stage_change', 'property_sold', 'property_acquired', 'new_deal');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notification_events" "NotificationEventType"[] DEFAULT ARRAY[]::"NotificationEventType"[],
ADD COLUMN     "slack_webhook_url" TEXT;
