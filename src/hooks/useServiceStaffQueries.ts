
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      
      const { data, error } = await supabase
        .from('staff_service_assignments')
        .select(`
          staff_id,
          business_staff:staff_id(
            id,
            name,
            role
          )
        `)
        .eq('service_id', serviceId);
        
      if (error) throw error;
      
      return data.map(item => ({
        id: item.staff_id,
        name: item.business_staff?.name || 'Unknown',
        role: item.business_staff?.role || 'staff'
      }));
    },
    enabled: !!serviceId
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null
  };
};
