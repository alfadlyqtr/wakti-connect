
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

        // Fetch service staff assignments with proper staff data
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('staff_service_assignments')
          .select(`
            service_id,
            staff_id,
            business_staff(
              id,
              name,
              role
            )
          `)
          .eq('service_id', servicesData.map(service => service.id))
          .throwOnError();

        if (assignmentsError) throw assignmentsError;

        // Map staff assignments to services
        const servicesWithStaff = servicesData.map((service: Service) => {
          const serviceAssignments = assignmentsData.filter(
            (assignment: any) => assignment.service_id === service.id
          );

          // Map staff assignments to staff members
          const assignedStaff = serviceAssignments.map((assignment: any) => ({
            id: assignment.staff_id,
            name: assignment.business_staff?.name || 'Unknown',
            role: assignment.business_staff?.role || 'staff'
          }));

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
