
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
      console.log("Fetching business services...");
      const { data: sessionData } = await supabase.auth.getSession();
      
      console.log("Auth session exists:", !!sessionData.session, "User ID:", sessionData.session?.user?.id);
      
      if (!sessionData?.session?.user) {
        console.error("Not authenticated when fetching services");
        throw new Error('Not authenticated');
      }
      
      // Check user role
      const { data: userRoleData, error: roleError } = await supabase.rpc(
        "get_auth_user_account_type"
      );
  
      console.log("User role data:", userRoleData, "Error:", roleError);
      
      if (roleError) {
        console.error("Error checking user role:", roleError);
        throw new Error(`Failed to check user role: ${roleError.message}`);
      }
  
      if (userRoleData !== "business") {
        console.log("User is not a business account, role:", userRoleData);
        return [];
      }
      
      // Fetch services - using the correct table name business_services
      const { data: servicesData, error: servicesError } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', sessionData.session.user.id)
        .order('name');
        
      if (servicesError) {
        console.error("Error fetching services:", servicesError);
        throw servicesError;
      }

      console.log("Services fetched:", servicesData?.length || 0);

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

      if (assignmentsError) {
        console.error("Error fetching staff assignments:", assignmentsError);
        throw assignmentsError;
      }

      console.log("Staff assignments fetched:", assignmentsData?.length || 0);

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
