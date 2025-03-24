
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
        
        // First, get the staff_id values from assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select('staff_id')
          .eq('service_id', serviceId);
          
        if (assignmentsError) {
          console.error("Error fetching staff assignments:", assignmentsError);
          throw assignmentsError;
        }
        
        if (!assignments || assignments.length === 0) {
          console.log("No staff assignments found for service", serviceId);
          return [];
        }
        
        // Get staff_ids from the assignments
        const staffIds = assignments.map(item => item.staff_id);
        
        // Then, fetch the actual staff details
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id, name, role')
          .in('id', staffIds);
          
        if (staffError) {
          console.error("Error fetching staff details:", staffError);
          throw staffError;
        }
        
        console.log("Found staff details:", staffData?.length);
        
        // Transform the data to match the StaffMember type
        const staffMembers: StaffMember[] = staffData.map(staff => ({
          id: staff.id,
          name: staff.name || 'Unknown',
          role: staff.role || 'staff'
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
