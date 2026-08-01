import { api } from "./api-client";

export interface RenovationItem {
  id: string;
  userId: string;
  propertyId: string;
  projectId: string | null;
  category: string;
  description: string | null;
  estimatedCost: number;
  actualCost: number | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RenovationItemInput {
  propertyId: string;
  projectId?: string | null;
  category: string;
  description?: string | null;
  estimatedCost: number;
  actualCost?: number | null;
  completed?: boolean;
}

export async function fetchRenovationItems(): Promise<RenovationItem[]> {
  return api.get<RenovationItem[]>("/renovation-items");
}

export async function addRenovationItem(data: RenovationItemInput): Promise<RenovationItem> {
  return api.post<RenovationItem>("/renovation-items", data);
}

export async function updateRenovationItem(
  id: string,
  data: Partial<RenovationItemInput>,
): Promise<RenovationItem> {
  return api.patch<RenovationItem>(`/renovation-items/${id}`, data);
}

export async function deleteRenovationItem(id: string): Promise<void> {
  await api.delete(`/renovation-items/${id}`);
}
