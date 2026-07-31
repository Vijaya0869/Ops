import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertProfile(
  userId: string,
  hasExistingProfile: boolean,
  fields: { full_name?: string | null; company_name?: string | null; avatar_url?: string },
): Promise<void> {
  const payload = { user_id: userId, ...fields, updated_at: new Date().toISOString() };

  const { error } = hasExistingProfile
    ? await supabase.from("profiles").update(payload).eq("user_id", userId)
    : await supabase.from("profiles").insert(payload);

  if (error) throw error;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
  return `${urlData.publicUrl}?t=${Date.now()}`;
}
