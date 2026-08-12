import { api } from "./api-client";

export type RentPaymentStatus = "paid" | "late" | "partial" | "missed";

export interface RentPayment {
  id: string;
  tenantId: string;
  amountDue: number;
  amountPaid: number | null;
  dueDate: string;
  paidDate: string | null;
  status: RentPaymentStatus;
  createdAt: string;
}

export interface RentPaymentInput {
  tenantId: string;
  amountDue: number;
  amountPaid?: number | null;
  dueDate: string;
  paidDate?: string | null;
  status?: RentPaymentStatus;
}

export async function fetchRentPayments(): Promise<RentPayment[]> {
  return api.get<RentPayment[]>("/rent-payments");
}

export async function addRentPayment(data: RentPaymentInput): Promise<RentPayment> {
  return api.post<RentPayment>("/rent-payments", data);
}

export async function updateRentPayment(id: string, data: Partial<RentPaymentInput>): Promise<RentPayment> {
  return api.patch<RentPayment>(`/rent-payments/${id}`, data);
}

export async function deleteRentPayment(id: string): Promise<void> {
  await api.delete(`/rent-payments/${id}`);
}
