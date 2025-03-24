
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service.types";
import { toast } from "@/components/ui/use-toast";

export const useServiceQueries = () => {
  // Fetch services with staff assignments
  const { 
    data: services, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['businessServices'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          throw new Error('Not authenticated');
        }
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('business_services')
          .select('*')
          .order('name');
          
        if (servicesError) throw servicesError;

        // Fetch service staff assignments using a separate query
        // This avoids the join issue with staff_service_assignments and business_staff
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select('service_id, staff_id');

        if (assignmentsError) throw assignmentsError;

        // Fetch staff members for all assignments in one query
        const staffIds = [...new Set(assignmentsData.map(a => a.staff_id))];
        
        // Only fetch staff data if there are staff assignments
        let staffData = [];
        if (staffIds.length > 0) {
          const { data: staffMembers, error: staffError } = await supabase
            .from('business_staff')
            .select('id, name, role')
            .in('id', staffIds);
            
          if (staffError) throw staffError;
          staffData = staffMembers || [];
        }

        // Map staff assignments to services
        const servicesWithStaff = servicesData.map((service: Service) => {
          const serviceAssignments = assignmentsData.filter(
            (assignment: any) => assignment.service_id === service.id
          );

          // Map staff assignments to staff members
          const assignedStaff = serviceAssignments.map((assignment: any) => {
            const staffMember = staffData.find(staff => staff.id === assignment.staff_id);
            return {
              id: assignment.staff_id,
              name: staffMember?.name || 'Unknown',
              role: staffMember?.role || 'staff'
            };
          });

          return {
            ...service,
            assigned_staff: assignedStaff
          };
        });

        return servicesWithStaff as Service[];
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error fetching services",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        throw error;
      }
    }
  });

  return {
    services: services || [],
    isLoading,
    error: error as Error | null
  };
};
