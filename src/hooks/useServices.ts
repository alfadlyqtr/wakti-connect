
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service, ServiceFormValues } from "@/types/service.types";
import { toast } from "@/components/ui/use-toast";

export const useServices = () => {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openAddService, setOpenAddService] = useState(false);

  // Fetch services
  const { 
    data: services, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['businessServices'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Service[];
    }
  });

  // Add service mutation
  const addServiceMutation = useMutation({
    mutationFn: async (formData: ServiceFormValues) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
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

      if (error) throw error;
      return data;
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

  const handleSubmit = (values: ServiceFormValues) => {
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, formData: values });
    } else {
      addServiceMutation.mutate(values);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setOpenAddService(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
  };

  return {
    services: services || [],
    isLoading,
    error: error as Error | null,
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    handleSubmit,
    handleEditService,
    handleDeleteService,
    isPendingAdd: addServiceMutation.isPending,
    isPendingUpdate: updateServiceMutation.isPending,
    isPendingDelete: deleteServiceMutation.isPending
  };
};
