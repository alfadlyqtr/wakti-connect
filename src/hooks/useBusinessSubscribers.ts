
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessSubscriberWithProfile } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";
import { fromTable } from "@/integrations/supabase/helper";

export const useBusinessSubscribers = (businessId?: string) => {
  const queryClient = useQueryClient();

  // Fetch business subscribers with profiles
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['businessSubscribers', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await fromTable('business_subscribers')
        .select(`
          *,
          profiles:subscriber_id(
            display_name,
            full_name,
            avatar_url
          )
        `)
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching business subscribers:", error);
        throw error;
      }

      // Transform the data to match our expected format
      const transformedData = data.map((item: any) => ({
        ...item,
        profile: item.profiles || {
          display_name: null,
          full_name: null,
          avatar_url: null
        }
      }));
      
      return transformedData as BusinessSubscriberWithProfile[];
    },
    enabled: !!businessId
  });

  // Get subscriber count
  const subscriberCount = subscribers?.length || 0;

  // Subscribe to a business
  const subscribe = useMutation({
    mutationFn: async (businessIdToSubscribe: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to subscribe");
      }
      
      const { data, error } = await fromTable('business_subscribers')
        .insert({
          business_id: businessIdToSubscribe,
          subscriber_id: session.user.id,
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
        title: "Subscription successful",
        description: "You have successfully subscribed to this business."
      });
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers'] });
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

  // Unsubscribe from a business
  const unsubscribe = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await fromTable('business_subscribers')
        .delete({ id: subscriptionId });
      
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
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers'] });
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

  // Check if the current user is subscribed to a business
  const { data: subscriptionStatus, isLoading: checkingSubscription } = useQuery({
    queryKey: ['isUserSubscribed', businessId],
    queryFn: async () => {
      if (!businessId) return { subscribed: false, subscriptionId: null };
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { subscribed: false, subscriptionId: null };
      
      const { data, error } = await fromTable('business_subscribers')
        .select('id')
        .eq('business_id', businessId)
        .eq('subscriber_id', session.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found
          return { subscribed: false, subscriptionId: null };
        }
        console.error("Error checking subscription:", error);
        throw error;
      }
      
      return { subscribed: true, subscriptionId: data.id };
    },
    enabled: !!businessId
  });

  return {
    subscribers,
    subscriberCount,
    isLoading,
    subscribe,
    unsubscribe,
    isSubscribed: subscriptionStatus?.subscribed || false,
    subscriptionId: subscriptionStatus?.subscriptionId || null,
    checkingSubscription
  };
};
