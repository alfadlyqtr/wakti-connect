
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useServiceStaffMutations = () => {
  const queryClient = useQueryClient();

  // Mutation to assign staff to a service
  const assignStaffToService = async (serviceId: string, staffIds: string[]) => {
    // Get business_staff records for the selected staff IDs
    const { data: staffRelations, error: staffError } = await supabase
      .from('business_staff')
      .select('id, staff_id')
      .in('staff_id', staffIds);

    if (staffError) throw staffError;

    // Delete existing assignments
    const { error: deleteError } = await supabase
      .from('staff_service_assignments')
      .delete()
      .eq('service_id', serviceId);
      
    if (deleteError) throw deleteError;

    // Create new assignments if there are any
    if (staffIds.length > 0) {
      const assignments = staffRelations.map(relation => ({
        service_id: serviceId,
        staff_relation_id: relation.id
      }));

      if (assignments.length > 0) {
        const { error: assignError } = await supabase
          .from('staff_service_assignments')
          .insert(assignments);

        if (assignError) throw assignError;
      }
    }
  };

  // Mutation to manage staff assignments
  const staffAssignmentMutation = useMutation({
    mutationFn: async ({ serviceId, staffIds }: { serviceId: string, staffIds: string[] }) => {
      await assignStaffToService(serviceId, staffIds);
      return serviceId;
    },
    onSuccess: (serviceId) => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      queryClient.invalidateQueries({ queryKey: ['serviceStaffAssignments', serviceId] });
      toast({
        title: "Staff assignments updated",
        description: "Staff assignments have been updated successfully.",
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

  return {
    assignStaffToService,
    staffAssignmentMutation
  };
};
