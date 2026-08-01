import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as incomeService from "@/services/income.service";
import type { Income, IncomeInput } from "@/services/income.service";

export type { Income, IncomeInput };

export function useIncome() {
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    incomeService
      .fetchIncome()
      .then(setIncome)
      .catch((error) => {
        console.error("Error fetching income:", error);
        toast.error("Failed to load income");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addIncome = async (data: IncomeInput) => {
    try {
      const record = await incomeService.addIncome(data);
      setIncome((prev) => [record, ...prev]);
      toast.success("Income added");
      return record;
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income");
      return null;
    }
  };

  const updateIncome = async (id: string, data: Partial<IncomeInput>) => {
    try {
      const updated = await incomeService.updateIncome(id, data);
      setIncome((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success("Income updated");
      return updated;
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income");
      return null;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomeService.deleteIncome(id);
      setIncome((prev) => prev.filter((i) => i.id !== id));
      toast.success("Income deleted");
      return true;
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
      return false;
    }
  };

  return { income, loading, addIncome, updateIncome, deleteIncome };
}
