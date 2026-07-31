import { supabase } from "@/integrations/supabase/client";

export async function invokeSendNotification(body: Record<string, unknown>): Promise<void> {
  const response = await supabase.functions.invoke("send-notification", { body });
  if (response.error) throw response.error;
}
