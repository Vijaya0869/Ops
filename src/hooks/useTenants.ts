import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as tenantsService from "@/services/tenants.service";
import type { Tenant, TenantInput } from "@/services/tenants.service";

export type { Tenant, TenantInput };

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    tenantsService
      .fetchTenants()
      .then(setTenants)
      .catch((error) => {
        console.error("Error fetching tenants:", error);
        toast.error("Failed to load tenants");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addTenant = async (data: TenantInput) => {
    try {
      const tenant = await tenantsService.addTenant(data);
      setTenants((prev) => [tenant, ...prev]);
      toast.success("Tenant added");
      return tenant;
    } catch (error) {
      console.error("Error adding tenant:", error);
      toast.error("Failed to add tenant");
      return null;
    }
  };

  const updateTenant = async (id: string, data: Partial<TenantInput>) => {
    try {
      const updated = await tenantsService.updateTenant(id, data);
      setTenants((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Tenant updated");
      return updated;
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error("Failed to update tenant");
      return null;
    }
  };

  const deleteTenant = async (id: string) => {
    try {
      await tenantsService.deleteTenant(id);
      setTenants((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tenant deleted");
      return true;
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast.error("Failed to delete tenant");
      return false;
    }
  };

  return { tenants, loading, addTenant, updateTenant, deleteTenant };
}
