import { useState, useEffect } from "react";
import { Deal, DealFormData, DealStage } from "@/types/deal";
import { toast } from "sonner";
import { sendDealStageNotification } from "@/lib/notifications";
import { useAuth } from "./useAuth";
import * as dealsService from "@/services/deals.service";

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setDeals([]);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      try {
        setDeals(await dealsService.fetchDeals());
      } catch (error) {
        console.error("Error fetching deals:", error);
        toast.error("Failed to load deals");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user]);

  const addDeal = async (data: Partial<DealFormData>) => {
    if (!user) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      const newDeal = await dealsService.addDeal(data);
      setDeals((prev) => [newDeal, ...prev]);
      toast.success("Deal added successfully");
      return newDeal;
    } catch (error: any) {
      console.error("Error adding deal:", error);
      toast.error(error.message || "Failed to add deal");
      return null;
    }
  };

  const updateDeal = async (id: string, data: Partial<DealFormData>) => {
    const deal = deals.find((d) => d.id === id);

    try {
      const updatedDeal = await dealsService.updateDeal(id, data);
      setDeals((prev) => prev.map((d) => (d.id === id ? updatedDeal : d)));

      if (deal && !deal.property_id && updatedDeal.property_id) {
        toast.success(`Property created from "${updatedDeal.title}"`);
      } else {
        toast.success("Deal updated successfully");
      }
      return updatedDeal;
    } catch (error: any) {
      console.error("Error updating deal:", error);
      toast.error(error.message || "Failed to update deal");
      return null;
    }
  };

  const updateDealStage = async (id: string, stage: DealStage) => {
    const deal = deals.find((d) => d.id === id);
    const oldStage = deal?.stage;

    try {
      const updatedDeal = await dealsService.updateDealStage(id, stage);
      setDeals((prev) => prev.map((d) => (d.id === id ? updatedDeal : d)));

      if (deal && !deal.property_id && updatedDeal.property_id) {
        toast.success(`Property created from "${deal.title}"`);
      }

      // Send notification for stage change
      if (deal && oldStage && oldStage !== stage) {
        sendDealStageNotification({
          dealTitle: deal.title,
          oldStage,
          newStage: stage,
        });
      }
    } catch (error) {
      console.error("Error updating deal stage:", error);
      toast.error("Failed to update deal stage");
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      await dealsService.deleteDeal(id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deal deleted successfully");
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
    }
  };

  // Manual refetch function for edge cases
  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      setDeals(await dealsService.fetchDeals());
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deals,
    isLoading,
    fetchDeals,
    addDeal,
    updateDeal,
    updateDealStage,
    deleteDeal,
  };
}
