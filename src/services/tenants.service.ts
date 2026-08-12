import { api } from "./api-client";

export type TenantStatus = "active" | "past" | "pending" | "evicted";

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  monthlyRent: number;
  depositAmount: number | null;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TenantInput {
  propertyId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  leaseStart?: string | null;
  leaseEnd?: string | null;
  monthlyRent: number;
  depositAmount?: number | null;
  status?: TenantStatus;
}

export async function fetchTenants(): Promise<Tenant[]> {
  return api.get<Tenant[]>("/tenants");
}

export async function addTenant(data: TenantInput): Promise<Tenant> {
  return api.post<Tenant>("/tenants", data);
}

export async function updateTenant(id: string, data: Partial<TenantInput>): Promise<Tenant> {
  return api.patch<Tenant>(`/tenants/${id}`, data);
}

export async function deleteTenant(id: string): Promise<void> {
  await api.delete(`/tenants/${id}`);
}
