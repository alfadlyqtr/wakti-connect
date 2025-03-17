
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
          staff_id,
          business_staff:staff_id(
            id,
            name,
            role
          )
        `)
        .eq('service_id', serviceId);
        
      if (error) throw error;
      
      // Map the data to a more usable format
      const enhancedData = data.map(assignment => {
        return {
          id: assignment.id,
          serviceId: assignment.service_id,
          staffId: assignment.staff_id,
          staffName: assignment.business_staff?.name || 'Unknown',
          staffRole: assignment.business_staff?.role || 'staff'
        };
      });
      
      return enhancedData;
    },
    enabled: !!serviceId // Only run the query if serviceId is provided
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null
  };
};
