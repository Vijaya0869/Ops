import { api } from "./api-client";

export interface Lender {
  id: string;
  userId: string;
  name: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  lenderType: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LenderInput {
  name: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  lenderType?: string | null;
  notes?: string | null;
}

export async function fetchLenders(): Promise<Lender[]> {
  return api.get<Lender[]>("/lenders");
}

export async function addLender(data: LenderInput): Promise<Lender> {
  return api.post<Lender>("/lenders", data);
}

export async function updateLender(id: string, data: Partial<LenderInput>): Promise<Lender> {
  return api.patch<Lender>(`/lenders/${id}`, data);
}

export async function deleteLender(id: string): Promise<void> {
  await api.delete(`/lenders/${id}`);
}
