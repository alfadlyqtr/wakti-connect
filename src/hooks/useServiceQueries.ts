
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
        
        // Fetch staff assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select('service_id, staff_id')
          .in('service_id', serviceIds);
          
        if (assignmentsError) {
          console.error("Error fetching staff assignments:", assignmentsError);
          // Continue without assignments rather than failing
          return servicesData.map(service => ({
            ...service,
            assigned_staff: []
          })) as Service[];
        }
        
        // Get unique staff IDs from all assignments
        const staffIds = [...new Set(assignmentsData.map(a => a.staff_id))];
        
        // Only fetch staff details if there are staff assignments
        let staffDetails: Record<string, StaffMember> = {};
        
        if (staffIds.length > 0) {
          // Get staff details in a separate query
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .select('id, name, role')
            .in('id', staffIds);
            
          if (staffError) {
            console.error("Error fetching staff details:", staffError);
          } else if (staffData) {
            // Create a map of staff details by ID for easy lookup
            staffDetails = staffData.reduce((acc, staff) => {
              acc[staff.id] = {
                id: staff.id,
                name: staff.name || 'Unknown',
                role: staff.role || 'staff'
              };
              return acc;
            }, {} as Record<string, StaffMember>);
          }
        }
        
        // Group assignments by service_id
        const assignmentsByService: Record<string, StaffMember[]> = {};
        
        if (assignmentsData) {
          assignmentsData.forEach(assignment => {
            if (!assignmentsByService[assignment.service_id]) {
              assignmentsByService[assignment.service_id] = [];
            }
            
            const staffMember = staffDetails[assignment.staff_id];
            if (staffMember) {
              assignmentsByService[assignment.service_id].push(staffMember);
            }
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
