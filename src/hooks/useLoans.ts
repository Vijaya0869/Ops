import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as loansService from "@/services/loans.service";
import type { Loan, LoanInput } from "@/services/loans.service";

export type { Loan, LoanInput };

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loansService
      .fetchLoans()
      .then(setLoans)
      .catch((error) => {
        console.error("Error fetching loans:", error);
        toast.error("Failed to load loans");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addLoan = async (data: LoanInput) => {
    try {
      const loan = await loansService.addLoan(data);
      setLoans((prev) => [loan, ...prev]);
      toast.success("Loan added");
      return loan;
    } catch (error) {
      console.error("Error adding loan:", error);
      toast.error("Failed to add loan");
      return null;
    }
  };

  const updateLoan = async (id: string, data: Partial<LoanInput>) => {
    try {
      const updated = await loansService.updateLoan(id, data);
      setLoans((prev) => prev.map((l) => (l.id === id ? updated : l)));
      toast.success("Loan updated");
      return updated;
    } catch (error) {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
      return null;
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      await loansService.deleteLoan(id);
      setLoans((prev) => prev.filter((l) => l.id !== id));
      toast.success("Loan deleted");
      return true;
    } catch (error) {
      console.error("Error deleting loan:", error);
      toast.error("Failed to delete loan");
      return false;
    }
  };

  return { loans, loading, addLoan, updateLoan, deleteLoan };
}
