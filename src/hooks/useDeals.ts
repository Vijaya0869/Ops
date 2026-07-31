import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Deal, DealFormData, DealStage } from "@/types/deal";
import { toast } from "sonner";
import { sendDealStageNotification } from "@/lib/notifications";
import { useAuth } from "./useAuth";

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

    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("deals")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setDeals((data as Deal[]) || []);
      } catch (error: any) {
        console.error("Error fetching deals:", error);
        toast.error("Failed to load deals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();

    // Real-time subscription
    const channel = supabase
      .channel(channelNameRef.current)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDeals((prev) => [payload.new as Deal, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDeals((prev) =>
              prev.map((d) => (d.id === payload.new.id ? (payload.new as Deal) : d))
            );
          } else if (payload.eventType === 'DELETE') {
            setDeals((prev) => prev.filter((d) => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addDeal = async (data: Partial<DealFormData>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const insertData = {
        title: data.title || "",
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        asking_price: data.asking_price || null,
        offer_price: data.offer_price || null,
        arv: data.arv || null,
        rehab_estimate: data.rehab_estimate || null,
        expected_profit: data.expected_profit || null,
        stage: data.stage || "lead",
        source: data.source || null,
        contact_name: data.contact_name || null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        notes: data.notes || null,
        user_id: userData.user.id,
      };

      const { data: newDeal, error } = await supabase
        .from("deals")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

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
      const { data: updatedDeal, error } = await supabase
        .from("deals")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

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
      const { error } = await supabase
        .from("deals")
        .update({ stage })
        .eq("id", id);

      if (error) throw error;

      // Send notification for stage change
      if (deal && oldStage && oldStage !== stage) {
        sendDealStageNotification({
          dealTitle: deal.title,
          oldStage,
          newStage: stage,
        });
      }
      // Real-time subscription will update the list automatically
    } catch (error: any) {
      console.error("Error updating deal stage:", error);
      toast.error("Failed to update deal stage");
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);

      if (error) throw error;

      toast.success("Deal deleted successfully");
      // Real-time subscription will update the list automatically
    } catch (error: any) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
    }
  };

  // Manual refetch function for edge cases
  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDeals((data as Deal[]) || []);
    } catch (error: any) {
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
