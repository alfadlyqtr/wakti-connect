
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
        
        // For each service, get staff assignments
        const servicesWithStaff = await Promise.all(servicesData.map(async (service) => {
          // Get staff assignments for this service
          const { data: assignments, error: assignmentsError } = await supabase
            .from('staff_service_assignments')
            .select('staff_id')
            .eq('service_id', service.id);
            
          if (assignmentsError) {
            console.error(`Error fetching assignments for service ${service.id}:`, assignmentsError);
            return { ...service, assigned_staff: [] };
          }
          
          if (!assignments || assignments.length === 0) {
            return { ...service, assigned_staff: [] };
          }
          
          // Get the staff IDs
          const staffIds = assignments.map(a => a.staff_id);
          
          // Fetch actual staff information
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .select('id, name, role')
            .in('id', staffIds);
            
          if (staffError) {
            console.error(`Error fetching staff details for service ${service.id}:`, staffError);
            return { ...service, assigned_staff: [] };
          }
          
          const assignedStaff: StaffMember[] = staffData ? staffData.map(staff => ({
            id: staff.id,
            name: staff.name || 'Unknown',
            role: staff.role || 'staff'
          })) : [];
          
          return { ...service, assigned_staff: assignedStaff };
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
