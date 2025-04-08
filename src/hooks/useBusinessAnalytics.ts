
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getGrowthTrendsData, getServiceDistributionData } from "@/utils/businessAnalyticsUtils";
import { toast } from "@/components/ui/use-toast";

export type AnalyticsTimeRange = "week" | "month" | "year";

export interface BusinessAnalyticsData {
  subscriberCount: number;
  subscriberChangeText?: string;
  staffCount: number;
  staffChangeText?: string;
  taskCompletionRate: number;
  completionRateChangeText?: string;
  timeRange: AnalyticsTimeRange;
  growth: any[];
  serviceDistribution: any[];
}

export const useBusinessAnalytics = (timeRange: AnalyticsTimeRange = "month") => {
  return useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      try {
        console.log("Business analytics: Fetching data for timeRange:", timeRange);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("Business analytics: No authenticated session");
          throw new Error('Not authenticated');
        }
        
        // Verify the user has a business account
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type, business_name')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw new Error('Could not verify account type');
        }
        
        // Log the profile data for debugging
        console.log("Business analytics: User profile data:", profileData);
        
        // If not business account, return default values but don't show error toast
        // This allows business components to render safely for all users
        if (profileData?.account_type !== 'business') {
          console.warn("Non-business account accessing business analytics");
          
          const growthData = getGrowthTrendsData();
          const serviceData = getServiceDistributionData();
          
          return {
            subscriberCount: 0,
            subscriberChangeText: "",
            staffCount: 0,
            staffChangeText: "",
            taskCompletionRate: 0,
            completionRateChangeText: "",
            timeRange,
            growth: growthData.datasets[0].data,
            serviceDistribution: serviceData.datasets[0].data
          } as BusinessAnalyticsData;
        }
        
        // In a real application, this would fetch data from the backend
        // based on the selected time range
        const growthData = getGrowthTrendsData();
        const serviceData = getServiceDistributionData();
        
        // Log the chart data for debugging
        console.log("Business analytics: Growth data:", growthData);
        console.log("Business analytics: Service data:", serviceData);
        
        // Ensure the data structure is correct
        if (!growthData?.datasets?.[0]?.data) {
          console.error("Invalid growth data format:", growthData);
          throw new Error('Invalid growth data format');
        }
        
        if (!serviceData?.datasets?.[0]?.data) {
          console.error("Invalid service data format:", serviceData);
          throw new Error('Invalid service data format');
        }
        
        // Return the analytics data with all required fields
        console.log("Business analytics: Returning data successfully");
        return {
          subscriberCount: 0,
          subscriberChangeText: "",
          staffCount: 0,
          staffChangeText: "",
          taskCompletionRate: 0,
          completionRateChangeText: "",
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
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });
};
