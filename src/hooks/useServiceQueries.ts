
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service, StaffMember } from "@/types/service.types";
import { toast } from "@/hooks/use-toast";

export const useServiceQueries = () => {
  // Optimized to fetch services with staff assignments in a more efficient way
  const { 
    data: services, 
    isLoading, 
    error,
    refetch 
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

        // Get all service IDs to use in the assignments query
        const serviceIds = servicesData.map(service => service.id);
        
        // No services, return empty array
        if (serviceIds.length === 0) {
          return [];
        }

        // Fetch all assignments for these services in a single query
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select('service_id, staff:staff_id(id, name, role)')
          .in('service_id', serviceIds);

        if (assignmentsError) {
          console.error("Error fetching staff assignments:", assignmentsError);
          // Continue even if assignments fetch fails
        }

        // Map services with their assignments
        const servicesWithStaff = servicesData.map((service: Service) => {
          // Find all assignments for this service
          const serviceAssignments = assignmentsData?.filter(
            assignment => assignment.service_id === service.id
          ) || [];
          
          // Map staff data
          const assignedStaff = serviceAssignments.map(assignment => {
            if (!assignment.staff) return null;
            
            // Safely access staff properties with null checks
            const staffData = assignment.staff;
            return {
              id: staffData?.id || '',
              name: staffData?.name || 'Unknown',
              role: staffData?.role || 'staff'
            };
          }).filter(Boolean) as StaffMember[];

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
    error: error as Error | null,
    refetch
  };
};
