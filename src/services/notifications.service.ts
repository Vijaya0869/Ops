import { api } from "./api-client";

// The backend derives the recipient from the authenticated session rather
// than trusting recipientEmail/recipientName from here — sending those is
// harmless (the ValidationPipe strips unknown fields) but they're ignored.
export async function invokeSendNotification(body: Record<string, unknown>): Promise<void> {
  await api.post("/notifications/send", body);
}
