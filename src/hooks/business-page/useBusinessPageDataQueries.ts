
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPageData } from "@/components/business/page-builder/simple-builder/types";
import { useUser } from "@/hooks/auth/useUser";

// Define the type directly here since the import was causing an error
type BusinessPageDataRecord = {
  id: string;
  user_id: string;
  page_slug?: string;
  page_data: BusinessPageData;
  created_at?: string;
  updated_at?: string;
};

export const useBusinessPageDataQuery = (userId?: string) => {
  const { user } = useUser();
  const effectiveUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['businessPageData', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) {
        console.log("No user ID provided for business page data query");
        return null;
      }
      
      console.log("Fetching business page data for user:", effectiveUserId);
      
      const { data, error } = await supabase
        .from('business_pages_data')
        .select('*')
        .eq('user_id', effectiveUserId)
        .order('created_at', { ascending: false })
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching business page data:", error);
        throw error;
      }
      
      console.log("Fetched business page data:", data);
      
      if (!data) {
        return null;
      }

      // Return the data as is, the component will handle default values
      return data as unknown as BusinessPageDataRecord;
    },
    enabled: !!effectiveUserId
  });
};
