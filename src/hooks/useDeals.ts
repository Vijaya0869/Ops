import { useState, useEffect, useRef } from "react";
import { Deal, DealFormData, DealStage } from "@/types/deal";
import { toast } from "sonner";
import { sendDealStageNotification } from "@/lib/notifications";
import { useAuth } from "./useAuth";
import * as dealsService from "@/services/deals.service";

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const channelNameRef = useRef(`deals-realtime-${crypto.randomUUID()}`);

  // Fetch deals and set up real-time subscription
  useEffect(() => {
    // Row-level security returns nothing without a session, so wait for it —
    // otherwise a hard refresh loads an empty list and never retries.
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

    const channel = dealsService.subscribeToDeals(channelNameRef.current, {
      onInsert: (row) => setDeals((prev) => [row, ...prev]),
      onUpdate: (row) => setDeals((prev) => prev.map((d) => (d.id === row.id ? row : d))),
      onDelete: (id) => setDeals((prev) => prev.filter((d) => d.id !== id)),
    });

    return () => dealsService.unsubscribe(channel);
  }, [user]);

  const addDeal = async (data: Partial<DealFormData>) => {
    if (!user) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      const newDeal = await dealsService.addDeal(user.id, data);
      toast.success("Deal added successfully");
      // Real-time subscription will update the list automatically
      return newDeal;
    } catch (error: any) {
      console.error("Error adding deal:", error);
      toast.error(error.message || "Failed to add deal");
      return null;
    }
  };

  const updateDeal = async (id: string, data: Partial<DealFormData>) => {
    try {
      const updatedDeal = await dealsService.updateDeal(id, data);
      toast.success("Deal updated successfully");
      // Real-time subscription will update the list automatically
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
      await dealsService.updateDealStage(id, stage);

      // Send notification for stage change
      if (deal && oldStage && oldStage !== stage) {
        sendDealStageNotification({
          dealTitle: deal.title,
          oldStage,
          newStage: stage,
        });
      }
      // Real-time subscription will update the list automatically
    } catch (error) {
      console.error("Error updating deal stage:", error);
      toast.error("Failed to update deal stage");
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      await dealsService.deleteDeal(id);
      toast.success("Deal deleted successfully");
      // Real-time subscription will update the list automatically
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
