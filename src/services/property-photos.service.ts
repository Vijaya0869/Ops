import { api, resolveFileUrl } from "./api-client";

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

interface ApiPhoto {
  id: string;
  userId: string;
  propertyId: string;
  fileName: string;
  filePath: string;
  isPrimary: boolean;
  createdAt: string;
}

function fromApi(row: ApiPhoto): PropertyPhoto {
  return {
    id: row.id,
    property_id: row.propertyId,
    user_id: row.userId,
    file_path: row.filePath,
    file_name: row.fileName,
    is_primary: row.isPrimary,
    created_at: row.createdAt,
    url: resolveFileUrl(row.filePath),
  };
}

export async function fetchPhotos(propertyId: string): Promise<PropertyPhoto[]> {
  const rows = await api.get<ApiPhoto[]>(`/property-photos?propertyId=${propertyId}`);
  return rows.map(fromApi);
}

export async function uploadPhoto(propertyId: string, file: File): Promise<PropertyPhoto> {
  const formData = new FormData();
  formData.append("file", file);
  const row = await api.post<ApiPhoto>(`/property-photos?propertyId=${propertyId}`, formData);
  return fromApi(row);
}

export async function deletePhoto(photo: PropertyPhoto): Promise<void> {
  await api.delete(`/property-photos/${photo.id}`);
}

export async function setPrimaryPhoto(_propertyId: string, photoId: string): Promise<void> {
  await api.patch(`/property-photos/${photoId}/primary`);
}
