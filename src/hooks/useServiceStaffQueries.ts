
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useServiceStaffQueries = (serviceId?: string) => {
  // Query to fetch all staff assignments for a specific service
  const { 
    data: staffAssignments, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['serviceStaffAssignments', serviceId],
    queryFn: async () => {
      if (!serviceId) return [];
      
      // Fetch staff assignments for the service
      const { data, error } = await supabase
        .from('staff_service_assignments')
        .select(`
          id,
          service_id,
          staff_relation_id,
          business_staff(
            id,
            staff_id,
            profiles:staff_id(
              id,
              full_name
            )
          )
        `)
        .eq('service_id', serviceId);
        
      if (error) throw error;
      
      // Map the data to a more usable format
      return data.map((assignment) => ({
        id: assignment.id,
        serviceId: assignment.service_id,
        staffRelationId: assignment.staff_relation_id,
        staffId: assignment.business_staff.staff_id,
        staffName: assignment.business_staff.profiles.full_name
      }));
    },
    enabled: !!serviceId // Only run the query if serviceId is provided
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null
  };
};
