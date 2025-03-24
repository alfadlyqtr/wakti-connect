
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
        console.log("Fetching business services");
        
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          throw new Error('Not authenticated');
        }
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('business_services')
          .select('*')
          .order('name');
          
        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          throw servicesError;
        }

        console.log("Fetched services:", servicesData?.length);

        // Get all service IDs to use in the assignments query
        const serviceIds = servicesData.map(service => service.id);
        
        // No services, return empty array
        if (serviceIds.length === 0) {
          return [];
        }

        // Fetch all assignments for these services in a single query
        // Using a simpler query approach that doesn't rely on direct relation
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select('service_id, staff_id')
          .in('service_id', serviceIds);

        if (assignmentsError) {
          console.error("Error fetching staff assignments:", assignmentsError);
          // Continue even if assignments fetch fails
        }

        console.log("Fetched assignments:", assignmentsData?.length);

        // If we have assignments, fetch staff data in a separate query
        let staffMap = new Map();
        
        if (assignmentsData && assignmentsData.length > 0) {
          const staffIds = [...new Set(assignmentsData.map(a => a.staff_id))];
          
          console.log("Fetching staff data for IDs:", staffIds);
          
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .select('id, name, role')
            .in('id', staffIds);
            
          if (staffError) {
            console.error("Error fetching staff data:", staffError);
          } else if (staffData) {
            console.log("Fetched staff data:", staffData.length);
            // Create a map of staff data by ID for easy lookup
            staffMap = new Map(staffData.map(staff => [staff.id, staff]));
          }
        }

        // Map services with their assignments
        const servicesWithStaff = servicesData.map((service: Service) => {
          // Find all assignments for this service
          const serviceAssignments = assignmentsData?.filter(
            assignment => assignment.service_id === service.id
          ) || [];
          
          // Map staff data using our staffMap
          const assignedStaff = serviceAssignments.map(assignment => {
            const staffData = staffMap.get(assignment.staff_id);
            
            if (!staffData) return null;
            
            return {
              id: assignment.staff_id,
              name: staffData.name || 'Unknown',
              role: staffData.role || 'staff'
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
