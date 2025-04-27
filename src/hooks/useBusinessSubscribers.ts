
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BusinessSubscriberWithProfile } from "@/types/business.types";
import { useAuth } from "@/hooks/useAuth";

export const useBusinessSubscribers = (businessId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = user?.id;

  // Fetch subscribers with profile data
  const { data: subscribers, isLoading, error } = useQuery({
    queryKey: ['businessSubscribers', businessId],
    queryFn: async () => {
      if (!businessId) {
        console.log("No business ID provided for subscribers query");
        return [];
      }
      
      console.log("Fetching subscribers for business:", businessId);
      
      try {
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
        const transformedData = data.map(item => {
          // Safely access profiles data with proper type definition
          const profileData = item.profiles || {
            display_name: null,
            full_name: null,
            avatar_url: null,
            account_type: 'free' as const
          };
          
          return {
            id: item.id,
            subscriber_id: item.subscriber_id,
            created_at: item.created_at,
            profile: {
              display_name: profileData.display_name || null,
              full_name: profileData.full_name || null,
              avatar_url: profileData.avatar_url || null,
              account_type: profileData.account_type || 'free'
            }
          };
        });
        
        console.log("Retrieved subscribers:", transformedData);
        return transformedData as BusinessSubscriberWithProfile[];
      } catch (err) {
        console.error("Failed to fetch subscribers:", err);
        throw err;
      }
    },
    enabled: !!businessId,
    retry: 2
  });

  // Check if current user is subscribed
  const checkingSubscription = isLoading;
  const isSubscribed = !!subscribers?.some(sub => sub.subscriber_id === currentUserId);

  // Subscribe mutation
  const subscribe = useMutation({
    mutationFn: async () => {
      if (!businessId || !currentUserId) {
        throw new Error("Missing business ID or user ID");
      }

      const { data, error } = await supabase
        .from('business_subscribers')
        .insert({
          business_id: businessId,
          subscriber_id: currentUserId
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error subscribing:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers', businessId] });
      toast({
        title: "Subscribed successfully",
        description: "You are now subscribed to updates from this business",
      });
    },
    onError: (error) => {
      console.error("Failed to subscribe:", error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Unsubscribe mutation
  const unsubscribe = useMutation({
    mutationFn: async () => {
      if (!businessId || !currentUserId) {
        throw new Error("Missing business ID or user ID");
      }

      const { error } = await supabase
        .from('business_subscribers')
        .delete()
        .eq('business_id', businessId)
        .eq('subscriber_id', currentUserId);

      if (error) {
        console.error("Error unsubscribing:", error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers', businessId] });
      toast({
        title: "Unsubscribed successfully",
        description: "You have unsubscribed from this business",
      });
    },
    onError: (error) => {
      console.error("Failed to unsubscribe:", error);
      toast({
        title: "Unsubscribe failed",
        description: "There was an error unsubscribing. Please try again.",
        variant: "destructive"
      });
    },
  });

  return {
    subscribers: subscribers || [],
    subscriberCount: subscribers?.length || 0,
    isLoading,
    error,
    isSubscribed,
    checkingSubscription,
    subscribe,
    unsubscribe
  };
};
