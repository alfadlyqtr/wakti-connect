
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
        
        // First get staff assignments for this service
        const { data: assignments, error: assignmentError } = await supabase
          .from('staff_service_assignments')
          .select('staff_id')
          .eq('service_id', serviceId);
          
        if (assignmentError) throw assignmentError;
        
        if (!assignments || assignments.length === 0) {
          return [];
        }
        
        // Then fetch the actual staff data in a separate query
        const staffIds = assignments.map(assignment => assignment.staff_id);
        
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id, name, role')
          .in('id', staffIds);
          
        if (staffError) throw staffError;
        
        // Transform the data to match the StaffMember type
        const staffMembers: StaffMember[] = (staffData || []).map(staff => ({
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
    enabled: !!serviceId
  });

  return {
    staffAssignments: staffAssignments || [],
    isLoading,
    error: error as Error | null
  };
};
