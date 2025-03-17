
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
            staff_id
          )
        `)
        .eq('service_id', serviceId);
        
      if (error) throw error;
      
      // After getting the staff assignments, fetch the profile data separately for each staff
      const enhancedData = await Promise.all(
        data.map(async (assignment) => {
          // Check if business_staff exists and has a staff_id
          if (!assignment.business_staff || !assignment.business_staff.staff_id) {
            return {
              id: assignment.id,
              serviceId: assignment.service_id,
              staffRelationId: assignment.staff_relation_id,
              staffId: null,
              staffName: 'Unknown'
            };
          }
          
          // Get profile information for this staff
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', assignment.business_staff.staff_id)
            .single();
            
          if (profileError) {
            console.error("Error fetching staff profile:", profileError);
            return {
              id: assignment.id,
              serviceId: assignment.service_id,
              staffRelationId: assignment.staff_relation_id,
              staffId: assignment.business_staff.staff_id,
              staffName: 'Unknown'
            };
          }
          
          return {
            id: assignment.id,
            serviceId: assignment.service_id,
            staffRelationId: assignment.staff_relation_id,
            staffId: assignment.business_staff.staff_id,
            staffName: profileData?.full_name || 'Unknown'
          };
        })
      );
      
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
