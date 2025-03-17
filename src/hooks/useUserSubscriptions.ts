
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessSubscription } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";
import { fromTable } from "@/integrations/supabase/helper";

export const useUserSubscriptions = () => {
  const queryClient = useQueryClient();

  // Fetch businesses that the user is subscribed to
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['userSubscriptions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return [];
      }
      
      const { data, error } = await fromTable('business_subscribers')
        .select(`
          *,
          business_profile:business_id(
            id,
            business_name,
            display_name,
            full_name,
            avatar_url,
            account_type
          )
        `)
        .eq('subscriber_id', session.user.id);
      
      if (error) {
        console.error("Error fetching user subscriptions:", error);
        throw error;
      }

      // Transform the data to match our expected format
      const transformedData = data.map((item: any) => ({
        ...item,
        business_profile: item.business_profile || null
      }));
      
      return transformedData as BusinessSubscription[];
    }
  });

  // Get the count of subscriptions
  const subscriptionCount = subscriptions?.length || 0;

  // Unsubscribe from a business
  const unsubscribe = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await fromTable('business_subscribers')
        .delete()
        .eq('id', subscriptionId);
      
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
    subscriptions,
    subscriptionCount,
    isLoading,
    unsubscribe
  };
};
