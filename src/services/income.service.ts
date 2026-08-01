import { api } from "./api-client";

export interface Income {
  id: string;
  userId: string;
  propertyId: string;
  category: string;
  description: string | null;
  amount: number;
  incomeDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeInput {
  propertyId: string;
  category: string;
  description?: string | null;
  amount: number;
  incomeDate: string;
}

export async function fetchIncome(): Promise<Income[]> {
  return api.get<Income[]>("/income");
}

export async function addIncome(data: IncomeInput): Promise<Income> {
  return api.post<Income>("/income", data);
}

export async function updateIncome(id: string, data: Partial<IncomeInput>): Promise<Income> {
  return api.patch<Income>(`/income/${id}`, data);
}

export async function deleteIncome(id: string): Promise<void> {
  await api.delete(`/income/${id}`);
}
