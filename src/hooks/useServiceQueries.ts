
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
        
        // Use a more efficient query with joins
        const { data, error } = await supabase
          .from('business_services')
          .select(`
            *,
            assigned_staff:staff_service_assignments(
              staff_id,
              business_staff:staff_id(id, name, role)
            )
          `)
          .eq('business_id', session.session.user.id)
          .order('name');
          
        if (error) {
          console.error("Error fetching services:", error);
          throw error;
        }

        console.log("Fetched services:", data?.length);
        
        // No services, return empty array
        if (!data || data.length === 0) {
          return [];
        }

        // Transform the data to match the Service type with assigned staff
        const servicesWithStaff = data.map((service) => {
          // Map the assigned staff from the joined data
          const assignedStaff = service.assigned_staff
            .map(assignment => {
              if (!assignment.business_staff) return null;
              
              return {
                id: assignment.staff_id, // This is business_staff.id
                name: assignment.business_staff.name || 'Unknown',
                role: assignment.business_staff.role || 'staff'
              };
            })
            .filter(Boolean) as StaffMember[];

          // Return the service with assigned staff
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
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10 // Keep in cache for 10 minutes
  });

  return {
    services: services || [],
    isLoading,
    error: error as Error | null,
    refetch
  };
};
