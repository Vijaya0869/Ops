import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as renovationItemsService from "@/services/renovation-items.service";
import type { RenovationItem, RenovationItemInput } from "@/services/renovation-items.service";

export type { RenovationItem, RenovationItemInput };

export function useRenovationItems() {
  const [renovationItems, setRenovationItems] = useState<RenovationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    renovationItemsService
      .fetchRenovationItems()
      .then(setRenovationItems)
      .catch((error) => {
        console.error("Error fetching renovation items:", error);
        toast.error("Failed to load renovation items");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addRenovationItem = async (data: RenovationItemInput) => {
    try {
      const item = await renovationItemsService.addRenovationItem(data);
      setRenovationItems((prev) => [item, ...prev]);
      toast.success("Renovation item added");
      return item;
    } catch (error) {
      console.error("Error adding renovation item:", error);
      toast.error("Failed to add renovation item");
      return null;
    }
  };

  const updateRenovationItem = async (id: string, data: Partial<RenovationItemInput>) => {
    try {
      const updated = await renovationItemsService.updateRenovationItem(id, data);
      setRenovationItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success("Renovation item updated");
      return updated;
    } catch (error) {
      console.error("Error updating renovation item:", error);
      toast.error("Failed to update renovation item");
      return null;
    }
  };

  const deleteRenovationItem = async (id: string) => {
    try {
      await renovationItemsService.deleteRenovationItem(id);
      setRenovationItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Renovation item deleted");
      return true;
    } catch (error) {
      console.error("Error deleting renovation item:", error);
      toast.error("Failed to delete renovation item");
      return false;
    }
  };

  return { renovationItems, loading, addRenovationItem, updateRenovationItem, deleteRenovationItem };
}
