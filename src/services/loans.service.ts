import { api } from "./api-client";

export type LoanStatus = "active" | "paid_off" | "defaulted" | "refinanced";

export interface Loan {
  id: string;
  userId: string;
  propertyId: string;
  lenderId: string | null;
  principal: number;
  interestRate: number;
  termMonths: number | null;
  monthlyPayment: number | null;
  startDate: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoanInput {
  propertyId: string;
  lenderId?: string | null;
  principal: number;
  interestRate: number;
  termMonths?: number | null;
  monthlyPayment?: number | null;
  startDate: string;
  status?: LoanStatus;
}

export async function fetchLoans(): Promise<Loan[]> {
  return api.get<Loan[]>("/loans");
}

export async function addLoan(data: LoanInput): Promise<Loan> {
  return api.post<Loan>("/loans", data);
}

export async function updateLoan(id: string, data: Partial<LoanInput>): Promise<Loan> {
  return api.patch<Loan>(`/loans/${id}`, data);
}

export async function deleteLoan(id: string): Promise<void> {
  await api.delete(`/loans/${id}`);
}
