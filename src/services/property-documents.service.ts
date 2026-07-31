import { api, API_URL, getToken } from "./api-client";

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

interface ApiDocument {
  id: string;
  userId: string;
  propertyId: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  fileSize: number | null;
  documentType: string | null;
  createdAt: string;
}

function fromApi(row: ApiDocument): PropertyDocument {
  return {
    id: row.id,
    property_id: row.propertyId,
    user_id: row.userId,
    file_path: row.filePath,
    file_name: row.fileName,
    file_type: row.fileType,
    file_size: row.fileSize,
    document_type: row.documentType,
    created_at: row.createdAt,
  };
}

export async function fetchDocuments(propertyId: string): Promise<PropertyDocument[]> {
  const rows = await api.get<ApiDocument[]>(`/property-documents?propertyId=${propertyId}`);
  return rows.map(fromApi);
}

export async function uploadDocument(
  propertyId: string,
  file: File,
  documentType?: string,
): Promise<PropertyDocument> {
  const formData = new FormData();
  formData.append("file", file);
  if (documentType) formData.append("documentType", documentType);
  const row = await api.post<ApiDocument>(
    `/property-documents?propertyId=${propertyId}`,
    formData,
  );
  return fromApi(row);
}

export async function deleteDocument(doc: PropertyDocument): Promise<void> {
  await api.delete(`/property-documents/${doc.id}`);
}

export async function downloadDocument(doc: PropertyDocument): Promise<Blob> {
  const response = await fetch(`${API_URL}/property-documents/${doc.id}/download`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error("Failed to download document");
  return response.blob();
}
