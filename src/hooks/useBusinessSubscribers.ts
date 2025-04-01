
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessSubscribers = (businessId: string) => {
  // Fetch subscribers for the business
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['businessSubscribers', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_subscribers')
        .select(`
          id,
          subscriber_id,
          created_at,
          profile:subscriber_id(
            id,
            full_name,
            display_name,
            avatar_url,
            account_type
          )
        `)
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching business subscribers:", error);
        throw error;
      }
      
      return data;
    }
  });

  return {
    subscribers,
    isLoading,
    subscriberCount: subscribers?.length || 0
  };
};
