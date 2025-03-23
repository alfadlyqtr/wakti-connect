
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaffMember {
  id: string;
  name?: string;
  role?: string;
}

export const useServiceStaffQueries = (serviceId?: string) => {
  // Query to fetch staff members assigned to a specific service
  const { 
    data: staffAssignments, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['staffServiceAssignments', serviceId],
    queryFn: async () => {
      if (!serviceId) return [];
      
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // First get all the staff assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('staff_service_assignments')
        .select('staff_id')
        .eq('service_id', serviceId);
        
      if (assignmentsError) throw assignmentsError;
      
      if (!assignments || assignments.length === 0) {
        return [];
      }
      
      // Get the staff details for each assignment
      const staffIds = assignments.map(item => item.staff_id);
      
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('id, name, role')
        .in('id', staffIds);
        
      if (staffError) throw staffError;
      
      return staffData || [];
    },
    enabled: !!serviceId
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null
  };
};
