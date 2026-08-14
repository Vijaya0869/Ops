-- Split the single `notification_events` preference into independent
-- email/Slack channel preferences, so a user can e.g. keep Slack alerts
-- on for every deal stage change while only emailing themselves for
-- higher-signal events like a property sale.

ALTER TABLE "users" ADD COLUMN "email_notification_events" "NotificationEventType"[] NOT NULL DEFAULT ARRAY[]::"NotificationEventType"[];
ALTER TABLE "users" ADD COLUMN "slack_notification_events" "NotificationEventType"[] NOT NULL DEFAULT ARRAY[]::"NotificationEventType"[];

-- Preserve existing selections: whatever a user had already opted into
-- carries forward to both channels, so nobody silently stops getting
-- notifications they'd already turned on. They can now narrow each
-- channel down independently.
UPDATE "users" SET
  "email_notification_events" = "notification_events",
  "slack_notification_events" = "notification_events";

ALTER TABLE "users" DROP COLUMN "notification_events";
