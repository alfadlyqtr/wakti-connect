
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: "active" | "inactive";
}

export const useServiceCrud = () => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openAddService, setOpenAddService] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createService = async (data: ServiceFormData): Promise<Service> => {
    setIsCreating(true);
    try {
      const { data: serviceData, error } = await supabase
        .from("business_services")
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Service created",
        description: "Your service has been created successfully.",
      });

      return {
        ...serviceData,
        status: "active",
      } as Service;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>): Promise<Service> => {
    setIsUpdating(true);
    try {
      const { data: serviceData, error } = await supabase
        .from("business_services")
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Service updated",
        description: "Your service has been updated successfully.",
      });

      return {
        ...serviceData,
        status: "active",
      } as Service;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("business_services")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Service deleted",
        description: "Your service has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
    isDeleting,
    // State for the UI
    editingService,
    setEditingService,
    openAddService,
    setOpenAddService,
  };
};
