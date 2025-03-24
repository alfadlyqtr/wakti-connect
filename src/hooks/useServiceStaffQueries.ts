
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/service.types";
import { toast } from "@/components/ui/use-toast";

export const useServiceStaffQueries = (serviceId?: string) => {
  // Query to fetch staff members assigned to a specific service
  const { 
    data: staffAssignments, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['staffServiceAssignments', serviceId],
    queryFn: async () => {
      try {
        if (!serviceId) return [];
        
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          throw new Error('Not authenticated');
        }
        
        // Get staff assigned to the service with a direct join to business_staff
        const { data, error } = await supabase
          .from('staff_service_assignments')
          .select(`
            staff_id,
            business_staff(id, name, role)
          `)
          .eq('service_id', serviceId);
          
        if (error) throw error;
        
        // Transform the data to match the StaffMember type
        const staffMembers: StaffMember[] = data.map(item => ({
          id: item.staff_id,
          name: item.business_staff?.name || 'Unknown',
          role: item.business_staff?.role || 'staff'
        }));
        
        return staffMembers;
      } catch (error) {
        console.error("Error fetching staff assignments:", error);
        toast({
          title: "Error fetching staff assignments",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!serviceId
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null
  };
};
