import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import * as photosService from "@/services/property-photos.service";
import type { PropertyPhoto } from "@/services/property-photos.service";

export type { PropertyPhoto };

export function usePropertyPhotos(propertyId: string | null) {
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    if (!propertyId) return;

    setIsLoading(true);
    try {
      setPhotos(await photosService.fetchPhotos(propertyId));
    } catch (error) {
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
      const photo = await photosService.uploadPhoto(propertyId, file);
      setPhotos((prev) => [photo, ...prev]);

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });

      return photo;
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
      await photosService.deletePhoto(photo);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const setPrimaryPhoto = async (photo: PropertyPhoto) => {
    if (!propertyId) return;

    try {
      await photosService.setPrimaryPhoto(propertyId, photo.id);

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
    } catch (error) {
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
