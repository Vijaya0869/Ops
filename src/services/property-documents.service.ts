import { supabase } from "@/integrations/supabase/client";

export interface PropertyDocument {
  id: string;
  property_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  document_type: string | null;
  created_at: string;
}

export async function fetchDocuments(propertyId: string): Promise<PropertyDocument[]> {
  const { data, error } = await supabase
    .from("property_documents")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function uploadDocument(
  propertyId: string,
  userId: string,
  file: File,
  documentType?: string,
): Promise<PropertyDocument> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${propertyId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("property-documents")
    .upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from("property_documents")
    .insert({
      property_id: propertyId,
      user_id: userId,
      file_path: filePath,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      document_type: documentType || null,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  return data;
}

export async function deleteDocument(doc: PropertyDocument): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from("property-documents")
    .remove([doc.file_path]);
  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from("property_documents")
    .delete()
    .eq("id", doc.id);
  if (dbError) throw dbError;
}

export async function downloadDocument(doc: PropertyDocument): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from("property-documents")
    .download(doc.file_path);
  if (error) throw error;
  return data;
}
