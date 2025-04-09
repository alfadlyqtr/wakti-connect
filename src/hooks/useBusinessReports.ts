
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessReports = () => {
  const { data: subscriberCount, isLoading: subscribersLoading, error: subscribersError } = useQuery({
    queryKey: ['businessSubscribers'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          console.info("Not authenticated for subscriber count query");
          return null;
        }
        
        const { count, error } = await supabase
          .from('business_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.session.user.id);
          
        if (error) {
          console.error("Error fetching subscriber count:", error);
          throw error;
        }
        return count || 0;
      } catch (error) {
        console.error("Error in subscriber count query:", error);
        return null;
      }
    }
  });

  const { data: staffCount, isLoading: staffLoading, error: staffError } = useQuery({
    queryKey: ['businessStaffCount'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          console.info("Not authenticated for staff count query");
          return null;
        }
        
        const { count, error } = await supabase
          .from('business_staff')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.session.user.id);
          
        if (error) {
          console.error("Error fetching staff count:", error);
          throw error;
        }
        return count || 0;
      } catch (error) {
        console.error("Error in staff count query:", error);
        return null;
      }
    }
  });

  const { data: serviceCount, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['businessServiceCount'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          console.info("Not authenticated for service count query");
          return null;
        }
        
        const { count, error } = await supabase
          .from('business_services')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.session.user.id);
          
        if (error) {
          console.error("Error fetching service count:", error);
          throw error;
        }
        return count || 0;
      } catch (error) {
        console.error("Error in service count query:", error);
        return null;
      }
    }
  });

  const errors = [subscribersError, staffError, servicesError].filter(Boolean);
  
  return {
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading,
    errors: errors.length > 0 ? errors : null
  };
};
