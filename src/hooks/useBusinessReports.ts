
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessReports = () => {
  const { data: subscriberCount, isLoading: subscribersLoading } = useQuery({
    queryKey: ['businessSubscribers'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: staffCount, isLoading: staffLoading } = useQuery({
    queryKey: ['businessStaffCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: serviceCount, isLoading: servicesLoading } = useQuery({
    queryKey: ['businessServiceCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_services')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });

  return {
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading
  };
};
