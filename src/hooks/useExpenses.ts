import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as expensesService from "@/services/expenses.service";
import type { Expense, ExpenseInput } from "@/services/expenses.service";

export type { Expense, ExpenseInput };

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    expensesService
      .fetchExpenses()
      .then(setExpenses)
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addExpense = async (data: ExpenseInput) => {
    try {
      const expense = await expensesService.addExpense(data);
      setExpenses((prev) => [expense, ...prev]);
      toast.success("Expense added");
      return expense;
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
      return null;
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseInput>) => {
    try {
      const updated = await expensesService.updateExpense(id, data);
      setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast.success("Expense updated");
      return updated;
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
      return null;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesService.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Expense deleted");
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
      return false;
    }
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense };
}
