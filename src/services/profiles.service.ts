import { api, setCachedUser } from "./api-client";
import type { AuthUser } from "./api-client";

export type Profile = AuthUser;

export async function fetchProfile(): Promise<Profile> {
  return api.get<Profile>("/auth/me");
}

export async function upsertProfile(
  fields: {
    full_name?: string | null;
    company_name?: string | null;
    email_notification_events?: string[];
    slack_notification_events?: string[];
    slack_webhook_url?: string | null;
  },
): Promise<void> {
  const dto: Record<string, unknown> = {};
  if ("full_name" in fields) dto.fullName = fields.full_name;
  if ("company_name" in fields) dto.companyName = fields.company_name;
  if ("email_notification_events" in fields) dto.emailNotificationEvents = fields.email_notification_events;
  if ("slack_notification_events" in fields) dto.slackNotificationEvents = fields.slack_notification_events;
  if ("slack_webhook_url" in fields) dto.slackWebhookUrl = fields.slack_webhook_url;

  const updated = await api.patch<Profile>("/auth/me", dto);
  setCachedUser(updated);
}

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const updated = await api.post<Profile>("/auth/me/avatar", formData);
  setCachedUser(updated);
  return updated.avatarUrl || "";
}
