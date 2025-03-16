
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessSubscriber, BusinessSubscriberWithProfile } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";

export const useBusinessSubscribers = (businessId?: string) => {
  const queryClient = useQueryClient();

  // Fetch all subscribers for a business
  const { data: subscribers, isLoading: subscribersLoading } = useQuery({
    queryKey: ['businessSubscribers', businessId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Use provided businessId or current user's ID
      const targetBusinessId = businessId || session.user.id;
      
      const { data, error } = await supabase
        .from('business_subscribers')
        .select(`
          *,
          profiles:subscriber_id (
            display_name,
            full_name,
            avatar_url
          )
        `)
        .eq('business_id', targetBusinessId);
      
      if (error) {
        console.error("Error fetching subscribers:", error);
        throw error;
      }
      
      return data as BusinessSubscriberWithProfile[];
    },
    enabled: !!businessId
  });

  // Check if user is subscribed to a business
  const { data: isSubscribed, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['isSubscribed', businessId],
    queryFn: async () => {
      if (!businessId) return false;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('business_subscribers')
        .select('id')
        .eq('business_id', businessId)
        .eq('subscriber_id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking subscription:", error);
        throw error;
      }
      
      return !!data;
    },
    enabled: !!businessId
  });

  // Subscribe to a business
  const subscribe = useMutation({
    mutationFn: async (businessId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to subscribe");
      }
      
      const { data, error } = await supabase
        .from('business_subscribers')
        .upsert({
          business_id: businessId,
          subscriber_id: session.user.id,
          status: 'active',
          subscription_date: new Date().toISOString()
        })
        .select()
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
        description: "You are now subscribed to this business"
      });
      queryClient.invalidateQueries({ queryKey: ['isSubscribed'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to subscribe",
        description: error.message
      });
    }
  });

  // Unsubscribe from a business
  const unsubscribe = useMutation({
    mutationFn: async (businessId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to unsubscribe");
      }
      
      const { error } = await supabase
        .from('business_subscribers')
        .delete()
        .eq('business_id', businessId)
        .eq('subscriber_id', session.user.id);
      
      if (error) {
        console.error("Error unsubscribing from business:", error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Unsubscribed",
        description: "You have unsubscribed from this business"
      });
      queryClient.invalidateQueries({ queryKey: ['isSubscribed'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to unsubscribe",
        description: error.message
      });
    }
  });

  // Get subscriber count for analytics
  const { data: subscriberCount, isLoading: countLoading } = useQuery({
    queryKey: ['subscriberCount', businessId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Use provided businessId or current user's ID
      const targetBusinessId = businessId || session.user.id;
      
      const { count, error } = await supabase
        .from('business_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', targetBusinessId);
      
      if (error) {
        console.error("Error fetching subscriber count:", error);
        throw error;
      }
      
      return count || 0;
    },
    enabled: !!businessId
  });

  return {
    subscribers,
    subscribersLoading,
    isSubscribed,
    subscriptionLoading,
    subscriberCount,
    countLoading,
    subscribe,
    unsubscribe,
    isLoading: subscribersLoading || subscriptionLoading || countLoading
  };
};
