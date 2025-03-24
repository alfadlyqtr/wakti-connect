
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/service.types";
import { toast } from "@/hooks/use-toast";

export const useServiceStaffQueries = (serviceId?: string) => {
  // Optimized query to fetch staff members assigned to a specific service
  const { 
    data: staffAssignments, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['staffServiceAssignments', serviceId],
    queryFn: async () => {
      try {
        if (!serviceId) return [];
        
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          throw new Error('Not authenticated');
        }
        
        console.log("Fetching staff assignments for service:", serviceId);
        
        // Use a simpler query structure to avoid TypeScript issues
        const { data, error } = await supabase
          .from('staff_service_assignments')
          .select(`
            staff_id,
            staff:business_staff(id, name, role, is_service_provider)
          `)
          .eq('service_id', serviceId);
          
        if (error) {
          console.error("Error fetching staff with assignments:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log("No staff assignments found for service", serviceId);
          return [];
        }
        
        console.log("Found staff details:", data?.length);
        
        // Transform the joined data to match the StaffMember type
        const staffMembers: StaffMember[] = data.map(item => ({
          id: item.staff.id,
          name: item.staff.name || 'Unknown',
          role: item.staff.role || 'staff'
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
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes for better performance
    gcTime: 1000 * 60 * 10 // Keep in cache for 10 minutes
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null,
    refetch
  };
};
