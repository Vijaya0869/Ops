import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePropertyPhotos, PropertyPhoto } from "@/hooks/usePropertyPhotos";
import { Upload, Trash2, Star, Loader2, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyPhotoUploadProps {
  propertyId: string | null;
}

export function PropertyPhotoUpload({ propertyId }: PropertyPhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    photos,
    isLoading,
    isUploading,
    fetchPhotos,
    uploadPhoto,
    deletePhoto,
    setPrimaryPhoto,
  } = usePropertyPhotos(propertyId);

  useEffect(() => {
    if (propertyId) {
      fetchPhotos();
    }
  }, [propertyId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        continue;
      }
      await uploadPhoto(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Image className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">Save the property first to add photos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Property Photos</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Image className="h-12 w-12 mb-2 opacity-50" />
          <p className="text-sm">No photos yet</p>
          <p className="text-xs">Click upload to add photos</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => deletePhoto(photo)}
              onSetPrimary={() => setPrimaryPhoto(photo)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PhotoCardProps {
  photo: PropertyPhoto;
  onDelete: () => void;
  onSetPrimary: () => void;
}

function PhotoCard({ photo, onDelete, onSetPrimary }: PhotoCardProps) {
  return (
    <div className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
      <img
        src={photo.url}
        alt={photo.file_name}
        className="w-full h-full object-cover"
      />
      {photo.is_primary && (
        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
          Primary
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
        {!photo.is_primary && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={onSetPrimary}
            title="Set as primary"
          >
            <Star className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
          title="Delete photo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
