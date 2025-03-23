
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getGrowthTrendsData, getServiceDistributionData } from "@/utils/businessAnalyticsUtils";

type AnalyticsTimeRange = "week" | "month" | "year";

export interface BusinessAnalyticsData {
  subscriberCount: number;
  staffCount: number;
  taskCompletionRate: number;
  timeRange: AnalyticsTimeRange;
  growth: any[];
  serviceDistribution: any[];
}

export const useBusinessAnalytics = (timeRange: AnalyticsTimeRange = "month") => {
  return useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("Business analytics: No authenticated session");
          throw new Error('Not authenticated');
        }
        
        // Verify the user has a business account
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw new Error('Could not verify account type');
        }
        
        if (profileData?.account_type !== 'business') {
          console.warn("Non-business account attempting to access business analytics");
          throw new Error('Business account required');
        }
        
        // In a real application, this would fetch data from the backend
        // based on the selected time range
        const growthData = getGrowthTrendsData();
        const serviceData = getServiceDistributionData();
        
        // Ensure the data structure is correct
        if (!growthData || !growthData.datasets || !growthData.datasets[0] || !growthData.datasets[0].data) {
          console.error("Invalid growth data format:", growthData);
          throw new Error('Invalid growth data format');
        }
        
        if (!serviceData || !serviceData.datasets || !serviceData.datasets[0] || !serviceData.datasets[0].data) {
          console.error("Invalid service data format:", serviceData);
          throw new Error('Invalid service data format');
        }
        
        return {
          subscriberCount: 157,
          staffCount: 5,
          taskCompletionRate: 87,
          timeRange,
          growth: growthData.datasets[0].data,
          serviceDistribution: serviceData.datasets[0].data
        } as BusinessAnalyticsData;
      } catch (error) {
        console.error("Error in useBusinessAnalytics:", error);
        throw error;
      }
    },
    retry: 1, // Limit retries to avoid excessive API calls on failure
  });
};
