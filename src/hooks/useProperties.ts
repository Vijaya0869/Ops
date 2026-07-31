import { useState, useEffect, useRef } from "react";
import { Property, PropertyFormData } from "@/types/property";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as propertiesService from "@/services/properties.service";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const channelNameRef = useRef(`properties-realtime-${crypto.randomUUID()}`);

  // Fetch properties and set up real-time subscription
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        setProperties(await propertiesService.fetchProperties());
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    load();

    const channel = propertiesService.subscribeToProperties(channelNameRef.current, {
      onInsert: (row) => setProperties((prev) => [row, ...prev]),
      onUpdate: (row) => setProperties((prev) => prev.map((p) => (p.id === row.id ? row : p))),
      onDelete: (id) => setProperties((prev) => prev.filter((p) => p.id !== id)),
    });

    return () => propertiesService.unsubscribe(channel);
  }, [user]);

  const addProperty = async (formData: Partial<PropertyFormData>) => {
    if (!user) {
      toast.error("You must be logged in to add properties");
      return null;
    }

    try {
      const property = await propertiesService.addProperty(user.id, formData);
      toast.success("Property added successfully");
      // Real-time subscription will update the list automatically
      return property;
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property");
      return null;
    }
  };

  const updateProperty = async (id: string, formData: Partial<PropertyFormData>) => {
    try {
      await propertiesService.updateProperty(id, formData);
      toast.success("Property updated successfully");
      // Real-time subscription will update the list automatically
      return true;
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
      return false;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await propertiesService.deleteProperty(id);
      toast.success("Property deleted successfully");
      // Real-time subscription will update the list automatically
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
      return false;
    }
  };

  // Manual refetch function for edge cases
  const refetch = async () => {
    if (!user) return;

    setLoading(true);
    try {
      setProperties(await propertiesService.fetchProperties());
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch,
  };
}
