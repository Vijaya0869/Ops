// Supabase's edge function sent email via Resend. The self-hosted backend has
// no email provider configured yet, so this is a no-op stub rather than a
// hard failure — deal-stage-change emails just don't send until one's wired up.
export async function invokeSendNotification(body: Record<string, unknown>): Promise<void> {
  console.log("Notification skipped (no email provider configured):", body);
}
