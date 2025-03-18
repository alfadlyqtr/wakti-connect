
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service.types";

export const useServiceQueries = () => {
  // Fetch services with staff assignments
  const { 
    data: services, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['businessServices'],
    queryFn: async () => {
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

      // Fetch service staff assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('staff_service_assignments')
        .select(`
          service_id,
          staff_id,
          business_staff:staff_id(
            id,
            name,
            role
          )
        `);

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
    }
  });

  return {
    services: services || [],
    isLoading,
    error: error as Error | null
  };
};
