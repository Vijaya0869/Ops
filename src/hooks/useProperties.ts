import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyFormData } from "@/types/property";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

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

    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();

    // Real-time subscription
    const channel = supabase
      .channel(channelNameRef.current)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProperties((prev) => [payload.new as Property, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProperties((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Property) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProperties((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addProperty = async (formData: Partial<PropertyFormData>) => {
    if (!user) {
      toast.error("You must be logged in to add properties");
      return null;
    }

    const { data, error } = await supabase
      .from("properties")
      .insert({
        user_id: user.id,
        address: formData.address,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null,
        county: formData.county || null,
        property_type: formData.property_type || null,
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        square_feet: formData.square_feet || null,
        lot_size: formData.lot_size || null,
        year_built: formData.year_built || null,
        purchase_price: formData.purchase_price || null,
        arv: formData.arv || null,
        rehab_budget: formData.rehab_budget || null,
        actual_rehab_cost: formData.actual_rehab_cost || null,
        holding_costs: formData.holding_costs || null,
        sale_price: formData.sale_price || null,
        monthly_rent: formData.monthly_rent || null,
        monthly_expenses: formData.monthly_expenses || null,
        loan_amount: formData.loan_amount || null,
        interest_rate: formData.interest_rate || null,
        lender_name: formData.lender_name || null,
        status: formData.status || 'lead',
        acquisition_date: formData.acquisition_date || null,
        sale_date: formData.sale_date || null,
        notes: formData.notes || null,
        mls_number: formData.mls_number || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property");
      return null;
    }

    toast.success("Property added successfully");
    // Real-time subscription will update the list automatically
    return data as Property;
  };

  const updateProperty = async (id: string, formData: Partial<PropertyFormData>) => {
    const { error } = await supabase
      .from("properties")
      .update({
        address: formData.address,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null,
        county: formData.county || null,
        property_type: formData.property_type || null,
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        square_feet: formData.square_feet || null,
        lot_size: formData.lot_size || null,
        year_built: formData.year_built || null,
        purchase_price: formData.purchase_price || null,
        arv: formData.arv || null,
        rehab_budget: formData.rehab_budget || null,
        actual_rehab_cost: formData.actual_rehab_cost || null,
        holding_costs: formData.holding_costs || null,
        sale_price: formData.sale_price || null,
        monthly_rent: formData.monthly_rent || null,
        monthly_expenses: formData.monthly_expenses || null,
        loan_amount: formData.loan_amount || null,
        interest_rate: formData.interest_rate || null,
        lender_name: formData.lender_name || null,
        status: formData.status || 'lead',
        acquisition_date: formData.acquisition_date || null,
        sale_date: formData.sale_date || null,
        notes: formData.notes || null,
        mls_number: formData.mls_number || null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
      return false;
    }

    toast.success("Property updated successfully");
    // Real-time subscription will update the list automatically
    return true;
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
      return false;
    }

    toast.success("Property deleted successfully");
    // Real-time subscription will update the list automatically
    return true;
  };

  // Manual refetch function for edge cases
  const refetch = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } else {
      setProperties(data as Property[]);
    }
    setLoading(false);
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