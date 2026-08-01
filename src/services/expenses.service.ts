import { api } from "./api-client";

export interface Expense {
  id: string;
  userId: string;
  propertyId: string;
  category: string;
  description: string | null;
  amount: number;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  propertyId: string;
  category: string;
  description?: string | null;
  amount: number;
  expenseDate: string;
}

export async function fetchExpenses(): Promise<Expense[]> {
  return api.get<Expense[]>("/expenses");
}

export async function addExpense(data: ExpenseInput): Promise<Expense> {
  return api.post<Expense>("/expenses", data);
}

export async function updateExpense(id: string, data: Partial<ExpenseInput>): Promise<Expense> {
  return api.patch<Expense>(`/expenses/${id}`, data);
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
