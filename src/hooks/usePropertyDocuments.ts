import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export function usePropertyDocuments(propertyId: string | null) {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!propertyId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("property_documents")
        .select("*")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (file: File, documentType?: string) => {
    if (!propertyId) return null;

    setIsUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const userId = userData.user.id;
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

      setDocuments((prev) => [data, ...prev]);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      return data;
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (doc: PropertyDocument) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("property-documents")
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("property_documents")
        .delete()
        .eq("id", doc.id);

      if (dbError) throw dbError;

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (doc: PropertyDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("property-documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    isLoading,
    isUploading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
  };
}
