import { supabase } from "@/integrations/supabase/client";
import { Deal, DealFormData, DealStage } from "@/types/deal";
import { RealtimeChannel } from "@supabase/supabase-js";

export async function fetchDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as Deal[]) || [];
}

export async function addDeal(userId: string, data: Partial<DealFormData>): Promise<Deal> {
  const insertData = {
    title: data.title || "",
    address: data.address || null,
    city: data.city || null,
    state: data.state || null,
    asking_price: data.asking_price || null,
    offer_price: data.offer_price || null,
    arv: data.arv || null,
    rehab_estimate: data.rehab_estimate || null,
    expected_profit: data.expected_profit || null,
    stage: data.stage || "lead",
    source: data.source || null,
    contact_name: data.contact_name || null,
    contact_phone: data.contact_phone || null,
    contact_email: data.contact_email || null,
    notes: data.notes || null,
    user_id: userId,
  };

  const { data: newDeal, error } = await supabase
    .from("deals")
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return newDeal as Deal;
}

export async function updateDeal(id: string, data: Partial<DealFormData>): Promise<Deal> {
  const { data: updatedDeal, error } = await supabase
    .from("deals")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updatedDeal as Deal;
}

export async function updateDealStage(id: string, stage: DealStage): Promise<void> {
  const { error } = await supabase.from("deals").update({ stage }).eq("id", id);
  if (error) throw error;
}

export async function deleteDeal(id: string): Promise<void> {
  const { error } = await supabase.from("deals").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeToDeals(
  channelName: string,
  handlers: {
    onInsert: (row: Deal) => void;
    onUpdate: (row: Deal) => void;
    onDelete: (id: string) => void;
  },
): RealtimeChannel {
  return supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "deals" },
      (payload) => {
        if (payload.eventType === "INSERT") handlers.onInsert(payload.new as Deal);
        else if (payload.eventType === "UPDATE") handlers.onUpdate(payload.new as Deal);
        else if (payload.eventType === "DELETE") handlers.onDelete(payload.old.id as string);
      },
    )
    .subscribe();
}

export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
