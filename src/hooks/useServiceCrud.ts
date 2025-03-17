
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service, ServiceFormValues } from "@/types/service.types";
import { toast } from "@/components/ui/use-toast";
import { useServiceStaffAssignments } from './useServiceStaffAssignments';

export const useServiceCrud = () => {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openAddService, setOpenAddService] = useState(false);
  const { assignStaffToService } = useServiceStaffAssignments();

  // Fetch services with staff assignments
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
      
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('business_services')
        .select('*')
        .order('name');
        
      if (servicesError) throw servicesError;

      // Fetch service staff assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('staff_service_assignments')
        .select(`
          service_id,
          staff_relation_id,
          business_staff(
            id,
            role,
            staff_id,
            profiles:staff_id(
              id,
              full_name
            )
          )
        `);

      if (assignmentsError) throw assignmentsError;

      // Map staff assignments to services
      const servicesWithStaff = servicesData.map((service: Service) => {
        const serviceAssignments = assignmentsData.filter(
          (assignment: any) => assignment.service_id === service.id
        );

        // Map staff assignments to staff members
        const assignedStaff = serviceAssignments.map((assignment: any) => ({
          id: assignment.business_staff.staff_id,
          name: assignment.business_staff.profiles.full_name,
          role: assignment.business_staff.role
        }));

        return {
          ...service,
          assigned_staff: assignedStaff
        };
      });

      return servicesWithStaff as Service[];
    }
  });

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
    services: services || [],
    isLoading,
    error: error as Error | null,
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  };
};
