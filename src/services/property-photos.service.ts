import { supabase } from "@/integrations/supabase/client";

export interface PropertyPhoto {
  id: string;
  property_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  is_primary: boolean;
  created_at: string;
  url?: string;
}

function getPhotoUrl(filePath: string): string {
  return supabase.storage.from("property-photos").getPublicUrl(filePath).data.publicUrl;
}

export async function fetchPhotos(propertyId: string): Promise<PropertyPhoto[]> {
  const { data, error } = await supabase
    .from("property_photos")
    .select("*")
    .eq("property_id", propertyId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((photo) => ({ ...photo, url: getPhotoUrl(photo.file_path) }));
}

export async function uploadPhoto(
  propertyId: string,
  userId: string,
  file: File,
  isFirstPhoto: boolean,
): Promise<PropertyPhoto> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${propertyId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("property-photos")
    .upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from("property_photos")
    .insert({
      property_id: propertyId,
      user_id: userId,
      file_path: filePath,
      file_name: file.name,
      is_primary: isFirstPhoto,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  return { ...data, url: getPhotoUrl(data.file_path) };
}

export async function deletePhoto(photo: PropertyPhoto): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from("property-photos")
    .remove([photo.file_path]);
  if (storageError) throw storageError;

  const { error: dbError } = await supabase.from("property_photos").delete().eq("id", photo.id);
  if (dbError) throw dbError;
}

export async function setPrimaryPhoto(propertyId: string, photoId: string): Promise<void> {
  await supabase
    .from("property_photos")
    .update({ is_primary: false })
    .eq("property_id", propertyId);

  const { error } = await supabase
    .from("property_photos")
    .update({ is_primary: true })
    .eq("id", photoId);

  if (error) throw error;
}
