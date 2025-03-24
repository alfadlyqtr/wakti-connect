
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
        
        console.log("Fetching staff assignments for service:", serviceId);
        
        // Get staff assignments first - this gets the business_staff.id values
        const { data: assignments, error: assignmentError } = await supabase
          .from('staff_service_assignments')
          .select('staff_id') // This is business_staff.id
          .eq('service_id', serviceId);
          
        if (assignmentError) {
          console.error("Error fetching assignments:", assignmentError);
          throw assignmentError;
        }
        
        if (!assignments || assignments.length === 0) {
          console.log("No staff assignments found for service", serviceId);
          return [];
        }
        
        console.log("Found assignments:", assignments);
        
        // Extract staff IDs from assignments (these are business_staff.id values)
        const staffIds = assignments.map(assignment => assignment.staff_id);
        
        // Fetch staff data using these business_staff.id values
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id, name, role')
          .in('id', staffIds);
          
        if (staffError) {
          console.error("Error fetching staff data:", staffError);
          throw staffError;
        }
        
        if (!staffData || staffData.length === 0) {
          console.log("No staff data found for the assigned staff IDs");
          return [];
        }
        
        console.log("Found staff data:", staffData);
        
        // Transform the data to match the StaffMember type
        const staffMembers: StaffMember[] = staffData.map(staff => ({
          id: staff.id, // This is business_staff.id
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
