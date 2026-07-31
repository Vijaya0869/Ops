import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFormData } from "@/types/property";
import { RealtimeChannel } from "@supabase/supabase-js";

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Property[]) || [];
}

export type PropertySummary = Pick<
  Property,
  "purchase_price" | "arv" | "loan_amount" | "monthly_rent" | "status"
>;

export async function fetchPropertiesSummary(): Promise<PropertySummary[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("purchase_price, arv, loan_amount, monthly_rent, status");

  if (error) throw error;
  return data || [];
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Property | null;
}

export async function addProperty(
  userId: string,
  formData: Partial<PropertyFormData>,
): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .insert({
      user_id: userId,
      address: formData.address,
      city: formData.city || null,
      state: formData.state || null,
      zip_code: formData.zip_code || null,
      county: formData.county || null,
      property_type: formData.property_type || null,
      bedrooms: formData.bedrooms || null,
      bathrooms: formData.bathrooms || null,
      square_feet: formData.square_feet || null,
      lot_size: formData.lot_size || null,
      year_built: formData.year_built || null,
      purchase_price: formData.purchase_price || null,
      arv: formData.arv || null,
      rehab_budget: formData.rehab_budget || null,
      actual_rehab_cost: formData.actual_rehab_cost || null,
      holding_costs: formData.holding_costs || null,
      sale_price: formData.sale_price || null,
      monthly_rent: formData.monthly_rent || null,
      monthly_expenses: formData.monthly_expenses || null,
      loan_amount: formData.loan_amount || null,
      interest_rate: formData.interest_rate || null,
      lender_name: formData.lender_name || null,
      status: formData.status || "lead",
      acquisition_date: formData.acquisition_date || null,
      sale_date: formData.sale_date || null,
      notes: formData.notes || null,
      mls_number: formData.mls_number || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Property;
}

export async function updateProperty(
  id: string,
  formData: Partial<PropertyFormData>,
): Promise<Property> {
  // Only write fields actually present in formData — anything the caller
  // didn't include must be left untouched, not nulled or defaulted.
  const updates = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value]),
  );

  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeToProperties(
  channelName: string,
  handlers: {
    onInsert: (row: Property) => void;
    onUpdate: (row: Property) => void;
    onDelete: (id: string) => void;
  },
): RealtimeChannel {
  return supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "properties" },
      (payload) => {
        if (payload.eventType === "INSERT") handlers.onInsert(payload.new as Property);
        else if (payload.eventType === "UPDATE") handlers.onUpdate(payload.new as Property);
        else if (payload.eventType === "DELETE") handlers.onDelete(payload.old.id as string);
      },
    )
    .subscribe();
}

export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
