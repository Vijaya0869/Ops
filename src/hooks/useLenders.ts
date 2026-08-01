import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as lendersService from "@/services/lenders.service";
import type { Lender, LenderInput } from "@/services/lenders.service";

export type { Lender, LenderInput };

export function useLenders() {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    lendersService
      .fetchLenders()
      .then(setLenders)
      .catch((error) => {
        console.error("Error fetching lenders:", error);
        toast.error("Failed to load lenders");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addLender = async (data: LenderInput) => {
    try {
      const lender = await lendersService.addLender(data);
      setLenders((prev) => [lender, ...prev]);
      toast.success("Lender added");
      return lender;
    } catch (error) {
      console.error("Error adding lender:", error);
      toast.error("Failed to add lender");
      return null;
    }
  };

  const updateLender = async (id: string, data: Partial<LenderInput>) => {
    try {
      const updated = await lendersService.updateLender(id, data);
      setLenders((prev) => prev.map((l) => (l.id === id ? updated : l)));
      toast.success("Lender updated");
      return updated;
    } catch (error) {
      console.error("Error updating lender:", error);
      toast.error("Failed to update lender");
      return null;
    }
  };

  const deleteLender = async (id: string) => {
    try {
      await lendersService.deleteLender(id);
      setLenders((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lender deleted");
      return true;
    } catch (error) {
      console.error("Error deleting lender:", error);
      toast.error("Failed to delete lender");
      return false;
    }
  };

  return { lenders, loading, addLender, updateLender, deleteLender };
}
