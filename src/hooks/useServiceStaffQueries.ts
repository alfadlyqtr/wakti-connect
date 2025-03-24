
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/service.types";
import { toast } from "@/hooks/use-toast";

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
        
        // Directly join to get staff data with assignments in a single query
        const { data: assignments, error: assignmentError } = await supabase
          .from('staff_service_assignments')
          .select(`
            staff_id,
            staff:staff_id (
              id,
              name,
              role
            )
          `)
          .eq('service_id', serviceId);
          
        if (assignmentError) throw assignmentError;
        
        if (!assignments || assignments.length === 0) {
          return [];
        }
        
        // Transform the data to match the StaffMember type
        const staffMembers: StaffMember[] = assignments
          .filter(assignment => assignment.staff) // Filter out any nulls
          .map(assignment => ({
            id: assignment.staff_id,
            name: assignment.staff.name || 'Unknown',
            role: assignment.staff.role || 'staff'
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
