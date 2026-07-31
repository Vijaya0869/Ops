import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import * as documentsService from "@/services/property-documents.service";
import { getCurrentUser } from "@/services/auth.service";
import type { PropertyDocument } from "@/services/property-documents.service";

export type { PropertyDocument };

export function usePropertyDocuments(propertyId: string | null) {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!propertyId) return;

    setIsLoading(true);
    try {
      setDocuments(await documentsService.fetchDocuments(propertyId));
    } catch (error) {
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
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const doc = await documentsService.uploadDocument(propertyId, user.id, file, documentType);
      setDocuments((prev) => [doc, ...prev]);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      return doc;
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
      await documentsService.deleteDocument(doc);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
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
      const blob = await documentsService.downloadDocument(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
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
