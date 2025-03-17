
import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service, ServiceFormValues } from "@/types/service.types";
import { toast } from "@/components/ui/use-toast";
import { useServiceStaffAssignments } from './useServiceStaffAssignments';

export const useServiceMutations = () => {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openAddService, setOpenAddService] = useState(false);
  const { assignStaffToService } = useServiceStaffAssignments();

  // Add service mutation
  const addServiceMutation = useMutation({
    mutationFn: async (formData: ServiceFormValues) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      // Insert the service
      const { data: serviceData, error: serviceError } = await supabase
        .from('business_services')
        .insert({
          name: formData.name,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          duration: parseInt(formData.duration),
          business_id: session.session.user.id
        })
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Handle staff assignments if provided
      if (formData.staff_ids && formData.staff_ids.length > 0) {
        await assignStaffToService(serviceData.id, formData.staff_ids);
      }

      return serviceData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      toast({
        title: "Service added",
        description: "The service has been added successfully.",
      });
      setOpenAddService(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add service",
        variant: "destructive"
      });
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: ServiceFormValues }) => {
      // Update the service
      const { data, error } = await supabase
        .from('business_services')
        .update({
          name: formData.name,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          duration: parseInt(formData.duration),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Handle staff assignments
      if (formData.staff_ids !== undefined) {
        await assignStaffToService(id, formData.staff_ids || []);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      toast({
        title: "Service updated",
        description: "The service has been updated successfully.",
      });
      setOpenAddService(false);
      setEditingService(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive"
      });
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete staff assignments
      const { error: assignmentError } = await supabase
        .from('staff_service_assignments')
        .delete()
        .eq('service_id', id);

      if (assignmentError) throw assignmentError;

      // Then delete the service
      const { error } = await supabase
        .from('business_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive"
      });
    }
  });

  return {
    editingService,
    setEditingService,
    openAddService,
    setOpenAddService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  };
};
