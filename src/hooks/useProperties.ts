import { useState, useEffect } from "react";
import { Property, PropertyFormData } from "@/types/property";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as propertiesService from "@/services/properties.service";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
  }, [user]);

  const addProperty = async (formData: Partial<PropertyFormData>) => {
    if (!user) {
      toast.error("You must be logged in to add properties");
      return null;
    }

    try {
      const property = await propertiesService.addProperty(formData);
      setProperties((prev) => [property, ...prev]);
      toast.success("Property added successfully");
      return property;
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property");
      return null;
    }
  };

  const updateProperty = async (id: string, formData: Partial<PropertyFormData>) => {
    try {
      const updated = await propertiesService.updateProperty(id, formData);
      setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success("Property updated successfully");
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
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success("Property deleted successfully");
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
