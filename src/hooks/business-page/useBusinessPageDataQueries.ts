
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessPageDataRecord } from "./useBusinessPageDataMutations";

// Fetch business page data for the current user
export const useBusinessPageDataQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['businessPageData', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("Fetching business page data for user:", userId);
      
      const { data, error } = await supabase
        .from('business_pages_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching business page data:", error);
        throw error;
      }
      
      console.log("Fetched business page data:", data);
      return data as BusinessPageDataRecord | null;
    },
    enabled: !!userId
  });
};
