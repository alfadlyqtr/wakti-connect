
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessPageDataRecord } from "./useBusinessPageDataMutations";
import { BusinessPageData } from "@/components/business/page-builder/context/BusinessPageContext";
import { Json } from "@/types/supabase";

// Fetch business page data for the current user
export const useBusinessPageDataQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['businessPageData', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID provided for business page data query");
        return null;
      }
      
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
      
      if (!data) return null;
      
      try {
        // Convert the JSON page_data back to BusinessPageData type
        // Add validation to ensure page_data has the expected structure
        const pageData = data.page_data as unknown as BusinessPageData;
        
        // Ensure pageSetup exists and has default values if needed
        if (!pageData.pageSetup) {
          pageData.pageSetup = {
            businessName: "My Business",
            alignment: "center",
            visible: true
          };
        }
        
        // Log the processed data
        console.log("Processed business page data:", {
          id: data.id,
          pageSlug: data.page_slug,
          pageSetup: pageData.pageSetup
        });
        
        return {
          ...data,
          page_data: pageData
        } as BusinessPageDataRecord;
      } catch (parseError) {
        console.error("Error processing page data:", parseError);
        throw new Error("Failed to process page data");
      }
    },
    enabled: !!userId
  });
};
