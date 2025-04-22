
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useBusinessSubscribers = (businessId: string, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  
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
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!businessId
  });

  // Check if current user is subscribed to this business
  const { data: subscriptionData, isLoading: checkingSubscription } = useQuery({
    queryKey: ['isUserSubscribed', businessId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return { isSubscribed: false };
      }
      
      const { data, error } = await supabase
        .from('business_subscribers')
        .select('id')
        .eq('business_id', businessId)
        .eq('subscriber_id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found' error
        console.error("Error checking subscription:", error);
        throw error;
      }
      
      return { 
        isSubscribed: !!data,
        subscriptionId: data?.id
      };
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!businessId
  });

  // Subscribe to business
  const subscribe = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("Not authenticated");
      }
      
      const { data, error } = await supabase
        .from('business_subscribers')
        .insert({
          business_id: businessId,
          subscriber_id: session.user.id
        })
        .select('id')
        .single();
      
      if (error) {
        console.error("Error subscribing to business:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Subscribed",
        description: "You are now subscribed to this business."
      });
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers', businessId] });
      queryClient.invalidateQueries({ queryKey: ['isUserSubscribed', businessId] });
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to subscribe",
        description: error.message
      });
    }
  });

  // Unsubscribe from business
  const unsubscribe = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user || !subscriptionData?.subscriptionId) {
        throw new Error("Not authenticated or not subscribed");
      }
      
      const { error } = await supabase
        .from('business_subscribers')
        .delete()
        .eq('id', subscriptionData.subscriptionId);
      
      if (error) {
        console.error("Error unsubscribing from business:", error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Unsubscribed",
        description: "You have unsubscribed from this business."
      });
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers', businessId] });
      queryClient.invalidateQueries({ queryKey: ['isUserSubscribed', businessId] });
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to unsubscribe",
        description: error.message
      });
    }
  });

  return {
    subscribers,
    isLoading,
    subscriberCount: subscribers?.length || 0,
    isSubscribed: subscriptionData?.isSubscribed || false,
    checkingSubscription,
    subscribe,
    unsubscribe
  };
};
