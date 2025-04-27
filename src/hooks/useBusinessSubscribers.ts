
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BusinessSubscriberWithProfile } from "@/types/business.types";

export const useBusinessSubscribers = (businessId?: string) => {
  const queryClient = useQueryClient();

  // Fetch subscribers with profile data
  const { data: subscribers, isLoading, error } = useQuery({
    queryKey: ['businessSubscribers', businessId],
    queryFn: async () => {
      if (!businessId) {
        console.log("No business ID provided for subscribers query");
        return [];
      }
      
      console.log("Fetching subscribers for business:", businessId);
      
      const { data, error } = await supabase
        .from('business_subscribers')
        .select(`
          id,
          created_at,
          subscriber_id,
          profiles:subscriber_id (
            display_name,
            full_name,
            avatar_url,
            account_type
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching subscribers:", error);
        throw error;
      }

      // Map and clean up data to handle null profiles
      const transformedData = data.map(item => ({
        id: item.id,
        subscriber_id: item.subscriber_id,
        created_at: item.created_at,
        profile: {
          display_name: item.profiles?.display_name || null,
          full_name: item.profiles?.full_name || null,
          avatar_url: item.profiles?.avatar_url || null,
          account_type: item.profiles?.account_type || 'free'
        }
      }));
      
      console.log("Retrieved subscribers:", transformedData);
      return transformedData as BusinessSubscriberWithProfile[];
    },
    enabled: !!businessId,
    retry: 2
  });

  return {
    subscribers: subscribers || [],
    subscriberCount: subscribers?.length || 0,
    isLoading,
    error
  };
};
