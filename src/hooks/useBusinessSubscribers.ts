
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";
import { BusinessSubscriberWithProfile } from "@/types/business.types";

export const useBusinessSubscribers = (businessId?: string) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const queryClient = useQueryClient();
  
  // Check if current user is subscribed to this business
  useEffect(() => {
    const checkSubscription = async () => {
      if (!businessId) {
        setIsSubscribed(false);
        setCheckingSubscription(false);
        return;
      }
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsSubscribed(false);
          setCheckingSubscription(false);
          return;
        }
        
        const { data, error } = await fromTable('business_subscribers')
          .select()
          .eq('business_id', businessId)
          .eq('subscriber_id', session.user.id)
          .single();
        
        if (data) {
          setIsSubscribed(true);
          setSubscriptionId(data.id);
        } else {
          setIsSubscribed(false);
          setSubscriptionId(null);
        }
      } catch (error) {
        setIsSubscribed(false);
        setSubscriptionId(null);
      } finally {
        setCheckingSubscription(false);
      }
    };
    
    checkSubscription();
  }, [businessId]);
  
  // Get business subscribers
  const { data: subscribers = [], isLoading, error } = useQuery({
    queryKey: ['businessSubscribers', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await fromTable('business_subscribers')
        .select(`
          *,
          profile:subscriber_id(display_name, full_name, avatar_url, account_type)
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching subscribers:", error);
        throw error;
      }
      
      return data as BusinessSubscriberWithProfile[];
    },
    enabled: !!businessId
  });
  
  // Calculate subscriber count from the subscribers array
  const subscriberCount = subscribers?.length || 0;
  
  // Subscribe mutation
  const subscribe = useMutation({
    mutationFn: async () => {
      if (!businessId) {
        throw new Error("Business ID is required");
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to subscribe");
      }
      
      const { data, error } = await fromTable('business_subscribers')
        .insert({
          business_id: businessId,
          subscriber_id: session.user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error subscribing to business:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      setIsSubscribed(true);
      setSubscriptionId(data.id);
      toast({
        title: "Subscribed successfully",
        description: "You are now subscribed to this business"
      });
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers', businessId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: error.message
      });
    }
  });
  
  // Unsubscribe mutation
  const unsubscribe = useMutation({
    mutationFn: async () => {
      if (!businessId || !subscriptionId) {
        throw new Error("Missing subscription information");
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to unsubscribe");
      }
      
      const { error } = await fromTable('business_subscribers')
        .delete()
        .eq('id', subscriptionId)
        .eq('subscriber_id', session.user.id);
      
      if (error) {
        console.error("Error unsubscribing from business:", error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      setIsSubscribed(false);
      setSubscriptionId(null);
      toast({
        title: "Unsubscribed successfully",
        description: "You have unsubscribed from this business"
      });
      queryClient.invalidateQueries({ queryKey: ['businessSubscribers', businessId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Unsubscribe failed",
        description: error.message
      });
    }
  });
  
  return {
    isSubscribed,
    subscriptionId,
    checkingSubscription,
    subscribers,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    subscriberCount // Add this to the returned object
  };
};
