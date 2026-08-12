import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as rentPaymentsService from "@/services/rent-payments.service";
import type { RentPayment, RentPaymentInput } from "@/services/rent-payments.service";

export type { RentPayment, RentPaymentInput };

export function useRentPayments() {
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    rentPaymentsService
      .fetchRentPayments()
      .then(setRentPayments)
      .catch((error) => {
        console.error("Error fetching rent payments:", error);
        toast.error("Failed to load rent payments");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addRentPayment = async (data: RentPaymentInput) => {
    try {
      const payment = await rentPaymentsService.addRentPayment(data);
      setRentPayments((prev) => [payment, ...prev]);
      toast.success("Rent payment added");
      return payment;
    } catch (error) {
      console.error("Error adding rent payment:", error);
      toast.error("Failed to add rent payment");
      return null;
    }
  };

  const updateRentPayment = async (id: string, data: Partial<RentPaymentInput>) => {
    try {
      const updated = await rentPaymentsService.updateRentPayment(id, data);
      setRentPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success("Rent payment updated");
      return updated;
    } catch (error) {
      console.error("Error updating rent payment:", error);
      toast.error("Failed to update rent payment");
      return null;
    }
  };

  const deleteRentPayment = async (id: string) => {
    try {
      await rentPaymentsService.deleteRentPayment(id);
      setRentPayments((prev) => prev.filter((p) => p.id !== id));
      toast.success("Rent payment deleted");
      return true;
    } catch (error) {
      console.error("Error deleting rent payment:", error);
      toast.error("Failed to delete rent payment");
      return false;
    }
  };

  return { rentPayments, loading, addRentPayment, updateRentPayment, deleteRentPayment };
}
