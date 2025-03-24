
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
        
        // First, get basic service data
        const { data: servicesData, error: servicesError } = await supabase
          .from('business_services')
          .select('*')
          .eq('business_id', session.session.user.id)
          .order('name');
          
        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          throw servicesError;
        }

        if (!servicesData || servicesData.length === 0) {
          return [];
        }
        
        // Get the service IDs for the IN clause
        const serviceIds = servicesData.map(service => service.id);
        
        // Get all staff assignments for these services in a single query
        const { data: allAssignments, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select(`
            service_id,
            staff_id,
            business_staff!inner(id, name, role)
          `)
          .in('service_id', serviceIds);
          
        if (assignmentsError) {
          console.error("Error fetching staff assignments:", assignmentsError);
          // Continue without assignments rather than failing
        }
        
        // Group assignments by service_id
        const assignmentsByService: Record<string, StaffMember[]> = {};
        
        if (allAssignments) {
          allAssignments.forEach(assignment => {
            if (!assignmentsByService[assignment.service_id]) {
              assignmentsByService[assignment.service_id] = [];
            }
            
            assignmentsByService[assignment.service_id].push({
              id: assignment.business_staff.id,
              name: assignment.business_staff.name || 'Unknown',
              role: assignment.business_staff.role || 'staff'
            });
          });
        }
        
        // Map services with their assignments
        const servicesWithStaff = servicesData.map(service => ({
          ...service,
          assigned_staff: assignmentsByService[service.id] || []
        }));
        
        console.log("Fetched services with staff:", servicesWithStaff.length);
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
