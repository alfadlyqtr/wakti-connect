
import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useServiceStaffMutations = () => {
  const queryClient = useQueryClient();
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  
  // Mutation to assign staff members to a service
  const staffAssignmentMutation = useMutation({
    mutationFn: async ({ 
      serviceId, 
      staffIds 
    }: { 
      serviceId: string, 
      staffIds: string[] 
    }) => {
      // First, remove existing assignments for this service
      const { error: deleteError } = await supabase
        .from('staff_service_assignments')
        .delete()
        .eq('service_id', serviceId);
        
      if (deleteError) throw deleteError;
      
      if (staffIds.length === 0) return { message: "Staff assignments cleared" };
      
      // Create new assignments
      const assignments = staffIds.map(staffId => ({
        service_id: serviceId,
        staff_id: staffId
      }));
      
      const { data, error } = await supabase
        .from('staff_service_assignments')
        .insert(assignments)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['staffServiceAssignments', variables.serviceId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['businessServices'] 
      });
      toast({
        title: "Staff assignments updated",
        description: "The staff assignments for this service have been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff assignments",
        variant: "destructive"
      });
    }
  });

  const assignStaffToService = (serviceId: string, staffIds: string[]) => {
    staffAssignmentMutation.mutate({ serviceId, staffIds });
  };

  return {
    selectedStaff,
    setSelectedStaff,
    assignStaffToService,
    staffAssignmentMutation
  };
};
