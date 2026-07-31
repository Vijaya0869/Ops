import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export function usePropertyPhotos(propertyId: string | null) {
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("property_photos")
        .select("*")
        .eq("property_id", propertyId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const photosWithUrls = (data || []).map((photo) => ({
        ...photo,
        url: supabase.storage
          .from("property-photos")
          .getPublicUrl(photo.file_path).data.publicUrl,
      }));

      setPhotos(photosWithUrls);
    } catch (error: any) {
      console.error("Error fetching photos:", error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
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
          is_primary: photos.length === 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const photoWithUrl = {
        ...data,
        url: supabase.storage
          .from("property-photos")
          .getPublicUrl(data.file_path).data.publicUrl,
      };

      setPhotos((prev) => [photoWithUrl, ...prev]);
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });

      return photoWithUrl;
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (photo: PropertyPhoto) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("property-photos")
        .remove([photo.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("property_photos")
        .delete()
        .eq("id", photo.id);

      if (dbError) throw dbError;

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const setPrimaryPhoto = async (photo: PropertyPhoto) => {
    try {
      // Reset all photos to non-primary
      await supabase
        .from("property_photos")
        .update({ is_primary: false })
        .eq("property_id", propertyId);

      // Set selected photo as primary
      const { error } = await supabase
        .from("property_photos")
        .update({ is_primary: true })
        .eq("id", photo.id);

      if (error) throw error;

      setPhotos((prev) =>
        prev.map((p) => ({
          ...p,
          is_primary: p.id === photo.id,
        }))
      );

      toast({
        title: "Success",
        description: "Primary photo updated",
      });
    } catch (error: any) {
      console.error("Error setting primary photo:", error);
      toast({
        title: "Error",
        description: "Failed to update primary photo",
        variant: "destructive",
      });
    }
  };

  return {
    photos,
    isLoading,
    isUploading,
    fetchPhotos,
    uploadPhoto,
    deletePhoto,
    setPrimaryPhoto,
  };
}
